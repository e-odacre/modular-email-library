module.exports = {
  name: 'Price',
  description: 'A price, or an original price struck through beside a sale price with an optional discount label.',
  level: 'content',

  fields: {
    price: { type: 'text', required: true },
    salePrice: 'text',
    discount: 'text',
  },

  settings: {
    align: { type: 'alignment', default: 'left' },
    originalSize: { type: 'length', default: '16px' },
    padding: { type: 'spacing', default: '0 0 @spacing.sm 0' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { mobileAlignment: ['inherit', 'left', 'center', 'right'], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Left-aligned price.' },
    centered: { description: 'Centered price.', settings: { align: 'center' } },
    large: { description: 'Larger struck-through price.', settings: { originalSize: '18px' } },
  },

  previewData: { data: { price: '$120.00', salePrice: '$89.00', discount: 'Save 26%' } },

  validate: (data) => (data.discount && !data.salePrice ? ['discount needs a salePrice to go with it'] : []),

  compat: {
    outlook: 'Line-through honored.',
    gmail: 'Fine.',
    darkMode: 'Price text swaps via dm-text where honored. The sale price keeps its color.',
  },
};
