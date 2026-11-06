/**
 * SkoolFinder Ghana — Release 5 Verification Test Suite
 * Tests Monetization, MoMo Escrow & Quota Ledgers (Milestones M10 & M11)
 * Baseline: Blueprint v2.0 §14, §15, §16, §24, §26; DEC-002, DEC-011, DEC-024
 * Covers:
 *   - 3-Tier Professional Subscriptions (Free GH₵0, Plus GH₵39, Business GH₵99)
 *   - Professional Tier Lifecycle, Upgrades & Entitlements
 *   - Educator Mobile Money (MoMo) Payout Management
 *   - Lesson Escrow Lifecycle: Fund -> Hold -> Disburse to MoMo
 *   - Dispute Hold & Guardian Refund Flow
 *   - Super Admin Settlement Desk Overview & Metrics
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');

const paymentsRouter = require('../src/routes/payments');
const teachersRouter = require('../src/routes/teachers');
const parentsRouter = require('../src/routes/parents');
const adminRouter = require('../src/routes/admin');
const { JWT_SECRET } = require('../src/middleware/auth');

const app = express();
app.use(express.json());

app.use('/api/payments', paymentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/parents', parentsRouter);
app.use('/api/admin', adminRouter);

let server;
const PORT = 3490;
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
  console.log('\n🚀 Starting SkoolFinder Ghana — Release 5 Monetization & MoMo Escrow Test Suite...\n');

  await new Promise(resolve => {
    server = app.listen(PORT, resolve);
  });

  try {
    const testEducatorId = '77777777-8888-9999-aaaa-bbbbbbbbbbbb';
    const testParentId = '22222222-3333-4444-5555-666666666666';
    const testAdminId = '99999999-0000-1111-2222-333333333333';

    const educatorToken = jwt.sign({
      id: testEducatorId,
      email: 'educator.mensah@gmail.com',
      role: 'teacher',
      name: 'Dr. Araba Mensah',
      full_name: 'Dr. Araba Mensah'
    }, JWT_SECRET, { expiresIn: '1h' });

    const parentToken = jwt.sign({
      id: testParentId,
      email: 'parent.appiah@gmail.com',
      role: 'parent',
      name: 'Mrs. Cynthia Appiah',
      full_name: 'Mrs. Cynthia Appiah',
      phone: '+233 24 555 1234'
    }, JWT_SECRET, { expiresIn: '1h' });

    const adminToken = jwt.sign({
      id: testAdminId,
      email: 'superadmin@skoolfinder.com.gh',
      role: 'super_admin',
      name: 'Super Admin Officer',
      full_name: 'Super Admin Officer'
    }, JWT_SECRET, { expiresIn: '1h' });

    // ========================================================================
    // 1. PROFESSIONAL SUBSCRIPTION PLANS & CATALOG (DEC-002, DEC-024)
    // ========================================================================
    console.log('\n--- Section 1: Professional Subscription Catalog (DEC-002, DEC-024) ---');

    const plansRes = await fetch(`${BASE_URL}/api/payments/plans`);
    const plans = await plansRes.json();
    assert(plansRes.status === 200, 'GET /api/payments/plans returns 200');
    assert(Array.isArray(plans), 'Plans returns an array of offerings');

    const freePlan = plans.find(p => p.slug === 'teacher-free');
    assert(!!freePlan, 'Catalog includes Free Educator Plan (teacher-free)');
    assert(freePlan.price_ghs === 0, 'Free plan price is GH₵ 0.00');

    const plusPlan = plans.find(p => p.slug === 'teacher-plus');
    assert(!!plusPlan, 'Catalog includes Professional Plus Plan (teacher-plus)');
    assert(plusPlan.price_ghs === 39, 'Plus plan price is GH₵ 39.00/month (DEC-002)');
    assert(plusPlan.features.some(f => f.includes('Gold Badge')), 'Plus plan includes Verified Gold Badge');

    const bizPlan = plans.find(p => p.slug === 'teacher-business');
    assert(!!bizPlan, 'Catalog includes Professional Business Plan (teacher-business)');
    assert(bizPlan.price_ghs === 99, 'Business plan price is GH₵ 99.00/month (DEC-002)');
    assert(bizPlan.features.some(f => f.includes('Unlimited Vacancy Applications')), 'Business plan includes Unlimited Vacancy Applications');

    // ========================================================================
    // 2. PROFESSIONAL SUBSCRIPTION LIFECYCLE & UPGRADES
    // ========================================================================
    console.log('\n--- Section 2: Professional Subscription Lifecycle & Upgrades ---');

    // Default subscription check
    const defaultSubRes = await fetch(`${BASE_URL}/api/teachers/subscription`, {
      headers: { Authorization: `Bearer ${educatorToken}` }
    });
    const defaultSub = await defaultSubRes.json();
    assert(defaultSubRes.status === 200, 'GET /api/teachers/subscription returns 200');
    assert(defaultSub.subscription.tier === 'free', 'Default initial tier is free');
    assert(defaultSub.entitlements.maxActiveApplications === 2, 'Free tier allows 2 active vacancy applications');

    // Upgrade to Plus tier (GH₵ 39)
    const plusSubRes = await fetch(`${BASE_URL}/api/teachers/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        tier: 'plus',
        billingInterval: 'monthly',
        paymentChannel: 'Mobile Money (MTN MoMo)'
      })
    });
    const plusSub = await plusSubRes.json();
    assert(plusSubRes.status === 200, 'POST /api/teachers/subscribe (plus) returns 200');
    assert(plusSub.subscription.tier === 'plus', 'Subscription tier upgraded to plus');
    assert(plusSub.subscription.amount_ghs === 39, 'Subscription billed at GH₵ 39.00');
    assert(plusSub.entitlements.maxActiveApplications === 5, 'Plus tier unlocks 5 active applications');
    assert(plusSub.entitlements.featuredBadge === true, 'Plus tier grants featured badge');

    // Verify persisted subscription
    const verifySubRes = await fetch(`${BASE_URL}/api/teachers/subscription`, {
      headers: { Authorization: `Bearer ${educatorToken}` }
    });
    const verifySub = await verifySubRes.json();
    assert(verifySub.subscription.tier === 'plus', 'Active subscription confirmed as plus');

    // Upgrade to Business tier (GH₵ 99)
    const bizSubRes = await fetch(`${BASE_URL}/api/teachers/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        tier: 'business',
        billingInterval: 'monthly'
      })
    });
    const bizSub = await bizSubRes.json();
    assert(bizSubRes.status === 200, 'POST /api/teachers/subscribe (business) returns 200');
    assert(bizSub.subscription.tier === 'business', 'Subscription tier upgraded to business');
    assert(bizSub.subscription.amount_ghs === 99, 'Subscription billed at GH₵ 99.00');
    assert(bizSub.entitlements.maxActiveApplications >= 999, 'Business tier unlocks unlimited applications');

    // Rejection of invalid tier
    const invalidSubRes = await fetch(`${BASE_URL}/api/teachers/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({ tier: 'diamond_vip_invalid' })
    });
    assert(invalidSubRes.status === 400, 'Invalid subscription tier rejected with 400 Bad Request');

    // ========================================================================
    // 3. EDUCATOR MOBILE MONEY (MOMO) PAYOUT MANAGEMENT
    // ========================================================================
    console.log('\n--- Section 3: Educator Mobile Money (MoMo) Payout Management ---');

    // Add MTN MoMo account
    const addMomoRes = await fetch(`${BASE_URL}/api/teachers/payout-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        network: 'MTN MoMo',
        accountNumber: '024 456 7890',
        accountName: 'Dr. Araba Mensah',
        isPrimary: true
      })
    });
    const addMomoData = await addMomoRes.json();
    assert(addMomoRes.status === 201, 'POST /api/teachers/payout-methods returns 201 Created');
    assert(addMomoData.method.network === 'MTN MoMo', 'MoMo network set to MTN MoMo');
    assert(addMomoData.method.is_primary === true, 'MoMo account marked as primary');

    const payoutMethodId = addMomoData.method.id;

    // Add Telecel Cash backup account
    const addTelecelRes = await fetch(`${BASE_URL}/api/teachers/payout-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        network: 'Telecel Cash',
        accountNumber: '020 987 6543',
        accountName: 'Araba Mensah',
        isPrimary: false
      })
    });
    assert(addTelecelRes.status === 201, 'Second payout account (Telecel Cash) returns 201 Created');

    // List registered payout accounts
    const listPayoutRes = await fetch(`${BASE_URL}/api/teachers/payout-methods`, {
      headers: { Authorization: `Bearer ${educatorToken}` }
    });
    const listPayoutData = await listPayoutRes.json();
    assert(listPayoutRes.status === 200, 'GET /api/teachers/payout-methods returns 200');
    assert(listPayoutData.count >= 2, `Educator has at least 2 payout accounts (found ${listPayoutData.count})`);

    // Delete backup account
    const deleteRes = await fetch(`${BASE_URL}/api/teachers/payout-methods/${payoutMethodId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${educatorToken}` }
    });
    assert(deleteRes.status === 200, 'DELETE /api/teachers/payout-methods/:id returns 200');

    // ========================================================================
    // 4. LESSON ESCROW LIFECYCLE: FUND -> HOLD -> DISBURSE (DEC-011)
    // ========================================================================
    console.log('\n--- Section 4: Lesson Escrow Lifecycle: Fund -> Hold -> Disburse (DEC-011) ---');

    // Step 1: Create consultation booking under Gate G4
    const bookingRes = await fetch(`${BASE_URL}/api/parents/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`
      },
      body: JSON.stringify({
        teacherId: testEducatorId,
        teacherName: 'Dr. Araba Mensah',
        studentName: 'Kojo Appiah',
        gradeLevel: 'SHS 2',
        subject: 'Cambridge A-Level Biology',
        hourlyRate: 150,
        sessionsCount: 2,
        guardianAffirmation: true
      })
    });
    const booking = (await bookingRes.json()).booking;
    const bookingId = booking.id;
    assert(booking.total_amount_ghs === 300, 'Booking total is GH₵ 300 (150 * 2)');

    // Step 2: Parent funds lesson escrow
    const fundRes = await fetch(`${BASE_URL}/api/parents/bookings/${bookingId}/fund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`
      },
      body: JSON.stringify({
        amount: 300,
        paymentReference: `SF-PAY-MOMO-${Date.now()}`,
        paymentChannel: 'Mobile Money (MTN MoMo)'
      })
    });
    const fundData = await fundRes.json();
    assert(fundRes.status === 200, 'POST /api/parents/bookings/:id/fund returns 200 OK');
    assert(fundData.escrow.status === 'held_in_escrow', 'Escrow status is held_in_escrow');
    assert(fundData.escrow.amount_ghs === 300, 'Escrow held amount is GH₵ 300.00');
    assert(fundData.escrow.escrow_fee_ghs === 15, 'Platform facilitation fee calculated (5% of 300 = 15 GHS)');
    assert(fundData.escrow.net_disbursement_ghs === 285, 'Net educator disbursement calculated (300 - 15 = 285 GHS)');
    assert(fundData.booking.status === 'escrow_funded', 'Booking status transitioned to escrow_funded');

    // Step 3: Session conducted and parent signoff
    await fetch(`${BASE_URL}/api/teachers/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${educatorToken}` },
      body: JSON.stringify({ status: 'session_conducted', completionNotes: 'Both 2-hour sessions conducted.' })
    });

    await fetch(`${BASE_URL}/api/parents/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${parentToken}` },
      body: JSON.stringify({ status: 'parent_signoff', rating: 5, feedback: 'Superb lesson delivery!' })
    });

    // Step 4: Super Admin triggers MoMo escrow disbursal
    const disburseRes = await fetch(`${BASE_URL}/api/admin/finance/escrow/${bookingId}/disburse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ notes: 'MoMo batch transfer dispatched successfully via Paystack Transfer API' })
    });
    const disburseData = await disburseRes.json();
    assert(disburseRes.status === 200, 'POST /api/admin/finance/escrow/:id/disburse returns 200');
    assert(disburseData.escrow.status === 'disbursed', 'Escrow status transitioned to disbursed');
    assert(disburseData.escrow.disbursed_at !== null, 'Disbursement timestamp recorded');

    // ========================================================================
    // 5. DISPUTE HOLD & GUARDIAN REFUND FLOW
    // ========================================================================
    console.log('\n--- Section 5: Dispute Hold & Guardian Refund Flow ---');

    // Create and fund second booking
    const booking2Res = await fetch(`${BASE_URL}/api/parents/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${parentToken}` },
      body: JSON.stringify({
        teacherId: testEducatorId,
        studentName: 'Esi Appiah',
        hourlyRate: 100,
        sessionsCount: 1,
        guardianAffirmation: true
      })
    });
    const booking2 = (await booking2Res.json()).booking;

    await fetch(`${BASE_URL}/api/parents/bookings/${booking2.id}/fund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${parentToken}` },
      body: JSON.stringify({ amount: 100 })
    });

    // Place on dispute hold
    const disputeRes = await fetch(`${BASE_URL}/api/teachers/bookings/${booking2.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${parentToken}` },
      body: JSON.stringify({
        status: 'disputed',
        reason: 'Tutor unable to attend agreed time window'
      })
    });
    assert(disputeRes.status === 200, 'Dispute status update returns 200');

    // Super Admin issues full refund to parent
    const refundRes = await fetch(`${BASE_URL}/api/admin/finance/escrow/${booking2.id}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ reason: 'Schedule mismatch confirmed; refund approved' })
    });
    const refundData = await refundRes.json();
    assert(refundRes.status === 200, 'POST /api/admin/finance/escrow/:id/refund returns 200');
    assert(refundData.escrow.status === 'refunded', 'Escrow status updated to refunded');
    assert(refundData.escrow.refund_reason.includes('Schedule mismatch'), 'Refund reason recorded');

    // ========================================================================
    // 6. SUPER ADMIN SETTLEMENT DESK OVERVIEW
    // ========================================================================
    console.log('\n--- Section 6: Super Admin Settlement Desk Overview ---');

    const adminEscrowRes = await fetch(`${BASE_URL}/api/admin/finance/escrow`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminEscrow = await adminEscrowRes.json();
    assert(adminEscrowRes.status === 200, 'GET /api/admin/finance/escrow returns 200');
    assert(adminEscrow.success === true, 'Response reports success: true');
    assert(typeof adminEscrow.metrics.totalDisbursedGhs === 'number', 'Reports totalDisbursedGhs metric');
    assert(adminEscrow.holdings.length >= 2, `Settlement desk records at least 2 escrow operations (found ${adminEscrow.holdings.length})`);

    // Filter by disbursed status
    const filterDisbursedRes = await fetch(`${BASE_URL}/api/admin/finance/escrow?status=disbursed`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const filterDisbursed = await filterDisbursedRes.json();
    assert(filterDisbursed.holdings.every(h => h.status === 'disbursed'), 'Filter returns only disbursed escrow holdings');

    // ========================================================================
    // TEST SUMMARY
    // ========================================================================
    console.log('\n======================================================');
    console.log(`RELEASE 5 TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
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

