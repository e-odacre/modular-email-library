module.exports = {
  name: 'Outlook-safe Button',
  description: 'A fixed-size call-to-action button with true rounded corners in Outlook desktop, drawn with VML.',
  level: 'content',

  fields: {
    label: { type: 'text', required: true },
    href: { type: 'url', required: true },
  },

  settings: {
    width: { type: 'length', default: '220px' },
    height: { type: 'length', default: '48px' },
    radius: { type: 'length', default: '@theme.button.radius' },
    background: { type: 'color', default: '@colors.primary' },
    color: { type: 'color', default: '@colors.primaryText' },
    align: { type: 'alignment', default: 'center' },
    padding: { type: 'spacing', default: '@spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Solid button, 220 by 48.' },
    wide: { description: 'A wider button (300 by 52).', settings: { width: '300px', height: '52px' } },
    pill: { description: 'Fully rounded ends.', settings: { radius: '@radius.pill' } },
  },

  previewData: { data: { label: 'Shop the sale', href: 'https://example.com/collections/sale' } },

  validate(data, s) {
    const errors = [];
    for (const key of ['width', 'height', 'radius']) {
      if (!/px$/.test(s[key]) && s[key] !== '0') errors.push(`setting "${key}" must be in px (VML needs fixed sizes), got ${s[key]}`);
    }
    if (data.label.length > 28) errors.push('label is too long for a fixed-width button, keep it under 28 characters');
    return errors;
  },

  compat: {
    outlook: 'True rounded corners via VML roundrect, whole shape clickable.',
    gmail: 'A normal inline-block link with border-radius.',
    darkMode: 'Keeps its own colors.',
  },
};
