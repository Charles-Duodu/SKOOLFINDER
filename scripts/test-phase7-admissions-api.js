/**
 * Phase 7 Automated Verification Suite - Admissions, Teacher NTC & B2B Tenders
 */
const express = require('express');
const adminRoutes = require('../src/routes/admin');

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

async function runTests() {
  console.log('🧪 Starting Phase 7 Admissions, Teachers NTC & Procurement Verification Suite...\n');
  const server = app.listen(4399, async () => {
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
      // 1. Inbound Admissions List
      await check('GET /api/admin/admissions returns candidate applications', async () => {
        const res = await fetch('http://localhost:4399/api/admin/admissions');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!Array.isArray(data.applications) || data.applications.length < 5) throw new Error('Expected at least 5 applications');
      });

      // 2. Admission Status Override
      await check('PATCH /api/admin/admissions/:id/status overrides candidate status', async () => {
        const res = await fetch('http://localhost:4399/api/admin/admissions/app-gh-01/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'admitted' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.application.status !== 'admitted') throw new Error('Status not updated to admitted');
      });

      // 3. Teachers NTC Register
      await check('GET /api/admin/teachers returns educator directory with NTC license numbers', async () => {
        const res = await fetch('http://localhost:4399/api/admin/teachers');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!Array.isArray(data.teachers) || data.teachers.length < 5) throw new Error('Expected teachers list');
        if (!data.teachers.some(t => t.ntcLicense && t.ntcLicense.includes('NTC'))) throw new Error('Missing NTC licenses');
      });

      // 4. Toggle Teacher NTC Verification
      await check('PATCH /api/admin/teachers/:id/verify toggles NTC license verification badge', async () => {
        const res = await fetch('http://localhost:4399/api/admin/teachers/tch-05/verify', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verified: true })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.teacher.verified !== true) throw new Error('Teacher verification not updated');
      });

      // 5. Procurement RFQs
      await check('GET /api/admin/procurement/rfqs returns institutional tenders', async () => {
        const res = await fetch('http://localhost:4399/api/admin/procurement/rfqs');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!Array.isArray(data.rfqs) || data.rfqs.length < 3) throw new Error('Expected tenders');
      });

      // 6. Create Institutional Tender
      let createdRfqId = null;
      await check('POST /api/admin/procurement/rfqs publishes new institutional tender', async () => {
        const res = await fetch('http://localhost:4399/api/admin/procurement/rfqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Supply of 30 Commercial Campus Solar Streetlights',
            schoolName: 'Presbyterian Boys Secondary School (PRESEC)',
            category: 'Solar & Electrical Infrastructure',
            budgetRange: 'GH₵ 60,000 - 80,000',
            quantity: '30 Complete Solar Poles'
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.rfq.status !== 'Open') throw new Error('Status not open');
        createdRfqId = data.rfq.id;
      });

      // 7. Update RFQ Status
      await check('PATCH /api/admin/procurement/rfqs/:id/status updates tender stage to Awarded', async () => {
        const res = await fetch(`http://localhost:4399/api/admin/procurement/rfqs/${createdRfqId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Awarded' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.rfq.status !== 'Awarded') throw new Error('RFQ status not updated');
      });

      // 8. Suppliers Register
      await check('GET /api/admin/procurement/suppliers returns educational suppliers with TIN', async () => {
        const res = await fetch('http://localhost:4399/api/admin/procurement/suppliers');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!Array.isArray(data.suppliers) || data.suppliers.length < 4) throw new Error('Expected suppliers');
      });

      // 9. Accredit Supplier
      await check('PATCH /api/admin/procurement/suppliers/:id/verify grants vendor accreditation badge', async () => {
        const res = await fetch('http://localhost:4399/api/admin/procurement/suppliers/sup-04/verify', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verified: true })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.supplier.verified !== true) throw new Error('Supplier accreditation not updated');
      });

    } finally {
      server.close();
      console.log(`\n========================================`);
      console.log(`Phase 7 Test Results: ${passed} PASSED, ${failed} FAILED`);
      console.log(`========================================\n`);
      if (failed > 0) process.exit(1);
    }
  });
}

runTests();

