const email = (id, name, description, blockIds, preheader, header = 'header-left', footer = 'footer-resources') => ({
  id, name, category: 'Complete emails', description, blockIds: [header, ...blockIds, footer], preheader,
});
module.exports = [
  email('welcome', '01 / A clearer view', 'A brand introduction with a platform overview and a friendly next step.', ['hero-statement', 'platform-trio', 'cta-peach'], 'Explore a clearer view of your water systems.'),
  email('platform-tour', '02 / Platform tour', 'A concise walkthrough of monitoring, context, and the next conversation.', ['hero-centered', 'platform-steps', 'platform-comparison', 'cta-outline'], 'Explore the Water Health Index approach.', 'header-center'),
  email('sensor-overview', '03 / Sensor spotlight', 'An image-led product introduction with online and portable paths.', ['hero-split', 'sensor-choices', 'cta-split'], 'Explore sensors and systems for your facility.'),
  email('consulting', '04 / A useful conversation', 'Consulting introduction, preparation checklist, and contact panel.', ['hero-letter', 'consulting-services', 'assessment-checklist', 'cta-contact-card'], 'Bring your water-management questions to the team.'),
  email('pool-outreach', '05 / For pool teams', 'An industry-specific opening, published case-study link, and contact action.', ['industry-pools', 'case-pool', 'cta-split'], 'A closer look at water management for pools.'),
  email('grower-outreach', '06 / For growing operations', 'A grower-focused introduction with a relevant case-study invitation.', ['industry-growers', 'case-grower', 'cta-peach'], 'Explore water monitoring for your growing operation.'),
  email('building-outreach', '07 / Beyond the tap', 'A facility-focused message with a campus case-study and planning prompts.', ['industry-buildings', 'case-building', 'consultation-process', 'cta-outline'], 'Bring a system-level perspective to building water.'),
  email('water-operations', '08 / Water in operation', 'Two sector panels for process and regulated-water audiences.', ['industry-drinking-water', 'industry-process-water', 'cta-contact-card'], 'Find a starting point for your water operation.'),
  email('field-notes', '09 / The water brief', 'A sidebar newsletter with linked contents and two illustrated articles.', ['hero-sidebar', 'topic-navigation', 'editorial-pair', 'cta-training'], 'Monitoring, perspective, and practical learning.', 'header-navigation'),
  email('reading-list', '10 / A little perspective', 'An image opener followed by a compact text reading digest.', ['hero-image-first', 'editorial-digest', 'cta-resources'], 'Save a few ideas for your next team conversation.', 'header-navigation'),
  email('team-learning', '11 / Learn together', 'An evergreen training invitation without invented dates or availability.', ['announcement', 'training-feature', 'training-paths', 'cta-training'], 'Explore learning options for your team.', 'header-center'),
  email('personal-followup', '12 / Keep the conversation going', 'A quieter follow-up with helpful links and a simple team sign-off.', ['followup-note', 'reading-sidebar', 'closing-signoff'], 'A few places to continue exploring.', 'header-left', 'footer-minimal'),
];
