module.exports = {
  name: 'Text',
  description: 'A paragraph of body copy in one of the body type levels.',
  level: 'content',

  fields: {
    text: { type: 'text', required: true },
  },

  settings: {
    level: { type: 'enum', values: ['body', 'bodyLarge', 'bodySmall', 'caption'], default: 'body' },
    align: { type: 'alignment', default: 'left' },
    color: { type: 'text', attr: true, default: 'auto' },
    padding: { type: 'spacing', default: '0 0 @spacing.md 0' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { mobileAlignment: ['inherit', 'left', 'center', 'right'], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Standard body copy.' },
    large: { description: 'Larger lead paragraph.', settings: { level: 'bodyLarge' } },
    small: { description: 'Smaller supporting text.', settings: { level: 'bodySmall' } },
    caption: { description: 'Caption or fine print in the muted color.', settings: { level: 'caption' } },
    centered: { description: 'Centered body copy.', settings: { align: 'center' } },
  },

  previewData: {
    data: { text: 'Made for slower mornings and warmer days. Our summer collection is cut from breathable linen and washed cotton.' },
  },

  compat: {
    outlook: 'Line height and padding honored.',
    gmail: 'Fine.',
    darkMode: 'Text color swaps via dm-text where honored. Set darkMode off on colored backgrounds.',
  },
};
