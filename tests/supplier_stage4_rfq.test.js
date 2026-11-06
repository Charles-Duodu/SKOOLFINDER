/**
 * SkoolFinder Ghana — Suppliers Portal Stage 4 RFQ Procurement & Quoting Test Suite
 * Baseline: Master Blueprint v2.0 (SUP-02-05, SUP-03-06, SUP-04-01, SUP-04-02, SUP-04-03)
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

async function runStage4Tests() {
  console.log('================================================================');
  console.log('🇬🇭 SUPPLIERS PORTAL — STAGE 4 RFQ PROCUREMENT & QUOTING');
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

  // Setup Personas
  const schoolAdminUser = {
    id: 'school-proprietor-uuid-007',
    school_id: 'sch-gis-accra',
    schoolName: 'Ghana International School',
    role: 'school_admin',
    email: 'proprietor@gis.edu.gh',
    full_name: 'Dr. Michael Addison'
  };
  const schoolToken = jwt.sign(schoolAdminUser, JWT_SECRET, { expiresIn: '1h' });

  const supplierUser = {
    id: 'sup-01',
    role: 'supplier',
    email: 'orders@aki-ola.com.gh',
    full_name: 'Aki-Ola Sales Team',
    phone: '+233 30 222 1888'
  };
  const supplierToken = jwt.sign(supplierUser, JWT_SECRET, { expiresIn: '1h' });

  const foreignSupplierUser = {
    id: 'foreign-sup-99',
    role: 'supplier',
    email: 'foreign.supplier@ghana.com',
    full_name: 'Competitor Vendor'
  };
  const foreignSupplierToken = jwt.sign(foreignSupplierUser, JWT_SECRET, { expiresIn: '1h' });

  // 1. SUP-03-06: Invariant check — Supplier cannot create a school RFQ (HTTP 403 Forbidden)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/rfqs',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      title: 'Illegal Supplier Posted RFQ',
      category: 'Books'
    });

    assert(
      res.status === 403,
      'SUP-03-06: Invariant Check — Supplier Blocked from Creating School RFQ',
      `Status: ${res.status} (Expected 403 Forbidden)`
    );
  } catch (err) {
    assert(false, 'SUP-03-06: Invariant Check — Supplier RFQ Block', err.message);
  }

  // 2. SUP-01-03: Authorized school administrator successfully creates RFQ
  let createdRfqId = null;
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/rfqs',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolToken}`
      }
    }, {
      schoolId: 'sch-gis-accra',
      schoolName: 'Ghana International School',
      title: 'Procurement of 200 Science Microscopes & WAEC Reagents',
      category: 'Science, STEM & Lab Equipment',
      description: 'Senior high school biology and chemistry laboratory supplies.',
      budget: 65000,
      budgetRange: 'GH₵ 60,000 - 70,000',
      quantity: '200 Microscopes & Reagents',
      deadline: 'Within 30 Days'
    });

    createdRfqId = res.data?.rfq?.id || 'rfq-01';
    assert(
      (res.status === 201 || res.status === 200) && res.data?.success,
      'SUP-01-03: School Administrator Successfully Publishes Multi-Supplier RFQ',
      `Status: ${res.status}, RFQ ID: ${createdRfqId}`
    );
  } catch (err) {
    assert(false, 'SUP-01-03: School Admin Publishes RFQ', err.message);
  }

  // 3. SUP-02-05 & SUP-04-03: Targeted multi-supplier RFQ invitations
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/rfqs/${createdRfqId}/invite`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolToken}`
      }
    }, {
      supplierIds: ['sup-01', 'sup-02'],
      notes: 'Please review our lab equipment RFQ and submit quotation'
    });

    assert(
      res.status === 201 && res.data?.success && res.data?.count === 2,
      'SUP-02-05: Targeted Multi-Supplier RFQ Invitations (Direct Invitation Flag)',
      `Status: ${res.status}, Invited Count: ${res.data?.count}`
    );
  } catch (err) {
    assert(false, 'SUP-02-05: Targeted Multi-Supplier Invitations', err.message);
  }

  // 4. SUP-01-03: Unauthenticated quote submission strictly blocked (HTTP 401)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/rfqs/${createdRfqId}/quote`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      price: 'GH₵ 62,000'
    });

    assert(
      res.status === 401,
      'SUP-01-03: Unauthenticated RFQ Quote Submission Blocked',
      `Status: ${res.status} (Expected 401)`
    );
  } catch (err) {
    assert(false, 'SUP-01-03: Unauthenticated Quote Blocked', err.message);
  }

  // 5. SUP-04-03: Directly invited supplier submits quote (Preserves direct invitation quota exemption)
  let submittedQuoteId = null;
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/rfqs/${createdRfqId}/quote`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      supplierId: 'sup-01',
      supplierName: 'Aki-Ola Publications & STEM Ltd',
      amount: 62000,
      deliveryDays: 7,
      warrantyTerms: '12 Months Replacement Warranty',
      paymentTerms: 'Settlement upon delivery and lab verification',
      notes: 'Initial wholesale proposal'
    });

    submittedQuoteId = res.data?.quote?.id;
    const isDirect = !!res.data?.quote?.is_direct_invitation;

    assert(
      res.status === 201 && res.data?.success && isDirect,
      'SUP-04-03: Quote Submission with Direct Invitation Quota Exemption Flag',
      `Status: ${res.status}, Quote ID: ${submittedQuoteId}, Direct Invite: ${isDirect}`
    );
  } catch (err) {
    assert(false, 'SUP-04-03: Quote Submission Quota Exemption', err.message);
  }

  // 6. SUP-04-01: Quote versioning, revision history, and audit trail
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/rfqs/${createdRfqId}/quote/revise`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      quoteId: submittedQuoteId,
      revisedAmount: 58500,
      revisionReason: 'Applied 5% educational discount for bulk 200 unit order',
      deliveryDays: 5
    });

    assert(
      res.status === 200 && res.data?.success && res.data?.revisionNumber === 1 && res.data?.quote?.amount === 58500,
      'SUP-04-01: Quote Revision with Immutable Audit Trail (Discount applied to GH₵ 58,500)',
      `Status: ${res.status}, Revision #: ${res.data?.revisionNumber}, New Amount: GH₵ ${res.data?.quote?.amount}`
    );
  } catch (err) {
    assert(false, 'SUP-04-01: Quote Revision Audit Trail', err.message);
  }

  // 7. SUP-04-02: Tenant Isolation on quote comparison matrix (Supplier forbidden with 403)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/rfqs/${createdRfqId}/compare-quotes`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${foreignSupplierToken}` }
    });

    assert(
      res.status === 403,
      'SUP-04-02: Cross-Tenant Isolation — Competitor Supplier Forbidden from Sealed Bids Matrix',
      `Status: ${res.status} (Expected 403 Forbidden)`
    );
  } catch (err) {
    assert(false, 'SUP-04-02: Tenant Isolation on Compare Quotes', err.message);
  }

  // 8. SUP-04-02: School procurement committee bid evaluation and award decision
  try {
    // 8a. School retrieves side-by-side comparison matrix
    const matrixRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/rfqs/${createdRfqId}/compare-quotes`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${schoolToken}` }
    });

    const matrix = matrixRes.data?.comparisonMatrix || [];
    const hasQuote = matrix.some(m => m.id === submittedQuoteId);

    // 8b. Committee evaluates and awards bid
    const evalRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/rfqs/${createdRfqId}/evaluate`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolToken}`
      }
    }, {
      quoteId: submittedQuoteId,
      technicalScore: 48.5,
      commercialScore: 47.0,
      decision: 'awarded',
      evaluationNotes: 'High quality NaCCA approved apparatus with competitive pricing and 5-day delivery.'
    });

    assert(
      matrixRes.status === 200 && hasQuote && evalRes.status === 200 && evalRes.data?.evaluation?.decision === 'awarded',
      'SUP-04-02: School Procurement Board Comparison & Award Decision (Score: 95.5 / 100)',
      `Matrix Count: ${matrix.length}, Award Status: ${evalRes.data?.evaluation?.decision}, Score: ${evalRes.data?.evaluation?.total_score}`
    );
  } catch (err) {
    assert(false, 'SUP-04-02: Evaluation & Award Decision', err.message);
  }

  console.log('\n================================================================');
  console.log(`STAGE 4 RESULTS: ${passes} Passed, ${fails} Failed (Total: ${passes + fails})`);
  console.log('================================================================\n');

  if (fails > 0) {
    process.exit(1);
  }
}

runStage4Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
