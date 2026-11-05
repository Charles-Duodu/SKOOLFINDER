/**
 * Automated Verification Suite: Package D — Guest-First 4-School Deep Compare & Matchmaker Enhancements
 * ======================================================================================================
 * Baseline:
 *   - Public Website Master Guide v1.0 (Sections 2, 4, 7, 8, 10, 11)
 *   - Parents Blueprint v4.2
 *   - Education Regulatory Bodies Act, 2020 (Act 1023)
 * ======================================================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const schoolsRouter = require('../src/routes/schools');
const parentsRouter = require('../src/routes/parents');

function createMockRes() {
  let statusCode = 200;
  let responseData = null;
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    send(data) {
      responseData = data;
      return this;
    },
    getStatusCode() { return statusCode; },
    getData() { return responseData; }
  };
}

async function runPackageDTests() {
  console.log('========================================================================');
  console.log('🚀 RUNNING PACKAGE D: GUEST-FIRST 4-SCHOOL DEEP COMPARE & FIT MATCHMAKER');
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

  // Extract handlers from router stacks
  const compareHandler = schoolsRouter.stack.find(r => r.route && r.route.path === '/compare').route.stack[0].handle;
  const matchmakerHandler = schoolsRouter.stack.find(r => r.route && r.route.path === '/matchmaker').route.stack[0].handle;

  const postSavedCompHandler = parentsRouter.stack.find(r => r.route && r.route.path === '/saved-comparisons' && r.route.methods.post).route.stack.slice(-1)[0].handle;
  const getSavedCompHandler = parentsRouter.stack.find(r => r.route && r.route.path === '/saved-comparisons' && r.route.methods.get).route.stack.slice(-1)[0].handle;
  const deleteSavedCompHandler = parentsRouter.stack.find(r => r.route && r.route.path === '/saved-comparisons/:id' && r.route.methods.delete).route.stack.slice(-1)[0].handle;

  // --------------------------------------------------------------------------
  // TEST 1: GET /api/schools/compare Enriched Output
  // --------------------------------------------------------------------------
  await test('1. GET /api/schools/compare returns enriched comparison with verified fee breakdown and NaSIA regulatory status', async () => {
    const req = {
      query: { ids: 'ghana-international-school,sos-hermann-gmeiner-international-college' }
    };
    const res = createMockRes();
    await compareHandler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.count, 2);
    assert.strictEqual(data.maxAllowed, 4);

    const school1 = data.schools[0];
    assert.ok(school1.tuitionBase !== undefined, 'tuitionBase must be present');
    assert.ok(school1.busFee !== undefined, 'busFee must be present');
    assert.ok(school1.lunchFee !== undefined, 'lunchFee must be present');
    assert.ok(school1.boardingFee !== undefined, 'boardingFee must be present');
    assert.ok(school1.termlyEstimatedTotal !== undefined, 'termlyEstimatedTotal must be present');
    assert.strictEqual(school1.annualEstimatedTotal, school1.termlyEstimatedTotal * 3, 'annualEstimatedTotal must equal 3 terms');
    assert.ok(school1.nasia_license_number !== undefined, 'nasia_license_number must be present');
    assert.ok(school1.nasia_inspection_grade !== undefined, 'nasia_inspection_grade must be present');
  });

  // --------------------------------------------------------------------------
  // TEST 2: Hard Cap of 4 Schools
  // --------------------------------------------------------------------------
  await test('2. GET /api/schools/compare strictly enforces hard ceiling of 4 schools', async () => {
    const req = {
      query: { ids: 'sch-1,sch-2,sch-3,sch-4,sch-5,sch-6' }
    };
    const res = createMockRes();
    await compareHandler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.count, 4, 'Should be capped at 4 schools maximum');
    assert.strictEqual(data.schools.length, 4);
  });

  // --------------------------------------------------------------------------
  // TEST 3: POST /api/schools/matchmaker Explainable Algorithm
  // --------------------------------------------------------------------------
  await test('3. POST /api/schools/matchmaker scores institutions with explainable evidence and zero fabricated percentages', async () => {
    const req = {
      body: {
        level: 'Primary',
        region: 'Greater Accra',
        suburb: 'Cantonments',
        boarding: 'Day',
        curriculum: 'Cambridge',
        budgetTier: '5k-15k',
        priorities: ['stem', 'sports'],
        religion: 'Any',
        specialNeeds: 'Mild'
      }
    };
    const res = createMockRes();
    await matchmakerHandler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.matches), 'Matches must be an array');
    assert.ok(data.matches.length > 0, 'Matches must not be empty');

    const top = data.matches[0];
    assert.ok(top.school !== undefined, 'Match must contain school object');
    assert.ok(Array.isArray(top.matchedReasons), 'matchedReasons must be an array');
    assert.ok(top.matchedReasons.length > 0, 'Must have at least one transparent evidence reason');
    assert.strictEqual(top.acceptance_probability, undefined, 'Must not fabricate admission chances');
    assert.strictEqual(top.match_percentage, undefined, 'Must not fabricate arbitrary likelihood score');
  });

  // --------------------------------------------------------------------------
  // TEST 4: Parent Saved Comparisons CRUD
  // --------------------------------------------------------------------------
  await test('4. Parents Saved Comparisons endpoints allow authenticated parents to save, retrieve, and delete comparison sets', async () => {
    const testUserId = 'parent-user-test-pkg-d-' + Date.now();

    // 1. Save comparison
    const saveReq = {
      user: { id: testUserId },
      body: {
        title: 'Top 3 Accra Primary Schools',
        schoolIds: ['ghana-international-school', 'sos-hermann-gmeiner-international-college'],
        criteria: { level: 'Primary', region: 'Greater Accra' }
      }
    };
    const saveRes = createMockRes();
    await postSavedCompHandler(saveReq, saveRes);

    assert.strictEqual(saveRes.getStatusCode(), 201);
    const savedData = saveRes.getData();
    assert.strictEqual(savedData.success, true);
    const savedComp = savedData.comparison || savedData.savedComparison;
    assert.ok(savedComp && savedComp.id, 'Must return generated ID');
    const compId = savedComp.id;
    assert.strictEqual(savedComp.schoolIds.length, 2);

    // 2. Retrieve comparisons
    const listReq = { user: { id: testUserId } };
    const listRes = createMockRes();
    await getSavedCompHandler(listReq, listRes);

    assert.strictEqual(listRes.getStatusCode(), 200);
    const listData = listRes.getData();
    assert.strictEqual(listData.success, true);
    assert.strictEqual(listData.count, 1);
    assert.strictEqual(listData.comparisons[0].id, compId);

    // 3. Delete comparison
    const delReq = { user: { id: testUserId }, params: { id: compId } };
    const delRes = createMockRes();
    await deleteSavedCompHandler(delReq, delRes);

    assert.strictEqual(delRes.getStatusCode(), 200);
    const delData = delRes.getData();
    assert.strictEqual(delData.success, true);

    // 4. Verify list is now empty
    const listRes2 = createMockRes();
    await getSavedCompHandler(listReq, listRes2);
    assert.strictEqual(listRes2.getData().count, 0);
  });

  // --------------------------------------------------------------------------
  // TEST 5: State.js 4-School Cap & LocalStorage Persistence
  // --------------------------------------------------------------------------
  await test('5. State.js maintains max 4 comparison cap and browser local storage sync', async () => {
    const stateFile = fs.readFileSync(path.join(__dirname, '../public/js/state.js'), 'utf8');
    assert.ok(stateFile.includes('localStorage.getItem("skoolfinder_compare_list")') || stateFile.includes("localStorage.getItem('skoolfinder_compare_list')"), 'Must initialize from local storage');
    assert.ok(stateFile.includes('this.comparisonList.length >= 4'), 'Must enforce max 4 limit in toggleCompare');
    assert.ok(stateFile.includes('addMultipleToCompare'), 'Must implement addMultipleToCompare batch method');
    assert.ok(stateFile.includes('saveComparisonToStorage'), 'Must implement saveComparisonToStorage sync method');
  });

  // --------------------------------------------------------------------------
  // TEST 6: API.js Client Methods
  // --------------------------------------------------------------------------
  await test('6. API.js client module defines all comparison and matchmaker endpoints', async () => {
    const apiFile = fs.readFileSync(path.join(__dirname, '../public/js/api.js'), 'utf8');
    assert.ok(apiFile.includes('getSchoolComparison(schoolIds'), 'getSchoolComparison missing in API.js');
    assert.ok(apiFile.includes('getMatchmakerRecommendations(criteria'), 'getMatchmakerRecommendations missing in API.js');
    assert.ok(apiFile.includes('saveParentComparison(comparisonData'), 'saveParentComparison missing in API.js');
    assert.ok(apiFile.includes('getParentSavedComparisons('), 'getParentSavedComparisons missing in API.js');
    assert.ok(apiFile.includes('deleteParentSavedComparison(id'), 'deleteParentSavedComparison missing in API.js');
  });

  // --------------------------------------------------------------------------
  // TEST 7: CompareView 10 Institutional Dimensions & Sticky Headers
  // --------------------------------------------------------------------------
  await test('7. CompareView.js renders the full 10 institutional dimensions and sticky table headers', async () => {
    const compareFile = fs.readFileSync(path.join(__dirname, '../public/js/views/compareView.js'), 'utf8');
    assert.ok(compareFile.includes('1. Institutional Identity & Provenance'), 'Dimension 1 missing');
    assert.ok(compareFile.includes('2. NaSIA Regulatory Licensing & Legal Authority'), 'Dimension 2 missing');
    assert.ok(compareFile.includes('3. Academic Framework & Curricula'), 'Dimension 3 missing');
    assert.ok(compareFile.includes('4. Education Levels Offered'), 'Dimension 4 missing');
    assert.ok(compareFile.includes('5. Verified Fee Schedule Breakdown'), 'Dimension 5 missing');
    assert.ok(compareFile.includes('6. Campus Facilities & Infrastructure'), 'Dimension 6 missing');
    assert.ok(compareFile.includes('7. Student Care, Boarding & Ratios'), 'Dimension 7 missing');
    assert.ok(compareFile.includes('8. Extra-Curriculars, Ethos & SEN Support'), 'Dimension 8 missing');
    assert.ok(compareFile.includes('9. Admissions, Tour Availability & Direct Contact'), 'Dimension 9 missing');
    assert.ok(compareFile.includes('10. Community Trust & Verified Reviews'), 'Dimension 10 missing');
    assert.ok(compareFile.includes('position: sticky'), 'Sticky table header CSS missing');
    assert.ok(compareFile.includes('btn-toggle-diff-only'), 'Differences-only toggle missing');
    assert.ok(compareFile.includes('modal-guest-save-prompt'), 'Guest voluntary save modal missing');
    assert.ok(compareFile.includes('btn-matrix-book-tour'), 'Book Campus Tour CTA missing');
  });

  // --------------------------------------------------------------------------
  // TEST 8: MatchmakerView Extended Criteria & Batch Compare
  // --------------------------------------------------------------------------
  await test('8. MatchmakerView.js implements extended criteria (Ethos & SEN) and 1-Click Add Top 4', async () => {
    const matchmakerFile = fs.readFileSync(path.join(__dirname, '../public/js/views/matchmakerView.js'), 'utf8');
    assert.ok(matchmakerFile.includes('btn-match-add-all-compare'), '1-Click Add Top 4 button missing');
    assert.ok(matchmakerFile.includes('btn-match-save-plan'), 'Save Match Plan button missing');
    assert.ok(matchmakerFile.includes('btn-match-book-tour'), 'Direct campus tour booking CTA missing');
    assert.ok(matchmakerFile.includes('match-select-religion'), 'Ethos / religion dropdown missing');
    assert.ok(matchmakerFile.includes('match-select-sen'), 'SEN support dropdown missing');
    assert.ok(matchmakerFile.includes('modal-guest-save-match-plan'), 'Guest match plan modal missing');
  });

  // --------------------------------------------------------------------------
  // TEST 9: Cache Buster Increment
  // --------------------------------------------------------------------------
  await test('9. public/index.html incremented to v=72+ cache buster', async () => {
    const indexHtml = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    assert.ok(/\/js\/views\/compareView\.js\?v=7[2-9]/.test(indexHtml), 'compareView v=72+ missing in index.html');
    assert.ok(/\/js\/views\/matchmakerView\.js\?v=7[2-9]/.test(indexHtml), 'matchmakerView v=72+ missing in index.html');
  });

  console.log('\n========================================================================');
  console.log(`🎉 ALL ${passed}/${total} PACKAGE D TESTS PASSED WITH ZERO REGRESSIONS!`);
  console.log('========================================================================\n');
}

runPackageDTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
