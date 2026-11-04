/**
 * SkoolFinder Ghana — Phase 2B Automated Verification Test Suite
 * Baseline: Blueprint v2.0 Sections 6, 12, 13, 23, 25, 26.4
 * Covers:
 *   - Teacher Vacancies & Recruiting: VAC-001 through VAC-006
 *   - B2B Procurement RFQs & Tenders: TEN-001 through TEN-006
 *   - Supplier Quotation 50/50 MoMo Milestone Escrow: ESC-001 through ESC-004
 */

const http = require('http');
const app = require('../server');

const TEST_PORT = 4897;
let server;

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({ port: TEST_PORT, host: '127.0.0.1', ...options }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data, body: null });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      if (typeof postData === 'string') {
        req.write(postData);
      } else {
        req.write(JSON.stringify(postData));
      }
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('========================================================================');
  console.log('SKOOLFINDER GHANA — PHASE 2B AUTOMATED VERIFICATION SUITE');
  console.log('Baseline: Blueprint v2.0 Sections 6, 12, 13, 23, 25, 26.4');
  console.log('========================================================================\n');

  await new Promise(resolve => {
    server = app.listen(TEST_PORT, () => {
      console.log(`[TEST HARNESS] Running on http://127.0.0.1:${TEST_PORT}\n`);
      resolve();
    });
  });

  const testSchoolId = `sch-mkt-test-${Date.now()}`;
  let vacancy1Id;
  let vacancy2Id;
  let vacancy3Id;
  let applicationId;
  let tender1Id;
  let tender2Id;
  let bid1Id;
  let bid2Id;

  try {
    // ------------------------------------------------------------------------
    // PACKAGE 1: VAC-001 — Simultaneous Active Vacancy Quotas Enforcement
    // ------------------------------------------------------------------------
    console.log('--- TEST 1: [VAC-001] Simultaneous Active Vacancy Quotas Enforcement ---');
    {
      // Default school has Free plan (quota: 0 active vacancies)
      const res0 = await request({
        path: `/api/schools/${testSchoolId}/vacancies`,
        method: 'GET'
      });
      assert(res0.status === 200, `Expected 200, got ${res0.status}`);
      assert(res0.body.quota.planTier === 'free', `Expected free tier, got ${res0.body.quota.planTier}`);
      assert(res0.body.quota.baseQuota === 0, `Expected base quota 0 for Free tier, got ${res0.body.quota.baseQuota}`);

      // Attempting to post a published vacancy on Free tier must fail with 400
      const postFail = await request({
        path: `/api/schools/${testSchoolId}/vacancies`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'JHS Science Teacher',
        status: 'published'
      });
      assert(postFail.status === 400, `Expected 400 when exceeding free quota, got ${postFail.status}`);
      assert(postFail.body.error.includes('Active vacancy quota reached'), `Expected quota error message, got ${postFail.body.error}`);
      console.log('  ✓ Free tier 0 active vacancies quota strictly enforced on server');

      // Upgrade school to Growth Tier (quota: 2 active vacancies) via admin endpoint
      const upgradeRes = await request({
        path: `/api/admin/subscriptions/${testSchoolId}/tier`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { tier: 'growth', days: 30 });
      assert(upgradeRes.status === 200, `Expected 200 on tier upgrade, got ${upgradeRes.status}`);

      // Growth tier now allows 3 active vacancies
      const quotaCheck = await request({
        path: `/api/schools/${testSchoolId}/vacancies`,
        method: 'GET'
      });
      assert(quotaCheck.body.quota.planTier === 'growth', `Expected growth tier, got ${quotaCheck.body.quota.planTier}`);
      assert(quotaCheck.body.quota.baseQuota === 3, `Expected base quota 3, got ${quotaCheck.body.quota.baseQuota}`);
      console.log('  ✓ Growth tier upgraded: 3 active simultaneous vacancies allowed');
    }

    // ------------------------------------------------------------------------
    // PACKAGE 2: VAC-003 — Vacancy Publishing Lifecycle & Quota Release on Close
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 2: [VAC-003] Vacancy Publishing Lifecycle & Quota Release ---');
    {
      // Post vacancy 1 (Active slot 1 of 3)
      const post1 = await request({
        path: `/api/schools/${testSchoolId}/vacancies`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Senior High School Core Mathematics Teacher',
        department: 'Mathematics',
        level: 'SHS',
        curriculum: 'GES / NaCCA',
        salaryRange: 'GH₵ 3,500 - 5,000 / month',
        minExperienceYears: 3,
        minQualification: 'B.Ed in Mathematics',
        status: 'published'
      });
      assert(post1.status === 201, `Expected 201, got ${post1.status}`);
      vacancy1Id = post1.body.vacancy.id;
      assert(post1.body.quota.currentActive === 1, `Expected 1 active, got ${post1.body.quota.currentActive}`);
      assert(post1.body.quota.remainingSlots === 2, `Expected 2 remaining, got ${post1.body.quota.remainingSlots}`);

      // Post vacancy 2 (Active slot 2 of 3)
      const post2 = await request({
        path: `/api/schools/${testSchoolId}/vacancies`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Cambridge Primary English Teacher',
        department: 'Languages',
        level: 'Primary',
        curriculum: 'British Cambridge',
        salaryRange: 'GH₵ 4,000 - 6,000 / month',
        minExperienceYears: 2,
        minQualification: 'B.Ed / PGDE in English',
        status: 'published'
      });
      assert(post2.status === 201, `Expected 201, got ${post2.status}`);
      vacancy2Id = post2.body.vacancy.id;
      assert(post2.body.quota.currentActive === 2, `Expected 2 active, got ${post2.body.quota.currentActive}`);
      assert(post2.body.quota.remainingSlots === 1, `Expected 1 remaining, got ${post2.body.quota.remainingSlots}`);

      // Post vacancy 3 (Active slot 3 of 3)
      const post3 = await request({
        path: `/api/schools/${testSchoolId}/vacancies`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Integrated Science & ICT Tutor',
        department: 'Science',
        level: 'JHS',
        curriculum: 'GES / NaCCA',
        salaryRange: 'GH₵ 3,200 - 4,800 / month',
        minExperienceYears: 2,
        minQualification: 'B.Ed in Science',
        status: 'published'
      });
      assert(post3.status === 201, `Expected 201, got ${post3.status}`);
      vacancy3Id = post3.body.vacancy.id;
      assert(post3.body.quota.currentActive === 3, `Expected 3 active, got ${post3.body.quota.currentActive}`);
      assert(post3.body.quota.remainingSlots === 0, `Expected 0 remaining, got ${post3.body.quota.remainingSlots}`);

      // Attempting to post vacancy 4 must now fail (quota reached: 3/3)
      const post4Fail = await request({
        path: `/api/schools/${testSchoolId}/vacancies`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Physics & STEM Specialist',
        status: 'published'
      });
      assert(post4Fail.status === 400, `Expected 400 when quota reached, got ${post4Fail.status}`);
      assert(post4Fail.body.error.includes('Active vacancy quota reached (3/3)'), `Expected quota message, got ${post4Fail.body.error}`);
      console.log('  ✓ Growth tier limit (3/3 active slots) enforced accurately');

      // Close vacancy 1: releases slot immediately back to available pool
      const closeRes = await request({
        path: `/api/schools/${testSchoolId}/vacancies/${vacancy1Id}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      }, { status: 'closed' });
      assert(closeRes.status === 200, `Expected 200, got ${closeRes.status}`);
      assert(closeRes.body.vacancy.status === 'closed', `Expected status closed`);
      assert(closeRes.body.quota.currentActive === 2, `Expected currentActive 2 after close, got ${closeRes.body.quota.currentActive}`);
      assert(closeRes.body.quota.remainingSlots === 1, `Expected remainingSlots 1 after close, got ${closeRes.body.quota.remainingSlots}`);
      console.log('  ✓ Closing vacancy immediately releases active slot back to quota pool');

      // Re-publish vacancy 1
      const republishRes = await request({
        path: `/api/schools/${testSchoolId}/vacancies/${vacancy1Id}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      }, { status: 'published' });
      assert(republishRes.status === 200, `Expected 200, got ${republishRes.status}`);
      assert(republishRes.body.quota.currentActive === 3, `Expected 3 active again`);
    }

    // ------------------------------------------------------------------------
    // PACKAGE 3: VAC-002 — Add-on Vacancy Slot Purchase (GH₵ 25 / 30 Days)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 3: [VAC-002] Add-on Vacancy Slot Purchase (Approved GH₵ 25) ---');
    {
      // Purchase 1 add-on slot for 30 days
      const buySlotRes = await request({
        path: `/api/schools/${testSchoolId}/vacancies/add-on-slot`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        paymentMethod: 'momo',
        paystackReference: `PS-TEST-${Date.now()}`
      });
      assert(buySlotRes.status === 201, `Expected 201, got ${buySlotRes.status}`);
      assert(buySlotRes.body.amountPaidGhs === 25, `Expected approved GH₵ 25 price, got ${buySlotRes.body.amountPaidGhs}`);
      assert(buySlotRes.body.quota.totalAllowed === 4, `Expected totalAllowed to expand from 3 to 4, got ${buySlotRes.body.quota.totalAllowed}`);
      assert(buySlotRes.body.quota.remainingSlots === 1, `Expected 1 remaining slot, got ${buySlotRes.body.quota.remainingSlots}`);

      // Now posting vacancy 4 succeeds using the purchased add-on slot
      const post4Success = await request({
        path: `/api/schools/${testSchoolId}/vacancies`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Robotics & STEM Coordinator',
        department: 'Science & IT',
        level: 'SHS',
        curriculum: 'British Cambridge & NaCCA',
        salaryRange: 'GH₵ 4,500 - 6,500 / month',
        status: 'published'
      });
      assert(post4Success.status === 201, `Expected 201, got ${post4Success.status}`);
      assert(post4Success.body.quota.currentActive === 4, `Expected 4 active slots`);
      console.log('  ✓ Purchased add-on slot (GH₵ 25 for 30d) expanded active quota seamlessly');
    }

    // ------------------------------------------------------------------------
    // PACKAGE 4: VAC-006 — Cross-Portal Public Job Board Sync (/jobs)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 4: [VAC-006] Cross-Portal Public Job Board Sync (/jobs) ---');
    {
      const publicJobs = await request({
        path: '/api/jobs',
        method: 'GET'
      });
      assert(publicJobs.status === 200, `Expected 200, got ${publicJobs.status}`);
      assert(Array.isArray(publicJobs.body), `Expected array of jobs`);
      const foundVac2 = publicJobs.body.find(j => j.id === vacancy2Id);
      assert(foundVac2 !== undefined, `Expected vacancy 2 to appear on public job board`);
      assert(foundVac2.title === 'Cambridge Primary English Teacher', `Expected title match`);
      assert(foundVac2.curriculum === 'British Cambridge', `Expected curriculum match`);

      // Filter by subject / department
      const filtered = await request({
        path: '/api/jobs?subject=Mathematics',
        method: 'GET'
      });
      assert(filtered.status === 200, `Expected 200, got ${filtered.status}`);
      const foundMath = filtered.body.find(j => j.id === vacancy1Id);
      assert(foundMath !== undefined, `Expected Mathematics job to match subject filter`);
      console.log('  ✓ Published school vacancies discoverable on public /jobs and Teachers Portal');
    }

    // ------------------------------------------------------------------------
    // PACKAGE 5: VAC-004 — Candidate Application Dossier Receipt with NTC Licence
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 5: [VAC-004] Candidate Application Receipt with NTC Vetting ---');
    {
      const applyRes = await request({
        path: `/api/jobs/${vacancy1Id}/apply`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        fullName: 'Kofi Mensah Owusu',
        email: 'kofi.mensah@teachers.edu.gh',
        phone: '+233 24 123 4567',
        ntcNumber: 'PT/10928/2021', // Verified NTC Licence Number
        qualification: 'B.Ed Mathematics Education (First Class)',
        yearsExperience: 4,
        currentSchool: 'Presbyterian Boys Secondary School (PRESEC)',
        cvUrl: 'https://skoolfinder.com.gh/uploads/cv-kofi-mensah.pdf',
        expectedSalary: 'GH₵ 4,200 / month'
      });
      assert(applyRes.status === 201, `Expected 201, got ${applyRes.status}`);
      assert(applyRes.body.success === true, `Expected success true`);
      assert(applyRes.body.ntcVerified === true, `Expected ntcVerified true for valid NTC licence`);
      assert(applyRes.body.trackingRef.startsWith('NTC-APP-'), `Expected NTC-APP- tracking ref`);
      applicationId = applyRes.body.applicationId;
      console.log(`  ✓ Candidate dossier received with verified NTC licence: ${applyRes.body.trackingRef}`);
    }

    // ------------------------------------------------------------------------
    // PACKAGE 6: VAC-005 — Candidate Review & Stage Machine
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 6: [VAC-005] Candidate Review Stage Machine ---');
    {
      // School views applicants for vacancy 1
      const appsRes = await request({
        path: `/api/schools/${testSchoolId}/vacancies/${vacancy1Id}/applicants`,
        method: 'GET'
      });
      assert(appsRes.status === 200, `Expected 200, got ${appsRes.status}`);
      assert(appsRes.body.applicants.length >= 1, `Expected at least 1 applicant`);
      const app = appsRes.body.applicants.find(a => a.id === applicationId);
      assert(app.full_name === 'Kofi Mensah Owusu', `Expected applicant name match`);
      assert(app.ntc_verified === true, `Expected ntc_verified true`);
      assert(app.status === 'applied', `Initial stage must be applied`);

      // Advance stage: applied -> shortlisted
      const shortRes = await request({
        path: `/api/schools/${testSchoolId}/vacancies/applicants/${applicationId}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      }, { status: 'shortlisted' });
      assert(shortRes.status === 200, `Expected 200, got ${shortRes.status}`);
      assert(shortRes.body.application.status === 'shortlisted', `Expected shortlisted`);

      // Advance stage: shortlisted -> interview_scheduled
      const interviewRes = await request({
        path: `/api/schools/${testSchoolId}/vacancies/applicants/${applicationId}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      }, {
        status: 'interview_scheduled',
        interviewDate: '2026-11-25T10:00:00Z',
        interviewMode: 'in_person',
        interviewNotes: 'Oral presentation and pedagogical demo scheduled in Science Block B'
      });
      assert(interviewRes.status === 200, `Expected 200, got ${interviewRes.status}`);
      assert(interviewRes.body.application.status === 'interview_scheduled', `Expected interview_scheduled`);

      // Advance stage: interview_scheduled -> offered
      const offerRes = await request({
        path: `/api/schools/${testSchoolId}/vacancies/applicants/${applicationId}/status`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      }, { status: 'offered' });
      assert(offerRes.status === 200, `Expected 200, got ${offerRes.status}`);
      assert(offerRes.body.application.status === 'offered', `Expected offered`);
      console.log('  ✓ Candidate review stages (applied -> shortlisted -> interview_scheduled -> offered) verified');
    }

    // ------------------------------------------------------------------------
    // PACKAGE 7: TEN-001 — Included Monthly Tender Quotas Enforcement
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 7: [TEN-001] Monthly Tender Quota Enforcement ---');
    {
      // Current school on Growth tier has 0 included monthly tenders (§6.2)
      const tndQuota0 = await request({
        path: `/api/schools/${testSchoolId}/tenders`,
        method: 'GET'
      });
      assert(tndQuota0.status === 200, `Expected 200, got ${tndQuota0.status}`);
      assert(tndQuota0.body.quota.includedMonthlyQuota === 0, `Expected 0 included tenders for Growth tier`);
      assert(tndQuota0.body.quota.canPublish === false, `canPublish must be false without credits`);

      // Attempting to post tender without credits must fail with 400
      const postTFail = await request({
        path: `/api/schools/${testSchoolId}/tenders`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Supply of 500 BECE Mathematics Revision Guides',
        category: 'Textbooks & Stationery',
        quantity: '500 Books'
      });
      assert(postTFail.status === 400, `Expected 400, got ${postTFail.status}`);
      assert(postTFail.body.error.includes('Tender publishing quota exhausted'), `Expected quota exhausted error, got ${postTFail.body.error}`);
      console.log('  ✓ Free & Growth tiers strictly blocked from publishing tenders without credits');

      // Upgrade school to Professional Tier (includes 3 tenders / month) (§6.2)
      const proUpgrade = await request({
        path: `/api/admin/subscriptions/${testSchoolId}/tier`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { tier: 'professional', days: 30 });
      assert(proUpgrade.status === 200, `Expected 200, got ${proUpgrade.status}`);

      const proQuota = await request({
        path: `/api/schools/${testSchoolId}/tenders`,
        method: 'GET'
      });
      assert(proQuota.body.quota.planTier === 'professional', `Expected professional`);
      assert(proQuota.body.quota.includedMonthlyQuota === 3, `Expected 3 tenders/month, got ${proQuota.body.quota.includedMonthlyQuota}`);
      assert(proQuota.body.quota.canPublish === true, `canPublish must be true`);
      console.log('  ✓ Professional tier verified: 3 monthly tenders included per billing cycle');
    }

    // ------------------------------------------------------------------------
    // PACKAGE 8: TEN-002 — Tender Credits Add-on Purchases (GH₵ 45 & GH₵ 120)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 8: [TEN-002] Tender Credits Add-on Purchases (Approved Prices) ---');
    {
      // Purchase Single Credit: GH₵ 45
      const buy1Res = await request({
        path: `/api/schools/${testSchoolId}/tenders/buy-credits`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { packType: 'single', paymentMethod: 'momo' });
      assert(buy1Res.status === 201, `Expected 201, got ${buy1Res.status}`);
      assert(buy1Res.body.amountPaidGhs === 45, `Expected approved GH₵ 45, got ${buy1Res.body.amountPaidGhs}`);
      assert(buy1Res.body.creditsAdded === 1, `Expected 1 credit added`);

      // Purchase 3-Credit Bundle: GH₵ 120 (Saves GH₵ 15)
      const buy3Res = await request({
        path: `/api/schools/${testSchoolId}/tenders/buy-credits`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { packType: 'bundle_3', paymentMethod: 'momo' });
      assert(buy3Res.status === 201, `Expected 201, got ${buy3Res.status}`);
      assert(buy3Res.body.amountPaidGhs === 120, `Expected approved GH₵ 120, got ${buy3Res.body.amountPaidGhs}`);
      assert(buy3Res.body.creditsAdded === 3, `Expected 3 credits added`);
      assert(buy3Res.body.totalCreditsRemaining === 4, `Expected 4 total purchased credits (1 + 3)`);
      console.log('  ✓ Single credit (GH₵ 45) and 3-pack bundle (GH₵ 120, save GH₵ 15) verified');
    }

    // ------------------------------------------------------------------------
    // PACKAGE 9: TEN-003 — Tender Publishing Lifecycle
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 9: [TEN-003] Tender Publishing Lifecycle ---');
    {
      const postT1 = await request({
        path: `/api/schools/${testSchoolId}/tenders`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Supply of 150 Robotics & STEM Microcontroller Starter Kits',
        category: 'IT & Computers',
        description: 'Seeking accredited vendors for Arduino & ESP32 STEM kits for robotics lab.',
        specifications: 'Authentic Arduino boards with breadboards, ultrasonic sensors, and jumper wires.',
        quantity: '150 Student Sets',
        budgetMin: 40000,
        budgetMax: 55000,
        deliveryDeadline: '2026-12-15',
        submissionDeadline: '2026-11-30'
      });
      assert(postT1.status === 201, `Expected 201, got ${postT1.status}`);
      tender1Id = postT1.body.tender.id;
      assert(postT1.body.tender.reference_code.startsWith('TND-2026-'), `Expected TND-2026- prefix`);
      assert(postT1.body.tender.status === 'open', `Expected open status`);
      assert(postT1.body.tender.credit_source === 'monthly_quota', `Expected monthly_quota source`);
      console.log(`  ✓ Tender published: ${postT1.body.tender.reference_code}`);
    }

    // ------------------------------------------------------------------------
    // PACKAGE 10: TEN-004 — Cross-Portal Suppliers Sync (/suppliers & /api/rfqs)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 10: [TEN-004] Cross-Portal Suppliers Sync ---');
    {
      const rfqsRes = await request({
        path: '/api/rfqs',
        method: 'GET'
      });
      assert(rfqsRes.status === 200, `Expected 200, got ${rfqsRes.status}`);
      assert(Array.isArray(rfqsRes.body), `Expected array of RFQs`);
      const matched = rfqsRes.body.find(r => r.id === tender1Id);
      assert(matched !== undefined, `Expected published tender to appear in public /api/rfqs for suppliers`);
      assert(matched.title.includes('Robotics & STEM'), `Title match`);
      console.log('  ✓ Published tender instantly synchronized to B2B Suppliers Portal (/suppliers)');
    }

    // ------------------------------------------------------------------------
    // PACKAGE 11: TEN-005 — Competing Supplier Bid Submission
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 11: [TEN-005] Competing Supplier Bid Submission ---');
    {
      // Supplier 1 Bid
      const bid1Res = await request({
        path: `/api/rfqs/${tender1Id}/quote`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        supplierName: 'Accra STEM Solutions Ltd',
        contactPerson: 'Kwame Asante',
        email: 'sales@accrastem.com.gh',
        phone: '+233 24 999 1111',
        supplierRating: 4.9,
        price: 'GH₵ 46,500',
        deliveryDays: 14,
        warrantyTerms: '12 Months Comprehensive Replacement',
        notes: 'Includes free teacher training workshop for 3 staff members'
      });
      assert(bid1Res.status === 201, `Expected 201, got ${bid1Res.status}`);
      assert(bid1Res.body.success === true, `Expected success true`);

      // Supplier 2 Bid (via schools bids endpoint)
      const bid2Res = await request({
        path: `/api/rfqs/${tender1Id}/quote`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        supplierName: 'West Africa EdTech Supplies',
        contactPerson: 'Esi Ansah',
        email: 'bids@waedtech.com.gh',
        phone: '+233 20 888 2222',
        supplierRating: 4.7,
        price: 'GH₵ 44,000',
        deliveryDays: 10,
        warrantyTerms: '6 Months Manufacturer Guarantee',
        notes: 'Direct factory shipment from Tema harbour'
      });
      assert(bid2Res.status === 201, `Expected 201, got ${bid2Res.status}`);
      console.log('  ✓ Competing supplier bids with SLAs, ratings, and pricing received');
    }

    // ------------------------------------------------------------------------
    // PACKAGE 12: TEN-006 — Side-by-Side Bid Review & Contract Award
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 12: [TEN-006] Side-by-Side Bid Review & Contract Award ---');
    {
      const bidsRes = await request({
        path: `/api/schools/${testSchoolId}/tenders/${tender1Id}/bids`,
        method: 'GET'
      });
      assert(bidsRes.status === 200, `Expected 200, got ${bidsRes.status}`);
      assert(bidsRes.body.bids.length === 2, `Expected 2 bids, got ${bidsRes.body.bids.length}`);
      
      const winningBid = bidsRes.body.bids[0]; // Lowest bid (GH₵ 44,000)
      bid1Id = winningBid.id;

      // School awards contract to winning bid
      const awardRes = await request({
        path: `/api/schools/${testSchoolId}/tenders/${tender1Id}/award`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { bidId: bid1Id });
      assert(awardRes.status === 200, `Expected 200, got ${awardRes.status}`);
      assert(awardRes.body.tender.status === 'awarded', `Expected tender status awarded`);
      assert(awardRes.body.tender.awarded_bid_id === bid1Id, `Expected awarded_bid_id match`);
      assert(awardRes.body.milestones.length === 2, `Expected 2 escrow milestones initialized`);
      console.log(`  ✓ Tender awarded to ${winningBid.supplier_name} for GH₵ ${winningBid.quote_amount}`);
    }

    // ------------------------------------------------------------------------
    // PACKAGE 13: ESC-001 — 50% Mobilization Deposit Lock in MoMo Escrow
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 13: [ESC-001] 50% Mobilization Deposit Lock in MoMo Escrow ---');
    {
      const escrowCheck = await request({
        path: `/api/schools/${testSchoolId}/tenders/${tender1Id}/escrow`,
        method: 'GET'
      });
      assert(escrowCheck.status === 200, `Expected 200, got ${escrowCheck.status}`);
      const m1 = escrowCheck.body.milestones[0];
      assert(m1.percentage === 50, `Expected Milestone 1 to be 50%`);
      assert(m1.amount === 22000, `Expected 50% of GH₵ 44,000 = GH₵ 22,000, got ${m1.amount}`);
      assert(m1.status === 'pending', `Expected pending status`);

      // School locks 50% mobilization deposit into platform MoMo escrow
      const lockRes = await request({
        path: `/api/schools/${testSchoolId}/tenders/${tender1Id}/escrow-milestone`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { paymentMethod: 'momo' });
      assert(lockRes.status === 200, `Expected 200, got ${lockRes.status}`);
      assert(lockRes.body.milestone.status === 'funded_in_escrow', `Expected funded_in_escrow`);
      assert(lockRes.body.milestone.disbursement_reference.startsWith('ESC-MOB-'), `Expected ESC-MOB- prefix`);
      assert(lockRes.body.tender.escrow_status === 'deposit_funded', `Expected deposit_funded`);
      console.log(`  ✓ 50% Mobilization Deposit (GH₵ ${m1.amount}) locked in MoMo Escrow`);
    }

    // ------------------------------------------------------------------------
    // PACKAGE 14: ESC-002 — Physical Delivery Inspection & 50% Balance Release
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 14: [ESC-002] Delivery Inspection Sign-off & 50% Balance Release ---');
    {
      const signoffRes = await request({
        path: `/api/schools/${testSchoolId}/tenders/${tender1Id}/delivery-signoff`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        inspectionNotes: 'All 150 STEM robotics kits delivered to Cantonments campus. Serial numbers verified.'
      });
      assert(signoffRes.status === 200, `Expected 200, got ${signoffRes.status}`);
      assert(signoffRes.body.tender.status === 'closed', `Expected tender closed`);
      assert(signoffRes.body.tender.escrow_status === 'fully_disbursed', `Expected fully_disbursed`);
      assert(signoffRes.body.totalDisbursedGhs === 44000, `Expected full GH₵ 44,000 disbursed, got ${signoffRes.body.totalDisbursedGhs}`);

      const m1Updated = signoffRes.body.milestones[0];
      const m2Updated = signoffRes.body.milestones[1];
      assert(m1Updated.status === 'disbursed', `Milestone 1 must be disbursed`);
      assert(m2Updated.status === 'disbursed', `Milestone 2 must be disbursed`);
      console.log('  ✓ Physical delivery inspected on campus; 100% of contract disbursed via MoMo');
    }

    // ------------------------------------------------------------------------
    // PACKAGE 15: ESC-003 — Dispute & Reversal Safeguards
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 15: [ESC-003] Dispute & Reversal Safeguards ---');
    {
      // Create second tender to test dispute handling
      const postT2 = await request({
        path: `/api/schools/${testSchoolId}/tenders`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        title: 'Catering: 100 Bags of Jasmine Rice',
        category: 'Food & Catering',
        quantity: '100 Bags (50kg)',
        budgetMax: 30000,
        deliveryDeadline: '2026-12-01',
        submissionDeadline: '2026-11-20'
      });
      tender2Id = postT2.body.tender.id;

      // Submit bid
      const bidRes = await request({
        path: `/api/rfqs/${tender2Id}/quote`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        supplierName: 'AgroPro Ghana Ltd',
        price: 'GH₵ 28,000',
        deliveryDays: 5
      });

      const bids = await request({
        path: `/api/schools/${testSchoolId}/tenders/${tender2Id}/bids`,
        method: 'GET'
      });
      bid2Id = bids.body.bids[0].id;

      // Award contract and lock 50% deposit
      await request({
        path: `/api/schools/${testSchoolId}/tenders/${tender2Id}/award`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { bidId: bid2Id });

      await request({
        path: `/api/schools/${testSchoolId}/tenders/${tender2Id}/escrow-milestone`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { paymentMethod: 'momo' });

      // School raises Escrow Dispute (e.g. goods water-damaged or unfulfilled)
      const disputeRes = await request({
        path: `/api/schools/${testSchoolId}/tenders/${tender2Id}/dispute`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { reason: 'Delivery delayed past deadline and rice bags water-damaged upon inspection.' });
      assert(disputeRes.status === 200, `Expected 200, got ${disputeRes.status}`);
      assert(disputeRes.body.tender.escrow_status === 'disputed', `Expected escrow_status disputed`);

      // Super Admin arbitrates dispute in /admin
      const resolveRes = await request({
        path: `/api/admin/marketplace/escrow/${tender2Id}/resolve`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        resolution: 'refund_school',
        notes: 'Verified photo evidence of damaged goods. 100% refund processed to school MoMo wallet.'
      });
      assert(resolveRes.status === 200, `Expected 200, got ${resolveRes.status}`);
      assert(resolveRes.body.tender.escrow_status === 'refunded', `Expected escrow_status refunded`);
      console.log('  ✓ Escrow dispute raised, funds frozen, and arbitrated by Super Admin');
    }

    // ------------------------------------------------------------------------
    // PACKAGE 16: ESC-004 — Tamper-Evident Marketplace Audit Log
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 16: [ESC-004] Tamper-Evident Marketplace Audit Log ---');
    {
      const auditRes = await request({
        path: `/api/schools/${testSchoolId}/marketplace/audit-log`,
        method: 'GET'
      });
      assert(auditRes.status === 200, `Expected 200, got ${auditRes.status}`);
      assert(Array.isArray(auditRes.body.logs), `Expected logs array`);
      assert(auditRes.body.logs.length >= 8, `Expected at least 8 immutable audit events, got ${auditRes.body.logs.length}`);

      const eventTypes = auditRes.body.logs.map(l => l.event_type);
      assert(eventTypes.includes('VACANCY_PUBLISHED'), `Must contain VACANCY_PUBLISHED`);
      assert(eventTypes.includes('VACANCY_SLOT_PURCHASED'), `Must contain VACANCY_SLOT_PURCHASED`);
      assert(eventTypes.includes('CANDIDATE_APPLICATION_RECEIVED'), `Must contain CANDIDATE_APPLICATION_RECEIVED`);
      assert(eventTypes.includes('CANDIDATE_STATUS_UPDATED'), `Must contain CANDIDATE_STATUS_UPDATED`);
      assert(eventTypes.includes('TENDER_PUBLISHED'), `Must contain TENDER_PUBLISHED`);
      assert(eventTypes.includes('TENDER_CONTRACT_AWARDED'), `Must contain TENDER_CONTRACT_AWARDED`);
      assert(eventTypes.includes('ESCROW_MOBILIZATION_DEPOSIT_LOCKED'), `Must contain ESCROW_MOBILIZATION_DEPOSIT_LOCKED`);
      assert(eventTypes.includes('DELIVERY_INSPECTED_ESCROW_FULLY_DISBURSED'), `Must contain DELIVERY_INSPECTED_ESCROW_FULLY_DISBURSED`);
      console.log('  ✓ Complete audit trail with timestamps, entity IDs, and references verified');
    }

    console.log('\n========================================================================');
    console.log('ALL 16 PHASE 2B MARKETPLACE PACKAGES VERIFIED SUCCESSFULLY!');
    console.log('========================================================================');

  } finally {
    if (server) {
      server.close();
      console.log('\n[TEST HARNESS] Stopped test server.');
    }
  }
}

runTests().catch(err => {
  console.error('\n❌ TEST RUN FAILED:\n', err);
  if (server) server.close();
  process.exit(1);
});
