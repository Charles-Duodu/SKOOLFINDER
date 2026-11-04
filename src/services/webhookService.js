/**
 * SkoolFinder Ghana - Event Webhooks & Omnichannel Automated Notifications Service
 * Baseline: Blueprint v2.0 Module 15, Prompt §7.15 & §12
 * 
 * Functional Deliverables:
 * - Domain Event Subscription & HMAC SHA-256 Signature Verification
 * - Webhook Dispatcher with Delivery Audit Trail (n8n, Zapier, custom endpoints)
 * - Automated WhatsApp / SMS Notification Formatter for Ghanaian Parents & Schools
 * - Proprietor Notification Preferences Center
 */

const crypto = require('crypto');
const AuditService = require('./auditService');

// ============================================================================
// IN-MEMORY STORAGE FOR WEBHOOKS & NOTIFICATION PREFERENCES
// ============================================================================

const IN_MEMORY_WEBHOOK_SUBSCRIPTIONS = [
  {
    id: 'WH-SUB-2026-001',
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    name: 'GIS n8n CRM Integration',
    target_url: 'https://n8n.gis.edu.gh/webhook/skoolfinder-events',
    secret_key: 'whsec_8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c',
    subscribed_events: [
      'ParentEnquirySubmitted',
      'AdmissionOfferIssued',
      'AdmissionOfferAccepted',
      'PaymentVerified'
    ],
    is_active: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

const IN_MEMORY_WEBHOOK_DELIVERIES = [];

const IN_MEMORY_NOTIFICATION_PREFERENCES = {
  'ab5af86d-c902-4853-9528-d6200104b5f6': {
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    enquiry_alerts: { email: true, sms: true, whatsapp: true, webhook: true },
    admission_alerts: { email: true, sms: true, whatsapp: true, webhook: true },
    tender_bid_alerts: { email: true, sms: false, whatsapp: false, webhook: true },
    billing_alerts: { email: true, sms: true, whatsapp: false, webhook: true },
    guardian_absence_sms: { email: false, sms: true, whatsapp: true, webhook: true }
  }
};

// ============================================================================
// WEBHOOK & NOTIFICATION SERVICE
// ============================================================================

const WebhookService = {
  getSupportedEvents() {
    return [
      { event: 'ParentEnquirySubmitted', description: 'Fired when a prospective parent sends an admissions enquiry.' },
      { event: 'AdmissionApplicationSubmitted', description: 'Fired when a formal student application dossier is received.' },
      { event: 'AdmissionOfferIssued', description: 'Fired when school issues formal admission offer to candidate.' },
      { event: 'AdmissionOfferAccepted', description: 'Fired when parent digitally accepts the admission offer.' },
      { event: 'VacancyPublished', description: 'Fired when an active educator vacancy is posted.' },
      { event: 'JobApplicationSubmitted', description: 'Fired when a licensed teacher submits job application.' },
      { event: 'TenderPublished', description: 'Fired when an institutional B2B procurement RFQ is published.' },
      { event: 'SupplierBidSubmitted', description: 'Fired when an accredited supplier submits quotation.' },
      { event: 'PaymentVerified', description: 'Fired when Paystack subscription or tender fee is confirmed.' },
      { event: 'EscrowMilestoneLocked', description: 'Fired when 50% mobilization deposit is secured in MoMo escrow.' }
    ];
  },

  async registerWebhook(schoolId, subscriptionData, user = null) {
    const { name, targetUrl, subscribedEvents } = subscriptionData;
    if (!targetUrl || !targetUrl.startsWith('https://')) {
      throw new Error('A secure HTTPS target URL is required for webhook registration.');
    }
    if (!subscribedEvents || !Array.isArray(subscribedEvents) || subscribedEvents.length === 0) {
      throw new Error('At least one subscribed event must be selected.');
    }

    const subId = `WH-SUB-2026-${String(IN_MEMORY_WEBHOOK_SUBSCRIPTIONS.length + 1).padStart(3, '0')}`;
    const secretKey = `whsec_${crypto.randomBytes(16).toString('hex')}`;

    const newSub = {
      id: subId,
      school_id: schoolId,
      name: name || 'Custom Integration Webhook',
      target_url: targetUrl.trim(),
      secret_key: secretKey,
      subscribed_events: subscribedEvents,
      is_active: true,
      created_at: new Date().toISOString()
    };

    IN_MEMORY_WEBHOOK_SUBSCRIPTIONS.push(newSub);

    await AuditService.log({
      actorId: user?.id || 'school-admin',
      actorEmail: user?.email || 'admin@skoolfinder.com.gh',
      actorRole: 'school_admin',
      action: 'WEBHOOK_SUBSCRIPTION_CREATED',
      targetType: 'webhook_subscription',
      targetId: subId,
      details: { schoolId, targetUrl, events: subscribedEvents }
    });

    return {
      success: true,
      subscription: newSub
    };
  },

  async getSchoolWebhooks(schoolId) {
    const subs = IN_MEMORY_WEBHOOK_SUBSCRIPTIONS.filter(s => s.school_id === schoolId);
    return {
      success: true,
      schoolId,
      count: subs.length,
      webhooks: subs
    };
  },

  generateSignature(payload, secretKey) {
    return crypto
      .createHmac('sha256', secretKey)
      .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
      .digest('hex');
  },

  async dispatchEvent(schoolId, eventName, payload, user = null) {
    const activeSubs = IN_MEMORY_WEBHOOK_SUBSCRIPTIONS.filter(
      s => s.school_id === schoolId && s.is_active && s.subscribed_events.includes(eventName)
    );

    const deliveryResults = [];

    for (const sub of activeSubs) {
      const deliveryId = `WH-DEL-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const timestamp = new Date().toISOString();
      
      const eventEnvelope = {
        id: deliveryId,
        event: eventName,
        school_id: schoolId,
        timestamp,
        data: payload
      };

      const signature = this.generateSignature(eventEnvelope, sub.secret_key);

      // Simulated immediate delivery
      const deliveryRecord = {
        id: deliveryId,
        subscription_id: sub.id,
        school_id: schoolId,
        event: eventName,
        target_url: sub.target_url,
        signature: `sha256=${signature}`,
        http_status: 200,
        delivery_status: 'delivered',
        delivered_at: timestamp,
        attempts: 1
      };

      IN_MEMORY_WEBHOOK_DELIVERIES.unshift(deliveryRecord);
      deliveryResults.push(deliveryRecord);

      console.log(`\n🔔 [OUTBOUND WEBHOOK DISPATCHED]`);
      console.log(`Event: ${eventName} | Target: ${sub.target_url}`);
      console.log(`Signature: sha256=${signature.substring(0, 16)}... | Status: 200 OK Delivered\n`);
    }

    return {
      success: true,
      eventName,
      matchedSubscriptions: activeSubs.length,
      deliveries: deliveryResults
    };
  },

  async getWebhookDeliveries(schoolId) {
    const logs = IN_MEMORY_WEBHOOK_DELIVERIES.filter(d => !schoolId || d.school_id === schoolId);
    return {
      success: true,
      count: logs.length,
      deliveries: logs.slice(0, 20)
    };
  },

  // WhatsApp template message generator
  formatWhatsAppPayload(recipientPhone, templateType, templateVars = {}) {
    const { parentName = 'Parent', schoolName = 'SkoolFinder Partner School', link = 'https://skoolfinder.vercel.app' } = templateVars;
    
    let messageText = '';
    switch (templateType) {
      case 'admission_offer':
        messageText = `🇬🇭 *${schoolName}*\n\nDear ${parentName},\nWe are pleased to inform you that your child has been offered admission! 🎓\n\nReview and accept your digital offer letter here:\n👉 ${link}\n\n_Powered by SkoolFinder Ghana_`;
        break;
      case 'enquiry_reply':
        messageText = `🇬🇭 *${schoolName}*\n\nHello ${parentName},\nOur admissions office has responded to your inquiry regarding upcoming intake vacancies:\n👉 ${link}`;
        break;
      case 'absence_alert':
        messageText = `⚠️ *CAMPUS ATTENDANCE NOTICE*\n\nDear ${parentName},\nYour ward has been recorded absent from morning roll call at ${schoolName}. If this absence is excused, please contact the administration immediately.`;
        break;
      default:
        messageText = `Notice from ${schoolName}: Please visit ${link} for details.`;
    }

    return {
      recipientPhone,
      channel: 'whatsapp_cloud_api',
      messageText,
      formattedTimestamp: new Date().toISOString()
    };
  },

  async updateNotificationPreferences(schoolId, preferences, user = null) {
    IN_MEMORY_NOTIFICATION_PREFERENCES[schoolId] = {
      school_id: schoolId,
      ...preferences
    };

    return {
      success: true,
      schoolId,
      preferences: IN_MEMORY_NOTIFICATION_PREFERENCES[schoolId]
    };
  },

  getNotificationPreferences(schoolId) {
    return {
      success: true,
      schoolId,
      preferences: IN_MEMORY_NOTIFICATION_PREFERENCES[schoolId] || {
        enquiry_alerts: { email: true, sms: true, whatsapp: true, webhook: true },
        admission_alerts: { email: true, sms: true, whatsapp: true, webhook: true },
        tender_bid_alerts: { email: true, sms: false, whatsapp: false, webhook: true },
        billing_alerts: { email: true, sms: true, whatsapp: false, webhook: true }
      }
    };
  }
};

module.exports = {
  WebhookService,
  IN_MEMORY_WEBHOOK_SUBSCRIPTIONS,
  IN_MEMORY_WEBHOOK_DELIVERIES,
  IN_MEMORY_NOTIFICATION_PREFERENCES
};
