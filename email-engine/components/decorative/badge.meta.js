module.exports = {
  name: 'Badge',
  description: 'A small label chip. Variants cover badge, pill and tag styles.',
  level: 'content',

  fields: {
    text: { type: 'text', required: true },
  },

  settings: {
    align: { type: 'alignment', default: 'left' },
    background: { type: 'color', default: '@theme.badge.background' },
    color: { type: 'color', default: '@theme.badge.color' },
    radius: { type: 'length', default: '@theme.badge.radius' },
    border: { type: 'text', attr: true, default: 'none' },
    size: { type: 'length', default: '11px' },
    tracking: { type: 'length', default: '1px' },
    transform: { type: 'enum', values: ['uppercase', 'none', 'capitalize'], default: 'uppercase' },
    innerPadding: { type: 'spacing', default: '5px 10px' },
    padding: { type: 'spacing', default: '0 0 @spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Filled badge in the theme badge style.' },
    pill: { description: 'Fully rounded pill (square in Outlook desktop).', settings: { radius: '@radius.pill', innerPadding: '5px 14px' } },
    outline: { description: 'Outlined chip with no fill.', settings: { background: 'transparent', color: '@colors.text', border: '1px solid @colors.text' } },
    tag: {
      description: 'Quiet tag: muted text on the page background, sentence case.',
      settings: { background: '@colors.background', color: '@colors.secondary', transform: 'none', tracking: '0px', radius: '@radius.small' },
    },
    success: { description: 'Green status chip.', settings: { background: '@colors.success', color: '@colors.white' } },
    urgent: { description: 'Red urgency chip.', settings: { background: '@colors.error', color: '@colors.white' } },
  },

  previewData: { data: { text: 'Best seller' } },

  compat: {
    outlook: 'Background, padding and border honored. Rounded corners are not.',
    gmail: 'Fine.',
    darkMode: 'Chips keep their own colors.',
  },
};
