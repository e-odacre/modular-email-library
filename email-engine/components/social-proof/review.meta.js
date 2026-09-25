module.exports = {
  name: 'Review',
  description: 'One customer review: stars, an optional title, the review text, and who wrote it.',
  level: 'content',

  fields: {
    rating: { type: 'number', min: 0, max: 5, required: true },
    title: 'text',
    body: { type: 'text', required: true },
    customer: { type: 'text', required: true },
    product: 'text',
    date: 'text',
    verified: 'boolean',
  },

  settings: {
    align: { type: 'alignment', default: 'left' },
    showTitle: { type: 'boolean', default: true },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Left-aligned review with title.' },
    centered: { description: 'Centered review.', settings: { align: 'center' } },
    compact: { description: 'No title, just stars, text and the reviewer.', settings: { showTitle: false } },
  },

  previewData: {
    data: {
      rating: 5,
      title: 'Softer with every wash',
      body: 'I have owned it for a year and it still looks new. The fit is exactly what I hoped for.',
      customer: 'Priya N.',
      product: 'Coastal Linen Shirt',
      verified: true,
    },
  },

  compat: {
    outlook: 'Star glyphs from the system symbol font, text honored.',
    gmail: 'Fine.',
    darkMode: 'Text swaps via dm-text and dm-muted where honored.',
  },
};
