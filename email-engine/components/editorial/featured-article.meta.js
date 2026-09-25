const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Featured Article',
  description: 'The lead story: a large image, category, a big title, excerpt, byline and a read button.',
  level: 'section',

  fields: {
    article: { type: 'article', required: true },
  },

  settings: {
    layout: { type: 'enum', values: ['stacked', 'split'], default: 'stacked' },
    align: { type: 'alignment', default: 'left' },
    linkLabel: { type: 'text', default: 'Read the full story' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Image on top, text beneath.' },
    split: { description: 'Image beside the text.', settings: { layout: 'split' } },
    centered: { description: 'Image on top with centered text.', settings: { align: 'center' } },
  },

  previewData: {
    data: {
      article: {
        title: 'The last shirt you will need to buy this summer',
        excerpt: 'We spent two years perfecting one linen shirt. Here is what we learned, from the flax field to the final stitch.',
        image: P.img(600, 340, 'Feature', 'A linen shirt in sand hanging in a sunlit window'),
        href: 'https://example.com/journal/the-last-shirt',
        author: 'Maya Chen',
        date: '14 June',
        category: 'Feature',
        readTime: '8 min read',
      },
    },
  },

  compat: {
    outlook: 'Text and images honored. Split is a table row.',
    gmail: 'Fine. The split variant stacks on phones through a media query.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
