const { SECTION_RESPONSIVE } = require('../_shared');

const steps = [
  { title: 'Choose your plan', description: 'Pick the box size that fits your household.' },
  { title: 'Customize your experience', description: 'Tell us what you like and what to leave out.' },
  { title: 'Start enjoying the benefits', description: 'Your first box ships within two working days.' },
];

module.exports = {
  name: 'Numbered Steps',
  description: 'A numbered sequence of steps, as vertical rows or a horizontal row, with number markers.',
  level: 'section',

  fields: {
    heading: 'text',
    intro: 'text',
    steps: { type: 'features', min: 2, max: 5, required: true },
    cta: 'cta',
  },

  settings: {
    layout: { type: 'enum', values: ['vertical', 'horizontal'], default: 'vertical' },
    numbering: { type: 'enum', values: ['zero', 'plain'], default: 'zero' },
    shape: { type: 'enum', values: ['default', 'circle', 'outline', 'centered'], default: 'default' },
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Vertical rows with plain accent numbers (01, 02, 03).' },
    circles: { description: 'Vertical rows with numbers in filled circles.', settings: { shape: 'circle', numbering: 'plain' } },
    horizontal: { description: 'Steps side by side with the number above each.', settings: { layout: 'horizontal', shape: 'centered' } },
    'horizontal-circles': { description: 'Steps side by side with numbers in circles.', settings: { layout: 'horizontal', shape: 'circle', numbering: 'plain' } },
  },

  previewData: {
    data: {
      heading: 'How it works',
      intro: 'Three simple steps to your first box.',
      steps,
      cta: { label: 'Get started', href: 'https://example.com/start' },
    },
  },

  compat: {
    outlook: 'Number markers are table cells, honored. Circles render as squares.',
    gmail: 'Fine. Horizontal steps stack on phones through a media query.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
