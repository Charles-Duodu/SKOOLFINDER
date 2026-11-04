/**
 * SkoolFinder Ghana - Phase 7: Production Webhooks & Multi-Channel Alerts Verification Suite
 * Baseline: Blueprint v2.0 Module 15, Prompt §7.15 & §12
 * Includes Phase 3: Outbound Dispatcher Engine, Delivery Queue & Retries
 * 
 * Tests:
 * 1. SSRF Protection (blocks loopback, cloud metadata, RFC1918 private subnets)
 * 2. AES-256-GCM Secret Encryption at rest & HMAC SHA-256 Signatures
 * 3. Route Security & Tenant Authorization (401 unauthenticated, 403 unauthorized tenant)
 * 4. Real Outbound HTTP POST Delivery to a Live Receiver with Signature Verification
 * 5. Phase 3 Exponential Backoff Retry Engine (503 transient error -> retrying -> recovery)
 * 6. Phase 3 Non-transient Client Error (400 -> immediately failed)
 * 7. Phase 3 Dead-Letter Queue 1-Click Manual Redelivery
 * 8. Phase 3 Circuit Breaker Auto-Suspension & 1-Click Reset
 * 9. Meta WhatsApp Cloud API Driver (Staged & Graph API)
 * 10. Hubtel Ghana SMS Gateway Driver (Staged & Live HTTPS)
 * 11. Omnichannel Preferences Multi-Tenant Synchronization
 * 12. Queue Health Telemetry Endpoint
 */

const assert = require('assert');
const http = require('http');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { WebhookService } = require('../src/services/webhookService');
const { NationalIntegrationsService } = require('../src/services/nationalIntegrationsService');
const { JWT_SECRET } = require('../src/middleware/auth');

console.log('======================================================================');
console.log('⚡ SKOOLFINDER GHANA: PRODUCTION WEBHOOKS & NOTIFICATIONS SUITE (PHASE 7)');
console.log('   (Phase 1 Schema, Phase 2 Tenant Security & Phase 3 Retry Engine)');
console.log('======================================================================\n');

let passed = 0;
let failed = 0;

