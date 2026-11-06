/**
 * SkoolFinder Ghana — Suppliers Portal Stage 1 Security & Foundation Test Suite
 * Baseline: Master Blueprint v2.0 (SUP-01-01 to SUP-01-08, SUP-02-01, SUP-07-03)
 */

const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const BASE_URL = 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'skoolfinder-secure-dev-jwt-secret-key-2026';

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

async function runStage1Tests() {
  console.log('================================================================');
  console.log('🇬🇭 SUPPLIERS PORTAL — STAGE 1 SECURE FOUNDATION VERIFICATION');
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

  // 1. SUP-01-03: Anonymous public discovery must succeed
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers',
      method: 'GET'
    });
    assert(res.status === 200 && Array.isArray(res.data), 'SUP-01-03: Public Supplier Discovery', `Status: ${res.status}, Count: ${res.data.length}`);
  } catch (err) {
    assert(false, 'SUP-01-03: Public Supplier Discovery', err.message);
  }

  // 2. SUP-01-03: Unauthenticated POST /api/suppliers must be blocked (HTTP 401)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { company_name: 'Spam Supplier', category: 'IT' });
    assert(res.status === 401, 'SUP-01-03: Unauthenticated Supplier Registration Blocked', `Status: ${res.status} (Expected 401)`);
  } catch (err) {
    assert(false, 'SUP-01-03: Unauthenticated Supplier Registration Blocked', err.message);
  }

  // 3. SUP-01-03: Unauthenticated POST /api/rfqs must be blocked (HTTP 401)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/rfqs',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { title: 'Spam RFQ', category: 'General' });
    assert(res.status === 401, 'SUP-01-03: Unauthenticated RFQ Creation Blocked', `Status: ${res.status} (Expected 401)`);
  } catch (err) {
    assert(false, 'SUP-01-03: Unauthenticated RFQ Creation Blocked', err.message);
  }

  // 4. SUP-01-03 & SUP-02-05: Unauthenticated quotation on RFQ must be blocked (HTTP 401)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/rfqs/rfq-01/quote',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { price: 'GH₵ 5,000' });
    assert(res.status === 401, 'SUP-01-03: Unauthenticated RFQ Quotation Blocked', `Status: ${res.status} (Expected 401)`);
  } catch (err) {
    assert(false, 'SUP-01-03: Unauthenticated RFQ Quotation Blocked', err.message);
  }

  // Create an authentic supplier test JWT token
  const testSupplierUser = {
    id: '00000000-0000-4000-a000-000000000099',
    email: 'kofi.supplies@gmail.com',
    role: 'supplier',
    full_name: 'Kofi Mensah',
    phone: '+233 24 555 1234'
  };
  const supplierToken = jwt.sign(testSupplierUser, JWT_SECRET, { expiresIn: '1h' });

  // 5. SUP-02-01: Authenticated registration creates 'pending' status (Trading Approval Gate)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, {
      company_name: 'Accra Smart Desks Ltd',
      category: 'Classroom Furniture',
      description: 'Ergonomic wooden and metal school desks manufactured in Dansoman.',
      region: 'Greater Accra',
      service_area: 'Greater Accra & Central Region',
      account_type: 'business',
      billing_cycle: 'annual'
    });
    assert(
      res.status === 201 && res.data.supplier && res.data.supplier.status === 'pending',
      'SUP-02-01: Mandatory Trading Approval Gate (status=pending)',
      `Status: ${res.status}, Assigned Status: ${res.data?.supplier?.status}, Name: ${res.data?.supplier?.companyName}`
    );
  } catch (err) {
    assert(false, 'SUP-02-01: Mandatory Trading Approval Gate', err.message);
  }

  // 6. SUP-07-03: Authenticated supplier can access GET /api/suppliers/me
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supplierToken}`
      }
    });
    assert(
      res.status === 200 && res.data.success && res.data.supplier,
      'SUP-07-03: Authenticated Workspace Retrieval (GET /api/suppliers/me)',
      `Status: ${res.status}, Supplier: ${res.data?.supplier?.companyName}`
    );
  } catch (err) {
    assert(false, 'SUP-07-03: Authenticated Workspace Retrieval', err.message);
  }

  // 7. SUP-03-06: Supplier cannot create a school RFQ without school authority
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
    }, { title: 'Unauthorized School RFQ by Supplier', category: 'IT' });
    assert(res.status === 403, 'SUP-03-06: Invariant Check — Supplier Blocked from Creating School RFQ', `Status: ${res.status} (Expected 403)`);
  } catch (err) {
    assert(false, 'SUP-03-06: Invariant Check — Supplier Blocked from Creating School RFQ', err.message);
  }

  console.log('\n================================================================');
  console.log(`STAGE 1 SECURITY SUITE: ${passes} PASSED / ${fails} FAILED`);
  console.log('================================================================\n');

  if (fails > 0) {
    process.exit(1);
  }
}

runStage1Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
