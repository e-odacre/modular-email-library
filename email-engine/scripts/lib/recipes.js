// Sections and campaign recipes: compositions of components.
//
// A section (sections/<name>.js) is a reusable group of components ("social proof", "best sellers"). A recipe
// (recipes/<name>.js) is a whole email built from sections and components ("welcome", "abandoned cart"). Both export:
//
//   module.exports = {
//     name, description,
//     fields,                       // the data it accepts, same field specs as components
//     previewData,                  // realistic example data
//     build(data, ctx) => nodes,    // nodes are { component, variant, data, settings }, ctx = { vars, section }
//   };
//
// They only produce nodes (data), never markup, so they can be remixed (another theme or variant) and rendered.
const fs = require('fs');
const path = require('path');
const { SECTIONS_DIR, RECIPES_DIR } = require('./paths');
const { validateFields, isPlainObject } = require('./schema');
const { createVars } = require('./variables');

class RecipeError extends Error {}

function loadDir(dir, kind, fresh = false) {
  const found = new Map();
  if (!fs.existsSync(dir)) return found;
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.js') || file.startsWith('_')) continue;
    const id = path.basename(file, '.js');
    const modFile = path.join(dir, file);
    if (fresh) delete require.cache[require.resolve(modFile)];
    const mod = require(modFile);
    const problems = [];
    if (!isPlainObject(mod)) problems.push('must export an object');
    else {
      for (const key of ['name', 'description']) if (typeof mod[key] !== 'string' || !mod[key]) problems.push(`"${key}" is required`);
      if (!isPlainObject(mod.fields)) problems.push('"fields" must be an object');
      if (typeof mod.build !== 'function') problems.push('"build" must be a function (data, ctx) => nodes');
      if (!isPlainObject(mod.previewData)) problems.push('"previewData" is required');
    }
    if (problems.length) throw new Error(`${kind} "${id}": ${problems.join('; ')}`);
    found.set(id, { id, ...mod });
  }
  return found;
}

function loadSections({ fresh = false } = {}) {
  return loadDir(SECTIONS_DIR, 'section', fresh);
}
function loadRecipes({ fresh = false } = {}) {
  return loadDir(RECIPES_DIR, 'recipe', fresh);
}

function createBuilder({ vars = createVars(), fresh = false, sections = loadSections({ fresh }), recipes = loadRecipes({ fresh }) } = {}) {
  function run(kind, item, data) {
    const { value, errors } = validateFields(item.fields, data === undefined ? {} : data, {}, '');
    if (errors.length) throw new RecipeError(`${kind} "${item.id}":\n  ${errors.join('\n  ')}`);
    const nodes = item.build(value, ctx);
    if (!Array.isArray(nodes)) throw new RecipeError(`${kind} "${item.id}": build() must return a list of nodes`);
    return nodes.flat().filter(Boolean);
  }

  const ctx = {
    vars,
    section(name, data) {
      const s = sections.get(name);
      if (!s) throw new RecipeError(`No section "${name}". Available: ${[...sections.keys()].join(', ')}`);
      return run('section', s, data);
    },
  };

  return {
    ctx,
    sections,
    recipes,
    section: (name, data) => ctx.section(name, data),
    recipe(name, data) {
      const r = recipes.get(name);
      if (!r) throw new RecipeError(`No recipe "${name}". Available: ${[...recipes.keys()].join(', ')}`);
      return run('recipe', r, data);
    },
  };
}

// Small helpers for writing sections and recipes.
const node = (component, data = {}, opts = {}) => ({ component, data, ...(opts.variant ? { variant: opts.variant } : {}), ...(opts.settings ? { settings: opts.settings } : {}) });
const when = (condition, ...nodes) => (condition ? nodes : []);

module.exports = { loadSections, loadRecipes, createBuilder, RecipeError, node, when };
