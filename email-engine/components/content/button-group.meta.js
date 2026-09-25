module.exports = {
  name: 'Button Group',
  description: 'Two or three buttons, inline or stacked, each primary (filled) or secondary (outlined).',
  level: 'content',

  fields: {
    buttons: { type: 'buttons', min: 2, max: 3, required: true },
  },

  settings: {
    layout: { type: 'enum', values: ['inline', 'stacked'], default: 'inline' },
    align: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.primary' },
    color: { type: 'color', default: '@colors.primaryText' },
    radius: { type: 'length', default: '@theme.button.radius' },
    innerPadding: { type: 'spacing', default: '@theme.button.innerPadding' },
    gap: { type: 'length', default: '@spacing.sm' },
    padding: { type: 'spacing', default: '@spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Buttons side by side.' },
    stacked: { description: 'Buttons one under another.', settings: { layout: 'stacked' } },
  },

  previewData: {
    data: {
      buttons: [
        { label: 'Shop new arrivals', href: 'https://example.com/collections/new', style: 'primary' },
        { label: 'View the lookbook', href: 'https://example.com/pages/lookbook', style: 'secondary' },
      ],
    },
  },

  compat: {
    outlook: 'Tables with square corners. Padding uses mso-padding-alt.',
    gmail: 'Fine. Inline buttons wrap when the column is narrow.',
    darkMode: 'Buttons keep their own colors.',
  },
};
