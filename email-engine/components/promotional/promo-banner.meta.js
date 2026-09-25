const { bandSettings, bandVariants, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Promo Banner',
  description: 'A compact promotional band: eyebrow, headline, a line of text and a button.',
  level: 'section',

  fields: {
    eyebrow: 'text',
    headline: { type: 'text', required: true },
    text: 'text',
    cta: 'cta',
  },

  settings: bandSettings({ padding: { type: 'spacing', default: '@spacing.xl @theme.section.paddingX' } }),

  responsive: SECTION_RESPONSIVE,

  variants: bandVariants('White text on the accent color.'),

  previewData: {
    data: {
      eyebrow: 'The gift edit',
      headline: 'Gifts they will actually use',
      text: 'Wrapped free, delivered in time for the weekend.',
      cta: { label: 'Shop gifts', href: 'https://example.com/collections/gifts' },
    },
  },

  compat: {
    outlook: 'Tables and text honored.',
    gmail: 'Fine.',
    darkMode: 'Light variant swaps with the surface. Colored bands keep their colors.',
  },
};
