const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Text-only Hero',
  description: 'A large, typography-led hero with no image: display headline, description and button.',
  level: 'section',

  fields: {
    eyebrow: 'text',
    headline: { type: 'text', required: true },
    description: 'text',
    cta: 'cta',
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.surface' },
    textColor: { type: 'text', attr: true, default: '@colors.primaryText' },
    eyebrowColor: { type: 'text', attr: true, default: '@colors.primaryText' },
    buttonBackground: { type: 'color', default: '@colors.primary' },
    buttonColor: { type: 'color', default: '@colors.primaryText' },
    padding: { type: 'spacing', default: '@spacing.3xl @theme.section.paddingX @spacing.3xl @theme.section.paddingX' },
    gap: { type: 'length', default: '@spacing.md' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Display headline on the surface color.' },
    dark: {
      description: 'White text on the primary brand color.',
      settings: { background: '@colors.primary', buttonBackground: '@colors.primaryText', buttonColor: '@colors.primary' },
    },
    accent: {
      description: 'White text on the accent color.',
      settings: { background: '@colors.accent', buttonBackground: '@colors.white', buttonColor: '@colors.accent' },
    },
    left: { description: 'Left-aligned display headline.', settings: { align: 'left' } },
  },

  previewData: {
    data: {
      eyebrow: 'This weekend only',
      headline: 'Up to 40% off the summer edit',
      description: 'Our biggest sale of the season. Ends Sunday at midnight.',
      cta: { label: 'Shop the sale', href: 'https://example.com/collections/sale' },
    },
  },

  compat: {
    outlook: 'Text and colors honored.',
    gmail: 'Fine, no image to drop.',
    darkMode: 'Swaps on the brand surface. Dark and accent variants keep their colors.',
  },
};
