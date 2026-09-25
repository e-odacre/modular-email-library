const { node } = require('../scripts/lib/recipes');

// The closing call to action.
module.exports = {
  name: 'Call to Action',
  description: 'A headline, a line of text and one or two buttons on a colored band.',

  fields: {
    headline: { type: 'text', required: true },
    text: 'text',
    primary: { type: 'cta', required: true },
    secondary: 'cta',
    tone: { type: 'enum', values: ['default', 'dark', 'urgent', 'light', 'accent'], default: 'default' },
  },

  previewData: {
    headline: 'Ready to find your summer uniform?',
    text: 'Free shipping over $75, free returns for 60 days.',
    primary: { label: 'Shop the collection', href: 'https://example.com/collections/summer' },
  },

  build({ tone, ...d }) {
    return [node('saas/cta-section', d, { variant: tone })];
  },
};
