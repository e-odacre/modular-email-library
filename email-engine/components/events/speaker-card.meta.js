const { P } = require('../_shared');

module.exports = {
  name: 'Speaker Card',
  description: 'A speaker: a round photo, name, title, a short bio and an optional profile link.',
  level: 'content',

  fields: {
    speaker: {
      type: 'object',
      required: true,
      fields: {
        photo: 'image',
        name: { type: 'text', required: true },
        title: 'text',
        bio: 'text',
        href: 'url',
      },
    },
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    photoSize: { type: 'length', default: '96px' },
    linkLabel: { type: 'text', default: 'View profile' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Centered speaker card.' },
    left: { description: 'Left-aligned.', settings: { align: 'left' } },
    large: { description: 'A larger 128px photo.', settings: { photoSize: '128px' } },
  },

  previewData: {
    data: {
      speaker: {
        photo: P.img(200, 200, 'Elena', 'Portrait of Elena Ruiz holding a skein of naturally dyed yarn'),
        name: 'Elena Ruiz',
        title: 'Textile artist and natural dye specialist',
        bio: 'Elena has taught plant dyeing for twelve years and runs a small dye garden outside Lisbon.',
        href: 'https://example.com/team/elena-ruiz',
      },
    },
  },

  compat: {
    outlook: 'Text and photo honored, the circular crop is square.',
    gmail: 'Fine. Alt text names the speaker if images are blocked.',
    darkMode: 'Text swaps via dm-text and dm-muted where honored.',
  },
};
