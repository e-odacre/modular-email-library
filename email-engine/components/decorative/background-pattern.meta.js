const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Background Pattern',
  description: 'A section with a repeating pattern or texture image behind its content, with a solid-color fallback.',
  level: 'section',

  fields: {
    pattern: { type: 'url', required: true },
    content: { type: 'slot', accepts: 'content', required: true },
  },

  settings: {
    background: { type: 'color', default: '@colors.background' },
    repeat: { type: 'enum', values: ['repeat', 'no-repeat', 'repeat-x', 'repeat-y'], default: 'repeat' },
    size: { type: 'text', attr: true, default: 'auto' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Tiled pattern.' },
    cover: { description: 'One image stretched to cover the section.', settings: { repeat: 'no-repeat', size: 'cover' } },
  },

  previewData: {
    data: {
      pattern: 'https://placehold.co/120x120/EEEEEE/DDDDDD/png?text=%C2%B7',
      content: [P.node('content/heading', { text: 'Refer a friend, get $20' }, { level: 'h2', align: 'center' }), P.node('content/text', { text: 'Give a friend $20 off their first order and get $20 when they buy.' }, { align: 'center' })],
    },
  },

  compat: {
    outlook: 'Background image via MJML VML fallback.',
    gmail: 'Background images can be blocked, the solid color shows instead.',
    darkMode: 'Keeps its own colors, it is a branded block.',
  },
};
