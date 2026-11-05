/**
 * SkoolFinder Ghana — Release 2 Verification Test Suite
 * Tests 9-Step Onboarding (PRO-01) & 5-Dimensional Regulatory Vetting (DEC-003)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');

const teachersRouter = require('../src/routes/teachers');
const adminRouter = require('../src/routes/admin');
const { JWT_SECRET } = require('../src/middleware/auth');

const app = express();
app.use(express.json());

app.use('/api/teachers', teachersRouter);
app.use('/api/admin', adminRouter);

let server;
const PORT = 3388;
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
  console.log('\n🚀 Starting SkoolFinder Ghana — Release 2 Educator Vetting Test Suite...\n');

  await new Promise(resolve => {
    server = app.listen(PORT, resolve);
  });

  try {
    const testEducatorId = '22222222-3333-4444-5555-666666666666';
    const educatorToken = jwt.sign({
      id: testEducatorId,
      email: 'educator.test@gmail.com',
      role: 'teacher',
      activePersona: 'teacher',
      full_name: 'Emmanuel Kwame Boateng'
    }, JWT_SECRET);

    const superAdminToken = jwt.sign({
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@skoolfinder.com.gh',
      role: 'super_admin',
      activePersona: 'super_admin'
    }, JWT_SECRET);

    // -------------------------------------------------------------
    // 1. Ghana Card NIA Format Validation
    // -------------------------------------------------------------
    console.log('--- 1. Ghana Card NIA Format Validation (D1) ---');

    const invalidCardRes = await fetch(`${BASE_URL}/api/teachers/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        step: 2,
        ghanaCardNumber: 'INVALID-GHANA-CARD-123'
      })
    });
    assert(invalidCardRes.status === 400, 'Rejects invalid Ghana Card format with 400 Bad Request');

    // -------------------------------------------------------------
    // 2. 9-Step Onboarding Dossier Submission
    // -------------------------------------------------------------
    console.log('\n--- 2. 9-Step Educator Onboarding Submission (PRO-01) ---');

    const validDossierRes = await fetch(`${BASE_URL}/api/teachers/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        step: 9,
        isFinalSubmit: true,
        fullName: 'Emmanuel Kwame Boateng',
        ghanaCardNumber: 'GHA-718293847-1',
        ntcNumber: 'NTC/PR/2021/8892',
        qualification: 'B.Sc Physics, PGDE',
        institution: 'University of Ghana (Legon)',
        experienceYears: 8,
        professionalCategory: 'Academic Teacher',
        subjects: ['Mathematics', 'Physics'],
        levels: ['JHS', 'SHS', 'A-Levels'],
        curricula: ['Cambridge', 'GES'],
        serviceFormats: ['Both'],
        serviceRegions: ['Greater Accra'],
        serviceSuburbs: ['East Legon', 'Airport Residential', 'Cantonments'],
        hourlyRate: 150,
        safeguardingDeclaration: true,
        referees: [
          {
            refereeName: 'Dr. Kwesi Appiah',
            refereeTitle: 'Principal',
            institutionName: 'Morning Star School',
            refereePhone: '+233 24 112 3344',
            refereeEmail: 'principal@morningstar.edu.gh'
          }
        ],
        availability: [
          { dayOfWeek: 2, startTime: '16:00', endTime: '18:00', sessionFormat: 'both' },
          { dayOfWeek: 6, startTime: '09:00', endTime: '12:00', sessionFormat: 'in_person' }
        ],
        momoNetwork: 'MTN MoMo',
        momoAccountNumber: '0244123456'
      })
    });
    const dossierData = await validDossierRes.json();
    assert(validDossierRes.status === 200 && dossierData.success === true, 'POST /api/teachers/onboarding returns 200 with success status');
    assert(dossierData.progressPercentage >= 80, 'Calculates onboarding progress percentage');
    assert(dossierData.dimensions.D1_Identity === 'pending', 'D1 Identity is registered as pending');
    assert(dossierData.dimensions.D3_Licence === 'pending', 'D3 NTC Licence is registered as pending');
    assert(dossierData.dimensions.D5_Profile === 'submitted', 'D5 Profile is marked as submitted');

    // -------------------------------------------------------------
    // 3. GET /api/teachers/profile/me & Vetting Status
    // -------------------------------------------------------------
    console.log('\n--- 3. Educator Profile & Vetting Status Inspection ---');

    const meProfileRes = await fetch(`${BASE_URL}/api/teachers/profile/me`, {
      headers: { Authorization: `Bearer ${educatorToken}` }
    });
    const meProfileData = await meProfileRes.json();
    assert(meProfileRes.status === 200 && meProfileData.success === true, 'GET /api/teachers/profile/me returns 200');
    assert(meProfileData.dimensions && meProfileData.dimensions.D1_Identity, 'Profile includes 5-dimensional vetting status');

    const vettingStatusRes = await fetch(`${BASE_URL}/api/teachers/vetting-status`, {
      headers: { Authorization: `Bearer ${educatorToken}` }
    });
    const vettingStatusData = await vettingStatusRes.json();
    assert(vettingStatusRes.status === 200 && vettingStatusData.dimensions, 'GET /api/teachers/vetting-status returns 200 dimensions');

    // -------------------------------------------------------------
    // 4. PATCH /api/teachers/profile/me
    // -------------------------------------------------------------
    console.log('\n--- 4. PATCH /api/teachers/profile/me (Profile & Career View DEC-011) ---');

    const patchRes = await fetch(`${BASE_URL}/api/teachers/profile/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        headline: 'Lead Cambridge IGCSE Elective Mathematics Specialist',
        active_dashboard_view: 'both',
        hourly_rate: 160
      })
    });
    const patchData = await patchRes.json();
    assert(patchRes.status === 200 && patchData.success === true, 'PATCH /api/teachers/profile/me returns 200');

    // -------------------------------------------------------------
    // 5. Super Admin 5D Vetting Queue & Multi-Dimensional Approval
    // -------------------------------------------------------------
    console.log('\n--- 5. Super Admin 5D Vetting Queue & Approval Desk ---');

    // 5a. Fetch Vetting Queue
    const queueRes = await fetch(`${BASE_URL}/api/admin/professionals/vetting-queue`, {
      headers: { Authorization: `Bearer ${superAdminToken}` }
    });
    const queueData = await queueRes.json();
    assert(queueRes.status === 200 && Array.isArray(queueData.queue), 'GET /api/admin/professionals/vetting-queue returns queue array');

    const targetProfId = dossierData.profile?.id || 'prof-sample-01';

    // 5b. Vet D1 Identity
    const vetD1Res = await fetch(`${BASE_URL}/api/admin/professionals/${targetProfId}/vet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${superAdminToken}`
      },
      body: JSON.stringify({
        dimension: 'D1',
        status: 'verified',
        notes: 'Ghana Card NIA format and photo match verified against registry.'
      })
    });
    const vetD1Data = await vetD1Res.json();
    assert(vetD1Res.status === 200 && vetD1Data.status === 'verified', 'Admin verifies D1 Identity with 200 OK');

    // 5c. Vet D3 Licensure
    const vetD3Res = await fetch(`${BASE_URL}/api/admin/professionals/${targetProfId}/vet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${superAdminToken}`
      },
      body: JSON.stringify({
        dimension: 'D3',
        status: 'verified',
        notes: 'NTC Teacher Licence NTC/PR/2021/8892 active on National Teaching Council portal.'
      })
    });
    const vetD3Data = await vetD3Res.json();
    assert(vetD3Res.status === 200 && vetD3Data.status === 'verified', 'Admin verifies D3 NTC Licence with 200 OK');

    // 5d. Vet D4 Child-Facing Eligibility (Gate G4 release prerequisite)
    const vetD4Res = await fetch(`${BASE_URL}/api/admin/professionals/${targetProfId}/vet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${superAdminToken}`
      },
      body: JSON.stringify({
        dimension: 'D4',
        status: 'verified',
        notes: 'Child protection declaration affirmed; 2 referees verified without safeguarding concerns.'
      })
    });
    const vetD4Data = await vetD4Res.json();
    assert(vetD4Res.status === 200 && vetD4Data.status === 'verified', 'Admin verifies D4 Child-Facing Eligibility with 200 OK');

    // 5e. Approve D5 Profile Publication
    const vetD5Res = await fetch(`${BASE_URL}/api/admin/professionals/${targetProfId}/vet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${superAdminToken}`
      },
      body: JSON.stringify({
        dimension: 'D5',
        status: 'published',
        notes: 'All D1-D4 clearances satisfied. Profile published to directory.'
      })
    });
    const vetD5Data = await vetD5Res.json();
    assert(vetD5Res.status === 200 && vetD5Data.status === 'published', 'Admin approves D5 Profile for public directory');

    // -------------------------------------------------------------
    // 6. Public Directory Reflection
    // -------------------------------------------------------------
    console.log('\n--- 6. Public Teacher Directory Reflection ---');

    const directoryRes = await fetch(`${BASE_URL}/api/teachers?limit=20`);
    const directoryData = await directoryRes.json();
    assert(directoryRes.status === 200 && Array.isArray(directoryData), 'GET /api/teachers returns active educators list');

    console.log('\n========================================');
    console.log(`Release 2 Verification Results: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('========================================\n');

  } catch (err) {
    console.error('Fatal test error:', err);
    failedTests++;
  } finally {
    if (server) server.close();
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

runTests();
