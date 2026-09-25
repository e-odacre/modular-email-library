module.exports = {
  name: 'Decorative Image',
  description: 'An image that adds no meaning, marked decorative so screen readers skip it.',
  level: 'content',

  fields: {
    src: { type: 'url', required: true },
  },

  settings: {
    width: { type: 'text', attr: true, default: 'auto' },
    align: { type: 'alignment', default: 'center' },
    radius: { type: 'length', default: '0' },
    padding: { type: 'spacing', default: '@spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Centered, natural size.' },
    small: { description: 'A small 80px flourish.', settings: { width: '80px' } },
  },

  previewData: { data: { src: 'https://placehold.co/320x24/png?text=%E2%9D%A6+%E2%9D%A6+%E2%9D%A6' } },

  compat: {
    outlook: 'Fixed width honored, radius ignored.',
    gmail: 'Fine. Nothing meaningful is lost if images are blocked.',
    darkMode: 'Images are not recolored.',
  },
};
