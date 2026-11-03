/**
 * Automated Verification: Blueprint v4.2 Phase 4
 * Parent Productivity: Command Centre, 5-State Decision Board & Planning Studio
 */
const assert = require('assert');
const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/middleware/auth');

async function runPhase4Tests() {
  console.log('🚀 Starting Blueprint v4.2 Phase 4 Verification Suite...\n');
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
  test('ParentPortalView source implements Phase 4 Decision Engine tabs', () => {
    const viewContent = fs.readFileSync(path.resolve('public/js/views/parentPortalView.js'), 'utf8');
    assert.ok(viewContent.includes('renderOverviewTab'), 'Must implement renderOverviewTab');
    assert.ok(viewContent.includes('renderShortlistsTab'), 'Must implement renderShortlistsTab');
    assert.ok(viewContent.includes('renderJourneyTab'), 'Must implement renderJourneyTab');
    assert.ok(viewContent.includes('renderPlanningTab'), 'Must implement renderPlanningTab');
    assert.ok(viewContent.includes('getNextBestStep'), 'Must implement getNextBestStep rule engine');
    assert.ok(viewContent.includes('sel-shortlist-stage'), 'Must render stage selector for 5-state funnel');
    assert.ok(viewContent.includes('btn-toggle-priority'), 'Must render priority star toggle');
    assert.ok(viewContent.includes('txt-shortlist-notes'), 'Must render private notes textarea');
    assert.ok(viewContent.includes('chk-plan-doc'), 'Must render admissions document checklist');
  });

  test('API client exposes getParentShortlists, updateParentShortlist, and removeParentShortlist', () => {
    const apiContent = fs.readFileSync(path.resolve('public/js/api.js'), 'utf8');
    assert.ok(apiContent.includes('async getParentShortlists()'), 'API must expose getParentShortlists');
    assert.ok(apiContent.includes('async updateParentShortlist('), 'API must expose updateParentShortlist');
    assert.ok(apiContent.includes('async removeParentShortlist('), 'API must expose removeParentShortlist');
  });

  test('Phase 4 SQL migration file exists', () => {
    const sqlPath = path.resolve('sql/phase4_parent_shortlists.sql');
    assert.ok(fs.existsSync(sqlPath), 'sql/phase4_parent_shortlists.sql must exist');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    assert.ok(sqlContent.includes('parent_shortlists'), 'Migration must define parent_shortlists');
    assert.ok(sqlContent.includes('considering'), 'Migration must enforce 5 stages');
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
    const testParentId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
    const parentToken = jwt.sign(
      {
        id: testParentId,
        auth_user_id: testParentId,
        email: 'parent.phase4@skoolfinder.gh',
        role: 'parent',
        full_name: 'Dr. Kwame Bediako'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Test 4: Shortlists endpoints require authentication
    await testAsync('GET /api/parents/shortlists requires auth', async () => {
      const res = await fetch(`${baseUrl}/api/parents/shortlists`);
      assert.strictEqual(res.status, 401, 'Should return 401 Unauthorized');
    });

    await testAsync('POST /api/parents/shortlists requires auth', async () => {
      const res = await fetch(`${baseUrl}/api/parents/shortlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId: 'sch-gis-accra' })
      });
      assert.strictEqual(res.status, 401, 'Should return 401 Unauthorized');
    });

    // Test 5: POST /api/parents/shortlists validates payload
    await testAsync('POST /api/parents/shortlists validates schoolId presence', async () => {
      const res = await fetch(`${baseUrl}/api/parents/shortlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${parentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      assert.strictEqual(res.status, 400, 'Should return 400 when schoolId is missing');
    });

    // Test 6: POST /api/parents/shortlists adds school to Considering stage with private notes
    await testAsync('POST /api/parents/shortlists saves school to Considering stage with notes', async () => {
      const res = await fetch(`${baseUrl}/api/parents/shortlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${parentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schoolId: 'sch-gis-accra',
          stage: 'considering',
          priority: false,
          notes: 'Looking at Cambridge primary class 4 admission.'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200, 'Should return 200 OK');
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.item.schoolId, 'sch-gis-accra');
      assert.strictEqual(data.item.stage, 'considering');
      assert.strictEqual(data.item.notes, 'Looking at Cambridge primary class 4 admission.');
    });

    // Test 7: POST /api/parents/shortlists updates school to Preferred with priority
    await testAsync('POST /api/parents/shortlists moves school to Preferred stage and toggles priority', async () => {
      const res = await fetch(`${baseUrl}/api/parents/shortlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${parentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schoolId: 'sch-gis-accra',
          stage: 'preferred',
          priority: true,
          notes: 'Confirmed top choice after phone inquiry with admissions desk.'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200, 'Should return 200 OK');
      assert.strictEqual(data.item.stage, 'preferred');
      assert.strictEqual(data.item.priority, true);
    });

    // Test 8: GET /api/parents/shortlists returns enriched list with computed stage counts
    await testAsync('GET /api/parents/shortlists returns enriched shortlists and accurate counts', async () => {
      const res = await fetch(`${baseUrl}/api/parents/shortlists`, {
        headers: { 'Authorization': `Bearer ${parentToken}` }
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200, 'Should return 200 OK');
      assert.strictEqual(data.success, true);
      assert.ok(Array.isArray(data.shortlists), 'shortlists must be an array');
      assert.ok(data.counts, 'counts must be present');
      assert.strictEqual(data.counts.preferred, 1, 'Should have 1 school in preferred');
      assert.strictEqual(data.counts.total, 1, 'Total shortlists count should be 1');
    });

    // Test 9: DELETE /api/parents/shortlists/:schoolId removes the record
    await testAsync('DELETE /api/parents/shortlists/:schoolId removes school from shortlist', async () => {
      const res = await fetch(`${baseUrl}/api/parents/shortlists/sch-gis-accra`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${parentToken}` }
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200, 'Should return 200 OK');
      assert.strictEqual(data.success, true);

      // Verify removal
      const getRes = await fetch(`${baseUrl}/api/parents/shortlists`, {
        headers: { 'Authorization': `Bearer ${parentToken}` }
      });
      const getData = await getRes.json();
      assert.strictEqual(getData.counts.total, 0, 'Total shortlists should now be 0');
    });

    console.log(`\n🎉 Phase 4 Verification Complete: ${passed}/${total} tests passed!\n`);
  } finally {
    server.close();
  }
}

runPhase4Tests().catch((err) => {
  console.error('\n❌ Phase 4 verification suite failed:', err);
  process.exit(1);
});
