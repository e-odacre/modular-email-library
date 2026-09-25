const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');

const icon = (label, alt) => ({ src: P.img(96, 96, label, alt).src, alt, decorative: true });

// A heading, a grid of features and an optional button.
module.exports = {
  name: 'Feature Breakdown',
  description: 'A heading, a grid of 2 to 4 features and an optional button.',

  fields: {
    heading: 'text',
    intro: 'text',
    features: { type: 'features', min: 1, max: 8, required: true },
    cta: 'cta',
    columns: { type: 'enum', values: [3, 2, 4], default: 3 },
  },

  previewData: {
    heading: 'Why you will love it',
    intro: 'Everything we make comes with a promise.',
    features: [
      { icon: icon('Ship', 'Shipping'), title: 'Free shipping', description: 'On every order over $75.' },
      { icon: icon('Return', 'Returns'), title: '60-day returns', description: 'Not right? Send it back free.' },
      { icon: icon('Repair', 'Repairs'), title: 'Repaired for life', description: 'We mend it free, for good.' },
    ],
    cta: { label: 'Read our promise', href: 'https://example.com/pages/promise' },
  },

  build({ columns, ...d }) {
    const variant = { 2: 'two-feature', 3: 'default', 4: 'four-feature' }[columns];
    return [node('features/feature-grid', d, { variant })];
  },
};
