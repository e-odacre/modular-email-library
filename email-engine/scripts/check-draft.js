const { readDraft, renderDraft } = require('./lib/drafts');
const [id, ...extra] = process.argv.slice(2);
(async () => {
  if (!id || extra.length) throw new Error('Usage: npm run email:check -- <build-id>');
  const result = await renderDraft(readDraft(id));
  for (const warning of result.diagnostics.warnings) console.warn(`Warning: ${warning}`);
  if (result.diagnostics.errors.length) throw new Error(result.diagnostics.errors.join('\n'));
  console.log(`${id}: checks passed (${(result.bytes / 1024).toFixed(1)} KB). Review the preview before export.`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
