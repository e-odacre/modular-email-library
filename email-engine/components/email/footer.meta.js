const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Footer',
  description: 'Compliance footer: brand name, postal address, unsubscribe and manage-preferences links, plus optional logo, description, social links, navigation, legal links, copyright and disclaimer.',
  level: 'section',

  fields: {
    description: 'text',
    social: { type: 'socialLinks', max: 8 },
    nav: { type: 'links', max: 6 },
    legal: { type: 'links', max: 4 },
    copyright: 'text',
    disclaimer: 'text',
  },

  settings: {
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@spacing.md @theme.section.paddingX @spacing.xl @theme.section.paddingX' },
    gap: { type: 'length', default: '@spacing.md' },
    showLogo: { type: 'boolean', default: false },
    logoWidth: { type: 'length', default: '120px' },
    socialVariant: { type: 'enum', values: ['default', 'round', 'text'], default: 'default' },
    linkColor: { type: 'color', default: '@colors.mutedText' },
    unsubscribeLabel: { type: 'text', default: 'Unsubscribe' },
    preferencesLabel: { type: 'text', default: 'Manage preferences' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Brand name, address, unsubscribe and manage-preferences links.' },
    rich: { description: 'Adds the logo above the content. Pass description, social, nav, legal and copyright for the full footer.', settings: { showLogo: true } },
    minimal: { description: 'Smaller footer with tighter spacing.', settings: { gap: '@spacing.sm' } },
  },

  previewData: {
    data: {
      description: 'Sustainable everyday clothing, made to last. Designed in Portland, made in Portugal.',
      social: [
        { network: 'instagram', href: 'https://instagram.com/example', label: 'Instagram' },
        { network: 'facebook', href: 'https://facebook.com/example', label: 'Facebook' },
        { network: 'pinterest', href: 'https://pinterest.com/example', label: 'Pinterest' },
      ],
      nav: [
        { label: 'Shop', href: 'https://example.com/collections/all' },
        { label: 'Our story', href: 'https://example.com/pages/about' },
        { label: 'Help', href: 'https://example.com/pages/help' },
      ],
      legal: [
        { label: 'Privacy policy', href: 'https://example.com/policies/privacy' },
        { label: 'Terms of service', href: 'https://example.com/policies/terms' },
      ],
      copyright: '© Placeholder Brand. All rights reserved.',
      disclaimer: 'You are receiving this email because you signed up at example.com.',
    },
    byVariant: { default: { data: {} }, minimal: { data: {} } },
  },

  compat: {
    outlook: 'Fine. Keep footer text at 12px or above.',
    gmail: 'Fine. Gmail may add its own unsubscribe control separately.',
    darkMode: 'Text and link colors swap via dm-* classes where honored.',
  },
};
