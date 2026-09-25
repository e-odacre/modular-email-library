const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Benefits',
  description: 'A heading and a checklist of benefits, with an optional image beside it and a button.',
  level: 'section',

  fields: {
    heading: 'text',
    intro: 'text',
    items: { type: 'listItems', min: 1, max: 8, required: true },
    image: 'image',
    cta: 'cta',
  },

  settings: {
    imagePosition: { type: 'enum', values: ['right', 'left'], default: 'right' },
    split: { type: 'text', attr: true, default: '55/45' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Benefits on the left, image on the right.' },
    'image-left': { description: 'Image on the left, benefits on the right.', settings: { imagePosition: 'left', split: '45/55' } },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      heading: 'Made to last',
      intro: 'Every piece is built to be worn for years, not seasons.',
      items: ['Organic cotton and European linen', 'Pre-washed so it fits the same after washing', 'Free repairs for life', 'Made in a family-run workshop in Portugal'],
      image: P.img(480, 520, 'Workshop', 'A tailor stitching a linen shirt at a workshop bench'),
      cta: { label: 'Read our story', href: 'https://example.com/pages/about' },
    },
    byVariant: { tinted: { data: { heading: 'Made to last', items: ['Organic cotton and European linen', 'Free repairs for life', 'Made in Portugal'], cta: { label: 'Read our story', href: 'https://example.com/pages/about' } } } },
  },

  compat: {
    outlook: 'Side by side as a table row with an image. Check marks are text glyphs.',
    gmail: 'Stacking works. Non-Google Gmail accounts show the desktop layout on phones.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
