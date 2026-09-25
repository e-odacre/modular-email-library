// Networks with an icon built into MJML. Anything else needs its own icon URL.
const BUILT_IN = ['facebook', 'twitter', 'x', 'pinterest', 'linkedin', 'instagram', 'web', 'snapchat', 'youtube', 'tumblr', 'github', 'vimeo', 'medium'];

module.exports = {
  name: 'Social Links',
  description: 'A row of social network links, as icons or as text links.',
  level: 'content',

  fields: {
    links: { type: 'socialLinks', min: 1, max: 8, required: true },
  },

  settings: {
    display: { type: 'enum', values: ['icons', 'text'], default: 'icons' },
    align: { type: 'alignment', default: 'center' },
    iconSize: { type: 'length', default: '32px' },
    radius: { type: 'length', default: '@radius.small' },
    gap: { type: 'length', default: '@spacing.xs' },
    color: { type: 'color', default: '@colors.link' },
    padding: { type: 'spacing', default: '@spacing.sm 0' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Icon row.' },
    round: { description: 'Round icons.', settings: { radius: '50%' } },
    text: { description: 'Plain text links separated by dots.', settings: { display: 'text' } },
  },

  previewData: {
    data: {
      links: [
        { network: 'instagram', href: 'https://instagram.com/example', label: 'Instagram' },
        { network: 'facebook', href: 'https://facebook.com/example', label: 'Facebook' },
        { network: 'youtube', href: 'https://youtube.com/@example', label: 'YouTube' },
        { network: 'pinterest', href: 'https://pinterest.com/example', label: 'Pinterest' },
      ],
    },
  },

  validate(data, s) {
    const errors = [];
    if (s.display === 'icons') {
      data.links.forEach((l, i) => {
        if (!BUILT_IN.includes(l.network) && !l.icon) {
          errors.push(`links[${i}]: "${l.network}" has no built-in icon, pass an icon URL for it (or use the text variant)`);
        }
      });
    }
    return errors;
  },

  compat: {
    outlook: 'Icons render as linked images, radius ignored.',
    gmail: 'Fine. The label is the alt text when images are blocked.',
    darkMode: 'Icons keep their colors. Text variant follows the link color.',
  },
};
