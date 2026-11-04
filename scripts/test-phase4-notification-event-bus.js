/**
 * SKOOLFINDER GHANA: PHASE 4 AUTOMATED TEST SUITE
 * ============================================================================
 * Tests the Unified NotificationEventBus and real platform domain wiring:
 *   - ParentEnquirySubmitted (via POST /api/inquiries)
 *   - AdmissionOfferIssued & AdmissionOfferAccepted (via AdmissionsService)
 *   - PaymentVerified (via POST /api/payments/verify)
 *   - TenderPublished (via MarketplaceService.createTender)
 *   - Granular channel_event_matrix toggle compliance
 *   - Strict Error Isolation across independent channels
 * ============================================================================
 */

const assert = require('assert');
const http = require('http');
const express = require('express');

// Require platform components
const { NotificationEventBus } = require('../src/services/notificationEventBus');
const { WebhookService, IN_MEMORY_WEBHOOK_SUBSCRIPTIONS, IN_MEMORY_NOTIFICATION_PREFERENCES } = require('../src/services/webhookService');
const { NationalIntegrationsService, IN_MEMORY_SMS_LOGS } = require('../src/services/nationalIntegrationsService');
const AdmissionsSubscriptionService = require('../src/services/admissionsSubscriptionService');
const MarketplaceService = require('../src/services/marketplaceService');
const app = require('../server');

const TEST_SCHOOL_ID = 'ab5af86d-c902-4853-9528-d6200104b5f6'; // GIS Test UUID
process.env.ALLOW_LOCAL_WEBHOOKS = 'true';

