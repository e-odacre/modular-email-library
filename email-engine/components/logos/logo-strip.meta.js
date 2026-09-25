const { SECTION_RESPONSIVE } = require('../_shared');

const logo = (name) => ({ src: `https://placehold.co/240x80/png?text=${encodeURIComponent(name)}`, alt: name });

module.exports = {
  name: 'Logo Strip',
  description: 'A row of logos with an optional label. Trusted-by, partners, clients and press layouts are variants.',
  level: 'section',

  fields: {
    label: 'text',
    logos: { type: 'logos', min: 2, max: 8, required: true },
  },

  settings: {
    columns: { type: 'enum', values: [4, 2, 3, 5, 6], default: 4 },
    logoWidth: { type: 'length', default: '100px' },
    labelColor: { type: 'text', attr: true, default: '@colors.mutedText' },
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
    columnPadding: { type: 'spacing', default: '@spacing.sm' },
    gap: { type: 'length', default: '@spacing.xs' },
  },

  responsive: { mobileColumns: [2, 1], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Four logos across.' },
    'trusted-by': { description: 'A "Trusted by" label above four logos on the page background color.', settings: { background: '@colors.background' } },
    partners: { description: 'Three larger partner logos.', settings: { columns: 3, logoWidth: '140px' } },
    clients: { description: 'Six small client logos in one row.', settings: { columns: 6, logoWidth: '64px', columnPadding: '@spacing.xs' } },
    press: { description: 'Three press logos with generous space, on the surface color.', settings: { columns: 3, logoWidth: '120px', paddingY: '@spacing.xl' } },
  },

  previewData: {
    data: {
      label: 'Trusted by teams at',
      logos: [logo('Northwind'), logo('Fabrikam'), logo('Contoso'), logo('Litware')],
    },
    byVariant: {
      partners: { data: { label: 'Our partners', logos: [logo('Northwind'), logo('Fabrikam'), logo('Contoso')] } },
      clients: { data: { label: 'Our clients', logos: [logo('Northwind'), logo('Fabrikam'), logo('Contoso'), logo('Litware'), logo('Tailspin'), logo('Wingtip')] } },
      press: { data: { label: 'As seen in', logos: [logo('The Daily'), logo('Style Weekly'), logo('Good Living')] } },
    },
  },

  compat: {
    outlook: 'Images with fixed widths, honored.',
    gmail: 'Fine. Alt text (the company name) shows when images are blocked.',
    darkMode: 'Label swaps via dm-muted, logos are not recolored.',
  },
};
