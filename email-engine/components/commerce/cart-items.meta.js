const { createVars } = require('../../scripts/lib/variables');
const { SECTION_RESPONSIVE } = require('../_shared');

const v = createVars();

module.exports = {
  name: 'Cart Items',
  description: "The products in a customer's cart or order, repeated from Klaviyo event data with a for loop, each row with image, title, quantity and price.",
  level: 'section',

  fields: {
    heading: 'text',
    itemsVariable: { type: 'text', attr: true, default: v.get('cart.items') },
    alias: { type: 'text', attr: true, default: 'item' },
    item: {
      type: 'object',
      required: true,
      fields: {
        title: { type: 'text', required: true },
        image: { type: 'url', required: true },
        imageAlt: { type: 'text', attr: true },
        price: 'text',
        quantity: 'text',
      },
    },
    total: 'text',
    totalLabel: { type: 'text', default: 'Total:' },
    cta: 'cta',
  },

  settings: {
    split: { type: 'text', attr: true, default: '25/75' },
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
    rowPadding: { type: 'spacing', default: '@spacing.sm @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'One row per item: a small image, then the title, quantity and price.' },
    large: { description: 'Bigger images (40/60).', settings: { split: '40/60' } },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      heading: 'Your cart',
      item: {
        title: v.get('cart.item.title'),
        image: v.get('cart.item.image'),
        imageAlt: v.get('cart.item.title'),
        price: v.get('cart.item.price'),
        quantity: v.get('cart.item.quantity'),
      },
      total: '{{ event.extra.total_price }}',
      cta: { label: 'Return to your cart', href: v.get('cart.checkout_url') },
    },
  },

  validate(data) {
    const errors = [];
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(data.alias)) errors.push(`alias "${data.alias}" must be a plain name like item`);
    if (!/^[A-Za-z_][A-Za-z0-9_.]*$/.test(data.itemsVariable)) errors.push(`itemsVariable "${data.itemsVariable}" must be a path like event.extra.line_items, not a tag`);
    return errors;
  },

  compat: {
    outlook: 'Each row is a media-text table row.',
    gmail: 'Rows stack on phones through a media query. Non-Google Gmail accounts keep the desktop layout.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
