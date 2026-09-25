const { n, site, urls, entry, section, columns, heading, text, eyebrow, button, link, rule, card } = require('./shared');
const industries = [
  { id: 'pools', name: 'Pools', slug: 'municipal-commercial-pools', label: 'MUNICIPAL & COMMERCIAL POOLS', headline: 'A clearer picture for your pool team.', copy: 'Review monitoring, operating practices, and the questions behind a more consistent pool-water routine.' },
  { id: 'growers', name: 'Growers', slug: 'greenhouses-field-crops', label: 'GREENHOUSES & FIELD CROPS', headline: 'Follow the water through your growing operation.', copy: 'Explore the role of monitoring in incoming water and irrigation return loops.' },
  { id: 'buildings', name: 'Buildings', slug: 'building-water', label: 'BUILDING WATER SYSTEMS', headline: 'Look beyond the tap.', copy: 'Bring monitoring and a system-level view into your building-water planning.' },
  { id: 'drinking-water', name: 'Drinking water', slug: 'drinking-water', label: 'REGULATED DRINKING WATER', headline: 'Support the people behind the system.', copy: 'Explore tools for monitoring and record visibility with your operating team.' },
  { id: 'process-water', name: 'Process water', slug: 'industrial-process-water', label: 'PROCESS WATER', headline: 'Follow water through the process.', copy: 'Consider monitoring needs across incoming water, treatment, and reuse.' },
  { id: 'residential', name: 'Residential', slug: 'residential', label: 'RESIDENTIAL WATER', headline: 'Start with a question about your water.', copy: 'Explore SanEcoTec’s residential services for your well or municipal water setup.' },
];
const blocks = industries.map((item, index) => {
  const href = `${site}/industries/${item.slug}`;
  const palette = ['blue', 'paper', 'navy', 'paper', 'blue', 'peach'][index];
  const content = [eyebrow(item.label, palette), heading(item.headline, palette), text(item.copy, palette), button(`Explore ${item.name.toLowerCase()}`, href, palette)];
  let nodes;
  if (index === 0 || index === 4) nodes = [columns([[heading(index === 0 ? 'POOL /' : 'FLOW /', palette, 'h1'), rule(palette)], content], palette, '30/70')];
  else if (index === 2) nodes = [section(content, palette, { border: '1px solid @colors.secondary', padding: '@spacing.2xl @spacing.xl' })];
  else if (index === 3) nodes = [section(content.slice(0, 3), palette), section([link('Explore regulated drinking water', href, palette)], palette, { padding: '0 @spacing.xl @spacing.xl @spacing.xl' })];
  else nodes = [section(content, palette)];
  return entry(`industry-${item.id}`, `${item.name} spotlight`, 'Industries', `A ${palette} editorial block tailored to ${item.name.toLowerCase()}.`, nodes, [href]);
});
blocks.push(
  entry('industry-directory', 'Six-sector directory', 'Industries', 'A two-column directory with direct industry destinations.', [
    section([eyebrow('FIND YOUR SECTOR'), heading('Different systems. Shared questions.')]),
    n('layout/grid', { items: industries.map((item) => [heading(item.name, 'navy', 'h3'), link('View industry solutions', `${site}/industries/${item.slug}`)]) }, { settings: { columns: 2, paddingY: '@spacing.md' } }),
  ], industries.map((item) => `${site}/industries/${item.slug}`)),
  entry('industry-picker', 'Operator or grower?', 'Industries', 'A two-path sector selector for a mixed audience.', [columns([
    card('FOR FACILITIES', 'A building or pool?', 'Start with water systems used by your team and visitors.', `${site}/industries/building-water`, 'paper'),
    card('FOR GROWERS', 'A greenhouse or field?', 'Start with the water moving through your growing operation.', `${site}/industries/greenhouses-field-crops`, 'paper'),
  ], 'paper')], [urls.home]),
);
module.exports = blocks;
