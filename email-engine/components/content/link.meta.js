const { VAGUE_LINK } = require('../../scripts/lib/schema');

module.exports = {
  name: 'Link',
  description: 'A standalone text link with descriptive text, optionally with an arrow.',
  level: 'content',

  fields: {
    label: { type: 'text', required: true },
    href: { type: 'url', required: true },
  },

  settings: {
    level: { type: 'enum', values: ['body', 'bodyLarge', 'bodySmall', 'caption'], default: 'body' },
    align: { type: 'alignment', default: 'left' },
    color: { type: 'color', default: '@colors.link' },
    weight: { type: 'enum', values: ['normal', 'bold'], default: 'normal' },
    underline: { type: 'boolean', default: true },
    arrow: { type: 'boolean', default: false },
    padding: { type: 'spacing', default: '0 0 @spacing.md 0' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Underlined link in the brand link color.' },
    arrow: { description: 'Bold link with a trailing arrow, no underline.', settings: { arrow: true, weight: 'bold', underline: false } },
  },

  previewData: { data: { label: 'Read the full story', href: 'https://example.com/journal/summer-notes' } },

  validate: (data) => (VAGUE_LINK.test(data.label) ? [`label "${data.label}" is not descriptive link text, say what the link does ("Read the full story")`] : []),

  compat: {
    outlook: 'Underline and color honored.',
    gmail: 'Fine.',
    darkMode: 'Link color swaps via dm-text where honored.',
  },
};
