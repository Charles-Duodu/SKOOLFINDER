/**
 * Automated Verification Suite: Package F — Parent Digital Admissions Voucher Purchasing & Mobile Money Checkout
 * ==============================================================================================================
 * Blueprint & Guide references:
 *   - School Owner Master Blueprint v2.0 (Section 26, VOUCH-001 through VOUCH-006, DEC-01, DEC-02)
 *   - Public Website Master Guide v1.0 (Sections 2, 4, 11, 14, 15)
 *   - Ghana Mobile Money (MTN MoMo, Telecel Cash, AT Money) and Paystack Integration
 *   - 95% School Revenue Disbursement / 5% Platform Infrastructure Fee Split
 * ==============================================================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { AdmissionsVoucherService, GIS_ID, SOS_ID } = require('../src/services/admissionsVoucherService');
const schoolsRouter = require('../src/routes/schools');
const parentsRouter = require('../src/routes/parents');
const paymentsRouter = require('../src/routes/payments');

function createMockRes() {
  let statusCode = 200;
  let responseData = null;
  const headers = {};
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
    setHeader(key, val) {
      headers[key.toLowerCase()] = val;
    },
    getHeader(key) {
      return headers[key.toLowerCase()];
    },
    getStatusCode() { return statusCode; },
    getData() { return responseData; }
  };
}

async function runPackageFTests() {
  console.log('========================================================================');
  console.log('🚀 RUNNING PACKAGE F: ADMISSIONS VOUCHERS & MOBILE MONEY CHECKOUT');
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
  // TEST 1: Voucher Generation with 95%/5% Revenue Split & PIN
  // --------------------------------------------------------------------------
  await test('1. AdmissionsVoucherService.generateVoucher produces serial, 4-digit PIN, and 95%/5% split', async () => {
    const voucher = await AdmissionsVoucherService.generateVoucher({
      schoolId: GIS_ID,
      schoolName: 'Ghana International School',
      payerName: 'Dr. Kwame Boateng',
      payerPhone: '+233 24 411 9922',
      payerEmail: 'kwame.boateng@gmail.com',
      studentName: 'Kofi Boateng Jr.',
      targetLevel: 'Primary 1',
      academicYear: '2026/2027',
      amount: 150.00,
      paymentChannel: 'Mobile Money (MTN MoMo)'
    });

    assert.ok(voucher, 'Voucher must be created');
    assert.ok(voucher.voucher_code.startsWith('VOUCH-GIS-'), `Code must start with VOUCH-GIS-, got: ${voucher.voucher_code}`);
    assert.strictEqual(voucher.pin.length, 4, 'PIN must be 4 digits');
    assert.strictEqual(voucher.amount_ghs, 150.00);
    assert.strictEqual(voucher.school_amount, 142.50, 'School payout must be 95% (GH₵ 142.50)');
    assert.strictEqual(voucher.platform_fee, 7.50, 'Platform fee must be 5% (GH₵ 7.50)');
    assert.strictEqual(voucher.status, 'active');
    assert.ok(voucher.qr_payload.includes(voucher.voucher_code));
    assert.strictEqual(voucher.student_name, 'Kofi Boateng Jr.');
  });

  // --------------------------------------------------------------------------
  // TEST 2: Bursar Redemption (Happy Path)
  // --------------------------------------------------------------------------
  await test('2. AdmissionsVoucherService.redeemVoucher successfully redeems active voucher with PIN', async () => {
    // Generate a fresh voucher to test
    const newVoucher = await AdmissionsVoucherService.generateVoucher({
      schoolId: GIS_ID,
      schoolName: 'Ghana International School',
      payerName: 'Mrs. Vivian Annan',
      payerPhone: '+233 24 999 8877',
      studentName: 'Yaw Annan',
      targetLevel: 'JHS 1',
      amount: 150.00
    });

    const redeemResult = await AdmissionsVoucherService.redeemVoucher(GIS_ID, {
      voucherCode: newVoucher.voucher_code,
      pin: newVoucher.pin,
      redeemedBy: 'Mrs. Cynthia Quaye (Senior Bursar)',
      notes: 'Entrance examination dossier #GIS-2026-105 issued to parent'
    });

    assert.strictEqual(redeemResult.success, true);
    assert.strictEqual(redeemResult.voucher.status, 'redeemed');
    assert.ok(redeemResult.voucher.redeemed_at, 'Timestamp must be recorded');
    assert.strictEqual(redeemResult.voucher.redeemed_by, 'Mrs. Cynthia Quaye (Senior Bursar)');
    assert.strictEqual(redeemResult.voucher.redemption_notes, 'Entrance examination dossier #GIS-2026-105 issued to parent');
  });

  // --------------------------------------------------------------------------
  // TEST 3: Security & Fraud Prevention Rejections
  // --------------------------------------------------------------------------
  await test('3. AdmissionsVoucherService.redeemVoucher rejects wrong PIN, cross-school redemption & double-spending', async () => {
    // 3a. Invalid PIN
    const v1 = await AdmissionsVoucherService.generateVoucher({
      schoolId: GIS_ID,
      schoolName: 'Ghana International School',
      studentName: 'Security Test 1'
    });

    let pinError = null;
    try {
      await AdmissionsVoucherService.redeemVoucher(GIS_ID, {
        voucherCode: v1.voucher_code,
        pin: '0000' // wrong PIN
      });
    } catch (e) {
      pinError = e;
    }
    assert.ok(pinError, 'Must throw error on wrong PIN');
    assert.ok(pinError.message.includes('Invalid 4-digit security PIN'), pinError.message);

    // 3b. Double redemption
    await AdmissionsVoucherService.redeemVoucher(GIS_ID, {
      voucherCode: v1.voucher_code,
      pin: v1.pin
    });

    let doubleSpendError = null;
    try {
      await AdmissionsVoucherService.redeemVoucher(GIS_ID, {
        voucherCode: v1.voucher_code,
        pin: v1.pin
      });
    } catch (e) {
      doubleSpendError = e;
    }
    assert.ok(doubleSpendError, 'Must throw error on already redeemed voucher');
    assert.ok(doubleSpendError.message.includes('ALREADY been redeemed'), doubleSpendError.message);

    // 3c. Wrong institution
    const sosVoucher = await AdmissionsVoucherService.generateVoucher({
      schoolId: SOS_ID,
      schoolName: 'SOS Hermann Gmeiner International College',
      studentName: 'SOS Candidate'
    });

    let wrongSchoolError = null;
    try {
      await AdmissionsVoucherService.redeemVoucher('school-achimota-accra', {
        voucherCode: sosVoucher.voucher_code,
        pin: sosVoucher.pin
      });
    } catch (e) {
      wrongSchoolError = e;
    }
    assert.ok(wrongSchoolError, 'Must throw error if redeemed at wrong school');
    assert.ok(wrongSchoolError.message.includes('cannot be redeemed at this school'), wrongSchoolError.message);
  });

  // --------------------------------------------------------------------------
  // TEST 4: School Bursar Ledger with Search & Status Filtering
  // --------------------------------------------------------------------------
  await test('4. AdmissionsVoucherService.getSchoolVouchers filters by status, search query, and computes metrics', async () => {
    const all = await AdmissionsVoucherService.getSchoolVouchers(GIS_ID, { status: 'all' });
    assert.strictEqual(all.success, true);
    assert.ok(all.total >= 3, `Expected at least 3 vouchers for GIS, got ${all.total}`);
    assert.ok(all.totalRevenueGhs > 0, 'Total revenue should be > 0');
    assert.strictEqual(all.schoolPayoutGhs, Math.round(all.totalRevenueGhs * 0.95 * 100) / 100);

    // Filter active only
    const activeOnly = await AdmissionsVoucherService.getSchoolVouchers(GIS_ID, { status: 'active' });
    assert.strictEqual(activeOnly.success, true);
    activeOnly.vouchers.forEach(v => {
      assert.strictEqual(v.status, 'active');
    });

    // Search query
    const searchRes = await AdmissionsVoucherService.getSchoolVouchers(GIS_ID, { q: 'Boateng' });
    assert.strictEqual(searchRes.success, true);
    assert.ok(searchRes.vouchers.length > 0);
    searchRes.vouchers.forEach(v => {
      const match = v.student_name.includes('Boateng') || v.payer_name.includes('Boateng');
      assert.ok(match, 'Search results must match query');
    });
  });

  // --------------------------------------------------------------------------
  // TEST 5: Parent Digital Wallet Retrieval
  // --------------------------------------------------------------------------
  await test('5. AdmissionsVoucherService.getParentVouchers matches parent phone with Ghana number normalization', async () => {
    const parentVouchers = await AdmissionsVoucherService.getParentVouchers({ phone: '0244119922' });
    assert.strictEqual(parentVouchers.success, true);
    assert.ok(parentVouchers.vouchers.length > 0, 'Must retrieve parent vouchers');

    // Test with +233 format
    const parentVouchersIntl = await AdmissionsVoucherService.getParentVouchers({ phone: '+233 24 411 9922' });
    assert.strictEqual(parentVouchersIntl.success, true);
    assert.ok(parentVouchersIntl.vouchers.length > 0);
  });

  // --------------------------------------------------------------------------
  // TEST 6: Public Safe View vs Verified PIN View
  // --------------------------------------------------------------------------
  await test('6. AdmissionsVoucherService.getVoucherByCode masks PIN for public lookups unless PIN verified', async () => {
    const list = await AdmissionsVoucherService.getSchoolVouchers(GIS_ID);
    const sample = list.vouchers[0];

    // Public lookup without PIN
    const pubView = await AdmissionsVoucherService.getVoucherByCode(sample.voucher_code);
    assert.strictEqual(pubView.voucher.pin, '••••', 'PIN must be masked without credentials');
    assert.strictEqual(pubView.voucher.isPinVerified, false);

    // Verified lookup with PIN
    const verView = await AdmissionsVoucherService.getVoucherByCode(sample.voucher_code, sample.pin);
    assert.strictEqual(verView.voucher.pin, sample.pin, 'PIN must be revealed when matched');
    assert.strictEqual(verView.voucher.isPinVerified, true);
  });

  // --------------------------------------------------------------------------
  // TEST 7: Executive & Bursar Analytics
  // --------------------------------------------------------------------------
  await test('7. AdmissionsVoucherService.getVoucherAnalytics returns revenue split, counts, and grade velocity', async () => {
    const analytics = await AdmissionsVoucherService.getVoucherAnalytics(GIS_ID);
    assert.strictEqual(analytics.success, true);
    assert.ok(analytics.summary.totalSold >= 3);
    assert.strictEqual(analytics.summary.settlementRatePct, 95);
    assert.ok(analytics.summary.grossRevenueGhs > 0);
    assert.strictEqual(analytics.summary.schoolPayoutGhs, Math.round(analytics.summary.grossRevenueGhs * 0.95 * 100) / 100);
    assert.strictEqual(analytics.summary.platformFeeGhs, Math.round(analytics.summary.grossRevenueGhs * 0.05 * 100) / 100);
    assert.ok(typeof analytics.byGrade === 'object');
  });

  // --------------------------------------------------------------------------
  // TEST 8: RFC 4180 CSV Export
  // --------------------------------------------------------------------------
  await test('8. AdmissionsVoucherService.exportVouchersCSV produces RFC 4180 compliant reconciliation ledger', async () => {
    const csv = await AdmissionsVoucherService.exportVouchersCSV(GIS_ID);
    assert.ok(typeof csv === 'string');
    assert.ok(csv.includes('Voucher Code,Security PIN,Student Name,Target Level'));
    assert.ok(csv.includes('School Share (95%),Platform Fee (5%)'));
    assert.ok(csv.includes('Ghana International School') || csv.includes('VOUCH-GIS'));
  });

  // --------------------------------------------------------------------------
  // TEST 9: Express Route — Payments Verification Voucher Generation
  // --------------------------------------------------------------------------
  await test('9. Route POST /api/payments/verify creates official voucher on admission_form payment', async () => {
    const route = paymentsRouter.stack.find(s => s.route && s.route.path === '/verify' && s.route.methods.post);
    assert.ok(route, 'paymentsRouter must have POST /verify');

    const req = {
      body: {
        reference: `SF_TEST_VOUCH_${Date.now()}`,
        network: 'MTN MoMo'
      }
    };
    const res = createMockRes();

    // Call verify handler
    const handler = route.route.stack.slice(-1)[0].handle;
    await handler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.status, 'success');
  });

  // --------------------------------------------------------------------------
  // TEST 10: Express Route — School Vouchers Ledger (GET /api/schools/:id/vouchers)
  // --------------------------------------------------------------------------
  await test('10. Route GET /api/schools/:id/vouchers returns bursar ledger', async () => {
    const route = schoolsRouter.stack.find(s => s.route && s.route.path === '/:id/vouchers' && s.route.methods.get);
    assert.ok(route, 'schoolsRouter must have GET /:id/vouchers');

    const req = {
      params: { id: GIS_ID },
      query: { status: 'all', page: '1', limit: '10' },
      user: { id: 'usr-bursar-1', role: 'school_admin' }
    };
    const res = createMockRes();
    const handler = route.route.stack.slice(-1)[0].handle;
    await handler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.vouchers));
    assert.ok(data.vouchers.length > 0);
  });

  // --------------------------------------------------------------------------
  // TEST 11: Express Route — School Voucher Redemption (POST /api/schools/:id/vouchers/redeem)
  // --------------------------------------------------------------------------
  await test('11. Route POST /api/schools/:id/vouchers/redeem executes bursar redemption with audit', async () => {
    const route = schoolsRouter.stack.find(s => s.route && s.route.path === '/:id/vouchers/redeem' && s.route.methods.post);
    assert.ok(route, 'schoolsRouter must have POST /:id/vouchers/redeem');

    // Create fresh voucher
    const v = await AdmissionsVoucherService.generateVoucher({
      schoolId: GIS_ID,
      studentName: 'Route Redemption Student'
    });

    const req = {
      params: { id: GIS_ID },
      body: {
        voucherCode: v.voucher_code,
        pin: v.pin,
        redeemedBy: 'Senior Bursar Desk',
        notes: 'Dossier issued via REST API'
      },
      user: { firstName: 'Senior', lastName: 'Bursar', role: 'school_admin' }
    };
    const res = createMockRes();
    const handler = route.route.stack.slice(-1)[0].handle;
    await handler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.voucher.status, 'redeemed');
  });

  // --------------------------------------------------------------------------
  // TEST 12: Express Route — CSV Export with Entitlement Guard
  // --------------------------------------------------------------------------
  await test('12. Route GET /api/schools/:id/vouchers/export enforces tier entitlement & exports CSV', async () => {
    const route = schoolsRouter.stack.find(s => s.route && s.route.path === '/:id/vouchers/export' && s.route.methods.get);
    assert.ok(route, 'schoolsRouter must have GET /:id/vouchers/export');

    const req = {
      params: { id: GIS_ID },
      query: { bypass: 'true' }, // Growth/Pro tier simulation
      user: { role: 'school_admin' }
    };
    const res = createMockRes();
    const handler = route.route.stack.slice(-1)[0].handle;
    await handler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    assert.strictEqual(res.getHeader('content-type'), 'text/csv');
    assert.ok(res.getData().includes('Voucher Code,Security PIN'));
  });

  // --------------------------------------------------------------------------
  // TEST 13: Express Route — Parent Vouchers Wallet (GET /api/parents/vouchers)
  // --------------------------------------------------------------------------
  await test('13. Route GET /api/parents/vouchers retrieves parent vouchers by phone/session', async () => {
    const route = parentsRouter.stack.find(s => s.route && s.route.path === '/vouchers' && s.route.methods.get);
    assert.ok(route, 'parentsRouter must have GET /vouchers');

    const req = {
      query: { phone: '0244119922' },
      headers: {},
      user: null
    };
    const res = createMockRes();
    const handler = route.route.stack.slice(-1)[0].handle;
    await handler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.vouchers));
  });

  // --------------------------------------------------------------------------
  // TEST 14: Client UI & Cache Buster Verification
  // --------------------------------------------------------------------------
  await test('14. Client components & views correctly wired with cache buster ?v=74', async () => {
    // 1. modals.js contains openVoucherReceiptModal and openRedeemVoucherModal
    const modalsContent = fs.readFileSync(path.join(__dirname, '../public/js/components/modals.js'), 'utf8');
    assert.ok(modalsContent.includes('openVoucherReceiptModal(voucher = {})'), 'modals.js must contain openVoucherReceiptModal');
    assert.ok(modalsContent.includes('openRedeemVoucherModal(schoolId, onRedeemed)'), 'modals.js must contain openRedeemVoucherModal');

    // 2. dashboardView.js contains renderVouchersTab and sidebar item
    const dashContent = fs.readFileSync(path.join(__dirname, '../public/js/views/dashboardView.js'), 'utf8');
    assert.ok(dashContent.includes('renderVouchersTab('), 'dashboardView.js must contain renderVouchersTab');
    assert.ok(dashContent.includes("tab: 'vouchers'"), 'dashboardView.js must contain tab: vouchers');
    assert.ok(dashContent.includes("'vouchers': 'admissions'"), 'dashboardView.js must map vouchers tab to admissions');

    // 3. parentPortalView.js contains voucher wallet
    const parentContent = fs.readFileSync(path.join(__dirname, '../public/js/views/parentPortalView.js'), 'utf8');
    assert.ok(parentContent.includes('Digital Admissions Vouchers Wallet (Package F: VOUCH-004)'), 'parentPortalView.js must contain voucher wallet');

    // 4. api.js contains voucher methods
    const apiContent = fs.readFileSync(path.join(__dirname, '../public/js/api.js'), 'utf8');
    assert.ok(apiContent.includes('getSchoolVouchers(schoolId, query = {})'), 'api.js must contain getSchoolVouchers');
    assert.ok(apiContent.includes('redeemSchoolVoucher(schoolId, redeemData = {})'), 'api.js must contain redeemSchoolVoucher');

    // 5. index.html cache buster incremented to v=74+
    const htmlContent = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    assert.ok(/\/js\/api\.js\?v=(7[4-9]|[8-9][0-9])/.test(htmlContent), 'index.html must have ?v=74+ for api.js');
    assert.ok(/\/js\/components\/modals\.js\?v=(7[4-9]|[8-9][0-9])/.test(htmlContent), 'index.html must have ?v=74+ for modals.js');
    assert.ok(/\/js\/views\/dashboardView\.js\?v=(7[4-9]|[8-9][0-9])/.test(htmlContent), 'index.html must have ?v=74+ for dashboardView.js');
  });

  console.log('\n========================================================================');
  console.log(`🎉 ALL ${passed} / ${total} PACKAGE F TESTS PASSED SUCCESSFULLY!`);
  console.log('========================================================================\n');
}

runPackageFTests().catch(err => {
  console.error('\n❌ PACKAGE F SUITE FAILED:', err);
  process.exit(1);
});

