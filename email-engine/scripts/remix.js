// Remix: render the same content in a different design.
//
//   npm run remix -- list
//   npm run remix -- recipe sale --theme luxury
//   npm run remix -- recipe sale --theme black-friday --variant commerce/product-grid=luxury --setting commerce/product-grid.columns=3
//   npm run remix -- recipe welcome --data my-welcome.json --brand acme --out welcome.html
//   npm run remix -- recipe sale --all-themes
//   npm run remix -- component commerce/product-card --variant luxury --theme fashion
//
// Options: --brand <name> (default placeholder)  --theme <name>  --variant <component=variant> (repeatable)
//          --setting <component.setting=value> (repeatable)  --data <file.json>  --out <file>  --all-themes
// Output goes to dist/<brand>/remix/ unless --out is given. Nothing else is changed.
const fs = require('fs');
const path = require('path');
const { DIST_DIR, listBrands } = require('./lib/paths');
const { loadBrand } = require('./lib/tokens');
const { renderRecipe, renderComponent } = require('./lib/render');
const { runChecks } = require('./lib/checks');
const { loadRegistry } = require('./lib/registry');
const { createBuilder } = require('./lib/recipes');
const { listThemes, DEFAULT_THEME } = require('./lib/themes');
const { parseRemixArgs } = require('./lib/remix');

function parseArgs(argv) {
  const args = { _: [], variant: [], setting: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all-themes') args.allThemes = true;
    else if (a.startsWith('--')) {
      const key = a.slice(2);
      const value = argv[++i];
      if (value === undefined) throw new Error(`--${key} needs a value`);
      if (key === 'variant' || key === 'setting') args[key].push(value);
      else args[key] = value;
    } else args._.push(a);
  }
  return args;
}

function list(registry, builder) {
  console.log('Recipes:');
  for (const [id, r] of builder.recipes) console.log(`  ${id.padEnd(22)} ${r.description}${r.suggestedTheme ? `  [suggested theme: ${r.suggestedTheme}]` : ''}`);
  console.log('\nSections:');
  for (const [id, s] of builder.sections) console.log(`  ${id.padEnd(22)} ${s.description}`);
  console.log(`\nThemes: ${listThemes().join(', ')}`);
  console.log('\nComponents (variants in brackets):');
  for (const cat of registry.categories()) {
    console.log(`  ${cat}`);
    for (const e of registry.all().filter((x) => x.category === cat)) console.log(`    ${e.id.padEnd(34)} [${Object.keys(e.meta.variants).join(', ')}]`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [kind, name] = args._;
  const registry = loadRegistry();
  const builder = createBuilder();

  if (!kind || kind === 'list') return list(registry, builder);
  if (!['recipe', 'component'].includes(kind) || !name) {
    console.error('Usage: npm run remix -- <recipe|component> <name> [options], or npm run remix -- list');
    process.exit(1);
  }

  const brand = args.brand || 'placeholder';
  if (!listBrands().includes(brand)) throw new Error(`Unknown brand "${brand}". Available: ${listBrands().join(', ')}`);
  const { tokens, errors, placeholderIssues } = loadBrand(brand);
  if (errors.length || placeholderIssues.length) {
    console.error(`tokens/${brand}.json is not ready:\n  ${[...errors, ...placeholderIssues].join('\n  ')}`);
    process.exit(1);
  }

  const themes = args.allThemes ? listThemes() : [args.theme || (kind === 'recipe' && builder.recipes.get(name) && builder.recipes.get(name).suggestedTheme) || DEFAULT_THEME];
  const remix = parseRemixArgs({ variants: kind === 'recipe' ? args.variant : [], settings: args.setting });
  const data = args.data ? JSON.parse(fs.readFileSync(args.data, 'utf8')) : undefined;
  let failed = false;

  for (const theme of themes) {
    let result;
    let checks = { errors: [], warnings: [] };
    if (kind === 'recipe') {
      result = await renderRecipe(name, data, tokens, { theme, remix, registry });
      checks = runChecks(result.html, brand, result.mjml);
    } else {
      const variant = args.variant[0];
      const settings = {};
      for (const [key, value] of Object.entries(remix.settings[name] || {})) settings[key] = value;
      result = await renderComponent(name, tokens, { theme, variant, settings, data, registry });
    }
    const problems = [...result.mjmlErrors.map((e) => e.formattedMessage || e.message), ...checks.errors];
    const out = args.out && !args.allThemes
      ? path.resolve(args.out)
      : path.join(DIST_DIR, brand, 'remix', kind === 'recipe' ? `${name}.${theme}.html` : `${name.replace('/', '-')}${args.variant[0] ? `.${args.variant[0]}` : ''}.${theme}.html`);
    if (problems.length) {
      failed = true;
      console.error(`x ${name} (${theme})\n    ${problems.join('\n    ')}`);
      continue;
    }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, result.html);
    console.log(`ok ${name} (${theme}) -> ${path.relative(process.cwd(), out)}  ${(Buffer.byteLength(result.html) / 1024).toFixed(1)} KB`);
    for (const w of checks.warnings) console.warn(`    warning: ${w}`);
  }
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
