/**
 * SkoolFinder Ghana — Suppliers Portal Stage 3 Engagement & Inquiries Test Suite
 * Baseline: Master Blueprint v2.0 (SUP-02-04, SUP-03-08, SUP-06-03)
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

async function runStage3Tests() {
  console.log('================================================================');
  console.log('🇬🇭 SUPPLIERS PORTAL — STAGE 3 ENGAGEMENT & INQUIRIES VERIFICATION');
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

  const guestSessionId = 'guest-session-test-' + Date.now();
  const targetSupplierId = 'sup-01'; // Aki-Ola Publications

  // 1. SUP-03-08: Guest adds supplier to shortlist without logging in
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/shortlist',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      supplierId: targetSupplierId,
      sessionId: guestSessionId,
      notes: 'Evaluating for 2026 BECE book orders'
    });
    assert(
      res.status === 201 && res.data?.success,
      'SUP-03-08: Anonymous Guest Shortlist Add (No Login Required)',
      `Status: ${res.status}, Session: ${guestSessionId}`
    );
  } catch (err) {
    assert(false, 'SUP-03-08: Anonymous Guest Shortlist Add', err.message);
  }

  // 2. SUP-03-08: Guest retrieves shortlist using session token
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/suppliers/shortlist?sessionId=${guestSessionId}`,
      method: 'GET'
    });
    const suppliers = res.data?.suppliers || [];
    assert(
      res.status === 200 && suppliers.some(s => s.id === targetSupplierId),
      'SUP-03-08: Guest Shortlist Persistence & Retrieval',
      `Status: ${res.status}, Count: ${suppliers.length}, Found: ${targetSupplierId}`
    );
  } catch (err) {
    assert(false, 'SUP-03-08: Guest Shortlist Persistence & Retrieval', err.message);
  }

  // Setup School Administrator User & Token
  const schoolUser = {
    id: 'school-admin-uuid-001',
    email: 'bursar@gis.edu.gh',
    role: 'school_admin',
    full_name: 'Mrs. Janet Danquah',
    phone: '+233 24 111 2233'
  };
  const schoolToken = jwt.sign(schoolUser, JWT_SECRET, { expiresIn: '1h' });

  // 3. SUP-03-08: Transfer guest shortlist items to authenticated school user
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/shortlist/transfer',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolToken}`
      }
    }, { sessionId: guestSessionId });

    // Verify retrieval by user token
    const verifyRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/shortlist',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${schoolToken}` }
    });

    const userShortlist = verifyRes.data?.suppliers || [];
    assert(
      res.status === 200 && res.data?.transferredCount >= 1 && userShortlist.some(s => s.id === targetSupplierId),
      'SUP-03-08: Guest Shortlist Seamless Transfer to Authenticated School Account',
      `Transferred: ${res.data?.transferredCount}, User Shortlist Count: ${userShortlist.length}`
    );
  } catch (err) {
    assert(false, 'SUP-03-08: Guest Shortlist Seamless Transfer', err.message);
  }

  // Setup Recipient Supplier User & Token
  const supplierRecipient = {
    id: 'sup-01',
    email: 'orders@aki-ola.com.gh',
    role: 'supplier',
    full_name: 'Aki-Ola Sales Manager',
    phone: '+233 30 222 1888'
  };
  const supplierToken = jwt.sign(supplierRecipient, JWT_SECRET, { expiresIn: '1h' });

  let createdInquiryId = null;
  let createdInquiryNumber = null;

  // 4. SUP-06-03: Structured private inquiry creation with INQ- reference
  try {
    const inquiryPayload = {
      subject: 'Quotation Request: 500 Copies Aki-Ola Core Mathematics (SHS 1-3)',
      message: 'Please provide wholesale quotation with delivery to GIS Cantonments Campus.',
      sender_name: 'Mrs. Janet Danquah',
      sender_email: 'bursar@gis.edu.gh',
      sender_phone: '+233 24 111 2233',
      school_name: 'Ghana International School',
      target_timeline: 'Within 2 weeks',
      estimated_volume: '500 books',
      direct_invitation: false
    };

    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/suppliers/${targetSupplierId}/inquire`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolToken}`
      }
    }, inquiryPayload);

    createdInquiryId = res.data?.inquiry?.id;
    createdInquiryNumber = res.data?.inquiryNumber;

    assert(
      res.status === 201 && res.data?.success && res.data?.inquiryNumber?.startsWith('INQ-') && res.data?.inquiry?.status === 'sent',
      'SUP-06-03: Structured Private Inquiry Creation (Generated INQ- Reference)',
      `Status: ${res.status}, Inquiry No: ${createdInquiryNumber}`
    );
  } catch (err) {
    assert(false, 'SUP-06-03: Structured Private Inquiry Creation', err.message);
  }

  // 5. SUP-02-04: Direct school procurement invitation flag (Quotas Exempt)
  try {
    const directInvitePayload = {
      subject: 'DIRECT INVITATION: Laboratory Furniture Tender 2026',
      message: 'Your company has been directly invited by the procurement committee to submit a bid.',
      sender_name: 'Mrs. Janet Danquah',
      sender_email: 'bursar@gis.edu.gh',
      direct_invitation: true
    };

    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/suppliers/${targetSupplierId}/inquire`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${schoolToken}`
      }
    }, directInvitePayload);

    assert(
      res.status === 201 && res.data?.inquiry?.direct_invitation === true,
      'SUP-02-04: Direct School Invitation Flag (Exempt from Open-Market Quotas)',
      `Status: ${res.status}, Direct Invitation: ${res.data?.inquiry?.direct_invitation}`
    );
  } catch (err) {
    assert(false, 'SUP-02-04: Direct School Invitation Flag', err.message);
  }

  // 6. SUP-06-03: Recipient supplier scoped inbox retrieval
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/me/inquiries',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${supplierToken}` }
    });

    const inquiries = res.data?.inquiries || [];
    assert(
      res.status === 200 && inquiries.some(i => i.id === createdInquiryId || i.inquiry_number === createdInquiryNumber),
      'SUP-06-03: Supplier Scoped Inquiries Inbox Retrieval',
      `Status: ${res.status}, Count: ${inquiries.length}, Matched: ${createdInquiryNumber}`
    );
  } catch (err) {
    assert(false, 'SUP-06-03: Supplier Scoped Inquiries Inbox Retrieval', err.message);
  }

  // 7. SUP-06-03: Strict Cross-Tenant Isolation (Unrelated supplier blocked with 403 Forbidden)
  const unrelatedSupplier = {
    id: 'unrelated-supplier-uuid-999',
    email: 'unrelated.vendor@accra.gh',
    role: 'supplier',
    full_name: 'Unrelated Vendor'
  };
  const unrelatedToken = jwt.sign(unrelatedSupplier, JWT_SECRET, { expiresIn: '1h' });

  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/suppliers/inquiries/${createdInquiryId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${unrelatedToken}` }
    });

    assert(
      res.status === 403,
      'SUP-06-03: Strict Cross-Tenant Isolation (Unrelated Supplier Forbidden)',
      `Status: ${res.status} (Expected 403 Forbidden)`
    );
  } catch (err) {
    assert(false, 'SUP-06-03: Strict Cross-Tenant Isolation', err.message);
  }

  // 8. SUP-06-03: Inquiry thread reply & status lifecycle update
  try {
    // Reply to inquiry
    const replyRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/suppliers/inquiries/${createdInquiryId}/reply`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      message: 'Hello Mrs. Danquah, we have stock ready for dispatch. Attached is our official proforma invoice.'
    });

    // Update status to 'quoted'
    const statusRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: `/api/suppliers/inquiries/${createdInquiryId}/status`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, { status: 'quoted' });

    assert(
      replyRes.status === 201 && statusRes.status === 200 && statusRes.data?.status === 'quoted',
      'SUP-06-03: Inquiry Thread Messaging & Lifecycle Status Transition (quoted)',
      `Reply Status: ${replyRes.status}, Inquiry Final Status: ${statusRes.data?.status}`
    );
  } catch (err) {
    assert(false, 'SUP-06-03: Inquiry Thread Messaging & Lifecycle Status Transition', err.message);
  }

  console.log('\n================================================================');
  console.log(`STAGE 3 RESULTS: ${passes} Passed, ${fails} Failed (Total: ${passes + fails})`);
  console.log('================================================================\n');

  if (fails > 0) {
    process.exit(1);
  }
}

runStage3Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

