const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'How It Works',
  description: 'A process section: a heading and three to four steps side by side with circled numbers and a closing button.',
  level: 'section',

  fields: {
    heading: { type: 'text', default: 'How it works' },
    intro: 'text',
    steps: { type: 'features', min: 2, max: 4, required: true },
    cta: 'cta',
  },

  settings: {
    background: { type: 'color', default: '@colors.background' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Circled steps on the page background color.' },
    light: { description: 'On the surface color.', settings: { background: '@colors.surface' } },
  },

  previewData: {
    data: {
      steps: [
        { title: 'Tell us your size', description: 'Two minutes, no measuring tape.' },
        { title: 'Try it at home', description: 'Wear it for up to 60 days.' },
        { title: 'Keep what you love', description: 'Send back the rest for free.' },
      ],
      cta: { label: 'Find my size', href: 'https://example.com/pages/size-guide' },
    },
  },

  compat: {
    outlook: 'Number markers are table cells, circles render as squares.',
    gmail: 'Steps stack on phones through a media query.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
