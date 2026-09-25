const { KLAVIYO_TAG } = require('../../scripts/lib/schema');

const SAFE = /^[A-Za-z0-9_.~-]+$/;

module.exports = {
  name: 'Tracking-safe CTA',
  description: 'A button that appends UTM parameters to its link correctly, whatever the URL already contains.',
  level: 'content',

  fields: {
    label: { type: 'text', required: true },
    href: { type: 'url', required: true },
    utm: {
      type: 'object',
      fields: {
        source: { type: 'text', attr: true },
        medium: { type: 'text', attr: true },
        campaign: { type: 'text', attr: true },
        content: { type: 'text', attr: true },
        term: { type: 'text', attr: true },
      },
    },
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    separator: { type: 'enum', values: ['auto', '?', '&'], default: 'auto' },
    buttonVariant: { type: 'enum', values: ['default', 'outline', 'subtle'], default: 'default' },
  },

  variants: {
    default: { description: 'Solid button.' },
    outline: { description: 'Outlined button.', settings: { buttonVariant: 'outline' } },
  },

  previewData: {
    data: {
      label: 'Shop the collection',
      href: 'https://example.com/collections/summer?sort=new#top',
      utm: { source: 'klaviyo', medium: 'email', campaign: 'summer-launch', content: 'hero-button' },
    },
  },

  validate(data, s) {
    const errors = [];
    if (data.utm && Object.keys(data.utm).length && s.separator === 'auto' && KLAVIYO_TAG.test(data.href)) {
      errors.push("href contains a Klaviyo tag, so it is unknown whether it already has a query string. Set the separator setting to '?' or '&'");
    }
    if (/[?&]utm_/i.test(data.href)) errors.push('href already has utm_ parameters, pass them in utm instead so they are not duplicated');
    for (const [key, value] of Object.entries(data.utm || {})) {
      if (!SAFE.test(value) && !(KLAVIYO_TAG.test(value) && !/[?&#=]/.test(value.replace(KLAVIYO_TAG, '')))) {
        errors.push(`utm.${key} "${value}" must be URL-safe (letters, numbers, - _ . ~) or a single Klaviyo tag`);
      }
    }
    return errors;
  },

  compat: {
    outlook: 'A content/button, square corners in Outlook desktop.',
    gmail: 'Fine.',
    darkMode: 'As content/button.',
  },
};
