const { bandSettings, bandVariants, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'CTA Section',
  description: 'The closing call to action: a headline, a line of text and one or two buttons on a colored band.',
  level: 'section',

  fields: {
    headline: { type: 'text', required: true },
    text: 'text',
    primary: { type: 'cta', required: true },
    secondary: 'cta',
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
      headline: 'Ready to try it with your team?',
      text: 'Start free for 14 days. No credit card, cancel any time.',
      primary: { label: 'Start your free trial', href: 'https://example.com/signup' },
      secondary: { label: 'Book a demo', href: 'https://example.com/demo' },
    },
  },

  compat: {
    outlook: 'Tables and text honored. Rounded button corners are square.',
    gmail: 'Fine. Side-by-side buttons wrap when the column is narrow.',
    darkMode: 'Light variant swaps with the surface. Colored bands keep their colors.',
  },
};
