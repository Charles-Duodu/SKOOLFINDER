/**
 * Master Verification Suite: SkoolFinder Ghana Parents Portal Master Blueprint v4.2
 * Runs all 7 Phase Verification Suites
 */
const { execSync } = require('child_process');

const suites = [
  { name: 'Phase 1: Theme B Tokens, 5-Tab Mobile Nav & Trust Safeguards', file: 'scripts/test-phase1-theme-b.js' },
  { name: 'Phase 2: Decisions — 4-Way Compare & Fit Matchmaker', file: 'scripts/test-phase2-decisions-matchmaker.js' },
  { name: 'Phase 3: Progressive Parent Accounts & Smart Context Import', file: 'scripts/test-phase3-parent-auth-import.js' },
  { name: 'Phase 4: Parent Productivity — Command Centre & 5-State Board', file: 'scripts/test-phase4-parent-productivity.js' },
  { name: 'Phase 5: Direct School Communications & Campus Visit Booking', file: 'scripts/test-phase5-communications-visits.js' },
  { name: 'Phase 6: Decisions & Applications Tracking Pipeline', file: 'scripts/test-phase6-admissions-tracking.js' },
  { name: 'Phase 7: Hardening, Accessibility (WCAG 2.2 AA) & Design System', file: 'scripts/test-phase7-accessibility-hardening.js' }
];

console.log('======================================================================');
console.log('🏆 SKOOLFINDER GHANA PARENTS PORTAL MASTER BLUEPRINT v4.2 VERIFICATION');
console.log('======================================================================\n');

let totalSuites = suites.length;
let passedSuites = 0;

for (const suite of suites) {
  console.log(`▶️ Running ${suite.name}...`);
  try {
    const output = execSync(`node "${suite.file}"`, { stdio: 'inherit' });
    passedSuites++;
    console.log(`✅ ${suite.name} PASSED\n`);
  } catch (err) {
    console.error(`❌ ${suite.name} FAILED\n`);
    process.exit(1);
  }
}

console.log('======================================================================');
console.log(`🎉 ALL BLUEPRINT v4.2 PHASES VERIFIED: ${passedSuites}/${totalSuites} SUITES PASSED!`);
console.log('======================================================================\n');

