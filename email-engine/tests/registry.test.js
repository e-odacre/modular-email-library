const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadRegistry, validateMeta, expandResponsive } = require('../scripts/lib/registry');
const { ROOT } = require('../scripts/lib/paths');

const registry = loadRegistry();

test('the registry loads every component and each has a template next to its metadata', () => {
  assert.ok(registry.all().length >= 5);
  for (const e of registry.all()) {
    assert.ok(fs.existsSync(path.join(ROOT, e.templatePath)), `${e.id} template`);
  }
});

test('every component template starts with a header comment covering Outlook, Gmail and dark mode', () => {
  for (const e of registry.all()) {
    const src = fs.readFileSync(path.join(ROOT, e.templatePath), 'utf8');
    const m = src.match(/^\s*\[#([\s\S]*?)#\]/);
    assert.ok(m, `${e.id}: template must start with a [# header comment #]`);
    for (const word of [/outlook/i, /gmail/i, /dark/i]) {
      assert.ok(word.test(m[1]), `${e.id}: header comment must cover ${word}`);
    }
  }
});

test('every component has realistic preview data, not placeholder text', () => {
  for (const e of registry.all()) {
    const text = JSON.stringify(e.meta.previewData);
    assert.ok(!/lorem|ipsum/i.test(text), `${e.id} preview data uses lorem ipsum`);
    assert.ok(!/"(Image|Button|Text|Title|Heading)"/.test(text), `${e.id} preview data has generic placeholder words`);
  }
});

test('bare names resolve when unique, ids always resolve, unknown names explain themselves', () => {
  assert.strictEqual(registry.get('button').id, 'content/button');
  assert.strictEqual(registry.get('content/button').id, 'content/button');
  assert.throws(() => registry.get('buton'), /No component "buton"/);
});

test('validateMeta reports missing pieces with the component id', () => {
  const problems = validateMeta('x/y', { name: 'Y' });
  assert.ok(problems.some((p) => p.includes('"description" is required')));
  assert.ok(problems.some((p) => p.includes('"level"')));
  assert.ok(problems.some((p) => p.includes('previewData.data')));
  assert.ok(problems.some((p) => p.includes('compat')));
});

test('validateMeta rejects unknown keys and settings without defaults', () => {
  const good = registry.get('button').meta;
  const problems = validateMeta('x/y', { ...good, colour: 1, settings: { a: { type: 'text' } } });
  assert.ok(problems.some((p) => p.includes('unknown metadata key "colour"')));
  assert.ok(problems.some((p) => p.includes('settings.a needs a default')));
});

test('responsive metadata expands into standard settings', () => {
  const s = expandResponsive({ mobileColumns: [1, 2], hideOnMobile: true });
  assert.deepStrictEqual(s.mobileColumns, { type: 'enum', values: [1, 2], default: 1 });
  assert.deepStrictEqual(s.hideOnMobile, { type: 'boolean', default: false });
  assert.ok(!('hideOnDesktop' in s));
});

test('a component with metadata but no template fails loading with a clear message', () => {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'reg-'));
  fs.mkdirSync(path.join(tmp, 'demo'));
  fs.writeFileSync(path.join(tmp, 'demo', 'x.meta.js'), 'module.exports = {}');
  assert.throws(() => loadRegistry({ dir: tmp }), /x\.meta\.js has no x\.njk/);
});
