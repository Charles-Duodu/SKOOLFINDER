/**
 * SkoolFinder Ghana - Automated Verification Suite: Homepage Visual & UX Polish Audit (H01-H16)
 *
 * Comprehensive automated verification for Modules H01 through H16:
 * 1. H01 & H02: Shell Navigation, Hero Search & 4-Image Slideshow
 * 2. H03: Three Clear Discovery Pathways (Browse All, Fit Matchmaker, Locality Hubs)
 * 3. H04: Education Levels (Crèche, Kindergarten, Primary, JHS, SHS) & Hover Micro-interactions
 * 4. H05: Location Hubs (Cantonments, East Legon, Spintex/Tema, Achimota) & Locality Navigation
 * 5. H06: Featured Campus Cards with Truthful Fee Period Badges & Missing-Data Fallbacks
 * 6. H07: 4-Way Side-by-Side Comparison Intro (Zero Paywall)
 * 7. H08: Explainable Matchmaker Intro (No Fake % Scores)
 * 8. H09: Fee Transparency & Pre-Tertiary Ghanaian Fee Structure Guidance
 * 9. H10 & H11: Opportunities Gateway (Educators, Vacancies, Free 1-Click Apply, NTC Vetting)
 * 10. H12: B2B Procurement & Public Tenders (Sealed Bids Protected, MoMo Escrow)
 * 11. H13 & H14: Institutional Onboarding & Approved Commercial Pricing (Free GH₵0, Growth GH₵99/mo)
 * 12. H15: Academic Resource Centre (BECE, WASSCE, Cambridge Past Papers & CSSPS Agg Calculator)
 * 13. H16: "How We Verify School Information" & NaSIA Distinction 4-Pillar Strip
 * 14. Event Listener Reconciliation: 0 Missing HTML IDs targeted by getElementById
 * 15. WCAG 2.1 AA/AAA Contrast & CSS Polish: Navy Text on Gold Search Button & Card Touch Targets
 * 16. Cache Buster Verification: Unified ?v=78 in public/index.html
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

async function runHomeAuditTests() {
  console.log('\n========================================================================');
  console.log('🚀 RUNNING HOMEPAGE VISUAL & UX POLISH AUDIT TEST SUITE (H01-H16)');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✅ [PASS] ${total}. ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${total}. ${name}`);
      console.error(`     Error: ${err.message}\n`);
    }
  }

  async function testAsync(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${total}. ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${total}. ${name}`);
      console.error(`     Error: ${err.message}\n`);
    }
  }

  // Load target source files
  const homeViewPath = path.join(__dirname, '../public/js/views/homeView.js');
  const styleCssPath = path.join(__dirname, '../public/css/style.css');
  const componentsCssPath = path.join(__dirname, '../public/css/components.css');
  const indexHtmlPath = path.join(__dirname, '../public/index.html');
  const forTeachersPath = path.join(__dirname, '../public/js/views/forTeachersView.js');

  const homeViewCode = fs.readFileSync(homeViewPath, 'utf8');
  const styleCss = fs.readFileSync(styleCssPath, 'utf8');
  const componentsCss = fs.readFileSync(componentsCssPath, 'utf8');
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  const forTeachersCode = fs.readFileSync(forTeachersPath, 'utf8');

  // Test 1: H01 & H02 - Hero search form inputs & 4-image crossfade slideshow
  test('H01 & H02: Hero section renders search form and 4-image crossfade slideshow', () => {
    assert.ok(homeViewCode.includes('id="section-hero"'), 'Hero section must have id="section-hero"');
    assert.ok(homeViewCode.includes('class="hero-slideshow"'), 'Must contain hero-slideshow element');
    assert.ok(homeViewCode.includes('id="hero-search-form"'), 'Must contain form id="hero-search-form"');
    assert.ok(homeViewCode.includes('id="hero-search-suburb"'), 'Must have input id="hero-search-suburb"');
    assert.ok(homeViewCode.includes('id="hero-search-level"'), 'Must have select id="hero-search-level"');
    assert.ok(homeViewCode.includes('id="hero-search-curriculum"'), 'Must have select id="hero-search-curriculum"');
    assert.ok(homeViewCode.includes('id="btn-hero-search-submit"'), 'Must have button id="btn-hero-search-submit"');
    assert.ok(homeViewCode.includes('id="btn-hero-role-tour"'), 'Must have button id="btn-hero-role-tour" for 30s tour');
  });

  // Test 2: H03 - Three Clear Discovery Pathways
  test('H03: Exposes 3 distinct discovery pathways without paywalls', () => {
    assert.ok(homeViewCode.includes('id="btn-choice-schools"'), 'Must have button id="btn-choice-schools"');
    assert.ok(homeViewCode.includes('id="btn-hero-matchmaker"'), 'Must have button id="btn-hero-matchmaker"');
    assert.ok(homeViewCode.includes('id="btn-choice-locations"'), 'Must have button id="btn-choice-locations"');
  });

  // Test 3: H04 - Level-Specific Search Cards
  test('H04: Level-specific search covers Crèche, Kindergarten, Primary, JHS, and SHS', () => {
    assert.ok(homeViewCode.includes('data-level="Crèche"'), 'Must have card for Crèche');
    assert.ok(homeViewCode.includes('data-level="Kindergarten"'), 'Must have card for Kindergarten');
    assert.ok(homeViewCode.includes('data-level="Primary"'), 'Must have card for Primary');
    assert.ok(homeViewCode.includes('data-level="JHS"'), 'Must have card for JHS');
    assert.ok(homeViewCode.includes('data-level="SHS"'), 'Must have card for SHS');
  });

  // Test 4: H05 - Locality & Enclave Hubs
  test('H05: Geographic hubs cover Cantonments, East Legon, Spintex/Tema, and Achimota', () => {
    assert.ok(homeViewCode.includes('id="section-locations"'), 'Must contain section id="section-locations"');
    assert.ok(homeViewCode.includes('data-suburb="Cantonments"'), 'Must have card for Cantonments');
    assert.ok(homeViewCode.includes('data-suburb="East Legon"'), 'Must have card for East Legon');
    assert.ok(homeViewCode.includes('data-suburb="Tema"'), 'Must have card for Tema');
    assert.ok(homeViewCode.includes('data-suburb="Achimota"'), 'Must have card for Achimota');
  });

  // Test 5: H06 - Truthful Fee Period Badges on Campus Cards
  test('H06: School card generation enforces truthful fee period and missing-data labels', () => {
    assert.ok(homeViewCode.includes('Fee Not Disclosed'), 'Must provide truthful fallback for undisclosed fees');
    assert.ok(homeViewCode.includes('/ Term'), 'Disclosed fees must reflect Ghanaian term billing');
    assert.ok(homeViewCode.includes('badge-fee-budget'), 'Enforces budget fee classification');
    assert.ok(homeViewCode.includes('badge-fee-elite'), 'Enforces elite fee classification');
    assert.ok(homeViewCode.includes('btn-card-compare'), 'School card must provide 1-click comparison toggle');
    assert.ok(homeViewCode.includes('btn-card-bookmark'), 'School card must provide 1-click save/bookmark toggle');
  });

  // Test 6: H07 & H08 - Decision Tools (Compare Matrix & Matchmaker Teasers)
  test('H07 & H08: Decision tool teasers wire compare and matchmaker navigation', () => {
    assert.ok(homeViewCode.includes('id="btn-home-compare-cta"'), 'Must have button id="btn-home-compare-cta"');
    assert.ok(homeViewCode.includes('id="btn-home-matchmaker-cta"'), 'Must have button id="btn-home-matchmaker-cta"');
    assert.ok(homeViewCode.includes('Compare Up to 4 Schools Free'), 'Compare teaser guarantees free guest access');
    assert.ok(homeViewCode.includes('Explainable Fit Matchmaker'), 'Matchmaker teaser affirms explainable non-fabricated fit');
  });

  // Test 7: H09 - Fee Transparency & Pre-Tertiary Guidance
  test('H09: Fee transparency section educates parents on tuition vs term levies and caution deposits', () => {
    assert.ok(homeViewCode.includes('Understanding School Fees in Ghana'), 'Must feature fee guidance section');
    assert.ok(homeViewCode.includes('Tuition vs. Term Levies'), 'Explains 3 terms per academic year billing');
    assert.ok(homeViewCode.includes('One-Off Admission Charges'), 'Explains caution deposits & capital development levies');
  });

  // Test 8: H10 & H11 - Educators & Teaching Vacancies Gateway
  test('H10 & H11: Teachers & vacancies card features free 1-click apply, NTC vetting, and pricing links', () => {
    assert.ok(homeViewCode.includes('id="btn-goto-jobs"'), 'Must have button id="btn-goto-jobs"');
    assert.ok(homeViewCode.includes('id="btn-goto-for-teachers"'), 'Must have button id="btn-goto-for-teachers"');
    assert.ok(homeViewCode.includes('id="btn-home-post-job"'), 'Must have button id="btn-home-post-job" for posting vacancies');
    assert.ok(homeViewCode.includes('id="btn-home-view-tutor-pricing"'), 'Must have button id="btn-home-view-tutor-pricing"');
    assert.ok(homeViewCode.includes('1-Click Apply Free'), 'Highlights free application for candidates');
    assert.ok(homeViewCode.includes('NTC Licence Vetting'), 'Highlights NTC teacher credential verification');
  });

  // Test 9: H12 - B2B Suppliers & Public Tenders Gateway
  test('H12: Suppliers & RFQs card protects sealed bids and provides vendor actions', () => {
    assert.ok(homeViewCode.includes('id="btn-goto-suppliers"'), 'Must have button id="btn-goto-suppliers"');
    assert.ok(homeViewCode.includes('id="btn-goto-for-suppliers"'), 'Must have button id="btn-goto-for-suppliers"');
    assert.ok(homeViewCode.includes('id="btn-home-post-rfq"'), 'Must have button id="btn-home-post-rfq"');
    assert.ok(homeViewCode.includes('Sealed Bids Protected'), 'Highlights sealed quotation confidentiality');
    assert.ok(homeViewCode.includes('50/50 MoMo Escrow'), 'Highlights Mobile Money payment escrow');
  });

  // Test 10: H13 & H14 - Institutional Onboarding & Commercial Plans Gateway
  test('H13 & H14: School owners card features claim/listing, campus portal demo, and approved plans', () => {
    assert.ok(homeViewCode.includes('id="btn-goto-for-schools"'), 'Must have button id="btn-goto-for-schools"');
    assert.ok(homeViewCode.includes('id="btn-home-register-school"'), 'Must have button id="btn-home-register-school"');
    assert.ok(homeViewCode.includes('id="btn-home-school-portal"'), 'Must have button id="btn-home-school-portal"');
    assert.ok(homeViewCode.includes('id="btn-home-view-school-pricing"'), 'Must have button id="btn-home-view-school-pricing"');
    assert.ok(homeViewCode.includes('Free Starter (GH₵0)'), 'Displays approved Free tier');
    assert.ok(homeViewCode.includes('Growth (GH₵99/mo)'), 'Displays approved Growth tier GH₵99/mo');
  });

  // Test 11: H15 - Academic Resource Centre & CSSPS Aggregate Calculator
  test('H15: Resource centre features BECE/WASSCE past papers and GES CSSPS calculator banner', () => {
    assert.ok(homeViewCode.includes('id="btn-goto-resources"'), 'Must have button id="btn-goto-resources"');
    assert.ok(homeViewCode.includes('id="btn-home-upload-paper"'), 'Must have button id="btn-home-upload-paper"');
    assert.ok(homeViewCode.includes('id="btn-home-cssps-calc"'), 'Must have button id="btn-home-cssps-calc"');
    assert.ok(homeViewCode.includes('BECE, WASSCE & Cambridge Past Papers'), 'Highlights authentic past papers');
  });

  // Test 12: H16 - How We Verify School Information (4 Trust Pillars)
  test('H16: Trust & Verification section articulates 4 pillars and guided tour trigger', () => {
    assert.ok(homeViewCode.includes('How We Verify School Information'), 'Section headline present');
    assert.ok(homeViewCode.includes('NaSIA Licence Status'), 'Pillar 1: NaSIA regulatory status verification');
    assert.ok(homeViewCode.includes('School Ownership Vetted'), 'Pillar 2: Proprietor identity verification');
    assert.ok(homeViewCode.includes('Profile Information Reviewed'), 'Pillar 3: Fee schedules and curricula evidence review');
    assert.ok(homeViewCode.includes('Factual Integrity Guarantee'), 'Pillar 4: Zero fabricated scores');
    assert.ok(homeViewCode.includes('id="btn-home-full-tour"'), 'Must have button id="btn-home-full-tour"');
  });

  // Test 13: Complete Button & Listener Reconciliation (Zero Missing IDs)
  test('Event Listener Reconciliation: All document.getElementById calls match existing HTML IDs', () => {
    const htmlIds = [...homeViewCode.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
    const eventIds = [...homeViewCode.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
    
    // Check if any listener references an ID not in HTML
    const missingInHtml = eventIds.filter(id => !htmlIds.includes(id));
    assert.strictEqual(missingInHtml.length, 0, `Missing HTML IDs targeted by listeners: ${missingInHtml.join(', ')}`);
  });

  // Test 14: WCAG 2.1 Contrast for Hero Search Submit Button
  test('WCAG 2.1 Contrast: .search-btn-hero in style.css enforces dark navy text (#0A2046) on gold background', () => {
    assert.ok(styleCss.includes('.search-btn-hero'), 'style.css defines .search-btn-hero');
    const heroBtnMatch = styleCss.match(/\.search-btn-hero\s*\{([^}]+)\}/);
    assert.ok(heroBtnMatch, 'Must find .search-btn-hero block');
    assert.ok(heroBtnMatch[1].includes('#0A2046'), 'search-btn-hero must specify navy #0A2046 for high contrast');
    assert.ok(heroBtnMatch[1].includes('!important'), 'search-btn-hero must use !important to prevent overrides');
  });

  // Test 15: Responsive Card Hover & Touch Targets in components.css
  test('Responsive Polish: components.css defines hover elevation & min 48px touch targets for browse cards', () => {
    assert.ok(componentsCss.includes('.level-browse-card'), 'components.css defines .level-browse-card');
    assert.ok(componentsCss.includes('.level-browse-card:hover'), 'components.css defines .level-browse-card:hover');
    assert.ok(componentsCss.includes('.suburb-browse-card'), 'components.css defines .suburb-browse-card');
    assert.ok(componentsCss.includes('.suburb-browse-card:hover'), 'components.css defines .suburb-browse-card:hover');
    assert.ok(componentsCss.includes('min-height: 48px'), 'browse cards enforce min 48px touch targets');
  });

  // Test 16: Pricing Alignment across Personas & Pricing Modules
  test('Pricing Alignment: Harmonizes educator plans between homeView.js and forTeachersView.js', () => {
    assert.ok(homeViewCode.includes('Plus (GH₵39/mo) and Business (GH₵99/mo)'), 'homeView.js quotes approved Plus & Business plans');
    assert.ok(forTeachersCode.includes('GH₵ 39'), 'forTeachersView.js presents approved Plus tier GH₵ 39/mo');
    assert.ok(forTeachersCode.includes('GH₵ 99'), 'forTeachersView.js presents approved Business tier GH₵ 99/mo');
  });

  // Test 17: Cache Buster Unified Alignment in index.html
  test('Cache Buster Integrity: public/index.html loads style.css, components.css, and scripts with ?v=78+', () => {
    assert.ok(/\/css\/style\.css\?v=(7[8-9]|[8-9][0-9])/.test(indexHtml), 'style.css must have ?v=78+');
    assert.ok(/\/css\/components\.css\?v=(7[8-9]|[8-9][0-9])/.test(indexHtml), 'components.css must have ?v=78+');
    assert.ok(/\/js\/views\/homeView\.js\?v=(7[8-9]|[8-9][0-9])/.test(indexHtml), 'homeView.js must have ?v=78+');
    assert.ok(/\/js\/app\.js\?v=(7[8-9]|[8-9][0-9])/.test(indexHtml), 'app.js must have ?v=78+');
  });

  // Test 18: VM Execution of HomeView.render()
  await testAsync('Execution Integrity: HomeView.render() produces valid HTML with dynamic pilot stats', async () => {
    const sandbox = {
      module: {},
      window: {},
      API: {
        getStats: async () => ({ schoolsCount: 22, teachersCount: 14, suppliersCount: 9, verifiedEntities: 16 }),
        getSchools: async () => [
          {
            id: 'sch-gis-accra',
            name: 'Ghana International School',
            curriculum: ['Cambridge (CIE)'],
            suburb: 'Cantonments',
            region: 'Greater Accra',
            tuition_min: 15000,
            tuition_max: 28000,
            feeBand: 'Premium (GH₵ 10k - 25k)',
            verified: true,
            is_featured: true,
            whatsapp: '0241112233'
          }
        ],
        getActivePromotions: async () => ({ success: true, promotions: [] }),
        trackPromotionImpression: async () => {}
      },
      State: {
        isInCompare: () => false,
        isBookmarked: () => false
      },
      console: console
    };

    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(homeViewPath, 'utf8'), sandbox);
    const HomeView = sandbox.module.exports || sandbox.window.HomeView || sandbox.HomeView;
    assert.ok(HomeView, 'HomeView object defined in context');
    assert.strictEqual(typeof HomeView.render, 'function', 'HomeView.render is a function');
    assert.strictEqual(typeof HomeView.attachEvents, 'function', 'HomeView.attachEvents is a function');

    const html = await HomeView.render();
    assert.ok(html.includes('Ghana International School'), 'Renders featured school name');
    assert.ok(html.includes('22+'), 'Renders dynamic schools count');
    assert.ok(html.includes('14+'), 'Renders dynamic teachers count');
    assert.ok(html.includes('btn-home-full-tour'), 'Renders guided tour button');
    assert.ok(html.includes('btn-home-post-job'), 'Renders post job button');
    assert.ok(html.includes('btn-home-school-portal'), 'Renders school portal button');
  });

  console.log('\n========================================================================');
  console.log(`🎉 HOMEPAGE AUDIT COMPLETE: ${passed} / ${total} TESTS PASSED!`);
  console.log('========================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runHomeAuditTests().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
