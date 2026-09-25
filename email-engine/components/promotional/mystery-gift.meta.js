const { bandSettings, bandVariants, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Mystery Gift',
  description: 'A "spend X, get a mystery gift" block: a gift glyph, a headline, the threshold and a button.',
  level: 'section',

  fields: {
    headline: { type: 'text', required: true },
    text: 'text',
    threshold: 'text',
    cta: 'cta',
  },

  settings: bandSettings({ background: { type: 'color', default: '@colors.primary' }, buttonColor: { type: 'color', default: '@colors.primary' } }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    ...bandVariants('White text on the primary color.'),
    accent: { description: 'White text on the accent color.', settings: { background: '@colors.accent', buttonColor: '@colors.accent' } },
  },

  previewData: {
    data: {
      headline: 'A little something on us',
      text: 'Add $100 or more to your bag and we will tuck in a mystery gift.',
      threshold: 'Free gift over $100',
      cta: { label: 'Start shopping', href: 'https://example.com/collections/all' },
    },
  },

  compat: {
    outlook: 'The glyph can render as a monochrome symbol, everything else is honored.',
    gmail: 'Fine.',
    darkMode: 'Light variant swaps with the surface. Colored bands keep their colors.',
  },
};
