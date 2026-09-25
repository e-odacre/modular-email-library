module.exports = {
  name: 'Header',
  description: 'Logo bar at the top of an email, using the brand logo (and dark-mode logo when defined), with optional navigation links.',
  level: 'section',

  fields: {
    nav: { type: 'links', max: 6 },
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.surface' },
    linkColor: { type: 'color', default: '@colors.text' },
    navGap: { type: 'length', default: '@spacing.md' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingTight @theme.section.paddingX' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Centered logo. Pass nav for a link row beneath it.' },
    left: { description: 'Left-aligned logo.', settings: { align: 'left' } },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      nav: [
        { label: 'New', href: 'https://example.com/collections/new' },
        { label: 'Women', href: 'https://example.com/collections/women' },
        { label: 'Men', href: 'https://example.com/collections/men' },
        { label: 'Sale', href: 'https://example.com/collections/sale' },
      ],
    },
    byVariant: { default: { data: {} } },
  },

  compat: {
    outlook: 'Always shows the light logo.',
    gmail: 'May auto-invert colors, use a logo that reads on both.',
    darkMode: 'Swaps to dark.logoUrl where honored.',
  },
};
