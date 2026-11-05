/**
 * SkoolFinder Ghana — Release 1 Verification Test Suite
 * Tests Unified Canonical Identity, Multi-Persona Extensions, and Persona Switching (DEC-001)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');

const authRouter = require('../src/routes/auth');
const { authenticate, requirePersona, JWT_SECRET } = require('../src/middleware/auth');

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);

// Test routes guarded by requirePersona
app.get('/api/test-protected-parent', authenticate, requirePersona('parent'), (req, res) => {
  res.json({ success: true, message: 'Access granted to Parent workspace', activePersona: req.user.activePersona });
});

app.get('/api/test-protected-teacher', authenticate, requirePersona('teacher', 'professional'), (req, res) => {
  res.json({ success: true, message: 'Access granted to Educator workspace', activePersona: req.user.activePersona });
});

app.get('/api/test-protected-school', authenticate, requirePersona('school_admin'), (req, res) => {
  res.json({ success: true, message: 'Access granted to School Admin workspace', activePersona: req.user.activePersona });
});

let server;
const PORT = 3299;
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
  console.log('\n🚀 Starting SkoolFinder Ghana — Release 1 Unified Identity Test Suite...\n');

  await new Promise(resolve => {
    server = app.listen(PORT, resolve);
  });

  try {
    // -------------------------------------------------------------
    // 1. Demo Login & Multi-Persona Session Claims
    // -------------------------------------------------------------
    console.log('--- 1. Multi-Persona Authentication Session Claims ---');

    const demoRes = await fetch(`${BASE_URL}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'school_admin' })
    });
    const demoData = await demoRes.json();
    assert(demoRes.status === 200 && demoData.token, 'POST /api/auth/demo-login issues JWT session token');
    assert(demoData.user && demoData.user.activePersona === 'school_admin', 'User session includes activePersona claim');
    assert(Array.isArray(demoData.user.availablePersonas) && demoData.user.availablePersonas.includes('parent'), 'School owner account preserves parent capability');

    const authToken = demoData.token;

    // -------------------------------------------------------------
    // 2. GET /api/auth/me Multi-Persona Resolution
    // -------------------------------------------------------------
    console.log('\n--- 2. GET /api/auth/me Persona Resolution ---');

    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user, 'GET /api/auth/me returns 200 with user profile');
    assert(meData.user.activePersona === 'school_admin', 'activePersona correctly resolved from session token');
    assert(Array.isArray(meData.user.availablePersonas), 'availablePersonas returns array of available roles');

    // -------------------------------------------------------------
    // 3. Persona-Scoped Authorization Middleware (requirePersona)
    // -------------------------------------------------------------
    console.log('\n--- 3. Persona-Scoped Authorization Middleware ---');

    // 3a. With activePersona='school_admin', access to school workspace succeeds (200)
    const schoolAccessRes = await fetch(`${BASE_URL}/api/test-protected-school`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const schoolAccessData = await schoolAccessRes.json();
    assert(schoolAccessRes.status === 200 && schoolAccessData.success === true, 'requirePersona("school_admin") allows access for active school persona');

    // 3b. With activePersona='school_admin', access to teacher-only workspace is blocked (403)
    const teacherAccessRes = await fetch(`${BASE_URL}/api/test-protected-teacher`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(teacherAccessRes.status === 403, 'requirePersona("teacher") blocks access when active persona is school_admin');

    // -------------------------------------------------------------
    // 4. Switching Active Persona (POST /api/auth/switch-persona)
    // -------------------------------------------------------------
    console.log('\n--- 4. Active Persona Switching (POST /api/auth/switch-persona) ---');

    // 4a. Switch persona to 'parent'
    const switchToParentRes = await fetch(`${BASE_URL}/api/auth/switch-persona`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ persona: 'parent' })
    });
    const parentSwitchData = await switchToParentRes.json();
    assert(switchToParentRes.status === 200 && parentSwitchData.success === true, 'Switching persona to "parent" returns 200 OK');
    assert(parentSwitchData.activePersona === 'parent', 'Response confirms activePersona is "parent"');
    assert(parentSwitchData.token, 'Response provides refreshed JWT with new persona claim');

    const parentToken = parentSwitchData.token;

    // 4b. With new parent token, access to parent workspace succeeds
    const parentAccessRes = await fetch(`${BASE_URL}/api/test-protected-parent`, {
      headers: { Authorization: `Bearer ${parentToken}` }
    });
    assert(parentAccessRes.status === 200, 'Switched parent token now allows access to parent workspace');

    // 4c. Switch persona to 'teacher'
    const switchToTeacherRes = await fetch(`${BASE_URL}/api/auth/switch-persona`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`
      },
      body: JSON.stringify({ persona: 'teacher' })
    });
    const teacherSwitchData = await switchToTeacherRes.json();
    assert(switchToTeacherRes.status === 200 && teacherSwitchData.activePersona === 'teacher', 'Switching persona to "teacher" returns 200 OK');

    const teacherToken = teacherSwitchData.token;

    // 4d. With teacher token, access to teacher workspace succeeds
    const teacherAccessAfterSwitchRes = await fetch(`${BASE_URL}/api/test-protected-teacher`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    assert(teacherAccessAfterSwitchRes.status === 200, 'Switched teacher token now allows access to teacher workspace');

    // 4e. Non-admin user cannot escalate to 'super_admin' persona (403 Forbidden)
    const unauthorizedEscalationRes = await fetch(`${BASE_URL}/api/auth/switch-persona`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`
      },
      body: JSON.stringify({ persona: 'super_admin' })
    });
    assert(unauthorizedEscalationRes.status === 403, 'Rejects unauthorized escalation to super_admin persona with 403 Forbidden');

    // -------------------------------------------------------------
    // 5. Super Admin Multi-Persona Switching
    // -------------------------------------------------------------
    console.log('\n--- 5. Super Admin Global Persona Switching ---');

    const superAdminToken = jwt.sign({
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@skoolfinder.com.gh',
      role: 'super_admin',
      activePersona: 'super_admin'
    }, JWT_SECRET);

    const superSwitchRes = await fetch(`${BASE_URL}/api/auth/switch-persona`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${superAdminToken}`
      },
      body: JSON.stringify({ persona: 'super_admin' })
    });
    const superSwitchData = await superSwitchRes.json();
    assert(superSwitchRes.status === 200 && superSwitchData.activePersona === 'super_admin', 'Super Admin permitted to switch to super_admin persona');

    console.log('\n========================================');
    console.log(`Release 1 Verification Results: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('========================================\n');

  } catch (err) {
    console.error('Fatal test error:', err);
    failedTests++;
  } finally {
    if (server) server.close();
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

runTests();
