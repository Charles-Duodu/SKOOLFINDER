/**
 * SkoolFinder Ghana — Release 0 Verification Test Suite
 * Tests Security Hardening (CR-01), Data Persistence (DEC-026), and Gate G4 Safeguarding
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');

const adminRouter = require('../src/routes/admin');
const parentsRouter = require('../src/routes/parents');
const teachersRouter = require('../src/routes/teachers');
const jobsRouter = require('../src/routes/jobs');
const { JWT_SECRET } = require('../src/middleware/auth');

const app = express();
app.use(express.json());

app.use('/api/admin', adminRouter);
app.use('/api/parents', parentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/jobs', jobsRouter);

let server;
const PORT = 3288;
const BASE_URL = `http://127.0.0.1:${PORT}`;

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✕ [FAIL] ${testName}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('\n🚀 Starting SkoolFinder Ghana — Release 0 Verification Suite...\n');

  await new Promise(resolve => {
    server = app.listen(PORT, resolve);
  });

  try {
    // -------------------------------------------------------------
    // 1. CR-01 Admin Guard Hardening
    // -------------------------------------------------------------
    console.log('--- 1. CR-01 Admin Guard Hardening ---');

    // 1a. Unauthenticated request without Authorization header -> 401
    const resNoToken = await fetch(`${BASE_URL}/api/admin/overview`);
    assert(resNoToken.status === 401, 'Rejects unauthenticated request without token with 401 Unauthorized');

    // 1b. Non-admin token -> 403
    const parentToken = jwt.sign({ id: '00000000-0000-0000-0000-000000000002', email: 'parent@gmail.com', role: 'parent' }, JWT_SECRET);
    const resForbidden = await fetch(`${BASE_URL}/api/admin/overview`, {
      headers: { Authorization: `Bearer ${parentToken}` }
    });
    assert(resForbidden.status === 403, 'Rejects parent role with 403 Forbidden');

    // 1c. Super admin token -> 200
    const superAdminToken = jwt.sign({ id: '00000000-0000-0000-0000-000000000001', email: 'admin@skoolfinder.com.gh', role: 'super_admin' }, JWT_SECRET);
    const resSuperAdmin = await fetch(`${BASE_URL}/api/admin/overview`, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    assert(resSuperAdmin.status === 200, 'Accepts super_admin token with 200 OK');

    // -------------------------------------------------------------
    // 2. Parent Wards Dual-Storage Persistence (DEC-026)
    // -------------------------------------------------------------
    console.log('\n--- 2. Parent Wards Dual-Storage Persistence ---');

    const testParentId = '11111111-2222-3333-4444-555555555555';
    const testParentToken = jwt.sign({ id: testParentId, email: 'parent.test@gmail.com', role: 'parent' }, JWT_SECRET);

    // 2a. Add Ward
    const addWardRes = await fetch(`${BASE_URL}/api/parents/wards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testParentToken}`
      },
      body: JSON.stringify({
        studentName: 'Kofi Mensah',
        gradeLevel: 'Class 4',
        schoolName: 'Ridge Church School'
      })
    });
    const addWardData = await addWardRes.json();
    assert(addWardRes.status === 201 && addWardData.success === true, 'POST /api/parents/wards returns 201 with created ward');
    assert(addWardData.ward && addWardData.ward.name.includes('Kofi'), 'Created ward preserves student name');

    // 2b. Retrieve Wards via GET /api/parents/wards
    const getWardsRes = await fetch(`${BASE_URL}/api/parents/wards`, {
      headers: { Authorization: `Bearer ${testParentToken}` }
    });
    const getWardsData = await getWardsRes.json();
    assert(getWardsRes.status === 200 && Array.isArray(getWardsData.wards), 'GET /api/parents/wards returns 200 array');
    assert(getWardsData.wards.some(w => w.name.includes('Kofi')), 'GET /api/parents/wards includes newly added ward');

    // 2c. Overview includes linked wards
    const getOverviewRes = await fetch(`${BASE_URL}/api/parents/overview`, {
      headers: { Authorization: `Bearer ${testParentToken}` }
    });
    const overviewData = await getOverviewRes.json();
    assert(getOverviewRes.status === 200 && Array.isArray(overviewData.linkedWards), 'GET /api/parents/overview includes linkedWards');
    assert(overviewData.metrics.wardsCount >= 1, 'Parent metrics reflects linked wards count');

    // -------------------------------------------------------------
    // 3. Saved 4-School Comparisons Persistence
    // -------------------------------------------------------------
    console.log('\n--- 3. Saved 4-School Comparisons Persistence ---');

    // 3a. Save Comparison
    const saveCompRes = await fetch(`${BASE_URL}/api/parents/saved-comparisons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testParentToken}`
      },
      body: JSON.stringify({
        title: 'Top Cambridge Schools Accra',
        schoolIds: ['sch-01', 'sch-02', 'sch-03']
      })
    });
    const saveCompData = await saveCompRes.json();
    assert(saveCompRes.status === 201 && saveCompData.success === true, 'POST /api/parents/saved-comparisons returns 201');
    const createdCompId = saveCompData.comparison?.id;

    // 3b. Retrieve Comparisons
    const getCompsRes = await fetch(`${BASE_URL}/api/parents/saved-comparisons`, {
      headers: { Authorization: `Bearer ${testParentToken}` }
    });
    const getCompsData = await getCompsRes.json();
    assert(getCompsRes.status === 200 && Array.isArray(getCompsData.comparisons), 'GET /api/parents/saved-comparisons returns 200 array');
    assert(getCompsData.comparisons.some(c => c.id === createdCompId), 'Saved comparisons contains newly created comparison set');

    // 3c. Delete Comparison
    const delCompRes = await fetch(`${BASE_URL}/api/parents/saved-comparisons/${createdCompId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${testParentToken}` }
    });
    const delCompData = await delCompRes.json();
    assert(delCompRes.status === 200 && delCompData.success === true, 'DELETE /api/parents/saved-comparisons/:id returns 200 success');

    // -------------------------------------------------------------
    // 4. Gate G4 Adult-to-Adult Consultation Safeguarding
    // -------------------------------------------------------------
    console.log('\n--- 4. Gate G4 Adult-to-Adult Tutoring Safeguarding ---');

    const bookRes = await fetch(`${BASE_URL}/api/teachers/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parentName: 'Mrs. Janet Osei',
        phone: '+233 24 555 7788',
        email: 'janet.osei@gmail.com',
        studentName: 'Yaw Osei',
        gradeLevel: 'Class 5',
        subject: 'Mathematics & Coding',
        sessionType: 'In-Person (Home)'
      })
    });
    const bookData = await bookRes.json();
    assert(bookRes.status === 201 && bookData.success === true, 'POST /api/teachers/book creates consultation request');
    assert(bookData.contractType === 'adult_to_adult_consultation', 'Enforces adult_to_adult_consultation contract type');
    assert(bookData.gateG4SafeguardingNotice && bookData.gateG4SafeguardingNotice.includes('Gate G4'), 'Includes explicit Gate G4 Safeguarding Notice');

    console.log('\n========================================');
    console.log(`Release 0 Verification Results: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('========================================\n');

  } catch (err) {
    console.error('Fatal test error:', err);
    failedTests++;
  } finally {
    if (server) server.close();
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

runTests();

