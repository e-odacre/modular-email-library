const { node } = require('../scripts/lib/recipes');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars } = require('./_helpers');
const cartSection = require('../sections/cart-contents');
const sellers = require('../sections/best-sellers');

// Hero, order summary, what happens next, cross-sell, support, footer.
module.exports = {
  name: 'Post-purchase',
  description: 'Thanks a customer after an order: a thank-you hero, the order summary from Klaviyo event data, what happens next, related products and a way to get help.',
  suggestedTheme: 'ecommerce',

  fields: {
    ...FRAME_FIELDS,
    hero: { type: 'object', fields: { eyebrow: 'text', headline: { type: 'text', default: 'Thank you for your order' }, description: 'text' } },
    order: { type: 'object', fields: cartSection.fields },
    nextSteps: {
      type: 'object',
      fields: { heading: 'text', steps: { type: 'features', min: 2, max: 4, required: true } },
    },
    crossSell: { type: 'object', fields: sellers.fields },
    support: { type: 'object', fields: { headline: { type: 'text', required: true }, text: 'text', cta: { type: 'cta', required: true } } },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'We have your order. Here is what happens next.',
    hero: { eyebrow: `Thanks, ${vars.get('customer.first_name')}`, headline: 'Thank you for your order', description: 'We are getting it ready. A shipping confirmation will follow.' },
    order: { heading: 'Your order', total: '{{ event.extra.total_price }}', cta: { label: 'View your order', href: 'https://example.com/account/orders' } },
    nextSteps: {
      heading: 'What happens next',
      steps: [
        { title: 'We pack it', description: 'Within two working days.' },
        { title: 'It ships', description: 'You will get a tracking link by email.' },
        { title: 'It arrives', description: 'In 2 to 4 days.' },
      ],
    },
    crossSell: { ...sellers.previewData, heading: 'You might also like', columns: 3, cardVariant: 'minimal' },
    support: { headline: 'Questions about your order?', text: 'We are here Monday to Friday, 9 to 5 PT.', cta: { label: 'Contact us', href: 'https://example.com/pages/contact' } },
  },

  build(d, { section }) {
    return frame(d, [
      node('hero/text-only', { eyebrow: d.hero && d.hero.eyebrow, headline: (d.hero && d.hero.headline) || 'Thank you for your order', description: d.hero && d.hero.description }),
      section('cart-contents', d.order || {}),
      optional(d.nextSteps, (x) => node('features/numbered-steps', x)),
      optional(d.crossSell, (x) => section('best-sellers', x)),
      optional(d.support, ({ cta, ...rest }) => section('cta', { ...rest, primary: cta, tone: 'light' })),
    ]);
  },
};
