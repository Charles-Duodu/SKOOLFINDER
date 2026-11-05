/**
 * Automated Verification Suite for Dedicated Public Persona Landing Pages:
 * - #/for-schools: Public pitch for proprietors, NaSIA vetting, profile claiming, voucher engine
 * - #/for-teachers: Public landing, NTC verification, free applications, direct parent tutoring
 * - #/for-suppliers: Public landing, sealed quotes, Ghanaian LPOs, milestone MoMo escrow
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✕ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
  }
}

async function runTests() {
  console.log('\n============================================================');
  console.log('🧪 VERIFYING DEDICATED PUBLIC PERSONA LANDING PAGES');
  console.log('============================================================\n');

  // 1. Verify ForSchoolsView file and render output
  console.log('--- Test Group 1: ForSchoolsView ---');
  const forSchoolsPath = path.join(__dirname, '../public/js/views/forSchoolsView.js');
  assert(fs.existsSync(forSchoolsPath), 'forSchoolsView.js file exists');

  const forSchoolsCode = fs.readFileSync(forSchoolsPath, 'utf8');
  assert(forSchoolsCode.includes('ForSchoolsView = {'), 'Defines ForSchoolsView object');
  assert(forSchoolsCode.includes('btn-hero-claim-school'), 'Contains hero claim CTA button');
  assert(forSchoolsCode.includes('btn-hero-register-school'), 'Contains hero register CTA button');
  assert(forSchoolsCode.includes('input-search-claim-target'), 'Contains Fast-Finder search and claim directory input');
  assert(forSchoolsCode.includes('NaSIA Licensing & Verification'), 'Contains NaSIA Regulatory Vetting Pillar');
  assert(forSchoolsCode.includes('WhatsApp Admissions Desk'), 'Contains WhatsApp Admissions Desk Pillar');
  assert(forSchoolsCode.includes('Digital Admissions Voucher Engine'), 'Contains Digital Admissions Voucher Engine (95% MoMo settlement)');
  assert(forSchoolsCode.includes('Campus Walkthrough & Tour Queuing'), 'Contains Self-Service Campus Walkthrough Pillar');
  assert(forSchoolsCode.includes('Free Starter'), 'Contains Free Starter tier');
  assert(forSchoolsCode.includes('GH₵ 99'), 'Contains Growth tier GH₵ 99/mo');
  assert(forSchoolsCode.includes('GH₵ 250') || forSchoolsCode.includes('GH₵ 249'), 'Contains Pro / Featured tier pricing');

  // Test VM execution of ForSchoolsView
  const schoolsContext = {
    window: {},
    document: {
      getElementById: () => null,
      querySelectorAll: () => []
    },
    module: { exports: {} }
  };
  vm.createContext(schoolsContext);
  vm.runInContext(forSchoolsCode, schoolsContext);
  const ForSchoolsView = schoolsContext.module.exports.render ? schoolsContext.module.exports : schoolsContext.window.ForSchoolsView;
  assert(typeof ForSchoolsView.render === 'function', 'ForSchoolsView has render() method');
  assert(typeof ForSchoolsView.afterRender === 'function', 'ForSchoolsView has afterRender() method');
  const schoolsHtml = await ForSchoolsView.render();
  assert(schoolsHtml.includes('Accelerate Admissions & Establish Unrivaled Institutional Prestige'), 'Renders accurate hero headline');

  // 2. Verify ForTeachersView file and render output
  console.log('\n--- Test Group 2: ForTeachersView ---');
  const forTeachersPath = path.join(__dirname, '../public/js/views/forTeachersView.js');
  assert(fs.existsSync(forTeachersPath), 'forTeachersView.js file exists');

  const forTeachersCode = fs.readFileSync(forTeachersPath, 'utf8');
  assert(forTeachersCode.includes('ForTeachersView = {'), 'Defines ForTeachersView object');
  assert(forTeachersCode.includes('btn-hero-teacher-register'), 'Contains hero register CTA button');
  assert(forTeachersCode.includes('btn-hero-browse-vacancies'), 'Contains hero browse vacancies CTA button');
  assert(forTeachersCode.includes('100% Free Job Applications'), 'Contains 100% Free Applications Pillar (no agency fee)');
  assert(forTeachersCode.includes('NTC Licensure Verification Badge'), 'Contains NTC Licensure Verification Pillar');
  assert(forTeachersCode.includes('Direct Parent Tutoring Inquiries'), 'Contains Direct Parent Tutoring Desk Pillar');
  assert(forTeachersCode.includes('Pro Educator Suite'), 'Contains Pro Educator Suite Pillar');
  assert(forTeachersCode.includes('Cambridge & IGCSE Mathematics'), 'Contains Cambridge & IGCSE Math specialization');
  assert(forTeachersCode.includes('STEM & Coding Instructors'), 'Contains STEM & Robotics specialization');
  assert(forTeachersCode.includes('Montessori & Early Years'), 'Contains Montessori & Early Years specialization');
  assert(forTeachersCode.includes('GH₵ 35'), 'Contains Pro Educator pricing (GH₵ 35/mo)');

  // Test VM execution of ForTeachersView
  const teachersContext = {
    window: {},
    document: {
      getElementById: () => null,
      querySelectorAll: () => []
    },
    module: { exports: {} }
  };
  vm.createContext(teachersContext);
  vm.runInContext(forTeachersCode, teachersContext);
  const ForTeachersView = teachersContext.module.exports.render ? teachersContext.module.exports : teachersContext.window.ForTeachersView;
  assert(typeof ForTeachersView.render === 'function', 'ForTeachersView has render() method');
  assert(typeof ForTeachersView.afterRender === 'function', 'ForTeachersView has afterRender() method');
  const teachersHtml = await ForTeachersView.render();
  assert(teachersHtml.includes('Elevate Your Teaching Career with Verified NTC Licensure'), 'Renders accurate hero headline');

  // 3. Verify ForSuppliersView file and render output
  console.log('\n--- Test Group 3: ForSuppliersView ---');
  const forSuppliersPath = path.join(__dirname, '../public/js/views/forSuppliersView.js');
  assert(fs.existsSync(forSuppliersPath), 'forSuppliersView.js file exists');

  const forSuppliersCode = fs.readFileSync(forSuppliersPath, 'utf8');
  assert(forSuppliersCode.includes('ForSuppliersView = {'), 'Defines ForSuppliersView object');
  assert(forSuppliersCode.includes('btn-hero-supplier-register'), 'Contains hero supplier register CTA button');
  assert(forSuppliersCode.includes('btn-hero-browse-tenders'), 'Contains hero browse tenders CTA button');
  assert(forSuppliersCode.includes('Direct School RFQs & Tenders'), 'Contains Direct School RFQs Pillar');
  assert(forSuppliersCode.includes('Sealed Bid Quote Protection'), 'Contains Sealed Quote Confidentiality Pillar');
  assert(forSuppliersCode.includes('LPO-GH-2026-XXXX'), 'Contains Ghanaian LPO generation format');
  assert(forSuppliersCode.includes('Milestone MoMo & Bank Escrow'), 'Contains Milestone MoMo Escrow Pillar (30/70 split)');
  assert(forSuppliersCode.includes('Uniforms & Sportswear'), 'Contains Uniforms category');
  assert(forSuppliersCode.includes('Textbooks & Learning Aids'), 'Contains Textbooks category');
  assert(forSuppliersCode.includes('Science Labs & STEM Gear'), 'Contains Science labs category');
  assert(forSuppliersCode.includes('IT Hardware & Connectivity'), 'Contains IT hardware category');
  assert(forSuppliersCode.includes('Canteen Commodities & Food'), 'Contains Canteen food category');
  assert(forSuppliersCode.includes('Campus Furniture & Facilities'), 'Contains Furniture category');
  assert(forSuppliersCode.includes('GH₵ 95'), 'Contains Verified Gold Supplier pricing (GH₵ 95/mo)');

  // Test VM execution of ForSuppliersView
  const suppliersContext = {
    window: {},
    document: {
      getElementById: () => null,
      querySelectorAll: () => []
    },
    module: { exports: {} }
  };
  vm.createContext(suppliersContext);
  vm.runInContext(forSuppliersCode, suppliersContext);
  const ForSuppliersView = suppliersContext.module.exports.render ? suppliersContext.module.exports : suppliersContext.window.ForSuppliersView;
  assert(typeof ForSuppliersView.render === 'function', 'ForSuppliersView has render() method');
  assert(typeof ForSuppliersView.afterRender === 'function', 'ForSuppliersView has afterRender() method');
  const suppliersHtml = await ForSuppliersView.render();
  assert(suppliersHtml.includes('Supply Accredited Schools Across Ghana with Guaranteed MoMo Escrow'), 'Renders accurate hero headline');

  // 4. Verify Router and SEO Registration in app.js
  console.log('\n--- Test Group 4: Router & SEO Registration in app.js ---');
  const appCode = fs.readFileSync(path.join(__dirname, '../public/js/app.js'), 'utf8');
  assert(appCode.includes("'for-schools', 'for-teachers', 'for-suppliers'"), 'isPathRoute includes all 3 persona views');
  assert(appCode.includes("'for-schools': {"), 'SEO_CONFIGS has metadata for for-schools');
  assert(appCode.includes("'for-teachers': {"), 'SEO_CONFIGS has metadata for for-teachers');
  assert(appCode.includes("'for-suppliers': {"), 'SEO_CONFIGS has metadata for for-suppliers');
  assert(appCode.includes("viewName === 'for-schools'"), 'render() dispatches to ForSchoolsView');
  assert(appCode.includes("viewName === 'for-teachers'"), 'render() dispatches to ForTeachersView');
  assert(appCode.includes("viewName === 'for-suppliers'"), 'render() dispatches to ForSuppliersView');
  assert(appCode.includes("'for-schools': 'for-schools'"), 'routeMap maps for-schools');
  assert(appCode.includes("'for-teachers': 'for-teachers'"), 'routeMap maps for-teachers');
  assert(appCode.includes("'for-suppliers': 'for-suppliers'"), 'routeMap maps for-suppliers');

  // 5. Verify Script Tags in index.html
  console.log('\n--- Test Group 5: HTML Script Tags in index.html ---');
  const indexHtml = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
  assert(/\/js\/views\/forSchoolsView\.js\?v=(7[5-9]|[8-9][0-9])/.test(indexHtml), 'Loads forSchoolsView.js with ?v=75+');
  assert(/\/js\/views\/forTeachersView\.js\?v=(7[5-9]|[8-9][0-9])/.test(indexHtml), 'Loads forTeachersView.js with ?v=75+');
  assert(/\/js\/views\/forSuppliersView\.js\?v=(7[5-9]|[8-9][0-9])/.test(indexHtml), 'Loads forSuppliersView.js with ?v=75+');
  assert(/\/js\/app\.js\?v=(7[5-9]|[8-9][0-9])/.test(indexHtml), 'Loads app.js with ?v=75+');

  // 6. Verify Navigation in footer.js & homeView.js
  console.log('\n--- Test Group 6: Ecosystem Navigation Links ---');
  const footerCode = fs.readFileSync(path.join(__dirname, '../public/js/components/footer.js'), 'utf8');
  assert(footerCode.includes('data-view="for-schools"'), 'footer.js links to for-schools');
  assert(footerCode.includes('data-view="for-teachers"'), 'footer.js links to for-teachers');
  assert(footerCode.includes('data-view="for-suppliers"'), 'footer.js links to for-suppliers');

  const homeCode = fs.readFileSync(path.join(__dirname, '../public/js/views/homeView.js'), 'utf8');
  assert(homeCode.includes('btn-goto-for-schools'), 'homeView.js has button for for-schools');
  assert(homeCode.includes('btn-goto-for-teachers'), 'homeView.js has button for for-teachers');
  assert(homeCode.includes('btn-goto-for-suppliers'), 'homeView.js has button for for-suppliers');

  // Summary
  console.log('\n============================================================');
  console.log(`TOTAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
