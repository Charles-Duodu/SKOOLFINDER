/**
 * Phase 5 Automated Verification Suite - User & Role Governance
 */
const express = require('express');
const adminRoutes = require('../src/routes/admin');

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

async function runTests() {
  console.log('🧪 Starting Phase 5 User & Role Governance API Verification Suite...\n');
  const server = app.listen(4199, async () => {
    let passed = 0;
    let failed = 0;

    async function check(name, fn) {
      try {
        await fn();
        console.log(`  ✓ [PASS] ${name}`);
        passed++;
      } catch (err) {
        console.error(`  ✕ [FAIL] ${name}:`, err.message);
        failed++;
      }
    }

    try {
      // 1. Get Users
      await check('GET /api/admin/users returns rich Ghanaian user directory', async () => {
        const res = await fetch('http://localhost:4199/api/admin/users');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!Array.isArray(data.users) || data.users.length < 8) throw new Error(`Expected at least 8 users, got ${data.users?.length}`);
      });

      // 2. Filter by Role
      await check('GET /api/admin/users?role=teacher returns teachers only', async () => {
        const res = await fetch('http://localhost:4199/api/admin/users?role=teacher');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!data.users.every(u => u.role === 'teacher')) throw new Error('Returned non-teacher');
      });

      // 3. Filter by Status
      await check('GET /api/admin/users?status=suspended returns suspended users', async () => {
        const res = await fetch('http://localhost:4199/api/admin/users?status=suspended');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!data.users.every(u => u.status === 'suspended')) throw new Error('Returned non-suspended user');
      });

      // 4. Create User
      let createdId = null;
      await check('POST /api/admin/users creates a new platform user', async () => {
        const res = await fetch('http://localhost:4199/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: 'Test Administrator Kofi',
            email: `test.admin.${Date.now()}@skoolfinder.com.gh`,
            phone: '+233 24 111 2233',
            role: 'school_admin'
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.user.role !== 'school_admin') throw new Error('Role mismatch');
        createdId = data.user.id;
      });

      // 5. Suspend User
      await check('PATCH /api/admin/users/:id/status toggles account to suspended', async () => {
        const res = await fetch(`http://localhost:4199/api/admin/users/${createdId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'suspended' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.user.status !== 'suspended') throw new Error('Status not updated to suspended');
      });

      // 6. Reactivate User
      await check('PATCH /api/admin/users/:id/status reactivates account', async () => {
        const res = await fetch(`http://localhost:4199/api/admin/users/${createdId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'active' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.user.status !== 'active') throw new Error('Status not updated to active');
      });

      // 7. Reassign User Role
      await check('PATCH /api/admin/users/:id/role reassigns platform role', async () => {
        const res = await fetch(`http://localhost:4199/api/admin/users/${createdId}/role`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'super_admin' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.user.role !== 'super_admin') throw new Error('Role not updated to super_admin');
      });

    } finally {
      server.close();
      console.log(`\n========================================`);
      console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
      console.log(`========================================\n`);
      if (failed > 0) process.exit(1);
    }
  });
}

runTests();

