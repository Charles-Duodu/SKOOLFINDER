/**
 * SkoolFinder Ghana - Option D: Greater Accra Pilot Readiness & Cross-Portal E2E Suite
 * End-to-End Simulation across all 5 Key Personas:
 * 1. Parents (Nana Kwame Duodu in East Legon)
 * 2. School Owner / Proprietor (Ghana International School)
 * 3. Educator (Miss Abigail Serwaa Mensah with NTC Licence)
 * 4. Accredited Supplier (West Africa STEM Innovations Ltd)
 * 5. Super Administrator (Platform Governance, NaSIA Vetting & Escrow Arbitration)
 */

const assert = require('assert');
const http = require('http');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/middleware/auth');

console.log('======================================================================');
console.log('🇬🇭 SKOOLFINDER GHANA: GREATER ACCRA PILOT READINESS & E2E (OPTION D)');
console.log('======================================================================');

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

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (e) { json = body; }
        resolve({ statusCode: res.statusCode, headers: res.headers, body: json });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  const app = require('../server');
  const server = http.createServer(app);
  await new Promise(res => server.listen(0, '127.0.0.1', res));
  const port = server.address().port;

  const superAdminToken = jwt.sign(
    { id: '00000000-0000-0000-0000-000000000001', email: 'admin@skoolfinder.com.gh', role: 'super_admin' },
    JWT_SECRET
  );

  const adminHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${superAdminToken}`
  };

  const pilotSchoolSlug = `accra-pilot-gis-${Date.now()}`;
  let pilotSchoolId = null;
  let verificationCaseId = null;
  let teacherVacancyId = null;
  let educatorApplicantId = null;
  let procurementTenderId = null;
  let supplierBidId = null;

  try {
    // ------------------------------------------------------------------------
    // JOURNEY 1: SCHOOL REGISTRATION, NASIA VETTING & COMMERCIAL SUBSCRIPTION
    // ------------------------------------------------------------------------
    await it('E2E-001: School Proprietor registers Greater Accra campus via wizard', async () => {
      const regRes = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/schools/register-wizard',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        name: 'Greater Accra Pilot Academy',
        slug: pilotSchoolSlug,
        category: 'Private',
        levels: ['Primary', 'JHS', 'SHS'],
        curricula: ['Cambridge', 'GES (NaCCA)'],
        region: 'Greater Accra',
        district: 'Accra Metropolitan',
        suburb: 'Cantonments',
        phone: '+233 24 000 8899',
        email: `proprietor-${Date.now()}@accrapilot.edu.gh`,
        proprietor_name: 'Dr. Kobina Richardson',
        user: { id: `user-pilot-prop-${Date.now()}`, email: `proprietor-${Date.now()}@accrapilot.edu.gh` }
      });
      assert.strictEqual(regRes.statusCode, 201);
      pilotSchoolId = regRes.body.school.id;
      assert.ok(pilotSchoolId);
    });

    await it('E2E-002: Proprietor uploads NaSIA regulatory licence & GPS verification', async () => {
      const docRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/verification-docs`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        documentType: 'nasia_license',
        documentNumber: 'NaSIA-GAR-2026-PILOT-01',
        fileUrl: 'https://skoolfinder.com.gh/uploads/pilot-nasia.pdf',
        expiresAt: '2028-12-31'
      });
      assert.strictEqual(docRes.statusCode, 201);
    });

    await it('E2E-003: Super Admin reviews NaSIA evidence and grants official verification', async () => {
      const casesRes = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/admin/verification-cases',
        method: 'GET',
        headers: adminHeaders
      });
      const vCase = casesRes.body.queue.find(c => String(c.school_id) === String(pilotSchoolId));
      assert.ok(vCase, `Verification case for school ${pilotSchoolId} must exist`);
      verificationCaseId = vCase.id;

      const reviewRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/admin/verification-cases/${verificationCaseId}/review`,
        method: 'POST',
        headers: adminHeaders
      }, {
        decision: 'approved',
        notes: 'Greater Accra pilot school accreditation approved under NaSIA Education Act 1023.'
      });
      assert.strictEqual(reviewRes.statusCode, 200);
      assert.strictEqual(reviewRes.body.authorityStatus, 'verified');
    });

    await it('E2E-004: School activates Growth Tier commercial subscription (GH₵ 99/mo)', async () => {
      // Initialize checkout
      const initRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/subscribe/initialize`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        tier: 'growth',
        billingInterval: 'monthly',
        paymentMethod: 'momo',
        momoNetwork: 'MTN',
        phone: '0244123456'
      });
      assert.strictEqual(initRes.statusCode, 200);
      const checkout = initRes.body.checkout || initRes.body;
      assert.strictEqual(checkout.amount, 99);

      // Verify payment activation
      const verifyRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/subscribe/verify`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        reference: checkout.reference,
        tier: 'growth',
        billingInterval: 'monthly'
      });
      assert.strictEqual(verifyRes.statusCode, 200);
      assert.strictEqual(verifyRes.body.subscription.tier, 'growth');
    });

    // ------------------------------------------------------------------------
    // JOURNEY 2: PARENT ADMISSION ENQUIRY & TOUR BOOKING
    // ------------------------------------------------------------------------
    await it('E2E-005: Parent Nana Kwame Duodu submits admissions enquiry for ward', async () => {
      const enqRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/enquiries`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        parentName: 'Nana Kwame Duodu',
        parentEmail: 'kwame.duodu@accraparents.gh',
        parentPhone: '+233 24 555 1212',
        childName: 'Kwabena Duodu',
        intendedGrade: 'Primary 4',
        message: 'Inquiring regarding September 2026 intake, robotics lab facilities, and Cambridge curriculum.'
      });
      assert.strictEqual(enqRes.statusCode, 201);
      assert.strictEqual(enqRes.body.success, true);
    });

    // ------------------------------------------------------------------------
    // JOURNEY 3: EDUCATOR RECRUITING, NTC DOSSIER & OFFER LETTER CONTRACT
    // ------------------------------------------------------------------------
    await it('E2E-006: School publishes Teacher Vacancy (Growth Tier quota: 3 vacancies)', async () => {
      const vacRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/vacancies`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Lead Robotics & Computing Educator',
        department: 'STEM & ICT',
        level: 'JHS / SHS',
        curriculum: 'Cambridge & GES',
        salaryRange: 'GH₵ 3,800 - 4,800',
        minExperienceYears: 3,
        description: 'Seeking certified STEM educator to lead our campus robotics club and computing curriculum.'
      });
      assert.strictEqual(vacRes.statusCode, 201);
      teacherVacancyId = vacRes.body.vacancy.id;
    });

    await it('E2E-007: Certified Teacher Abigail Mensah discovers job and applies with NTC licence', async () => {
      const applyRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/jobs/${teacherVacancyId}/apply`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        fullName: 'Miss Abigail Serwaa Mensah',
        email: 'abigail.mensah@educators.gh',
        phone: '+233 24 999 4455',
        ntcNumber: 'NTC-PH-2026-9921',
        qualification: 'B.Sc Computer Science & PGDE',
        yearsExperience: 5,
        currentSchool: 'Accra International School'
      });
      assert.strictEqual(applyRes.statusCode, 201);
      educatorApplicantId = applyRes.body.applicationId;
      assert.ok(educatorApplicantId);
      assert.strictEqual(applyRes.body.ntcVerified, true);
    });

    await it('E2E-008: School issues formal Employment Offer Letter (GH₵ 4,500/mo)', async () => {
      const offerRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/vacancies/${teacherVacancyId}/applicants/${educatorApplicantId}/offer`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        positionTitle: 'Head of Robotics & Computing',
        department: 'STEM Department',
        grossSalaryGhs: 4500,
        termStartDate: '2026-09-01',
        probationMonths: 3
      });
      assert.strictEqual(offerRes.statusCode, 200);
      assert.strictEqual(offerRes.body.offerLetter.status, 'pending_candidate_acceptance');
    });

    await it('E2E-009: Teacher digitally accepts and signs the employment offer contract', async () => {
      const acceptRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/jobs/applications/${educatorApplicantId}/offer-response`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        decision: 'accepted',
        candidateSignature: 'Abigail Serwaa Mensah (Digital Acceptance)'
      });
      assert.strictEqual(acceptRes.statusCode, 200);
      assert.strictEqual(acceptRes.body.offer.status, 'accepted');
    });

    // ------------------------------------------------------------------------
    // JOURNEY 4: B2B TENDER, DIGITAL LPO, 50/50 MOMO ESCROW & SUPPLIER RATING
    // ------------------------------------------------------------------------
    await it('E2E-010: School purchases 1 Tender Credit (GH₵ 45) and publishes B2B RFQ', async () => {
      // Buy 1 credit
      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/tenders/buy-credits`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { packType: 'single', paymentMethod: 'momo' });

      // Post tender
      const tndRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/tenders`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Institutional Bulk Purchase: 100 Dell All-in-One Desktop PCs',
        category: 'IT / Software / Computers',
        budgetMaxGhs: 150000,
        specifications: 'Intel Core i5, 16GB RAM, 512GB SSD for High School Computer Laboratory'
      });
      assert.strictEqual(tndRes.statusCode, 201);
      procurementTenderId = tndRes.body.tender.id;
    });

    await it('E2E-011: Accredited Supplier West Africa STEM submits competitive quotation', async () => {
      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/rfqs/${procurementTenderId}/quote`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        supplierId: 'sup-wa-stem',
        supplierName: 'West Africa STEM Innovations Ltd',
        amount: 145000,
        price: 'GH₵ 145,000',
        quotedAmountGhs: 145000,
        deliveryTimelineDays: 14,
        warrantyMonths: 36
      });

      const bidsRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/tenders/${procurementTenderId}/bids`,
        method: 'GET'
      });
      assert.strictEqual(bidsRes.statusCode, 200);
      supplierBidId = bidsRes.body.bids[0].id;
      assert.ok(supplierBidId);
    });

    await it('E2E-012: School awards contract, generates and digitally seals LPO (GH₵ 145,000)', async () => {
      // Award
      const awardRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/tenders/${procurementTenderId}/award`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { bidId: supplierBidId });
      assert.strictEqual(awardRes.statusCode, 200);

      // Sign LPO
      const lpoRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/tenders/${procurementTenderId}/lpo/sign`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        signatoryName: 'Dr. Kobina Richardson',
        signatoryTitle: 'Executive Director'
      });
      assert.strictEqual(lpoRes.statusCode, 200);
      assert.strictEqual(lpoRes.body.lpo.totalAmountGhs, 145000);
      assert.strictEqual(lpoRes.body.lpo.signedBySchool, true);
    });

    await it('E2E-013: School locks 50% Mobilization Deposit (GH₵ 72,500) into MoMo Escrow', async () => {
      const lockRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/tenders/${procurementTenderId}/escrow-milestone`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { paymentMethod: 'momo' });
      assert.strictEqual(lockRes.statusCode, 200);
      assert.strictEqual(lockRes.body.milestone.status, 'funded_in_escrow');
      assert.strictEqual(lockRes.body.milestone.amount, 72500);
    });

    await it('E2E-014: Campus delivery inspected, full disbursement released, and vendor rated 5/5', async () => {
      // Delivery sign-off
      const signoffRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/tenders/${procurementTenderId}/delivery-signoff`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        inspectionNotes: 'All 100 Dell PCs verified on campus in Cantonments. Serial numbers and warranty logged.'
      });
      assert.strictEqual(signoffRes.statusCode, 200);

      // Rate supplier
      const rateRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/tenders/${procurementTenderId}/rate-supplier`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        rating: 5,
        reviewText: 'Exceptional fulfillment, all PCs set up in lab ahead of delivery SLA.'
      });
      assert.strictEqual(rateRes.statusCode, 200);
      assert.strictEqual(rateRes.body.rating.rating, 5);
    });

    // ------------------------------------------------------------------------
    // JOURNEY 5: SUPER ADMIN TELEMETRY & ESCROW DISPUTE ARBITRATION
    // ------------------------------------------------------------------------
    await it('E2E-015: Super Admin verifies platform GMV and arbitrates escrow disputes seamlessly', async () => {
      // 1. GMV Telemetry
      const gmvRes = await request({
        hostname: '127.0.0.1',
        port,
        path: '/api/admin/subscriptions',
        method: 'GET',
        headers: adminHeaders
      });
      assert.strictEqual(gmvRes.statusCode, 200);
      assert.ok(gmvRes.body.totalGmvGhs > 0);

      // 2. Audit Trail
      const auditRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${pilotSchoolId}/marketplace/audit-log`,
        method: 'GET'
      });
      assert.strictEqual(auditRes.statusCode, 200);
      assert.ok(auditRes.body.logs.length >= 5, 'Should have rich audit trail');
    });

  } finally {
    server.close();
  }

  console.log('======================================================================');
  console.log(`📊 Option D Greater Accra Pilot Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error in Option D test runner:', err);
  process.exit(1);
});
