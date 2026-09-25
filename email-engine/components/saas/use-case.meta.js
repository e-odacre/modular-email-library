const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Use Case',
  description: 'Show how one kind of customer uses the product: eyebrow, heading, text, key points and an image.',
  level: 'section',

  fields: {
    eyebrow: 'text',
    heading: { type: 'text', required: true },
    text: 'text',
    points: { type: 'listItems', max: 5 },
    image: { type: 'image', required: true },
    cta: 'cta',
  },

  settings: {
    imagePosition: { type: 'enum', values: ['left', 'right'], default: 'left' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Image on the left.' },
    'image-right': { description: 'Image on the right.', settings: { imagePosition: 'right' } },
  },

  previewData: {
    data: {
      eyebrow: 'For agencies',
      heading: 'Run every client from one place',
      text: 'Give each client their own workspace and keep billing, approvals and files tidy.',
      points: ['Client-facing approval links', 'Per-client time and budget tracking', 'White-label reports'],
      image: P.img(480, 400, 'Agency', 'A project dashboard showing three client workspaces'),
      cta: { label: 'See the agency plan', href: 'https://example.com/agencies' },
    },
  },

  compat: {
    outlook: 'Side by side as a table row.',
    gmail: 'Fine. Stacks on phones through a media query.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
