module.exports = {
  name: 'Star Rating',
  description: 'Filled and empty stars for a rating out of 5, with an optional label.',
  level: 'content',

  fields: {
    rating: { type: 'number', min: 0, max: 5, required: true },
    label: 'text',
  },

  settings: {
    size: { type: 'length', default: '20px' },
    color: { type: 'color', default: '@colors.warning' },
    emptyColor: { type: 'color', default: '@colors.border' },
    align: { type: 'alignment', default: 'left' },
    padding: { type: 'spacing', default: '0 0 @spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Gold stars with a label beside them.' },
    centered: { description: 'Centered stars.', settings: { align: 'center' } },
    large: { description: 'Larger stars.', settings: { size: '28px' } },
  },

  previewData: { data: { rating: 4.9, label: '4.9 out of 5, based on 2,000+ reviews' } },

  compat: {
    outlook: 'Star glyphs render from the system symbol font.',
    gmail: 'Fine.',
    darkMode: 'Filled stars keep the star color, empty stars use the border color.',
  },
};
