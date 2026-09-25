module.exports = {
  name: 'Button',
  description: 'Bulletproof call-to-action button. Sits inside any column.',
  level: 'content',

  fields: {
    label: { type: 'text', required: true },
    href: { type: 'url', required: true },
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.primary' },
    color: { type: 'color', default: '@colors.primaryText' },
    radius: { type: 'length', default: '@theme.button.radius' },
    borderWidth: { type: 'length', default: '@theme.button.borderWidth' },
    borderColor: { type: 'color', default: '@colors.primary' },
    size: { type: 'enum', values: ['small', 'medium', 'large'], default: 'medium' },
    innerPadding: { type: 'spacing', default: '@theme.button.innerPadding' },
    padding: { type: 'spacing', default: '16px 24px' },
    darkMode: { type: 'enum', values: ['solid', 'outline', 'none'], default: 'solid' },
  },

  variants: {
    default: { description: 'Solid brand-colored button.' },
    outline: {
      description: 'Transparent with a brand-colored border, for secondary actions.',
      settings: {
        background: 'transparent',
        color: '@colors.primary',
        borderWidth: '2px',
        borderColor: '@colors.primary',
        darkMode: 'outline',
      },
    },
    subtle: {
      description: 'Surface-colored with a hairline border, for low-emphasis actions.',
      settings: {
        background: '@colors.surface',
        color: '@colors.primary',
        borderWidth: '1px',
        borderColor: '@colors.border',
        darkMode: 'outline',
      },
    },
  },

  previewData: {
    data: { label: 'Shop the collection', href: 'https://example.com/collections/summer' },
  },

  compat: {
    outlook: 'Rounded corners render square in Outlook desktop.',
    gmail: 'Fine.',
    darkMode: 'Swaps via dm-button classes where honored, otherwise keeps its own light colors.',
  },
};
