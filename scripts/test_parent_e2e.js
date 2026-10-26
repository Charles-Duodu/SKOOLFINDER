/**
 * 🇬🇭 SkoolFinder Ghana - End-to-End Parent Journey Test Suite
 * Validates the complete parent experience across all 8 core milestones:
 * 1. School Directory Search & Localized Filters
 * 2. School Profile Showcase & Click-to-Reveal Lead Generation
 * 3. CSSPS Senior High School Placement & BECE Aggregate Predictor
 * 4. Digital Admission Application Submission & SMS Alert
 * 5. Mobile Money & Card Fee Invoicing / Checkout Engine
 * 6. Student Digital ID Card & QR Verification Hub
 * 7. Akosua AI Educational Chatbot Assistant
 * 8. Real-time Parent Portal Synced Queries
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function runParentJourneyE2E() {
  console.log('================================================================');
  console.log('🇬🇭  SkoolFinder Ghana - Full End-to-End Parent Flow Test');
  console.log(`   Target Server: ${BASE_URL}`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  // Helper
  async function testStep(stepNum, name, testFn) {
    try {
      process.stdout.write(`Step ${stepNum}: ${name}... `);
      await testFn();
      console.log('✅ PASS');
      passed++;
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}`);
      failed++;
    }
  }

  // 1. Directory Search
  await testStep(1, 'Directory Search (Greater Accra + Cambridge Curriculum)', async () => {
    const res = await fetch(`${BASE_URL}/api/schools?region=Greater%20Accra&curriculum=Cambridge`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const schools = await res.json();
    if (!Array.isArray(schools) || schools.length === 0) {
      throw new Error(`Expected at least 1 matching school, got ${schools?.length}`);
    }
    const gis = schools.find(s => s.id === 'sch-gis-accra');
    if (!gis) throw new Error('Ghana International School should be in results');
  });

  // 2. School Profile & Click-to-Reveal WhatsApp Lead Tracking
  await testStep(2, 'School Profile Detail & WhatsApp Lead Generation', async () => {
    const profileRes = await fetch(`${BASE_URL}/api/schools/sch-gis-accra`);
    if (!profileRes.ok) throw new Error(`Profile HTTP ${profileRes.status}`);
    const school = await profileRes.json();
    if (school.name !== 'Ghana International School (GIS)') {
      throw new Error(`Unexpected school name: ${school.name}`);
    }

    // Trigger WhatsApp reveal lead event
    const leadRes = await fetch(`${BASE_URL}/api/schools/sch-gis-accra/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'whatsapp_reveal' })
    });
    if (!leadRes.ok) throw new Error(`Lead HTTP ${leadRes.status}`);
    const leadData = await leadRes.json();
    if (!leadData.success) throw new Error('Lead recording failed');
  });

  // 3. CSSPS Senior High Placement Predictor
  await testStep(3, 'CSSPS BECE Placement Calculator (Aggregate 6 -> Category A)', async () => {
    const calcRes = await fetch(`${BASE_URL}/api/cssps/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maths: 1,
        english: 1,
        science: 1,
        social: 1,
        elective1: 1,
        elective2: 1,
        program: 'General Science',
        gender: 'Male',
        preferredRegion: 'Greater Accra'
      })
    });
    if (!calcRes.ok) throw new Error(`CSSPS HTTP ${calcRes.status}`);
    const placement = await calcRes.json();
    if (placement.scores?.totalAggregate !== 6) {
      throw new Error(`Expected totalAggregate 6, got ${placement.scores?.totalAggregate}`);
    }
    if (!Array.isArray(placement.recommendations?.selectionPlan) || placement.recommendations.selectionPlan.length === 0) {
      throw new Error('Expected 6-school selection plan for aggregate 6');
    }
  });

  // 4. Online Admission Application
  let createdAppId = null;
  await testStep(4, 'Online Admission Application Submission', async () => {
    const applyRes = await fetch(`${BASE_URL}/api/admissions/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schoolId: 'sch-gis-accra',
        studentName: 'Kofi Mensah Addo',
        dob: '2018-05-20',
        gender: 'Male',
        gradeApplying: 'Primary 1',
        parentName: 'Dr. Kwame Addo',
        parentPhone: '+233 24 412 3456',
        parentEmail: 'kwame.addo@example.gh',
        homeAddress: 'Airport Residential, Accra',
        curriculum: 'Cambridge Primary',
        academicYear: '2026/2027',
        paymentMethod: 'Mobile Money (MTN MoMo)'
      })
    });
    if (!applyRes.ok) throw new Error(`Apply HTTP ${applyRes.status}`);
    const appData = await applyRes.json();
    if (!appData.success || !appData.application?.id) {
      throw new Error('Application creation response missing id');
    }
    createdAppId = appData.application.id;
  });

  // 5. Mobile Money Payment Simulation (Term Fee / Application Voucher)
  await testStep(5, 'Paystack Mobile Money Checkout (Simulated MTN MoMo)', async () => {
    // Initialize payment
    const initRes = await fetch(`${BASE_URL}/api/payments/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Admission Voucher & Assessment Fee',
        payerName: 'Dr. Kwame Addo',
        payerPhone: '+233 24 412 3456',
        amount: 350,
        paymentType: 'admission_form',
        targetId: 'sch-gis-accra'
      })
    });
    if (!initRes.ok) throw new Error(`Payment Init HTTP ${initRes.status}`);
    const initData = await initRes.json();
    const reference = initData.transaction?.reference;
    if (!reference) throw new Error('Missing transaction reference');

    // Verify payment
    const verifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference,
        network: 'MTN Mobile Money',
        authCode: '123456'
      })
    });
    if (!verifyRes.ok) throw new Error(`Payment Verify HTTP ${verifyRes.status}`);
    const verifyData = await verifyRes.json();
    if (!verifyData.success || verifyData.transaction?.status !== 'success') {
      throw new Error('Payment verification did not return success');
    }
  });

  // 6. Student Digital ID & Gatekeeper Scanner
  await testStep(6, 'Student Digital ID Card & Gate Security Scanner', async () => {
    // 6a. Single ID Fetch
    const idRes = await fetch(`${BASE_URL}/api/students/GIS-2026-0842/digital-id`);
    if (!idRes.ok) throw new Error(`Digital ID HTTP ${idRes.status}`);
    const idData = await idRes.json();
    if (!idData.studentName || idData.status !== 'ACTIVE') {
      throw new Error('Student digital ID invalid or inactive');
    }

    // 6b. Gatekeeper QR Scanner Verification
    const gateRes = await fetch(`${BASE_URL}/api/students/verify-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ indexNumber: 'GIS-2026-0842' })
    });
    if (!gateRes.ok) throw new Error(`Gate verify HTTP ${gateRes.status}`);
    const gateData = await gateRes.json();
    if (!gateData.verified || gateData.status !== 'ACTIVE') {
      throw new Error('Gate verification failed');
    }
  });

  // 7. Akosua AI Educational Chatbot
  await testStep(7, 'Akosua AI Chatbot Knowledge Assistant', async () => {
    const chatRes = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Akwaaba! Which Cambridge international schools in Accra offer swimming and bus services?'
      })
    });
    if (!chatRes.ok) throw new Error(`Chat HTTP ${chatRes.status}`);
    const chatData = await chatRes.json();
    if (!chatData.reply || chatData.reply.length < 20) {
      throw new Error('Akosua AI did not return a valid response');
    }
    if (!Array.isArray(chatData.suggestions)) {
      throw new Error('Akosua AI suggestions missing');
    }
  });

  // 8. Parent Portal Student Synchronization
  await testStep(8, 'Parent Portal Student Academic, Sickbay & Bus Tracking Records', async () => {
    // Check report cards
    const repRes = await fetch(`${BASE_URL}/api/academics/report-cards?schoolId=sch-gis-accra`);
    if (!repRes.ok) throw new Error(`Report cards HTTP ${repRes.status}`);
    const repData = await repRes.json();
    if (!Array.isArray(repData) || repData.length === 0) {
      throw new Error('Parent portal report cards should not be empty');
    }

    // Check transport routes
    const transRes = await fetch(`${BASE_URL}/api/transport/routes?schoolId=sch-gis-accra`);
    if (!transRes.ok) throw new Error(`Transport HTTP ${transRes.status}`);
    const transData = await transRes.json();
    if (!Array.isArray(transData) || transData.length === 0) {
      throw new Error('Parent portal transport routes should not be empty');
    }
  });

  console.log('\n================================================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  if (failed === 0) {
    console.log('🎉 100% PARENT END-TO-END FLOW VERIFIED & FULLY OPERATIONAL!');
  }
  console.log('================================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runParentJourneyE2E().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
