const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');

// A checklist of benefits with an optional image.
module.exports = {
  name: 'Benefits',
  description: 'A heading and a checklist of benefits, with an optional image and a button.',

  fields: {
    heading: 'text',
    intro: 'text',
    items: { type: 'listItems', min: 1, max: 8, required: true },
    image: 'image',
    cta: 'cta',
  },

  previewData: {
    heading: 'Made to last',
    intro: 'Every piece is built to be worn for years, not seasons.',
    items: ['Organic cotton and European linen', 'Pre-washed so it fits the same after washing', 'Free repairs for life'],
    image: P.img(480, 520, 'Workshop', 'A tailor stitching a linen shirt at a workshop bench'),
    cta: { label: 'Read our story', href: 'https://example.com/pages/about' },
  },

  build: (d) => [node('features/benefits', d)],
};
