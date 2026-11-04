/**
 * SkoolFinder Ghana - Event Webhooks & Multi-Channel Alerts Express Router
 * Baseline: Blueprint v2.0 Module 15, Prompt §7.15 & §12
 * 
 * Route Security:
 * - Bearer Token Authentication (Internal JWT / Supabase Auth)
 * - Strict Multi-Tenant School Access Authorization (RLS & school_memberships)
 * - SSRF Protection on Webhook Registration
 */

const express = require('express');
const router = express.Router();
const { WebhookService } = require('../services/webhookService');
const { authenticate } = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');
const { IN_MEMORY_MEMBERSHIPS } = require('../services/schoolOwnerService');

/**
 * Tenant Scoping Middleware: Enforces that the authenticated user
 * has verified administrative rights to the target schoolId.
 */
async function requireSchoolAccess(req, res, next) {
  try {
    const schoolId = req.params.schoolId;
    if (!schoolId) {
      return res.status(400).json({ success: false, error: 'School identifier is required.' });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    // Platform Super Admin has universal operational oversight
    if (user.role === 'super_admin') {
      return next();
    }

    // Direct match if session token has school_id bound
    if (user.school_id && (user.school_id === schoolId || user.schoolId === schoolId)) {
      return next();
    }

    // Check school_memberships in Supabase Cloud
    try {
      const { data: membership, error } = await supabaseAdmin
        .from('school_memberships')
        .select('id, role, status')
        .eq('school_id', schoolId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (!error && membership) {
        req.schoolMembership = membership;
        return next();
      }
    } catch (dbErr) {
      // Continue to fallback check
    }

    // Resilient fallback: Check in-memory memberships
    const inMem = IN_MEMORY_MEMBERSHIPS?.find(
      m => (m.school_id === schoolId || m.school_slug === schoolId) &&
           (m.user_id === user.id || m.email === user.email) &&
           m.status === 'active'
    );

    if (inMem) {
      req.schoolMembership = inMem;
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Forbidden: You do not have verified administrative access to this school institution.'
    });
  } catch (err) {
    console.error('Tenant authorization check error:', err);
    return res.status(500).json({ success: false, error: 'Tenant authorization verification failure.' });
  }
}

// ============================================================================
// PUBLIC & REFERENCE ENDPOINTS
// ============================================================================

// Get supported domain events list
router.get('/events', (req, res) => {
  res.json({
    success: true,
    events: WebhookService.getSupportedEvents()
  });
});

// Generate WhatsApp preview payload
router.post('/whatsapp/preview', (req, res) => {
  const { phone, template, vars } = req.body;
  const result = WebhookService.formatWhatsAppPayload(
    phone || '+233245551212',
    template || 'admission_offer',
    vars || {}
  );
  res.json({ success: true, payload: result });
});

// ============================================================================
// PROTECTED SCHOOL-SCOPED WEBHOOK & NOTIFICATION ENDPOINTS
// ============================================================================

// Register or update outbound webhook subscription
router.post('/school/:schoolId/subscribe', authenticate, requireSchoolAccess, async (req, res, next) => {
  try {
    const result = await WebhookService.registerWebhook(req.params.schoolId, req.body, req.user);
    res.status(201).json(result);
  } catch (err) {
    if (err.message.includes('SSRF') || err.message.includes('HTTPS') || err.message.includes('URL')) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next(err);
  }
});

// Get school webhooks configuration
router.get('/school/:schoolId', authenticate, requireSchoolAccess, async (req, res, next) => {
  try {
    const result = await WebhookService.getSchoolWebhooks(req.params.schoolId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Dispatch test domain event ping
router.post('/school/:schoolId/test-dispatch', authenticate, requireSchoolAccess, async (req, res, next) => {
  try {
    const { eventName = 'AdmissionOfferIssued', data = {} } = req.body;
    const result = await WebhookService.dispatchEvent(req.params.schoolId, eventName, data, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get webhook deliveries audit logs
router.get('/school/:schoolId/deliveries', authenticate, requireSchoolAccess, async (req, res, next) => {
  try {
    const result = await WebhookService.getWebhookDeliveries(req.params.schoolId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get notification preferences
router.get('/school/:schoolId/preferences', authenticate, requireSchoolAccess, async (req, res, next) => {
  try {
    const result = await WebhookService.getNotificationPreferences(req.params.schoolId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Update notification preferences (PUT & POST)
router.put('/school/:schoolId/preferences', authenticate, requireSchoolAccess, async (req, res, next) => {
  try {
    const result = await WebhookService.updateNotificationPreferences(req.params.schoolId, req.body, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/school/:schoolId/preferences', authenticate, requireSchoolAccess, async (req, res, next) => {
  try {
    const result = await WebhookService.updateNotificationPreferences(req.params.schoolId, req.body, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Dispatch WhatsApp message via Meta Cloud API / Staged Driver
router.post('/school/:schoolId/whatsapp/dispatch', authenticate, requireSchoolAccess, async (req, res, next) => {
  try {
    const { recipientPhone, templateType = 'admission_offer', templateVars = {} } = req.body;
    if (!recipientPhone) {
      return res.status(400).json({ success: false, error: 'Recipient phone number is required.' });
    }
    const result = await WebhookService.dispatchWhatsAppMessage(
      req.params.schoolId,
      recipientPhone,
      templateType,
      templateVars,
      req.user
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
