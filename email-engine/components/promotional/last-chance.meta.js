const { bandSettings, bandVariants, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Last Chance',
  description: 'The final-reminder block: a "Last chance" label, a display headline, a line of text, the deadline and a button.',
  level: 'section',

  fields: {
    label: { type: 'text', default: 'Last chance' },
    headline: { type: 'text', required: true },
    text: 'text',
    deadline: 'text',
    cta: 'cta',
  },

  settings: bandSettings({
    background: { type: 'color', default: '@colors.primary' },
    buttonColor: { type: 'color', default: '@colors.primary' },
    padding: { type: 'spacing', default: '@spacing.2xl @theme.section.paddingX' },
  }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    ...bandVariants('White text on the primary brand color.'),
    accent: { description: 'White text on the accent color.', settings: { background: '@colors.accent', buttonColor: '@colors.accent' } },
  },

  previewData: {
    data: {
      label: 'Last chance',
      headline: 'Sale ends tonight',
      text: 'Up to 40% off the summer edit. Once it is gone, it is gone.',
      deadline: 'Midnight PT',
      cta: { label: 'Shop before it is gone', href: 'https://example.com/collections/sale' },
    },
  },

  compat: {
    outlook: 'Tables and text honored.',
    gmail: 'Fine.',
    darkMode: 'Light variant swaps with the surface. Colored bands keep their colors.',
  },
};
