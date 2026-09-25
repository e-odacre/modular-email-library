const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Storytelling',
  description: 'A narrative section in a reading-width column: eyebrow, heading, paragraphs, an optional pull quote and an optional image.',
  level: 'section',

  fields: {
    eyebrow: 'text',
    heading: { type: 'text', required: true },
    paragraphs: { type: 'listItems', min: 1, max: 6, required: true },
    quote: 'text',
    quoteAuthor: 'text',
    image: 'image',
  },

  settings: {
    align: { type: 'alignment', default: 'left' },
    imagePosition: { type: 'enum', values: ['top', 'bottom'], default: 'top' },
    maxWidth: { type: 'length', default: '480px' },
    background: { type: 'color', default: '@colors.surface' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Left-aligned story with the image on top.' },
    centered: { description: 'Centered story.', settings: { align: 'center' } },
    'image-last': { description: 'The image after the story.', settings: { imagePosition: 'bottom' } },
  },

  previewData: {
    data: {
      eyebrow: 'Our story',
      heading: 'It started with one shirt and a stubborn idea',
      paragraphs: [
        'In 2016 we could not find a linen shirt that survived a single summer, so we made one that would.',
        'Ten years and a lot of prototypes later, we still make every shirt the same way: slowly, in small batches, and with the people who sew them.',
      ],
      quote: 'If it does not last, it does not leave the workshop.',
      quoteAuthor: 'Maya, co-founder',
      image: P.img(480, 320, 'Founders', 'Two founders standing in their workshop holding a linen shirt'),
    },
  },

  compat: {
    outlook: 'Honored, a padded section with text.',
    gmail: 'Fine.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
