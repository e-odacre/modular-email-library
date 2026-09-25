const test = require('node:test');
const assert = require('node:assert');
const { loadRegistry } = require('../scripts/lib/registry');
const { renderComponent, createEnv } = require('../scripts/lib/render');
const { findDroppedTags } = require('../scripts/lib/checks');
const { loadTokenFile } = require('../scripts/lib/tokens');

const tokens = loadTokenFile('placeholder');
const registry = loadRegistry();

// Structural checks that apply to every rendered component.
function assertClean(id, label, result) {
  assert.deepStrictEqual(result.mjmlErrors, [], `${label}: MJML errors`);
  assert.ok(!/\[%|\[\[|%\]|\]\]/.test(result.html), `${label}: leftover Nunjucks delimiters`);
  assert.deepStrictEqual(findDroppedTags(result.mjml, result.html), [], `${label}: dropped Klaviyo tags`);
  assert.ok(!/<img(?![^>]*\balt=)[^>]*>/i.test(result.html), `${label}: <img> without alt`);
  assert.ok(!/class=""/.test(result.fragment), `${label}: empty class attribute`);
  assert.ok(!/undefined|\[object Object\]/.test(result.fragment), `${label}: undefined leaked into output`);
}

for (const entry of registry.all()) {
  test(`${entry.id}: every variant renders and compiles with its preview data`, async () => {
    for (const variant of Object.keys(entry.meta.variants)) {
      const result = await renderComponent(entry.id, tokens, { variant });
      assertClean(entry.id, `${entry.id} [${variant}]`, result);
    }
  });
}

test('missing required data fails with the component, the field and the reason', () => {
  const env = createEnv(tokens);
  assert.throws(() => env.componentApi.render('hero/full-bleed', {}), /component "hero\/full-bleed":\s+heading is required/);
  assert.throws(() => env.componentApi.render('button', { label: 'Go' }), /href is required/);
});

test('every problem is reported at once, including unknown fields', () => {
  const env = createEnv(tokens);
  assert.throws(
    () => env.componentApi.render('button', { colour: 'red' }),
    (err) => /label is required/.test(err.message) && /href is required/.test(err.message) && /colour is not a known field/.test(err.message),
  );
});

test('optional data can be left out', async () => {
  const result = await renderComponent('hero/full-bleed', tokens, { data: { heading: 'Just a heading' } });
  assertClean('hero/full-bleed', 'minimal hero', result);
  assert.ok(!result.fragment.includes('<mj-button'));
});

test('unknown variants and settings are rejected with the valid choices listed', () => {
  const env = createEnv(tokens);
  const data = { label: 'Go', href: 'https://a.test' };
  assert.throws(() => env.componentApi.render('button', data, { variant: 'neon' }), /no variant "neon"\. Available: default, outline, subtle/);
  assert.throws(() => env.componentApi.render('button', data, { settings: { wobble: 1 } }), /setting "wobble" is not a known setting/);
  assert.throws(() => env.componentApi.render('button', data, { settings: { align: 'middle' } }), /setting "align" must be left, center or right/);
});

test('settings can reference tokens with @, and unknown tokens are an error', () => {
  const env = createEnv(tokens);
  const data = { label: 'Go', href: 'https://a.test' };
  const ok = env.componentApi.render('button', data, { settings: { background: '@colors.link' } });
  assert.ok(ok.includes(`background-color="${tokens.colors.link}"`));
  assert.throws(() => env.componentApi.render('button', data, { settings: { background: '@colors.nope' } }), /token "@colors\.nope"/);
});

test('a variant changes styling but not the data or the structure', async () => {
  const solid = await renderComponent('button', tokens, { variant: 'default' });
  const outline = await renderComponent('button', tokens, { variant: 'outline' });
  assert.ok(solid.fragment.includes('Shop the collection') && outline.fragment.includes('Shop the collection'));
  assert.notStrictEqual(solid.fragment, outline.fragment);
  assert.ok(outline.fragment.includes('border="2px solid'));
  assert.ok(!solid.fragment.includes('border="'));
});

test('responsive settings add the visibility classes', () => {
  const env = createEnv(tokens);
  const hidden = env.componentApi.render('text-block', { body: '<p>Hi</p>' }, { settings: { hideOnMobile: true } });
  assert.ok(hidden.includes('hide-mobile'));
  const shown = env.componentApi.render('text-block', { body: '<p>Hi</p>' });
  assert.ok(!shown.includes('hide-mobile') && !shown.includes('hide-desktop'));
});

test('components nest: text-block renders a button through c()', () => {
  const env = createEnv(tokens);
  const out = env.componentApi.render('text-block', { body: '<p>Hi</p>', cta: { label: 'Go', href: 'https://a.test' } });
  assert.ok(out.includes('<mj-button'));
});

test('Klaviyo tags in data survive into the component output', () => {
  const env = createEnv(tokens);
  const out = env.componentApi.render('text-block', {
    heading: "Hi {{ first_name|default:'there' }},",
    body: '<p>Order {{ event.extra.order_id }}</p>',
    cta: { label: 'View order', href: '{{ event.extra.order_url }}' },
  });
  for (const tag of ["{{ first_name|default:'there' }}", '{{ event.extra.order_id }}', '{{ event.extra.order_url }}']) {
    assert.ok(out.includes(tag), tag);
  }
});
