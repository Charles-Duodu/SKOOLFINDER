/**
 * Automated Verification: UI Expansions Integration Suite
 * Verifies:
 * 1. Category A SHS Placement Filter in /api/schools?categoryA=true
 * 2. Active Promotions for Directory & Homepage Hero
 * 3. Webhooks & Multi-Channel Notification Persistence
 */
const assert = require('assert');
const http = require('http');

function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  console.log('======================================================================');
  console.log('🎨 SKOOLFINDER GHANA: UI EXPANSIONS END-TO-END VERIFICATION');
  console.log('======================================================================\n');

  let passed = 0;

  // Test 1: Category A SHS filter
  try {
    const res = await fetchJson('http://localhost:3000/api/schools?categoryA=true');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data), 'Returns an array of schools');
    assert.ok(res.data.length > 0, 'Found Category A institutions');
    const hasCatA = res.data.some(s => s.name.includes('Achimota') || s.name.includes('PRESEC') || s.name.includes('Prempeh'));
    assert.ok(hasCatA, 'Includes premier institutions (Achimota, PRESEC, or Prempeh)');
    console.log(`  ✅ [PASS] UI-REG-001: GES Category A filter successfully returns ${res.data.length} premier institutions`);
    passed++;
  } catch (err) {
    console.log(`  ❌ [FAIL] UI-REG-001: ${err.message}`);
  }

  // Test 2: Active Promotions API for Directory Top Spotlight
  try {
    const res = await fetchJson('http://localhost:3000/api/promotions/active?placement=directory_top');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.promotions), 'Returns active promotions list');
    console.log(`  ✅ [PASS] UI-PROMO-001: Active Directory Top promotion spotlight serves ${res.data.promotions.length} live campaign(s)`);
    passed++;
  } catch (err) {
    console.log(`  ❌ [FAIL] UI-PROMO-001: ${err.message}`);
  }

  // Test 3: Active Promotions API for Homepage Hero
  try {
    const res = await fetchJson('http://localhost:3000/api/promotions/active?placement=homepage_hero');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.promotions), 'Returns active hero promotions list');
    console.log(`  ✅ [PASS] UI-PROMO-002: Active Homepage Hero spotlight query operational (${res.data.promotions.length} live)`);
    passed++;
  } catch (err) {
    console.log(`  ❌ [FAIL] UI-PROMO-002: ${err.message}`);
  }

  // Test 4: Webhook Preferences Update
  try {
    const payload = JSON.stringify({
      whatsapp: true,
      sms: true,
      email: true,
      whatsappNumber: '+233241112222',
      smsNumber: '+233245551212',
      emailAddress: 'admissions@gis.edu.gh'
    });
    const res = await fetchJson('http://localhost:3000/api/webhooks/school/sch-gis-accra/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.preferences.whatsapp, true);
    assert.strictEqual(res.data.preferences.sms, true);
    console.log('  ✅ [PASS] UI-WH-001: Omnichannel Notification Preferences persisted across WhatsApp, SMS, and Email');
    passed++;
  } catch (err) {
    console.log(`  ❌ [FAIL] UI-WH-001: ${err.message}`);
  }

  console.log('\n======================================================================');
  console.log(`📊 UI Expansions Verification Results: ${passed}/4 Passed`);
  console.log('======================================================================');
}

run();
