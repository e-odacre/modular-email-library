const { bandSettings, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Urgency Banner',
  description: 'A band that says time is running out: the deadline, a headline, a line of text and a button. Use only for real deadlines.',
  level: 'section',

  fields: {
    deadline: { type: 'text', required: true },
    headline: { type: 'text', required: true },
    text: 'text',
    cta: 'cta',
  },

  settings: bandSettings({
    background: { type: 'color', default: '@colors.error' },
    buttonColor: { type: 'color', default: '@colors.error' },
  }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'White text on the error (red) color.' },
    dark: { description: 'White text on the primary brand color.', settings: { background: '@colors.primary', buttonColor: '@colors.primary' } },
    accent: { description: 'White text on the accent color.', settings: { background: '@colors.accent', buttonColor: '@colors.accent' } },
    light: {
      description: 'Dark text on the surface color.',
      settings: { background: '@colors.surface', textColor: '@colors.text', buttonBackground: '@colors.primary', buttonColor: '@colors.primaryText' },
    },
  },

  previewData: {
    data: {
      deadline: 'Ends tonight at midnight',
      headline: 'Your 25% off is about to expire',
      text: 'The summer edit goes back to full price tomorrow.',
      cta: { label: 'Use my discount', href: 'https://example.com/collections/summer' },
    },
  },

  compat: {
    outlook: 'Tables and text honored.',
    gmail: 'Fine.',
    darkMode: 'Light variant swaps with the surface. Colored bands keep their colors.',
  },
};
