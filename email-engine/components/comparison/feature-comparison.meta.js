const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Feature Comparison',
  description: 'Which features each option has, as rows of yes, no or partial marks. A checklist preset of the comparison table.',
  level: 'section',

  fields: {
    heading: 'text',
    intro: 'text',
    columns: { type: 'listItems', min: 2, max: 4, required: true },
    rows: {
      type: 'list',
      min: 1,
      max: 20,
      required: true,
      of: { type: 'object', fields: { label: { type: 'text', required: true }, values: { type: 'list', of: 'text', min: 1, max: 4, required: true } } },
    },
  },

  settings: {
    highlightFirst: { type: 'boolean', default: true },
    tableVariant: { type: 'enum', values: ['default', 'zebra', 'tinted'], default: 'default' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'The first column highlighted.' },
    zebra: { description: 'Alternating row shading.', settings: { tableVariant: 'zebra' } },
    plain: { description: 'No highlighted column.', settings: { highlightFirst: false } },
  },

  previewData: {
    data: {
      heading: 'Free vs Team',
      columns: ['Team', 'Free'],
      rows: [
        { label: 'Unlimited projects', values: ['yes', 'no'] },
        { label: 'Shared workspaces', values: ['yes', 'no'] },
        { label: 'Version history', values: ['yes', 'partial'] },
        { label: 'Priority support', values: ['yes', 'no'] },
      ],
    },
  },

  validate(data) {
    return data.rows.flatMap((r, i) => (r.values.length !== data.columns.length ? [`rows[${i}] "${r.label}" has ${r.values.length} value(s) but there are ${data.columns.length} columns`] : []));
  },

  compat: {
    outlook: 'Tables, colors and borders honored.',
    gmail: 'Fine. Columns shrink on phones.',
    darkMode: 'Cells on the surface or background swap via dm-* classes.',
  },
};
