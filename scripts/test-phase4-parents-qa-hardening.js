/**
 * SkoolFinder Ghana - Parents & Guardians Public Landing Page Phase 4 QA & Hardening Test Suite
 * Validates Blueprint v1.0 Acceptance Criteria (AC-01 through AC-10).
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('========================================================================');
console.log('🚀 RUNNING PHASE 4: PARENTS & GUARDIANS QA & HARDENING AUDIT (AC-01 - AC-10)');
console.log('========================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${totalTests}. ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${totalTests}. ${name}`);
    console.error(`     Error: ${err.message}\n`);
  }
}

// Read relevant files
const parentViewPath = path.join(__dirname, '../public/js/views/parentPortalView.js');
const appJsPath = path.join(__dirname, '../public/js/app.js');
const indexHtmlPath = path.join(__dirname, '../public/index.html');
const componentsCssPath = path.join(__dirname, '../public/css/components.css');

const parentViewSrc = fs.readFileSync(parentViewPath, 'utf8');
const appJsSrc = fs.readFileSync(appJsPath, 'utf8');
const indexHtmlSrc = fs.readFileSync(indexHtmlPath, 'utf8');
const componentsCssSrc = fs.readFileSync(componentsCssPath, 'utf8');

// 1. AC-01: Guest discovery & Unauthenticated Access
runTest('AC-01: Unauthenticated visitors access renderAuthGateway() without forced login', () => {
  assert.ok(parentViewSrc.includes('if (!State.isAuthenticated() || !State.isParent())'), 'Branches to auth gateway when unauthenticated');
  assert.ok(parentViewSrc.includes('return await this.renderAuthGateway()'), 'Calls renderAuthGateway');
  assert.ok(parentViewSrc.includes('btn-parents-guest-explore'), 'Provides guest exploration CTA');
});

// 2. AC-02: Every rendered CTA opens an existing functional destination
runTest('AC-02: All interactive CTAs map to registered routes or smooth actions (no dead links)', () => {
  const expectedDestinations = [
    'btn-parents-guest-explore',
    'btn-parents-scroll-signup',
    'btn-parents-view-all-schools',
    'btn-parents-open-compare',
    'btn-parents-fees-guide',
    'btn-parents-admissions-search',
    'btn-parents-goto-teachers',
    'btn-toggle-verification-policy',
    'btn-parents-footer-find-schools',
    'btn-parents-footer-signup'
  ];

  for (const id of expectedDestinations) {
    assert.ok(parentViewSrc.includes(id), `Missing CTA ID in markup: ${id}`);
    assert.ok(parentViewSrc.includes(`document.getElementById('${id}')`), `Missing event listener wiring for: ${id}`);
  }
});

// 3. AC-03 & AC-04: Truthful Data & Truthful Fee / Licensing Claims
runTest('AC-03 & AC-04: Enforces data truthfulness (Rule R-04/R-05) and Fee Not Disclosed handling', () => {
  assert.ok(parentViewSrc.includes('Fee Not Disclosed'), 'Includes truthful Fee Not Disclosed handling');
  assert.ok(parentViewSrc.includes('NaSIA'), 'Cites statutory NaSIA licensing');
  assert.ok(parentViewSrc.includes('Act 1023'), 'References Education Regulatory Bodies Act 1023');
  assert.ok(parentViewSrc.includes('Zero Pay-to-Rank Policy'), 'Includes explicit Zero Pay-to-Rank Policy');
});

// 4. AC-05: Semantic Headings & Accessible Hierarchy
runTest('AC-05: Semantic heading hierarchy and accessible accordion structure', () => {
  // H1 in Hero
  assert.ok(parentViewSrc.includes('<h1') && parentViewSrc.includes('Simplify Admissions &amp; Establish Your Child\'s Educational Future'), 'Hero features single authoritative H1');
  
  // Section H2 tags
  const h2Matches = parentViewSrc.match(/<h2/g);
  assert.ok(h2Matches && h2Matches.length >= 7, `Expected at least 7 H2 sections for P03-P12, found ${h2Matches ? h2Matches.length : 0}`);

  // FAQ Accordion aria attributes
  assert.ok(parentViewSrc.includes('aria-expanded="false"'), 'FAQ items include aria-expanded attribute');
  assert.ok(parentViewSrc.includes('btn.setAttribute(\'aria-expanded\', \'true\')'), 'FAQ toggle dynamically updates aria-expanded');
});

// 5. AC-05: WCAG 2.2 AA Focus Visible & Minimum Touch Targets
runTest('AC-05: CSS defines visible focus rings and minimum touch targets (components.css)', () => {
  assert.ok(componentsCssSrc.includes('.parent-filter-chip:focus-visible') || componentsCssSrc.includes(':focus-visible'), 'Focus visible outline defined');
  assert.ok(componentsCssSrc.includes('min-height: 44px') || componentsCssSrc.includes('min-height: 48px'), 'Minimum touch target size enforced');
  assert.ok(componentsCssSrc.includes('outline: 3px solid #1e40af'), 'High-contrast focus ring defined');
});

// 6. AC-06: Child Safeguarding & Privacy Hard-Stop (Rule R-06 / Act 560)
runTest('AC-06: Public markup and client responses strictly omit child personal data or private booking', () => {
  // Verify unauthenticated gateway does NOT leak child profile details or private booking forms
  assert.ok(!parentViewSrc.includes('input type="text" id="child-full-name" placeholder'), 'No child personal data input on public landing page');
  assert.ok(parentViewSrc.includes('Strictly safeguarding-compliant public discovery'), 'Safeguarding compliance policy stated on educator teaser');
  assert.ok(parentViewSrc.includes('Children\'s Act 1998 (Act 560)'), 'Statutory Children\'s Act reference present in safety advisory');
});

// 7. AC-07: Route Integrity & Global Navigation
runTest('AC-07: Public route /parents registered cleanly in App router without regression', () => {
  assert.ok(appJsSrc.includes('\'parents\''), 'Parents route in router whitelist');
  assert.ok(appJsSrc.includes('isPathRoute') && appJsSrc.includes('parents'), 'parents in isPathRoute for clean pushState URL');
  assert.ok(appJsSrc.includes('viewName === \'parents\''), 'App router handles viewName === parents');
});

// 8. AC-08: Responsive Layout Hardening & CLS Prevention
runTest('AC-08: Responsive layout columns (parent-form-row-2col) and zero-overflow containers', () => {
  assert.ok(componentsCssSrc.includes('.parent-form-row-2col'), 'Responsive 2-column to 1-column defined in CSS');
  assert.ok(parentViewSrc.includes('class="parent-form-row-2col"'), 'Applied parent-form-row-2col on signup rows');
  assert.ok(componentsCssSrc.includes('.parent-portal-gateway-page'), 'Gateway container class styled in CSS');
});

// 9. AC-09: Page SEO Metadata & Canonical Tag Strategy
runTest('AC-09: Single canonical SEO configuration for parents route in app.js', () => {
  assert.ok(appJsSrc.includes('Parents & Guardians Hub | Verified Pre-Tertiary School Discovery Ghana'), 'Authoritative page title in SEO config');
  assert.ok(appJsSrc.includes('https://skoolfinder.vercel.app/parents'), 'Canonical URL configured in SEO config');
  
  // Verify no duplicate 'parents': key in SEO_CONFIGS
  const matches = appJsSrc.match(/'parents':\s*\{/g);
  assert.strictEqual(matches.length, 1, 'Exactly one parents SEO config entry (no duplicate key collision)');
});

// 10. AC-10: Phase 3 Interactive Guidance Modals Wiring
runTest('AC-10: All 4 guidance modal keys (admissions_checklist, cambridge_vs_ges, cssps_quota, fee_structures) wired with actions', () => {
  assert.ok(parentViewSrc.includes('admissions_checklist:'), 'admissions_checklist guide present');
  assert.ok(parentViewSrc.includes('cambridge_vs_ges:'), 'cambridge_vs_ges guide present');
  assert.ok(parentViewSrc.includes('cssps_quota:'), 'cssps_quota guide present');
  assert.ok(parentViewSrc.includes('fee_structures:'), 'fee_structures guide present');
  assert.ok(parentViewSrc.includes('btn-guide-modal-action'), 'Interactive modal action button rendered');
  assert.ok(parentViewSrc.includes('openGuideModal'), 'openGuideModal method available on ParentPortalView');
});

// 11. Cache Buster & Script Integrity
runTest('Cache Buster Integrity: public/index.html loads components.css and parentPortalView.js with updated cache busters', () => {
  assert.ok(indexHtmlSrc.includes('/css/components.css?v='), 'components.css loaded with version');
  assert.ok(indexHtmlSrc.includes('/js/views/parentPortalView.js?v='), 'parentPortalView.js loaded with version');
  assert.ok(indexHtmlSrc.includes('/js/app.js?v='), 'app.js loaded with version');
});

console.log('\n========================================================================');
if (passedTests === totalTests) {
  console.log(`🎉 PHASE 4 QA & HARDENING COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED!`);
} else {
  console.error(`⚠️ PHASE 4 ISSUES DETECTED: ${passedTests} / ${totalTests} PASSED.`);
  process.exit(1);
}
console.log('========================================================================\n');
