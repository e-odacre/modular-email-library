const test = require('node:test');
const assert = require('node:assert');
const { loadRegistry } = require('../scripts/lib/registry');
const {
  DEFAULT_THEME, listThemes, loadThemeFile, validateTheme, validateAllThemes, applyTheme, resolveTheme,
} = require('../scripts/lib/themes');
const { loadTokenFile } = require('../scripts/lib/tokens');
const { resolveRef } = require('../scripts/lib/style');
const { typoAttrs } = require('../scripts/lib/typography');
const { renderComponent, createEnv } = require('../scripts/lib/render');

const registry = loadRegistry();
const tokens = loadTokenFile('placeholder');
const reference = loadThemeFile(DEFAULT_THEME);
const clone = (o) => JSON.parse(JSON.stringify(o));
const problems = (theme) => validateTheme('t', theme, { reference, tokens, registry });

test('every theme in themes/ is valid', () => {
  for (const { name, errors } of validateAllThemes(registry)) assert.deepStrictEqual(errors, [], `theme ${name}`);
  assert.ok(listThemes().includes(DEFAULT_THEME));
});

test('a theme missing a style key is rejected, nothing is inherited from minimal', () => {
  const theme = clone(reference);
  delete theme.button.radius;
  assert.ok(problems(theme).some((e) => e.includes('missing "button.radius"')));
});

test('an unknown style key is rejected (catches typos)', () => {
  const theme = clone(reference);
  theme.button.raduis = '@radius.small';
  assert.ok(problems(theme).some((e) => e.includes('unknown key "button.raduis"')));
});

test('themes are style-only: overriding colors, fonts or brand values is rejected', () => {
  for (const group of ['colors', 'fonts', 'logo', 'brand']) {
    const theme = clone(reference);
    theme.overrides = { [group]: { primary: '#FF0000' } };
    assert.ok(problems(theme).some((e) => e.includes(`overrides.${group} is not allowed`) && e.includes('style-only')), group);
  }
});

test('overrides must match real brand tokens', () => {
  const theme = clone(reference);
  theme.overrides = { type: { h9: { size: '10px' } } };
  assert.ok(problems(theme).some((e) => e.includes('overrides.type.h9.size does not match a brand token')));
});

test('overrides can only point type levels at real font and color roles', () => {
  const theme = clone(reference);
  theme.overrides = { type: { h1: { font: 'display', color: 'neon' } } };
  const errs = problems(theme);
  assert.ok(errs.some((e) => e.includes('"display" is not a font role')));
  assert.ok(errs.some((e) => e.includes('"neon" is not a color role')));
});

test('references that do not resolve are rejected', () => {
  const theme = clone(reference);
  theme.card.background = '@colors.nope';
  theme.badge.radius = '@theme.badge.nope';
  const errs = problems(theme);
  assert.ok(errs.some((e) => e.includes('"@colors.nope"')));
  assert.ok(errs.some((e) => e.includes('"@theme.badge.nope"')));
});

test('component defaults must name a real component, variant and setting', () => {
  const theme = clone(reference);
  theme.components = {
    'nope/thing': { variant: 'x' },
    'content/button': { variant: 'neon', settings: { wobble: '1px' } },
  };
  const errs = problems(theme);
  assert.ok(errs.some((e) => e.includes('"nope/thing" is not a component id')));
  assert.ok(errs.some((e) => e.includes('variant "neon" does not exist')));
  assert.ok(errs.some((e) => e.includes('settings.wobble is not a setting')));
});

test('double quotes in theme values are rejected', () => {
  const theme = clone(reference);
  theme.button.innerPadding = '"14px"';
  assert.ok(problems(theme).some((e) => e.includes('double quote')));
});

test('applyTheme merges scale overrides without touching the brand or mutating the input', () => {
  const theme = clone(reference);
  theme.overrides = { type: { h1: { weight: '300', transform: 'uppercase' } }, radius: { medium: '12px' } };
  const before = JSON.stringify(tokens);
  const out = applyTheme(tokens, theme);
  assert.strictEqual(out.type.h1.weight, '300');
  assert.strictEqual(out.type.h1.size, tokens.type.h1.size, 'unspecified keys keep the brand value');
  assert.strictEqual(out.radius.medium, '12px');
  assert.deepStrictEqual(out.colors, tokens.colors);
  assert.deepStrictEqual(out.fonts, tokens.fonts);
  assert.strictEqual(JSON.stringify(tokens), before, 'input tokens untouched');
});

test('resolveTheme accepts a name, an object, or nothing', () => {
  assert.strictEqual(resolveTheme().name, reference.name);
  assert.strictEqual(resolveTheme('minimal').name, reference.name);
  assert.strictEqual(resolveTheme(reference), reference);
  assert.throws(() => resolveTheme('nope'), /No theme "nope"/);
});

