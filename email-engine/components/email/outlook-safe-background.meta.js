const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Outlook-safe Background',
  description: 'A section with a background photo and a VML fallback so it also shows in Outlook desktop.',
  level: 'section',

  fields: {
    image: { type: 'url', required: true },
    content: { type: 'slot', accepts: 'content', required: true },
  },

  settings: {
    background: { type: 'color', default: '@colors.primary' },
    padding: { type: 'spacing', default: '@spacing.3xl @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Photo behind centered content, on the primary color when blocked.' },
    tinted: { description: 'Falls back to the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      image: 'https://placehold.co/1200x600/png?text=Photo',
      content: [
        P.node('content/heading', { text: 'Find your summer uniform' }, { level: 'h2', align: 'center', color: '@colors.primaryText', darkMode: false }),
        P.node('content/button', { label: 'Shop the collection', href: 'https://example.com/collections/summer' }, { background: '@colors.primaryText', color: '@colors.primary', darkMode: 'none' }),
      ],
    },
  },

  compat: {
    outlook: 'Background image via VML.',
    gmail: 'Background images can be dropped, the solid color shows.',
    darkMode: 'Keeps its own colors.',
  },
};
