// Usage: node scripts/build.js [brand] [--theme <name|all>]
// With no brand, builds every brand in tokens/. Output goes to dist/<brand>/<flows|campaigns>/<name>.html.
// --theme builds the emails with another theme (same content, different design). Non-default themes are written to
// dist/<brand>/themes/<theme>/<flows|campaigns>/<name>.html. "--theme all" builds every theme.
const fs = require('fs');
const path = require('path');
const { DIST_DIR, listBrands, listEmails } = require('./lib/paths');
const { loadBrand, REFERENCE_BRAND } = require('./lib/tokens');
const { renderEmail } = require('./lib/render');
const { runChecks } = require('./lib/checks');
const { DEFAULT_THEME, listThemes } = require('./lib/themes');
const { loadRegistry } = require('./lib/registry');

function parseArgs(argv) {
  const args = { brand: undefined, themes: [DEFAULT_THEME] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--theme') {
      const value = argv[++i];
      if (!value) throw new Error('--theme needs a name (or "all")');
      args.themes = value === 'all' ? listThemes() : [value];
    } else if (!args.brand) {
      args.brand = argv[i];
    } else {
      throw new Error(`Unexpected argument "${argv[i]}"`);
    }
  }
  return args;
}

async function buildBrand(brand, themes, registry) {
  let failed = false;
  const { tokens, errors, placeholderIssues } = loadBrand(brand);
  const tokenProblems = [...errors, ...placeholderIssues];

  if (tokenProblems.length) {
    console.error(`\n${brand}: tokens/${brand}.json failed validation`);
    for (const p of tokenProblems) console.error(`  x ${p}`);
    return true;
  }

  for (const theme of themes) {
    console.log(`\n${brand}${theme === DEFAULT_THEME ? '' : ` (theme: ${theme})`}`);
    const outDir = theme === DEFAULT_THEME ? path.join(DIST_DIR, brand) : path.join(DIST_DIR, brand, 'themes', theme);
    for (const email of listEmails({ examples: brand === REFERENCE_BRAND })) {
      try {
        const { html, mjml, mjmlErrors } = await renderEmail(`${email}.mjml`, tokens, { theme, registry });
        const { errors: checkErrors, warnings } = runChecks(html, brand, mjml);
        const problems = [...mjmlErrors.map((e) => e.formattedMessage || e.message), ...checkErrors];

        if (problems.length) {
          failed = true;
          console.error(`  x ${email}`);
          for (const p of problems) console.error(`      ${p}`);
          continue;
        }

        const out = path.join(outDir, `${email}.html`);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, html);
        console.log(`  ok ${email} -> ${path.relative(process.cwd(), out)}`);
        for (const w of warnings) console.warn(`      warning: ${w}`);
      } catch (err) {
        failed = true;
        console.error(`  x ${email}\n      ${err.message}`);
      }
    }
  }
  return failed;
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const brands = listBrands();
  if (args.brand && !brands.includes(args.brand)) {
    console.error(`Unknown brand "${args.brand}". Available: ${brands.join(', ')}`);
    process.exit(1);
  }
  const unknownTheme = args.themes.find((t) => !listThemes().includes(t));
  if (unknownTheme) {
    console.error(`Unknown theme "${unknownTheme}". Available: ${listThemes().join(', ')}`);
    process.exit(1);
  }

  const registry = loadRegistry();
  let failed = false;
  for (const brand of args.brand ? [args.brand] : brands) {
    if (await buildBrand(brand, args.themes, registry)) failed = true;
  }
  process.exit(failed ? 1 : 0);
}

main();
