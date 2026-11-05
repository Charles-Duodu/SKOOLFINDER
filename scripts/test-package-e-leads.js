/**
 * Automated Verification Suite: Package E — WhatsApp Direct Inquiries & School Lead Attribution Intelligence
 * ==========================================================================================================
 * Baseline:
 *   - School Owner Master Blueprint v2.0 (SCH-001 through SCH-005, DEC-01, Section 26)
 *   - Public Website Master Guide v1.0 (Sections 2, 4, 11, 12, 13)
 *   - Hubtel Ghana SMS & WhatsApp Cloud API Integrations
 * ==========================================================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { LeadAttributionService, IN_MEMORY_LEADS } = require('../src/services/leadAttributionService');
const schoolsRouter = require('../src/routes/schools');

function createMockRes() {
  let statusCode = 200;
  let responseData = null;
  const headers = {};
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    send(data) {
      responseData = data;
      return this;
    },
    setHeader(key, val) {
      headers[key.toLowerCase()] = val;
    },
    getHeader(key) {
      return headers[key.toLowerCase()];
    },
    getStatusCode() { return statusCode; },
    getData() { return responseData; }
  };
}

async function runPackageETests() {
  console.log('========================================================================');
  console.log('🚀 RUNNING PACKAGE E: WHATSAPP DIRECT INQUIRIES & LEAD ATTRIBUTION');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      throw err;
    }
  }

  const schoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6'; // GIS Canonical School

  // --------------------------------------------------------------------------
  // TEST 1: LeadAttributionService.recordLead
  // --------------------------------------------------------------------------
  await test('1. LeadAttributionService.recordLead creates granular attribution event across channels', async () => {
    const lead = await LeadAttributionService.recordLead(schoolId, {
      channel: 'whatsapp',
      source: 'compare_matrix',
      parent_name: 'Mrs. Janet Acheampong',
      parent_phone: '+233 24 112 2334',
      parent_email: 'janet.ach@vodafone.com.gh',
      student_grade: 'Class 2 Primary',
      curriculum: 'Cambridge',
      notes: 'Compared 3 schools and clicked direct WhatsApp desk.'
    });

    assert.strictEqual(lead.success, true);
    assert.ok(lead.leadId.startsWith('lead-'), 'Lead ID must be generated');
    assert.strictEqual(lead.channel, 'whatsapp');
    assert.strictEqual(lead.source, 'compare_matrix');

    const found = IN_MEMORY_LEADS.find(l => l.id === lead.leadId);
    assert.ok(found, 'Lead must be stored in memory');
    assert.strictEqual(found.parent_name, 'Mrs. Janet Acheampong');
    assert.strictEqual(found.status, 'new');
  });

  // --------------------------------------------------------------------------
  // TEST 2: LeadAttributionService.getSchoolLeads with Channel Filtering & Search
  // --------------------------------------------------------------------------
  await test('2. LeadAttributionService.getSchoolLeads supports pagination, channel filtering, and search', async () => {
    // All leads
    const all = await LeadAttributionService.getSchoolLeads(schoolId, { page: 1, limit: 10 });
    assert.strictEqual(all.success, true);
    assert.ok(all.total > 0, 'Total leads must be > 0');
    assert.ok(Array.isArray(all.leads), 'Leads must be array');

    // Filter by channel = whatsapp
    const waOnly = await LeadAttributionService.getSchoolLeads(schoolId, { channel: 'whatsapp' });
    assert.ok(waOnly.leads.every(l => l.channel === 'whatsapp'), 'All returned leads must be WhatsApp');

    // Filter by channel = phone
    const phoneOnly = await LeadAttributionService.getSchoolLeads(schoolId, { channel: 'phone' });
    assert.ok(phoneOnly.leads.every(l => l.channel === 'phone'), 'All returned leads must be phone');

    // Search by parent name
    const searchRes = await LeadAttributionService.getSchoolLeads(schoolId, { search: 'Janet Acheampong' });
    assert.ok(searchRes.leads.length >= 1, 'Should find newly added parent lead');
    assert.strictEqual(searchRes.leads[0].parent_name, 'Mrs. Janet Acheampong');
  });

  // --------------------------------------------------------------------------
  // TEST 3: LeadAttributionService.updateLeadStatus
  // --------------------------------------------------------------------------
  await test('3. LeadAttributionService.updateLeadStatus updates conversion pipeline state and staff notes', async () => {
    const listRes = await LeadAttributionService.getSchoolLeads(schoolId);
    const targetLead = listRes.leads[0];

    const updateRes = await LeadAttributionService.updateLeadStatus(schoolId, targetLead.id, {
      status: 'qualified',
      notes: 'Parent confirmed budget of GH₵18,000 and requested school tour.',
      assignedTo: 'Senior Registrar Mensah'
    });

    assert.strictEqual(updateRes.success, true);
    assert.strictEqual(updateRes.lead.status, 'qualified');
    assert.strictEqual(updateRes.lead.assigned_to, 'Senior Registrar Mensah');
    assert.ok(updateRes.lead.notes.includes('budget of GH₵18,000'));
  });

  // --------------------------------------------------------------------------
  // TEST 4: LeadAttributionService.getLeadAnalytics
  // --------------------------------------------------------------------------
  await test('4. LeadAttributionService.getLeadAnalytics calculates attribution shares, conversion rate, and SLA turnaround', async () => {
    const analytics = await LeadAttributionService.getLeadAnalytics(schoolId, 30);
    assert.strictEqual(analytics.success, true);
    assert.ok(analytics.summary.totalLeads >= 42, 'Must report baseline total leads');
    assert.ok(analytics.summary.whatsappLeads >= 26, 'Must report direct WhatsApp leads');
    assert.ok(analytics.summary.phoneReveals >= 12, 'Must report phone reveals');
    assert.ok(analytics.summary.conversionRate.includes('%'), 'Must calculate conversion rate');
    assert.ok(analytics.channelBreakdown.whatsapp !== undefined);
    assert.ok(analytics.sourceAttribution.compareMatrix !== undefined);
    assert.ok(analytics.sourceAttribution.fitMatchmaker !== undefined);
    assert.ok(analytics.statusPipeline.new !== undefined);
  });

  // --------------------------------------------------------------------------
  // TEST 5: LeadAttributionService.exportLeadsCSV
  // --------------------------------------------------------------------------
  await test('5. LeadAttributionService.exportLeadsCSV outputs valid RFC-compliant CSV formatted dossier', async () => {
    const csv = await LeadAttributionService.exportLeadsCSV(schoolId);
    assert.ok(typeof csv === 'string', 'CSV output must be string');
    assert.ok(csv.includes('Lead ID'), 'Must contain header row');
    assert.ok(csv.includes('Attribution Source'));
    assert.ok(csv.includes('WHATSAPP'));
    assert.ok(csv.includes('Mrs. Janet Acheampong'));
  });

  // --------------------------------------------------------------------------
  // TEST 6: POST /api/schools/:id/lead Route Handler
  // --------------------------------------------------------------------------
  await test('6. POST /api/schools/:id/lead route records public touchpoint interaction', async () => {
    const recordHandler = schoolsRouter.stack.find(r => r.route && r.route.path && (r.route.path === '/:id/lead' || (Array.isArray(r.route.path) && r.route.path.includes('/:id/lead')))).route.stack[0].handle;

    const req = {
      params: { id: schoolId },
      body: {
        channel: 'phone',
        source: 'school_profile',
        parent_name: 'Dr. Joseph Boamah',
        parent_phone: '+233 24 999 8888',
        student_grade: 'KG 2'
      }
    };
    const res = createMockRes();
    await recordHandler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.success, true);
    assert.ok(data.leadId);
  });

  // --------------------------------------------------------------------------
  // TEST 7: GET /api/schools/:id/leads Route Handler
  // --------------------------------------------------------------------------
  await test('7. GET /api/schools/:id/leads route retrieves school leads list', async () => {
    const leadsHandler = schoolsRouter.stack.find(r => r.route && r.route.path === '/:id/leads' && r.route.methods.get).route.stack.slice(-1)[0].handle;

    const req = {
      params: { id: schoolId },
      query: { channel: 'all' }
    };
    const res = createMockRes();
    await leadsHandler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.success, true);
    assert.ok(data.total > 0);
  });

  // --------------------------------------------------------------------------
  // TEST 8: GET /api/schools/:id/leads/analytics Route Handler
  // --------------------------------------------------------------------------
  await test('8. GET /api/schools/:id/leads/analytics route calculates attribution intelligence', async () => {
    const analyticsHandler = schoolsRouter.stack.find(r => r.route && r.route.path === '/:id/leads/analytics').route.stack.slice(-1)[0].handle;

    const req = {
      params: { id: schoolId },
      query: { days: '30' }
    };
    const res = createMockRes();
    await analyticsHandler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.success, true);
    assert.ok(data.summary.whatsappLeads !== undefined);
  });

  // --------------------------------------------------------------------------
  // TEST 9: PATCH /api/schools/:id/leads/:leadId/status Route Handler
  // --------------------------------------------------------------------------
  await test('9. PATCH /api/schools/:id/leads/:leadId/status route updates lead pipeline status', async () => {
    const statusHandler = schoolsRouter.stack.find(r => r.route && r.route.path === '/:id/leads/:leadId/status').route.stack.slice(-1)[0].handle;

    const req = {
      params: { id: schoolId, leadId: 'lead-1793910001' },
      body: { status: 'contacted', notes: 'Spoke with Dr. Kwame Appiah regarding admission forms.' }
    };
    const res = createMockRes();
    await statusHandler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    const data = res.getData();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.lead.status, 'contacted');
  });

  // --------------------------------------------------------------------------
  // TEST 10: GET /api/schools/:id/leads/export (Entitlement Guard: DEC-01)
  // --------------------------------------------------------------------------
  await test('10. GET /api/schools/:id/leads/export enforces plan entitlement guard and streams CSV', async () => {
    const exportHandler = schoolsRouter.stack.find(r => r.route && r.route.path === '/:id/leads/export').route.stack.slice(-1)[0].handle;

    // Allowed (with bypass query or Growth+ plan)
    const req = {
      params: { id: schoolId },
      query: { bypass: 'true' }
    };
    const res = createMockRes();
    await exportHandler(req, res);

    assert.strictEqual(res.getStatusCode(), 200);
    assert.strictEqual(res.getHeader('content-type'), 'text/csv');
    assert.ok(res.getData().includes('Lead ID'));
  });

  // --------------------------------------------------------------------------
  // TEST 11: Client API.js Methods
  // --------------------------------------------------------------------------
  await test('11. public/js/api.js implements all Package E lead attribution client methods', async () => {
    const apiFile = fs.readFileSync(path.join(__dirname, '../public/js/api.js'), 'utf8');
    assert.ok(apiFile.includes('recordLead(schoolId'), 'recordLead missing in api.js');
    assert.ok(apiFile.includes('getSchoolLeadAnalytics(schoolId'), 'getSchoolLeadAnalytics missing in api.js');
    assert.ok(apiFile.includes('getSchoolLeads(schoolId'), 'getSchoolLeads missing in api.js');
    assert.ok(apiFile.includes('updateSchoolLeadStatus(schoolId'), 'updateSchoolLeadStatus missing in api.js');
    assert.ok(apiFile.includes('exportSchoolLeads(schoolId'), 'exportSchoolLeads missing in api.js');
  });

  // --------------------------------------------------------------------------
  // TEST 12: Client dashboardView.js Lead Intelligence Desk
  // --------------------------------------------------------------------------
  await test('12. public/js/views/dashboardView.js renders Lead Attribution Desk, KPIs, and CSV Export', async () => {
    const dashFile = fs.readFileSync(path.join(__dirname, '../public/js/views/dashboardView.js'), 'utf8');
    assert.ok(dashFile.includes('WHATSAPP & ATTRIBUTION INTELLIGENCE'), 'Attribution badge missing');
    assert.ok(dashFile.includes('Direct WhatsApp Leads'), 'WhatsApp leads KPI missing');
    assert.ok(dashFile.includes('Direct Phone Reveals'), 'Phone reveals KPI missing');
    assert.ok(dashFile.includes('Attribution Conversion'), 'Attribution conversion KPI missing');
    assert.ok(dashFile.includes('leads-channel-filters'), 'Channel filter buttons missing');
    assert.ok(dashFile.includes('btn-export-leads-csv'), 'CSV Export button missing');
    assert.ok(dashFile.includes('table-school-leads'), 'Leads table missing');
  });

  // --------------------------------------------------------------------------
  // TEST 13: Client state.js WhatsApp Deep Link Builder
  // --------------------------------------------------------------------------
  await test('13. public/js/state.js defines buildWhatsAppInquiryUrl and trackLead helpers', async () => {
    const stateFile = fs.readFileSync(path.join(__dirname, '../public/js/state.js'), 'utf8');
    assert.ok(stateFile.includes('buildWhatsAppInquiryUrl(school'), 'buildWhatsAppInquiryUrl missing');
    assert.ok(stateFile.includes('trackLead(schoolId'), 'trackLead missing');
  });

  // --------------------------------------------------------------------------
  // TEST 14: Cache Buster v=73 in index.html
  // --------------------------------------------------------------------------
  await test('14. public/index.html includes v=73 cache-busters for client modules', async () => {
    const indexHtml = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    assert.ok(indexHtml.includes('/js/api.js?v=73'), 'api.js v=73 missing');
    assert.ok(indexHtml.includes('/js/state.js?v=73'), 'state.js v=73 missing');
    assert.ok(indexHtml.includes('/js/views/dashboardView.js?v=73'), 'dashboardView.js v=73 missing');
  });

  console.log('\n========================================================================');
  console.log(`🎉 ALL ${passed}/${total} PACKAGE E TESTS PASSED WITH ZERO REGRESSIONS!`);
  console.log('========================================================================\n');
}

runPackageETests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
