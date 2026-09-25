const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Image + Article',
  description: 'An image with the article text: heading, byline, body copy and an optional button. Image on top or beside the text.',
  level: 'section',

  fields: {
    image: { type: 'image', required: true },
    heading: { type: 'text', required: true },
    byline: 'text',
    body: { type: 'richtext', required: true },
    cta: 'cta',
  },

  settings: {
    layout: { type: 'enum', values: ['top', 'left', 'right'], default: 'top' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Image on top.' },
    'image-left': { description: 'Image on the left of the text.', settings: { layout: 'left' } },
    'image-right': { description: 'Image on the right of the text.', settings: { layout: 'right' } },
  },

  previewData: {
    data: {
      image: P.img(600, 320, 'Harvest', 'Flax fields in bloom under a pale morning sky'),
      heading: 'From flax field to finished shirt',
      byline: 'By Maya Chen, 14 June',
      body: '<p>Every linen shirt starts as a blue-flowered field in Normandy. After harvest the stalks are left to ret in the dew, then scutched, combed and spun.</p><p>The whole process takes about eight months, and almost none of it is automated.</p>',
      cta: { label: 'Read the full story', href: 'https://example.com/journal/flax-to-shirt' },
    },
  },

  compat: {
    outlook: 'Text and images honored. Side variants are a table row.',
    gmail: 'Fine. Side variants stack on phones through a media query.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
