const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Event Block',
  description: 'An event: title, date, time, location, description, speaker and a button, with the details as a label/value table.',
  level: 'section',

  fields: {
    eyebrow: 'text',
    title: { type: 'text', required: true },
    date: { type: 'text', required: true },
    time: 'text',
    location: 'text',
    description: 'text',
    speaker: 'text',
    cta: 'cta',
  },

  settings: {
    align: { type: 'alignment', default: 'left' },
    background: { type: 'color', default: '@colors.surface' },
    textColor: { type: 'text', attr: true, default: '@colors.primaryText' },
    buttonBackground: { type: 'color', default: '@colors.primary' },
    buttonColor: { type: 'color', default: '@colors.primaryText' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
    gap: { type: 'length', default: '@spacing.md' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Left-aligned event on the surface color.' },
    centered: { description: 'Centered event.', settings: { align: 'center' } },
    dark: {
      description: 'White text on the primary color.',
      settings: { background: '@colors.primary', buttonBackground: '@colors.primaryText', buttonColor: '@colors.primary' },
    },
  },

  previewData: {
    data: {
      eyebrow: 'Live workshop',
      title: 'Natural dyeing for beginners',
      date: 'Saturday 20 June 2026',
      time: '11:00 am to 1:00 pm PT',
      location: 'Our Portland studio, 214 Alder Street',
      description: 'Learn to dye linen with plants you can grow at home. All materials and a take-home swatch set are included.',
      speaker: 'Elena Ruiz, textile artist',
      cta: { label: 'Reserve my place', href: 'https://example.com/events/natural-dyeing' },
    },
  },

  compat: {
    outlook: 'Honored, the details are a plain table.',
    gmail: 'Fine.',
    darkMode: 'Swaps via dm-* classes on the brand surface. The dark variant keeps its colors.',
  },
};
