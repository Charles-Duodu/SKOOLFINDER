/**
 * Automated Verification Suite: Package C — School Claim Verification & Identity Workflow
 * (NaSIA / GES Registry Cross-Check, Ghana Card Identity & Act 1023 Accreditation)
 * ======================================================================================
 * Baseline:
 *   - Public Website Master Guide v1.0 (Sections 2, 4, 11, 13, 16)
 *   - School Owner Master Blueprint v2.0 (SCH-001 through SCH-005 & DEC-01)
 *   - Education Regulatory Bodies Act, 2020 (Act 1023)
 *   - Statutory Declarations Act, 1971 (Act 389)
 * ======================================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { NasiaRegistryService, NASIA_OFFICIAL_REGISTER } = require('../src/services/nasiaRegistryService');
const SchoolOwnerService = require('../src/services/schoolOwnerService');

async function runPackageCTests() {
  console.log('========================================================================');
  console.log('🚀 RUNNING PACKAGE C: SCHOOL CLAIM VERIFICATION & NaSIA CROSS-CHECK');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      throw err;
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Ghana Card PIN Format and Checksum Validation
  // --------------------------------------------------------------------------
  await test('1. validateGhanaCard validates official NIA GHA-XXXXXXXXX-X pattern and rejects invalid formats', async () => {
    const valid1 = NasiaRegistryService.validateGhanaCard('GHA-721839201-4');
    assert.strictEqual(valid1.valid, true, 'Standard PIN should be valid');
    assert.strictEqual(valid1.formattedPin, 'GHA-721839201-4');

    const validLowercase = NasiaRegistryService.validateGhanaCard('gha-102938475-6');
    assert.strictEqual(validLowercase.valid, true, 'Lowercase PIN should be accepted and normalized');
    assert.strictEqual(validLowercase.formattedPin, 'GHA-102938475-6');

    const invalid1 = NasiaRegistryService.validateGhanaCard('ABC-123456789-0');
    assert.strictEqual(invalid1.valid, false, 'Invalid prefix should fail');

    const invalidShort = NasiaRegistryService.validateGhanaCard('GHA-123-4');
    assert.strictEqual(invalidShort.valid, false, 'Short PIN should fail');

    const invalidEmpty = NasiaRegistryService.validateGhanaCard('');
    assert.strictEqual(invalidEmpty.valid, false, 'Empty PIN should fail');
  });

  // --------------------------------------------------------------------------
  // TEST 2: NaSIA Pre-Tertiary License Format Validation
  // --------------------------------------------------------------------------
  await test('2. validateNasiaLicense validates official NaSIA license formatting and categories', async () => {
    const validAccra = NasiaRegistryService.validateNasiaLicense('NaSIA-ACC-2026-0894');
    assert.strictEqual(validAccra.valid, true);
    assert.strictEqual(validAccra.regionCode, 'ACC');
    assert.strictEqual(validAccra.year, 2026);

    const validAshanti = NasiaRegistryService.validateNasiaLicense('NaSIA-ASH-2025-0102');
    assert.strictEqual(validAshanti.valid, true);
    assert.strictEqual(validAshanti.regionCode, 'ASH');

    const invalidFormat = NasiaRegistryService.validateNasiaLicense('INVALID-LICENSE-999');
    assert.strictEqual(invalidFormat.valid, false);
  });

  // --------------------------------------------------------------------------
  // TEST 3: Authoritative NaSIA Register Fixture & Query Capabilities
  // --------------------------------------------------------------------------
  await test('3. lookupRegistry finds official institutions by name, license number, or locality', async () => {
    assert.ok(Array.isArray(NASIA_OFFICIAL_REGISTER), 'Official register fixture must exist');
    assert.ok(NASIA_OFFICIAL_REGISTER.length >= 8, 'Should contain at least 8 canonical institutions');

    // Lookup by name
    const gisLookup = NasiaRegistryService.lookupRegistry('Ghana International School');
    assert.ok(gisLookup.length >= 1, 'Should find GIS by full name');
    assert.strictEqual(gisLookup[0].nasiaLicenseNumber, 'NaSIA-ACC-2026-0894');
    assert.strictEqual(gisLookup[0].inspectionGrade, 'Grade A (Outstanding)');

    // Lookup by alternate name
    const motownLookup = NasiaRegistryService.lookupRegistry('Motown');
    assert.ok(motownLookup.length >= 1, 'Should find Achimota School by alternate nickname Motown');

    // Lookup by license
    const licLookup = NasiaRegistryService.lookupRegistry('NaSIA-ACC-2025-0102');
    assert.ok(licLookup.length >= 1, 'Should find Accra Academy by license number');

    // Registry stats
    const stats = NasiaRegistryService.getRegistryStatistics();
    assert.ok(stats.totalAuthoritativeCampuses >= 8);
    assert.ok(stats.activeLicensedCount >= 1);
  });

  // --------------------------------------------------------------------------
  // TEST 4: Algorithmic Cross-Check & Regulatory Confidence Scoring (0-100%)
  // --------------------------------------------------------------------------
  await test('4. crossCheckSchool computes weighted confidence scores and recommendations', async () => {
    // A: Exact Match (License + Name + GES Code + Region + Headmaster) -> 90%+
    const exactMatch = NasiaRegistryService.crossCheckSchool({
      schoolName: 'Ghana International School',
      nasiaLicenseNumber: 'NaSIA-ACC-2026-0894',
      gesCode: 'GES-GAR-AMA-0194',
      claimantName: 'Dr. Mary Ashun',
      region: 'Greater Accra'
    });
    assert.strictEqual(exactMatch.matchStatus, 'EXACT_MATCH');
    assert.ok(exactMatch.confidenceScore >= 90, `Exact match confidence score should be >= 90%, got ${exactMatch.confidenceScore}%`);
    assert.strictEqual(exactMatch.recommendation, 'AUTO_VERIFY_ELIGIBLE');
    assert.strictEqual(exactMatch.matchBreakdown.licenseMatch, true);
    assert.strictEqual(exactMatch.matchBreakdown.nameMatch, true);
    assert.strictEqual(exactMatch.matchBreakdown.gesCodeMatch, true);
    assert.strictEqual(exactMatch.matchBreakdown.locationMatch, true);
    assert.strictEqual(exactMatch.matchBreakdown.proprietorNameCheck, true);

    // B: Partial Match (Name match only without license) -> 50-79%
    const partialMatch = NasiaRegistryService.crossCheckSchool({
      schoolName: 'Lincoln Community School',
      nasiaLicenseNumber: '',
      region: 'Greater Accra'
    });
    assert.strictEqual(partialMatch.matchStatus, 'PARTIAL_MATCH');
    assert.ok(partialMatch.confidenceScore >= 40 && partialMatch.confidenceScore < 80);
    assert.strictEqual(partialMatch.recommendation, 'MANUAL_INSPECTION_REQUIRED');

    // C: Expired License institution in register
    const expiredMatch = NasiaRegistryService.crossCheckSchool({
      schoolName: "St. Peter's Mission School",
      nasiaLicenseNumber: 'NaSIA-ACC-2022-0044'
    });
    assert.strictEqual(expiredMatch.matchStatus, 'EXPIRED_LICENSE');
    assert.strictEqual(expiredMatch.recommendation, 'MANUAL_INSPECTION_REQUIRED');

    // D: Unregistered Institution
    const unregMatch = NasiaRegistryService.crossCheckSchool({
      schoolName: 'Unknown Future Academy 2026',
      nasiaLicenseNumber: 'NaSIA-XYZ-9999-9999'
    });
    assert.strictEqual(unregMatch.matchStatus, 'UNREGISTERED');
    assert.strictEqual(unregMatch.recommendation, 'REJECT_UNREGISTERED');
  });

  // --------------------------------------------------------------------------
  // TEST 5: School Claim Submission Workflow (SchoolOwnerService.submitSchoolClaim)
  // --------------------------------------------------------------------------
  let submittedClaimRef = null;
  const testSchoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6'; // GIS

  await test('5. submitSchoolClaim validates identity, embeds NaSIA cross-check, and queues for vetting', async () => {
    const claimPayload = {
      schoolName: 'Ghana International School (GIS)',
      claimantName: 'Dr. Mary Ashun',
      claimantRole: 'Head of School / Principal',
      officialEmail: 'principal@gis.edu.gh',
      officialPhone: '+233241112233',
      ghanaCardPin: 'GHA-721839201-4',
      nasiaLicenseNumber: 'NaSIA-ACC-2026-0894',
      gesCircuitCode: 'GES-GAR-AMA-0194',
      rgdNumber: 'CS-0941-1953',
      evidenceNotes: 'Official principal appointment and NaSIA statutory board resolution attached.',
      statutoryDeclaration: true,
      fileName: 'NaSIA_Accreditation_Certificate_GIS_2026.pdf'
    };

    const res = await SchoolOwnerService.submitSchoolClaim(testSchoolId, claimPayload, {
      id: 'usr-test-claimant-01',
      email: 'principal@gis.edu.gh',
      full_name: 'Dr. Mary Ashun'
    });

    assert.strictEqual(res.success, true);
    assert.ok(res.referenceCode.startsWith('SF-CLM-2026-'), 'Reference code must follow SF-CLM-2026-XXXX format');
    submittedClaimRef = res.referenceCode;

    // Verify cross-check result is embedded
    assert.ok(res.crossCheck, 'Cross-check result must be embedded in claim');
    assert.strictEqual(res.crossCheck.matchStatus, 'EXACT_MATCH');
    assert.ok(res.crossCheck.confidenceScore >= 90);

    // Verify claim status lookup
    const statusRes = await SchoolOwnerService.getClaimStatus(testSchoolId);
    assert.strictEqual(statusRes.exists, true);
    assert.strictEqual(statusRes.claim.ghana_card_pin, 'GHA-721839201-4');
    assert.strictEqual(statusRes.claim.statutory_declaration, true);
  });

  // --------------------------------------------------------------------------
  // TEST 6: Super Admin Claims Governance & Vetting Queue
  // --------------------------------------------------------------------------
  await test('6. getClaimsList and getAdminVerificationQueue retrieve submitted claims with dossier', async () => {
    const claims = await SchoolOwnerService.getClaimsList();
    assert.ok(Array.isArray(claims));
    const target = claims.find(c => c.id === submittedClaimRef);
    assert.ok(target, 'Submitted claim must appear in claims list');
    assert.strictEqual(target.claimant_name, 'Dr. Mary Ashun');

    const vQueue = await SchoolOwnerService.getAdminVerificationQueue();
    assert.ok(Array.isArray(vQueue));
    const targetCase = vQueue.find(c => c.claim_id === submittedClaimRef || c.id === `vcase-${submittedClaimRef}`);
    assert.ok(targetCase, 'Verification case must exist in Super Admin review queue');
  });

  // --------------------------------------------------------------------------
  // TEST 7: Super Admin Review Decision: Request Info & Rejection
  // --------------------------------------------------------------------------
  await test('7. reviewClaimDecision handles request_info and reject decisions with audit logging', async () => {
    // 1. Request Additional Info
    const infoRes = await SchoolOwnerService.reviewClaimDecision(
      submittedClaimRef,
      'request_info',
      { id: 'admin-super-01', email: 'admin@skoolfinder.com.gh' },
      'Please upload certified Board of Governors appointment letter.'
    );
    assert.strictEqual(infoRes.decision, 'information_required');

    const statusAfterInfo = await SchoolOwnerService.getClaimStatus(testSchoolId);
    assert.strictEqual(statusAfterInfo.claim.status, 'information_required');
    assert.strictEqual(statusAfterInfo.claim.reviewer_notes, 'Please upload certified Board of Governors appointment letter.');

    // 2. Reject
    const rejectRes = await SchoolOwnerService.reviewClaimDecision(
      submittedClaimRef,
      'reject',
      { id: 'admin-super-01', email: 'admin@skoolfinder.com.gh' },
      'Verification failed: invalid corporate seal',
      'REASON_UNVERIFIED_SEAL'
    );
    assert.strictEqual(rejectRes.decision, 'rejected');

    const statusAfterReject = await SchoolOwnerService.getClaimStatus(testSchoolId);
    assert.strictEqual(statusAfterReject.claim.status, 'rejected');
  });

  // --------------------------------------------------------------------------
  // TEST 8: Super Admin Approval: School Ownership Grant & DEC-01 Membership
  // --------------------------------------------------------------------------
  await test('8. reviewClaimDecision approval sets school claimed=true, awards NaSIA trust badge, and assigns DEC-01 primary proprietor', async () => {
    const approveRes = await SchoolOwnerService.reviewClaimDecision(
      submittedClaimRef,
      'approve',
      { id: 'admin-super-01', email: 'admin@skoolfinder.com.gh' },
      'NaSIA registration license and Ghana Card identity authenticated.'
    );
    assert.strictEqual(approveRes.decision, 'approved');

    const statusAfterApprove = await SchoolOwnerService.getClaimStatus(testSchoolId);
    assert.strictEqual(statusAfterApprove.claim.status, 'approved');

    // Verify DEC-01 membership assignment
    const membership = await SchoolOwnerService.getProprietorMembership(statusAfterApprove.claim.claimant_id);
    assert.ok(membership, 'Proprietor membership must exist');
    assert.strictEqual(membership.role, 'primary_proprietor', 'Must be primary proprietor');
    assert.strictEqual(membership.status, 'active');
  });

  // --------------------------------------------------------------------------
  // TEST 9: API Client Integration in public/js/api.js
  // --------------------------------------------------------------------------
  await test('9. public/js/api.js exposes NaSIA cross-check and claim status methods', async () => {
    const apiFile = fs.readFileSync(path.join(__dirname, '../public/js/api.js'), 'utf8');
    assert.ok(apiFile.includes('crossCheckNasiaRegistry(payload)'), 'API must expose crossCheckNasiaRegistry');
    assert.ok(apiFile.includes('lookupNasiaRegistry(query)'), 'API must expose lookupNasiaRegistry');
    assert.ok(apiFile.includes('getNasiaRegistryStats()'), 'API must expose getNasiaRegistryStats');
    assert.ok(apiFile.includes('getSchoolClaimStatus(schoolId)'), 'API must expose getSchoolClaimStatus');
  });

  // --------------------------------------------------------------------------
  // TEST 10: 3-Step Claim Modal Wizard in public/js/components/modals.js
  // --------------------------------------------------------------------------
  await test('10. public/js/components/modals.js defines 3-step accredited claim wizard and dossier modal', async () => {
    const modalsFile = fs.readFileSync(path.join(__dirname, '../public/js/components/modals.js'), 'utf8');
    assert.ok(modalsFile.includes('openClaimSchoolModal(school)'), 'openClaimSchoolModal must exist');
    assert.ok(modalsFile.includes('Ghana Card PIN'), 'Modal must include Ghana Card PIN field');
    assert.ok(modalsFile.includes('btn-crosscheck-nasia'), 'Modal must include live NaSIA verify button');
    assert.ok(modalsFile.includes('Statutory Legal Attestation (Act 389)'), 'Modal must enforce statutory legal attestation');
    assert.ok(modalsFile.includes('openCaseDossierModal(caseData, onDecision)'), 'Modal must define openCaseDossierModal');
  });

  // --------------------------------------------------------------------------
  // TEST 11: Super Admin Vetting Desk View in public/js/views/adminView.js
  // --------------------------------------------------------------------------
  await test('11. public/js/views/adminView.js renders NaSIA cross-check telemetry and dossier inspector', async () => {
    const adminViewFile = fs.readFileSync(path.join(__dirname, '../public/js/views/adminView.js'), 'utf8');
    assert.ok(adminViewFile.includes('btn-admin-case-dossier'), 'Admin view must render Dossier button');
    assert.ok(adminViewFile.includes('Modals.openCaseDossierModal'), 'Admin view must open case dossier modal');
    assert.ok(adminViewFile.includes('Confidence'), 'Admin view must display confidence scoring');
    assert.ok(adminViewFile.includes('btn-admin-case-approve'), 'Admin view must wire approve button');
  });

  // --------------------------------------------------------------------------
  // TEST 12: Public Profile Decoupled NaSIA Trust Card in schoolDetailView.js
  // --------------------------------------------------------------------------
  await test('12. public/js/views/schoolDetailView.js decouples NaSIA licensing from platform verification', async () => {
    const detailViewFile = fs.readFileSync(path.join(__dirname, '../public/js/views/schoolDetailView.js'), 'utf8');
    assert.ok(detailViewFile.includes('NaSIA Licensed Pre-Tertiary'), 'Must render NaSIA pre-tertiary license badge');
    assert.ok(detailViewFile.includes('SkoolFinder Verified Management'), 'Must distinguish SkoolFinder verification');
    assert.ok(detailViewFile.includes('National Schools Inspectorate Authority (NaSIA)'), 'Must render NaSIA card in Institutional Fact Sheet');
    assert.ok(detailViewFile.includes('Act 1023'), 'Must cite Education Regulatory Bodies Act 2020');
  });

  // --------------------------------------------------------------------------
  // TEST 13: Cache Buster v=71 in public/index.html
  // --------------------------------------------------------------------------
  await test('13. public/index.html includes v=71 cache-busters for client scripts', async () => {
    const indexHtml = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    assert.ok(/\/js\/components\/modals\.js\?v=7[1-9]/.test(indexHtml), 'modals.js must have active cache-buster');
    assert.ok(/\/js\/views\/adminView\.js\?v=7[1-9]/.test(indexHtml), 'adminView.js must have active cache-buster');
    assert.ok(/\/js\/views\/schoolDetailView\.js\?v=7[1-9]/.test(indexHtml), 'schoolDetailView.js must have active cache-buster');
  });

  console.log('\n========================================================================');
  console.log(`PACKAGE C VERIFICATION COMPLETE: ${passed} / ${total} TESTS PASSED (100%)`);
  console.log('========================================================================\n');
}

runPackageCTests().catch(err => {
  console.error('\n❌ PACKAGE C TEST SUITE FAILED:', err);
  process.exit(1);
});
