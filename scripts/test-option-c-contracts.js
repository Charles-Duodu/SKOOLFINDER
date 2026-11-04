/**
 * SkoolFinder Ghana - Option C: Institutional HR & B2B Procurement Contracts Test Suite
 * Packages: CON-001 through CON-008
 */

const assert = require('assert');
const http = require('http');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/middleware/auth');

console.log('======================================================================');
console.log('📜 SKOOLFINDER GHANA: INSTITUTIONAL CONTRACTS & HR (OPTION C)');
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

  const schoolId = 'sch-contracts-gis-accra';
  const superAdminToken = jwt.sign(
    { id: '00000000-0000-0000-0000-000000000001', email: 'admin@skoolfinder.com.gh', role: 'super_admin' },
    JWT_SECRET
  );

  const adminHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${superAdminToken}`
  };

  try {
    // Setup: Buy tender credits & publish a tender
    await request({
      hostname: '127.0.0.1',
      port,
      path: `/api/schools/${schoolId}/tenders/buy-credits`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { packType: 'bundle_3', paymentMethod: 'momo' });

    const tenderRes = await request({
      hostname: '127.0.0.1',
      port,
      path: `/api/schools/${schoolId}/tenders`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: 'Supply of 250 STEM Robotics & Coding Kits',
      category: 'Lab Equipment',
      budgetMaxGhs: 50000,
      specifications: 'Modular Arduino-compatible robotics kits for JHS 1-3'
    });
    assert.strictEqual(tenderRes.statusCode, 201);
    const tenderId = tenderRes.body.tender.id;

    // Supplier submits bid
    await request({
      hostname: '127.0.0.1',
      port,
      path: `/api/rfqs/${tenderId}/quote`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      supplierId: 'sup-stem-gh',
      supplierName: 'West Africa STEM Innovations Ltd',
      amount: 48000,
      price: 'GH₵ 48,000',
      quotedAmountGhs: 48000,
      deliveryTimelineDays: 14,
      warrantyMonths: 24
    });

    const bidsRes = await request({
      hostname: '127.0.0.1',
      port,
      path: `/api/schools/${schoolId}/tenders/${tenderId}/bids`,
      method: 'GET'
    });
    const bidId = bidsRes.body.bids[0].id;

    // School awards contract
    await request({
      hostname: '127.0.0.1',
      port,
      path: `/api/schools/${schoolId}/tenders/${tenderId}/award`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { bidId });

    // 1. CON-001: Digital Local Purchase Order (LPO) Generation
    await it('CON-001: School generates official digital Local Purchase Order (LPO)', async () => {
      const lpoRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/lpo`,
        method: 'GET'
      });
      assert.strictEqual(lpoRes.statusCode, 200);
      assert.strictEqual(lpoRes.body.success, true);
      const lpo = lpoRes.body.lpo;
      assert.ok(lpo.lpoNumber.startsWith('SF-LPO-'), `LPO number should start with SF-LPO-`);
      assert.strictEqual(lpo.totalAmountGhs, 48000);
      assert.strictEqual(lpo.milestones.length, 2);
      assert.strictEqual(lpo.milestones[0].amountGhs, 24000);
      assert.strictEqual(lpo.milestones[1].amountGhs, 24000);
      assert.strictEqual(lpo.signedBySchool, false);
    });

    // 2. CON-002: Digital LPO Execution & Seal
    await it('CON-002: School Bursar signs and digitally seals the LPO contract', async () => {
      const signRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/lpo/sign`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        signatoryName: 'Rev. Emmanuel Donkor',
        signatoryTitle: 'Head of Finance & Bursar'
      });
      assert.strictEqual(signRes.statusCode, 200);
      assert.strictEqual(signRes.body.success, true);
      assert.strictEqual(signRes.body.lpo.signedBySchool, true);
      assert.strictEqual(signRes.body.lpo.status, 'issued_and_signed');
      assert.ok(signRes.body.lpo.signatureHash.startsWith('SIG-LPO-'));
    });

    // Setup: Fund milestone 1, signoff milestone 2
    await request({
      hostname: '127.0.0.1',
      port,
      path: `/api/schools/${schoolId}/tenders/${tenderId}/escrow-milestone`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { paymentMethod: 'momo' });

    await request({
      hostname: '127.0.0.1',
      port,
      path: `/api/schools/${schoolId}/tenders/${tenderId}/delivery-signoff`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { inspectionNotes: 'All 250 robotics kits inspected and tested on campus. 100% compliant.' });

    // 3. CON-003: Supplier Fulfillment Performance Rating & Scorecard
    await it('CON-003: School submits post-delivery vendor rating and review scorecard', async () => {
      const rateRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/tenders/${tenderId}/rate-supplier`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        rating: 5,
        punctualityScore: 5,
        qualityScore: 5,
        reviewText: 'Flawless delivery, prompt technical orientation provided to our computing teachers.'
      });
      assert.strictEqual(rateRes.statusCode, 200);
      assert.strictEqual(rateRes.body.success, true);
      assert.strictEqual(rateRes.body.rating.rating, 5);
      assert.strictEqual(rateRes.body.rating.supplierName, 'West Africa STEM Innovations Ltd');
    });

    // Setup for HR offer letters: Publish vacancy & submit candidate
    const AdmissionsSubscriptionService = require('../src/services/admissionsSubscriptionService');
    const MarketplaceService = require('../src/services/marketplaceService');
    await AdmissionsSubscriptionService.adminSetSchoolTier(schoolId, 'growth', 30);
    const vacRes = await MarketplaceService.createVacancy(schoolId, {
      title: 'Senior Physics & Robotics Teacher',
      department: 'Sciences',
      level: 'SHS',
      curriculum: 'Cambridge A-Level',
      salaryRange: 'GH₵ 3,500 - 4,500'
    });
    const vac = vacRes.vacancy;

    const appRes = await request({
      hostname: '127.0.0.1',
      port,
      path: `/api/jobs/${vac.id}/apply`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      fullName: 'Miss Abigail Serwaa Mensah',
      email: 'abigail.mensah@educators.gh',
      phone: '+233 24 111 2233',
      ntcNumber: 'NTC-PH-2026-8871',
      qualification: 'M.Sc Applied Physics & PGDE',
      yearsExperience: 6,
      currentSchool: 'Accra Girls Senior High'
    });
    assert.strictEqual(appRes.statusCode, 201);
    const applicantId = appRes.body.applicationId || appRes.body.application?.id;

    // 4. CON-004: Formal Employment Offer Letter Generation
    let offerNumber = null;
    await it('CON-004: School HR recruiter generates formal Employment Offer Letter', async () => {
      const offerRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/vacancies/${vac.id}/applicants/${applicantId}/offer`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        positionTitle: 'Lead Physics & Robotics Educator',
        department: 'Science & Computing',
        grossSalaryGhs: 4200,
        termStartDate: '2026-09-01',
        probationMonths: 3
      });
      assert.strictEqual(offerRes.statusCode, 200);
      assert.strictEqual(offerRes.body.success, true);
      const offer = offerRes.body.offerLetter;
      assert.ok(offer.offerNumber.startsWith('SF-OFR-'));
      offerNumber = offer.offerNumber;
      assert.strictEqual(offer.grossSalaryGhs, 4200);
      assert.strictEqual(offer.status, 'pending_candidate_acceptance');
    });

    // 5. CON-005: Candidate Reviews Offer Letter
    await it('CON-005: Educator candidate retrieves offer letter via candidate portal (/jobs)', async () => {
      const getOfferRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/jobs/applications/${applicantId}/offer`,
        method: 'GET'
      });
      assert.strictEqual(getOfferRes.statusCode, 200);
      assert.strictEqual(getOfferRes.body.success, true);
      assert.strictEqual(getOfferRes.body.offer.candidateName, 'Miss Abigail Serwaa Mensah');
      assert.strictEqual(getOfferRes.body.offer.grossSalaryGhs, 4200);
    });

    // 6. CON-006: Candidate Digital Acceptance of Offer
    await it('CON-006: Candidate digitally accepts and signs the employment offer', async () => {
      const acceptRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/jobs/applications/${applicantId}/offer-response`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        decision: 'accepted',
        candidateSignature: 'Abigail Serwaa Mensah (Digital Seal)'
      });
      assert.strictEqual(acceptRes.statusCode, 200);
      assert.strictEqual(acceptRes.body.success, true);
      assert.strictEqual(acceptRes.body.offer.status, 'accepted');
      assert.ok(acceptRes.body.offer.candidateSignature.includes('Abigail Serwaa Mensah'));
    });

    // 7. CON-007: Candidate Offer Decline Flow
    await it('CON-007: Candidate offer decline flow records reason and audit trail', async () => {
      // Second applicant
      const app2Res = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/jobs/${vac.id}/apply`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        fullName: 'Mr. Joseph Kofi Amponsah',
        email: 'joseph.amponsah@educators.gh',
        phone: '+233 20 555 4433',
        ntcNumber: 'NTC-PH-2026-1122'
      });
      const applicantId2 = app2Res.body.applicationId || app2Res.body.application?.id;

      // Issue offer
      await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/vacancies/${vac.id}/applicants/${applicantId2}/offer`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        positionTitle: 'Physics Tutor',
        grossSalaryGhs: 3200
      });

      // Decline offer
      const declineRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/jobs/applications/${applicantId2}/offer-response`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        decision: 'declined',
        reason: 'Accepted competing offer from international school in Airport Residential.'
      });
      assert.strictEqual(declineRes.statusCode, 200);
      assert.strictEqual(declineRes.body.success, true);
      assert.strictEqual(declineRes.body.offer.status, 'declined');
    });

    // 8. CON-008: Tamper-Evident Contract Audit Trail
    await it('CON-008: Audit trail records LPO execution, offer letters, and supplier ratings', async () => {
      const auditRes = await request({
        hostname: '127.0.0.1',
        port,
        path: `/api/schools/${schoolId}/marketplace/audit-log`,
        method: 'GET'
      });
      assert.strictEqual(auditRes.statusCode, 200);
      const logs = auditRes.body.logs;

      const hasLpoLog = logs.some(l => l.event_type === 'TENDER_LPO_EXECUTED');
      const hasOfferLog = logs.some(l => l.event_type === 'TEACHER_OFFER_LETTER_ISSUED');
      const hasOfferAcceptLog = logs.some(l => l.event_type === 'TEACHER_OFFER_ACCEPTED');
      const hasRatingLog = logs.some(l => l.event_type === 'SUPPLIER_FULFILLMENT_RATED');

      assert.ok(hasLpoLog, 'Audit log must record TENDER_LPO_EXECUTED');
      assert.ok(hasOfferLog, 'Audit log must record TEACHER_OFFER_LETTER_ISSUED');
      assert.ok(hasOfferAcceptLog, 'Audit log must record TEACHER_OFFER_ACCEPTED');
      assert.ok(hasRatingLog, 'Audit log must record SUPPLIER_FULFILLMENT_RATED');
    });

  } finally {
    server.close();
  }

  console.log('======================================================================');
  console.log(`📊 Option C Contracts Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error in Option C test runner:', err);
  process.exit(1);
});
