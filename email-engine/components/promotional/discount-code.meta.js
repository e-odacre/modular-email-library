module.exports = {
  name: 'Discount Code',
  description: 'A boxed discount code with a label and optional expiry. The code can be fixed or a Klaviyo unique-coupon tag.',
  level: 'content',

  fields: {
    code: { type: 'text', required: true },
    label: { type: 'text', default: 'Use code at checkout' },
    expires: 'text',
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    color: { type: 'color', default: '@colors.accent' },
    labelColor: { type: 'color', default: '@colors.mutedText' },
    background: { type: 'color', default: 'transparent' },
    borderColor: { type: 'color', default: '@colors.accent' },
    borderWidth: { type: 'length', default: '2px' },
    borderStyle: { type: 'enum', values: ['dashed', 'solid', 'dotted', 'none'], default: 'dashed' },
    radius: { type: 'length', default: '@radius.medium' },
    size: { type: 'length', default: '28px' },
    padding: { type: 'spacing', default: '@spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Dashed accent box, transparent inside.' },
    solid: { description: 'A solid accent-colored box with white text.', settings: { background: '@colors.accent', color: '@colors.white', labelColor: '@colors.white', borderStyle: 'solid' } },
    'on-color': { description: 'White dashed box for use on colored bands.', settings: { color: '@colors.white', labelColor: '@colors.white', borderColor: '@colors.white' } },
    plain: { description: 'Just the code, no border.', settings: { borderStyle: 'none' } },
  },

  previewData: { data: { code: 'SUMMER25', label: 'Use code at checkout', expires: 'Expires 30 June' } },

  compat: {
    outlook: 'Box and text honored. Dashed can render solid, rounded corners square.',
    gmail: 'Fine. The code is real text and can be copied.',
    darkMode: 'Keeps its own colors. Use on-color on colored bands.',
  },
};
