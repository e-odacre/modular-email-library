const fs = require('fs');
const path = require('path');
const { TOKENS_DIR } = require('./paths');

const REFERENCE_BRAND = 'placeholder';
const PLACEHOLDER_URL = /placehold\.co|example\.com/i;
// Keys that a brand may leave out entirely. If present they must be complete.
const OPTIONAL_GROUPS = ['dark'];

function loadTokenFile(brand) {
  const file = path.join(TOKENS_DIR, `${brand}.json`);
  if (!fs.existsSync(file)) throw new Error(`No token file for brand "${brand}" (looked for ${file})`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// Leaf paths like "colors.primary". Ignores the _placeholders bookkeeping key.
function leafPaths(obj, prefix = '') {
  const out = [];
  for (const [key, value] of Object.entries(obj)) {
    if (!prefix && key === '_placeholders') continue;
    const p = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) out.push(...leafPaths(value, p));
    else out.push(p);
  }
  return out;
}

function getPath(obj, dotted) {
  return dotted.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/**
 * Validates a brand's tokens against the reference (placeholder.json).
 * Returns { errors, placeholderIssues }. Both fail a build. Preview only fails on `errors`,
 * so you can look at an unfinished brand while you fill it in.
 */
function validateTokens(brand, tokens, reference) {
  const errors = [];
  const placeholderIssues = [];

  const expected = new Set(leafPaths(reference));
  const actual = new Set(leafPaths(tokens));
  const skipped = (p) => OPTIONAL_GROUPS.some((g) => p === g || p.startsWith(`${g}.`)) && !tokens[p.split('.')[0]];

  for (const p of expected) {
    if (!actual.has(p) && !skipped(p)) errors.push(`missing token "${p}"`);
  }
  for (const p of actual) {
    if (!expected.has(p)) errors.push(`unknown token "${p}" (not in ${REFERENCE_BRAND}.json, typo?)`);
  }

  for (const p of actual) {
    const value = getPath(tokens, p);
    if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`token "${p}" must be a non-empty string`);
    } else if (value.includes('"')) {
      errors.push(`token "${p}" contains a double quote, use single quotes (values are dropped into MJML attributes)`);
    }
  }

  // Typography levels point at a font role (fonts.<role>) and a color role (colors.<role>).
  if (tokens.type && typeof tokens.type === 'object') {
    for (const [level, spec] of Object.entries(tokens.type)) {
      if (!spec || typeof spec !== 'object') continue;
      if (typeof spec.font === 'string' && !(tokens.fonts && spec.font in tokens.fonts)) {
        errors.push(`token "type.${level}.font" is "${spec.font}", which is not a key of fonts (${Object.keys(tokens.fonts || {}).join(', ')})`);
      }
      if (typeof spec.color === 'string' && !(tokens.colors && spec.color in tokens.colors)) {
        errors.push(`token "type.${level}.color" is "${spec.color}", which is not a key of colors`);
      }
    }
  }

  const placeholders = tokens._placeholders;
  if (!Array.isArray(placeholders)) {
    errors.push('"_placeholders" must be an array (use [] once every value is real)');
  } else {
    for (const p of placeholders) {
      if (!actual.has(p)) errors.push(`"_placeholders" lists "${p}" but no such token exists`);
    }
    if (brand !== REFERENCE_BRAND) {
      if (placeholders.length) {
        placeholderIssues.push(`still marked as placeholder: ${placeholders.join(', ')}`);
      }
      for (const p of actual) {
        const value = getPath(tokens, p);
        if (typeof value === 'string' && PLACEHOLDER_URL.test(value)) {
          placeholderIssues.push(`token "${p}" points at a placeholder URL (${value})`);
        }
      }
    }
  }

  return { errors, placeholderIssues };
}

function loadBrand(brand) {
  const tokens = loadTokenFile(brand);
  const reference = brand === REFERENCE_BRAND ? tokens : loadTokenFile(REFERENCE_BRAND);
  return { tokens, ...validateTokens(brand, tokens, reference) };
}

module.exports = { REFERENCE_BRAND, PLACEHOLDER_URL, loadTokenFile, loadBrand, validateTokens, leafPaths, getPath };
