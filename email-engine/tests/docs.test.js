const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('node:child_process');
const mjml2html = require('mjml');
const { ROOT } = require('../scripts/lib/paths');
const { loadRegistry, validateMeta } = require('../scripts/lib/registry');
const { createEnv } = require('../scripts/lib/render');
const { resolveSettings } = require('../scripts/lib/style');
const { loadTokenFile } = require('../scripts/lib/tokens');
const { scaffold, NAME } = require('../scripts/new-component');
const { resolveTheme } = require('../scripts/lib/themes');

const registry = loadRegistry();
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');

test('the generated documentation and the README table are up to date (run npm run docs)', () => {
  const result = spawnSync(process.execPath, ['scripts/docs.js', '--check'], { cwd: ROOT, encoding: 'utf8' });
  assert.strictEqual(result.status, 0, result.stderr || result.stdout);
});

test('every component has a documentation page with the sections the brief asks for', () => {
  for (const e of registry.all()) {
    const page = read(`docs/components/${e.category}/${e.name}.md`);
    for (const heading of ['## Purpose', '## Required fields', '## Optional fields', '## Variants', '## Settings', '## Responsive behavior', '## Example usage']) {
      assert.ok(page.includes(heading), `${e.id}: docs page is missing "${heading}"`);
    }
    assert.ok(page.includes(e.meta.description), `${e.id}: purpose`);
    for (const variant of Object.keys(e.meta.variants)) assert.ok(page.includes(`**${variant}**`), `${e.id}: variant ${variant}`);
  }
});

test('every component has a row in the README compatibility table', () => {
  const readme = read('README.md');
  const table = readme.slice(readme.indexOf('<!-- components:start -->'), readme.indexOf('<!-- components:end -->'));
  for (const e of registry.all()) assert.ok(table.includes(`| \`${e.id}\` |`), `README is missing a row for ${e.id}`);
});

test('the hand-written guides exist and are linked from the docs index', () => {
  const index = read('docs/README.md');
  for (const guide of ['getting-started', 'architecture', 'tokens', 'component-metadata', 'themes-guide', 'variants-and-remix', 'responsive', 'recipes-guide', 'adding-a-component', 'rendering', 'testing', 'coverage', 'limitations']) {
    assert.ok(fs.existsSync(path.join(ROOT, 'docs', `${guide}.md`)), `docs/${guide}.md`);
    assert.ok(index.includes(`(${guide}.md)`), `docs index links ${guide}`);
  }
});

test('the docs never claim more than was tested: the limitations page says what was tried and what was not', () => {
  const page = read('docs/limitations.md');
  assert.ok(/Gmail on the web, on a desktop, in light mode/.test(page));
  assert.ok(/Not yet seen: Apple Mail, Outlook desktop/.test(page));
  assert.ok(/any dark mode/.test(page));
});

for (const level of ['content', 'section']) {
  test(`a scaffolded ${level}-level component is valid, documented, renders and compiles as generated`, async () => {
    const { njk, meta } = scaffold('demo', 'sample-block', level);
    const mod = { exports: {} };
    new Function('module', 'require', meta)(mod, (p) => require(path.join(ROOT, 'components', 'demo', p)));
    assert.deepStrictEqual(validateMeta('demo/sample-block', mod.exports), []);
    assert.ok(/outlook/i.test(njk) && /gmail/i.test(njk) && /dark/i.test(njk), 'header comment covers the three limits');

    const tokens = loadTokenFile('placeholder');
    const env = createEnv(tokens);
    const entry = { id: 'demo/sample-block', meta: { ...mod.exports, settings: { ...mod.exports.settings } } };
    for (const key of ['hideOnMobile', 'hideOnDesktop']) entry.meta.settings[key] = { type: 'boolean', default: false };
    const { s, variant } = resolveSettings(entry, { theme: resolveTheme(), settings: {}, tokens });
    const fragment = env.renderString(njk, { data: mod.exports.previewData.data, s, variant, cls: '' });
    const body = level === 'content' ? `<mj-section><mj-column>${fragment}</mj-column></mj-section>` : fragment;
    const mjml = env.renderString('[% extends "layouts/base.mjml" %][% block body %][[ body ]][% endblock %]', { body });
    const { errors } = await mjml2html(mjml, { validationLevel: 'strict' });
    assert.deepStrictEqual(errors, []);
  });
}

test('scaffold names must be lowercase words joined by hyphens', () => {
  for (const ok of ['gift-card', 'hero', 'a1-b2']) assert.ok(NAME.test(ok), ok);
  for (const bad of ['GiftCard', 'gift_card', '-x', 'x-', 'gift card']) assert.ok(!NAME.test(bad), bad);
});
