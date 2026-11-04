/**
 * SkoolFinder Ghana - Event Webhooks & Notification Settings Express Router
 */

const express = require('express');
const router = express.Router();
const { WebhookService } = require('../services/webhookService');

// Get supported domain events list
router.get('/events', (req, res) => {
  res.json({
    success: true,
    events: WebhookService.getSupportedEvents()
  });
});

// Register webhook subscription
router.post('/school/:schoolId/subscribe', async (req, res, next) => {
  try {
    const result = await WebhookService.registerWebhook(req.params.schoolId, req.body, req.user);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// Get school webhooks
router.get('/school/:schoolId', async (req, res, next) => {
  try {
    const result = await WebhookService.getSchoolWebhooks(req.params.schoolId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Dispatch test event
router.post('/school/:schoolId/test-dispatch', async (req, res, next) => {
  try {
    const { eventName = 'ParentEnquirySubmitted', data = {} } = req.body;
    const result = await WebhookService.dispatchEvent(req.params.schoolId, eventName, data, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get deliveries log
router.get('/school/:schoolId/deliveries', async (req, res, next) => {
  try {
    const result = await WebhookService.getWebhookDeliveries(req.params.schoolId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get notification preferences
router.get('/school/:schoolId/preferences', (req, res) => {
  const result = WebhookService.getNotificationPreferences(req.params.schoolId);
  res.json(result);
});

// Update notification preferences
router.put('/school/:schoolId/preferences', async (req, res, next) => {
  try {
    const result = await WebhookService.updateNotificationPreferences(req.params.schoolId, req.body, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/school/:schoolId/preferences', async (req, res, next) => {
  try {
    const result = await WebhookService.updateNotificationPreferences(req.params.schoolId, req.body, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Generate WhatsApp preview payload
router.post('/whatsapp/preview', (req, res) => {
  const { phone, template, vars } = req.body;
  const result = WebhookService.formatWhatsAppPayload(phone || '+233245551212', template || 'admission_offer', vars || {});
  res.json({ success: true, payload: result });
});

module.exports = router;

