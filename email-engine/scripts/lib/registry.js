// Discovers components. A component is two files in components/<category>/:
//   <name>.njk        the template (emits MJML)
//   <name>.meta.js    the metadata (module.exports = { ... }), see docs/component-metadata.md
// Nothing else needs editing to add one. The id is "<category>/<name>", and a bare "<name>" also works
// when it is unique across categories.
const fs = require('fs');
const path = require('path');
const { COMPONENTS_DIR, ROOT } = require('./paths');
const { specProblems, isPlainObject } = require('./schema');

const LEVELS = ['content', 'section'];
const META_KEYS = new Set([
  'name', 'description', 'level', 'fields', 'settings', 'variants', 'responsive', 'previewData', 'compat', 'notes', 'validate',
]);
const COMPAT_KEYS = ['outlook', 'gmail', 'darkMode'];

// Standard responsive settings. A component opts in through `responsive` in its metadata, for example
// responsive: { mobileColumns: [1, 2], hideOnMobile: true }. Only expose what makes sense.
const RESPONSIVE_KEYS = ['mobileLayout', 'mobileAlignment', 'mobileColumns', 'hideOnMobile', 'hideOnDesktop'];

function expandResponsive(responsive = {}) {
  const settings = {};
  for (const [key, opt] of Object.entries(responsive)) {
    if (key === 'hideOnMobile' || key === 'hideOnDesktop') {
      if (opt === true) settings[key] = { type: 'boolean', default: false };
    } else {
      settings[key] = { type: 'enum', values: opt, default: opt[0] };
    }
  }
  return settings;
}

function validateMeta(id, meta) {
  const problems = [];
  const p = (msg) => problems.push(`${id}: ${msg}`);

  if (!isPlainObject(meta)) return [`${id}: .meta.js must export an object`];
  for (const k of Object.keys(meta)) if (!META_KEYS.has(k)) p(`unknown metadata key "${k}"`);

  for (const k of ['name', 'description']) {
    if (typeof meta[k] !== 'string' || !meta[k].trim()) p(`"${k}" is required`);
  }
  if (!LEVELS.includes(meta.level)) p(`"level" must be one of ${LEVELS.join(', ')}`);
  if (!isPlainObject(meta.fields)) p('"fields" must be an object (use {} if there are none)');
  else for (const [k, v] of Object.entries(meta.fields)) problems.push(...specProblems(v, `${id}: fields.${k}`));

  if (!isPlainObject(meta.settings)) {
    p('"settings" must be an object (use {} if there are none)');
  } else {
    for (const [k, v] of Object.entries(meta.settings)) {
      problems.push(...specProblems(v, `${id}: settings.${k}`));
      if (!isPlainObject(v) || v.default === undefined) p(`settings.${k} needs a default`);
    }
  }

  if (!isPlainObject(meta.variants) || !meta.variants.default) {
    p('"variants" must be an object with at least "default"');
  } else {
    for (const [name, v] of Object.entries(meta.variants)) {
      if (!isPlainObject(v)) p(`variants.${name} must be an object`);
      else if (typeof v.description !== 'string') p(`variants.${name} needs a description`);
    }
  }

  if (meta.responsive !== undefined) {
    if (!isPlainObject(meta.responsive)) p('"responsive" must be an object');
    else {
      for (const [k, v] of Object.entries(meta.responsive)) {
        if (!RESPONSIVE_KEYS.includes(k)) p(`responsive.${k} is not a standard responsive setting (${RESPONSIVE_KEYS.join(', ')})`);
        else if ((k === 'hideOnMobile' || k === 'hideOnDesktop') && typeof v !== 'boolean') p(`responsive.${k} must be true or false`);
        else if (!['hideOnMobile', 'hideOnDesktop'].includes(k) && (!Array.isArray(v) || !v.length)) p(`responsive.${k} must be a list of values`);
      }
    }
  }

  if (meta.validate !== undefined && typeof meta.validate !== 'function') p('"validate" must be a function (data, settings) => [error messages]');

  if (!isPlainObject(meta.previewData) || !isPlainObject(meta.previewData.data)) {
    p('"previewData.data" is required, use realistic content, not lorem ipsum');
  }
  if (!isPlainObject(meta.compat)) p('"compat" is required ({ outlook, gmail, darkMode })');
  else for (const k of COMPAT_KEYS) if (typeof meta.compat[k] !== 'string' || !meta.compat[k].trim()) p(`compat.${k} is required`);

  return problems;
}

function loadRegistry({ fresh = false, dir = COMPONENTS_DIR } = {}) {
  const entries = new Map();
  const problems = [];

  const categories = fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
    : [];

  for (const category of categories) {
    const catDir = path.join(dir, category);
    for (const file of fs.readdirSync(catDir).sort()) {
      if (!file.endsWith('.meta.js')) continue;
      const name = file.slice(0, -'.meta.js'.length);
      const id = `${category}/${name}`;
      const metaFile = path.join(catDir, file);
      const templateFile = path.join(catDir, `${name}.njk`);

      if (!fs.existsSync(templateFile)) {
        problems.push(`${id}: ${name}.meta.js has no ${name}.njk next to it`);
        continue;
      }
      if (fresh) delete require.cache[require.resolve(metaFile)];
      let meta;
      try {
        meta = require(metaFile);
      } catch (err) {
        problems.push(`${id}: could not load ${file}: ${err.message}`);
        continue;
      }
      const metaProblems = validateMeta(id, meta);
      if (metaProblems.length) {
        problems.push(...metaProblems);
        continue;
      }
      const settings = { ...expandResponsive(meta.responsive), ...meta.settings };
      for (const [vname, v] of Object.entries(meta.variants)) {
        for (const key of Object.keys(v.settings || {})) {
          if (!(key in settings)) problems.push(`${id}: variants.${vname}.settings.${key} is not a declared setting`);
        }
      }
      entries.set(id, {
        id,
        category,
        name,
        meta: { ...meta, settings },
        templatePath: path.relative(ROOT, templateFile).split(path.sep).join('/'),
      });
    }
  }

  if (problems.length) throw new Error(`Component registry problems:\n  ${problems.join('\n  ')}`);

  const byBare = new Map();
  for (const e of entries.values()) byBare.set(e.name, [...(byBare.get(e.name) || []), e.id]);

  return {
    all: () => [...entries.values()],
    ids: () => [...entries.keys()],
    categories: () => categories.filter((c) => [...entries.values()].some((e) => e.category === c)),
    get(idOrName) {
      if (entries.has(idOrName)) return entries.get(idOrName);
      const matches = byBare.get(idOrName);
      if (matches && matches.length === 1) return entries.get(matches[0]);
      if (matches && matches.length > 1) {
        throw new Error(`Component name "${idOrName}" is ambiguous, use one of: ${matches.join(', ')}`);
      }
      const near = [...entries.keys()].filter((k) => k.includes(idOrName)).slice(0, 5);
      throw new Error(`No component "${idOrName}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ''}`);
    },
    has: (idOrName) => entries.has(idOrName) || (byBare.get(idOrName) || []).length === 1,
  };
}

module.exports = { loadRegistry, validateMeta, expandResponsive, RESPONSIVE_KEYS, LEVELS };
