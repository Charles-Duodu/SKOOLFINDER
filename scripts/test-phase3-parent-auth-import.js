/**
 * Automated Verification: Blueprint v4.2 Phase 3
 * Progressive Parent Accounts & Smart Guest Context Import
 */
const assert = require('assert');
const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/middleware/auth');

async function runPhase3Tests() {
  console.log('🚀 Starting Blueprint v4.2 Phase 3 Verification Suite...\n');
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      throw err;
    }
  }

  async function testAsync(name, fn) {
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

  // 1. Static Verification: Source code inspection
  test('Theme B & Data Protection Act 2012 compliance in Parent Auth modal', () => {
    const modalsContent = fs.readFileSync(path.resolve('public/js/components/modals.js'), 'utf8');
    assert.ok(modalsContent.includes('openParentAuthModal'), 'Modals must expose openParentAuthModal');
    assert.ok(modalsContent.includes('openGuestImportModal'), 'Modals must expose openGuestImportModal');
    assert.ok(modalsContent.includes('mreg-parent-password-confirm'), 'Parent registration must include confirm password field');
    assert.ok(modalsContent.includes('mreg-password-match-hint'), 'Parent registration must include live password match hint');
    assert.ok(modalsContent.includes('Data Protection Act 2012'), 'Must mention Act 843 compliance banner');
    assert.ok(!modalsContent.includes('mreg-target-school'), 'Must NOT force a single target school dropdown at registration');
  });

  test('Navbar links use openParentAuthModal', () => {
    const navbarContent = fs.readFileSync(path.resolve('public/js/components/navbar.js'), 'utf8');
    assert.ok(navbarContent.includes("Modals.openParentAuthModal({ initialTab: 'signin' })"), 'Sign In button must open Parent Auth modal');
    assert.ok(navbarContent.includes("Modals.openParentAuthModal({ initialTab: 'signup' })"), 'Parent Sign Up button must open Parent Auth modal on signup tab');
  });

  test('API client exposes importGuestContext', () => {
    const apiContent = fs.readFileSync(path.resolve('public/js/api.js'), 'utf8');
    assert.ok(apiContent.includes('async importGuestContext(data)'), 'API must expose importGuestContext method');
    assert.ok(apiContent.includes('/parents/import-guest-context'), 'API must call /parents/import-guest-context');
  });

  test('Zero mock wards (no "Kojo Duodu" fallback) in parents route', () => {
    const parentsRouteContent = fs.readFileSync(path.resolve('src/routes/parents.js'), 'utf8');
    assert.ok(!parentsRouteContent.includes('Kojo Duodu'), 'parents route must not return fake Kojo Duodu student');
    assert.ok(parentsRouteContent.includes('/import-guest-context'), 'parents route must define /import-guest-context');
  });

  // 2. Integration Tests against live Express server
  const app = express();
  app.use(express.json());
  app.use(cors());

  const authRoutes = require('../src/routes/auth');
  const parentsRoutes = require('../src/routes/parents');
  app.use('/api/auth', authRoutes);
  app.use('/api/parents', parentsRoutes);
  app.use('/api/parent', parentsRoutes);

  const PORT = 4899;
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`  🌐 Test server active on http://127.0.0.1:${PORT}`);
      resolve();
    });
  });

  const baseUrl = `http://127.0.0.1:${PORT}`;

  try {
    // Generate valid test parent token
    const testParentId = 'test-parent-uuid-0001';
    const parentToken = jwt.sign(
      {
        id: testParentId,
        auth_user_id: testParentId,
        email: 'test.parent.phase3@skoolfinder.gh',
        role: 'parent',
        full_name: 'Abena Mensah'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Test 5: GET /api/parents/overview returns empty wards array when none linked
    await testAsync('GET /api/parents/overview returns clean empty wards array', async () => {
      const res = await fetch(`${baseUrl}/api/parents/overview`, {
        headers: { 'Authorization': `Bearer ${parentToken}` }
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200, 'Should return 200 OK');
      assert.strictEqual(data.success, true, 'Should return success: true');
      assert.ok(Array.isArray(data.linkedWards), 'linkedWards should be an array');
      assert.strictEqual(data.linkedWards.length, 0, 'New parent should have 0 default wards');
    });

    // Test 6: POST /api/parents/import-guest-context requires auth
    await testAsync('POST /api/parents/import-guest-context requires authentication', async () => {
      const res = await fetch(`${baseUrl}/api/parents/import-guest-context`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolIds: ['sch-gis-accra'] })
      });
      assert.strictEqual(res.status, 401, 'Unauthenticated request should return 401');
    });

    // Test 7: POST /api/parents/import-guest-context validates schoolIds payload
    await testAsync('POST /api/parents/import-guest-context validates schoolIds', async () => {
      const res = await fetch(`${baseUrl}/api/parents/import-guest-context`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${parentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ schoolIds: [] })
      });
      assert.strictEqual(res.status, 400, 'Empty schoolIds array should return 400 Bad Request');
    });

    // Test 8: POST /api/parents/import-guest-context processes import successfully
    await testAsync('POST /api/parents/import-guest-context imports guest schools', async () => {
      const res = await fetch(`${baseUrl}/api/parents/import-guest-context`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${parentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schoolIds: ['sch-gis-accra', 'sch-sos-tema']
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200, 'Should return 200 OK');
      assert.strictEqual(data.success, true, 'Should return success: true');
      assert.ok(typeof data.importedCount === 'number', 'importedCount must be a number');
      assert.ok(typeof data.totalSaved === 'number', 'totalSaved must be a number');
      assert.ok(data.message.includes('school(s)'), 'Message should confirm school import');
    });

    console.log(`\n🎉 Phase 3 Verification Complete: ${passed}/${total} tests passed!\n`);
  } finally {
    server.close();
  }
}

runPhase3Tests().catch((err) => {
  console.error('\n❌ Phase 3 verification suite failed:', err);
  process.exit(1);
});
