/**
 * SkoolFinder Ghana — Release 6 Verification Test Suite
 * Tests Modular Super Admin Cockpit, National Registries & Final Platform Launch (Milestone M12)
 * Baseline: Blueprint v2.0 §14, §15, §16, §24, §26; DEC-003, DEC-014, DEC-023
 * Covers:
 *   - 8-Domain Super Admin Cockpit Telemetry Desk
 *   - National Teaching Council (NTC) Automated Verification & Webhook Sync
 *   - National Identification Authority (NIA) Ghana Card Validation & Webhook Sync
 *   - Cross-Portal Unified Architecture End-to-End Verification
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');

const adminRouter = require('../src/routes/admin');
const regulatoryRouter = require('../src/routes/regulatory');
const authRouter = require('../src/routes/auth');
const teachersRouter = require('../src/routes/teachers');
const parentsRouter = require('../src/routes/parents');
const paymentsRouter = require('../src/routes/payments');
const { JWT_SECRET } = require('../src/middleware/auth');

const app = express();
app.use(express.json());

app.use('/api/admin', adminRouter);
app.use('/api/regulatory', regulatoryRouter);
app.use('/api/auth', authRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/parents', parentsRouter);
app.use('/api/payments', paymentsRouter);

let server;
const PORT = 3491;
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
  console.log('\n🚀 Starting SkoolFinder Ghana — Release 6 Cockpit & Final Launch Test Suite...\n');

  await new Promise(resolve => {
    server = app.listen(PORT, resolve);
  });

  try {
    const testAdminId = '99999999-0000-1111-2222-333333333333';
    const testEducatorId = '77777777-8888-9999-aaaa-bbbbbbbbbbbb';

    const adminToken = jwt.sign({
      id: testAdminId,
      email: 'superadmin@skoolfinder.com.gh',
      role: 'super_admin',
      name: 'Super Admin Officer',
      full_name: 'Super Admin Officer'
    }, JWT_SECRET, { expiresIn: '1h' });

    // ========================================================================
    // 1. 8-DOMAIN SUPER ADMIN COCKPIT TELEMETRY (M12)
    // ========================================================================
    console.log('\n--- Section 1: 8-Domain Super Admin Cockpit Telemetry Desk ---');

    const telemetryRes = await fetch(`${BASE_URL}/api/admin/telemetry`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const telemetryData = await telemetryRes.json();
    assert(telemetryRes.status === 200, 'GET /api/admin/telemetry returns 200 OK');
    assert(telemetryData.success === true, 'Telemetry response reports success: true');
    assert(telemetryData.telemetry.systemHealth === 'operational', 'System health is reported as operational');

    const domains = telemetryData.telemetry.domains;
    assert(!!domains.schools, 'Domain 1: Schools telemetry present');
    assert(!!domains.users, 'Domain 2: Users multi-persona telemetry present');
    assert(!!domains.professionals, 'Domain 3: Education Professionals 5D vetting telemetry present');
    assert(!!domains.tutoringEscrow, 'Domain 4: Tutoring Escrow settlement telemetry present');
    assert(!!domains.procurement, 'Domain 5: Procurement B2B RFQ telemetry present');
    assert(!!domains.admissions, 'Domain 6: Admissions & Digital Vouchers telemetry present');
    assert(!!domains.webhooks, 'Domain 7: Webhooks & Circuit Breakers telemetry present');
    assert(!!domains.sms, 'Domain 8: Hubtel SMS delivery telemetry present');

    // ========================================================================
    // 2. NATIONAL TEACHING COUNCIL (NTC) INTEGRATION & WEBHOOK
    // ========================================================================
    console.log('\n--- Section 2: National Teaching Council (NTC) Automated Verification & Webhook ---');

    // Valid standard NTC licence verification
    const ntcVerifyRes = await fetch(`${BASE_URL}/api/regulatory/ntc/verify-licence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ntcNumber: 'NTC/TL/718293',
        educatorName: 'Emmanuel Kwame Boateng'
      })
    });
    const ntcVerify = await ntcVerifyRes.json();
    assert(ntcVerifyRes.status === 200, 'POST /api/regulatory/ntc/verify-licence returns 200');
    assert(ntcVerify.verified === true, 'NTC licence verified as authentic');
    assert(ntcVerify.licenceStatus === 'active', 'Licence status confirmed active');
    assert(ntcVerify.regulatoryAct.includes('Act 1023'), 'Cites Education Regulatory Bodies Act, 2020 (Act 1023)');

    // Provisional NTC licence verification
    const ntcProvRes = await fetch(`${BASE_URL}/api/regulatory/ntc/verify-licence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ntcNumber: 'NTC/PL/104928',
        educatorName: 'Grace Osei-Tutu'
      })
    });
    const ntcProv = await ntcProvRes.json();
    assert(ntcProv.licenceClass === 'Provisional Licence', 'Identifies Provisional Licence classification');

    // Rejection of invalid NTC format
    const ntcInvalidRes = await fetch(`${BASE_URL}/api/regulatory/ntc/verify-licence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ntcNumber: 'INVALID_NTC_CODE' })
    });
    assert(ntcInvalidRes.status === 400, 'Invalid NTC licence format rejected with 400 Bad Request');

    // NTC Webhook Receiver
    const ntcWebhookRes = await fetch(`${BASE_URL}/api/regulatory/ntc/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'licence.status_changed',
        ntcNumber: 'NTC/TL/718293',
        licenceStatus: 'active',
        professionalId: testEducatorId
      })
    });
    const ntcWebhook = await ntcWebhookRes.json();
    assert(ntcWebhookRes.status === 200, 'POST /api/regulatory/ntc/webhook returns 200');
    assert(ntcWebhook.received === true, 'NTC webhook confirms receipt and processing');

    // ========================================================================
    // 3. NATIONAL IDENTIFICATION AUTHORITY (NIA) GHANA CARD INTEGRATION & WEBHOOK
    // ========================================================================
    console.log('\n--- Section 3: National Identification Authority (NIA) Ghana Card Integration & Webhook ---');

    // Valid Ghana Card PIN validation (Act 1023 format)
    const niaVerifyRes = await fetch(`${BASE_URL}/api/regulatory/nia/verify-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: 'GHA-718293847-1',
        fullName: 'Dr. Araba Mensah'
      })
    });
    const niaVerify = await niaVerifyRes.json();
    assert(niaVerifyRes.status === 200, 'POST /api/regulatory/nia/verify-pin returns 200');
    assert(niaVerify.verified === true, 'Ghana Card PIN verified under Act 750 / Act 1023');
    assert(niaVerify.status === 'valid', 'Ghana Card status is valid');
    assert(niaVerify.authority.includes('National Identification Authority'), 'Confirmed by National Identification Authority (NIA)');

    // Rejection of invalid Ghana Card format
    const niaInvalidRes = await fetch(`${BASE_URL}/api/regulatory/nia/verify-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: 'INVALID-PIN-123' })
    });
    assert(niaInvalidRes.status === 400, 'Invalid Ghana Card PIN rejected with 400 Bad Request');

    // NIA Webhook Receiver
    const niaWebhookRes = await fetch(`${BASE_URL}/api/regulatory/nia/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'id.verified',
        pin: 'GHA-718293847-1',
        status: 'valid',
        professionalId: testEducatorId
      })
    });
    const niaWebhook = await niaWebhookRes.json();
    assert(niaWebhookRes.status === 200, 'POST /api/regulatory/nia/webhook returns 200');
    assert(niaWebhook.received === true, 'NIA webhook confirms receipt and processing');

    // ========================================================================
    // 4. CROSS-PORTAL UNIFIED ARCHITECTURE RECONCILIATION
    // ========================================================================
    console.log('\n--- Section 4: Cross-Portal Unified Architecture End-to-End ---');

    // Test Persona Switching on Unified Auth
    const loginRes = await fetch(`${BASE_URL}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'proprietor@gis.edu.gh' })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Unified login issues JWT session');

    const switchRes = await fetch(`${BASE_URL}/api/auth/switch-persona`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.token}`
      },
      body: JSON.stringify({ targetPersona: 'teacher' })
    });
    const switchData = await switchRes.json();
    assert(switchRes.status === 200, 'Persona switches seamlessly to educator');
    assert(switchData.activePersona === 'teacher', 'Active persona confirmed as teacher');

    // Verify Gate G4 child safeguarding is permanently locked
    const g4CheckRes = await fetch(`${BASE_URL}/api/teachers/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacherId: 'tch-01',
        studentName: 'Minor',
        guardianAffirmation: false
      })
    });
    assert(g4CheckRes.status === 403, 'Gate G4 child safeguarding permanently enforced (403)');

    // ========================================================================
    // TEST SUMMARY
    // ========================================================================
    console.log('\n======================================================');
    console.log(`RELEASE 6 TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('======================================================\n');

    if (failedTests > 0) {
      process.exit(1);
    }

  } catch (err) {
    console.error('Test run failed with error:', err);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
  }
}

runTests();
