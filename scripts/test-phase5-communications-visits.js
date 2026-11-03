/**
 * Automated Verification: Blueprint v4.2 Phase 5
 * Direct School Communications & Campus Visit Booking
 */
const assert = require('assert');
const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/middleware/auth');

async function runPhase5Tests() {
  console.log('🚀 Starting Blueprint v4.2 Phase 5 Verification Suite...\n');
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

  // 1. Static Verification: Modals & Theme B Inquiry Form
  test('Modals source implements Theme B styling in openInquireAdmissionModal', () => {
    const modalsContent = fs.readFileSync(path.resolve('public/js/components/modals.js'), 'utf8');
    assert.ok(modalsContent.includes('Blueprint v4.2 &bull; Direct Admissions Desk Communication') || modalsContent.includes('Blueprint v4.2 • Direct Admissions Desk Communication'), 'Modal header must reflect Blueprint v4.2');
    assert.ok(modalsContent.includes('#0A2046') && modalsContent.includes('#1266C4'), 'Modal header must use Theme B Navy and Blue gradient');
    assert.ok(modalsContent.includes('#D5A63B'), 'Modal header must use Theme B Gold accent');
    assert.ok(modalsContent.includes('inq-parent-name'), 'Must include parent name field');
    assert.ok(modalsContent.includes('inq-parent-phone'), 'Must include phone field');
    assert.ok(modalsContent.includes('inq-tour-date'), 'Must include campus tour date field');
    assert.ok(modalsContent.includes('inq-tour-time'), 'Must include campus tour time slot field');
  });

  test('Modals source pre-fills authenticated user profile details', () => {
    const modalsContent = fs.readFileSync(path.resolve('public/js/components/modals.js'), 'utf8');
    assert.ok(modalsContent.includes('State.currentUser?.name') || modalsContent.includes('State.currentUser?.fullName'), 'Must prefill parent name');
    assert.ok(modalsContent.includes('State.currentUser?.phone'), 'Must prefill parent phone');
    assert.ok(modalsContent.includes('State.currentUser?.email'), 'Must prefill parent email');
  });

  test('Modals inquiry submission auto-syncs shortlist stage to visit_planned or interested', () => {
    const modalsContent = fs.readFileSync(path.resolve('public/js/components/modals.js'), 'utf8');
    assert.ok(modalsContent.includes('API.updateParentShortlist'), 'Must call updateParentShortlist on inquiry submission');
    assert.ok(modalsContent.includes("tourRequested ? 'visit_planned' : 'interested'"), 'Must auto-transition to visit_planned if tour is requested');
  });

  test('ParentPortalView renders interactive inquiry message cards and thread trigger', () => {
    const viewContent = fs.readFileSync(path.resolve('public/js/views/parentPortalView.js'), 'utf8');
    assert.ok(viewContent.includes('renderInquiriesTab'), 'Must implement renderInquiriesTab');
    assert.ok(viewContent.includes('btn-open-inquiry-thread'), 'Must render inquiry thread trigger button');
    assert.ok(viewContent.includes('Direct Admissions Messaging &amp; Campus Tours') || viewContent.includes('Direct Admissions Messaging'), 'Must render inquiries overview header');
    assert.ok(viewContent.includes('Modals.openInquiryThreadModal'), 'Must wire click event to openInquiryThreadModal');
  });

  test('API client exposes getInquiryById, replyInquiry/replyToInquiry, and submitInquiry', () => {
    const apiContent = fs.readFileSync(path.resolve('public/js/api.js'), 'utf8');
    assert.ok(apiContent.includes('async getInquiryById('), 'API must expose getInquiryById');
    assert.ok(apiContent.includes('async replyInquiry(') || apiContent.includes('async replyToInquiry('), 'API must expose reply method');
    assert.ok(apiContent.includes('async submitInquiry('), 'API must expose submitInquiry');
  });

  // 2. Integration / Dynamic Route Tests
  const app = express();
  app.use(cors());
  app.use(express.json());

  const inquiriesRouter = require('../src/routes/inquiries');
  const parentsRouter = require('../src/routes/parents');
  app.use('/api/inquiries', inquiriesRouter);
  app.use('/api/parents', parentsRouter);

  const server = http.createServer(app);
  const TEST_PORT = 4921;

  await new Promise((resolve) => {
    server.listen(TEST_PORT, '127.0.0.1', () => {
      console.log(`  📡 Test server listening on 127.0.0.1:${TEST_PORT}\n`);
      resolve();
    });
  });

  const baseUrl = `http://127.0.0.1:${TEST_PORT}/api`;

  try {
    let createdInqRef = null;

    await testAsync('POST /api/inquiries creates verified admission & campus tour inquiry', async () => {
      const payload = {
        schoolId: 'sch-gis-accra',
        parentName: 'Nana Kwame Duodu',
        parentPhone: '+233 24 555 7890',
        parentWhatsapp: '+233 24 555 7890',
        parentEmail: 'kwame.duodu@test.com',
        studentName: 'Yaw Duodu',
        gradeApplying: 'Grade 7 / JHS 1',
        category: 'Campus Tour & Admissions',
        tourRequested: true,
        preferredTourDate: '2026-11-20',
        preferredTourTime: 'Morning Session (10:00 AM)',
        subject: 'Campus Walkthrough & Admissions Screening',
        message: 'We would like to inspect the science laboratories and sports complex ahead of JHS 1 enrollment.'
      };

      const res = await fetch(`${baseUrl}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.strictEqual(res.status, 201, `Expected 201 Created, got ${res.status}`);
      const data = await res.json();
      const inq = data.inquiry || data;
      assert.ok(inq.inquiryNumber || inq.referenceNumber, 'Response must return inquiry tracking code');
      assert.ok(inq.schoolName, 'Response must include school name');
      assert.strictEqual(inq.tourRequested, true);
      assert.strictEqual(inq.preferredTourDate, '2026-11-20');
      createdInqRef = inq.inquiryNumber || inq.referenceNumber;
    });

    await testAsync('GET /api/inquiries/:refOrId retrieves inquiry details and response thread', async () => {
      const ref = createdInqRef || 'SF-INQ-001';
      const res = await fetch(`${baseUrl}/inquiries/${encodeURIComponent(ref)}`);
      assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.inquiryNumber || data.referenceNumber, 'Must return inquiry number');
      assert.ok(Array.isArray(data.replies), 'Must return replies array');
      assert.ok(data.replies.length >= 1, 'Should include official admissions welcome message');
      assert.strictEqual(data.replies[0].sender, 'school');
    });

    await testAsync('POST /api/inquiries/:id/reply posts official reply and updates thread status', async () => {
      const ref = createdInqRef || 'SF-INQ-001';
      const replyPayload = {
        sender: 'school',
        senderName: 'Sister Mary Mensah',
        senderRole: 'Admissions Dean',
        message: 'Your campus tour date has been confirmed. Please check in with the security desk upon arrival.',
        newStatus: 'Tour Scheduled'
      };

      const res = await fetch(`${baseUrl}/inquiries/${encodeURIComponent(ref)}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replyPayload)
      });

      assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.inquiry, 'Must return updated inquiry payload');
      assert.strictEqual(data.inquiry.status, 'Tour Scheduled');
      assert.strictEqual(data.inquiry.replies[0].senderName, 'Sister Mary Mensah');
    });

    await testAsync('GET /api/inquiries/lookup/:refOrId tracking endpoint resolves inquiry', async () => {
      const ref = createdInqRef || 'SF-INQ-001';
      const res = await fetch(`${baseUrl}/inquiries/lookup/${encodeURIComponent(ref)}`);
      assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.inquiryNumber || data.id, 'Must return tracking data');
      assert.ok(data.schoolName, 'Must return school name');
    });

    await testAsync('Parent shortlist sync allows setting stage to visit_planned', async () => {
      const mockParentId = '11111111-2222-3333-4444-555555555555';
      const token = jwt.sign(
        { id: mockParentId, email: 'kwame.duodu@test.com', role: 'parent' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      const res = await fetch(`${baseUrl}/parents/shortlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          schoolId: 'sch-gis-accra',
          stage: 'visit_planned',
          notes: 'Campus tour requested for 2026-11-20'
        })
      });

      assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.item.stage, 'visit_planned');
    });

  } finally {
    server.close();
  }

  console.log(`\n========================================`);
  console.log(`🎉 Phase 5 Verification Complete: ${passed}/${total} checks passed!`);
  console.log(`========================================\n`);
}

runPhase5Tests().catch((err) => {
  console.error('\n❌ Phase 5 verification suite failed:', err);
  process.exit(1);
});
