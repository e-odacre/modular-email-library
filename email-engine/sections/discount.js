const { node } = require('../scripts/lib/recipes');

// A discount: the value, a code and a button. The code can be a Klaviyo unique-coupon tag from ctx.vars.
module.exports = {
  name: 'Discount',
  description: 'A discount banner with the value, an optional code and expiry, and a button.',

  fields: {
    discount: { type: 'text', required: true },
    headline: 'text',
    text: 'text',
    code: 'text',
    expires: 'text',
    cta: 'cta',
    tone: { type: 'enum', values: ['default', 'dark', 'urgent', 'light'], default: 'default' },
  },

  previewData: {
    discount: '25% off',
    headline: 'Everything in the summer edit',
    text: 'Linen, cotton and canvas, all reduced until Sunday.',
    code: 'SUMMER25',
    expires: 'Ends Sunday at midnight',
    cta: { label: 'Shop the sale', href: 'https://example.com/collections/sale' },
  },

  build({ tone, ...d }) {
    return [node('promotional/discount-banner', d, { variant: tone })];
  },
};
