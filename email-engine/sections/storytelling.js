const { node, when } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');

// An image, a headline, a few paragraphs and a button, as a story.
module.exports = {
  name: 'Storytelling',
  description: 'An image, a headline, a few paragraphs, an optional pull quote and a button.',

  fields: {
    eyebrow: 'text',
    heading: { type: 'text', required: true },
    paragraphs: { type: 'listItems', min: 1, max: 6, required: true },
    quote: 'text',
    quoteAuthor: 'text',
    image: 'image',
    cta: 'cta',
  },

  previewData: {
    eyebrow: 'Our story',
    heading: 'It started with one shirt and a stubborn idea',
    paragraphs: [
      'In 2016 we could not find a linen shirt that survived a single summer, so we made one that would.',
      'Ten years later we still make every shirt the same way: slowly, in small batches, with the people who sew them.',
    ],
    quote: 'If it does not last, it does not leave the workshop.',
    quoteAuthor: 'Maya, co-founder',
    image: P.img(480, 320, 'Founders', 'Two founders standing in their workshop holding a linen shirt'),
    cta: { label: 'Read our story', href: 'https://example.com/pages/about' },
  },

  build({ cta, ...story }) {
    return [
      node('editorial/storytelling', story),
      ...when(cta, node('layout/section', { content: [node('content/button', cta || {}, { settings: { padding: '0' } })] }, { settings: { padding: '0 @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' } })),
    ];
  },
};
