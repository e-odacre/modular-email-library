const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Split Hero',
  description: 'An image beside the headline, description and button. Image left by default, text left with the reverse variant.',
  level: 'section',

  fields: {
    eyebrow: 'text',
    headline: { type: 'text', required: true },
    description: 'text',
    cta: 'cta',
    image: { type: 'image', required: true },
  },

  settings: {
    imagePosition: { type: 'enum', values: ['left', 'right'], default: 'left' },
    split: { type: 'text', attr: true, default: '50/50' },
    valign: { type: 'enum', values: ['top', 'middle', 'bottom'], default: 'middle' },
    headingLevel: { type: 'enum', values: ['h1', 'display', 'h2'], default: 'h1' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
  },

  responsive: { mobileLayout: ['stack', 'reverse'], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'IMAGE | TEXT. The image is first on mobile.' },
    reverse: { description: 'TEXT | IMAGE. The image is still first on mobile.', settings: { imagePosition: 'right' } },
    'large-image': { description: 'IMAGE | TEXT with a 60/40 split.', settings: { split: '60/40' } },
  },

  previewData: {
    data: {
      eyebrow: 'The Terrace Edit',
      headline: 'Dressed for long lunches',
      description: 'Loose linens and soft neutrals, styled for afternoons that last until the light goes.',
      cta: { label: 'Shop the edit', href: 'https://example.com/collections/terrace' },
      image: P.img(560, 560, 'Terrace', 'A woman in a sand linen shirt at a terrace table'),
    },
  },

  compat: {
    outlook: 'Side by side as a table row.',
    gmail: 'Stacking works. Gmail on non-Google accounts shows the desktop layout on phones.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
