const test = require('node:test');
const assert = require('node:assert');
const { loadRegistry } = require('../scripts/lib/registry');
const { createBuilder } = require('../scripts/lib/recipes');
const { renderRecipe, createEnv } = require('../scripts/lib/render');
const { runChecks } = require('../scripts/lib/checks');
const { listThemes } = require('../scripts/lib/themes');
const { loadTokenFile } = require('../scripts/lib/tokens');
const { remixNodes, validateRemix, parseRemixArgs } = require('../scripts/lib/remix');

const tokens = loadTokenFile('placeholder');
const registry = loadRegistry();
const builder = createBuilder();

const REQUIRED_RECIPES = ['welcome', 'abandoned-cart', 'product-launch', 'sale', 'black-friday', 'newsletter', 'event', 'saas-feature-launch'];
const REQUIRED_SECTIONS = ['product-introduction', 'social-proof', 'feature-breakdown', 'urgency', 'storytelling'];

test('every recipe and section the design system promises exists', () => {
  for (const id of REQUIRED_RECIPES) assert.ok(builder.recipes.has(id), `recipe ${id}`);
  for (const id of REQUIRED_SECTIONS) assert.ok(builder.sections.has(id), `section ${id}`);
  assert.ok(builder.recipes.size >= 12, 'extra recipes beyond the required eight');
});

const nodesOf = (v, out = []) => {
  if (Array.isArray(v)) v.forEach((x) => nodesOf(x, out));
  else if (v && typeof v === 'object') {
    if (typeof v.component === 'string') out.push(v);
    Object.values(v).forEach((x) => nodesOf(x, out));
  }
  return out;
};

for (const [id, item] of [...builder.sections].map(([i, s]) => [i, s]).concat([...builder.recipes])) {
  const kind = builder.sections.has(id) && builder.sections.get(id) === item ? 'section' : 'recipe';
  test(`${kind} ${id}: builds from its preview data into nodes that all name real components`, () => {
    const nodes = kind === 'section' ? builder.section(id, item.previewData) : builder.recipe(id, item.previewData);
    assert.ok(nodes.length > 0);
    for (const n of nodesOf(nodes)) assert.ok(registry.has(n.component), `${id}: unknown component ${n.component}`);
  });
}

for (const id of builder.recipes.keys()) {
  test(`recipe ${id}: renders to a complete email that passes every build check`, async () => {
    const { html, mjml, mjmlErrors } = await renderRecipe(id, undefined, tokens);
    assert.deepStrictEqual(mjmlErrors, []);
    const { errors } = runChecks(html, 'placeholder', mjml);
    assert.deepStrictEqual(errors, [], `${id}: ${errors.join('; ')}`);
    assert.ok(/<mj-title>|<title>/.test(html));
  });
}

test('every recipe renders under every theme', async () => {
  for (const id of builder.recipes.keys()) {
    for (const theme of listThemes()) {
      const { html, mjml, mjmlErrors } = await renderRecipe(id, undefined, tokens, { theme });
      assert.deepStrictEqual(mjmlErrors, [], `${id} / ${theme}`);
      assert.deepStrictEqual(runChecks(html, 'placeholder', mjml).errors, [], `${id} / ${theme}`);
    }
  }
});

test('a recipe is a starting point: optional sections can be left out, required ones are enforced', () => {
  const welcome = builder.recipes.get('welcome');
  const minimal = builder.recipe('welcome', { hero: { headline: 'Hello' } });
  assert.ok(minimal.some((n) => n.component === 'hero/standard'));
  assert.ok(!minimal.some((n) => n.component === 'commerce/product-grid'), 'best sellers are optional');
  assert.throws(() => builder.recipe('welcome', {}), /hero is required/);
  assert.throws(() => builder.recipe('welcome', { hero: {} }), /hero\.headline is required/);
  assert.ok(welcome.description);
});

test('unknown recipes and sections explain what is available', () => {
  assert.throws(() => builder.recipe('nope', {}), /No recipe "nope"\. Available: .*welcome/);
  assert.throws(() => builder.section('nope', {}), /No section "nope"/);
});

test('recipes always include the compliance footer and use the Klaviyo preview text when no preheader is given', async () => {
  const { html } = await renderRecipe('welcome', { hero: { headline: 'Hello' } }, tokens);
  assert.ok(html.includes('{% render_variable preview_text %}'));
  for (const tag of ['{% unsubscribe_link %}', '{% manage_preferences_link %}', '{{ organization.full_address }}']) assert.ok(html.includes(tag), tag);
});

