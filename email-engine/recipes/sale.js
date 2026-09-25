const { node } = require('../scripts/lib/recipes');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars } = require('./_helpers');
const sellers = require('../sections/best-sellers');
const features = require('../sections/feature-breakdown');
const urgency = require('../sections/urgency');
const discountSection = require('../sections/discount');
const cta = require('../sections/cta');

// Preheader, sale hero, discount, countdown, product grid, benefits, urgency, CTA, footer.
module.exports = {
  name: 'Sale',
  description: 'A sale email: a sale hero, the discount and code, a countdown, the products on sale, reassurance, a last urgency nudge and a call to action.',
  suggestedTheme: 'ecommerce',

  fields: {
    ...FRAME_FIELDS,
    hero: { type: 'object', required: true, fields: { eyebrow: 'text', headline: { type: 'text', required: true }, description: 'text', cta: 'cta' } },
    discount: { type: 'object', fields: discountSection.fields },
    countdown: { type: 'object', fields: { headline: 'text', endsAt: { type: 'text', attr: true, required: true }, timerImage: 'url', cta: 'cta' } },
    products: { type: 'object', fields: sellers.fields },
    freeShipping: { type: 'object', fields: { text: { type: 'text', required: true }, remaining: 'text', progress: { type: 'number', min: 0, max: 100 } } },
    benefits: { type: 'object', fields: features.fields },
    urgency: { type: 'object', fields: urgency.fields },
    cta: { type: 'object', fields: cta.fields },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'Up to 40% off the summer edit, this weekend only.',
    hero: { eyebrow: 'The summer sale', headline: 'Up to 40% off', description: 'Our biggest sale of the season. Ends Sunday at midnight.', cta: { label: 'Shop the sale', href: 'https://example.com/collections/sale' } },
    discount: { ...discountSection.previewData, code: vars.get('discount.code', { coupon: 'SUMMER25' }), expires: `Ends ${vars.get('discount.expires', { days: '3' })}` },
    countdown: { headline: 'The sale ends soon', endsAt: 'Sunday 30 June at midnight PT', cta: { label: 'Shop before it ends', href: 'https://example.com/collections/sale' } },
    products: { ...sellers.previewData, heading: 'On sale now', columns: 3, cardVariant: 'minimal' },
    freeShipping: { text: 'Free shipping on orders over $75' },
    benefits: features.previewData,
    urgency: { ...urgency.previewData, style: 'banner' },
    cta: { headline: 'Do not miss it', text: 'Prices go back up on Monday.', primary: { label: 'Shop the sale', href: 'https://example.com/collections/sale' } },
  },

  build(d, { section }) {
    return frame(d, [
      node('hero/text-only', d.hero, { variant: 'accent' }),
      optional(d.discount, (x) => section('discount', x)),
      optional(d.countdown, (x) => node('promotional/countdown', x)),
      optional(d.products, (x) => section('best-sellers', x)),
      optional(d.freeShipping, (x) => node('promotional/free-shipping', x, { variant: 'default' })),
      optional(d.benefits, (x) => section('feature-breakdown', x)),
      optional(d.urgency, (x) => section('urgency', x)),
      optional(d.cta, (x) => section('cta', x)),
    ]);
  },
};
