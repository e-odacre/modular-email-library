const test = require('node:test');
const assert = require('node:assert/strict');
const { execute } = require('../scripts/bridge');

test('Laravel inventory discovers every migrated library and draft collection', async () => {
  const result = await execute({ operation: 'inventory' });
  assert.equal(result.components.length, 116);
  assert.equal(result.recipes.length, 12);
  assert.equal(result.sections.length, 11);
  assert.equal(result.themes.length, 13);
  assert.equal(result.emails.length, 3);
  assert.deepEqual(result.brands, ['placeholder']);
  assert.equal(result.collections[0].blocks, 48);
  assert.equal(result.collections[0].emails, 12);
});

test('bridge returns clean email output with Klaviyo tags and separate diagnostics', async () => {
  const result = await execute({ operation: 'render', kind: 'email', id: 'flows/welcome' });
  assert.equal(result.diagnostics.errors.length, 0);
  assert.match(result.html, /\{% unsubscribe_link %\}/);
  assert.match(result.html, /\{\{ organization.full_address \}\}/);
  assert.doesNotMatch(result.html, /EventSource|studio\.js|class="warn"/);
});

test('component fragment diagnostics do not prevent a preview', async () => {
  const result = await execute({ operation: 'render', kind: 'component', id: 'content/button', variant: 'outline' });
  assert.deepEqual(result.diagnostics.errors, []);
  assert.ok(result.diagnostics.warnings.some(warning => warning.includes('unsubscribe')));
});

test('bridge refuses paths, arbitrary operations, unknown variants and submitted code', async () => {
  for (const request of [
    { operation: 'render', kind: 'email', id: '../../.env' },
    { operation: 'render', kind: 'recipe', id: 'missing' },
    { operation: 'render', kind: 'component', id: 'content/button', variant: '__proto__' },
    { operation: 'render', kind: 'component', id: 'content/button', theme: '../minimal' },
    { operation: 'render', kind: 'email', id: 'flows/welcome', brand: '../sanecotec' },
    { operation: 'render', kind: 'email', id: 'flows/welcome', template: 'untrusted code' },
    { operation: 'shell' },
  ]) await assert.rejects(execute(request));
});

test('draft and placeholder tokens cannot be exported as production', async () => {
  await assert.rejects(execute({ operation: 'render', kind: 'email', id: 'flows/welcome', mode: 'production' }), /complete real brand tokens/);
  await assert.rejects(execute({ operation: 'render', kind: 'email', id: 'flows/welcome', brand: 'sanecotec', mode: 'production' }), /Unknown production token brand/);
});
