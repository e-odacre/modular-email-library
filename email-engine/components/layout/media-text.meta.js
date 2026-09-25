const { sectionSettings, P } = require('../_shared');

const data = {
  media: P.img(560, 480, 'Studio', 'A ceramic mug on a wooden shelf beside a plant'),
  content: [
    P.node('content/heading', { text: 'Handmade in small batches' }, { level: 'h2' }),
    P.text('Every mug is thrown, glazed and fired by hand in our Portland studio, so no two are exactly alike.'),
    P.button('Meet the makers', 'https://example.com/pages/about'),
  ],
};

module.exports = {
  name: 'Media + Text',
  description: 'An image beside text (image left or right) that stacks on mobile.',
  level: 'section',

  fields: {
    media: { type: 'image', required: true },
    content: { type: 'slot', accepts: 'content', required: true },
  },

  settings: sectionSettings({
    imagePosition: { type: 'enum', values: ['left', 'right'], default: 'left' },
    split: { type: 'text', attr: true, default: '45/55' },
    valign: { type: 'enum', values: ['top', 'middle', 'bottom'], default: 'middle' },
    columnPadding: { type: 'spacing', default: '0 @spacing.sm' },
  }),

  responsive: {
    mobileLayout: ['stack', 'reverse'],
    mobileAlignment: ['inherit', 'left', 'center', 'right'],
    hideOnMobile: true,
    hideOnDesktop: true,
  },

  variants: {
    default: { description: 'Image on the left, text on the right. The image is first on mobile.' },
    'image-right': { description: 'Text on the left, image on the right. The image is still first on mobile.', settings: { imagePosition: 'right' } },
    'large-image': { description: 'A larger image (60/40) on the left.', settings: { split: '60/40' } },
  },

  previewData: { data },

  compat: {
    outlook: 'Side by side as a table row. Mobile order setting only affects phones.',
    gmail: 'Stacking works. Gmail on non-Google accounts shows the desktop layout on phones.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
