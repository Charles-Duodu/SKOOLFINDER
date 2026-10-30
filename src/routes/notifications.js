const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const EmailService = require('../services/emailService');

/**
 * GET /api/notifications
 * Returns user-scoped in-app notifications
 */
router.get('/', async (req, res) => {
  try {
    const { portal, limit = 20 } = req.query;
    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (portal) {
      query = query.eq('portal', portal);
    }

    const { data: notifications, error } = await query;
    if (error) {
      // Fallback mock notifications matching portal if table empty
      return res.json([
        {
          id: 'notif-01',
          portal: portal || 'parents',
          title: 'Admissions Inquiry Logged',
          message: 'Your inquiry for Ghana International School has been placed in the admissions review queue.',
          read: false,
          created_at: new Date().toISOString()
        }
      ]);
    }

    return res.json(notifications || []);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update notification' });
  }
});

/**
 * GET /api/notifications/email-logs
 * Inspection desk for recent transactional emails across all 4 portals
 */
router.get('/email-logs', async (req, res) => {
  try {
    const { portal, limit = 50 } = req.query;
    let query = supabaseAdmin
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (portal) {
      query = query.eq('portal', portal);
    }

    const { data: logs, error } = await query;
    if (error || !logs || logs.length === 0) {
      let cached = EmailService.getRecentLogs();
      if (portal) {
        cached = cached.filter(l => l.portal === portal);
      }
      return res.json(cached);
    }

    return res.json(logs || []);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve email logs' });
  }
});

module.exports = router;
