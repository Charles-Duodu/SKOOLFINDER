/**
 * SkoolFinder Ghana — Complete Unified Platform Master Verification Runner
 * Runs the entire verification battery across all 7 releases (Release 0 through Release 6).
 */

const { execSync } = require('child_process');

const TEST_SCRIPTS = [
  { release: 'Release 0: Security Hardening & Admin Desks', file: 'scripts/test-phase8-security-audit.js' },
  { release: 'Client UI: All 19 Views & Event Attachments', file: 'scripts/test-all-views-audit.js' },
  { release: 'Release 1: Unified Identity & Multi-Persona Architecture', file: 'scripts/test-release1-unified-identity.js' },
  { release: 'Release 2: Educator Onboarding & 5D Vetting Engine', file: 'scripts/test-release2-educator-vetting.js' },
  { release: 'Release 3: Unified Recruitment & Talent Marketplace', file: 'scripts/test-release3-recruitment-marketplace.js' },
  { release: 'Release 4: Safeguarded Tutoring & Mutual Booking Engine', file: 'scripts/test-release4-safeguarded-tutoring.js' },
  { release: 'Release 5: Monetization, MoMo Escrow & Quota Ledgers', file: 'scripts/test-release5-monetization-escrow.js' },
  { release: 'Release 6: Super Admin Cockpit & National Registries', file: 'scripts/test-release6-cockpit-launch.js' }
];

console.log('\n================================================================');
console.log('🇬🇭 SKOOLFINDER GHANA — COMPLETE PLATFORM MASTER TEST SUITE');
console.log('================================================================\n');

let allPassed = true;
const summary = [];

for (const test of TEST_SCRIPTS) {
  process.stdout.write(`⏳ Running [${test.release}]... `);
  try {
    const output = execSync(`node "${test.file}"`, { stdio: 'pipe' }).toString();
    console.log('✅ PASSED');
    summary.push({ release: test.release, status: 'PASSED' });
  } catch (err) {
    console.log('❌ FAILED');
    console.error(err.stdout ? err.stdout.toString() : err.message);
    summary.push({ release: test.release, status: 'FAILED' });
    allPassed = false;
  }
}

console.log('\n================================================================');
console.log('MASTER VERIFICATION SUMMARY');
console.log('================================================================');
summary.forEach(s => console.log(`  ${s.status === 'PASSED' ? '✓' : '✕'} ${s.release}: ${s.status}`));
console.log('================================================================\n');

if (!allPassed) {
  console.error('❌ One or more releases failed verification.');
  process.exit(1);
} else {
  console.log('🚀 ALL 7 RELEASES FULLY PASS VERIFICATION WITH ZERO FAILURES!\n');
}

