// Usage: npm run new:component -- <category> <name> [--level content|section]
//   npm run new:component -- commerce gift-card
//   npm run new:component -- loyalty points-balance --level section
//
// Creates components/<category>/<name>.njk and <name>.meta.js with a working, minimal component: it renders, it has
// realistic preview data, and it passes the test suite as it is. Then make it yours. Nothing else needs editing, the
// registry finds it, the docs generator documents it and the tests cover it.
const fs = require('fs');
const path = require('path');
const { COMPONENTS_DIR } = require('./lib/paths');

const NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const title = (s) => s.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

function scaffold(category, name, level) {
  const id = `${category}/${name}`;
  const njk = level === 'section'
    ? `[# ${id}: describe what this section is for, in one line.

   Compatibility (not checked in real clients yet, fill this in after testing)
   - Outlook desktop: built from MJML sections and columns, which render as tables. Check padding and backgrounds.
   - Gmail apps: check that it renders and that nothing important depends on images.
   - Dark mode: the section swaps to the dark surface via dm-* classes when it sits on the brand surface color. #]
[% from "components/_partials.njk" import section %]
[% call section(s, cls) %]
<mj-column>
  [[ c('content/heading', { text: data.title }, { settings: { level: 'h2', align: s.align } }) ]]
  [% if data.text %][[ c('content/text', { text: data.text }, { settings: { align: s.align } }) ]][% endif %]
</mj-column>
[% endcall %]
`
    : `[# ${id}: describe what this content block is for, in one line. It sits inside a column.

   Compatibility (not checked in real clients yet, fill this in after testing)
   - Outlook desktop: mj-text renders as a table cell, padding and line-height are honored.
   - Gmail apps: fine for plain text, check anything that relies on images or background colors.
   - Dark mode: text swaps via the dm-text class where prefers-color-scheme is honored. #]
<mj-text[[ cc('dm-text', cls) ]] align="[[ s.align ]]" [[ typo(s.level) ]] padding="[[ s.padding ]]">[[ data.text ]]</mj-text>
`;

  const meta = level === 'section'
    ? `const { sectionSettings, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: '${title(name)}',
  description: 'Describe what this section is for.',
  level: 'section',

  // What the caller passes. Fields are optional unless required: true. See docs/component-metadata.md for the types.
  fields: {
    title: { type: 'text', required: true },
    text: 'text',
  },

  // How it can look. Every setting needs a default. Values can reference tokens: '@colors.accent', '@theme.card.radius'.
  settings: sectionSettings({
    align: { type: 'alignment', default: 'left' },
  }),

  responsive: SECTION_RESPONSIVE,

  // Same data, different styling. A variant only overrides settings.
  variants: {
    default: { description: 'The standard look.' },
    centered: { description: 'Centered text.', settings: { align: 'center' } },
  },

  // Realistic content, not lorem ipsum. The gallery and the tests render it.
  previewData: {
    data: { title: 'Summer Collection', text: 'Made for slower mornings and warmer days.' },
  },

  compat: {
    outlook: 'Renders as tables. Not checked in Outlook desktop yet.',
    gmail: 'Not checked in Gmail apps yet.',
    darkMode: 'Swaps to the dark surface via dm-* classes when on the brand surface color.',
  },
};
`
    : `module.exports = {
  name: '${title(name)}',
  description: 'Describe what this content block is for.',
  level: 'content',

  // What the caller passes. Fields are optional unless required: true. See docs/component-metadata.md for the types.
  fields: {
    text: { type: 'text', required: true },
  },

  // How it can look. Every setting needs a default. Values can reference tokens: '@colors.accent', '@theme.card.radius'.
  settings: {
    level: { type: 'enum', values: ['body', 'bodyLarge', 'bodySmall', 'caption'], default: 'body' },
    align: { type: 'alignment', default: 'left' },
    padding: { type: 'spacing', default: '0 0 @spacing.md 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  // Same data, different styling. A variant only overrides settings.
  variants: {
    default: { description: 'The standard look.' },
    centered: { description: 'Centered text.', settings: { align: 'center' } },
  },

  // Realistic content, not lorem ipsum. The gallery and the tests render it.
  previewData: {
    data: { text: 'Made for slower mornings and warmer days.' },
  },

  compat: {
    outlook: 'Renders as a table cell. Not checked in Outlook desktop yet.',
    gmail: 'Not checked in Gmail apps yet.',
    darkMode: 'Text swaps via dm-text where honored.',
  },
};
`;
  return { njk, meta };
}

function main() {
  const argv = process.argv.slice(2);
  const levelAt = argv.indexOf('--level');
  const level = levelAt >= 0 ? argv.splice(levelAt, 2)[1] : 'content';
  const [category, name] = argv;

  if (!category || !name || !['content', 'section'].includes(level)) {
    console.error('Usage: npm run new:component -- <category> <name> [--level content|section]');
    process.exit(1);
  }
  for (const [label, value] of [['category', category], ['name', name]]) {
    if (!NAME.test(value)) {
      console.error(`The ${label} "${value}" must be lowercase words joined by hyphens, like gift-card.`);
      process.exit(1);
    }
  }

  const dir = path.join(COMPONENTS_DIR, category);
  const njkFile = path.join(dir, `${name}.njk`);
  const metaFile = path.join(dir, `${name}.meta.js`);
  if (fs.existsSync(njkFile) || fs.existsSync(metaFile)) {
    console.error(`components/${category}/${name} already exists, not overwriting it.`);
    process.exit(1);
  }

  const { njk, meta } = scaffold(category, name, level);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(njkFile, njk);
  fs.writeFileSync(metaFile, meta);

  console.log(`Created ${level}-level component ${category}/${name}:`);
  console.log(`  components/${category}/${name}.njk`);
  console.log(`  components/${category}/${name}.meta.js`);
  console.log('\nNext:');
  console.log(`  1. Edit both files: fields, settings, variants, realistic previewData, and the compatibility notes.`);
  console.log(`  2. npm run preview, then open /components/${category}/${name} to see every variant.`);
  console.log('  3. npm run docs, to generate its documentation page and README row.');
  console.log('  4. npm test');
}

if (require.main === module) main();

module.exports = { scaffold, NAME };
