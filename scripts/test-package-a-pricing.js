/**
 * Automated Verification Suite: Package A — Public Pricing & Plans Comparison
 * Baseline: Master Guide v1.0 Sections 9, 10, 11 & Combined Roadmap v1.1
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

async function runPricingTests() {
  console.log('========================================================================');
  console.log('🚀 RUNNING PACKAGE A: DEDICATED PRICING & PLANS COMPARISON VERIFICATION');
  console.log('========================================================================\n');

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

  // 1. Script inclusion in index.html
  test('index.html registers pricingView.js and app.js with updated cache-buster', () => {
    const html = fs.readFileSync(path.resolve('public/index.html'), 'utf8');
    assert.ok(html.includes('src="/js/views/pricingView.js?v=69"'), 'pricingView.js missing or bad version in index.html');
    assert.ok(html.includes('src="/js/app.js?v=69"'), 'app.js must be version 69 in index.html');
  });

  // 2. Router registration in app.js
  test('app.js registers pricing route, SEO config, and path handlers', () => {
    const appJs = fs.readFileSync(path.resolve('public/js/app.js'), 'utf8');
    assert.ok(appJs.includes("'pricing': 'pricing'"), 'routeMap must map pricing');
    assert.ok(appJs.includes("'plans': 'pricing'"), 'routeMap must map plans alias');
    assert.ok(appJs.includes("PricingView.render"), 'app.js must invoke PricingView.render');
    assert.ok(appJs.includes("SEO_CONFIGS['pricing']") || appJs.includes("'pricing': {"), 'SEO config must define pricing metadata');
  });

  // 3. Navigation link discovery
  test('navbar.js and footer.js expose discoverable pricing navigation links', () => {
    const navJs = fs.readFileSync(path.resolve('public/js/components/navbar.js'), 'utf8');
    assert.ok(navJs.includes('nav-link-pricing'), 'Desktop navbar must include nav-link-pricing');
    assert.ok(navJs.includes('mob-link-pricing'), 'Mobile drawer must include mob-link-pricing');

    const footJs = fs.readFileSync(path.resolve('public/js/components/footer.js'), 'utf8');
    assert.ok(footJs.includes("App.navigate('pricing'"), 'Footer pricing link must navigate to pricing view');
  });

  // 4. Approved School Subscriptions (Master Guide §9)
  test('pricingView.js enforces exact approved School tiers and 16.67% annual discount', () => {
    const viewJs = fs.readFileSync(path.resolve('public/js/views/pricingView.js'), 'utf8');
    assert.ok(viewJs.includes('Free Basic'), 'Must include Free Basic tier');
    assert.ok(viewJs.includes('GH₵ 0'), 'Free tier must be GH₵ 0');
    assert.ok(viewJs.includes('GH₵ 99') || viewJs.includes("isAnnual ? '990' : '99'"), 'Growth tier must be GH₵ 99/mo or GH₵ 990/yr');
    assert.ok(viewJs.includes('GH₵ 249') || viewJs.includes("isAnnual ? '2,490' : '249'"), 'Pro tier must be GH₵ 249/mo or GH₵ 2,490/yr');
    assert.ok(viewJs.includes('GH₵ 499') || viewJs.includes("isAnnual ? '4,990' : '499'"), 'Enterprise tier must be GH₵ 499/mo or GH₵ 4,990/yr');
    assert.ok(viewJs.includes('Save 16.67%'), 'Must calculate exact 16.67% annual discount');
  });

  // 5. Approved School Add-Ons (Master Guide §9)
  test('pricingView.js enforces approved add-ons (vacancies GH₵25, tenders GH₵45/GH₵120, seats GH₵10)', () => {
    const viewJs = fs.readFileSync(path.resolve('public/js/views/pricingView.js'), 'utf8');
    assert.ok(viewJs.includes('GH₵ 25'), 'Vacancy add-on must be GH₵ 25');
    assert.ok(viewJs.includes('GH₵ 45'), 'Single tender must be GH₵ 45');
    assert.ok(viewJs.includes('GH₵ 120'), '3-tender bundle must be GH₵ 120');
    assert.ok(viewJs.includes('GH₵ 10 / mo') || viewJs.includes('GH₵ 10'), 'Staff seat add-on must be GH₵ 10');
  });

  // 6. Approved Educator / Professional Plans (Master Guide §10)
  test('pricingView.js enforces exact approved Professional tiers (Free GH₵0, Plus GH₵39, Business GH₵99)', () => {
    const viewJs = fs.readFileSync(path.resolve('public/js/views/pricingView.js'), 'utf8');
    assert.ok(viewJs.includes("isAnnual ? '390' : '39'"), 'Plus tier must be GH₵ 39/mo or GH₵ 390/yr');
    assert.ok(viewJs.includes("isAnnual ? '990' : '99'"), 'Business tier must be GH₵ 99/mo or GH₵ 990/yr');
    assert.ok(viewJs.includes('School Job Applications') && viewJs.includes('Free'), 'Job applications must be free forever for candidates');
  });

  // 7. Supplier & Parent Boundaries (Master Guide §11)
  test('pricingView.js marks Supplier tiers pending and preserves 100% Free Parent Charter', () => {
    const viewJs = fs.readFileSync(path.resolve('public/js/views/pricingView.js'), 'utf8');
    assert.ok(viewJs.includes('Commercial Terms Pending'), 'Supplier commercial terms must be clearly marked pending');
    assert.ok(viewJs.includes('100% Free Family Discovery'), 'Parent charter must confirm 100% free discovery');
    assert.ok(viewJs.includes('4-School Comparison Matrix'), 'Parent charter must feature 4-school comparison');
    assert.ok(viewJs.includes('2-Minute Fit Matchmaker'), 'Parent charter must feature explainable fit matchmaker');
  });

  // 8. Accessibility & Semantics
  test('pricingView.js defines accessible ARIA tablist/tab semantics', () => {
    const viewJs = fs.readFileSync(path.resolve('public/js/views/pricingView.js'), 'utf8');
    assert.ok(viewJs.includes('role="tablist"'), 'Category container must define role="tablist"');
    assert.ok(viewJs.includes('role="tab"'), 'Persona buttons must define role="tab"');
    assert.ok(viewJs.includes('aria-selected='), 'Persona buttons must define aria-selected');
  });

  console.log('\n========================================================================');
  console.log(`🎉 PACKAGE A VERIFICATION COMPLETE: ${passed}/${total} CHECKS PASSED!`);
  console.log('========================================================================\n');
}

runPricingTests().catch(err => {
  console.error('\n❌ Pricing verification failed:', err);
  process.exit(1);
});
