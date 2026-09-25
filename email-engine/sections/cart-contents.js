const { node } = require('../scripts/lib/recipes');

// The products in a customer's cart or order, from Klaviyo event data. Variable names come from variables/klaviyo.json.
module.exports = {
  name: 'Cart Contents',
  description: "The products in a customer's cart or order, repeated from Klaviyo event data, with a total and a button.",

  fields: {
    heading: { type: 'text', default: 'Your cart' },
    itemsVariable: 'text',
    alias: 'text',
    total: 'text',
    cta: 'cta',
  },

  previewData: {
    heading: 'Still thinking it over?',
    total: '{{ event.extra.total_price }}',
  },

  build(d, ctx) {
    const { vars } = ctx;
    return [
      node('commerce/cart-items', {
        heading: d.heading,
        itemsVariable: d.itemsVariable,
        alias: d.alias,
        item: {
          title: vars.get('cart.item.title'),
          image: vars.get('cart.item.image'),
          imageAlt: vars.get('cart.item.title'),
          price: vars.get('cart.item.price'),
          quantity: vars.get('cart.item.quantity'),
        },
        total: d.total,
        cta: d.cta || { label: 'Return to your cart', href: vars.get('cart.checkout_url') },
      }),
    ];
  },
};
