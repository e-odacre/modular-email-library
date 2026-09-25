module.exports = {
  name: 'Heading',
  description: 'A heading with a semantic tag (h1-h6) and a separately chosen visual size.',
  level: 'content',

  fields: {
    text: { type: 'text', required: true },
  },

  settings: {
    level: { type: 'enum', values: ['h2', 'display', 'h1', 'h3', 'h4', 'bodyLarge', 'body', 'bodySmall', 'caption', 'eyebrow', 'price', 'salePrice'], default: 'h2' },
    tag: { type: 'enum', values: ['h2', 'h1', 'h3', 'h4', 'h5', 'h6', 'div'], default: 'h2' },
    align: { type: 'alignment', default: 'left' },
    color: { type: 'text', attr: true, default: 'auto' },
    transform: { type: 'enum', values: ['auto', 'none', 'uppercase', 'capitalize'], default: 'auto' },
    tracking: { type: 'text', attr: true, default: 'auto' },
    padding: { type: 'spacing', default: '0 0 @spacing.sm 0' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { mobileAlignment: ['inherit', 'left', 'center', 'right'], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Section heading (h2 size and tag).' },
    display: { description: 'Large display heading, for a single statement per email.', settings: { level: 'display', tag: 'h1' } },
    title: { description: 'Page title (h1).', settings: { level: 'h1', tag: 'h1' } },
    subheading: { description: 'Smaller subheading (h3).', settings: { level: 'h3', tag: 'h3' } },
    centered: { description: 'Centered section heading.', settings: { align: 'center' } },
  },

  previewData: { data: { text: 'Summer Collection' } },

  compat: {
    outlook: 'Heading tags honored with explicit inline styles.',
    gmail: 'Fine.',
    darkMode: 'Text color swaps via dm-text where honored. Set darkMode off on colored backgrounds.',
  },
};
