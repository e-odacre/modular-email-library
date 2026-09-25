const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars } = require('./_helpers');
const intro = require('../sections/product-introduction');
const features = require('../sections/feature-breakdown');
const proof = require('../sections/social-proof');
const cta = require('../sections/cta');

// Preheader, announcement, hero, product introduction, features, lifestyle image, social proof, CTA, footer.
module.exports = {
  name: 'Product Launch',
  description: 'Announces a new product: an announcement, a hero, the product in detail, its features, a lifestyle image, social proof and a call to action.',
  suggestedTheme: 'editorial',

  fields: {
    ...FRAME_FIELDS,
    hero: { type: 'object', required: true, fields: intro.fields },
    product: { type: 'object', fields: { product: { type: 'product', required: true }, highlights: { type: 'listItems', max: 5 }, gallery: { type: 'list', of: 'image', min: 2, max: 3 } } },
    features: { type: 'object', fields: features.fields },
    lifestyle: { type: 'object', fields: { image: { type: 'image', required: true }, caption: 'text', credit: 'text' } },
    socialProof: { type: 'object', fields: proof.fields },
    cta: { type: 'object', fields: cta.fields },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'Meet the Coastal Linen Shirt, our lightest yet.',
    announcement: { text: 'Just launched: the Coastal Linen Shirt.', link: { label: 'Shop now', href: 'https://example.com/products/coastal-linen-shirt' } },
    hero: {
      eyebrow: 'Just landed',
      headline: 'Meet the Coastal Linen Shirt',
      description: 'Two years in the making, and our lightest shirt yet.',
      cta: { label: 'Shop the launch', href: 'https://example.com/products/coastal-linen-shirt' },
      image: P.img(600, 340, 'Coastal', 'The Coastal linen shirt in sand hanging in a sunlit window'),
      layout: 'text-only',
    },
    product: {
      product: {
        image: P.img(560, 640, 'Linen Shirt', 'The Coastal linen shirt in sand, worn untucked'),
        badge: 'New',
        name: 'The Coastal Linen Shirt',
        description: 'Our lightest shirt yet, made for hot days and warm evenings.',
        price: '$120.00',
        cta: { label: 'Shop the shirt', href: 'https://example.com/products/coastal-linen-shirt' },
      },
      highlights: ['100% European flax linen', 'Pre-washed for softness', 'Available in XS to XXL'],
    },
    features: features.previewData,
    lifestyle: { image: P.img(600, 400, 'Terrace', 'Guests at a long table on a sunlit terrace'), caption: 'Lunch on the terrace at the summer shoot in Lisbon.', credit: 'Photo: Elena Ruiz' },
    socialProof: proof.previewData,
    cta: { headline: 'Be one of the first to wear it', text: 'Free shipping over $75, free returns for 60 days.', primary: { label: 'Shop the launch', href: vars.get('brand.url') } },
  },

  build(d, { section }) {
    return frame(d, [
      section('product-introduction', d.hero),
      optional(d.product, (x) => node('commerce/product-showcase', x)),
      optional(d.features, (x) => section('feature-breakdown', x)),
      optional(d.lifestyle, (x) => node('editorial/editorial-image', x)),
      optional(d.socialProof, (x) => section('social-proof', x)),
      optional(d.cta, (x) => section('cta', x)),
    ]);
  },
};
