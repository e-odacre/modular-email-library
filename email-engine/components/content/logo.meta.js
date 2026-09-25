module.exports = {
  name: 'Logo',
  description: 'The brand logo (or another logo) with a dark-mode swap.',
  level: 'content',

  fields: {
    src: 'url',
    alt: { type: 'text', attr: true },
    href: 'url',
    darkSrc: 'url',
  },

  settings: {
    width: { type: 'length', default: '@logo.width' },
    align: { type: 'alignment', default: 'center' },
    padding: { type: 'spacing', default: '0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Brand logo, centered.' },
    left: { description: 'Left-aligned.', settings: { align: 'left' } },
    small: { description: 'A smaller logo (100px).', settings: { width: '100px' } },
  },

  previewData: { data: {} },

  validate(data) {
    const errors = [];
    if (data.src && !data.alt) errors.push('alt is required when you pass your own src, describe the logo (for example "Acme")');
    if (data.darkSrc && !data.src) errors.push('darkSrc needs src, the brand logo already has a dark version in the tokens');
    return errors;
  },

  compat: {
    outlook: 'Always shows the light logo.',
    gmail: 'May auto-invert colors, use a logo that reads on both.',
    darkMode: 'Swaps to the dark logo where honored.',
  },
};
