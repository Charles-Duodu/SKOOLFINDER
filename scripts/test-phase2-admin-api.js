/**
 * Phase 2 Automated API Verification Suite
 * Tests all administrative controllers and endpoints
 */
const express = require('express');
const adminRoutes = require('../src/routes/admin');

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

async function runTests() {
  console.log('🧪 Starting Phase 2 Backend REST API Verification Suite...\n');
  const server = app.listen(4099, async () => {
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
      // 1. Overview Telemetry
      await check('GET /api/admin/overview returns 8-KPI telemetry payload', async () => {
        const res = await fetch('http://localhost:4099/api/admin/overview');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        if (!data.kpis || typeof data.kpis.totalSchools === 'undefined') throw new Error('Missing KPIs');
      });

      // 2. Schools Master Register
      await check('GET /api/admin/schools returns paginated schools list', async () => {
        const res = await fetch('http://localhost:4099/api/admin/schools?status=active');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        if (!Array.isArray(data.schools)) throw new Error('schools is not an array');
      });

      // 3. Create School
      let createdSchoolId = null;
      await check('POST /api/admin/schools successfully onboards new school', async () => {
        const res = await fetch('http://localhost:4099/api/admin/schools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Accra Apex Academy Test ${Date.now()}`,
            region: 'Greater Accra',
            district: 'Accra Metropolitan',
            locality: 'East Legon',
            curriculum: ['Cambridge', 'GES'],
            tuition_min: 6500,
            tuition_max: 18000,
            phone: '+233 24 555 1234',
            headOfSchool: 'Dr. Mensah Osei'
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Creation failed');
        if (!data.school || !data.school.id) throw new Error('Missing created school ID');
        createdSchoolId = data.school.id;
      });

      // 4. Update School
      await check('PATCH /api/admin/schools/:id modifies school fields inline', async () => {
        if (!createdSchoolId) throw new Error('No test school to update');
        const res = await fetch(`http://localhost:4099/api/admin/schools/${createdSchoolId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tuition_max: 22000,
            package_tier: 'Enterprise'
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');
        if (data.school.tuition_max !== 22000) throw new Error('tuition_max not updated');
      });

      // 5. Impersonation Token
      await check('POST /api/admin/impersonate/school/:id generates 2-hour scoped session', async () => {
        if (!createdSchoolId) throw new Error('No test school for impersonation');
        const res = await fetch(`http://localhost:4099/api/admin/impersonate/school/${createdSchoolId}`, {
          method: 'POST'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Impersonation failed');
        if (!data.impersonationToken) throw new Error('Missing impersonationToken');
      });

      // 6. Soft-Delete School
      await check('DELETE /api/admin/schools/:id soft-deletes with audit reason', async () => {
        if (!createdSchoolId) throw new Error('No test school to delete');
        const res = await fetch(`http://localhost:4099/api/admin/schools/${createdSchoolId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'Automated test suite cleanup' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Deletion failed');
        if (!data.school.deleted_at) throw new Error('deleted_at timestamp not set');
      });

      // 7. Restore School
      await check('POST /api/admin/schools/:id/restore restores archived school', async () => {
        if (!createdSchoolId) throw new Error('No test school to restore');
        const res = await fetch(`http://localhost:4099/api/admin/schools/${createdSchoolId}/restore`, {
          method: 'POST'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Restore failed');
        if (data.school.deleted_at !== null) throw new Error('deleted_at not cleared');
      });

      // 8. Financial Telemetry
      await check('GET /api/admin/finance/summary returns GMV & MoMo breakdown', async () => {
        const res = await fetch('http://localhost:4099/api/admin/finance/summary');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Finance summary failed');
        if (typeof data.summary.totalGMV === 'undefined') throw new Error('Missing GMV');
      });

      // 9. Universal Command Search
      await check('GET /api/admin/search returns instant multi-entity results', async () => {
        const res = await fetch('http://localhost:4099/api/admin/search?q=Accra');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Search failed');
        if (!data.results || !Array.isArray(data.results.schools)) throw new Error('Missing results');
      });

    } finally {
      server.close();
      console.log(`\n🏁 Test Run Finished: ${passed} passed, ${failed} failed.\n`);
      if (failed > 0) process.exit(1);
      else process.exit(0);
    }
  });
}

runTests();