async function runPhase4Tests() {
  console.log('\n======================================================================');
  console.log('⚡ SKOOLFINDER GHANA: PHASE 4 DOMAIN EVENT & NOTIFICATION BUS SUITE');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  function recordPass(testCode, description) {
    passed++;
    console.log(`  ✅ [PASS] ${testCode}: ${description}`);
  }

  function recordFail(testCode, description, err) {
    failed++;
    console.error(`  ❌ [FAIL] ${testCode}: ${description} - ${err.message}`);
  }

  // 1. Start a local HTTP server sink for receiving outbound webhooks
  let receivedWebhooks = [];
  const webhookSink = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        receivedWebhooks.push({
          headers: req.headers,
          event: req.headers['x-skoolfinder-event'],
          body: json
        });
      } catch (e) {
        receivedWebhooks.push({ raw: body });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'received' }));
    });
  });

  const sinkPort = 54590;
  await new Promise(resolve => webhookSink.listen(sinkPort, '127.0.0.1', resolve));

  // Also bind test express server for API route tests
  const testApiPort = 54591;
  const apiServer = http.createServer(app);
  await new Promise(resolve => apiServer.listen(testApiPort, '127.0.0.1', resolve));

  async function waitForWebhook(eventType, maxWaitMs = 1500) {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      const match = receivedWebhooks.find(w => w.event === eventType);
      if (match) return match;
      await new Promise(r => setTimeout(r, 50));
    }
    return receivedWebhooks.find(w => w.event === eventType);
  }

  try {
    // Register active webhook subscription pointing to our test sink
    const targetUrl = `http://127.0.0.1:${sinkPort}/webhook-receiver`;
    await WebhookService.registerWebhook(TEST_SCHOOL_ID, {
      name: 'n8n Live Pipeline Sink',
      targetUrl: targetUrl,
      subscribedEvents: [
        'ParentEnquirySubmitted',
        'AdmissionOfferIssued',
        'AdmissionOfferAccepted',
        'PaymentVerified',
        'TenderPublished'
      ]
    });

    // ------------------------------------------------------------------------
    // TEST 1: Direct EventBus Publish (ParentEnquirySubmitted)
    // ------------------------------------------------------------------------
    try {
      receivedWebhooks = [];
      const report = await NotificationEventBus.publish('ParentEnquirySubmitted', TEST_SCHOOL_ID, {
        inquiryId: 'inq-test-101',
        parentName: 'Mrs. Akua Mensah',
        parentPhone: '+233245551212',
        studentName: 'Kojo Mensah',
        gradeApplying: 'Primary 2',
        schoolName: 'Ghana International School'
      });

      assert.strictEqual(report.eventName, 'ParentEnquirySubmitted');
      assert.strictEqual(report.channels.webhook.attempted, true);
      assert.strictEqual(report.channels.whatsapp.attempted, true);
      assert.strictEqual(report.channels.sms.attempted, true);

      // Verify webhook payload arrived at local sink
      const hook = await waitForWebhook('ParentEnquirySubmitted');
      assert.ok(hook, 'Webhook was received at HTTP sink');
      assert.strictEqual(hook.body.data.studentName, 'Kojo Mensah');

      recordPass('BUS-001', 'Direct NotificationEventBus.publish dispatches across Webhook, WhatsApp, and SMS');
    } catch (err) {
      recordFail('BUS-001', 'Direct NotificationEventBus.publish failed', err);
    }

    // ------------------------------------------------------------------------
    // TEST 2: Channel Matrix Granular Toggles Compliance
    // ------------------------------------------------------------------------
    try {
      // Toggle off WhatsApp for ParentEnquirySubmitted
      WebhookService.updateNotificationPreferences(TEST_SCHOOL_ID, {
        channel_event_matrix: {
          ParentEnquirySubmitted: { webhook: true, whatsapp: false, sms: true, email: true },
          AdmissionOfferIssued: { webhook: true, whatsapp: true, sms: true, email: true }
        }
      });

      receivedWebhooks = [];
      const report = await NotificationEventBus.publish('ParentEnquirySubmitted', TEST_SCHOOL_ID, {
        inquiryId: 'inq-test-102',
        parentName: 'Mr. Kofi Boateng',
        parentPhone: '+233241112222',
        studentName: 'Yaa Boateng',
        gradeApplying: 'JHS 1'
      });

      assert.strictEqual(report.channels.webhook.attempted, true, 'Webhook was attempted');
      assert.strictEqual(report.channels.whatsapp.attempted, false, 'WhatsApp was skipped per matrix configuration');
      assert.strictEqual(report.channels.sms.attempted, true, 'SMS was attempted');

      recordPass('BUS-002', 'Respects granular school channel_event_matrix (WhatsApp toggled off skips WhatsApp only)');
    } catch (err) {
      recordFail('BUS-002', 'Channel matrix compliance check failed', err);
    }

    // Restore full matrix
    WebhookService.updateNotificationPreferences(TEST_SCHOOL_ID, {
      channel_event_matrix: {
        ParentEnquirySubmitted: { webhook: true, whatsapp: true, sms: true, email: true },
        AdmissionOfferIssued: { webhook: true, whatsapp: true, sms: true, email: true },
        AdmissionOfferAccepted: { webhook: true, whatsapp: true, sms: true, email: true },
        PaymentVerified: { webhook: true, whatsapp: true, sms: true, email: true },
        TenderPublished: { webhook: true, whatsapp: true, sms: true, email: true }
      }
    });

    // ------------------------------------------------------------------------
    // TEST 3: Real Inquiries API Call (POST /api/inquiries)
    // ------------------------------------------------------------------------
    try {
      receivedWebhooks = [];
      const initialSmsCount = IN_MEMORY_SMS_LOGS.length;

      const postRes = await fetch(`http://127.0.0.1:${testApiPort}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: TEST_SCHOOL_ID,
          parentName: 'Dr. Kwame Nkrumah',
          parentPhone: '+233245551212',
          parentEmail: 'parent@example.com',
          studentName: 'Francis Nkrumah',
          gradeApplying: 'Grade 7',
          message: 'Interested in Cambridge A-Levels program.'
        })
      });

      assert.strictEqual(postRes.status, 201);
      const resJson = await postRes.json();
      assert.strictEqual(resJson.success, true);

      // Assert webhook arrived
      const inquiryWebhook = await waitForWebhook('ParentEnquirySubmitted');
      assert.ok(inquiryWebhook, 'ParentEnquirySubmitted webhook was received from real API call');
      assert.strictEqual(inquiryWebhook.body.data.parentName, 'Dr. Kwame Nkrumah');

      // Assert Hubtel SMS was logged
      let smsLogged = false;
      const smsPollStart = Date.now();
      while (Date.now() - smsPollStart < 1500) {
        if (IN_MEMORY_SMS_LOGS.length > initialSmsCount) {
          smsLogged = true;
          break;
        }
        await new Promise(r => setTimeout(r, 50));
      }
      assert.ok(smsLogged, 'Hubtel SMS logged for new inquiry');

      recordPass('BUS-003', 'Real API POST /api/inquiries automatically dispatches ParentEnquirySubmitted alerts');
    } catch (err) {
      recordFail('BUS-003', 'Real inquiries API dispatch failed', err);
    }

    // ------------------------------------------------------------------------
    // TEST 4: Admissions Lifecycle - AdmissionOfferIssued Trigger
    // ------------------------------------------------------------------------
    try {
      receivedWebhooks = [];

      // 1. Submit application first
      const appRes = await AdmissionsSubscriptionService.submitApplication({
        schoolId: TEST_SCHOOL_ID,
        student: { firstName: 'Kwesi', lastName: 'Appiah', gradeApplying: 'Class 4' },
        parentGuardian: { primaryGuardianName: 'Mr. Emmanuel Appiah', phone: '+233245551212', email: 'e.appiah@gmail.com' }
      });
      const appId = appRes.application.id;

      // 2. Transition stepwise per state machine: submitted -> under_review -> decision_pending -> offered
      await AdmissionsSubscriptionService.transitionApplicationStatus(TEST_SCHOOL_ID, appId, {
        newStatus: 'under_review',
        actorName: 'Admissions Officer Jane'
      });

      await AdmissionsSubscriptionService.transitionApplicationStatus(TEST_SCHOOL_ID, appId, {
        newStatus: 'decision_pending',
        actorName: 'Admissions Officer Jane'
      });

      const offerRes = await AdmissionsSubscriptionService.transitionApplicationStatus(TEST_SCHOOL_ID, appId, {
        newStatus: 'offered',
        actorName: 'Admissions Officer Jane',
        offerData: { conditions: 'Tuition deposit required within 14 days' }
      });

      assert.strictEqual(offerRes.success, true);
      assert.strictEqual(offerRes.application.status, 'offered');

      const offerWebhook = await waitForWebhook('AdmissionOfferIssued');
      assert.ok(offerWebhook, 'AdmissionOfferIssued webhook received');
      assert.strictEqual(offerWebhook.body.data.studentName, 'Kwesi Appiah');

      recordPass('BUS-004', 'AdmissionsService.transitionApplicationStatus(offered) triggers AdmissionOfferIssued');
    } catch (err) {
      recordFail('BUS-004', 'AdmissionOfferIssued trigger failed', err);
    }

    // ------------------------------------------------------------------------
    // TEST 5: Admissions Lifecycle - AdmissionOfferAccepted Trigger
    // ------------------------------------------------------------------------
    try {
      receivedWebhooks = [];

      // Accept offer from Test 4
      const apps = await AdmissionsSubscriptionService.getApplications(TEST_SCHOOL_ID);
      const offeredApp = apps.find(a => a.status === 'offered');
      assert.ok(offeredApp, 'Found offered application');

      const acceptRes = await AdmissionsSubscriptionService.parentRespondToOffer(offeredApp.tracking_code, 'accept');
      assert.strictEqual(acceptRes.success, true);
      assert.strictEqual(acceptRes.application.status, 'accepted');

      const acceptedWebhook = await waitForWebhook('AdmissionOfferAccepted');
      assert.ok(acceptedWebhook, 'AdmissionOfferAccepted webhook received');
      assert.strictEqual(acceptedWebhook.body.data.trackingCode, offeredApp.tracking_code);

      recordPass('BUS-005', 'AdmissionsService.parentRespondToOffer(accept) triggers AdmissionOfferAccepted');
    } catch (err) {
      recordFail('BUS-005', 'AdmissionOfferAccepted trigger failed', err);
    }

    // ------------------------------------------------------------------------
    // TEST 6: Payment Verification - PaymentVerified Trigger
    // ------------------------------------------------------------------------
    try {
      receivedWebhooks = [];

      const payRes = await fetch(`http://127.0.0.1:${testApiPort}/api/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: `SF_TEST_PAY_${Date.now()}`,
          channel: 'mobile_money'
        })
      });

      assert.strictEqual(payRes.status, 200);
      const payJson = await payRes.json();
      assert.strictEqual(payJson.status, 'success');

      const paymentWebhook = await waitForWebhook('PaymentVerified');
      assert.ok(paymentWebhook, 'PaymentVerified webhook received');
      assert.strictEqual(paymentWebhook.body.data.currency, 'GHS');

      recordPass('BUS-006', 'POST /api/payments/verify triggers PaymentVerified across channels');
    } catch (err) {
      recordFail('BUS-006', 'PaymentVerified trigger failed', err);
    }

    // ------------------------------------------------------------------------
    // TEST 7: Procurement Tender - TenderPublished Trigger
    // ------------------------------------------------------------------------
    try {
      receivedWebhooks = [];

      // Ensure school has tender publishing credits
      await MarketplaceService.purchaseTenderCredits(TEST_SCHOOL_ID, { packType: 'single' });

      const tenderRes = await MarketplaceService.createTender(TEST_SCHOOL_ID, {
        title: 'Supply of 50 Interactive Smartboards',
        category: 'ICT & Educational Technology',
        estimated_budget_ghs: 180000,
        submission_deadline: '2026-12-01T17:00:00Z',
        actorName: 'Head of Procurement'
      });

      assert.strictEqual(tenderRes.success, true);

      const tenderWebhook = await waitForWebhook('TenderPublished');
      assert.ok(tenderWebhook, 'TenderPublished webhook received');
      assert.strictEqual(tenderWebhook.body.data.title, 'Supply of 50 Interactive Smartboards');

      recordPass('BUS-007', 'MarketplaceService.createTender triggers TenderPublished event to webhooks and SMS');
    } catch (err) {
      recordFail('BUS-007', 'TenderPublished trigger failed', err);
    }

    // ------------------------------------------------------------------------
    // TEST 8: Error Isolation (External Channel Failure Does Not Block Action)
    // ------------------------------------------------------------------------
    try {
      // Register a failing webhook to a non-existent port (connection refused)
      await WebhookService.registerWebhook(TEST_SCHOOL_ID, {
        name: 'Dead Broken CRM',
        targetUrl: 'http://127.0.0.1:59999/broken-crm-sink',
        subscribedEvents: ['ParentEnquirySubmitted']
      });

      // Submit another inquiry - should succeed 201 regardless of broken external CRM
      const robustRes = await fetch(`http://127.0.0.1:${testApiPort}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: TEST_SCHOOL_ID,
          parentName: 'Hon. Shirley Botchwey',
          parentPhone: '+233244111222',
          studentName: 'Kofi Botchwey',
          gradeApplying: 'Nursery 1',
          message: 'Checking for sibling discount policies.'
        })
      });

      assert.strictEqual(robustRes.status, 201, 'HTTP 201 Created returned despite external webhook failure');
      const data = await robustRes.json();
      assert.strictEqual(data.success, true);

      recordPass('BUS-008', 'Strict Error Isolation: Downstream webhook/SMS failures never block parent enquiry or admission flow');
    } catch (err) {
      recordFail('BUS-008', 'Error isolation test failed', err);
    }

  } finally {
    // Cleanup HTTP servers
    await new Promise(r => webhookSink.close(r));
    await new Promise(r => apiServer.close(r));
  }

  console.log('\n======================================================================');
  console.log(`📊 Phase 4 Verification Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================\n');

  if (failed > 0) process.exit(1);
}

runPhase4Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
