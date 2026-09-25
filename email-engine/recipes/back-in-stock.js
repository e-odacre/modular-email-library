const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars } = require('./_helpers');
const urgency = require('../sections/urgency');
const sellers = require('../sections/best-sellers');

// Product hero, urgency, related products, CTA, footer.
module.exports = {
  name: 'Back in Stock',
  description: 'Tells someone that an item they wanted is back: the product front and center, a nudge that stock is limited and related products.',
  suggestedTheme: 'ecommerce',

  fields: {
    ...FRAME_FIELDS,
    product: {
      type: 'object',
      required: true,
      fields: { image: { type: 'image', required: true }, eyebrow: { type: 'text', default: 'Back in stock' }, name: { type: 'text', required: true }, description: 'text', price: 'text', salePrice: 'text', discount: 'text', cta: { type: 'cta', required: true } },
    },
    urgency: { type: 'object', fields: urgency.fields },
    related: { type: 'object', fields: sellers.fields },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'The Coastal Linen Shirt is back, and sizes go quickly.',
    product: {
      image: P.img(600, 480, 'Linen Shirt', 'The Coastal linen shirt in sand, front view'),
      eyebrow: 'Back in stock',
      name: 'The Coastal Linen Shirt',
      description: `${vars.get('customer.first_name')}, you asked us to let you know. It is back in your size.`,
      price: '$120.00',
      cta: { label: 'Get it before it sells out', href: 'https://example.com/products/coastal-linen-shirt' },
    },
    urgency: { style: 'banner', headline: 'Popular sizes sell out fast', deadline: 'Limited stock', text: 'We only restocked a small batch.', cta: { label: 'Shop now', href: 'https://example.com/products/coastal-linen-shirt' } },
    related: { ...sellers.previewData, heading: 'Pairs well with', columns: 3, cardVariant: 'minimal' },
  },

  build(d, { section }) {
    return frame(d, [
      node('hero/product', d.product),
      optional(d.urgency, (x) => section('urgency', x)),
      optional(d.related, (x) => section('best-sellers', x)),
    ]);
  },
};
