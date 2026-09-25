const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');

// Eyebrow, headline, description, product image and a button, laid out as a standard, split or text-only hero.
module.exports = {
  name: 'Product Introduction',
  description: 'Eyebrow, headline, description, product image and a button. Standard, split or text-only hero.',

  fields: {
    eyebrow: 'text',
    headline: { type: 'text', required: true },
    description: 'text',
    image: 'image',
    cta: 'cta',
    layout: { type: 'enum', values: ['standard', 'split', 'text-only'], default: 'standard' },
    dark: { type: 'boolean', default: false },
  },

  previewData: {
    eyebrow: 'New for summer',
    headline: 'The Coastal Linen Shirt',
    description: 'Relaxed, breathable and softer with every wash, cut from European flax.',
    image: P.img(600, 340, 'Coastal Shirt', 'The Coastal linen shirt in sand, laid flat on a wooden bench'),
    cta: { label: 'Shop the shirt', href: 'https://example.com/products/coastal-linen-shirt' },
  },

  build(d) {
    const { layout, dark, ...content } = d;
    if (layout === 'split') return [node('hero/split', content)];
    if (layout === 'text-only') {
      const { image, ...text } = content;
      return [node('hero/text-only', text, { variant: dark ? 'dark' : 'default' })];
    }
    return [node('hero/standard', content, { variant: dark ? 'dark' : 'default' })];
  },
};
