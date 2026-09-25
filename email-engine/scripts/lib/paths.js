const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TOKENS_DIR = path.join(ROOT, 'tokens');
const DIST_DIR = path.join(ROOT, 'dist');
const COMPONENTS_DIR = path.join(ROOT, 'components');
const THEMES_DIR = path.join(ROOT, 'themes');
const SECTIONS_DIR = path.join(ROOT, 'sections');
const RECIPES_DIR = path.join(ROOT, 'recipes');
const EMAIL_DIRS = ['flows', 'campaigns'];
// Examples use placeholder images and example.com links, so they build for the reference brand only.
const EXAMPLE_DIRS = ['examples'];

function listBrands() {
  return fs
    .readdirSync(TOKENS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.basename(f, '.json'))
    .sort();
}

// Returns ids like "flows/welcome" for every .mjml file in flows/ and campaigns/ (and examples/ with { examples: true }).
function listEmails({ examples = false } = {}) {
  const emails = [];
  for (const dir of examples ? [...EMAIL_DIRS, ...EXAMPLE_DIRS] : EMAIL_DIRS) {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) continue;
    for (const f of fs.readdirSync(full).sort()) {
      if (f.endsWith('.mjml')) emails.push(`${dir}/${path.basename(f, '.mjml')}`);
    }
  }
  return emails;
}

module.exports = {
  ROOT,
  TOKENS_DIR,
  DIST_DIR,
  COMPONENTS_DIR,
  THEMES_DIR,
  SECTIONS_DIR,
  RECIPES_DIR,
  EMAIL_DIRS,
  EXAMPLE_DIRS,
  listBrands,
  listEmails,
};
