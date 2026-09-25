const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Metrics Section',
  description: 'A metrics summary: two to four numbers each with a label and an optional change note. A preset of the stat grid.',
  level: 'section',

  fields: {
    heading: { type: 'text', default: 'Your week in numbers' },
    period: 'text',
    metrics: { type: 'stats', min: 2, max: 4, required: true },
  },

  settings: {
    background: { type: 'color', default: '@colors.background' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'On the page background color.' },
    light: { description: 'On the surface color.', settings: { background: '@colors.surface' } },
  },

  previewData: {
    data: {
      heading: 'Your week in numbers',
      period: '2 to 8 June',
      metrics: [
        { value: '128', label: 'Tasks completed', note: '+12% vs last week' },
        { value: '14', label: 'Projects active', note: 'No change' },
        { value: '6.5 hrs', label: 'Saved by automation', note: '+1.2 hrs' },
      ],
    },
  },

  compat: {
    outlook: 'Each row is a table with exact widths.',
    gmail: 'Two per row on phones through a media query. Non-Google Gmail accounts show the desktop layout.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
