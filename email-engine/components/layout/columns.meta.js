const { sectionSettings, SECTION_RESPONSIVE, P } = require('../_shared');

// Preview columns: a small feature each, so every split has realistic content.
const items = [
  [P.image(280, 200, 'Linen', 'A folded linen shirt in sand'), P.heading('Breathable linen', 'h4'), P.text('Cut loose for warm days.')],
  [P.image(280, 200, 'Cotton', 'A washed cotton tee in white'), P.heading('Washed cotton', 'h4'), P.text('Soft from the first wear.')],
  [P.image(280, 200, 'Denim', 'Light denim shorts folded'), P.heading('Light denim', 'h4'), P.text('Easy, all-day shorts.')],
  [P.image(280, 200, 'Canvas', 'A canvas tote in navy'), P.heading('Canvas totes', 'h4'), P.text('Made to be carried daily.')],
];
const preview = (n) => ({ data: { columns: items.slice(0, n) } });

const splits = {
  'one-column': ['100', 'A single full-width column.'],
  default: ['50/50', 'Two equal columns.'],
  'three-column': ['33.33/33.33/33.33', 'Three equal columns.'],
  'four-column': ['25/25/25/25', 'Four equal columns.'],
  'split-60-40': ['60/40', 'Wide left column, narrow right column.'],
  'split-40-60': ['40/60', 'Narrow left column, wide right column.'],
  'split-70-30': ['70/30', 'Main content with a narrow side column.'],
  'split-30-70': ['30/70', 'Narrow side column with main content.'],
  'sidebar-left': ['25/75', 'Small left rail and a large content area.'],
  'sidebar-right': ['75/25', 'Large content area and a small right rail.'],
};

const variants = {};
const byVariant = {};
for (const [name, [split, description]] of Object.entries(splits)) {
  variants[name] = { description, settings: { split } };
  byVariant[name] = preview(split.split('/').length);
}

module.exports = {
  name: 'Columns',
  description: 'Side-by-side columns (1 to 4, any split) that stack on mobile, with reverse and preserve options.',
  level: 'section',

  fields: {
    columns: { type: 'list', of: { type: 'slot', accepts: 'content' }, min: 1, max: 4, required: true },
  },

  settings: sectionSettings({
    split: { type: 'text', attr: true, default: '50/50' },
    valign: { type: 'enum', values: ['top', 'middle', 'bottom'], default: 'top' },
    columnPadding: { type: 'spacing', default: '0 @spacing.sm' },
  }),

  responsive: {
    mobileLayout: ['stack', 'reverse', 'preserve'],
    mobileAlignment: ['inherit', 'left', 'center', 'right'],
    mobileColumns: [1, 2],
    hideOnMobile: true,
    hideOnDesktop: true,
  },

  variants,

  previewData: { data: preview(2).data, byVariant },

  validate(data, s) {
    const widths = s.split.split('/').map(Number);
    const errors = [];
    if (widths.some((w) => !(w > 0))) errors.push(`setting "split" must be numbers like 60/40, got "${s.split}"`);
    else {
      if (widths.length !== data.columns.length) {
        errors.push(`columns: split "${s.split}" has ${widths.length} column(s) but ${data.columns.length} were given`);
      }
      const total = widths.reduce((a, b) => a + b, 0);
      if (Math.abs(total - 100) > 0.5) errors.push(`setting "split" must add up to 100, "${s.split}" adds up to ${total}`);
    }
    return errors;
  },

  compat: {
    outlook: 'Columns render as a table row. Mobile-only settings (mobileColumns, mobileAlignment) are ignored.',
    gmail: 'Stacking works. Gmail on non-Google accounts drops media queries and shows the desktop layout.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
