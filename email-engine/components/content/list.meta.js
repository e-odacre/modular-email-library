module.exports = {
  name: 'List',
  description: 'A bulleted list with plain or glyph markers (check, dash, arrow).',
  level: 'content',

  fields: {
    items: { type: 'listItems', min: 1, max: 12, required: true },
  },

  settings: {
    marker: { type: 'enum', values: ['disc', 'circle', 'square', 'none', 'check', 'dash', 'arrow'], default: 'disc' },
    level: { type: 'enum', values: ['body', 'bodyLarge', 'bodySmall'], default: 'body' },
    align: { type: 'alignment', default: 'left' },
    markerColor: { type: 'color', default: '@colors.accent' },
    itemGap: { type: 'length', default: '@spacing.sm' },
    padding: { type: 'spacing', default: '0 0 @spacing.md 0' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Standard bullets.' },
    checklist: { description: 'Accent-colored check marks.', settings: { marker: 'check' } },
    dashed: { description: 'Dash markers.', settings: { marker: 'dash' } },
    plain: { description: 'No markers, just spaced lines.', settings: { marker: 'none' } },
  },

  previewData: {
    data: {
      items: [
        'Free shipping on orders over $75',
        'Free returns within 60 days',
        'Organic cotton and European linen',
        'Repaired for life at any of our stores',
      ],
    },
  },

  compat: {
    outlook: 'ul and li honored with explicit styles. Glyph markers are table cells.',
    gmail: 'Fine.',
    darkMode: 'Text swaps via dm-text where honored. Marker glyphs keep the accent color.',
  },
};
