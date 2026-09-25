const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Standard Hero',
  description: 'Eyebrow, headline, description and button, with an image below or above the text.',
  level: 'section',

  fields: {
    eyebrow: 'text',
    headline: { type: 'text', required: true },
    description: 'text',
    cta: 'cta',
    image: 'image',
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.surface' },
    textColor: { type: 'text', attr: true, default: '@colors.primaryText' },
    eyebrowColor: { type: 'text', attr: true, default: '@colors.primaryText' },
    buttonBackground: { type: 'color', default: '@colors.primary' },
    buttonColor: { type: 'color', default: '@colors.primaryText' },
    headingLevel: { type: 'enum', values: ['h1', 'display', 'h2'], default: 'h1' },
    imagePosition: { type: 'enum', values: ['below', 'above'], default: 'below' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
    gap: { type: 'length', default: '@spacing.md' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Centered text with the image below.' },
    'image-first': { description: 'The image above the text.', settings: { imagePosition: 'above' } },
    left: { description: 'Left-aligned text, image below.', settings: { align: 'left' } },
    dark: {
      description: 'White text on the primary brand color.',
      settings: { background: '@colors.primary', buttonBackground: '@colors.primaryText', buttonColor: '@colors.primary' },
    },
  },

  previewData: {
    data: {
      eyebrow: 'New for summer',
      headline: 'Summer Collection',
      description: 'Made for slower mornings and warmer days. Breathable linens and washed cottons, ready when you are.',
      cta: { label: 'Shop the collection', href: 'https://example.com/collections/summer' },
      image: P.img(600, 340, 'Summer', 'A linen shirt, canvas tote and sun hat laid out on a sunny bench'),
    },
  },

  compat: {
    outlook: 'Tables and text, all honored. Rounded image corners ignored.',
    gmail: 'Fine. The image is a real img, never a background.',
    darkMode: 'Swaps on the brand surface or background. Keeps its colors on a colored background.',
  },
};
