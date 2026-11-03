/**
 * Automated Verification: Blueprint v4.2 Phase 6
 * Decisions & Applications Tracking Pipeline
 */
const assert = require('assert');
const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/middleware/auth');

async function runPhase6Tests() {
  console.log('🚀 Starting Blueprint v4.2 Phase 6 Verification Suite...\n');
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

  async function testAsync(name, fn) {
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

  // 1. Static Verification
  test('Admissions route implements complete applications lifecycle endpoints', () => {
    const admContent = fs.readFileSync(path.resolve('src/routes/admissions.js'), 'utf8');
    assert.ok(admContent.includes("router.post('/apply'"), 'Must implement POST /apply');
    assert.ok(admContent.includes("['/applications', '/']") || admContent.includes("router.get('/applications'"), 'Must implement GET /applications');
    assert.ok(admContent.includes("['/applications/:id', '/:id']") || admContent.includes("router.get('/applications/:id'"), 'Must implement GET /applications/:id');
    assert.ok(admContent.includes("router.patch('/applications/:id/status'"), 'Must implement PATCH /applications/:id/status');
    assert.ok(admContent.includes("router.get('/applications/:id/offer-letter'"), 'Must implement GET /applications/:id/offer-letter');
  });

  test('Parents overview route returns applications array', () => {
    const parentsContent = fs.readFileSync(path.resolve('src/routes/parents.js'), 'utf8');
    assert.ok(parentsContent.includes('applications: enquiries.map'), 'Must return applications array in overview');
  });

  test('Modals source implements Theme B styling in openOnlineAdmissionModal', () => {
    const modalsContent = fs.readFileSync(path.resolve('public/js/components/modals.js'), 'utf8');
    assert.ok(modalsContent.includes('Blueprint v4.2 &bull; Unified Digital Admissions') || modalsContent.includes('Unified Digital Admissions'), 'Modal header must reflect Blueprint v4.2');
    assert.ok(modalsContent.includes('#0A2046') && modalsContent.includes('#1266C4'), 'Modal header must use Theme B Navy and Blue gradient');
    assert.ok(modalsContent.includes('#D5A63B'), 'Modal header must use Theme B Gold accent');
    assert.ok(modalsContent.includes('app-parent-name'), 'Must include parent name field');
    assert.ok(modalsContent.includes('app-parent-phone'), 'Must include phone field');
  });

  test('Modals source auto-syncs shortlist stage to applied on application submission', () => {
    const modalsContent = fs.readFileSync(path.resolve('public/js/components/modals.js'), 'utf8');
    assert.ok(modalsContent.includes('API.updateParentShortlist'), 'Must call updateParentShortlist');
    assert.ok(modalsContent.includes("stage: 'applied'"), "Must set shortlist stage to 'applied'");
  });

  test('ParentPortalView implements 5-stage lifecycle status badges in getStatusBadge', () => {
    const viewContent = fs.readFileSync(path.resolve('public/js/views/parentPortalView.js'), 'utf8');
    assert.ok(viewContent.includes('Offer Extended / Admitted') || viewContent.includes('Admitted'), 'Must support Offer Extended/Admitted badge');
    assert.ok(viewContent.includes('Entrance Exam Scheduled'), 'Must support Entrance Exam Scheduled badge');
    assert.ok(viewContent.includes('Waitlisted'), 'Must support Waitlisted badge');
    assert.ok(viewContent.includes('Under Official Review') || viewContent.includes('Under Review'), 'Must support Under Review badge');
    assert.ok(viewContent.includes('Application Declined') || viewContent.includes('Declined'), 'Must support Declined badge');
  });

  // 2. Integration / Dynamic Route Tests
  const app = express();
  app.use(cors());
  app.use(express.json());

  const admissionsRouter = require('../src/routes/admissions');
  const parentsRouter = require('../src/routes/parents');
  app.use('/api/admissions', admissionsRouter);
  app.use('/api/parents', parentsRouter);

  const server = http.createServer(app);
  const TEST_PORT = 4922;

  await new Promise((resolve) => {
    server.listen(TEST_PORT, '127.0.0.1', () => {
      console.log(`  📡 Test server listening on 127.0.0.1:${TEST_PORT}\n`);
      resolve();
    });
  });

  const baseUrl = `http://127.0.0.1:${TEST_PORT}/api`;

  try {
    let createdAppNumber = null;

    await testAsync('POST /api/admissions/apply registers candidate and returns application payload', async () => {
      const payload = {
        schoolId: 'sch-gis-accra',
        schoolName: 'Ghana International School (GIS)',
        studentName: 'Esi Mansah Duodu',
        childFirstName: 'Esi Mansah',
        childLastName: 'Duodu',
        gradeApplying: 'Class 4',
        termApplied: 'Term 1 (September 2026)',
        parentName: 'Nana Kwame Duodu',
        parentPhone: '+233 24 555 7890',
        parentWhatsapp: '+233 24 555 7890',
        parentEmail: 'kwame.duodu@test.com',
        previousSchool: 'Little Explorers Preschool',
        dateOfBirth: '2016-08-14',
        gender: 'Female'
      };

      const res = await fetch(`${baseUrl}/admissions/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.strictEqual(res.status, 201, `Expected 201 Created, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.applicationNumber, 'Must return application tracking number');
      assert.ok(data.application, 'Must return application object');
      assert.strictEqual(data.application.student.fullName, 'Esi Mansah Duodu');
      assert.strictEqual(data.application.gradeApplying, 'Class 4');
      assert.strictEqual(data.application.schoolName, 'Ghana International School (GIS)');
      createdAppNumber = data.applicationNumber;
    });

    await testAsync('GET /api/admissions/applications lists active applications', async () => {
      const res = await fetch(`${baseUrl}/admissions/applications`);
      assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
      const list = await res.json();
      assert.ok(Array.isArray(list), 'Response must be an array');
      const found = list.find(a => a.applicationNumber === createdAppNumber);
      assert.ok(found, `Created application ${createdAppNumber} must be present in applications list`);
    });

    await testAsync('GET /api/admissions/applications/:id retrieves candidate dossier', async () => {
      const res = await fetch(`${baseUrl}/admissions/applications/${encodeURIComponent(createdAppNumber)}`);
      assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
      const appRecord = await res.json();
      assert.strictEqual(appRecord.applicationNumber, createdAppNumber);
      assert.strictEqual(appRecord.student.fullName, 'Esi Mansah Duodu');
      assert.strictEqual(appRecord.parentGuardian.primaryGuardianName, 'Nana Kwame Duodu');
    });

    await testAsync('PATCH /api/admissions/applications/:id/status updates status and assessment pass', async () => {
      const res = await fetch(`${baseUrl}/admissions/applications/${encodeURIComponent(createdAppNumber)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Entrance Exam Scheduled',
          assessmentDate: 'Saturday, 22 November 2026',
          assessmentTime: '08:30 AM',
          assessmentLocation: 'Junior Secondary Block A'
        })
      });

      assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
      const result = await res.json();
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.application.status, 'Entrance Exam Scheduled');
      assert.strictEqual(result.application.assessment.date, 'Saturday, 22 November 2026');
    });

    await testAsync('GET /api/admissions/applications/:id/offer-letter generates digital offer letter', async () => {
      const res = await fetch(`${baseUrl}/admissions/applications/${encodeURIComponent(createdAppNumber)}/offer-letter`);
      assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.offerLetter, 'Response must contain offerLetter');
      assert.ok(data.offerLetter.referenceNumber.startsWith('OFFER-'), 'Offer reference must start with OFFER-');
      assert.strictEqual(data.offerLetter.studentName, 'Esi Mansah Duodu');
    });

    await testAsync('GET /api/parents/overview returns applications list for logged-in parent', async () => {
      const mockParentId = '11111111-2222-3333-4444-555555555555';
      const token = jwt.sign(
        { id: mockParentId, email: 'kwame.duodu@test.com', role: 'parent' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      const res = await fetch(`${baseUrl}/parents/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
      const overview = await res.json();
      assert.strictEqual(overview.success, true);
      assert.ok(Array.isArray(overview.applications), 'overview.applications must be an array');
      assert.ok(Array.isArray(overview.recentApplications), 'overview.recentApplications must be an array');
    });

  } finally {
    server.close();
  }

  console.log(`\n========================================`);
  console.log(`🎉 Phase 6 Verification Complete: ${passed}/${total} checks passed!`);
  console.log(`========================================\n`);
}

runPhase6Tests().catch((err) => {
  console.error('\n❌ Phase 6 verification suite failed:', err);
  process.exit(1);
});
