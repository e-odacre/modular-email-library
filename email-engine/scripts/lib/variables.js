// The variable registry: semantic names (customer.first_name) mapped to the ESP's template tags.
//
//   const v = createVars();                       // reads variables/klaviyo.json
//   v.get('customer.first_name')                  // {{ first_name|default:'there' }}
//   v.get('customer.first_name', { fallback: 'friend' })
//   v.get('discount.code', { coupon: 'WELCOME10' })   // {% coupon_code 'WELCOME10' %}
//
// Components and recipes take plain strings, so nothing else in the library knows Klaviyo's syntax. That keeps the
// library portable: a different ESP is another JSON file with the same names.
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./paths');

const VARIABLES_DIR = path.join(ROOT, 'variables');
const DEFAULT_FILE = 'klaviyo';

function loadVariableFile(name = DEFAULT_FILE) {
  const file = path.join(VARIABLES_DIR, `${name}.json`);
  if (!fs.existsSync(file)) throw new Error(`No variables file "${name}" (looked for ${file})`);
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith('_')));
}

function fill(name, entry, args = {}) {
  const known = entry.args || {};
  for (const key of Object.keys(args)) {
    if (!(key in known)) {
      throw new Error(`variable "${name}" has no argument "${key}"${Object.keys(known).length ? ` (arguments: ${Object.keys(known).join(', ')})` : ' (it takes none)'}`);
    }
  }
  const values = { ...known, ...args };
  return entry.tag.replace(/\$\{(\w+)\}/g, (_m, key) => {
    const value = values[key];
    if (value === null || value === undefined) throw new Error(`variable "${name}" needs the argument "${key}"`);
    if (String(value).includes('"')) throw new Error(`variable "${name}" argument "${key}" contains a double quote, use single quotes`);
    return String(value);
  });
}

function createVars(file = DEFAULT_FILE) {
  const entries = loadVariableFile(file);
  const need = (name) => {
    if (!(name in entries)) {
      const near = Object.keys(entries).filter((k) => k.split('.')[0] === name.split('.')[0]).slice(0, 6);
      throw new Error(`No variable "${name}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ` Available: ${Object.keys(entries).join(', ')}`}`);
    }
    return entries[name];
  };
  return {
    get: (name, args) => fill(name, need(name), args),
    has: (name) => name in entries,
    describe: (name) => need(name),
    list: () => Object.entries(entries).map(([name, entry]) => ({ name, ...entry })),
    unverified: () => Object.entries(entries).filter(([, e]) => !e.verified).map(([name]) => name),
    file,
  };
}

module.exports = { createVars, loadVariableFile, VARIABLES_DIR, DEFAULT_FILE };
