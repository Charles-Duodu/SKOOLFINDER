/**
 * Automated Verification: Blueprint v4.2 Phase 7
 * Hardening, Accessibility (WCAG 2.2 AA) & Design System Verification
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

async function runPhase7Tests() {
  console.log('🚀 Starting Blueprint v4.2 Phase 7 Hardening & Accessibility Verification Suite...\n');
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      throw err;
    }
  }

  // 1. Mobile Navigation Dock & Touch Target Sizing (WCAG 2.2 AA >= 48px)
  test('MobileNav renders accessible 5-tab dock with proper ARIA attributes', () => {
    const mobileNavContent = fs.readFileSync(path.resolve('public/js/components/mobileNav.js'), 'utf8');
    assert.ok(mobileNavContent.includes('role="navigation"'), 'Mobile dock must have role="navigation"');
    assert.ok(mobileNavContent.includes('aria-label="Mobile Navigation Dock"'), 'Must have aria-label for mobile dock');
    assert.ok(mobileNavContent.includes('aria-label="Home"'), 'Home button must have aria-label');
    assert.ok(mobileNavContent.includes('aria-label="Discover Schools"'), 'Discover button must have aria-label');
    assert.ok(mobileNavContent.includes('aria-label="Explore Hubs"'), 'Explore button must have aria-label');
    assert.ok(mobileNavContent.includes('aria-label="Compare Schools"'), 'Compare button must have aria-label');
    assert.ok(mobileNavContent.includes('aria-label="My Space Parent Portal"'), 'My Space button must have aria-label');
  });

  test('Mobile dock CSS enforces minimum 48px touch targets and visible focus outlines', () => {
    const cssContent = fs.readFileSync(path.resolve('public/css/components.css'), 'utf8');
    assert.ok(cssContent.includes('.mobile-dock-btn'), 'Must define .mobile-dock-btn');
    assert.ok(cssContent.includes('min-height: 48px'), 'Mobile dock button must enforce min-height: 48px for WCAG 2.2 touch target compliance');
    assert.ok(cssContent.includes('.mobile-dock-btn:focus-visible'), 'Must define :focus-visible for keyboard accessibility');
  });

  // 2. Modal Accessibility & Touch Target Sizing (WCAG 2.2 AA >= 44px)
  test('Modal close button enforces accessible touch target and focus indicator', () => {
    const cssContent = fs.readFileSync(path.resolve('public/css/components.css'), 'utf8');
    assert.ok(cssContent.includes('.modal-close-btn'), 'Must define .modal-close-btn');
    assert.ok(cssContent.includes('min-width: 44px') || cssContent.includes('min-width: 48px'), 'Close button must enforce >= 44px touch target');
    assert.ok(cssContent.includes('min-height: 44px') || cssContent.includes('min-height: 48px'), 'Close button must enforce >= 44px touch target');
    assert.ok(cssContent.includes('.modal-close-btn:focus-visible'), 'Close button must have focus-visible styling');
  });

  // 3. Parent Portal ARIA Tablist & Tab Semantics
  test('ParentPortalView navigation implements role="tablist" and role="tab"', () => {
    const viewContent = fs.readFileSync(path.resolve('public/js/views/parentPortalView.js'), 'utf8');
    assert.ok(viewContent.includes('role="tablist"'), 'Tab container must define role="tablist"');
    assert.ok(viewContent.includes('role="tab"'), 'Tab buttons must define role="tab"');
    assert.ok(viewContent.includes('aria-selected='), 'Tab buttons must define aria-selected');
  });

  // 4. Design System Tokens (Theme B)
  test('Theme B color tokens and typography are correctly declared and linked', () => {
    const styleContent = fs.readFileSync(path.resolve('public/css/style.css'), 'utf8');
    assert.ok(styleContent.includes('--theme-b-navy: #0A2046') || styleContent.includes('#0A2046'), 'Must declare Navy token #0A2046');
    assert.ok(styleContent.includes('--theme-b-blue: #1266C4') || styleContent.includes('#1266C4'), 'Must declare Blue token #1266C4');
    assert.ok(styleContent.includes('--theme-b-gold: #D5A63B') || styleContent.includes('#D5A63B'), 'Must declare Gold token #D5A63B');
    assert.ok(styleContent.includes('#F7F9FC') || styleContent.includes('--theme-b-canvas'), 'Must declare Light Canvas token #F7F9FC');

    const indexHtml = fs.readFileSync(path.resolve('public/index.html'), 'utf8');
    assert.ok(indexHtml.includes('Inter') && indexHtml.includes('Plus+Jakarta+Sans'), 'Must load Inter and Plus Jakarta Sans fonts');
  });

  // 5. Trust Safeguards & Non-Fabrication
  test('Zero fabricated data in State, compareView, and parents routes', () => {
    const stateContent = fs.readFileSync(path.resolve('public/js/state.js'), 'utf8');
    assert.ok(stateContent.includes('compare up to 4 schools') || stateContent.includes('max 4'), 'Comparison must be capped at 4 schools');

    const compareContent = fs.readFileSync(path.resolve('public/js/views/compareView.js'), 'utf8');
    assert.ok(!compareContent.includes('GHS 1,200'), 'Must not contain fabricated 1,200 fee fallback');
    assert.ok(!compareContent.includes('GHS 1,000'), 'Must not contain fabricated 1,000 fee fallback');
    assert.ok(compareContent.includes('Official fee schedule not published') || compareContent.includes('Contact school desk'), 'Must state official fee transparency notice');

    const parentsRoute = fs.readFileSync(path.resolve('src/routes/parents.js'), 'utf8');
    assert.ok(!parentsRoute.includes('Kojo Duodu'), 'Must not contain mock student fallback Kojo Duodu');
  });

  console.log(`\n========================================`);
  console.log(`🎉 Phase 7 Verification Complete: ${passed}/${total} checks passed!`);
  console.log(`========================================\n`);
}

runPhase7Tests().catch((err) => {
  console.error('\n❌ Phase 7 verification suite failed:', err);
  process.exit(1);
});
