const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Testimonial',
  description: 'A customer quote with their name, title and an optional avatar and star rating.',
  level: 'section',

  fields: {
    quote: { type: 'text', required: true },
    name: { type: 'text', required: true },
    title: 'text',
    avatar: 'image',
    rating: { type: 'number', min: 0, max: 5 },
  },

  settings: {
    layout: { type: 'enum', values: ['centered', 'bar'], default: 'centered' },
    align: { type: 'alignment', default: 'center' },
    frame: { type: 'enum', values: ['default', 'card', 'tinted'], default: 'default' },
    avatarSize: { type: 'length', default: '72px' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Centered quote with a large quote mark.' },
    bar: { description: 'Left-aligned quote with an accent bar.', settings: { layout: 'bar', align: 'left' } },
    card: { description: 'Centered quote in a bordered card.', settings: { frame: 'card' } },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      quote: 'I have washed this shirt forty times and it just keeps getting softer. Easily the best linen I own.',
      name: 'Priya N.',
      title: 'Verified buyer, Portland',
      avatar: P.img(160, 160, 'Priya', 'Portrait of Priya N.'),
      rating: 5,
    },
  },

  compat: {
    outlook: 'Text and layout honored. Circular avatar renders square.',
    gmail: 'Fine.',
    darkMode: 'Text and background swap via dm-* classes on the brand surface or background.',
  },
};