test('token references: single, multi-part, nested and theme-rooted', () => {
  const errors = [];
  const ctx = { tokens, theme: reference };
  assert.strictEqual(resolveRef('@colors.primary', ctx, 'x', errors), tokens.colors.primary);
  assert.strictEqual(resolveRef('1px solid @colors.border', ctx, 'x', errors), `1px solid ${tokens.colors.border}`);
  assert.strictEqual(resolveRef('@theme.button.radius', ctx, 'x', errors), tokens.radius.medium, 'theme ref resolves through to a token');
  assert.strictEqual(resolveRef('@spacing.md @spacing.lg', ctx, 'x', errors), `${tokens.spacing.md} ${tokens.spacing.lg}`);
  assert.strictEqual(resolveRef('hello@example.com', ctx, 'x', errors), 'hello@example.com', 'an @ inside a word is not a reference');
  assert.deepStrictEqual(errors, []);
});

test('unknown and circular references are errors, not silent blanks', () => {
  const errors = [];
  assert.strictEqual(resolveRef('@colors.nope', { tokens, theme: reference }, 'x', errors), undefined);
  assert.ok(errors[0].includes('does not exist'));

  const loop = { ...reference, button: { ...reference.button, radius: '@theme.button.radius' } };
  const errors2 = [];
  assert.strictEqual(resolveRef('@theme.button.radius', { tokens, theme: loop }, 'x', errors2), undefined);
  assert.ok(errors2[0].includes('circular'));
});

test('typo() reads a level from the tokens and honors overrides', () => {
  const h2 = typoAttrs(tokens, 'h2');
  assert.ok(h2.includes(`font-family="${tokens.fonts.heading}"`) && h2.includes('font-size="22px"') && h2.includes(`color="${tokens.colors.text}"`));
  const custom = typoAttrs(tokens, 'h2', { color: 'primaryText', size: '40px', transform: undefined });
  assert.ok(custom.includes(`color="${tokens.colors.primaryText}"`) && custom.includes('font-size="40px"') && custom.includes('text-transform="none"'));
  assert.ok(typoAttrs(tokens, 'h2', { color: '#FF00AA' }).includes('color="#FF00AA"'));
  assert.throws(() => typoAttrs(tokens, 'h9'), /no such typography level/);
  assert.throws(() => typoAttrs(tokens, 'h2', { colour: 'x' }), /unknown override "colour"/);
});

test('the theme drives styling: a component picks up theme groups and type overrides', async () => {
  const pill = clone(reference);
  pill.button.radius = '@radius.pill';
  pill.overrides = { type: { button: { transform: 'uppercase', letterSpacing: '2px' } } };
  const plain = await renderComponent('button', tokens);
  const themed = await renderComponent('button', tokens, { theme: pill });
  assert.ok(plain.fragment.includes('border-radius:4px') || plain.fragment.includes('border-radius="4px"'));
  assert.ok(themed.fragment.includes('999px'));
  assert.ok(themed.fragment.includes('text-transform="uppercase"') && themed.fragment.includes('letter-spacing="2px"'));
});

test('a theme can set the default variant and settings for a component, the call site still wins', () => {
  const theme = clone(reference);
  theme.components = { 'content/button': { variant: 'outline', settings: { align: 'left' } } };
  const env = createEnv(tokens, { theme });
  const data = { label: 'Go', href: 'https://a.test' };
  const out = env.componentApi.render('button', data);
  assert.ok(out.includes('border="2px solid') && out.includes('align="left"'));
  const explicit = env.componentApi.render('button', data, { variant: 'default', settings: { align: 'right' } });
  assert.ok(!explicit.includes('border="') && explicit.includes('align="right"'));
});

test('a theme card shadow must name a real shadow level', () => {
  const theme = clone(reference);
  theme.card.shadow = 'huge';
  assert.ok(problems(theme).some((e) => e.includes('card.shadow "huge" must be one of')));
});

test('shadows are real: the card variant adds a shadow class and the base layout defines it from the brand scale', async () => {
  const summer = createEnv(tokens, { theme: 'summer' }).componentApi.render('layout/section', { content: '<mj-text>x</mj-text>' }, { variant: 'card' });
  assert.ok(summer.includes('shadow-medium'), 'the summer theme uses a medium card shadow');
  const minimal = createEnv(tokens).componentApi.render('layout/section', { content: '<mj-text>x</mj-text>' }, { variant: 'card' });
  assert.ok(!minimal.includes('shadow-'), 'the minimal theme has none');
  const { html } = await renderComponent('layout/section', tokens, { variant: 'card', theme: 'summer' });
  assert.ok(html.includes(`.shadow-medium { box-shadow: ${tokens.shadow.medium}; }`));
});
