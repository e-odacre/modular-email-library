const test = require('node:test');
const assert = require('node:assert');
const mjml2html = require('mjml');
const { loadRegistry } = require('../scripts/lib/registry');
const { createEnv } = require('../scripts/lib/render');
const { listThemes, loadThemeFile } = require('../scripts/lib/themes');
const { findDroppedTags } = require('../scripts/lib/checks');
const { loadTokenFile } = require('../scripts/lib/tokens');

const tokens = loadTokenFile('placeholder');
const registry = loadRegistry();

// Renders every component with its preview data into one email, so a theme is checked with a single compile.
function everything(theme) {
  const env = createEnv(tokens, { theme, registry });
  const parts = [];
  for (const entry of registry.all()) {
    const { data, settings = {} } = entry.meta.previewData;
    let fragment;
    try {
      fragment = env.componentApi.render(entry.id, data, { settings });
    } catch (err) {
      throw new Error(`theme "${theme}", component ${entry.id}: ${err.message}`);
    }
    parts.push(entry.meta.level === 'content' ? `<mj-section><mj-column>${fragment}</mj-column></mj-section>` : fragment);
  }
  return env.renderString('[% extends "layouts/base.mjml" %][% block body %][[ body ]][% endblock %]', { body: parts.join('\n') });
}

for (const theme of listThemes()) {
  test(`theme ${theme}: every component renders and the email compiles`, async () => {
    const mjml = everything(theme);
    const { html, errors } = await mjml2html(mjml, { validationLevel: 'strict', minify: false });
    assert.deepStrictEqual(errors, [], `${theme}: MJML errors`);
    assert.ok(!/\[%|\[\[|%\]|\]\]/.test(html), `${theme}: leftover Nunjucks delimiters`);
    assert.deepStrictEqual(findDroppedTags(mjml, html), [], `${theme}: dropped Klaviyo tags`);
    assert.ok(!/undefined|\[object Object\]/.test(mjml), `${theme}: undefined leaked into the output`);
    assert.ok(!/<img(?![^>]*\balt=)[^>]*>/i.test(html), `${theme}: an img without alt`);
  });
}

test('there is a theme for every style the design system promises', () => {
  const wanted = ['minimal', 'luxury', 'editorial', 'bold', 'playful', 'ecommerce', 'saas', 'wellness', 'fashion', 'christmas', 'black-friday', 'valentines', 'summer'];
  for (const name of wanted) assert.ok(listThemes().includes(name), `missing theme ${name}`);
});

test('a theme changes the styling but never the content or the structure of a component', () => {
  const entry = registry.get('commerce/product-card');
  const { data } = entry.meta.previewData;
  const outputs = {};
  for (const theme of ['minimal', 'luxury', 'playful']) {
    outputs[theme] = createEnv(tokens, { theme, registry }).componentApi.render(entry.id, data, { variant: 'default' });
  }
  for (const out of Object.values(outputs)) {
    assert.ok(out.includes('The Coastal Linen Shirt') && out.includes('$96.00'), 'same content in every theme');
    assert.strictEqual((out.match(/<mj-image/g) || []).length, 1, 'same structure');
  }
  assert.notStrictEqual(outputs.minimal, outputs.luxury);
  assert.notStrictEqual(outputs.minimal, outputs.playful);
});

test('themes are style-only: no theme file carries a color, font or brand value of its own', () => {
  for (const name of listThemes()) {
    const raw = JSON.stringify(loadThemeFile(name));
    assert.ok(!/#[0-9a-f]{3,8}\b/i.test(raw), `${name}: contains a hex color`);
    assert.ok(!/"overrides":\{[^}]*"(colors|fonts|logo|brand|images|dark)"/.test(raw), `${name}: overrides brand values`);
  }
});

test('theme component defaults pick a variant when the call site does not, and the call site still wins', () => {
  const data = registry.get('commerce/product-card').meta.previewData.data;
  const luxury = createEnv(tokens, { theme: 'luxury', registry }).componentApi;
  const byTheme = luxury.render('commerce/product-card', data);
  const explicit = luxury.render('commerce/product-card', data, { variant: 'default' });
  const themed = createEnv(tokens, { theme: 'luxury', registry }).componentApi.render('commerce/product-card', data, { variant: 'luxury' });
  assert.strictEqual(byTheme, themed, 'the luxury theme defaults product cards to the luxury variant');
  assert.notStrictEqual(byTheme, explicit, 'asking for default explicitly overrides the theme');
});

test('the build can produce every theme of the welcome flow', async () => {
  const { renderEmail } = require('../scripts/lib/render');
  const { runChecks } = require('../scripts/lib/checks');
  for (const theme of listThemes()) {
    const { html, mjml, mjmlErrors } = await renderEmail('flows/welcome.mjml', tokens, { theme, registry });
    assert.deepStrictEqual(mjmlErrors, [], theme);
    assert.deepStrictEqual(runChecks(html, 'placeholder', mjml).errors, [], theme);
  }
});
