/**
 * SkoolFinder Ghana - Phase 6: National Ecosystem & External Regulatory Integrations Suite
 * Baseline: Ministry of Education (MoE) & GES EMIS Standard, WAEC Ghana Verification,
 * and Live Omnichannel SMS Gateway (Hubtel & Arkesel).
 */

const assert = require('assert');
const { NationalIntegrationsService } = require('../src/services/nationalIntegrationsService');

console.log('======================================================================');
console.log('🏛️ SKOOLFINDER GHANA: NATIONAL ECOSYSTEM & REGULATORY SUITE (PHASE 6)');
console.log('======================================================================\n');

let passed = 0;
let failed = 0;

async function it(desc, fn) {
  try {
    await fn();
    console.log(`  ✅ [PASS] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${desc}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

async function run() {
  const testSchoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6';
  const testUser = { id: 'usr-admin-001', name: 'Dr. Michael Addison', email: 'admin@gis.edu.gh', role: 'school_admin' };

  let generatedCensusId = null;

  // --------------------------------------------------------------------------
  // 1. MINISTRY OF EDUCATION & GES EMIS CENSUS ENGINE
  // --------------------------------------------------------------------------
  await it('EMIS-001: Generates MoE / GES annual census payload with disaggregated student & teacher metrics', async () => {
    const res = await NationalIntegrationsService.generateEmisCensus(testSchoolId, {
      schoolName: 'Ghana International School',
      academicYear: '2025/2026',
      reportingCycle: 'Annual Census',
      district: 'Accra Metropolitan Assembly (AMA)',
      region: 'Greater Accra',
      enrollment: {
        total: 850,
        male: 418,
        female: 432,
        genderParityIndex: 1.03,
        specialNeedsCount: 14,
        gradeBreakdown: [
          { grade: 'KG', male: 42, female: 45, total: 87 },
          { grade: 'Primary 1-3', male: 110, female: 115, total: 225 },
          { grade: 'Primary 4-6', male: 120, female: 122, total: 242 },
          { grade: 'JHS 1-3', male: 146, female: 150, total: 296 }
        ]
      },
      staffing: {
        totalTeachers: 95,
        ntcLicensedTeachers: 91,
        trainedTeacherRatioPct: 95.8,
        pupilTeacherRatio: 8.9,
        maleStaff: 38,
        femaleStaff: 57
      },
      facilities: {
        totalClassrooms: 36,
        functionalIctLabs: 3,
        workingComputers: 90,
        scienceLaboratories: 3,
        librarySeatingCapacity: 80,
        libraryBookCount: 3450,
        potableWaterAvailable: true,
        waterSource: 'Ghana Water Mains + Borehole',
        separateToiletsForGirls: true,
        totalToiletStances: 42,
        gridElectricityAvailable: true,
        standbyGeneratorAvailable: true,
        internetConnectivity: 'Fibre Optic'
      }
    }, testUser);

    assert.strictEqual(res.success, true);
    assert.ok(res.census.id.startsWith('EMIS-2026-'));
    assert.strictEqual(res.census.data.enrollment.total, 850);
    assert.strictEqual(res.census.data.staffing.ntcLicensedTeachers, 91);
    assert.ok(res.census.certification_hash.startsWith('sha256-'));
    generatedCensusId = res.census.id;
  });

  await it('EMIS-002: Validates EMIS compliance rules (WASH facilities, NTC license ratios)', async () => {
    // 1. Valid census validation
    const validCheck = await NationalIntegrationsService.validateEmisCensus({
      enrollment: { total: 500, male: 250, female: 250 },
      staffing: { totalTeachers: 30, ntcLicensedTeachers: 28 },
      facilities: { potableWaterAvailable: true, separateToiletsForGirls: true }
    });
    assert.strictEqual(validCheck.success, true);
    assert.strictEqual(validCheck.isValid, true);
    assert.strictEqual(validCheck.complianceStatus, 'GES_COMPLIANT');

    // 2. Non-compliant census (missing WASH separate toilets)
    const invalidCheck = await NationalIntegrationsService.validateEmisCensus({
      enrollment: { total: 500, male: 200, female: 300 }, // sum matches
      staffing: { totalTeachers: 30, ntcLicensedTeachers: 35 }, // impossible NTC count
      facilities: { potableWaterAvailable: true, separateToiletsForGirls: false } // violates WASH
    });
    assert.strictEqual(invalidCheck.isValid, false);
    assert.strictEqual(invalidCheck.complianceStatus, 'NEEDS_REMEDIATION');
    assert.ok(invalidCheck.issues.length >= 2);
  });

  await it('EMIS-003: Exports standard GES EMIS JSON and CSV data interchange files', async () => {
    // Export JSON
    const jsonRes = await NationalIntegrationsService.exportEmisPayload(generatedCensusId, 'json');
    assert.strictEqual(jsonRes.success, true);
    assert.strictEqual(jsonRes.format, 'json');
    assert.ok(jsonRes.payload.header.standard.includes('Ministry of Education Ghana'));
    assert.strictEqual(jsonRes.payload.institution.name, 'Ghana International School');

    // Export CSV
    const csvRes = await NationalIntegrationsService.exportEmisPayload(generatedCensusId, 'csv');
    assert.strictEqual(csvRes.success, true);
    assert.strictEqual(csvRes.format, 'csv');
    assert.ok(csvRes.content.includes('EMIS_Code,School_Name,District,Region'));
    assert.ok(csvRes.content.includes('"Ghana International School"'));
  });

  // --------------------------------------------------------------------------
  // 2. WAEC GHANA DIRECT VERIFICATION ENGINE
  // --------------------------------------------------------------------------
  await it('WAEC-001: Validates 10-digit index number and verifies BECE grade slip with aggregate score', async () => {
    const res = await NationalIntegrationsService.verifyWaecCandidate({
      indexNumber: '0101048024',
      examType: 'BECE',
      examYear: '2025',
      candidateName: 'Duodu, Kwabena Kwame'
    }, testUser);

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.isVerified, true);
    assert.strictEqual(res.record.index_number, '0101048024');
    assert.strictEqual(res.record.exam_type, 'BECE');
    assert.strictEqual(res.record.raw_score_aggregate, 8);
    assert.ok(res.record.subjects.length >= 8);
    assert.strictEqual(res.record.subjects[0].subject, 'English Language');
    assert.strictEqual(res.record.subjects[0].grade, '1');
  });

  await it('WAEC-002: Verifies WASSCE examination results across core and elective subjects', async () => {
    const res = await NationalIntegrationsService.verifyWaecCandidate({
      indexNumber: '0010104992',
      examType: 'WASSCE',
      examYear: '2025',
      candidateName: 'Mensah, Abigail Serwaa'
    }, testUser);

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.isVerified, true);
    assert.strictEqual(res.record.exam_type, 'WASSCE');
    assert.ok(res.record.subjects.some(s => s.code === 'CORE-ENG' && s.grade === 'A1'));
    assert.ok(res.record.distinction_grade.includes('University Placement'));
  });

  await it('WAEC-003: Computes school WAEC performance benchmarks and distinction rates', async () => {
    const res = await NationalIntegrationsService.getSchoolWaecAnalytics(testSchoolId, '2025');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.schoolId, testSchoolId);
    assert.ok(res.bece.distinctionRatePct > 90);
    assert.strictEqual(res.bece.candidatesPresented, 110);
    assert.ok(res.wassce.universityDirectEntryRatePct > 95);
  });

  // --------------------------------------------------------------------------
  // 3. OMNICHANNEL GHANA SMS GATEWAY (HUBTEL & ARKESEL)
  // --------------------------------------------------------------------------
  await it('SMS-001: Normalizes Ghanaian mobile phone numbers across MTN, Telecel, and AT networks', async () => {
    const mtn = NationalIntegrationsService.normalizeGhanaPhoneNumber('0245551212');
    assert.strictEqual(mtn.normalized, '233245551212');
    assert.strictEqual(mtn.international, '+233245551212');
    assert.strictEqual(mtn.network, 'MTN Ghana');
    assert.strictEqual(mtn.isValidGhanaianNumber, true);

    const telecel = NationalIntegrationsService.normalizeGhanaPhoneNumber('+233 20 789 4561');
    assert.strictEqual(telecel.normalized, '233207894561');
    assert.strictEqual(telecel.network, 'Telecel Ghana');
    assert.strictEqual(telecel.isValidGhanaianNumber, true);

    const at = NationalIntegrationsService.normalizeGhanaPhoneNumber('027 123 4567');
    assert.strictEqual(at.normalized, '233271234567');
    assert.strictEqual(at.network, 'AT Ghana (AirtelTigo)');
    assert.strictEqual(at.isValidGhanaianNumber, true);
  });

  await it('SMS-002: Dispatches SMS via Hubtel gateway with failover handling and delivery audit logging', async () => {
    const res = await NationalIntegrationsService.dispatchLiveSms(testSchoolId, {
      recipientPhone: '055 333 4444',
      recipientName: 'Mrs. Cynthia Addo',
      message: 'Dear Parent, WAEC BECE candidate Kwabena Duodu has achieved Aggregate 8 Distinction. Offer verified.'
    }, testUser);

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.sms.delivery_status, 'delivered');
    assert.strictEqual(res.sms.sender_id, 'SKOOLFINDER');
    assert.strictEqual(res.sms.units, 1);
    assert.ok(res.remainingBalanceGhs > 0);
  });

  await it('SMS-003: Computes SMS usage units and tracks billing ledger in GH₵', async () => {
    // Long message (> 160 characters)
    const longMsg = 'This is an official notice from SkoolFinder Ghana and the Ministry of Education regarding annual school census compliance, student ID issuance, and campus facility accreditation under NaSIA regulations for the 2025/2026 academic term.';
    const res = await NationalIntegrationsService.dispatchLiveSms(testSchoolId, {
      recipientPhone: '024 111 2222',
      recipientName: 'Proprietor Desk',
      message: longMsg
    }, testUser);

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.sms.units, 2); // >160 chars = 2 SMS units
    assert.strictEqual(res.sms.cost_ghs, 0.09); // 2 * 0.045 = GH₵ 0.09

    const stats = await NationalIntegrationsService.getSmsDeliveryStats(testSchoolId);
    assert.strictEqual(stats.success, true);
    assert.ok(stats.totalSent >= 2);
    assert.strictEqual(stats.deliverySuccessRatePct, 100);
    assert.ok(stats.totalSpentGhs > 0);
  });

  console.log('\n======================================================================');
  console.log(`📊 Phase 6 Verification Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error in Phase 6 test runner:', err);
  process.exit(1);
});
