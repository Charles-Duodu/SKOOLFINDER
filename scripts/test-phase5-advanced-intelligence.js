/**
 * SkoolFinder Ghana - Phase 5 Verification Suite
 * Advanced Institutional Intelligence, Campus Operations & Multi-School Oversight
 * Baseline: Blueprint v2.0 Modules 15, 18, 19, Sections 14, 19, 26.5
 */

const assert = require('assert');
const { IntelligenceOperationsService } = require('../src/services/intelligenceOperationsService');

console.log('======================================================================');
console.log('🧠 SKOOLFINDER GHANA: PHASE 5 ADVANCED INTELLIGENCE & CAMPUS OPS');
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
  const testUser = { id: 'usr-proprietor-001', name: 'Dr. Michael Addison', role: 'proprietor' };

  let createdAssetId = null;
  let createdBookId = null;
  let createdLoanId = null;
  let createdRouteId = null;
  let createdGroupId = null;

  // ------------------------------------------------------------------------
  // 1. INSTITUTIONAL PREDICTIVE INTELLIGENCE (Module 19)
  // ------------------------------------------------------------------------
  await it('INT-001: Computes Admissions Predictive Yield & Capacity Saturation', async () => {
    const res = await IntelligenceOperationsService.getPredictiveYield(testSchoolId);
    assert.strictEqual(res.success, true);
    assert.ok(res.kpis.inquiryConversionRatePct > 0, 'Inquiry conversion rate must be > 0');
    assert.ok(res.kpis.offerAcceptanceRatePct > 0, 'Offer acceptance rate must be > 0');
    assert.ok(res.kpis.predictedYieldPct > 0, 'Predicted yield must be > 0');
    assert.ok(res.gradeForecasts.length >= 4, 'Must forecast at least 4 grade tiers');
  });

  await it('INT-002: Analyzes Student Cohort Transition Retention & Attrition Factors', async () => {
    const res = await IntelligenceOperationsService.getCohortRetention(testSchoolId);
    assert.strictEqual(res.success, true);
    assert.ok(res.overallRetentionRatePct > 90, 'Overall retention rate must exceed 90%');
    assert.ok(res.transitions.length >= 4, 'Must analyze at least 4 cohort transition stages');
    assert.ok(res.primaryAttritionReasons.length >= 3, 'Must quantify top attrition factors');
  });

  await it('INT-003: Forecasts Tuition Revenue Cash Flow & Payment Rail Share (MoMo 68%)', async () => {
    const res = await IntelligenceOperationsService.getRevenueProjections(testSchoolId);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.currency, 'GHS');
    assert.ok(res.annualBilledTuitionGhs > 2000000, 'Annual billed tuition must exceed GH₵ 2M');
    assert.ok(res.paymentMethodBreakdown.mtnMobileMoneyPct > 50, 'MoMo must represent majority of collection');
    assert.strictEqual(res.monthlyProjections.length, 12, 'Must project 12 academic calendar months');
  });

  // ------------------------------------------------------------------------
  // 2. FIXED ASSETS & SCIENCE/IT LAB INVENTORY
  // ------------------------------------------------------------------------
  await it('OPS-001: Registers and updates Campus Fixed Asset with unique serial', async () => {
    const postRes = await IntelligenceOperationsService.createAsset(testSchoolId, {
      name: 'HP ProDesk Microtower PCs (30 Units)',
      category: 'ICT & Computing',
      building: 'Tech Annex',
      room: 'Lab 3',
      purchase_value_ghs: 48000,
      condition: 'operational',
      assigned_custodian: 'Mr. Eric Antwi'
    }, testUser);

    assert.strictEqual(postRes.success, true);
    assert.ok(postRes.asset.id.startsWith('AST-'), 'Asset ID must match AST prefix format');
    createdAssetId = postRes.asset.id;

    // Update condition
    const patchRes = await IntelligenceOperationsService.updateAsset(testSchoolId, createdAssetId, {
      condition: 'needs_maintenance',
      room: 'Lab 3 - Storage Bay'
    }, testUser);

    assert.strictEqual(patchRes.success, true);
    assert.strictEqual(patchRes.asset.condition, 'needs_maintenance');
    assert.strictEqual(patchRes.asset.room, 'Lab 3 - Storage Bay');
  });

  await it('OPS-002: Retrieves campus fixed assets registry with aggregate valuation', async () => {
    const res = await IntelligenceOperationsService.getAssets(testSchoolId);
    assert.strictEqual(res.success, true);
    assert.ok(res.count >= 4, 'Must return at least 4 registered fixed assets');
    assert.ok(res.totalValuationGhs > 150000, 'Total valuation must exceed GH₵ 150,000');
    assert.strictEqual(res.currency, 'GHS');
  });

  // ------------------------------------------------------------------------
  // 3. LIBRARY MANAGEMENT SYSTEM (LMS)
  // ------------------------------------------------------------------------
  await it('OPS-003: Catalogs curriculum textbook into School Library', async () => {
    const res = await IntelligenceOperationsService.addLibraryBook(testSchoolId, {
      title: 'Cambridge Checkpoint Lower Secondary Science',
      author: 'Peter Riley',
      isbn: '978-1444143805',
      category: 'Lower Secondary STEM',
      total_copies: 35,
      shelf_location: 'Science S-09'
    }, testUser);

    assert.strictEqual(res.success, true);
    assert.ok(res.book.id.startsWith('BK-'), 'Book ID must match BK prefix format');
    assert.strictEqual(res.book.available_copies, 35);
    createdBookId = res.book.id;
  });

  await it('OPS-004: Issues student book loan and decrements available copies', async () => {
    const loanRes = await IntelligenceOperationsService.issueBookLoan(testSchoolId, {
      bookId: createdBookId,
      borrowerName: 'Kwabena Duodu',
      borrowerRole: 'student',
      borrowerId: 'STU-P4-0012'
    }, testUser);

    assert.strictEqual(loanRes.success, true);
    assert.strictEqual(loanRes.loan.status, 'active');
    assert.strictEqual(loanRes.remainingAvailableCopies, 34);
    createdLoanId = loanRes.loan.id;
  });

  await it('OPS-005: Returns book loan and restores available library inventory', async () => {
    const retRes = await IntelligenceOperationsService.returnBookLoan(testSchoolId, createdLoanId, {
      condition: 'good'
    }, testUser);

    assert.strictEqual(retRes.success, true);
    assert.strictEqual(retRes.loan.status, 'returned');
    assert.strictEqual(retRes.availableCopies, 35);
  });

  // ------------------------------------------------------------------------
  // 4. CAMPUS TRANSPORT FLEET & GREATER ACCRA ROUTES
  // ------------------------------------------------------------------------
  await it('OPS-006: Manages bus fleet and creates scheduled Greater Accra GPS route', async () => {
    // 1. Add Bus
    const busRes = await IntelligenceOperationsService.addFleetVehicle(testSchoolId, {
      plate_number: 'GR-4820-26',
      model: 'Toyota HiAce (18 Seater)',
      capacity: 18,
      driver_name: 'Kwame Asante',
      driver_phone: '+233 24 771 9900'
    }, testUser);

    assert.strictEqual(busRes.success, true);
    assert.ok(busRes.vehicle.id.startsWith('BUS-'), 'Vehicle ID must match BUS prefix format');

    // 2. Add Route
    const routeRes = await IntelligenceOperationsService.createTransportRoute(testSchoolId, {
      name: 'Route D: Airport & Dzorwulu Express',
      assigned_bus_id: busRes.body?.vehicle?.id || busRes.vehicle.id,
      capacity: 18,
      stops: [
        { stop_name: 'Campus Gate', morning_pickup: '06:50', afternoon_dropoff: '15:45' },
        { stop_name: 'Dzorwulu Junction', morning_pickup: '07:15', afternoon_dropoff: '16:15' },
        { stop_name: 'Airport Hills Roundabout', morning_pickup: '07:40', afternoon_dropoff: '16:40' }
      ]
    }, testUser);

    assert.strictEqual(routeRes.success, true);
    assert.ok(routeRes.route.id.startsWith('RT-'), 'Route ID must match RT prefix format');
    createdRouteId = routeRes.route.id;
  });

  // ------------------------------------------------------------------------
  // 5. MULTI-CAMPUS GROUP OVERSIGHT (DEC-02)
  // ------------------------------------------------------------------------
  await it('GRP-001: Creates educational trust and returns consolidated multi-campus dashboard', async () => {
    const grpRes = await IntelligenceOperationsService.createGroup({
      name: 'Methodist Education Unit - Greater Accra Region',
      headquarters: 'Adabraka, Accra',
      trust_lead: 'Right Rev. Prof. Emmanuel Asante',
      schools: [
        {
          school_id: 'sch-meth-boys-01',
          name: 'Wesley Grammar Senior High',
          campus_type: 'Secondary Boarding',
          location: 'Dansoman, Accra',
          students_count: 1450,
          staff_count: 110,
          accreditation_status: 'verified'
        }
      ]
    }, testUser);

    assert.strictEqual(grpRes.success, true);
    assert.ok(grpRes.group.id.startsWith('GRP-'), 'Group ID must match GRP prefix format');
    createdGroupId = grpRes.group.id;

    // Dashboard rollup
    const dashRes = await IntelligenceOperationsService.getGroupDashboard(createdGroupId);
    assert.strictEqual(dashRes.success, true);
    assert.strictEqual(dashRes.group.totalEnrolledStudents, 1450);
  });

  await it('GRP-002: Links additional branch campus to educational trust', async () => {
    const linkRes = await IntelligenceOperationsService.linkSchoolToGroup(createdGroupId, {
      school_id: 'sch-meth-girls-02',
      name: 'Wesley Girls Preparatory School',
      campus_type: 'Primary & JHS Day',
      location: 'Kaneshie, Accra',
      students_count: 620,
      staff_count: 42
    }, testUser);

    assert.strictEqual(linkRes.success, true);

    // Verify updated group rollup
    const dashRes = await IntelligenceOperationsService.getGroupDashboard(createdGroupId);
    assert.strictEqual(dashRes.group.campusesCount, 2);
    assert.strictEqual(dashRes.group.totalEnrolledStudents, 2070);
  });

  // ------------------------------------------------------------------------
  // 6. OMNICHANNEL GHANA SMS GATEWAY
  // ------------------------------------------------------------------------
  await it('SMS-001: Dispatches parent SMS notice via Hubtel Ghana gateway and logs delivery', async () => {
    const smsRes = await IntelligenceOperationsService.dispatchSms(testSchoolId, {
      recipientPhone: '+233 24 555 1212',
      recipientName: 'Nana Kwame Duodu',
      message: 'Dear Parent, Cambridge Checkpoint Science textbook has been issued to Kwabena Duodu. Due date: 2026-11-15.'
    }, testUser);

    assert.strictEqual(smsRes.success, true);
    assert.strictEqual(smsRes.sms.delivery_status, 'delivered');
    assert.strictEqual(smsRes.sms.gateway_provider, 'Hubtel Ghana');

    const logsRes = await IntelligenceOperationsService.getSmsLogs(testSchoolId);
    assert.strictEqual(logsRes.success, true);
    assert.ok(logsRes.logs.length >= 2, 'SMS delivery log must reflect sent notices');
  });

  console.log('\n======================================================================');
  console.log(`📊 Phase 5 Verification Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error in Phase 5 test runner:', err);
  process.exit(1);
});
