/**
 * SkoolFinder Ghana - Master Expansions Verification Suite
 * Covers:
 * - Expansion 1: Sponsored Promotions & Featured School Ads (PROMO-001..004)
 * - Expansion 2: Event Webhooks & Automated Notifications (WH-001..004)
 * - Expansion 3: Nationwide Regional Expansion: Kumasi, Cape Coast, Takoradi & CSSPS (REG-001..003)
 */

const assert = require('assert');
const { PromotionsService } = require('../src/services/promotionsService');
const { WebhookService } = require('../src/services/webhookService');
const { RegionalExpansionService } = require('../src/services/regionalExpansionService');

console.log('======================================================================');
console.log('🌟 SKOOLFINDER GHANA: MASTER EXPANSIONS VERIFICATION SUITE');
console.log('   (Sponsored Ads, Event Webhooks & Nationwide Multi-Region Expansion)');
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
  const testSchoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6';
  const testUser = { id: 'usr-admin-01', name: 'Dr. Kobina Richardson', role: 'school_admin' };

  let createdCampaignId = null;
  let createdWebhookId = null;

  // --------------------------------------------------------------------------
  // 1. EXPANSION 1: SPONSORED PROMOTIONS & FEATURED SCHOOL ADS (MODULE 9)
  // --------------------------------------------------------------------------
  await it('PROMO-001: Retrieves approved Ghana Cedis promotion packages (GH₵ 75, GH₵ 135, GH₵ 250)', async () => {
    const res = PromotionsService.getPackages();
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.currency, 'GHS');
    assert.strictEqual(res.packages.length, 3);
    
    const p7 = res.packages.find(p => p.duration_days === 7);
    assert.strictEqual(p7.price_ghs, 75);
    const p14 = res.packages.find(p => p.duration_days === 14);
    assert.strictEqual(p14.price_ghs, 135);
    const p30 = res.packages.find(p => p.duration_days === 30);
    assert.strictEqual(p30.price_ghs, 250);
  });

  await it('PROMO-002: Creates promotion campaign targeting Homepage Hero, Directory & Compare', async () => {
    const res = await PromotionsService.createCampaign(testSchoolId, {
      packageId: 'pkg-promo-30d',
      title: 'GIS Academic Excellence Campaign 2026',
      headline: 'Enroll for World-Class Cambridge Education in Cantonments',
      customCallToAction: 'Apply for Admission'
    }, testUser);

    assert.strictEqual(res.success, true);
    assert.ok(res.campaign.id.startsWith('CAM-2026-'));
    assert.strictEqual(res.campaign.budget_ghs, 250);
    assert.strictEqual(res.campaign.status, 'pending_payment');
    assert.ok(res.campaign.placements.includes('homepage_hero'));
    assert.ok(res.campaign.placements.includes('directory_top'));
    createdCampaignId = res.campaign.id;
  });

  await it('PROMO-003: Initializes Paystack checkout and verifies payment to activate campaign', async () => {
    // 1. Checkout
    const checkoutRes = await PromotionsService.initializeCheckout(testSchoolId, createdCampaignId, testUser);
    assert.strictEqual(checkoutRes.success, true);
    assert.strictEqual(checkoutRes.amount_ghs, 250);
    assert.ok(checkoutRes.reference.startsWith('SF-PROMO-'));
    assert.ok(checkoutRes.checkout_url.includes('checkout.paystack.com'));

    // 2. Verify payment
    const verifyRes = await PromotionsService.verifyPayment(testSchoolId, createdCampaignId, {
      reference: checkoutRes.reference,
      channel: 'mtn_momo'
    }, testUser);

    assert.strictEqual(verifyRes.success, true);
    assert.strictEqual(verifyRes.campaign.status, 'active');
    assert.strictEqual(verifyRes.campaign.payment_channel, 'mtn_momo');
    assert.ok(verifyRes.campaign.activated_at !== null);
    assert.ok(verifyRes.campaign.expires_at !== null);
  });

  await it('PROMO-004: Tracks live impressions, clicks, CTR telemetry, and public active promotions', async () => {
    // Record impression
    await PromotionsService.trackImpression(createdCampaignId);
    await PromotionsService.trackImpression(createdCampaignId);

    // Record click
    const clickRes = await PromotionsService.trackClick(createdCampaignId);
    assert.strictEqual(clickRes.success, true);
    assert.strictEqual(clickRes.targetUrl, '/schools/ghana-international-school');

    // Get analytics
    const analytics = await PromotionsService.getCampaignAnalytics(createdCampaignId);
    assert.strictEqual(analytics.success, true);
    assert.ok(analytics.metrics.impressions_count >= 2);
    assert.ok(analytics.metrics.clicks_count >= 1);
    assert.ok(analytics.metrics.ctr_pct > 0);

    // Public active promotions
    const active = PromotionsService.getActivePromotions('directory_top');
    assert.strictEqual(active.success, true);
    assert.ok(active.count >= 1);
    assert.ok(active.promotions.some(p => p.id === createdCampaignId));
  });

  // --------------------------------------------------------------------------
  // 2. EXPANSION 2: EVENT WEBHOOKS & AUTOMATED NOTIFICATIONS (MODULE 15)
  // --------------------------------------------------------------------------
  await it('WH-001: Registers webhook subscription with HMAC SHA-256 signature secret', async () => {
    const res = await WebhookService.registerWebhook(testSchoolId, {
      name: 'Admissions Office n8n Webhook',
      targetUrl: 'https://n8n.gis.edu.gh/webhook/admissions-sync',
      subscribedEvents: ['ParentEnquirySubmitted', 'AdmissionOfferIssued', 'AdmissionOfferAccepted']
    }, testUser);

    assert.strictEqual(res.success, true);
    assert.ok(res.subscription.id.startsWith('WH-SUB-2026-'));
    assert.ok(res.subscription.secret_key.startsWith('whsec_'));
    assert.strictEqual(res.subscription.is_active, true);
    createdWebhookId = res.subscription.id;
  });

  await it('WH-002: Dispatches domain events with payload envelope and HMAC SHA-256 signature', async () => {
    const dispatchRes = await WebhookService.dispatchEvent(testSchoolId, 'AdmissionOfferIssued', {
      studentName: 'Kwabena Duodu',
      grade: 'Class 4',
      academicYear: '2026/2027',
      tuitionGhs: 18000
    }, testUser);

    assert.strictEqual(dispatchRes.success, true);
    assert.strictEqual(dispatchRes.eventName, 'AdmissionOfferIssued');
    assert.ok(dispatchRes.matchedSubscriptions >= 1);
    assert.strictEqual(dispatchRes.deliveries[0].http_status, 200);
    assert.ok(dispatchRes.deliveries[0].signature.startsWith('sha256='));

    const deliveries = await WebhookService.getWebhookDeliveries(testSchoolId);
    assert.strictEqual(deliveries.success, true);
    assert.ok(deliveries.count >= 1);
  });

  await it('WH-003: Generates localized WhatsApp parent notification payloads for admissions & attendance', async () => {
    const waOffer = WebhookService.formatWhatsAppPayload('+233245551212', 'admission_offer', {
      parentName: 'Mr. Kwame Duodu',
      schoolName: 'Ghana International School',
      link: 'https://skoolfinder.vercel.app/admissions/track/SF-ADM-2026'
    });
    assert.strictEqual(waOffer.channel, 'whatsapp_cloud_api');
    assert.ok(waOffer.messageText.includes('Ghana International School'));
    assert.ok(waOffer.messageText.includes('offered admission'));
    assert.ok(waOffer.messageText.includes('SkoolFinder Ghana'));

    const waAbsence = WebhookService.formatWhatsAppPayload('+233245551212', 'absence_alert', {
      parentName: 'Mrs. Cynthia Addo',
      schoolName: 'Ghana International School'
    });
    assert.ok(waAbsence.messageText.includes('CAMPUS ATTENDANCE NOTICE'));
    assert.ok(waAbsence.messageText.includes('morning roll call'));
  });

  await it('WH-004: Manages school notification preferences across Email, SMS, WhatsApp & Webhook', async () => {
    const updateRes = await WebhookService.updateNotificationPreferences(testSchoolId, {
      enquiry_alerts: { email: true, sms: true, whatsapp: true, webhook: true },
      admission_alerts: { email: true, sms: true, whatsapp: true, webhook: true },
      tender_bid_alerts: { email: true, sms: false, whatsapp: false, webhook: true }
    }, testUser);

    assert.strictEqual(updateRes.success, true);
    assert.strictEqual(updateRes.preferences.enquiry_alerts.whatsapp, true);
    assert.strictEqual(updateRes.preferences.tender_bid_alerts.sms, false);

    const getRes = WebhookService.getNotificationPreferences(testSchoolId);
    assert.strictEqual(getRes.success, true);
    assert.strictEqual(getRes.preferences.enquiry_alerts.sms, true);
  });

  // --------------------------------------------------------------------------
  // 3. EXPANSION 3: NATIONWIDE REGIONAL EXPANSION (KUMASI, CAPE COAST, TAKORADI)
  // --------------------------------------------------------------------------
  await it('REG-001: Retrieves 5 Ghanaian education regions with statistical metrics', async () => {
    const res = RegionalExpansionService.getRegions();
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.count, 5);

    const ashanti = res.regions.find(r => r.id === 'ashanti');
    assert.strictEqual(ashanti.name, 'Ashanti Region');
    assert.strictEqual(ashanti.capital, 'Kumasi');

    const central = res.regions.find(r => r.id === 'central');
    assert.strictEqual(central.name, 'Central Region');
    assert.strictEqual(central.capital, 'Cape Coast');

    const western = res.regions.find(r => r.id === 'western');
    assert.strictEqual(western.capital, 'Sekondi-Takoradi');
  });

  await it('REG-002: Queries regional anchor institutions in Kumasi, Cape Coast, and Takoradi', async () => {
    // Ashanti / Kumasi anchor schools
    const ashRes = RegionalExpansionService.getRegionalOverview('ashanti');
    assert.strictEqual(ashRes.success, true);
    assert.ok(ashRes.anchorSchoolsCount >= 3);
    assert.ok(ashRes.anchorSchools.some(s => s.name.includes('Prempeh College')));
    assert.ok(ashRes.anchorSchools.some(s => s.name.includes('Opoku Ware School')));
    assert.ok(ashRes.anchorSchools.some(s => s.name.includes('The Ridge School Kumasi')));

    // Central / Cape Coast anchor schools
    const cenRes = RegionalExpansionService.getRegionalOverview('central');
    assert.strictEqual(cenRes.success, true);
    assert.ok(cenRes.anchorSchoolsCount >= 3);
    assert.ok(cenRes.anchorSchools.some(s => s.name.includes('Mfantsipim School')));
    assert.ok(cenRes.anchorSchools.some(s => s.name.includes("Wesley Girls' High School")));
    assert.ok(cenRes.anchorSchools.some(s => s.name.includes('Adisadel College')));

    // Western / Takoradi anchor schools
    const westRes = RegionalExpansionService.getRegionalOverview('western');
    assert.strictEqual(westRes.success, true);
    assert.ok(westRes.anchorSchools.some(s => s.name.includes('Ghana Secondary Technical School')));
  });

  await it('REG-003: Evaluates GES CSSPS Category A school placement rules & private international admission', async () => {
    const cssps = RegionalExpansionService.getCsspsDirectory();
    assert.strictEqual(cssps.success, true);
    assert.ok(cssps.categories.categoryA.schools.length >= 5);
    assert.ok(cssps.categories.categoryA.selectionRule.includes('maximum of ONE Category A'));

    // Filter by Region & Category A
    const filtered = RegionalExpansionService.searchRegionalSchools({
      region: 'Central',
      csspsCategory: 'Category A'
    });
    assert.strictEqual(filtered.success, true);
    assert.ok(filtered.count >= 3);
    assert.ok(filtered.schools.every(s => s.region === 'Central'));
  });

  console.log('\n======================================================================');
  console.log(`📊 Master Expansions Verification Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error in Master Expansions test runner:', err);
  process.exit(1);
});
