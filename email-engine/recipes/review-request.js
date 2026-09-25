const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars } = require('./_helpers');

// Hero, the product to review, a review button, an optional incentive, footer.
module.exports = {
  name: 'Review Request',
  description: 'Asks a customer to review something they bought: a friendly hero, the product, a review button and an optional thank-you incentive.',
  suggestedTheme: 'minimal',

  fields: {
    ...FRAME_FIELDS,
    hero: { type: 'object', fields: { eyebrow: 'text', headline: { type: 'text', default: 'How is your order?' }, description: 'text' } },
    product: {
      type: 'object',
      required: true,
      fields: { image: { type: 'image', required: true }, name: { type: 'text', required: true }, description: 'text', cta: { type: 'cta', required: true } },
    },
    incentive: { type: 'object', fields: { text: { type: 'text', required: true }, code: 'text', expires: 'text' } },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'Two minutes of your time helps other shoppers choose.',
    hero: { eyebrow: `Hi ${vars.get('customer.first_name')}`, headline: 'How is your order?', description: 'You have had it a couple of weeks now. We would love to hear what you think.' },
    product: {
      image: P.img(560, 480, 'Linen Shirt', 'The Coastal linen shirt in sand, front view'),
      name: 'The Coastal Linen Shirt',
      description: 'Tell us about the fit, the fabric and how you wear it.',
      cta: { label: 'Write a review', href: 'https://example.com/account/reviews/new' },
    },
    incentive: { text: 'Leave a review and get 10% off your next order.', code: vars.get('discount.code', { coupon: 'THANKS10' }), expires: `Valid until ${vars.get('discount.expires', { days: '30' })}` },
  },

  build(d) {
    const hero = d.hero || {};
    return frame(d, [
      node('hero/text-only', { eyebrow: hero.eyebrow, headline: hero.headline || 'How is your order?', description: hero.description }),
      node('hero/product', d.product),
      optional(d.incentive, (x) => [
        node('layout/section', { content: [node('content/text', { text: x.text }, { settings: { align: 'center' } }), ...(x.code ? [node('promotional/discount-code', { code: x.code, expires: x.expires })] : [])] }, { variant: 'tinted' }),
      ]),
    ]);
  },
};
