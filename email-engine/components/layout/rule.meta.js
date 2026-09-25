const { sectionSettings, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Rule',
  description: 'A horizontal rule as its own section, for separating sections.',
  level: 'section',

  fields: {},

  settings: sectionSettings({
    padding: { type: 'spacing', default: '@spacing.sm @theme.section.paddingX' },
    thickness: { type: 'length', default: '@theme.divider.width' },
    style: { type: 'enum', values: ['solid', 'dashed', 'dotted'], default: '@theme.divider.style' },
    color: { type: 'color', default: '@theme.divider.color' },
    width: { type: 'length', default: '100%' },
  }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Full-width hairline.' },
    short: { description: 'A short centered rule.', settings: { width: '48px', thickness: '2px' } },
  },

  previewData: { data: {} },

  compat: {
    outlook: 'Solid lines honored. Dashed and dotted can render as solid.',
    gmail: 'Fine.',
    darkMode: 'Background and border color swap via dm-* classes when on the brand colors.',
  },
};
