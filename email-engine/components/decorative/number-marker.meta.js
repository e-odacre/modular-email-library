module.exports = {
  name: 'Number Marker',
  description: 'A big step number in plain, filled-circle or outlined style.',
  level: 'content',

  fields: {
    number: { type: 'text', required: true },
  },

  settings: {
    shape: { type: 'enum', values: ['plain', 'circle', 'outline'], default: 'plain' },
    size: { type: 'length', default: '32px' },
    box: { type: 'length', default: '48px' },
    radius: { type: 'length', default: '50%' },
    color: { type: 'color', default: '@colors.accent' },
    numberColor: { type: 'color', default: '@colors.white' },
    align: { type: 'alignment', default: 'left' },
    padding: { type: 'spacing', default: '0 0 @spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'A large accent-colored number.' },
    circle: { description: 'The number in a filled circle.', settings: { shape: 'circle', size: '20px' } },
    outline: { description: 'The number in an outlined circle.', settings: { shape: 'outline', size: '20px' } },
    centered: { description: 'Centered plain number.', settings: { align: 'center' } },
  },

  previewData: { data: { number: '01' } },

  compat: {
    outlook: 'Number and colors honored, the circle becomes a square.',
    gmail: 'Fine.',
    darkMode: 'Markers keep the accent color.',
  },
};
