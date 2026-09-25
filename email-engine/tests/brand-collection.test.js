const test = require('node:test');
const assert = require('node:assert/strict');
const { loadCollection, validateCatalog, composeItem, renderCollectionItem } = require('../scripts/lib/brand-collection');
const { listBrands, listEmails } = require('../scripts/lib/paths');
const { validateTokens, loadTokenFile } = require('../scripts/lib/tokens');
const collection = loadCollection('sanecotec');

test('draft collection stays separate from production brands and global email discovery', () => {
  assert.ok(!listBrands().includes('sanecotec'));
  assert.ok(listEmails().every((id) => !id.includes('sanecotec')));
  assert.ok(collection.placeholderIssues.length > 0);
  assert.ok(validateTokens('sanecotec', collection.tokens, loadTokenFile('placeholder')).placeholderIssues.length > 0);
  assert.throws(() => loadCollection('../sanecotec'), /Invalid brand/);
  assert.throws(() => loadCollection('sanecotec/../../tokens'), /Invalid brand/);
});

test('catalog refuses ambiguous IDs, missing references, and broken email frames', () => {
  let catalog = structuredClone(collection.catalog);
  catalog.blocks.push(catalog.blocks[0]);
  assert.throws(() => validateCatalog(catalog), /Duplicate/);
  catalog = structuredClone(collection.catalog);
  catalog.emails[0].blockIds[1] = 'missing-block';
  assert.throws(() => validateCatalog(catalog), /unknown block/);
  catalog = structuredClone(collection.catalog);
  catalog.emails[0].blockIds.pop();
  assert.throws(() => validateCatalog(catalog), /header and end with a footer/);
  assert.throws(() => composeItem(collection, 'other', 'welcome'), /Unknown collection kind/);
  assert.throws(() => composeItem(collection, 'emails', 'missing'), /Unknown emails/);
});

test('composition is a copy and includes exactly the chosen brand frame', () => {
  const before = JSON.stringify(collection.catalog);
  const result = composeItem(collection, 'emails', 'welcome');
  assert.deepEqual(result.blockIds, collection.catalog.emails.find((e) => e.id === 'welcome').blockIds);
  result.nodes[0].data.changed = true;
  assert.equal(JSON.stringify(collection.catalog), before);
  const header = composeItem(collection, 'blocks', 'header-center');
  assert.equal(header.blockIds.filter((id) => id.startsWith('header-')).length, 1);
  const footer = composeItem(collection, 'blocks', 'footer-resources');
  assert.equal(footer.blockIds.filter((id) => id.startsWith('footer-')).length, 1);
});

for (const theme of collection.catalog.themes) {
  test(`SanEcoTec blocks and emails compile with preserved tags, alt text, and size budget (${theme})`, async () => {
    for (const kind of ['blocks', 'emails']) {
      for (const item of collection.catalog[kind]) {
        const result = await renderCollectionItem(collection, kind, item.id, theme);
        assert.ok(result.bytes < 102 * 1024, `${item.id} exceeds the Gmail clipping budget`);
        assert.ok(!/<img(?![^>]*\balt=)[^>]*>/i.test(result.html), `${item.id}: missing alt text`);
        // MJML itself emits empty classes in Outlook conditional tables; check our source.
        assert.ok(!/class=""/.test(result.mjml), `${item.id}: empty class in source`);
        assert.ok(!/example\.com|placehold\.co/.test(result.html), `${item.id}: placeholder assets leaked`);
        assert.ok(result.html.includes('{% unsubscribe_link %}'));
        assert.ok(result.html.includes('{{ organization.full_address }}'));
      }
    }
  });
}