test('the abandoned cart repeats one row over the Klaviyo line items and keeps every tag', async () => {
  const { html, mjml } = await renderRecipe('abandoned-cart', undefined, tokens);
  assert.ok(html.includes('{% for item in event.extra.line_items %}') && html.includes('{% endfor %}'));
  assert.ok(html.includes('{{ item.product.title }}') && html.includes('{{ item.product.images.0.src }}'));
  assert.ok(mjml.indexOf('{% for item') < mjml.indexOf('{{ item.product.title }}') && mjml.indexOf('{{ item.product.title }}') < mjml.indexOf('{% endfor %}'), 'the row sits inside the loop');
});

test('remix: another theme and other variants change the design, never the content', async () => {
  const base = await renderRecipe('sale', undefined, tokens);
  const remixed = await renderRecipe('sale', undefined, tokens, {
    theme: 'luxury',
    remix: { variants: { 'commerce/product-card': 'luxury' }, settings: { 'commerce/product-grid': { columns: 3 } } },
  });
  assert.notStrictEqual(base.html, remixed.html);
  for (const text of ['Up to 40% off', 'Coastal Linen Shirt', 'On sale now']) {
    assert.ok(base.html.includes(text) && remixed.html.includes(text), text);
  }
  assert.deepStrictEqual(base.nodes.map((n) => n.component), remixed.nodes.map((n) => n.component), 'the same components in the same order');
});

test('remix validates its targets with readable errors', () => {
  assert.deepStrictEqual(validateRemix({ variants: { 'commerce/product-card': 'luxury' } }, registry), []);
  const problems = validateRemix({ variants: { 'commerce/product-card': 'neon', nope: 'x' }, settings: { 'content/button': { wobble: 1 } } }, registry);
  assert.ok(problems.some((p) => p.includes('no variant "neon"')));
  assert.ok(problems.some((p) => p.includes('No component "nope"')));
  assert.ok(problems.some((p) => p.includes('no setting "wobble"')));
  assert.throws(() => remixNodes([], { variants: { 'content/button': 'neon' } }, registry), /Invalid remix/);
});

test('remix reaches nodes nested inside slots and leaves the input untouched', () => {
  const tree = [{ component: 'layout/section', data: { content: [{ component: 'content/button', data: { label: 'Go', href: '/x' } }] } }];
  const before = JSON.stringify(tree);
  const out = remixNodes(tree, { variants: { 'content/button': 'outline' } }, registry);
  assert.strictEqual(out[0].data.content[0].variant, 'outline');
  assert.strictEqual(JSON.stringify(tree), before);
});

test('remix CLI arguments parse into a remix object', () => {
  assert.deepStrictEqual(parseRemixArgs({ variants: ['commerce/product-grid=luxury'], settings: ['content/button.align=left', 'layout/grid.columns=3', 'layout/section.hideOnMobile=true'] }), {
    variants: { 'commerce/product-grid': 'luxury' },
    settings: { 'content/button': { align: 'left' }, 'layout/grid': { columns: 3 }, 'layout/section': { hideOnMobile: true } },
  });
  assert.throws(() => parseRemixArgs({ variants: ['nope'] }), /component=variant/);
});

test('emails written as .mjml can use recipes, sections and variables', () => {
  const env = createEnv(tokens);
  const out = env.renderString("[[ recipeSection('cta', { headline: 'Hi ' + v('customer.first_name'), primary: { label: 'Go', href: v('brand.url') } }) ]]");
  assert.ok(out.includes("{{ first_name|default:'there' }}") && out.includes('{{ organization.url }}'));
});

test('the variables registry: every entry is documented, safe in attributes and honest about what was verified', () => {
  const { createVars } = require('../scripts/lib/variables');
  const vars = createVars();
  for (const v of vars.list()) {
    assert.ok(v.description, `${v.name}: description`);
    assert.ok(!v.tag.includes('"'), `${v.name}: a double quote would break an attribute`);
    if (v.verified) assert.ok(/^https:\/\/help\.klaviyo\.com\//.test(v.source), `${v.name}: verified entries cite Klaviyo's help center`);
    else assert.ok(v.verified === false && v.platformDependent, `${v.name}: unverified entries are marked`);
  }
  assert.strictEqual(vars.get('customer.first_name', { fallback: 'friend' }), "{{ first_name|default:'friend' }}");
  assert.strictEqual(vars.get('discount.code', { coupon: 'HELLO' }), "{% coupon_code 'HELLO' %}");
  assert.throws(() => vars.get('discount.code'), /needs the argument "coupon"/);
  assert.throws(() => vars.get('customer.first_name', { colour: 'x' }), /has no argument "colour"/);
  assert.throws(() => vars.get('discount.code', { coupon: 'A"B' }), /double quote/);
  assert.throws(() => vars.get('customer.nope'), /No variable "customer\.nope"/);
});
