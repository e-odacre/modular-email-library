const { bandSettings, bandVariants, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Metric Highlight',
  description: 'One big number on a colored band with a label, a line of context and an optional button.',
  level: 'section',

  fields: {
    metric: { type: 'text', required: true },
    label: { type: 'text', required: true },
    text: 'text',
    source: 'text',
    cta: 'cta',
  },

  settings: bandSettings({
    background: { type: 'color', default: '@colors.primary' },
    buttonColor: { type: 'color', default: '@colors.primary' },
    padding: { type: 'spacing', default: '@spacing.2xl @theme.section.paddingX' },
  }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    ...bandVariants('White text on the primary color.'),
    accent: { description: 'White text on the accent color.', settings: { background: '@colors.accent', buttonColor: '@colors.accent' } },
  },

  previewData: {
    data: {
      metric: '1.2M',
      label: 'Garments repaired instead of replaced',
      text: 'Since we started our repair program, our customers have kept over a million pieces in use.',
      source: 'Based on repair orders from 2019 to 2026.',
      cta: { label: 'See how repairs work', href: 'https://example.com/pages/repairs' },
    },
  },

  compat: {
    outlook: 'Tables and text honored.',
    gmail: 'Fine.',
    darkMode: 'Light variant swaps with the surface. Colored bands keep their colors.',
  },
};
