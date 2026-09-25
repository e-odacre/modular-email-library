module.exports = {
  name: 'Stat',
  description: 'One statistic: a big value, a label and an optional note.',
  level: 'content',

  fields: {
    value: { type: 'text', required: true },
    label: { type: 'text', required: true },
    note: 'text',
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    valueLevel: { type: 'enum', values: ['display', 'h1', 'h2'], default: 'display' },
    valueColor: { type: 'text', attr: true, default: '@colors.accent' },
    labelColor: { type: 'text', attr: true, default: 'auto' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Display-size accent value with a label.' },
    plain: { description: 'Value in the normal text color.', settings: { valueColor: '@colors.text' } },
    compact: { description: 'Smaller h1-size value.', settings: { valueLevel: 'h1' } },
    left: { description: 'Left-aligned.', settings: { align: 'left' } },
  },

  previewData: { data: { value: '98%', label: 'Customer satisfaction', note: 'From 2,140 verified reviews' } },

  compat: {
    outlook: 'Text and colors honored.',
    gmail: 'Fine.',
    darkMode: 'Label swaps via dm-text where honored. The value keeps its color.',
  },
};
