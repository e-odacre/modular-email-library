const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars } = require('./_helpers');
const intro = require('../sections/product-introduction');
const story = require('../sections/storytelling');
const features = require('../sections/feature-breakdown');
const sellers = require('../sections/best-sellers');
const proof = require('../sections/social-proof');
const cta = require('../sections/cta');

// Preheader, hero, brand introduction, benefits, best sellers, social proof, CTA, footer.
module.exports = {
  name: 'Welcome Email',
  description: 'Greets a new subscriber: hero, brand introduction, benefits, best sellers, social proof and a closing call to action.',
  suggestedTheme: 'minimal',

  fields: {
    ...FRAME_FIELDS,
    hero: { type: 'object', required: true, fields: intro.fields },
    brandIntro: { type: 'object', fields: story.fields },
    benefits: { type: 'object', fields: features.fields },
    bestSellers: { type: 'object', fields: sellers.fields },
    socialProof: { type: 'object', fields: proof.fields },
    cta: { type: 'object', fields: cta.fields },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'Thanks for joining. Here is 10% off your first order.',
    hero: {
      eyebrow: `Welcome, ${vars.get('customer.first_name')}`,
      headline: `Welcome to ${vars.get('brand.name')}`,
      description: 'Clothes made to be worn for years. Here is what to expect, and a little something to get you started.',
      cta: { label: 'Start exploring', href: vars.get('brand.url') },
      image: P.img(600, 340, 'Welcome', 'A linen shirt, canvas tote and sun hat laid out on a sunlit bench'),
    },
    brandIntro: story.previewData,
    benefits: features.previewData,
    bestSellers: sellers.previewData,
    socialProof: proof.previewData,
    cta: { headline: 'Your 10% welcome discount', text: 'Use it on your first order, it is on us.', primary: { label: 'Shop now', href: vars.get('brand.url') } },
  },

  build(d, { section }) {
    return frame(d, [
      section('product-introduction', d.hero),
      optional(d.brandIntro, (x) => section('storytelling', x)),
      optional(d.benefits, (x) => section('feature-breakdown', x)),
      optional(d.bestSellers, (x) => section('best-sellers', x)),
      optional(d.socialProof, (x) => section('social-proof', x)),
      optional(d.cta, (x) => section('cta', x)),
    ]);
  },
};
