const { node } = require('../scripts/lib/recipes');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars } = require('./_helpers');
const cartSection = require('../sections/cart-contents');
const features = require('../sections/feature-breakdown');
const proof = require('../sections/social-proof');
const discount = require('../sections/discount');
const cta = require('../sections/cta');

// Preheader, hero, "something left behind", cart products, benefits, social proof, optional discount, CTA, footer.
module.exports = {
  name: 'Abandoned Cart',
  description: 'Brings someone back to a cart they left: a gentle hero, the cart contents from Klaviyo event data, reassurance, an optional discount and a return-to-cart button.',
  suggestedTheme: 'ecommerce',

  fields: {
    ...FRAME_FIELDS,
    hero: {
      type: 'object',
      fields: { eyebrow: 'text', headline: { type: 'text', default: 'Something left behind' }, description: 'text' },
    },
    cart: { type: 'object', fields: cartSection.fields },
    benefits: { type: 'object', fields: features.fields },
    socialProof: { type: 'object', fields: proof.fields },
    discount: { type: 'object', fields: discount.fields },
    cta: { type: 'object', fields: cta.fields },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'Your cart is waiting, and so is free shipping over $75.',
    hero: {
      eyebrow: `Hi ${vars.get('customer.first_name')}`,
      headline: 'Something left behind',
      description: 'You left a few things in your cart. We have saved them for you.',
    },
    cart: { heading: 'Your cart', total: '{{ event.extra.total_price }}' },
    benefits: {
      heading: 'Order with confidence',
      features: [
        { title: 'Free shipping over $75', description: 'Tracked to your door.' },
        { title: '60-day returns', description: 'Free, no questions asked.' },
        { title: 'Repaired for life', description: 'We mend it free.' },
      ],
    },
    socialProof: { rating: { rating: 4.9, count: '2,000+' } },
    cta: {
      headline: 'Ready when you are',
      text: 'Your items are held for a limited time.',
      primary: { label: 'Return to your cart', href: vars.get('cart.checkout_url') },
    },
  },

  build(d, { section }) {
    const hero = d.hero || { headline: 'Something left behind' };
    return frame(d, [
      node('hero/text-only', { eyebrow: hero.eyebrow, headline: hero.headline || 'Something left behind', description: hero.description }),
      section('cart-contents', d.cart || {}),
      optional(d.benefits, (x) => section('feature-breakdown', x)),
      optional(d.socialProof, (x) => section('social-proof', x)),
      optional(d.discount, (x) => section('discount', x)),
      optional(d.cta, (x) => section('cta', x)),
    ]);
  },
};
