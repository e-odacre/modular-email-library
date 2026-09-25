const { node, when } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');

// A rating summary and a testimonial. Either can be left out.
module.exports = {
  name: 'Social Proof',
  description: 'A rating summary (stars, score, review count) and a customer testimonial.',

  fields: {
    heading: 'text',
    rating: {
      type: 'object',
      fields: { rating: { type: 'number', min: 0, max: 5, required: true }, outOf: { type: 'number', default: 5 }, count: 'text', source: 'text' },
    },
    testimonial: {
      type: 'object',
      fields: { quote: { type: 'text', required: true }, name: { type: 'text', required: true }, title: 'text', avatar: 'image', rating: { type: 'number', min: 0, max: 5 } },
    },
  },

  previewData: {
    heading: 'Loved by thousands',
    rating: { rating: 4.9, count: '2,000+', source: 'Trustpilot' },
    testimonial: {
      quote: 'I have washed this shirt forty times and it just keeps getting softer. Easily the best linen I own.',
      name: 'Priya N.',
      title: 'Verified buyer, Portland',
      avatar: P.img(160, 160, 'Priya', 'Portrait of Priya N.'),
    },
  },

  build(d) {
    const top = [];
    if (d.heading) top.push(node('content/heading', { text: d.heading }, { settings: { level: 'h2', align: 'center', padding: '@spacing.sm' } }));
    if (d.rating) top.push(node('social-proof/rating', d.rating));
    return [
      ...when(top.length, node('layout/section', { content: top }, { variant: 'tinted' })),
      ...when(d.testimonial, node('social-proof/testimonial', d.testimonial || {}, { variant: 'tinted' })),
    ];
  },
};
