// Themes are style presets: a theme changes how components look, never what the brand is.
//
// A theme file (themes/<name>.json) has:
//   name, description
//   overrides     sparse changes to the brand's type / spacing / radius / shadow scales. Colors, fonts, logos and
//                 brand values can NOT be overridden, they always come from the brand token file.
//   button, card, section, badge, divider, image, accent
//                 complete style groups (every key required, validated against themes/minimal.json, no inheritance).
//                 Components read them with token references such as "@theme.button.radius".
//   components    per-component defaults: { "commerce/product-card": { "variant": "luxury", "settings": { ... } } }
//
// Values may reference tokens with "@": "@colors.accent", "@radius.pill", "1px solid @colors.border".
const fs = require('fs');
const path = require('path');
const { THEMES_DIR } = require('./paths');
const { leafPaths, getPath, loadTokenFile, REFERENCE_BRAND } = require('./tokens');
const { isPlainObject } = require('./schema');

const DEFAULT_THEME = 'minimal';
const OVERRIDE_GROUPS = ['type', 'spacing', 'radius', 'shadow'];
// Groups that are not exempt from the completeness check.
const OPEN_GROUPS = ['overrides', 'components'];

function listThemes() {
  if (!fs.existsSync(THEMES_DIR)) return [];
  return fs.readdirSync(THEMES_DIR).filter((f) => f.endsWith('.json')).map((f) => path.basename(f, '.json')).sort();
}

function loadThemeFile(name) {
  const file = path.join(THEMES_DIR, `${name}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`No theme "${name}" (looked for ${file}). Available: ${listThemes().join(', ') || 'none'}`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const isOpen = (p) => OPEN_GROUPS.some((g) => p === g || p.startsWith(`${g}.`));
const closedLeaves = (theme) => leafPaths(theme).filter((p) => !isOpen(p));

// Splits "1px solid @colors.border" into parts and returns the "@" references.
function refsIn(value) {
  return String(value).split(/\s+/).filter((part) => part.startsWith('@')).map((part) => part.slice(1));
}

/**
 * Checks a theme against the reference theme (minimal.json), the brand token structure and the component registry.
 * `tokens` is any complete brand token object (placeholder.json), used only to check structure and references.
 * Returns a list of error strings.
 */
function validateTheme(name, theme, { reference, tokens, registry }) {
  const errors = [];
  const e = (m) => errors.push(`theme "${name}": ${m}`);

  if (!isPlainObject(theme)) return [`theme "${name}": must be a JSON object`];
  if (typeof theme.name !== 'string' || !theme.name.trim()) e('"name" is required');
  if (typeof theme.description !== 'string' || !theme.description.trim()) e('"description" is required');

  const expected = new Set(closedLeaves(reference));
  const actual = new Set(closedLeaves(theme));
  for (const p of expected) if (!actual.has(p)) e(`missing "${p}" (every theme defines every style key, nothing is inherited)`);
  for (const p of actual) if (!expected.has(p)) e(`unknown key "${p}" (not in ${DEFAULT_THEME}.json, typo?)`);

  for (const p of leafPaths(theme)) {
    const v = getPath(theme, p);
    if (typeof v !== 'string' || !v.trim()) {
      e(`"${p}" must be a non-empty string`);
      continue;
    }
    if (v.includes('"')) e(`"${p}" contains a double quote (values end up in MJML attributes)`);
    for (const ref of refsIn(v)) {
      const root = ref.split('.')[0];
      const target = root === 'theme' ? getPath(theme, ref.split('.').slice(1).join('.')) : getPath(tokens, ref);
      if (typeof target !== 'string') e(`"${p}" refers to "@${ref}", which does not exist`);
    }
  }

  if (theme.card && typeof theme.card.shadow === 'string' && !(theme.card.shadow in tokens.shadow)) {
    e(`card.shadow "${theme.card.shadow}" must be one of ${Object.keys(tokens.shadow).join(', ')}`);
  }

  if (theme.overrides !== undefined) {
    if (!isPlainObject(theme.overrides)) e('"overrides" must be an object');
    else {
      for (const group of Object.keys(theme.overrides)) {
        if (!OVERRIDE_GROUPS.includes(group)) {
          e(`overrides.${group} is not allowed. Themes are style-only, they may override ${OVERRIDE_GROUPS.join(', ')} but never colors, fonts, logos or brand values`);
        }
      }
      const known = new Set(leafPaths(tokens));
      for (const p of leafPaths(theme.overrides)) {
        if (!known.has(p)) e(`overrides.${p} does not match a brand token (${REFERENCE_BRAND}.json has no "${p}")`);
      }
      for (const [level, spec] of Object.entries(theme.overrides.type || {})) {
        if (isPlainObject(spec) && spec.font && !(spec.font in tokens.fonts)) e(`overrides.type.${level}.font "${spec.font}" is not a font role`);
        if (isPlainObject(spec) && spec.color && !(spec.color in tokens.colors)) e(`overrides.type.${level}.color "${spec.color}" is not a color role`);
      }
    }
  }

  if (theme.components !== undefined) {
    if (!isPlainObject(theme.components)) e('"components" must be an object');
    else if (registry) {
      for (const [id, cfg] of Object.entries(theme.components)) {
        if (!registry.ids().includes(id)) {
          e(`components."${id}" is not a component id (ids look like "commerce/product-card")`);
          continue;
        }
        const meta = registry.get(id).meta;
        for (const k of Object.keys(cfg)) if (!['variant', 'settings'].includes(k)) e(`components."${id}".${k} is not allowed (use variant or settings)`);
        if (cfg.variant !== undefined && !meta.variants[cfg.variant]) {
          e(`components."${id}".variant "${cfg.variant}" does not exist (has: ${Object.keys(meta.variants).join(', ')})`);
        }
        for (const key of Object.keys(cfg.settings || {})) {
          if (!(key in meta.settings)) e(`components."${id}".settings.${key} is not a setting of ${id}`);
        }
      }
    }
  }

  return errors;
}

function deepMerge(base, extra) {
  if (!isPlainObject(base) || !isPlainObject(extra)) return extra;
  const out = { ...base };
  for (const [k, v] of Object.entries(extra)) out[k] = k in base ? deepMerge(base[k], v) : v;
  return out;
}

// Returns brand tokens with the theme's scale overrides applied. Everything else is the brand's own.
function applyTheme(tokens, theme) {
  if (!theme || !theme.overrides) return tokens;
  const out = JSON.parse(JSON.stringify(tokens));
  for (const group of OVERRIDE_GROUPS) {
    if (theme.overrides[group]) out[group] = deepMerge(out[group], theme.overrides[group]);
  }
  return out;
}

// Accepts a theme name, a loaded theme object, or nothing (the default theme).
function resolveTheme(input) {
  if (isPlainObject(input)) return input;
  return loadThemeFile(input || DEFAULT_THEME);
}

// Loads every theme and returns [{ name, errors }]. Used by tests and `npm run themes`.
function validateAllThemes(registry) {
  const reference = loadThemeFile(DEFAULT_THEME);
  const tokens = loadTokenFile(REFERENCE_BRAND);
  return listThemes().map((name) => ({
    name,
    errors: validateTheme(name, loadThemeFile(name), { reference, tokens, registry }),
  }));
}

module.exports = {
  DEFAULT_THEME,
  OVERRIDE_GROUPS,
  listThemes,
  loadThemeFile,
  validateTheme,
  validateAllThemes,
  applyTheme,
  resolveTheme,
  deepMerge,
};
