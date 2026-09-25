const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Editorial Image',
  description: 'A full-width photograph with a caption and credit underneath.',
  level: 'section',

  fields: {
    image: { type: 'image', required: true },
    caption: 'text',
    credit: 'text',
  },

  settings: {
    captionAlign: { type: 'alignment', default: 'left' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '0 0 @spacing.md 0' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Edge-to-edge image, left-aligned caption.' },
    framed: { description: 'Inset with side padding and a centered caption.', settings: { padding: '@spacing.md @theme.section.paddingX', captionAlign: 'center' } },
  },

  previewData: {
    data: {
      image: P.img(600, 400, 'Terrace', 'Guests at a long table on a sunlit terrace'),
      caption: 'Lunch on the terrace at the summer shoot in Lisbon.',
      credit: 'Photo: Elena Ruiz',
    },
  },

  compat: {
    outlook: 'Honored.',
    gmail: 'Fine. Alt text describes the image if blocked.',
    darkMode: 'Caption swaps via dm-muted where honored, image not recolored.',
  },
};
