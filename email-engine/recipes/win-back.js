const { node } = require('../scripts/lib/recipes');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars } = require('./_helpers');
const discountSection = require('../sections/discount');
const sellers = require('../sections/best-sellers');
const proof = require('../sections/social-proof');
const cta = require('../sections/cta');

// Hero, discount, best sellers, social proof, CTA, footer.
module.exports = {
  name: 'Win-back',
  description: 'Re-engages someone who has not bought in a while: a warm hero, a reason to return, what is popular, social proof and a call to action.',
  suggestedTheme: 'wellness',

  fields: {
    ...FRAME_FIELDS,
    hero: { type: 'object', required: true, fields: { eyebrow: 'text', headline: { type: 'text', required: true }, description: 'text', cta: 'cta' } },
    discount: { type: 'object', fields: discountSection.fields },
    bestSellers: { type: 'object', fields: sellers.fields },
    socialProof: { type: 'object', fields: proof.fields },
    cta: { type: 'object', fields: cta.fields },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'It has been a while. Here is 15% off to welcome you back.',
    hero: {
      eyebrow: `We miss you, ${vars.get('customer.first_name')}`,
      headline: 'Come back to something you liked',
      description: 'A lot has changed since your last visit. We have new linens, a new workshop and a small thank-you waiting.',
      cta: { label: 'See what is new', href: 'https://example.com/collections/new' },
    },
    discount: { discount: '15% off', headline: 'A welcome-back gift', text: 'On your next order, no minimum.', code: vars.get('discount.code', { coupon: 'BACK15' }), expires: `Valid until ${vars.get('discount.expires', { days: '14' })}`, cta: { label: 'Use my discount', href: 'https://example.com/collections/all' } },
    bestSellers: { ...sellers.previewData, heading: 'What everyone is wearing', columns: 2 },
    socialProof: proof.previewData,
    cta: { headline: 'Ready when you are', text: 'Your discount is waiting.', primary: { label: 'Shop now', href: vars.get('brand.url') } },
  },

  build(d, { section }) {
    return frame(d, [
      node('hero/text-only', d.hero, { variant: 'dark' }),
      optional(d.discount, (x) => section('discount', x)),
      optional(d.bestSellers, (x) => section('best-sellers', x)),
      optional(d.socialProof, (x) => section('social-proof', x)),
      optional(d.cta, (x) => section('cta', x)),
    ]);
  },
};
