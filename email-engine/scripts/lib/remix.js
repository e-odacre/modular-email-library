// Remix: the same content in a different design.
//
// A remix is a set of overrides applied to a list of nodes without touching their data:
//   { variants: { 'commerce/product-grid': 'luxury' }, settings: { 'content/button': { align: 'left' } } }
// plus a theme, which the renderer applies to the whole email. The data (headlines, products, prices, links) is never
// changed, so what you compare is design against design.
const { isPlainObject } = require('./schema');

function canonical(registry, idOrName) {
  return registry.get(idOrName).id;
}

// Checks a remix against the registry and returns a list of problems, so a typo fails loudly.
function validateRemix(remix, registry) {
  const problems = [];
  for (const [key, variant] of Object.entries(remix.variants || {})) {
    try {
      const entry = registry.get(key);
      if (!entry.meta.variants[variant]) problems.push(`${entry.id} has no variant "${variant}" (has: ${Object.keys(entry.meta.variants).join(', ')})`);
    } catch (err) {
      problems.push(err.message);
    }
  }
  for (const [key, settings] of Object.entries(remix.settings || {})) {
    try {
      const entry = registry.get(key);
      for (const s of Object.keys(settings)) if (!(s in entry.meta.settings)) problems.push(`${entry.id} has no setting "${s}"`);
    } catch (err) {
      problems.push(err.message);
    }
  }
  return problems;
}

/**
 * Returns a copy of `value` (a node, a list of nodes, or data holding nodes) with the remix applied to every node
 * whose component matches. Nodes inside slots are remixed too.
 */
function remixNodes(value, remix, registry) {
  const problems = validateRemix(remix, registry);
  if (problems.length) throw new Error(`Invalid remix:\n  ${problems.join('\n  ')}`);
  const variants = Object.fromEntries(Object.entries(remix.variants || {}).map(([k, v]) => [canonical(registry, k), v]));
  const settings = Object.fromEntries(Object.entries(remix.settings || {}).map(([k, v]) => [canonical(registry, k), v]));

  const walk = (v) => {
    if (Array.isArray(v)) return v.map(walk);
    if (!isPlainObject(v)) return v;
    if (typeof v.component === 'string') {
      const id = canonical(registry, v.component);
      const out = { ...v, data: walk(v.data || {}) };
      if (variants[id]) out.variant = variants[id];
      if (settings[id]) out.settings = { ...(v.settings || {}), ...settings[id] };
      return out;
    }
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
  };
  return walk(value);
}

// Parses CLI style arguments: --variant commerce/product-grid=luxury --setting content/button.align=left
function parseRemixArgs({ variants = [], settings = [] }) {
  const out = { variants: {}, settings: {} };
  for (const item of variants) {
    const [id, variant] = item.split('=');
    if (!id || !variant) throw new Error(`--variant needs component=variant, got "${item}"`);
    out.variants[id] = variant;
  }
  for (const item of settings) {
    const eq = item.indexOf('=');
    const dot = item.lastIndexOf('.', eq);
    if (eq < 0 || dot < 0) throw new Error(`--setting needs component.setting=value, got "${item}"`);
    const id = item.slice(0, dot);
    const key = item.slice(dot + 1, eq);
    let value = item.slice(eq + 1);
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (/^-?\d+$/.test(value)) value = Number(value);
    (out.settings[id] = out.settings[id] || {})[key] = value;
  }
  return out;
}

module.exports = { remixNodes, validateRemix, parseRemixArgs };
