/**
 * Phase 8 Security & Route Hardening Verification Suite
 * Tests:
 * 1. RBAC Guard on /api/admin:
 *    - Rejects invalid / malformed JWT (401)
 *    - Rejects valid 'parent' role JWT (403)
 *    - Rejects valid 'teacher' role JWT (403)
 *    - Rejects valid 'school_admin' role JWT (403)
 *    - Accepts valid 'super_admin' role JWT (200)
 * 2. Complete 360-degree Desk API responses (200 OK) with live / fallback data:
 *    - /api/admin/overview
 *    - /api/admin/schools
 *    - /api/admin/admissions
 *    - /api/admin/users
 *    - /api/admin/finance/summary
 *    - /api/admin/finance/transactions
 *    - /api/admin/finance/vouchers
 *    - /api/admin/finance/subscriptions
 *    - /api/admin/teachers
 *    - /api/admin/procurement/rfqs
 *    - /api/admin/procurement/suppliers
 *    - /api/admin/search?q=accra
 * 3. Client View methods integrity in public/js/views/adminView.js
 * 4. Production endpoint verification on https://skoolfinder.vercel.app/
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');
const fs = require('fs');
const path = require('path');

const adminRouter = require('../src/routes/admin');
const JWT_SECRET = process.env.JWT_SECRET || 'skoolfinder-jwt-secret-key-ghana-2026';

const app = express();
app.use(express.json());
app.use('/api/admin', adminRouter);

let server;
const PORT = 3199;
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

async function runAudit() {
  console.log('\n🔒 Starting Phase 8 Security Audit & Comprehensive Desk Verification Suite...\n');

  await new Promise(resolve => {
    server = app.listen(PORT, resolve);
  });

  try {
    // 1. RBAC Guard Tests
    console.log('--- 1. RBAC & Token Claim Verification ---');

    // 1a. Invalid Bearer Token -> 401
    const resBadToken = await fetch(`${BASE_URL}/api/admin/overview`, {
      headers: { Authorization: 'Bearer this-is-an-invalid-token' }
    });
    assert(resBadToken.status === 401, 'Rejects invalid or expired token with HTTP 401');

    // 1b. Role: parent -> 403
    const parentToken = jwt.sign({ id: 'usr-parent-01', email: 'parent@gmail.com', role: 'parent' }, JWT_SECRET);
    const resParent = await fetch(`${BASE_URL}/api/admin/overview`, {
      headers: { Authorization: `Bearer ${parentToken}` }
    });
    assert(resParent.status === 403, 'Rejects role "parent" with HTTP 403 Forbidden');

    // 1c. Role: teacher -> 403
    const teacherToken = jwt.sign({ id: 'usr-teacher-01', email: 'teacher@gmail.com', role: 'teacher' }, JWT_SECRET);
    const resTeacher = await fetch(`${BASE_URL}/api/admin/overview`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    assert(resTeacher.status === 403, 'Rejects role "teacher" with HTTP 403 Forbidden');

    // 1d. Role: school_admin -> 403
    const schoolAdminToken = jwt.sign({ id: 'usr-proprietor-01', email: 'admin@morningstar.edu.gh', role: 'school_admin' }, JWT_SECRET);
    const resSchoolAdmin = await fetch(`${BASE_URL}/api/admin/overview`, {
      headers: { Authorization: `Bearer ${schoolAdminToken}` }
    });
    assert(resSchoolAdmin.status === 403, 'Rejects role "school_admin" with HTTP 403 Forbidden');

    // 1e. Role: super_admin -> 200
    const superAdminToken = jwt.sign({ id: 'usr-super-01', email: 'lead@skoolfinder.com.gh', role: 'super_admin' }, JWT_SECRET);
    const resSuperAdmin = await fetch(`${BASE_URL}/api/admin/overview`, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    assert(resSuperAdmin.status === 200, 'Accepts valid "super_admin" claim with HTTP 200 OK');

    const authHeaders = {
      Authorization: `Bearer ${superAdminToken}`,
      'Content-Type': 'application/json'
    };

    // 2. Comprehensive Desk Endpoints Health Check
    console.log('\n--- 2. Desk API Endpoints Health Check ---');

    const endpoints = [
      { name: 'Executive Overview', path: '/api/admin/overview' },
      { name: 'Schools Directory', path: '/api/admin/schools?limit=5' },
      { name: 'Admissions Desk', path: '/api/admin/admissions' },
      { name: 'User Governance', path: '/api/admin/users' },
      { name: 'Financial Summary', path: '/api/admin/finance/summary' },
      { name: 'Transactions Ledger', path: '/api/admin/finance/transactions' },
      { name: 'Admission Vouchers', path: '/api/admin/finance/vouchers' },
      { name: 'SaaS Subscriptions', path: '/api/admin/finance/subscriptions' },
      { name: 'Teacher NTC Vetting', path: '/api/admin/teachers' },
      { name: 'B2B RFQs (Tenders)', path: '/api/admin/procurement/rfqs' },
      { name: 'Accredited Suppliers', path: '/api/admin/procurement/suppliers' },
      { name: 'Global Omnisearch', path: '/api/admin/search?q=accra' }
    ];

    for (const ep of endpoints) {
      const res = await fetch(`${BASE_URL}${ep.path}`, { headers: authHeaders });
      const data = await res.json();
      assert(res.status === 200 && data !== null, `Endpoint: ${ep.name} (${ep.path}) responds with 200 OK`);
    }

    // 3. Client View File Verification
    console.log('\n--- 3. Client View & Templates Integrity ---');
    const adminViewCode = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'views', 'adminView.js'), 'utf8');

    const requiredMethods = [
      'renderOverviewTab',
      'renderSchoolsTab',
      'renderAdmissionsDesk',
      'renderUsersTab',
      'renderFinanceDesk',
      'renderTeachersDesk',
      'renderProcurementDesk',
      'renderSubscriptionsTab',
      'renderTelemetryTab'
    ];

    for (const method of requiredMethods) {
      assert(adminViewCode.includes(method), `adminView.js includes method "${method}"`);
    }

    // 4. Production Web Probe
    console.log('\n--- 4. Production Cloud Probe (https://skoolfinder.vercel.app/) ---');
    try {
      const prodRes = await fetch('https://skoolfinder.vercel.app/', { method: 'GET' });
      assert(prodRes.status === 200, 'Production URL responds with HTTP 200 OK');
      const prodText = await prodRes.text();
      assert(prodText.includes('SkoolFinder Ghana'), 'Production HTML contains valid Brand Meta');
    } catch (e) {
      console.warn('  ⚠️ External web probe notice:', e.message);
    }

  } catch (err) {
    console.error('Fatal test error:', err);
    failedTests++;
  } finally {
    server.close();
    console.log(`\n========================================`);
    console.log(`Phase 8 Audit Results: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log(`========================================\n`);
    process.exit(failedTests > 0 ? 1 : 0);
  }
}

runAudit();

