// Shared draft collection tooling. Brand content stays in brands/<id>/catalog.js.
const fs = require('node:fs');
const path = require('node:path');
const mjml2html = require('mjml');
const { ROOT } = require('./paths');
const { createEnv } = require('./render');
const { validateTokens, loadTokenFile } = require('./tokens');
const { runChecks } = require('./checks');
const { listThemes } = require('./themes');
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function requireId(value, kind) {
  if (typeof value !== 'string' || !ID.test(value)) throw new Error(`Invalid ${kind}: ${value}`);
}

function validateCatalog(catalog) {
  if (!catalog || typeof catalog.name !== 'string' || !catalog.name.trim()) throw new Error('Collection needs a name');
  if (!Array.isArray(catalog.blocks) || !catalog.blocks.length || !Array.isArray(catalog.emails)) throw new Error('Collection needs blocks and emails');
  if (!Array.isArray(catalog.themes) || !catalog.themes.length || new Set(catalog.themes).size !== catalog.themes.length) throw new Error('Collection needs unique themes');
  for (const theme of catalog.themes) if (!listThemes().includes(theme)) throw new Error(`Unknown collection theme: ${theme}`);
  const ids = new Set();
  for (const item of [...catalog.blocks, ...catalog.emails]) {
    requireId(item.id, 'item id');
    if (ids.has(item.id)) throw new Error(`Duplicate collection id: ${item.id}`);
    ids.add(item.id);
    for (const field of ['name', 'category', 'description']) if (typeof item[field] !== 'string' || !item[field].trim()) throw new Error(`${item.id}: missing ${field}`);
  }
  const blocks = new Map(catalog.blocks.map((block) => [block.id, block]));
  for (const block of catalog.blocks) {
    if (!Array.isArray(block.nodes) || !block.nodes.length) throw new Error(`${block.id}: needs nodes`);
    if (!Array.isArray(block.sources) || !block.sources.length || block.sources.some((s) => typeof s !== 'string' || !s.startsWith('https://'))) throw new Error(`${block.id}: needs HTTPS sources`);
    if (block.role && !['header', 'footer'].includes(block.role)) throw new Error(`${block.id}: unknown frame role`);
  }
  for (const role of ['header', 'footer']) if (blocks.get(catalog[role])?.role !== role) throw new Error(`Collection ${role} must name a ${role} block`);
  for (const email of catalog.emails) {
    if (!Array.isArray(email.blockIds) || email.blockIds.length < 3 || !email.preheader) throw new Error(`${email.id}: needs blocks and preheader`);
    for (const id of email.blockIds) if (!blocks.has(id)) throw new Error(`${email.id}: unknown block ${id}`);
    if (blocks.get(email.blockIds[0]).role !== 'header' || blocks.get(email.blockIds.at(-1)).role !== 'footer') throw new Error(`${email.id}: must start with a header and end with a footer`);
  }
  return catalog;
}

function loadCollection(brand) {
  requireId(brand, 'brand id');
  const dir = path.join(ROOT, 'brands', brand);
  const file = path.join(dir, 'catalog.js');
  if (!fs.existsSync(file)) throw new Error(`No collection for brand "${brand}"`);
  const catalog = validateCatalog(require(file));
  if (typeof catalog.tokenFile !== 'string' || path.basename(catalog.tokenFile) !== catalog.tokenFile || !catalog.tokenFile.endsWith('.json')) throw new Error('tokenFile must be a JSON filename inside the brand folder');
  const tokens = JSON.parse(fs.readFileSync(path.join(dir, catalog.tokenFile), 'utf8'));
  const validation = validateTokens(brand, tokens, loadTokenFile('placeholder'));
  if (validation.errors.length) throw new Error(validation.errors.join('\n'));
  return { brand, catalog, tokens, placeholderIssues: validation.placeholderIssues };
}

function composeItem(collection, kind, id) {
  if (!['blocks', 'emails'].includes(kind)) throw new Error(`Unknown collection kind: ${kind}`);
  const { catalog } = collection;
  const item = catalog[kind].find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown ${kind} item: ${id}`);
  const lookup = new Map(catalog.blocks.map((block) => [block.id, block]));
  const blockIds = kind === 'emails' ? item.blockIds : [
    ...(item.role === 'header' ? [] : [catalog.header]), id, ...(item.role === 'footer' ? [] : [catalog.footer]),
  ];
  const nodes = blockIds.flatMap((blockId) => lookup.get(blockId).nodes);
  return { item, blockIds, nodes: structuredClone(nodes) };
}

function inspectNodes(nodes) {
  const components = new Set();
  const imageUrls = new Set();
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (typeof value.component === 'string') components.add(value.component);
    if (typeof value.src === 'string') imageUrls.add(value.src);
    Object.values(value).forEach(visit);
  };
  visit(nodes);
  return { components: [...components].sort(), imageUrls: [...imageUrls] };
}

async function renderCollectionItem(collection, kind, id, theme = collection.catalog.themes[0]) {
  if (!collection.catalog.themes.includes(theme)) throw new Error(`Theme "${theme}" is not offered by this collection`);
  const { item, nodes, blockIds } = composeItem(collection, kind, id);
  const env = createEnv(collection.tokens, { theme });
  const source = '[% extends "layouts/base.mjml" %][% block title %][[ title | escape ]][% endblock %][% block preview %][[ preview | escape ]][% endblock %][% block body %][[ cn(nodes) ]][% endblock %]';
  const mjml = env.renderString(source, { nodes, title: `${collection.catalog.name} / ${item.name}`, preview: item.preheader || '' });
  const { html, errors = [] } = await mjml2html(mjml, { validationLevel: 'strict', minify: false });
  const checks = runChecks(html, collection.brand, mjml);
  const problems = [...errors.map((e) => e.formattedMessage || e.message), ...checks.errors];
  if (/\bundefined\b/.test(html)) problems.push('undefined leaked into output');
  if (problems.length) throw new Error(`${id} (${theme}): ${problems.join('\n')}`);
  const warnings = [...checks.warnings];
  if (/\.webp(?:[?"\s]|$)/i.test(html)) warnings.push('Uses website WebP imagery; replace with hosted PNG/JPEG for email delivery.');
  return { html, mjml, nodes, blockIds, warnings, bytes: Buffer.byteLength(html), ...inspectNodes(nodes) };
}

module.exports = { loadCollection, validateCatalog, composeItem, inspectNodes, renderCollectionItem };
