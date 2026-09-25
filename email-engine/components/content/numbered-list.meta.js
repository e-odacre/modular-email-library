module.exports = {
  name: 'Numbered List',
  description: 'A numbered list: plain numbers, numbers in circles, or zero-padded numbers.',
  level: 'content',

  fields: {
    items: { type: 'listItems', min: 1, max: 12, required: true },
  },

  settings: {
    numbering: { type: 'enum', values: ['decimal', 'circle', 'zero'], default: 'decimal' },
    level: { type: 'enum', values: ['body', 'bodyLarge', 'bodySmall'], default: 'body' },
    align: { type: 'alignment', default: 'left' },
    markerColor: { type: 'color', default: '@colors.accent' },
    markerText: { type: 'color', default: '@colors.white' },
    itemGap: { type: 'length', default: '@spacing.sm' },
    padding: { type: 'spacing', default: '0 0 @spacing.md 0' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Plain 1. 2. 3. numbering.' },
    circles: { description: 'Numbers in filled circles.', settings: { numbering: 'circle' } },
    zero: { description: 'Zero-padded numbers (01, 02, 03) in the accent color.', settings: { numbering: 'zero' } },
  },

  previewData: {
    data: {
      items: [
        'Pick the fit that suits you from our size guide.',
        'Choose your color and add it to the bag.',
        'Try it at home for 60 days, returns are free.',
      ],
    },
  },

  compat: {
    outlook: 'ol/li honored. Circles render as squares.',
    gmail: 'Fine.',
    darkMode: 'Text swaps via dm-text where honored. Number badges keep the accent color.',
  },
};
