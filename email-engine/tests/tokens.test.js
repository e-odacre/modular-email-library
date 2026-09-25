const test = require('node:test');
const assert = require('node:assert');
const { validateTokens, loadTokenFile, loadBrand } = require('../scripts/lib/tokens');
const { listBrands, listEmails } = require('../scripts/lib/paths');
const { renderEmail } = require('../scripts/lib/render');
const { runChecks } = require('../scripts/lib/checks');

const reference = loadTokenFile('placeholder');
const clone = () => JSON.parse(JSON.stringify(reference));

test('placeholder tokens are valid against themselves', () => {
  const { errors, placeholderIssues } = validateTokens('placeholder', reference, reference);
  assert.deepStrictEqual(errors, []);
  assert.deepStrictEqual(placeholderIssues, [], 'the placeholder brand may keep placeholders');
});

test('a missing key is an error, nothing is inherited from the placeholder', () => {
  const brand = clone();
  brand._placeholders = [];
  delete brand.colors.link;
  const { errors } = validateTokens('acme', brand, reference);
  assert.ok(errors.includes('missing token "colors.link"'));
});

test('an unknown key is an error (catches typos)', () => {
  const brand = clone();
  brand._placeholders = [];
  brand.colors.primry = '#000000';
  const { errors } = validateTokens('acme', brand, reference);
  assert.ok(errors.some((e) => e.includes('unknown token "colors.primry"')));
});

test('dark tokens are optional but must be complete when present', () => {
  const withoutDark = clone();
  withoutDark._placeholders = [];
  delete withoutDark.dark;
  assert.deepStrictEqual(validateTokens('acme', withoutDark, reference).errors, []);

  const partialDark = clone();
  partialDark._placeholders = [];
  delete partialDark.dark.logoUrl;
  assert.ok(validateTokens('acme', partialDark, reference).errors.includes('missing token "dark.logoUrl"'));
});

test('a non-placeholder brand with a non-empty _placeholders list is rejected', () => {
  const brand = clone();
  brand._placeholders = ['colors.primary'];
  const { placeholderIssues } = validateTokens('acme', brand, reference);
  assert.ok(placeholderIssues.some((i) => i.includes('colors.primary')));
});

test('a non-placeholder brand is rejected while it still points at placehold.co or example.com', () => {
  const brand = clone();
  brand._placeholders = [];
  const { placeholderIssues } = validateTokens('acme', brand, reference);
  assert.ok(placeholderIssues.some((i) => i.includes('logo.url')));
  assert.ok(placeholderIssues.some((i) => i.includes('logo.href')));
});

test('a fully real brand passes', () => {
  const brand = clone();
  brand._placeholders = [];
  brand.logo.url = 'https://cdn.acme.test/logo.png';
  brand.logo.href = 'https://acme.test';
  brand.images.hero = 'https://cdn.acme.test/hero.png';
  brand.dark.logoUrl = 'https://cdn.acme.test/logo-dark.png';
  assert.deepStrictEqual(validateTokens('acme', brand, reference), { errors: [], placeholderIssues: [] });
});

test('a "_placeholders" entry that names a non-existent token is an error', () => {
  const brand = clone();
  brand._placeholders = ['colors.nope'];
  assert.ok(validateTokens('placeholder', brand, reference).errors.some((e) => e.includes('colors.nope')));
});

test('type levels must point at real font and color roles', () => {
  const brand = clone();
  brand.type.h1.font = 'display';
  brand.type.h2.color = 'neon';
  const { errors } = validateTokens('placeholder', brand, reference);
  assert.ok(errors.some((e) => e.includes('type.h1.font') && e.includes('not a key of fonts')));
  assert.ok(errors.some((e) => e.includes('type.h2.color') && e.includes('not a key of colors')));
});

test('every typography level, spacing step, radius and shadow from the design system is defined', () => {
  const levels = ['display', 'h1', 'h2', 'h3', 'h4', 'body', 'bodyLarge', 'bodySmall', 'caption', 'eyebrow', 'price', 'salePrice', 'button'];
  for (const l of levels) assert.ok(reference.type[l], `type.${l}`);
  for (const k of ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']) assert.ok(reference.spacing[k], `spacing.${k}`);
  for (const k of ['none', 'small', 'medium', 'large', 'pill']) assert.ok(reference.radius[k], `radius.${k}`);
  for (const k of ['none', 'small', 'medium', 'large']) assert.ok(reference.shadow[k], `shadow.${k}`);
  for (const k of ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'mutedText', 'border', 'success', 'warning', 'error', 'white', 'black']) {
    assert.ok(reference.colors[k], `colors.${k}`);
    assert.ok(reference.dark.colors[k], `dark.colors.${k}`);
  }
});

test('tokens with a double quote are rejected because they end up in MJML attributes', () => {
  const brand = clone();
  brand.fonts.body = '"Helvetica Neue", Arial';
  assert.ok(validateTokens('placeholder', brand, reference).errors.some((e) => e.includes('double quote')));
});

test('every email builds cleanly for every brand that passes token validation', async () => {
  for (const brand of listBrands()) {
    const { tokens, errors, placeholderIssues } = loadBrand(brand);
    if (errors.length || placeholderIssues.length) continue; // unfinished brands fail the build on purpose
    for (const email of listEmails()) {
      const { html, mjml, mjmlErrors } = await renderEmail(`${email}.mjml`, tokens);
      assert.deepStrictEqual(mjmlErrors, [], `${brand}/${email} MJML errors`);
      assert.deepStrictEqual(runChecks(html, brand, mjml).errors, [], `${brand}/${email} check errors`);
    }
  }
});

test('dark tokens produce the dark-mode CSS and both logos, and dropping them removes it', async () => {
  const withDark = await renderEmail('flows/welcome.mjml', reference);
  assert.ok(withDark.html.includes('prefers-color-scheme: dark'));
  assert.ok(withDark.html.includes('logo-dark') && withDark.html.includes('logo-light'));

  const noDark = clone();
  delete noDark.dark;
  const without = await renderEmail('flows/welcome.mjml', noDark);
  assert.ok(!without.html.includes('prefers-color-scheme: dark'));
  assert.ok(!without.html.includes('logo-dark'), 'no dark logo image without dark.logoUrl');
});
