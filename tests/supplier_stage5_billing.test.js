/**
 * SkoolFinder Ghana — Suppliers Portal Stage 5 Paid Operations & Billing Test Suite
 * Baseline: Master Blueprint v2.0 (SUP-05-01 through SUP-05-08, SUP-04-03)
 */

const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const BASE_URL = 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'skoolfinder-jwt-secret-key-ghana-2026';

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runStage5Tests() {
  console.log('================================================================');
  console.log('🇬🇭 SUPPLIERS PORTAL — STAGE 5 PAID OPERATIONS & BILLING');
  console.log('Target: ' + BASE_URL);
  console.log('================================================================\n');

  let passes = 0;
  let fails = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName} ${details ? '— ' + details : ''}`);
      passes++;
    } else {
      console.error(`[FAIL] ${testName} ${details ? '— ' + details : ''}`);
      fails++;
    }
  }

  // Setup Test Personas
  const supplierUser = {
    id: `sup-stage5-${Date.now()}`,
    role: 'supplier',
    email: 'billing-test@ghanaschoolsupplies.com',
    full_name: 'Kwame Mensah',
    phone: '+233 24 111 2233'
  };
  const supplierToken = jwt.sign(supplierUser, JWT_SECRET, { expiresIn: '2h' });

  // 1. SUP-05-01: Verify Locked Pricing Structure (Free, Growth GH₵ 79, Pro GH₵ 199, Enterprise GH₵ 399; Annual 10x)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/plans',
      method: 'GET'
    });

    const plans = res.data && res.data.plans;
    const freePlan = plans && plans.find(p => p.tier === 'free');
    const growthPlan = plans && plans.find(p => p.tier === 'growth');
    const proPlan = plans && plans.find(p => p.tier === 'professional');
    const entPlan = plans && plans.find(p => p.tier === 'enterprise');

    const pricingCorrect = 
      freePlan && freePlan.monthlyPriceGhs === 0 && freePlan.annualPriceGhs === 0 &&
      growthPlan && growthPlan.monthlyPriceGhs === 79 && growthPlan.annualPriceGhs === 790 &&
      proPlan && proPlan.monthlyPriceGhs === 199 && proPlan.annualPriceGhs === 1990 &&
      entPlan && entPlan.monthlyPriceGhs === 399 && entPlan.annualPriceGhs === 3990;

    assert(
      res.status === 200 && pricingCorrect,
      'SUP-05-01: Locked Multi-Tier Supplier Commercial Pricing (Free GH₵ 0, Growth GH₵ 79, Pro GH₵ 199, Enterprise GH₵ 399; Annual 10x)',
      `Free: GH₵ 0, Growth: GH₵ 79/790, Pro: GH₵ 199/1,990, Ent: GH₵ 399/3,990`
    );
  } catch (err) {
    assert(false, 'SUP-05-01: Supplier Plans Route', err.message);
  }

  // 2. SUP-05-04: Paystack Platform Fee Checkout Initialization
  let checkoutRef = null;
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/billing/checkout',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      plan_tier: 'growth',
      billing_interval: 'monthly'
    });

    checkoutRef = res.data && res.data.reference;
    assert(
      res.status === 200 && res.data.success && checkoutRef && checkoutRef.startsWith('SKF-SUP-PAY-') && res.data.amount_ghs === 79,
      'SUP-05-04: Paystack Platform Fee Checkout Initialization',
      `Reference: ${checkoutRef}, Amount: GH₵ ${res.data?.amount_ghs}`
    );
  } catch (err) {
    assert(false, 'SUP-05-04: Paystack Checkout Initialization', err.message);
  }

  // 3. SUP-05-04: Paystack Payment Verification & Subscription Activation
  let invoiceNumber = null;
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/billing/verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      reference: checkoutRef,
      plan_tier: 'growth',
      billing_interval: 'monthly'
    });

    invoiceNumber = res.data?.invoice?.invoice_number;
    const subStatus = res.data?.subscription?.status;

    assert(
      res.status === 200 && res.data.success && subStatus === 'active' && invoiceNumber && invoiceNumber.startsWith('INV-SUP-2026-'),
      'SUP-05-04: Paystack Payment Verification & Subscription Activation',
      `Status: ${subStatus}, Invoice: ${invoiceNumber}, Plan: GROWTH`
    );
  } catch (err) {
    assert(false, 'SUP-05-04: Payment Verification', err.message);
  }

  // 4. SUP-05-05: Idempotency & Duplicate Payment Prevention
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/billing/verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      reference: checkoutRef,
      plan_tier: 'growth',
      billing_interval: 'monthly'
    });

    assert(
      res.status === 200 && res.data.success && res.data.idempotent === true && res.data?.invoice?.invoice_number === invoiceNumber,
      'SUP-05-05: Idempotency & Duplicate Payment Prevention (Duplicate Reference Rejected Gracefully)',
      `Idempotent: ${res.data.idempotent}, Returned Existing Invoice: ${res.data?.invoice?.invoice_number}`
    );
  } catch (err) {
    assert(false, 'SUP-05-05: Payment Idempotency Check', err.message);
  }

  // 5. SUP-05-06, SUP-05-07: 7-Day Payment Grace Period Enforcement
  try {
    // Transition to grace_period
    await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/billing/simulate-grace-period',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      status: 'grace_period'
    });

    const billingRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/me/billing',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supplierToken}`
      }
    });

    const sub = billingRes.data?.subscription;
    assert(
      billingRes.status === 200 && sub && (sub.status === 'grace_period' || sub.is_in_grace_period === true) && sub.plan_tier === 'growth',
      'SUP-05-06 / SUP-05-07: 7-Day Payment Grace Period Retains Paid Features without Immediate Lockout',
      `Status: ${sub?.status}, In Grace: ${sub?.is_in_grace_period}, Active Plan: ${sub?.plan_tier}`
    );
  } catch (err) {
    assert(false, 'SUP-05-06 / SUP-05-07: Grace Period Enforcement', err.message);
  }

  // 6. SUP-05-02: Catalogue Item Quota Enforcement (Free Tier limit: 5)
  try {
    const freeSupplier = {
      id: `sup-free-quota-${Date.now()}`,
      role: 'supplier',
      email: 'free-quota@supplier.com.gh',
      full_name: 'Ama Serwaa'
    };
    const freeToken = jwt.sign(freeSupplier, JWT_SECRET, { expiresIn: '2h' });

    // Add 5 items (allowed on free tier)
    for (let i = 1; i <= 5; i++) {
      await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/suppliers/me/products',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${freeToken}`
        }
      }, {
        name: `Free Tier Educational Sample Item #${i}`,
        sku: `SAMPLE-00${i}`,
        category_id: 'cat-books',
        pricing_mode: 'fixed',
        price_ghs: 25.00
      });
    }

    // Attempt 6th item (must be blocked by quota)
    const blockRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/me/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${freeToken}`
      }
    }, {
      name: `Exceeding Quota Item #6`,
      sku: `SAMPLE-006`,
      category_id: 'cat-books',
      pricing_mode: 'fixed',
      price_ghs: 40.00
    });

    assert(
      blockRes.status === 403 && blockRes.data?.code === 'CATALOGUE_QUOTA_EXCEEDED',
      'SUP-05-02: Catalogue Quota Enforced (6th Item on Free Plan Blocked with 403)',
      `Status: ${blockRes.status}, Error Code: ${blockRes.data?.code}, Used: ${blockRes.data?.used}/5`
    );
  } catch (err) {
    assert(false, 'SUP-05-02: Catalogue Quota Enforcement', err.message);
  }

  // 7. SUP-04-03, SUP-05-03: Open-Market RFQ Quota vs Direct Invitation Exemption
  try {
    const rfqSupplier = {
      id: `sup-rfq-quota-${Date.now()}`,
      role: 'supplier',
      email: 'rfq-quota@supplier.com.gh',
      full_name: 'Kofi Boateng'
    };
    const rfqSupplierToken = jwt.sign(rfqSupplier, JWT_SECRET, { expiresIn: '2h' });

    // Submit 2 open-market quotes (Free Tier Limit is 2)
    for (let i = 1; i <= 2; i++) {
      await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/rfqs/rfq-market-test/quote',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${rfqSupplierToken}`
        }
      }, {
        supplierId: rfqSupplier.id,
        supplierName: 'Boateng Educational Supplies',
        amount: 5000,
        is_direct_invitation: false
      });
    }

    // Attempt 3rd open-market quote (must be blocked)
    const openMarketBlocked = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/rfqs/rfq-market-test/quote',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rfqSupplierToken}`
      }
    }, {
      supplierId: rfqSupplier.id,
      supplierName: 'Boateng Educational Supplies',
      amount: 6000,
      is_direct_invitation: false
    });

    // Directly invited response on 3rd quote (must be ALLOWED by SUP-04-03)
    const directInviteAllowed = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/rfqs/rfq-direct-test/quote',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rfqSupplierToken}`
      }
    }, {
      supplierId: rfqSupplier.id,
      supplierName: 'Boateng Educational Supplies',
      amount: 7500,
      is_direct_invitation: true // DIRECT SCHOOL SOLICITATION
    });

    const openMarketEnforced = openMarketBlocked.status === 403 && openMarketBlocked.data?.code === 'RFQ_QUOTA_EXCEEDED';
    const directExemptionHonored = directInviteAllowed.status === 201 && directInviteAllowed.data?.quote?.is_direct_invitation === true;

    assert(
      openMarketEnforced && directExemptionHonored,
      'SUP-04-03 / SUP-05-03: Open-Market RFQ Cap Enforced (3rd Quote Blocked) & Direct Invitation Exemption Honored (Direct Quote Accepted)',
      `Open Market Block: HTTP ${openMarketBlocked.status} (${openMarketBlocked.data?.code}) | Direct Invite: HTTP ${directInviteAllowed.status} (Direct: ${directInviteAllowed.data?.quote?.is_direct_invitation})`
    );
  } catch (err) {
    assert(false, 'SUP-04-03 / SUP-05-03: RFQ Quota Exemption', err.message);
  }

  // 8. SUP-05-08: Commercial Analytics Funnel Metrics
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/me/analytics',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supplierToken}`
      }
    });

    const metrics = res.data?.analytics?.metrics;
    const timeline = res.data?.analytics?.timeline_30d;

    const hasMetrics = metrics && 
      typeof metrics.profile_impressions === 'number' && 
      typeof metrics.inquiries_received === 'number' &&
      typeof metrics.quote_submissions === 'number' &&
      typeof metrics.conversion_rate_percentage === 'number';

    assert(
      res.status === 200 && res.data.success && hasMetrics && Array.isArray(timeline),
      'SUP-05-08: Commercial Analytics Funnel (Impressions, Inquiries, Quotes & Conversion Rate)',
      `Impressions: ${metrics?.profile_impressions}, Inquiries: ${metrics?.inquiries_received}, Quotes: ${metrics?.quote_submissions}, Conversion: ${metrics?.conversion_rate_percentage}%`
    );
  } catch (err) {
    assert(false, 'SUP-05-08: Commercial Analytics', err.message);
  }

  console.log('\n================================================================');
  console.log(`STAGE 5 RESULTS: ${passes} Passed, ${fails} Failed (Total: ${passes + fails})`);
  console.log('================================================================\n');

  if (fails > 0) process.exit(1);
}

runStage5Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
