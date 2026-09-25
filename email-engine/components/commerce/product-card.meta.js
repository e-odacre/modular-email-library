const { P } = require('../_shared');

const product = {
  image: P.img(400, 400, 'Linen Shirt', 'The Coastal linen shirt in sand, laid flat'),
  badge: 'Best seller',
  name: 'The Coastal Linen Shirt',
  description: 'Relaxed and breathable, cut from European flax.',
  price: '$120.00',
  salePrice: '$96.00',
  discount: 'Save 20%',
  url: 'https://example.com/products/coastal-linen-shirt',
  cta: { label: 'Shop now', href: 'https://example.com/products/coastal-linen-shirt' },
};

module.exports = {
  name: 'Product Card',
  description: 'One product: image, badge, name, description, price with sale price and discount, and a button. Five visual variants.',
  level: 'content',

  fields: {
    product: { type: 'product', required: true },
  },

  settings: {
    align: { type: 'alignment', default: 'left' },
    showBadge: { type: 'boolean', default: true },
    showDescription: { type: 'boolean', default: true },
    showPrice: { type: 'boolean', default: true },
    showButton: { type: 'boolean', default: true },
    nameLevel: { type: 'enum', values: ['h4', 'h3', 'h2', 'bodyLarge', 'eyebrow'], default: 'h4' },
    nameTransform: { type: 'enum', values: ['auto', 'none', 'uppercase', 'capitalize'], default: 'auto' },
    nameTracking: { type: 'text', attr: true, default: 'auto' },
    imageRadius: { type: 'length', default: '@theme.image.radius' },
    imagePadding: { type: 'spacing', default: '0 0 @spacing.sm 0' },
    badgeVariant: { type: 'enum', values: ['default', 'pill', 'outline', 'tag', 'success', 'urgent'], default: 'default' },
    buttonVariant: { type: 'enum', values: ['default', 'outline', 'subtle'], default: 'default' },
    buttonRadius: { type: 'length', default: '@theme.button.radius' },
    gap: { type: 'length', default: '@spacing.sm' },
  },

  responsive: { mobileAlignment: ['inherit', 'left', 'center', 'right'], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Left-aligned, everything shown, solid small button.' },
    minimal: {
      description: 'Just the image, name and price. No badge, description or button.',
      settings: { showBadge: false, showDescription: false, showButton: false },
    },
    luxury: {
      description: 'Centered, uppercase spaced name, no description, outlined button.',
      settings: { align: 'center', showDescription: false, nameTransform: 'uppercase', nameTracking: '2px', buttonVariant: 'outline', badgeVariant: 'outline', imageRadius: '@radius.none' },
    },
    editorial: {
      description: 'Large name and the description, no button: it reads like a magazine caption.',
      settings: { nameLevel: 'h3', showButton: false, showBadge: false },
    },
    playful: {
      description: 'Centered with rounded image, pill badge and pill button.',
      settings: { align: 'center', badgeVariant: 'pill', imageRadius: '@radius.large', buttonRadius: '@radius.pill' },
    },
  },

  previewData: { data: { product } },

  compat: {
    outlook: 'Tables and text honored. Rounded corners and pill buttons render square.',
    gmail: 'Fine. Product image is a real img with alt text.',
    darkMode: 'Text swaps via dm-text where honored. Images are not recolored.',
  },
};
