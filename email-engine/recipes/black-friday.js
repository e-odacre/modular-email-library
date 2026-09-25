const { node } = require('../scripts/lib/recipes');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars } = require('./_helpers');
const sellers = require('../sections/best-sellers');
const discountSection = require('../sections/discount');

// Sale hero, countdown, best sellers, discount banner, product grid, last chance, footer.
module.exports = {
  name: 'Black Friday',
  description: 'The biggest sale email of the year: a shouty sale hero, a countdown, best sellers, the discount, a full product grid and a last-chance block.',
  suggestedTheme: 'black-friday',

  fields: {
    ...FRAME_FIELDS,
    hero: { type: 'object', required: true, fields: { eyebrow: 'text', headline: { type: 'text', required: true }, description: 'text', cta: 'cta' } },
    countdown: { type: 'object', fields: { headline: 'text', endsAt: { type: 'text', attr: true, required: true }, timerImage: 'url', cta: 'cta' } },
    bestSellers: { type: 'object', fields: sellers.fields },
    discount: { type: 'object', fields: discountSection.fields },
    products: { type: 'object', fields: sellers.fields },
    lastChance: { type: 'object', fields: { label: 'text', headline: { type: 'text', required: true }, text: 'text', deadline: 'text', cta: 'cta' } },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'Black Friday starts now. Up to 50% off everything.',
    hero: { eyebrow: 'Black Friday', headline: 'Up to 50% off', description: 'Four days only. Our lowest prices of the year.', cta: { label: 'Shop Black Friday', href: 'https://example.com/collections/black-friday' } },
    countdown: { headline: 'Ends Monday', endsAt: 'Monday 2 December at midnight PT', cta: { label: 'Start shopping', href: 'https://example.com/collections/black-friday' } },
    bestSellers: { ...sellers.previewData, heading: 'Best sellers, now reduced', columns: 2 },
    discount: { discount: 'Extra 10% off', headline: 'When you spend $150 or more', code: vars.get('discount.code', { coupon: 'BF10' }), expires: 'Ends Monday', cta: { label: 'Shop now', href: 'https://example.com/collections/black-friday' }, tone: 'dark' },
    products: { ...sellers.previewData, heading: 'Everything on offer', columns: 3, cardVariant: 'minimal' },
    lastChance: { label: 'Last chance', headline: 'Black Friday ends tonight', text: 'Once it is gone, it is gone.', deadline: 'Midnight PT', cta: { label: 'Shop before it is gone', href: 'https://example.com/collections/black-friday' } },
  },

  build(d, { section }) {
    return frame(d, [
      node('hero/text-only', d.hero, { variant: 'dark' }),
      optional(d.countdown, (x) => node('promotional/countdown', x)),
      optional(d.bestSellers, (x) => section('best-sellers', x)),
      optional(d.discount, (x) => section('discount', x)),
      optional(d.products, (x) => section('best-sellers', x)),
      optional(d.lastChance, (x) => node('promotional/last-chance', x)),
    ]);
  },
};
