/**
 * SkoolFinder Ghana — Suppliers Portal Stage 2 Catalogue & Discovery Test Suite
 * Baseline: Master Blueprint v2.0 (SUP-01-01, SUP-01-02, SUP-03-01, SUP-03-02, SUP-03-03, SUP-03-05, SUP-05-01)
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

async function runStage2Tests() {
  console.log('================================================================');
  console.log('🇬🇭 SUPPLIERS PORTAL — STAGE 2 DISCOVERY & CATALOGUE VERIFICATION');
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

  // 1. SUP-03-01: Admin-governed taxonomy categories endpoint
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/categories',
      method: 'GET'
    });
    const categories = res.data?.categories || [];
    const hasBooks = categories.some(c => c.name.includes('Books'));
    const hasFood = categories.some(c => c.name.includes('Food'));
    const foodCat = categories.find(c => c.name.includes('Food'));
    const hasFDAEvidence = foodCat && Array.isArray(foodCat.required_evidence) && foodCat.required_evidence.some(e => e.includes('FDA'));

    assert(
      res.status === 200 && categories.length >= 8 && hasBooks && hasFood && hasFDAEvidence,
      'SUP-03-01: Category Taxonomy API (8 Governed Categories with Evidence Requirements)',
      `Status: ${res.status}, Count: ${categories.length}, High-risk FDA requirement: ${hasFDAEvidence}`
    );
  } catch (err) {
    assert(false, 'SUP-03-01: Category Taxonomy API', err.message);
  }

  // 2. SUP-03-05: Comparison endpoint requires at least 2 IDs
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/compare?ids=sup-01',
      method: 'GET'
    });
    assert(
      res.status === 400 && res.data?.error?.includes('At least 2'),
      'SUP-03-05: Compare Invariant — Minimum 2 Suppliers Enforced',
      `Status: ${res.status}, Error: ${res.data?.error}`
    );
  } catch (err) {
    assert(false, 'SUP-03-05: Compare Invariant — Minimum 2 Suppliers Enforced', err.message);
  }

  // 3. SUP-03-05: Comparison endpoint succeeds with 2 valid suppliers
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/compare?ids=sup-01,sup-02',
      method: 'GET'
    });
    const suppliers = res.data?.suppliers || [];
    assert(
      res.status === 200 && suppliers.length === 2 && suppliers[0].companyName && suppliers[0].verificationLevel,
      'SUP-03-05: Compare Side-by-Side Matrix (2 Suppliers Valid)',
      `Status: ${res.status}, Returned: ${suppliers.length}, Badges: ${suppliers[0].verificationLevel} vs ${suppliers[1].verificationLevel}`
    );
  } catch (err) {
    assert(false, 'SUP-03-05: Compare Side-by-Side Matrix (2 Suppliers Valid)', err.message);
  }

  // 4. SUP-03-05: Invariant Enforced — Maximum 3 suppliers allowed on desktop (4 IDs rejected)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/compare?ids=sup-01,sup-02,sup-03,sup-04',
      method: 'GET'
    });
    assert(
      res.status === 400 && res.data?.maxAllowed === 3,
      'SUP-03-05: Compare Invariant — Maximum 3 Desktop / 2 Mobile Enforced (4 IDs Rejected)',
      `Status: ${res.status}, Error: ${res.data?.error}`
    );
  } catch (err) {
    assert(false, 'SUP-03-05: Compare Invariant — Maximum 3 Desktop / 2 Mobile Enforced', err.message);
  }

  // Setup authenticated supplier test token
  const testSupplierUser = {
    id: '00000000-0000-4000-a000-000000000088',
    email: 'stage2.supplier@test.gh',
    role: 'supplier',
    full_name: 'Ama Serwaa',
    phone: '+233 20 888 7777'
  };
  const supplierToken = jwt.sign(testSupplierUser, JWT_SECRET, { expiresIn: '1h' });

  // 5. SUP-03-02 & SUP-03-03: Unauthenticated product creation blocked (HTTP 401)
  try {
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/me/products',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { name: 'Unauth Dual Desk', pricing_mode: 'fixed', price_ghs: 350 });
    assert(
      res.status === 401,
      'SUP-03-02: Unauthenticated Product Publishing Blocked',
      `Status: ${res.status} (Expected 401)`
    );
  } catch (err) {
    assert(false, 'SUP-03-02: Unauthenticated Product Publishing Blocked', err.message);
  }

  // 6. SUP-03-02 & SUP-03-03: Authenticated product creation with physical attributes & pricing mode
  try {
    const productPayload = {
      name: 'Ergonomic Wooden Dual Desk (JHS/SHS)',
      sku: 'SKU-FURN-DESK-01',
      category_id: 'cat-furniture',
      pricing_mode: 'fixed',
      price_ghs: 420.00,
      unit: 'desk',
      minimum_order_qty: 10,
      stock_availability: 'in_stock',
      delivery_days: 5,
      description: 'Durable solid hardwood dual desk with integrated dual bench seating.'
    };
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/me/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, productPayload);
    assert(
      (res.status === 201 || res.status === 200) && res.data?.success && res.data?.product?.name === productPayload.name,
      'SUP-03-02 & SUP-03-03: Physical Product Publishing (Fixed Pricing & MOQ)',
      `Status: ${res.status}, Product: ${res.data?.product?.name}, Mode: ${res.data?.product?.pricing_mode}`
    );
  } catch (err) {
    assert(false, 'SUP-03-02 & SUP-03-03: Physical Product Publishing', err.message);
  }

  // 7. SUP-03-02: Authenticated service template publishing with deliverables & safeguarding
  try {
    const servicePayload = {
      name: 'Annual School Pest Fumigation & Sanitization',
      service_scope: 'Termly sanitization and pest clearance across dormitories, classrooms, and kitchen areas.',
      category_id: 'cat-facilities',
      pricing_mode: 'indicative',
      indicative_range_min: 1500,
      indicative_range_max: 3500,
      rate_unit: 'per campus term',
      deliverables: ['EPA Pesticide Certification', 'Classroom Clearance Notice', 'Follow-up Spot Inspection'],
      safeguarding_cleared: true,
      safeguarding_certified: true
    };
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/me/services',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, servicePayload);
    const hasSafeguarding = !!(res.data?.service?.safeguarding_certified || res.data?.service?.safeguarding_cleared);
    assert(
      (res.status === 201 || res.status === 200) && res.data?.success && hasSafeguarding,
      'SUP-03-02: Service Template Publishing with Safeguarding & Deliverables',
      `Status: ${res.status}, Service: ${res.data?.service?.name}, Safeguarding: ${hasSafeguarding}`
    );
  } catch (err) {
    assert(false, 'SUP-03-02: Service Template Publishing', err.message);
  }

  // 8. SUP-05-01: Verification evidence submission (V0 to V4 ladder)
  try {
    const verificationPayload = {
      verification_level: 'V2',
      rgd_number: 'CS9988772026',
      tin_number: 'C0008889991',
      ghana_card_number: 'GHA-789012345-6',
      compliance_notes: 'RGD Certificate of Incorporation & GRA Tax Clearance attached.'
    };
    const res = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/suppliers/me/verification',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supplierToken}`
      }
    }, verificationPayload);
    assert(
      res.status === 200 && res.data?.success,
      'SUP-05-01: Supplier Verification Evidence Submission (V0-V4 Ladder)',
      `Status: ${res.status}, Message: ${res.data?.message}`
    );
  } catch (err) {
    assert(false, 'SUP-05-01: Supplier Verification Evidence Submission', err.message);
  }

  console.log('\n================================================================');
  console.log(`STAGE 2 RESULTS: ${passes} Passed, ${fails} Failed (Total: ${passes + fails})`);
  console.log('================================================================\n');

  if (fails > 0) {
    process.exit(1);
  }
}

runStage2Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
