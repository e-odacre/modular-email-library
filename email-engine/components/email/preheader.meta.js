module.exports = {
  name: 'Preheader',
  description: 'Hidden inbox preview text, padded so the email body does not leak into it. With no text it uses the preview text set in Klaviyo.',
  level: 'section',

  fields: {
    text: 'text',
  },

  settings: {
    color: { type: 'color', default: '@colors.background' },
    pad: { type: 'boolean', default: true },
    padLength: { type: 'number', default: 90, min: 0, max: 200 },
  },

  variants: {
    default: { description: 'Padded hidden preview text.' },
    unpadded: { description: 'No zero-width padding, for a very short email body.', settings: { pad: false } },
  },

  previewData: { data: { text: 'Made for slower mornings and warmer days. Our summer collection has landed.' } },

  compat: {
    outlook: 'Hidden with display:none and mso-hide. Outlook desktop does not show previews in the list.',
    gmail: 'Shows in the inbox list, padding keeps body text out of it.',
    darkMode: 'Invisible, nothing to swap.',
  },
};
