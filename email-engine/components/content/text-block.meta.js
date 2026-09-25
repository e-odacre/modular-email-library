module.exports = {
  name: 'Text Block',
  description: 'A heading and body copy in a full-width section, with an optional button.',
  level: 'section',

  fields: {
    heading: 'text',
    body: { type: 'richtext', required: true },
    cta: 'cta',
  },

  settings: {
    align: { type: 'alignment', default: 'left' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingTight @theme.section.paddingX' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Left-aligned heading and copy.' },
    centered: { description: 'Centered heading, copy and button.', settings: { align: 'center' } },
  },

  previewData: {
    data: {
      heading: 'Made for slower mornings',
      body: '<p>Our summer collection is cut from breathable linen and washed cotton, designed to move with you from the first coffee to the last light.</p>',
      cta: { label: 'Explore the collection', href: 'https://example.com/collections/summer' },
    },
  },

  compat: {
    outlook: 'Paragraph margins can differ slightly.',
    gmail: 'Fine.',
    darkMode: 'Text and background swap via dm-* classes where honored.',
  },
};
