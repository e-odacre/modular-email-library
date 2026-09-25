// Usage: npm run new:theme -- <name>     e.g. npm run new:theme -- autumn
//
// Creates themes/<name>.json as a complete copy of the minimal theme, ready to edit. It is a copy, not an inheriting
// theme: every key is spelled out, so a theme reads the same on its own. Then change what makes it different (see
// docs/themes.md), and remember themes are style-only: type, spacing, radius, shadow, buttons, cards and which brand color
// roles to use. Colors, fonts and brand values always come from the brand token file.
const fs = require('fs');
const path = require('path');
const { THEMES_DIR } = require('./lib/paths');

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
  console.error('Usage: npm run new:theme -- <name>   (lowercase words joined by hyphens, like autumn)');
  process.exit(1);
}
const target = path.join(THEMES_DIR, `${name}.json`);
if (fs.existsSync(target)) {
  console.error(`themes/${name}.json already exists, not overwriting it.`);
  process.exit(1);
}

const theme = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, 'minimal.json'), 'utf8'));
theme.name = name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
theme.description = 'Describe the mood of this theme in one sentence.';
fs.writeFileSync(target, JSON.stringify(theme, null, 2) + '\n');

console.log(`Created themes/${name}.json`);
console.log('\nNext:');
console.log('  1. Edit the description, then the parts that make it different: overrides (type, spacing, radius, shadow),');
console.log('     the button, card, section, badge, divider, image and accent groups, and component defaults.');
console.log(`  2. npm run preview, then add ?theme=${name} to any page.`);
console.log('  3. npm test (every theme is validated and every component is rendered in it)');
