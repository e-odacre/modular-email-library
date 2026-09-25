const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Blog Post Preview',
  description: 'A compact post teaser: a small image beside the title, a short excerpt and a read link.',
  level: 'section',

  fields: {
    article: { type: 'article', required: true },
  },

  settings: {
    imagePosition: { type: 'enum', values: ['left', 'right'], default: 'left' },
    linkLabel: { type: 'text', default: 'Read the post' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@spacing.md @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Small image on the left.' },
    'image-right': { description: 'Small image on the right.', settings: { imagePosition: 'right' } },
  },

  previewData: {
    data: {
      article: {
        title: 'Why we stopped using polyester thread',
        excerpt: 'A small change that makes every repair last longer.',
        image: P.img(220, 220, 'Thread', 'Spools of natural cotton thread on a wooden shelf'),
        href: 'https://example.com/journal/thread',
        category: 'Materials',
      },
    },
  },

  validate: (data) => (data.article.image ? [] : ['article.image is required for the preview layout']),

  compat: {
    outlook: 'Side by side as a table row.',
    gmail: 'Fine. Stacks on phones through a media query.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
