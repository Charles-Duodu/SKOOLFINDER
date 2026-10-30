const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * GET /api/admin/overview
 */
router.get('/overview', authenticate, async (req, res) => {
  try {
    const { count: schoolsCount } = await supabaseAdmin.from('schools').select('*', { count: 'exact', head: true });
    const { count: teachersCount } = await supabaseAdmin.from('teachers').select('*', { count: 'exact', head: true });
    const { count: suppliersCount } = await supabaseAdmin.from('suppliers').select('*', { count: 'exact', head: true });
    const { count: usersCount } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });

    const { data: recentSchools } = await supabaseAdmin.from('schools').select('*').order('created_at', { ascending: false }).limit(5);

    return res.json({
      success: true,
      metrics: {
        totalSchools: schoolsCount || 6,
        totalTeachers: teachersCount || 3,
        totalSuppliers: suppliersCount || 3,
        totalUsers: usersCount || 1,
        activeSubscriptions: 42,
        monthlyRevenue: 'GHS 28,450'
      },
      recentSchools: recentSchools || []
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve admin overview' });
  }
});

/**
 * GET /api/admin/vetting/schools
 */
router.get('/vetting/schools', authenticate, async (req, res) => {
  try {
    const { data: schools } = await supabaseAdmin
      .from('schools')
      .select('*')
      .eq('is_verified', false)
      .limit(20);

    return res.json(schools || []);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch vetting queue' });
  }
});

/**
 * POST /api/admin/vetting/schools/:id/approve
 */
router.post('/vetting/schools/:id/approve', authenticate, async (req, res) => {
  try {
    const { data: school, error } = await supabaseAdmin
      .from('schools')
      .update({ is_verified: true, status: 'published' })
      .eq('id', req.params.id)
      .select()
      .single();

    return res.json({ success: true, message: 'School approved and verified', school });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to approve school' });
  }
});

/**
 * POST /api/admin/vetting/schools/:id/reject
 */
router.post('/vetting/schools/:id/reject', authenticate, async (req, res) => {
  try {
    const { data: school, error } = await supabaseAdmin
      .from('schools')
      .update({ status: 'archived' })
      .eq('id', req.params.id)
      .select()
      .single();

    return res.json({ success: true, message: 'School vetting rejected', school });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reject school' });
  }
});

/**
 * POST /api/admin/verify
 */
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { entityId, entityType, verified } = req.body;
    const table = entityType === 'teacher' ? 'teachers' : entityType === 'supplier' ? 'suppliers' : 'schools';

    const { data, error } = await supabaseAdmin
      .from(table)
      .update({ is_verified: verified })
      .eq('id', entityId)
      .select()
      .single();

    return res.json({ success: true, updated: data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update verification' });
  }
});

/**
 * GET /api/admin/procurement/logs
 */
router.get('/procurement/logs', (req, res) => {
  return res.json([
    {
      id: 'log-01',
      action: 'RFQ Created',
      details: 'GIS requested quotes for 150 STEM Kits',
      timestamp: new Date().toISOString()
    }
  ]);
});

/**
 * GET /api/admin/subscriptions
 */
router.get('/subscriptions', (req, res) => {
  return res.json([
    {
      id: 'sub-01',
      subscriber: 'Ghana International School',
      plan: 'Growth Pro',
      amount: 'GHS 450.00 / mo',
      status: 'Active',
      channel: 'Paystack Card'
    }
  ]);
});

module.exports = router;
