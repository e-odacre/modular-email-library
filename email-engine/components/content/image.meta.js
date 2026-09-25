module.exports = {
  name: 'Image',
  description: 'A responsive image with required alt text (or an explicit decorative flag), optionally linked.',
  level: 'content',

  fields: {
    image: { type: 'image', required: true },
  },

  settings: {
    width: { type: 'text', attr: true, default: 'auto' },
    align: { type: 'alignment', default: 'center' },
    radius: { type: 'length', default: '@theme.image.radius' },
    padding: { type: 'spacing', default: '0 0 @spacing.md 0' },
    fluidOnMobile: { type: 'boolean', default: false },
  },

  responsive: { mobileAlignment: ['inherit', 'left', 'center', 'right'], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Fills the column width.' },
    rounded: { description: 'Rounded corners.', settings: { radius: '@radius.large' } },
    circle: { description: 'Circular crop, for square avatars and portraits. Use a square source image.', settings: { radius: '50%' } },
    'full-bleed': { description: 'No padding, for edge-to-edge images.', settings: { padding: '0' } },
  },

  previewData: {
    data: { image: { src: 'https://placehold.co/600x400/png?text=Summer+Collection', alt: 'A linen shirt and canvas tote laid out on a sunlit bench', href: 'https://example.com/collections/summer' } },
    byVariant: {
      circle: { data: { image: { src: 'https://placehold.co/240x240/png?text=Portrait', alt: 'Portrait of Maya, co-founder', width: '160px' } } },
    },
  },

  compat: {
    outlook: 'Width honored, border radius ignored (square corners).',
    gmail: 'Fine. Images are blocked by default in some clients, so alt text matters.',
    darkMode: 'Images are not recolored. Prefer solid backgrounds over transparent ones.',
  },
};
