// Local-agent output is structured composition data, never executable templates.
const fs = require('node:fs');
const path = require('node:path');
const mjml2html = require('mjml');
const { ROOT, listBrands } = require('./paths');
const { loadBrand } = require('./tokens');
const { loadCollection } = require('./brand-collection');
const { listThemes } = require('./themes');
const { createEnv, renderRecipe } = require('./render');
const { runChecks } = require('./checks');
const DIRECTORY = path.join(ROOT, 'drafts');
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readDraft(id) {
  if (!ID.test(id)) throw new Error('Invalid draft ID.');
  const file = path.join(DIRECTORY, `${id}.json`);
  if (!fs.existsSync(file)) throw new Error('Draft file not found.');
  if (fs.statSync(file).size > 256 * 1024) throw new Error('Draft must be smaller than 256 KB.');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listDrafts() {
  if (!fs.existsSync(DIRECTORY)) return [];
  return fs.readdirSync(DIRECTORY).filter(file => file.endsWith('.json') && ID.test(file.slice(0, -5))).sort().map(file => {
    const id = file.slice(0, -5);
    try {
      const draft = readDraft(id);
      validateDraft(draft);
      return { id, name: draft.title, description: draft.description || 'Local build awaiting review.', category: draft.brand, theme: draft.theme || 'minimal', state: 'review' };
    } catch (error) {
      return { id, name: id, description: error.message, category: 'Needs attention', theme: 'minimal', state: 'invalid' };
    }
  });
}

function validateDraft(draft) {
  if (!draft || typeof draft !== 'object' || Array.isArray(draft)) throw new Error('Draft must be a JSON object.');
  if (typeof draft.title !== 'string' || !draft.title.trim()) throw new Error('Draft needs a title.');
  if (typeof draft.brand !== 'string' || !ID.test(draft.brand)) throw new Error('Draft needs a valid brand ID.');
  if (draft.theme !== undefined && !listThemes().includes(draft.theme)) throw new Error('Unknown draft style.');
  const hasRecipe = typeof draft.recipe === 'string' && !!draft.recipe;
  const hasNodes = Array.isArray(draft.nodes) && draft.nodes.length > 0;
  if (hasRecipe === hasNodes) throw new Error('Provide either a recipe with data or a non-empty nodes array.');
  if (hasRecipe && (!draft.data || typeof draft.data !== 'object' || Array.isArray(draft.data))) throw new Error('Recipe drafts require a data object.');
  return draft;
}

async function renderDraft(draft, { theme = draft.theme || 'minimal', mode = 'draft' } = {}) {
  validateDraft(draft);
  if (!listThemes().includes(theme)) throw new Error('Unknown style.');
  if (!['draft', 'production'].includes(mode)) throw new Error('Unknown export mode.');
  const productionBrand = listBrands().includes(draft.brand);
  const loaded = productionBrand ? loadBrand(draft.brand) : loadCollection(draft.brand);
  if (loaded.errors?.length) throw new Error(loaded.errors.join('\n'));
  if (mode === 'production' && (!productionBrand || draft.brand === 'placeholder' || loaded.placeholderIssues.length)) {
    throw new Error('Production export requires complete real brand tokens.');
  }
  let result;
  if (draft.recipe) {
    result = await renderRecipe(draft.recipe, draft.data, loaded.tokens, { theme });
  } else {
    const env = createEnv(loaded.tokens, { theme });
    const mjml = env.renderString('[% extends "layouts/base.mjml" %][% block title %][[ title | escape ]][% endblock %][% block body %][[ cn(nodes) ]][% endblock %]', { title: draft.title, nodes: draft.nodes });
    const { html, errors } = await mjml2html(mjml, { validationLevel: 'strict', minify: false });
    result = { html, mjml, mjmlErrors: errors || [] };
  }
  const checks = runChecks(result.html, draft.brand, result.mjml);
  const errors = [...result.mjmlErrors.map(error => error.formattedMessage || error.message), ...checks.errors];
  // JSON is local source, but executable content is never valid email output.
  if (/<script\b|\son[a-z]+\s*=|(?:javascript|vbscript)\s*:/i.test(result.html)) errors.push('Executable HTML is not allowed in email drafts.');
  const warnings = [...loaded.placeholderIssues, ...checks.warnings];
  if (/\.webp(?:[?"\s]|$)/i.test(result.html)) warnings.push('Uses WebP imagery; review image formats before delivery.');
  return { html: result.html, mjml: result.mjml, bytes: Buffer.byteLength(result.html), brand: draft.brand, theme, mode, diagnostics: { errors, warnings } };
}

module.exports = { listDrafts, readDraft, validateDraft, renderDraft };
