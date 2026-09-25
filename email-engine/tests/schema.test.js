const test = require('node:test');
const assert = require('node:assert');
const { check, validateFields, specProblems } = require('../scripts/lib/schema');

const run = (spec, value, ctx) => {
  const errors = [];
  const out = check(spec, value, 'field', errors, ctx);
  return { out, errors };
};

test('required fields report a readable error, optional fields do not', () => {
  assert.deepStrictEqual(run({ type: 'text', required: true }, undefined).errors, ['field is required']);
  assert.deepStrictEqual(run('text', undefined).errors, []);
});

test('defaults fill in for missing values', () => {
  assert.strictEqual(run({ type: 'text', default: 'hi' }, undefined).out, 'hi');
});

test('empty and non-string text is rejected', () => {
  assert.ok(run('text', '  ').errors[0].includes('must not be empty'));
  assert.ok(run('text', 5).errors[0].includes('must be text'));
});

test('attr text rejects double quotes, plain text allows them', () => {
  assert.strictEqual(run('text', 'She said "hi"').errors.length, 0);
  assert.ok(run({ type: 'text', attr: true }, 'a "b"').errors[0].includes('double quote'));
});

test('urls: http(s), mailto, tel, anchors, paths and Klaviyo tags pass; javascript: and double quotes fail', () => {
  for (const ok of ['https://a.test/x', 'mailto:a@b.test', 'tel:+15551234', '#top', '/shop', '{{ organization.url }}', "{{ x|default:'y' }}"]) {
    assert.deepStrictEqual(run('url', ok).errors, [], ok);
  }
  assert.ok(run('url', 'javascript:alert(1)').errors[0].includes('javascript'));
  assert.ok(run('url', 'https://a.test/"x').errors[0].includes('double quote'));
  assert.ok(run('url', 'shop now').errors[0].includes('must start with'));
  assert.ok(run('url', '{{ x|default:"y" }}').errors[0].includes('double quote'));
});

test('images need alt text unless they are marked decorative', () => {
  assert.ok(run('image', { src: 'https://a.test/i.png' }).errors[0].includes('alt is required'));
  assert.deepStrictEqual(run('image', { src: 'https://a.test/i.png', alt: 'A linen shirt' }).errors, []);
  const decorative = run('image', { src: 'https://a.test/i.png', decorative: true });
  assert.deepStrictEqual(decorative.errors, []);
  assert.strictEqual(decorative.out.alt, '');
});

test('objects reject unknown keys and list them', () => {
  const { errors } = run('cta', { label: 'Go', href: '/x', colour: 'red' });
  assert.ok(errors.some((e) => e.includes('colour is not a known cta field')));
});

test('cta requires label and href', () => {
  const { errors } = run('cta', { label: 'Go' });
  assert.deepStrictEqual(errors, ['field.href is required']);
});

test('lists validate every item and honor min and max', () => {
  const spec = { type: 'list', of: 'text', min: 1, max: 2 };
  assert.ok(run(spec, []).errors[0].includes('at least 1'));
  assert.ok(run(spec, ['a', 'b', 'c']).errors[0].includes('at most 2'));
  assert.deepStrictEqual(run(spec, ['a', 5]).errors, ['field[1] must be text, got a number']);
});

test('named types: products validate each product with a path in the error', () => {
  const { errors } = run('products', [{ name: 'Linen shirt', image: { src: 'https://a.test/p.png', alt: 'Shirt' } }, { name: 'Hat' }]);
  assert.deepStrictEqual(errors, ['field[1].image is required']);
});

test('enum, number, boolean, alignment', () => {
  assert.ok(run({ type: 'enum', values: ['a', 'b'] }, 'c').errors[0].includes('one of a, b'));
  assert.ok(run({ type: 'number', min: 1 }, 0).errors[0].includes('at least 1'));
  assert.ok(run('boolean', 'yes').errors[0].includes('true or false'));
  assert.ok(run('alignment', 'middle').errors[0].includes('left, center or right'));
});

test('setting value types: color, length, spacing', () => {
  assert.deepStrictEqual(run('color', '#1F2937').errors, []);
  assert.deepStrictEqual(run('color', 'transparent').errors, []);
  assert.ok(run('color', '"red"').errors.length > 0);
  assert.deepStrictEqual(run('length', '24px').errors, []);
  assert.ok(run('length', 'big').errors.length > 0);
  assert.deepStrictEqual(run('spacing', '16px 24px').errors, []);
  assert.ok(run('spacing', '1px 2px 3px 4px 5px').errors.length > 0);
});

test('slots go through the renderer and can be checked for what they accept', () => {
  const ctx = { renderSlot: (value, accepts) => `${accepts}:${value}` };
  assert.strictEqual(run({ type: 'slot', accepts: 'content' }, 'x', ctx).out, 'content:x');
});

test('validateFields collects every problem at once', () => {
  const { errors } = validateFields({ a: { type: 'text', required: true }, b: { type: 'url', required: true } }, {});
  assert.deepStrictEqual(errors, ['a is required', 'b is required']);
});

test('specProblems flags unknown types and malformed specs', () => {
  assert.ok(specProblems('nope', 'x')[0].includes('unknown type'));
  assert.ok(specProblems({ type: 'enum' }, 'x')[0].includes('needs values'));
  assert.deepStrictEqual(specProblems({ type: 'list', of: 'products' }, 'x'), []);
});
