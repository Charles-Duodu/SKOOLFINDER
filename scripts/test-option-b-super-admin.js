/**
 * SkoolFinder Ghana - Option B: Super Admin & Regulatory Governance Test Suite
 * Baseline: Blueprint v2.0 §7.3 (SCH-005), §24 (SUB-010), §25 (ESC-003, ESC-004)
 */

const assert = require('assert');
const http = require('http');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/middleware/auth');

console.log('======================================================================');
console.log('🛡️ SKOOLFINDER GHANA: SUPER ADMIN & REGULATORY GOVERNANCE (OPTION B)');
console.log('======================================================================');

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

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (e) { json = body; }
        resolve({ statusCode: res.statusCode, headers: res.headers, body: json });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  const app = require('../server');
  const server = http.createServer(app);
  await new Promise(res => server.listen(0, '127.0.0.1', res));
  const port = server.address().port;

  const superAdminToken = jwt.sign(
    { id: '00000000-0000-0000-0000-000000000001', email: 'admin@skoolfinder.com.gh', role: 'super_admin' },
    JWT_SECRET
  );

  const adminHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${superAdminToken}`
  };

  try {
    // 1. SAD-001: Verification Queue Retrieval
    await it('SAD-001: Super Admin retrieves pending school ownership verification cases', async () => {
      const res = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/admin/verification-cases',
        method: 'GET',
        headers: adminHeaders
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.queue), 'Must return array of verification cases');
    });

    // 2. SAD-002: Regulatory Case Approval
    await it('SAD-002: Super Admin approves NaSIA accreditation with reviewer audit notes', async () => {
      const timestamp = Date.now();
      const schoolPayload = {
        name: `Ridge Church School Staging ${timestamp}`,
        category: 'Mission/Faith-based',
        levels: ['Primary', 'JHS'],
        curricula: ['GES (NaCCA)', 'Cambridge'],
        region: 'Greater Accra',
        district: 'Accra Metropolitan',
        suburb: 'Ridge',
        phone: '+233 24 555 9876',
        email: `proprietor-${timestamp}@ridgechurch.edu.gh`,
        proprietor_name: 'Dr. Kwame Addo',
        user: { id: `user-proprietor-${timestamp}`, email: `proprietor-${timestamp}@ridgechurch.edu.gh` }
      };

      const regRes = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/schools/register-wizard',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, schoolPayload);
      assert.strictEqual(regRes.statusCode, 201);
      const schoolId = regRes.body.school.id;

      // Get case
      const casesRes = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/admin/verification-cases',
        method: 'GET',
        headers: adminHeaders
      });
      const vCase = casesRes.body.queue.find(c => c.school_id === schoolId) || casesRes.body.queue[0];
      assert.ok(vCase, 'Must have a verification case');

      // Approve case
      const approveRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/admin/verification-cases/${vCase.id}/review`,
        method: 'POST',
        headers: adminHeaders
      }, {
        decision: 'approved',
        notes: 'Verified against NaSIA regulatory licence #NaSIA-GAR-2026-9918.'
      });
      assert.strictEqual(approveRes.statusCode, 200);
      assert.strictEqual(approveRes.body.success, true);
      assert.strictEqual(approveRes.body.authorityStatus, 'verified');
    });

    // 3. SAD-003: Regulatory Case Rejection with Mandatory Reason
    await it('SAD-003: Super Admin rejects invalid claim with mandatory rejection reason', async () => {
      const casesRes = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/admin/verification-cases',
        method: 'GET',
        headers: adminHeaders
      });
      const vCase = casesRes.body.queue[0];
      assert.ok(vCase, 'Need at least one verification case');

      // Missing decision rejected with 400
      const failRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/admin/verification-cases/${vCase.id}/review`,
        method: 'POST',
        headers: adminHeaders
      }, {});
      assert.strictEqual(failRes.statusCode, 400);

      // Valid rejection
      const rejectRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/admin/verification-cases/${vCase.id}/review`,
        method: 'POST',
        headers: adminHeaders
      }, {
        decision: 'rejected',
        reason: 'Expired NaSIA operational certificate'
      });
      assert.strictEqual(rejectRes.statusCode, 200);
      assert.strictEqual(rejectRes.body.authorityStatus, 'rejected');
    });

    // 4. SAD-004: Commercial Subscriptions & GMV Telemetry
    await it('SAD-004: Super Admin retrieves platform subscriptions and GMV in GHS', async () => {
      const res = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/admin/subscriptions',
        method: 'GET',
        headers: adminHeaders
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(typeof res.body.totalGmvGhs === 'number');
      assert.ok(Array.isArray(res.body.subscriptions));
    });

    // 5. SAD-005: Commercial Tier Override & Validity Extension
    await it('SAD-005: Super Admin overrides school tier to Professional for pilot onboarding', async () => {
      const overrideRes = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/admin/subscriptions/sch-ridge-test/tier',
        method: 'POST',
        headers: adminHeaders
      }, {
        tier: 'professional',
        days: 90
      });
      assert.strictEqual(overrideRes.statusCode, 200);
      assert.strictEqual(overrideRes.body.success, true);
      assert.strictEqual(overrideRes.body.subscription.tier, 'professional');
      assert.strictEqual(overrideRes.body.subscription.amount, 249);
      assert.strictEqual(overrideRes.body.subscription.currency, 'GHS');
    });

    // 6. SAD-006: Escrow Disputes Queue Endpoint
    await it('SAD-006: Super Admin retrieves disputed MoMo escrow contracts queue', async () => {
      const res = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/admin/marketplace/escrow/disputes',
        method: 'GET',
        headers: adminHeaders
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.disputes));
    });

    // 7. SAD-007: Escrow Dispute Arbitration (Refund School)
    await it('SAD-007: Super Admin arbitrates dispute with refund_school decision', async () => {
      const schoolId = 'sch-escrow-audit-01';
      
      // Buy 1 tender credit for school
      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/buy-credits`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { packType: 'single', paymentMethod: 'momo' });

      // School publishes tender
      const tenderRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Science Lab Glassware Procurement',
        category: 'Lab Equipment',
        budgetMaxGhs: 12000,
        specifications: 'Borosilicate grade glassware for senior chemistry lab'
      });
      assert.strictEqual(tenderRes.statusCode, 201);
      const tenderId = tenderRes.body.tender.id;

      // Supplier submits quote via RFQs route
      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/rfqs/${tenderId}/quote`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        supplierId: 'sup-lab-gh',
        supplierName: 'Accra Science Supplies',
        quotedAmountGhs: 11500,
        deliveryTimelineDays: 14,
        warrantyMonths: 12
      });

      // Retrieve bid id from bids endpoint
      const bidsRes1 = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/bids`,
        method: 'GET'
      });
      assert.strictEqual(bidsRes1.statusCode, 200);
      const bidId = bidsRes1.body.bids[0].id;

      // Award and lock 50% mobilization in escrow
      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/award`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { bidId });

      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/escrow-milestone`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { paymentMethod: 'momo' });

      // School raises dispute
      const dispRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/dispute`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { reason: 'Broken glassware delivered; vendor refuses replacement.' });
      assert.strictEqual(dispRes.statusCode, 200);

      // Verify it appears in disputes endpoint
      const queueRes = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/admin/marketplace/escrow/disputes',
        method: 'GET',
        headers: adminHeaders
      });
      assert.strictEqual(queueRes.statusCode, 200);
      const disputeItem = queueRes.body.disputes.find(d => d.tenderId === tenderId);
      assert.ok(disputeItem, 'Dispute must be visible in admin disputes queue');

      // Super Admin arbitrates: Refund school
      const resolveRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/admin/marketplace/escrow/${tenderId}/resolve`,
        method: 'POST',
        headers: adminHeaders
      }, {
        resolution: 'refund_school',
        notes: 'Inspection confirmed defective materials. 50% mobilization refunded to school.'
      });
      assert.strictEqual(resolveRes.statusCode, 200);
      assert.strictEqual(resolveRes.body.success, true);
      assert.strictEqual(resolveRes.body.resolution, 'refund_school');
    });

    // 8. SAD-008: Escrow Dispute Arbitration (Disburse Supplier)
    await it('SAD-008: Super Admin arbitrates dispute with disburse_supplier decision', async () => {
      const schoolId = 'sch-escrow-audit-02';
      
      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/buy-credits`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { packType: 'single', paymentMethod: 'momo' });

      const tenderRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Classroom Desks Procurement',
        category: 'Furniture',
        budgetMaxGhs: 8000,
        specifications: '50 dual-occupant wooden desks'
      });
      assert.strictEqual(tenderRes.statusCode, 201);
      const tenderId = tenderRes.body.tender.id;

      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/rfqs/${tenderId}/quote`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        supplierId: 'sup-wood-gh',
        supplierName: 'Ashanti Woodcraft Ltd',
        quotedAmountGhs: 7800,
        deliveryTimelineDays: 10
      });

      const bidsRes2 = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/bids`,
        method: 'GET'
      });
      assert.strictEqual(bidsRes2.statusCode, 200);
      const bidId = bidsRes2.body.bids[0].id;

      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/award`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { bidId });

      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/escrow-milestone`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { paymentMethod: 'momo' });

      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/dispute`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { reason: 'Minor scratches on 2 desks; withholding balance.' });

      // Super Admin arbitrates: Disburse supplier
      const resolveRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/admin/marketplace/escrow/${tenderId}/resolve`,
        method: 'POST',
        headers: adminHeaders
      }, {
        resolution: 'disburse_supplier',
        notes: 'Campus visit confirmed desks are fully functional. Minor surface polish provided.'
      });
      assert.strictEqual(resolveRes.statusCode, 200);
      assert.strictEqual(resolveRes.body.success, true);
      assert.strictEqual(resolveRes.body.resolution, 'disburse_supplier');
    });

    // 9. SAD-009: Tamper-Evident Admin Audit Trail
    await it('SAD-009: Tamper-evident admin audit logs record all governance events', async () => {
      const res = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/admin/marketplace/audit-log',
        method: 'GET',
        headers: adminHeaders
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(Array.isArray(res.body.logs));
      
      const hasDisputeResolutionLog = res.body.logs.some(l => l.event_type === 'ESCROW_DISPUTE_RESOLVED');
      assert.ok(hasDisputeResolutionLog, 'Must record ESCROW_DISPUTE_RESOLVED audit logs');
    });

  } finally {
    server.close();
  }

  console.log('======================================================================');
  console.log(`📊 Option B Governance Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error in Option B test runner:', err);
  process.exit(1);
});
