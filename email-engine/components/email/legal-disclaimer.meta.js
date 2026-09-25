module.exports = {
  name: 'Legal Disclaimer',
  description: 'Small print: offer terms, price disclaimers or regulatory text.',
  level: 'content',

  fields: {
    text: { type: 'text', required: true },
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    color: { type: 'color', default: '@colors.mutedText' },
    prefix: { type: 'text', allowEmpty: true, default: '' },
    padding: { type: 'spacing', default: '@spacing.sm 0 0 0' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Centered muted small print.' },
    terms: { description: 'Starts with "Terms apply."', settings: { prefix: 'Terms apply.' } },
    left: { description: 'Left-aligned.', settings: { align: 'left' } },
  },

  previewData: {
    data: { text: 'Offer valid on full-price items until 30 June 2026. Cannot be combined with other discounts. Free shipping applies to orders over $75 within the contiguous US.' },
  },

  compat: {
    outlook: 'Honored.',
    gmail: 'Fine.',
    darkMode: 'Text swaps via dm-muted where honored.',
  },
};
