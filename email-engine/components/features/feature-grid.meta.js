const { SECTION_RESPONSIVE, P } = require('../_shared');

const icon = (label, alt) => ({ src: P.img(96, 96, label, alt).src, alt, decorative: true });
const all = [
  { icon: icon('Ship', 'Shipping'), title: 'Free shipping', description: 'On every order over $75, tracked to your door.' },
  { icon: icon('Return', 'Returns'), title: '60-day returns', description: 'Not right? Send it back, we cover the postage.' },
  { icon: icon('Repair', 'Repairs'), title: 'Repaired for life', description: 'We mend it free, for as long as you own it.' },
  { icon: icon('Eco', 'Materials'), title: 'Natural materials', description: 'Organic cotton and European linen, nothing synthetic.' },
];

const data = (n) => ({
  heading: 'Why you will love it',
  intro: 'Everything we make comes with a promise.',
  features: all.slice(0, n),
  cta: { label: 'Read our promise', href: 'https://example.com/pages/promise' },
});

module.exports = {
  name: 'Feature Grid',
  description: 'Features in a grid of 1 to 4 columns with an optional heading and button. Two-, three- and four-feature layouts are variants.',
  level: 'section',

  fields: {
    heading: 'text',
    intro: 'text',
    features: { type: 'features', min: 1, max: 8, required: true },
    cta: 'cta',
  },

  settings: {
    columns: { type: 'enum', values: [3, 1, 2, 4], default: 3 },
    item: { type: 'enum', values: ['card', 'row'], default: 'card' },
    cardVariant: { type: 'enum', values: ['default', 'left', 'round-icon'], default: 'default' },
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
  },

  responsive: { mobileColumns: [1, 2], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Three features across.' },
    'two-feature': { description: 'Two features across.', settings: { columns: 2 } },
    'four-feature': { description: 'Four features across.', settings: { columns: 4 } },
    list: { description: 'One feature per row as icon + text.', settings: { columns: 1, item: 'row' } },
    tinted: { description: 'Three features on the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: data(3),
    byVariant: { 'two-feature': { data: data(2) }, 'four-feature': { data: data(4) }, list: { data: data(4) } },
  },

  compat: {
    outlook: 'Each row is a table with exact widths. mobileColumns is ignored.',
    gmail: 'Stacking works. Gmail on non-Google accounts shows the desktop layout on phones.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
