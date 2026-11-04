/**
 * SkoolFinder Ghana - Production Deployment & Staging Readiness Test Suite
 * Option A Verification
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('======================================================================');
console.log('🚀 SKOOLFINDER GHANA: PRODUCTION DEPLOYMENT READINESS SUITE (OPTION A)');
console.log('======================================================================');

let passed = 0;
let failed = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✅ [PASS] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${desc}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

async function itAsync(desc, fn) {
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

async function run() {
  // 1. Vercel Configuration Verification
  it('DEP-001: vercel.json is valid and contains SPA rewrites and API builds', () => {
    const raw = fs.readFileSync(path.join(__dirname, '../vercel.json'), 'utf8');
    const config = JSON.parse(raw);
    assert.strictEqual(config.version, 2, 'vercel.json must be version 2');
    
    // Check builds
    const apiBuild = config.builds.find(b => b.src === 'api/index.js');
    assert.ok(apiBuild, 'api/index.js build must be declared');
    assert.strictEqual(apiBuild.use, '@vercel/node');

    const staticBuild = config.builds.find(b => b.src === 'public/**');
    assert.ok(staticBuild, 'public/** static build must be declared');

    // Check SPA routes
    const apiRoute = config.routes.find(r => r.src === '/api/(.*)');
    assert.ok(apiRoute, '/api/(.*) route must be routed to /api/index.js');

    const spaCatchall = config.routes.find(r => r.src === '/(.*)');
    assert.ok(spaCatchall, '/(.*) fallback must route to /public/index.html');
  });

  // 2. Serverless Function Entry Point (api/index.js)
  it('DEP-002: api/index.js cleanly imports and exports Express app instance', () => {
    const app = require('../api/index');
    assert.ok(app, 'api/index.js must export an application instance');
    assert.strictEqual(typeof app.handle, 'function', 'Exported object must be Express app');
  });

  // 3. Consolidated Master Database Migration
  it('DEP-003: sql/master_school_owner_blueprint_v2_migration.sql exists and is populated', () => {
    const p = path.join(__dirname, '../sql/master_school_owner_blueprint_v2_migration.sql');
    assert.ok(fs.existsSync(p), 'Master migration file must exist');
    const sql = fs.readFileSync(p, 'utf8');
    assert.ok(sql.length > 20000, 'Master migration must contain comprehensive schema');
    
    // Check key tables
    const requiredTables = [
      'schools',
      'school_memberships',
      'verification_cases',
      'evidence_documents',
      'school_profile_revisions',
      'school_staff_invitations',
      'school_intakes',
      'admission_form_definitions',
      'school_enquiries',
      'school_admissions',
      'school_tour_slots',
      'tour_bookings',
      'platform_subscriptions',
      'subscription_invoices',
      'school_vacancies',
      'vacancy_applications',
      'school_tenders',
      'tender_bids',
      'marketplace_credits_ledger',
      'tender_escrow_milestones',
      'marketplace_audit_logs'
    ];

    for (const table of requiredTables) {
      assert.ok(
        sql.includes(`CREATE TABLE IF NOT EXISTS public.${table}`) || sql.includes(`CREATE TABLE IF NOT EXISTS ${table}`),
        `Must define table: ${table}`
      );
    }

    // Check RLS & indexes
    assert.ok(sql.includes('ENABLE ROW LEVEL SECURITY'), 'Must configure Row Level Security');
    assert.ok(sql.includes('CREATE INDEX IF NOT EXISTS'), 'Must configure performance indexes');
  });

  // 4. Production Environment Template (.env.example)
  it('DEP-004: .env.example defines all mandatory production keys', () => {
    const envRaw = fs.readFileSync(path.join(__dirname, '../.env.example'), 'utf8');
    const requiredKeys = [
      'PORT',
      'NODE_ENV',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET',
      'RESEND_API_KEY',
      'PAYSTACK_SECRET_KEY',
      'PAYSTACK_PUBLIC_KEY'
    ];

    for (const key of requiredKeys) {
      assert.ok(envRaw.includes(`${key}=`), `Mandatory key missing in .env.example: ${key}`);
    }
  });

  // 5. Test Live App Server Health & Security Headers
  await itAsync('DEP-005: Express server enforces production security headers and /api/health endpoint', async () => {
    const app = require('../server');
    const server = http.createServer(app);
    await new Promise(res => server.listen(0, '127.0.0.1', res));
    const port = server.address().port;

    try {
      const response = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: JSON.parse(data) }));
        }).on('error', reject);
      });

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body.status, 'healthy');
      assert.ok(response.headers['content-security-policy'], 'Must have Content-Security-Policy header');
      assert.ok(response.headers['x-content-type-options'], 'Must have X-Content-Type-Options header');
      assert.strictEqual(response.headers['x-content-type-options'], 'nosniff');
    } finally {
      server.close();
    }
  });

  // 6. SPA Routing & 404 Handlers
  await itAsync('DEP-006: Server correctly handles SPA fallback vs API 404', async () => {
    const app = require('../server');
    const server = http.createServer(app);
    await new Promise(res => server.listen(0, '127.0.0.1', res));
    const port = server.address().port;

    try {
      // 1. API 404 returns JSON
      const api404 = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/api/non-existent-route-12345`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: JSON.parse(data) }));
        }).on('error', reject);
      });
      assert.strictEqual(api404.statusCode, 404);
      assert.ok(api404.body.error.includes('not found'));

      // 2. Clean URL client route returns SPA index.html (200 OK)
      const spaRoute = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/schools/achimota-school`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
        }).on('error', reject);
      });
      assert.strictEqual(spaRoute.statusCode, 200);
      assert.ok(spaRoute.headers['content-type'].includes('text/html'));
      assert.ok(spaRoute.body.includes('SkoolFinder Ghana'), 'Must return index.html for client route');
    } finally {
      server.close();
    }
  });

  console.log('======================================================================');
  console.log(`📊 Option A Deployment Readiness Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error in deployment test runner:', err);
  process.exit(1);
});
