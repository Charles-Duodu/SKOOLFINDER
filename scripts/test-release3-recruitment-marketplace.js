/**
 * SkoolFinder Ghana — Release 3 Verification Test Suite
 * Tests Unified Recruitment & Talent Marketplace (Milestones M05 & M06)
 * Covers:
 *   - School Vacancies & Quota Enforcement (VAC-001 to VAC-003)
 *   - Point-in-Time Immutable Application Snapshots (DEC-007, VAC-004)
 *   - Recruiter Candidate Search & Contact Masking (REC-01 to REC-04)
 *   - Recruiter Candidate Unlocks (REC-02)
 *   - Formal Employment Offer Letters (DEC-026)
 *   - Educator Application Tracking & Withdrawal (PRO-01)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');

const jobsRouter = require('../src/routes/jobs');
const schoolsRouter = require('../src/routes/schools');
const teachersRouter = require('../src/routes/teachers');
const { JWT_SECRET } = require('../src/middleware/auth');

const app = express();
app.use(express.json());

app.use('/api/jobs', jobsRouter);
app.use('/api/schools', schoolsRouter);
app.use('/api/teachers', teachersRouter);

let server;
const PORT = 3488;
const BASE_URL = `http://127.0.0.1:${PORT}`;

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✕ [FAIL] ${testName}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('\n🚀 Starting SkoolFinder Ghana — Release 3 Recruitment Marketplace Test Suite...\n');

  await new Promise(resolve => {
    server = app.listen(PORT, resolve);
  });

  try {
    const testSchoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6'; // GIS test campus
    const testEducatorId = '44444444-5555-6666-7777-888888888888';

    const educatorToken = jwt.sign({
      id: testEducatorId,
      email: 'educator.kwame@gmail.com',
      role: 'teacher',
      activePersona: 'teacher'
    }, JWT_SECRET, { expiresIn: '1h' });

    const schoolToken = jwt.sign({
      id: '33333333-4444-5555-6666-777777777777',
      email: 'hr@gis.edu.gh',
      role: 'school_admin',
      school_id: testSchoolId,
      activePersona: 'school_admin'
    }, JWT_SECRET, { expiresIn: '1h' });

    // -------------------------------------------------------------
    // 1. School Vacancies & Quota Lifecycle (VAC-001, VAC-003)
    // -------------------------------------------------------------
    console.log('--- 1. School Vacancy Creation & Publishing (VAC-001, VAC-003) ---');

    // 1a. Free tier quota enforcement check
    const quotaExhaustedRes = await fetch(`${BASE_URL}/api/schools/${testSchoolId}/vacancies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${schoolToken}`
      },
      body: JSON.stringify({
        title: 'Unfunded Vacancy',
        status: 'published'
      })
    });
    assert(quotaExhaustedRes.status === 400, 'Free plan quota blocks immediate publishing (VAC-001 quota enforcement)');

    // 1b. Purchase 1 add-on active vacancy slot at approved GH₵ 25 (VAC-002)
    const slotPurchaseRes = await fetch(`${BASE_URL}/api/schools/${testSchoolId}/vacancies/add-on-slot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${schoolToken}`
      },
      body: JSON.stringify({
        paymentMethod: 'momo',
        paystackReference: `PS-TEST-${Date.now()}`
      })
    });
    const slotPurchaseData = await slotPurchaseRes.json();
    assert(slotPurchaseRes.status === 201 && slotPurchaseData.amountPaidGhs === 25, 'POST /vacancies/add-on-slot activates 30-day slot for GH₵ 25 (VAC-002)');

    // 1c. Create and publish vacancy with funded slot
    const createVacRes = await fetch(`${BASE_URL}/api/schools/${testSchoolId}/vacancies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${schoolToken}`
      },
      body: JSON.stringify({
        title: 'Senior Cambridge Physics Teacher',
        department: 'Science & STEM',
        level: 'SHS',
        curriculum: 'Cambridge / IGCSE',
        minQualification: 'B.Sc Physics + PGDE',
        minExperienceYears: 4,
        salaryRange: 'GH₵ 3,500 - 5,000 / month',
        description: 'Lead Cambridge IGCSE and A-Level physics instruction and practical lab experiments.',
        requirements: 'NTC licence required. Minimum 4 years laboratory instruction experience.',
        location: 'Cantonments, Accra',
        ntcRequired: true,
        status: 'published'
      })
    });
    const vacData = await createVacRes.json();
    assert(createVacRes.status === 201 && vacData.success === true, 'POST /api/schools/:id/vacancies returns 201 Created');
    assert(vacData.vacancy && vacData.vacancy.title === 'Senior Cambridge Physics Teacher', 'Vacancy created with correct title and attributes');

    const vacancyId = vacData.vacancy.id;

    // Check vacancy listed in public jobs (VAC-006)
    const publicJobsRes = await fetch(`${BASE_URL}/api/jobs`);
    const publicJobs = await publicJobsRes.json();
    const foundPublic = publicJobs.find(j => j.id === vacancyId);
    assert(foundPublic !== undefined, 'Public jobs endpoint (GET /api/jobs) includes the newly published vacancy');

    // -------------------------------------------------------------
    // 2. Point-in-Time Immutable Application Snapshot (DEC-007, VAC-004)
    // -------------------------------------------------------------
    console.log('\n--- 2. Point-in-Time Immutable Application Snapshot (DEC-007) ---');

    const applyRes = await fetch(`${BASE_URL}/api/jobs/${vacancyId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        fullName: 'Kwame Asante Mensah',
        email: 'educator.kwame@gmail.com',
        phone: '+233 24 412 8899',
        ntcNumber: 'PT/99182/2020',
        qualification: 'B.Sc Physics (Legon), PGDE',
        yearsExperience: 6,
        currentSchool: 'Alpha Preparatory School',
        cvUrl: 'https://skoolfinder.com.gh/dossiers/kwame-asante-cv.pdf',
        coverLetter: 'I have 6 years experience running Cambridge physics practical sessions.',
        expectedSalary: 'GH₵ 4,500'
      })
    });
    const applyData = await applyRes.json();
    assert(applyRes.status === 201 && applyData.success === true, 'POST /api/jobs/:id/apply returns 201 Created');
    assert(applyData.snapshot && applyData.snapshot.snapshotTimestamp, 'Application includes point-in-time immutable snapshot (DEC-007)');
    assert(applyData.snapshot.vettingDimensions && applyData.snapshot.vettingDimensions.D3_Licence === 'verified', 'Snapshot captures D3 NTC verification status');
    assert(applyData.trackingRef && applyData.trackingRef.startsWith('NTC-APP-'), 'Generates standard application tracking reference code');

    const applicationId = applyData.applicationId;

    // School retrieves vacancy applicants
    const applicantsRes = await fetch(`${BASE_URL}/api/schools/${testSchoolId}/vacancies/${vacancyId}/applicants`, {
      headers: { Authorization: `Bearer ${schoolToken}` }
    });
    const applicantsData = await applicantsRes.json();
    assert(applicantsRes.status === 200 && applicantsData.success === true, 'GET /api/schools/:id/vacancies/:vacId/applicants returns 200');
    assert(Array.isArray(applicantsData.applicants) && applicantsData.applicants.length >= 1, 'Returns list of candidate applicants');
    const candApp = applicantsData.applicants.find(a => a.id === applicationId);
    assert(candApp && candApp.snapshot_data && candApp.snapshot_data.qualification === 'B.Sc Physics (Legon), PGDE', 'School views immutable snapshot dossier');

    // -------------------------------------------------------------
    // 3. Recruiter Candidate Search & Contact Masking (REC-01 to REC-04)
    // -------------------------------------------------------------
    console.log('\n--- 3. Recruiter Candidate Search & Contact Masking (REC-01 to REC-04) ---');

    const searchRes = await fetch(`${BASE_URL}/api/jobs/recruiter/search?schoolId=${testSchoolId}&subject=Mathematics`, {
      headers: { Authorization: `Bearer ${schoolToken}` }
    });
    const searchData = await searchRes.json();
    assert(searchRes.status === 200 && searchData.success === true, 'GET /api/jobs/recruiter/search returns 200 OK');
    assert(searchData.totalCandidates >= 1, 'Finds matching opted-in candidates for Mathematics');

    const maskedCandidate = searchData.candidates[0];
    assert(maskedCandidate.isUnlocked === false, 'Candidate is marked as isUnlocked: false by default');
    assert(maskedCandidate.phone.includes('***'), 'Candidate phone is masked for unauthenticated outreach (REC-01)');
    assert(maskedCandidate.email.includes('***'), 'Candidate email is masked for unauthenticated outreach (REC-01)');
    assert(maskedCandidate.dimensions && maskedCandidate.dimensions.D1_Identity === 'verified', 'Search results display 5D regulatory vetting badges');

    // Recruiter unlocks candidate (REC-02)
    const unlockRes = await fetch(`${BASE_URL}/api/jobs/recruiter/unlock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${schoolToken}`
      },
      body: JSON.stringify({
        schoolId: testSchoolId,
        candidateId: maskedCandidate.id
      })
    });
    const unlockData = await unlockRes.json();
    assert(unlockRes.status === 200 && unlockData.success === true, 'POST /api/jobs/recruiter/unlock returns 200 OK');
    assert(unlockData.candidate && !unlockData.candidate.phone.includes('***'), 'Unlocked candidate reveals direct unmasked phone number');
    assert(unlockData.candidate && !unlockData.candidate.email.includes('***'), 'Unlocked candidate reveals direct unmasked email address');

    // Verify subsequent search reflects unlocked status
    const reSearchRes = await fetch(`${BASE_URL}/api/jobs/recruiter/search?schoolId=${testSchoolId}&subject=Mathematics`, {
      headers: { Authorization: `Bearer ${schoolToken}` }
    });
    const reSearchData = await reSearchRes.json();
    const unlockedInSearch = reSearchData.candidates.find(c => c.id === maskedCandidate.id);
    assert(unlockedInSearch && unlockedInSearch.isUnlocked === true, 'Subsequent search confirms candidate remains unlocked for school');

    // -------------------------------------------------------------
    // 4. Formal Digital Job Offer Letter Workflow (DEC-026)
    // -------------------------------------------------------------
    console.log('\n--- 4. Formal Digital Job Offer Letter Workflow (DEC-026) ---');

    // School issues offer letter
    const issueOfferRes = await fetch(`${BASE_URL}/api/schools/${testSchoolId}/vacancies/applicants/${applicationId}/offer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${schoolToken}`
      },
      body: JSON.stringify({
        positionTitle: 'Senior Cambridge Physics Teacher',
        department: 'Science & STEM',
        grossSalaryGhs: 4500,
        termStartDate: '2026-09-01',
        probationMonths: 3,
        signatoryName: 'Dr. Afua Sutherland',
        signatoryRole: 'Director of Human Capital'
      })
    });
    const issueOfferData = await issueOfferRes.json();
    assert(issueOfferRes.status === 201 && issueOfferData.success === true, 'POST /api/schools/:id/vacancies/applicants/:appId/offer returns 201');
    assert(issueOfferData.offerLetter && (issueOfferData.offerLetter.offerNumber.includes('OFR') || issueOfferData.offerLetter.offerNumber.includes('OFF')), 'Offer letter includes official reference number');

    // Candidate reviews offer letter
    const reviewOfferRes = await fetch(`${BASE_URL}/api/jobs/applications/${applicationId}/offer`);
    const reviewOfferData = await reviewOfferRes.json();
    assert(reviewOfferRes.status === 200 && reviewOfferData.success === true, 'GET /api/jobs/applications/:appId/offer returns 200');
    assert(reviewOfferData.offer.status === 'pending_candidate_acceptance', 'Offer status is pending_candidate_acceptance');

    // Candidate accepts offer letter
    const acceptOfferRes = await fetch(`${BASE_URL}/api/jobs/applications/${applicationId}/offer-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        decision: 'accepted',
        candidateSignature: 'Kwame Asante Mensah'
      })
    });
    const acceptOfferData = await acceptOfferRes.json();
    assert(acceptOfferRes.status === 200 && acceptOfferData.success === true, 'POST /api/jobs/applications/:appId/offer-response returns 200');
    assert(acceptOfferData.offer.status === 'accepted', 'Offer status is marked as accepted');
    assert(acceptOfferData.offer.candidateSignature === 'Kwame Asante Mensah', 'Offer letter records digital candidate signature');

    // -------------------------------------------------------------
    // 5. Educator Application Tracking & Withdrawal (PRO-01)
    // -------------------------------------------------------------
    console.log('\n--- 5. Educator Application Tracking & Withdrawal (PRO-01) ---');

    // Educator views own applications
    const myAppsRes = await fetch(`${BASE_URL}/api/teachers/my-applications`, {
      headers: { Authorization: `Bearer ${educatorToken}` }
    });
    const myAppsData = await myAppsRes.json();
    assert(myAppsRes.status === 200 && myAppsData.success === true, 'GET /api/teachers/my-applications returns 200');
    assert(Array.isArray(myAppsData.applications) && myAppsData.applications.length >= 1, 'Returns submitted applications for educator');
    assert(myAppsData.applications[0].offerLetter !== null, 'Educator sees accepted offer letter in application dashboard');

    // Test application withdrawal on a fresh application
    const app2Res = await fetch(`${BASE_URL}/api/jobs/${vacancyId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        fullName: 'Kwame Asante Mensah',
        email: 'educator.kwame@gmail.com',
        phone: '+233 24 412 8899',
        qualification: 'B.Sc Physics (Legon)'
      })
    });
    const app2Data = await app2Res.json();
    const app2Id = app2Data.applicationId;

    const withdrawRes = await fetch(`${BASE_URL}/api/teachers/my-applications/${app2Id}/withdraw`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${educatorToken}` }
    });
    const withdrawData = await withdrawRes.json();
    assert(withdrawRes.status === 200 && withdrawData.success === true, 'POST /api/teachers/my-applications/:id/withdraw returns 200');
    assert(withdrawData.application.status === 'withdrawn', 'Application status updated to withdrawn');

  } catch (err) {
    console.error('Fatal test error:', err);
    failedTests++;
  } finally {
    if (server) server.close();
  }

  console.log('\n========================================');
  console.log(`Release 3 Verification Results: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('========================================\n');

  if (failedTests > 0) process.exit(1);
}

runTests();
