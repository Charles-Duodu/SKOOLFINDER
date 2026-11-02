/**
 * Phase 6 Automated Verification Suite - Financial, MoMo & Subscription Command Desk
 */
const express = require('express');
const adminRoutes = require('../src/routes/admin');

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

async function runTests() {
  console.log('🧪 Starting Phase 6 Financial & MoMo Command Desk Verification Suite...\n');
  const server = app.listen(4299, async () => {
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
      // 1. Finance Summary
      await check('GET /api/admin/finance/summary returns GMV, MoMo rails and stream breakdown', async () => {
        const res = await fetch('http://localhost:4299/api/admin/finance/summary');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!data.summary || typeof data.summary.totalGMV === 'undefined') throw new Error('Missing GMV');
        if (!data.summary.rails || !data.summary.rails.mtn) throw new Error('Missing MoMo rails breakdown');
      });

      // 2. Transactions Ledger
      await check('GET /api/admin/finance/transactions returns transactions list', async () => {
        const res = await fetch('http://localhost:4299/api/admin/finance/transactions');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!Array.isArray(data.transactions) || data.transactions.length < 5) throw new Error('Expected at least 5 transactions');
      });

      // 3. Filter Transactions by Channel
      await check('GET /api/admin/finance/transactions?channel=MTN filters by MTN MoMo', async () => {
        const res = await fetch('http://localhost:4299/api/admin/finance/transactions?channel=MTN');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!data.transactions.every(t => t.channel.includes('MTN'))) throw new Error('Returned non-MTN rail');
      });

      // 4. Admission Vouchers Register
      await check('GET /api/admin/finance/vouchers returns admission vouchers with face values', async () => {
        const res = await fetch('http://localhost:4299/api/admin/finance/vouchers');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!Array.isArray(data.vouchers) || data.vouchers.length < 4) throw new Error('Expected vouchers');
      });

      // 5. School SaaS Subscriptions Register
      await check('GET /api/admin/finance/subscriptions returns campus subscription tiers', async () => {
        const res = await fetch('http://localhost:4299/api/admin/finance/subscriptions');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (!Array.isArray(data.subscriptions) || data.subscriptions.length < 5) throw new Error('Expected subscriptions');
      });

      // 6. Update Subscription (Extend Grace Period & Tier)
      await check('PATCH /api/admin/finance/subscriptions/:id adjusts plan and extends grace period', async () => {
        const res = await fetch('http://localhost:4299/api/admin/finance/subscriptions/sub-sch-morningstar', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            extend_grace_days: 14,
            plan: 'Enterprise Tier'
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.subscription.plan !== 'Enterprise Tier') throw new Error('Plan not updated');
      });

      // 7. Re-verify Transaction
      await check('POST /api/admin/finance/verify-transaction/:ref re-verifies gateway status', async () => {
        const res = await fetch('http://localhost:4299/api/admin/finance/verify-transaction/SF-MOMO-229104', {
          method: 'POST'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        if (data.transaction.status !== 'success') throw new Error('Status not verified');
      });

    } finally {
      server.close();
      console.log(`\n========================================`);
      console.log(`Phase 6 Test Results: ${passed} PASSED, ${failed} FAILED`);
      console.log(`========================================\n`);
      if (failed > 0) process.exit(1);
    }
  });
}

runTests();

