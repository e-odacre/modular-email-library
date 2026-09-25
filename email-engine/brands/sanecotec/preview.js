// Draft-only preview. This folder is deliberately outside automatic brand/email discovery.
const fs = require('node:fs');
const path = require('node:path');
const { renderEmail } = require('../../scripts/lib/render');
const { validateTokens, loadTokenFile } = require('../../scripts/lib/tokens');
const { runChecks } = require('../../scripts/lib/checks');
const { DIST_DIR } = require('../../scripts/lib/paths');

async function main() {
  const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.draft.json'), 'utf8'));
  const validation = validateTokens('sanecotec', tokens, loadTokenFile('placeholder'));
  if (validation.errors.length) throw new Error(validation.errors.join('\n'));
  console.warn('DRAFT REVIEW ONLY — not a production brand build.');
  for (const issue of validation.placeholderIssues) console.warn(`  ${issue}`);
  const result = await renderEmail('brands/sanecotec/preview.mjml', tokens);
  const checks = runChecks(result.html, 'sanecotec', result.mjml);
  const errors = [...result.mjmlErrors.map((e) => e.formattedMessage || e.message), ...checks.errors];
  if (errors.length) throw new Error(errors.join('\n'));
  for (const warning of checks.warnings) console.warn(warning);
  const out = path.join(DIST_DIR, 'sanecotec', 'draft', 'introduction.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, result.html);
  console.log(`Draft preview: ${out}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
