// Style resolution: how one component's settings are decided.
//
//   component defaults  ->  theme defaults for that component  ->  variant  ->  settings passed at the call site
//
// Same data and same structure, different styling: a variant (or a theme) is only a set of setting overrides.
//
// Values can reference tokens with "@": "@colors.accent" becomes the brand's accent color, "@theme.button.radius"
// reads the active theme, and parts combine: "1px solid @colors.border". References can point at other references
// (a theme's "@radius.pill"), so a theme picks which color or radius role a component uses without carrying any
// brand values of its own.
const { ComponentError, check } = require('./schema');
const { getPath } = require('./tokens');

const MAX_REF_DEPTH = 6;
const REF = /^@[A-Za-z][\w.-]*$/;

function lookup(ref, { tokens, theme }) {
  const [root, ...rest] = ref.split('.');
  return root === 'theme' ? getPath(theme, rest.join('.')) : getPath(tokens, ref);
}

// Resolves every "@path" part of a string. Returns the resolved string, or undefined after pushing an error.
function resolveRef(value, ctx, where, errors, depth = 0) {
  if (typeof value !== 'string' || !value.includes('@')) return value;
  if (depth > MAX_REF_DEPTH) {
    errors.push(`${where} has references nested more than ${MAX_REF_DEPTH} deep, is one circular? (${value})`);
    return undefined;
  }
  let failed = false;
  const out = value.split(/(\s+)/).map((part) => {
    if (!REF.test(part)) return part;
    const found = lookup(part.slice(1), ctx);
    if (typeof found !== 'string') {
      errors.push(`${where} refers to token "${part}", which does not exist`);
      failed = true;
      return part;
    }
    const resolved = resolveRef(found, ctx, where, errors, depth + 1);
    if (resolved === undefined) failed = true;
    return resolved;
  });
  return failed ? undefined : out.join('');
}

function resolveSettings(entry, { variant, theme, settings = {}, tokens }) {
  const { id, meta } = entry;
  const themeEntry = (theme && theme.components && theme.components[id]) || {};
  const chosen = variant || themeEntry.variant || 'default';

  if (!meta.variants[chosen]) {
    throw new ComponentError(`component "${id}": no variant "${chosen}". Available: ${Object.keys(meta.variants).join(', ')}`);
  }

  const errors = [];
  for (const key of Object.keys(settings)) {
    if (!(key in meta.settings)) {
      errors.push(`setting "${key}" is not a known setting (known: ${Object.keys(meta.settings).join(', ') || 'none'})`);
    }
  }

  const merged = {};
  for (const [key, spec] of Object.entries(meta.settings)) merged[key] = spec.default;
  Object.assign(merged, themeEntry.settings || {}, meta.variants[chosen].settings || {}, settings);

  const resolved = {};
  for (const [key, spec] of Object.entries(meta.settings)) {
    const value = resolveRef(merged[key], { tokens, theme }, `setting "${key}"`, errors);
    const out = check({ ...spec, required: true }, value, `setting "${key}"`, errors);
    if (out !== undefined) resolved[key] = out;
  }

  if (errors.length) throw new ComponentError(`component "${id}" (variant ${chosen}):\n  ${errors.join('\n  ')}`);
  return { variant: chosen, s: resolved };
}

// css-class fragments for the standard responsive settings. Templates add this to their root element.
// The classes are defined in layouts/base.mjml.
function responsiveClasses(s) {
  const cls = [];
  if (s.hideOnMobile) cls.push('hide-mobile');
  if (s.hideOnDesktop) cls.push('hide-desktop');
  return cls.join(' ');
}

module.exports = { resolveSettings, responsiveClasses, resolveRef };
