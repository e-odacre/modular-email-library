const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Comparison Table',
  description: 'A comparison table: column headers, rows of label and values, and an optional button row. yes, no and partial become check, cross and tilde.',
  level: 'section',

  fields: {
    heading: 'text',
    intro: 'text',
    columns: {
      type: 'list',
      min: 2,
      max: 4,
      required: true,
      of: {
        type: 'object',
        fields: {
          title: { type: 'text', required: true },
          subtitle: 'text',
          image: 'image',
          highlight: 'boolean',
        },
      },
    },
    rows: {
      type: 'list',
      min: 1,
      max: 20,
      required: true,
      of: {
        type: 'object',
        fields: {
          label: { type: 'text', required: true },
          values: { type: 'list', of: 'text', min: 1, max: 4, required: true },
        },
      },
    },
    footer: { type: 'list', of: 'cta', min: 2, max: 4 },
  },

  settings: {
    labelWidth: { type: 'text', attr: true, default: '34%' },
    background: { type: 'color', default: '@colors.surface' },
    headerBackground: { type: 'color', default: '@colors.primary' },
    headerColor: { type: 'color', default: '@colors.primaryText' },
    highlightHeader: { type: 'color', default: '@colors.accent' },
    highlightBackground: { type: 'color', default: '@colors.background' },
    zebra: { type: 'boolean', default: false },
    zebraColor: { type: 'color', default: '@colors.background' },
    borderColor: { type: 'color', default: '@colors.border' },
    yesColor: { type: 'color', default: '@colors.success' },
    noColor: { type: 'color', default: '@colors.mutedText' },
    buttonBackground: { type: 'color', default: '@colors.primary' },
    buttonColor: { type: 'color', default: '@colors.primaryText' },
    radius: { type: 'length', default: '@theme.button.radius' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Clean rows with hairline dividers.' },
    zebra: { description: 'Alternating row shading.', settings: { zebra: true } },
    tinted: { description: 'On the page background color, with white highlight cells.', settings: { background: '@colors.background', highlightBackground: '@colors.surface' } },
  },

  previewData: {
    data: {
      heading: 'How we compare',
      columns: [{ title: 'Us', highlight: true }, { title: 'Fast fashion' }, { title: 'Luxury brands' }],
      rows: [
        { label: 'Natural fabrics', values: ['yes', 'no', 'yes'] },
        { label: 'Free repairs', values: ['yes', 'no', 'partial'] },
        { label: 'Typical price of a shirt', values: ['$120', '$25', '$400'] },
        { label: 'Made to last a decade', values: ['yes', 'no', 'yes'] },
      ],
    },
  },

  validate(data) {
    const errors = [];
    const n = data.columns.length;
    data.rows.forEach((r, i) => {
      if (r.values.length !== n) errors.push(`rows[${i}] "${r.label}" has ${r.values.length} value(s) but there are ${n} columns`);
    });
    if (data.footer && data.footer.length !== n) errors.push(`footer needs one button per column (${n}), got ${data.footer.length}`);
    if (data.columns.filter((c) => c.highlight).length > 1) errors.push('only one column can be highlighted');
    return errors;
  },

  compat: {
    outlook: 'Tables, colors and borders honored.',
    gmail: 'Fine. On phones the columns shrink, so keep cell text short.',
    darkMode: 'Cells on the surface or background swap via dm-* classes. Header cells keep their colors.',
  },
};
