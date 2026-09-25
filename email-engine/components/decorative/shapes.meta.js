module.exports = {
  name: 'Shapes',
  description: 'A strip of colored squares, circles or bars in the brand colors, as a graphic accent.',
  level: 'content',

  fields: {},

  settings: {
    count: { type: 'number', default: 3, min: 1, max: 8 },
    size: { type: 'length', default: '24px' },
    height: { type: 'length', default: '24px' },
    gap: { type: 'length', default: '@spacing.sm' },
    radius: { type: 'length', default: '0' },
    align: { type: 'alignment', default: 'center' },
    padding: { type: 'spacing', default: '@spacing.md 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Three squares in primary, accent and secondary.' },
    circles: { description: 'Circles (squares in Outlook desktop).', settings: { radius: '50%' } },
    bars: { description: 'Wide short bars.', settings: { size: '48px', height: '6px', count: 3 } },
  },

  previewData: { data: {} },

  compat: {
    outlook: 'Colored cells honored. Circles fall back to squares.',
    gmail: 'Fine.',
    darkMode: 'Blocks keep their colors.',
  },
};
