const { P } = require('../_shared');

module.exports = {
  name: 'Article Card',
  description: 'One article: image, category, linked title, excerpt, byline and a read link.',
  level: 'content',

  fields: {
    article: { type: 'article', required: true },
  },

  settings: {
    align: { type: 'alignment', default: 'left' },
    titleLevel: { type: 'enum', values: ['h3', 'h2', 'h4'], default: 'h3' },
    showExcerpt: { type: 'boolean', default: true },
    showMeta: { type: 'boolean', default: true },
    showLink: { type: 'boolean', default: true },
    linkLabel: { type: 'text', default: 'Read the article' },
    imageRadius: { type: 'length', default: '@theme.image.radius' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Image, category, title, excerpt, byline and read link.' },
    minimal: { description: 'Image, category and title only.', settings: { showExcerpt: false, showMeta: false, showLink: false } },
    headline: { description: 'Title, byline and read link, no excerpt.', settings: { showExcerpt: false } },
    centered: { description: 'Centered text.', settings: { align: 'center' } },
  },

  previewData: {
    data: {
      article: {
        title: 'How to care for linen so it lasts a decade',
        excerpt: 'Wash it cool, dry it slow and never iron it flat. Our care guide has everything you need.',
        image: P.img(560, 360, 'Care Guide', 'A linen shirt drying on a line in the sun'),
        href: 'https://example.com/journal/caring-for-linen',
        author: 'Maya Chen',
        date: '12 June',
        category: 'Care guide',
        readTime: '4 min read',
      },
    },
  },

  compat: {
    outlook: 'Text and images honored.',
    gmail: 'Fine. The image is a real img with alt text.',
    darkMode: 'Text swaps via dm-text where honored. Title link takes the dark link color.',
  },
};
