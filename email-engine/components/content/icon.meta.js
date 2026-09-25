module.exports = {
  name: 'Icon',
  description: 'A small icon image with a fixed size and alignment.',
  level: 'content',

  fields: {
    icon: { type: 'image', required: true },
  },

  settings: {
    size: { type: 'length', default: '48px' },
    align: { type: 'alignment', default: 'center' },
    radius: { type: 'length', default: '0' },
    padding: { type: 'spacing', default: '0 0 @spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: '48px icon.' },
    small: { description: '32px icon.', settings: { size: '32px' } },
    large: { description: '72px icon.', settings: { size: '72px' } },
    round: { description: 'Circular crop, use a square source.', settings: { radius: '50%' } },
  },

  previewData: { data: { icon: { src: 'https://placehold.co/96x96/png?text=%E2%9C%93', alt: 'Free shipping', width: '48px' } } },

  compat: {
    outlook: 'Fixed width honored. Border radius ignored.',
    gmail: 'Fine. Keep meaning in adjacent text in case images are blocked.',
    darkMode: 'Icons are not recolored.',
  },
};