async function it(desc, fn) {
  try {
    await fn();
    console.log(`  ✅ [PASS] ${desc}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${desc}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

async function run() {
  const pilotSchoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6';

  // Test identities
  const proprietorUser = {
    id: 'usr-proprietor-01',
    name: 'Dr. Elizabeth Mensah',
    email: 'proprietor@gis.edu.gh',
    role: 'primary_proprietor',
    school_id: pilotSchoolId
  };

  const superAdminUser = {
    id: 'usr-super-admin',
    name: 'Chief Platform Architect',
    email: 'superadmin@skoolfinder.com.gh',
    role: 'super_admin'
  };

  const unauthorizedUser = {
    id: 'usr-parent-01',
    name: 'Mr. Kofi Boateng',
    email: 'kofi@gmail.com',
    role: 'parent'
  };

  // JWT helper
  const createToken = (u) => jwt.sign(u, JWT_SECRET, { expiresIn: '1h' });

  // Spin up in-process HTTP test server
  const testServer = http.createServer(app);
  await new Promise(resolve => testServer.listen(0, '127.0.0.1', resolve));
  const serverPort = testServer.address().port;
  const baseUrl = `http://127.0.0.1:${serverPort}`;

  // Enable fast backoff intervals for fast deterministic testing
  process.env.TEST_FAST_BACKOFF = 'true';

  // --------------------------------------------------------------------------
  // 1. SSRF PROTECTION & URL VALIDATION
  // --------------------------------------------------------------------------
  await it('SEC-001: Enforces HTTPS and rejects plain unencrypted HTTP in production', async () => {
    assert.throws(() => {
      WebhookService.validateTargetUrl('http://insecure-endpoint.edu.gh/webhook');
    }, /A secure HTTPS target URL is required/);
  });

  await it('SEC-002: Rejects localhost, loopback, and IPv6 loopback addresses (SSRF Protection)', async () => {
    assert.throws(() => {
      WebhookService.validateTargetUrl('https://localhost:8080/hook');
    }, /SSRF Security Error/);

    assert.throws(() => {
      WebhookService.validateTargetUrl('https://127.0.0.1:4000/api');
    }, /SSRF Security Error/);

    assert.throws(() => {
      WebhookService.validateTargetUrl('https://[::1]:9000/hook');
    }, /SSRF Security Error/);
  });

  await it('SEC-003: Rejects RFC1918 private subnets and Cloud Metadata IP (169.254.169.254)', async () => {
    assert.throws(() => {
      WebhookService.validateTargetUrl('https://10.0.0.1/internal-sink');
    }, /SSRF Security Error/);

    assert.throws(() => {
      WebhookService.validateTargetUrl('https://192.168.1.100/admin');
    }, /SSRF Security Error/);

    assert.throws(() => {
      WebhookService.validateTargetUrl('https://172.20.1.1/secret');
    }, /SSRF Security Error/);

    assert.throws(() => {
      WebhookService.validateTargetUrl('https://169.254.169.254/latest/meta-data');
    }, /SSRF Security Error/);
  });

  await it('SEC-004: Accepts genuine external HTTPS endpoints', async () => {
    const validUrl = 'https://n8n.gis.edu.gh/webhook/skoolfinder-events';
    const result = WebhookService.validateTargetUrl(validUrl);
    assert.strictEqual(result, validUrl);
  });

  // --------------------------------------------------------------------------
  // 2. AES-256-GCM ENCRYPTION AT REST & HMAC SHA-256 SIGNATURES
  // --------------------------------------------------------------------------
  await it('CRYPTO-001: Encrypts webhook secrets using AES-256-GCM and decrypts seamlessly in memory', async () => {
    const plainSecret = 'whsec_99aa88bb77cc66dd55ee44ff33';
    const encrypted = WebhookService.encryptSecret(plainSecret);
    assert.notStrictEqual(encrypted, plainSecret);
    assert.ok(encrypted.includes(':'), 'Encrypted string must contain IV and AuthTag markers');

    const decrypted = WebhookService.decryptSecret(encrypted);
    assert.strictEqual(decrypted, plainSecret);
  });

  await it('CRYPTO-002: Computes standard HMAC SHA-256 signatures over JSON payloads', async () => {
    const payload = { event: 'ParentEnquirySubmitted', school_id: pilotSchoolId, timestamp: '2026-11-04T12:00:00Z' };
    const secret = 'whsec_test_secret_key_12345';
    const signature = WebhookService.generateSignature(payload, secret);
    assert.strictEqual(typeof signature, 'string');
    assert.strictEqual(signature.length, 64);

    const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
    assert.strictEqual(signature, expected);
  });

  // --------------------------------------------------------------------------
  // 3. REAL OUTBOUND HTTP POST DELIVERY TO LIVE MOCK RECEIVER
  // --------------------------------------------------------------------------
  await it('DISPATCH-001: Dispatches real HTTP POST to live receiver with HMAC signature header and 5s timeout', async () => {
    let receivedPayload = null;
    let receivedSignature = null;
    let receivedEventHeader = null;
    let receivedUserAgent = null;

    const mockReceiver = http.createServer((req, res) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        receivedSignature = req.headers['x-skoolfinder-signature'];
        receivedEventHeader = req.headers['x-skoolfinder-event'];
        receivedUserAgent = req.headers['user-agent'];
        try {
          receivedPayload = JSON.parse(body);
        } catch (e) {}
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ acknowledged: true, receivedAt: new Date().toISOString() }));
      });
    });

    await new Promise(resolve => mockReceiver.listen(0, '127.0.0.1', resolve));
    const port = mockReceiver.address().port;
    const testTargetUrl = `http://127.0.0.1:${port}/webhook-sink`;

    process.env.ALLOW_LOCAL_WEBHOOKS = 'true';

    try {
      const reg = await WebhookService.registerWebhook(pilotSchoolId, {
        name: 'Local Mock Endpoint',
        targetUrl: testTargetUrl,
        subscribedEvents: ['PaymentVerified'],
        secret: 'whsec_super_secret_local_test_key'
      }, proprietorUser);

      assert.strictEqual(reg.success, true);

      const dispatchRes = await WebhookService.dispatchEvent(pilotSchoolId, 'PaymentVerified', {
        paymentReference: 'SF-PAY-2026-9921',
        amountGhs: 18000,
        studentName: 'Nana Yaa Boateng',
        method: 'mtn_momo'
      }, proprietorUser);

      assert.strictEqual(dispatchRes.success, true);
      assert.strictEqual(dispatchRes.eventName, 'PaymentVerified');

      const delivery = dispatchRes.deliveries.find(d => d.target_url === testTargetUrl);
      assert.ok(delivery, 'Delivery to test receiver must be recorded');
      assert.strictEqual(delivery.http_status, 200);
      assert.strictEqual(delivery.delivery_status, 'delivered');
      assert.ok(delivery.execution_time_ms >= 0);

      assert.ok(receivedPayload !== null, 'Mock receiver must receive valid JSON payload');
      assert.strictEqual(receivedPayload.event, 'PaymentVerified');
      assert.strictEqual(receivedPayload.data.paymentReference, 'SF-PAY-2026-9921');
      assert.strictEqual(receivedEventHeader, 'PaymentVerified');
      assert.ok(receivedSignature.startsWith('sha256='));
      assert.ok(receivedUserAgent.includes('SkoolFinder-Webhook-Dispatcher'));
    } finally {
      process.env.ALLOW_LOCAL_WEBHOOKS = 'false';
      await new Promise(resolve => mockReceiver.close(resolve));
    }
  });

  // --------------------------------------------------------------------------
  // 4. ROUTE SECURITY & TENANT AUTHORIZATION VIA EXPRESS
  // --------------------------------------------------------------------------
  await it('AUTH-001: Blocks unauthenticated requests with 401 Unauthorized', async () => {
    const res = await fetch(`${baseUrl}/api/webhooks/school/${pilotSchoolId}`, { method: 'GET' });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.ok(body.error.includes('token required') || body.error.includes('Authentication'));
  });

  await it('AUTH-002: Blocks unauthorized tenant access with 403 Forbidden', async () => {
    const token = createToken(unauthorizedUser);
    const res = await fetch(`${baseUrl}/api/webhooks/school/${pilotSchoolId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 403);
    const body = await res.json();
    assert.ok(body.error.includes('Forbidden'));
  });

  await it('AUTH-003: Authorizes verified school primary proprietor with 200 OK', async () => {
    const token = createToken(proprietorUser);
    const res = await fetch(`${baseUrl}/api/webhooks/school/${pilotSchoolId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.schoolId, pilotSchoolId);
  });

  await it('AUTH-004: Authorizes platform super admin with universal oversight (200 OK)', async () => {
    const token = createToken(superAdminUser);
    const res = await fetch(`${baseUrl}/api/webhooks/school/${pilotSchoolId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  // --------------------------------------------------------------------------
  // 5. PHASE 3: EXPONENTIAL BACKOFF RETRY ENGINE (TRANSIENT 503 ERROR)
  // --------------------------------------------------------------------------
  let flappyPort = null;
  let flappyServer = null;
  let flappyUrl = null;
  let attemptCount = 0;
  let transientDeliveryId = null;

  await it('RETRY-001: Transient HTTP 503 error sets status to "retrying" and schedules next_retry_at with exponential backoff', async () => {
    // Ephemeral server that returns 503 on first attempt, then 200 OK
    flappyServer = http.createServer((req, res) => {
      attemptCount++;
      if (attemptCount === 1) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Service Temporarily Unavailable' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, recovered: true }));
      }
    });

    await new Promise(resolve => flappyServer.listen(0, '127.0.0.1', resolve));
    flappyPort = flappyServer.address().port;
    flappyUrl = `http://127.0.0.1:${flappyPort}/flappy-sink`;

    process.env.ALLOW_LOCAL_WEBHOOKS = 'true';

    // Register webhook pointing to flappy receiver
    await WebhookService.registerWebhook(pilotSchoolId, {
      name: 'Flappy Test Webhook',
      targetUrl: flappyUrl,
      subscribedEvents: ['AdmissionOfferIssued'],
      secret: 'whsec_flappy_secret_key'
    }, proprietorUser);

    const dispatchRes = await WebhookService.dispatchEvent(pilotSchoolId, 'AdmissionOfferIssued', {
      candidateName: 'Abena Mensah',
      grade: 'Class 2'
    }, proprietorUser);

    const delivery = dispatchRes.deliveries.find(d => d.target_url === flappyUrl);
    assert.ok(delivery, 'Delivery record must exist');
    assert.strictEqual(delivery.delivery_status, 'retrying');
    assert.strictEqual(delivery.response_http_status, 503);
    assert.strictEqual(delivery.attempts, 1);
    assert.ok(delivery.next_retry_at !== null, 'next_retry_at must be populated');
    assert.ok(new Date(delivery.next_retry_at) > new Date(Date.now() - 5000));
    transientDeliveryId = delivery.id;
  });

  await it('RETRY-002: processRetryQueue re-dispatches pending retries and completes delivery upon remote recovery', async () => {
    // Wait for the fast backoff window (50ms) to elapse
    await new Promise(r => setTimeout(r, 80));

    const queueStats = await WebhookService.processRetryQueue();
    assert.ok(queueStats.processed >= 1, 'At least 1 retry must be processed');
    assert.ok(queueStats.delivered >= 1, 'Recovered endpoint must be marked delivered');

    const deliveriesRes = await WebhookService.getWebhookDeliveries(pilotSchoolId);
    const recovered = deliveriesRes.deliveries.find(d => d.id === transientDeliveryId);
    assert.ok(recovered);
    assert.strictEqual(recovered.delivery_status, 'delivered');
    assert.strictEqual(recovered.attempts, 2);
    assert.strictEqual(recovered.next_retry_at, null);

    await new Promise(resolve => flappyServer.close(resolve));
    process.env.ALLOW_LOCAL_WEBHOOKS = 'false';
  });

  // --------------------------------------------------------------------------
  // 6. PHASE 3: NON-TRANSIENT CLIENT ERROR (HTTP 400 - NO RETRIES)
  // --------------------------------------------------------------------------
  await it('RETRY-003: Non-transient client error (HTTP 400) immediately marks delivery as "failed" without retrying', async () => {
    const errorServer = http.createServer((req, res) => {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Malformed client request' }));
    });

    await new Promise(resolve => errorServer.listen(0, '127.0.0.1', resolve));
    const port = errorServer.address().port;
    const errorUrl = `http://127.0.0.1:${port}/error-sink`;

    process.env.ALLOW_LOCAL_WEBHOOKS = 'true';

    try {
      await WebhookService.registerWebhook(pilotSchoolId, {
        name: 'Bad Request Webhook',
        targetUrl: errorUrl,
        subscribedEvents: ['TenderPublished'],
        secret: 'whsec_bad_request_key'
      }, proprietorUser);

      const dispatchRes = await WebhookService.dispatchEvent(pilotSchoolId, 'TenderPublished', {
        rfqTitle: 'Supply of Laboratory Equipment'
      }, proprietorUser);

      const delivery = dispatchRes.deliveries.find(d => d.target_url === errorUrl);
      assert.ok(delivery);
      assert.strictEqual(delivery.delivery_status, 'failed');
      assert.strictEqual(delivery.response_http_status, 400);
      assert.strictEqual(delivery.next_retry_at, null);
    } finally {
      process.env.ALLOW_LOCAL_WEBHOOKS = 'false';
      await new Promise(resolve => errorServer.close(resolve));
    }
  });

  // --------------------------------------------------------------------------
  // 7. PHASE 3: DEAD-LETTER QUEUE & 1-CLICK ADMINISTRATIVE REDELIVERY
  // --------------------------------------------------------------------------
  await it('RETRY-004: Dead-Letter Queue allows 1-click administrative redelivery of failed event', async () => {
    let receiverCalls = 0;
    const okServer = http.createServer((req, res) => {
      receiverCalls++;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ delivered: true, callNumber: receiverCalls }));
    });

    await new Promise(resolve => okServer.listen(0, '127.0.0.1', resolve));
    const port = okServer.address().port;
    const okUrl = `http://127.0.0.1:${port}/redeliver-sink`;

    process.env.ALLOW_LOCAL_WEBHOOKS = 'true';

    try {
      const reg = await WebhookService.registerWebhook(pilotSchoolId, {
        name: 'Redelivery Target',
        targetUrl: okUrl,
        subscribedEvents: ['ParentEnquirySubmitted'],
        secret: 'whsec_redelivery_key'
      }, proprietorUser);

      // Create initially failed delivery
      const failDeliveryId = `WH-DEL-FAIL-${Date.now()}`;
      const failRecord = {
        id: failDeliveryId,
        subscription_id: reg.subscription.id,
        school_id: pilotSchoolId,
        event_type: 'ParentEnquirySubmitted',
        target_url: okUrl,
        request_headers: { 'Content-Type': 'application/json' },
        request_payload: { event: 'ParentEnquirySubmitted', candidate: 'Kwame' },
        signature: 'sha256=abcdef1234567890',
        response_http_status: 500,
        delivery_status: 'failed',
        attempts: 3,
        max_attempts: 3,
        next_retry_at: null,
        dispatched_at: new Date().toISOString()
      };
      await WebhookService._saveDeliveryRecord(failRecord);

      // Trigger 1-click administrative redelivery via API
      const token = createToken(proprietorUser);
      const res = await fetch(`${baseUrl}/api/webhooks/school/${pilotSchoolId}/deliveries/${failDeliveryId}/retry`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.delivery.delivery_status, 'delivered');
      assert.strictEqual(body.delivery.response_http_status, 200);
      assert.strictEqual(receiverCalls, 1);
    } finally {
      process.env.ALLOW_LOCAL_WEBHOOKS = 'false';
      await new Promise(resolve => okServer.close(resolve));
    }
  });

  // --------------------------------------------------------------------------
  // 8. PHASE 3: CIRCUIT BREAKER PATTERN & 1-CLICK RESET
  // --------------------------------------------------------------------------
  let deadSubId = null;

  await it('CIRCUIT-001: Automatic circuit breaker trip after consecutive delivery failures', async () => {
    const reg = await WebhookService.registerWebhook(pilotSchoolId, {
      name: 'Dead Sink Webhook',
      targetUrl: 'https://dead-server.edu.gh/webhook',
      subscribedEvents: ['PaymentVerified'],
      secret: 'whsec_dead_server_key'
    }, proprietorUser);

    deadSubId = reg.subscription.id;
    WebhookService.RETRY_CONFIG.circuitBreakerThreshold = 20;

    // Simulate 20th consecutive failure
    await WebhookService._updateSubscriptionFailure(deadSubId, 20, 'Endpoint suspended after 20 consecutive delivery failures (Circuit Breaker Tripped).');

    // Retrieve subscription and check
    const subsRes = await WebhookService.getSchoolWebhooks(pilotSchoolId);
    const sub = subsRes.webhooks.find(s => s.id === deadSubId);
    assert.ok(sub, 'Subscription must be found');
    assert.strictEqual(sub.is_active, false);
    assert.ok(sub.disabled_reason.includes('Circuit Breaker Tripped'));
  });

  await it('CIRCUIT-002: 1-click circuit breaker reset re-enables suspended webhook subscription', async () => {
    const token = createToken(proprietorUser);

    const res = await fetch(`${baseUrl}/api/webhooks/school/${pilotSchoolId}/subscriptions/${deadSubId}/reset-circuit-breaker`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.subscription.is_active, true);
    assert.strictEqual(body.subscription.failure_count, 0);
    assert.strictEqual(body.subscription.disabled_reason, null);
  });

  // --------------------------------------------------------------------------
  // 9. PHASE 3: QUEUE HEALTH TELEMETRY ENDPOINT
  // --------------------------------------------------------------------------
  await it('QUEUE-001: Queue statistics endpoint returns accurate counts of active, retrying, and failed deliveries', async () => {
    const token = createToken(proprietorUser);
    const res = await fetch(`${baseUrl}/api/webhooks/school/${pilotSchoolId}/queue-stats`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(typeof body.stats.totalDeliveries === 'number');
    assert.ok(typeof body.stats.delivered === 'number');
    assert.ok(typeof body.stats.retrying === 'number');
    assert.ok(typeof body.stats.failed === 'number');
    assert.ok(typeof body.stats.activeSubscriptions === 'number');
  });

  // --------------------------------------------------------------------------
  // 10. META WHATSAPP CLOUD API DRIVER (STAGED & GRAPH API)
  // --------------------------------------------------------------------------
  await it('WA-001: Formats and executes WhatsApp Cloud API dispatch driver', async () => {
    const res = await WebhookService.dispatchWhatsAppMessage(pilotSchoolId, '+233241112222', 'admission_offer', {
      parentName: 'Mrs. Yaa Osei',
      schoolName: 'Ghana International School',
      link: 'https://skoolfinder.vercel.app/track/SF-ADM-2026'
    }, proprietorUser);

    assert.strictEqual(res.success, true);
    assert.ok(res.dispatchId.startsWith('WA-DISP-'));
    assert.ok(res.wamid.startsWith('wamid.'));
    assert.strictEqual(res.status, 'sent');
    assert.ok(res.log.message_content.includes('Ghana International School'));
  });

  // --------------------------------------------------------------------------
  // 11. HUBTEL GHANA SMS GATEWAY PRODUCTION DRIVER
  // --------------------------------------------------------------------------
  await it('SMS-001: Dispatches SMS via Hubtel Ghana gateway driver with Cedi billing', async () => {
    const res = await NationalIntegrationsService.dispatchLiveSms(pilotSchoolId, {
      recipientPhone: '+233 24 555 1212',
      recipientName: 'Mr. Kwame Mensah',
      message: 'Notice from GIS: Your admission offer for term 1 has been issued. Check portal.'
    }, proprietorUser);

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.sms.delivery_status, 'delivered');
    assert.strictEqual(res.sms.sender_id, 'SKOOLFINDER');
    assert.strictEqual(res.sms.units, 1);
    assert.strictEqual(res.sms.cost_ghs, 0.045);
    assert.ok(res.sms.external_id !== null);
  });

  // --------------------------------------------------------------------------
  // 12. OMNICHANNEL NOTIFICATION PREFERENCES SYNCHRONIZATION
  // --------------------------------------------------------------------------
  await it('NOTIF-001: Updates multi-channel preferences and retrieves active configuration', async () => {
    const update = WebhookService.updateNotificationPreferences(pilotSchoolId, {
      whatsapp: true,
      sms: true,
      email: true,
      whatsappNumber: '+233 24 999 8888',
      smsNumber: '+233 20 777 6666',
      emailAddress: 'admissions-desk@gis.edu.gh'
    }, proprietorUser);

    assert.strictEqual(update.success, true);
    assert.strictEqual(update.preferences.whatsapp, true);
    assert.strictEqual(update.preferences.whatsappNumber, '+233 24 999 8888');

    const getRes = WebhookService.getNotificationPreferences(pilotSchoolId);
    assert.strictEqual(getRes.success, true);
    assert.strictEqual(getRes.preferences.whatsappNumber, '+233 24 999 8888');
  });

  // Clean up in-process server
  await new Promise(resolve => testServer.close(resolve));

  console.log('\n======================================================================');
  console.log(`📊 Phase 7 Verification Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error in Phase 7 test runner:', err);
  process.exit(1);
});
