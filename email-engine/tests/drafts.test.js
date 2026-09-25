const test = require('node:test');
const assert = require('node:assert/strict');
const { renderDraft, validateDraft } = require('../scripts/lib/drafts');
const { execute } = require('../scripts/bridge');
const welcome = require('../recipes/welcome');

test('recipe builds preserve styles and Klaviyo output', async () => {
  const result = await renderDraft({ title: 'Welcome build', brand: 'placeholder', theme: 'bold', recipe: 'welcome', data: welcome.previewData });
  assert.equal(result.theme, 'bold');
  assert.deepEqual(result.diagnostics.errors, []);
  assert.match(result.html, /\{% unsubscribe_link %\}/);
  assert.doesNotMatch(result.html, /<script/);
});
test('draft collections build from nodes without passing production validation', async () => {
  const draft = { title: 'SanEcoTec update', brand: 'sanecotec', nodes: [
    { component: 'email/header' }, { component: 'hero/text-only', data: { headline: 'Water monitoring update' } }, { component: 'email/footer' },
  ] };
  const result = await renderDraft(draft);
  assert.deepEqual(result.diagnostics.errors, []);
  assert.ok(result.diagnostics.warnings.some(warning => warning.includes('placeholder')));
  assert.match(result.html, /Water monitoring update/);
  assert.doesNotMatch(result.html, /example\.com/);
  await assert.rejects(renderDraft(draft, { mode: 'production' }), /complete real brand/);
});
test('incomplete compositions and invalid draft IDs fail checks', async () => {
  const result = await renderDraft({ title: 'Invalid email', brand: 'placeholder', nodes: [{ component: 'hero/text-only', data: { headline: 'Draft' } }] });
  assert.ok(result.diagnostics.errors.some(error => error.includes('unsubscribe')));
  assert.throws(() => validateDraft({ title: 'Missing content', brand: 'placeholder' }), /either a recipe/);
  assert.throws(() => validateDraft({ title: 'Bad path', brand: '../tokens/placeholder', nodes: [{}] }), /valid brand/);
  await assert.rejects(execute({ operation: 'render', kind: 'draft', id: '../../.env' }), /Unknown draft/);
});
test('collection workflow preserves block-only compositions', async () => {
  const catalog = await execute({ operation: 'collection', brand: 'sanecotec' });
  const block = catalog.blocks[0];
  const result = await execute({ operation: 'collection-render', brand: 'sanecotec', kind: 'blocks', id: block.id, theme: 'minimal' });
  assert.deepEqual(result.composition.nodes, block.nodes);
  assert.equal(result.composition.blockIds, undefined);
  assert.deepEqual(result.diagnostics.errors, []);
});
