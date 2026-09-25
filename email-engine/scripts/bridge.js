// Laravel boundary: one JSON request on stdin, one JSON response on stdout.
// Repository catalogs remain trusted code. No submitted paths, templates or JavaScript are executed.
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, listBrands, listEmails } = require('./lib/paths');
const { loadRegistry } = require('./lib/registry');
const { loadRecipes, loadSections } = require('./lib/recipes');
const { listThemes } = require('./lib/themes');
const { loadBrand } = require('./lib/tokens');
const { renderEmail, renderComponent, renderRecipe } = require('./lib/render');
const { runChecks } = require('./lib/checks');
const { loadCollection } = require('./lib/brand-collection');

function fail(message, status = 422) {
  throw Object.assign(new Error(message), { status });
}

function collections() {
  return fs.readdirSync(path.join(ROOT, 'brands'), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)
      && fs.existsSync(path.join(ROOT, 'brands', entry.name, 'catalog.js')))
    .map(entry => {
      const { catalog, placeholderIssues } = loadCollection(entry.name);
      return { id: entry.name, name: catalog.name, description: catalog.description,
        blocks: catalog.blocks.length, emails: catalog.emails.length, themes: catalog.themes, placeholderIssues };
    });
}

function inventory() {
  return {
    brands: listBrands(), themes: listThemes(), sections: [...loadSections().keys()],
    emails: listEmails({ examples: true }).map(id => ({ id, name: id.split('/').pop().replace(/-/g, ' '), category: id.split('/')[0], description: 'Complete email' })),
    recipes: [...loadRecipes()].map(([id, recipe]) => ({ id, name: recipe.name, description: recipe.description, category: recipe.suggestedTheme || 'minimal' })),
    components: loadRegistry().all().map(entry => ({ id: entry.id, category: entry.category, ...entry.meta })),
    collections: collections(),
  };
}

async function execute(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) fail('Request must be an object.');
  const allowed = ['operation', 'kind', 'id', 'brand', 'theme', 'variant', 'mode'];
  if (Object.keys(request).some(key => !allowed.includes(key))) fail('Unexpected request field.');
  if (request.operation === 'inventory') return inventory();
  if (request.operation === 'gallery') {
    if (!collections().some(collection => collection.id === request.brand)) fail('Unknown collection.', 404);
    const { buildGallery } = require('./brand-gallery');
    await buildGallery(request.brand);
    return { built: true };
  }
  if (request.operation !== 'render') fail('Unknown operation.');
  const { kind, id, brand = 'placeholder', theme = 'minimal', variant, mode = 'draft' } = request;
  if (!['email', 'recipe', 'component'].includes(kind)) fail('Unknown design type.', 404);
  if (typeof id !== 'string') fail('A design ID is required.');
  if (!listBrands().includes(brand)) fail('Unknown production token brand.', 404);
  if (!listThemes().includes(theme)) fail('Unknown style.');
  if (!['draft', 'production'].includes(mode)) fail('Unknown export mode.');
  const registry = loadRegistry();
  if (kind === 'email' && !listEmails({ examples: brand === 'placeholder' }).includes(id)) fail('Unknown email.', 404);
  if (kind === 'recipe' && !loadRecipes().has(id)) fail('Unknown recipe.', 404);
  if (kind === 'component' && !registry.has(id)) fail('Unknown component.', 404);
  if (variant !== undefined && (kind !== 'component' || !Object.hasOwn(registry.get(id).meta.variants, variant))) fail('Unknown component variant.');
  const { tokens, errors, placeholderIssues } = loadBrand(brand);
  if (errors.length) fail(errors.join('\n'));
  if (mode === 'production' && (brand === 'placeholder' || placeholderIssues.length)) {
    fail(`Production export requires complete real brand tokens. ${placeholderIssues.join(' ')}`);
  }
  const options = { theme, variant, registry };
  const result = kind === 'email' ? await renderEmail(`${id}.mjml`, tokens, options)
    : kind === 'recipe' ? await renderRecipe(id, undefined, tokens, options)
      : await renderComponent(id, tokens, options);
  const checks = runChecks(result.html, brand, result.mjml);
  const diagnostics = {
    errors: [...result.mjmlErrors.map(error => error.formattedMessage || error.message), ...checks.errors],
    warnings: [...placeholderIssues, ...checks.warnings],
  };
  // Standalone component previews are fragments, so report their missing email frame as guidance.
  if (kind === 'component' && mode === 'draft') {
    const frameIssues = diagnostics.errors.filter(error => error.startsWith('no {% unsubscribe') || error.startsWith('no {{ organization.'));
    diagnostics.errors = diagnostics.errors.filter(error => !frameIssues.includes(error));
    diagnostics.warnings.push(...frameIssues);
  }
  if (mode === 'production' && diagnostics.errors.length) fail(diagnostics.errors.join('\n'));
  return { html: result.html, mjml: result.mjml, bytes: Buffer.byteLength(result.html), diagnostics, mode, brand, theme };
}

if (require.main === module) {
  console.log = (...args) => console.error(...args);
  (async () => {
    let input = '';
    for await (const chunk of process.stdin) {
      input += chunk;
      if (Buffer.byteLength(input) > 16384) fail('Request is too large.');
    }
    const data = await execute(JSON.parse(input));
    process.stdout.write(JSON.stringify({ ok: true, data }));
  })().catch(error => {
    process.stdout.write(JSON.stringify({ ok: false, error: { message: error.message, status: error.status || 422 } }));
    process.exitCode = 1;
  });
}

module.exports = { execute, inventory };
