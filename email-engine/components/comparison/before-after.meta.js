const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Before / After',
  description: 'Two images side by side, labelled Before and After, with a caption under each. They stack on phones.',
  level: 'section',

  fields: {
    heading: 'text',
    before: {
      type: 'object',
      required: true,
      fields: { image: { type: 'image', required: true }, label: { type: 'text', default: 'Before' }, caption: 'text' },
    },
    after: {
      type: 'object',
      required: true,
      fields: { image: { type: 'image', required: true }, label: { type: 'text', default: 'After' }, caption: 'text' },
    },
  },

  settings: {
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Before on the left, After on the right.' },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      heading: 'One repair, good as new',
      before: { image: P.img(280, 280, 'Before', 'A linen shirt with a torn elbow'), caption: 'Torn elbow after six years of wear.' },
      after: { image: P.img(280, 280, 'After', 'The same shirt with an invisible woven repair on the elbow'), caption: 'Invisibly mended in our workshop, free.' },
    },
  },

  compat: {
    outlook: 'Two columns as a table row.',
    gmail: 'Stacking works. Non-Google Gmail accounts show the desktop layout on phones.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
