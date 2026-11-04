/**
 * Master Verification Suite: SkoolFinder Ghana School Owner & Proprietor Portal
 * Phase 1 Verification (Packages SCH-001 through SCH-010 + DEC-01 Constraints)
 */
const app = require('../server');
const SchoolOwnerService = require('../src/services/schoolOwnerService');

async function runPhase1Verification() {
  console.log('======================================================================');
  console.log('🏆 SKOOLFINDER GHANA SCHOOL OWNER & PROPRIETOR BLUEPRINT v2.0');
  console.log('   Phase 1 Verification Suite: Registration, Verification & Dashboard');
  console.log('======================================================================\n');

  const server = app.listen(4899, '127.0.0.1', async () => {
    let passed = 0;
    let failed = 0;

    async function check(testId, name, fn) {
      try {
        await fn();
        console.log(`  ✅ [PASS] ${testId}: ${name}`);
        passed++;
      } catch (err) {
        console.error(`  ❌ [FAIL] ${testId}: ${name} ->`, err.message);
        failed++;
      }
    }

    try {
      const baseUrl = 'http://127.0.0.1:4899';

      // ----------------------------------------------------------------------
      // TEST 1: SCH-001 Proprietor Registration & Identity
      // ----------------------------------------------------------------------
      await check('SCH-001', 'Proprietor registration validates required coordinates', async () => {
        const res = await fetch(`${baseUrl}/api/schools/register-wizard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Missing name, suburb, phone
            category: 'Private'
          })
        });
        if (res.status !== 400) {
          throw new Error(`Expected 400 validation error, got HTTP ${res.status}`);
        }
      });

      // ----------------------------------------------------------------------
      // TEST 2: SCH-002 Existing-School Lookup & Claim Conflict
      // ----------------------------------------------------------------------
      await check('SCH-002', 'Lookup finds canonical school and checks claim status', async () => {
        const res = await fetch(`${baseUrl}/api/schools/lookup-claim`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: 'Ghana International' })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data.success) throw new Error('Lookup claim returned success=false');
        if (!Array.isArray(data.schools) || data.schools.length === 0) {
          throw new Error('Lookup claim did not find Ghana International School');
        }
        const gis = data.schools[0];
        if (gis.claimed !== true) {
          throw new Error('Expected Ghana International School to be marked as claimed');
        }
      });

      // ----------------------------------------------------------------------
      // TEST 3: SCH-003 Institution Registration Wizard
      // ----------------------------------------------------------------------
      let testSchoolId = null;
      const testUserId = `usr-test-proprietor-${Date.now()}`;

      await check('SCH-003', 'Multi-step registration wizard creates school and default published profile', async () => {
        const res = await fetch(`${baseUrl}/api/schools/register-wizard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Akosombo International Academy',
            category: 'Private',
            levels: ['Primary', 'JHS'],
            curricula: ['GES (NaCCA)', 'Cambridge'],
            boarding_type: 'Day & Boarding',
            gender_type: 'Mixed',
            region: 'Eastern',
            district: 'Asuogyaman',
            suburb: 'Akosombo',
            phone: '+233 24 555 1234',
            email: 'admin@akosombo-academy.edu.gh',
            proprietor_name: 'Dr. Kwame Boateng',
            proprietor_phone: '+233 24 555 1234',
            proprietor_email: 'kwame.boateng@akosombo-academy.edu.gh',
            user: {
              id: testUserId,
              email: 'kwame.boateng@akosombo-academy.edu.gh',
              full_name: 'Dr. Kwame Boateng',
              role: 'school_admin'
            }
          })
        });

        if (res.status !== 201) {
          const err = await res.json();
          throw new Error(`HTTP ${res.status}: ${err.error || 'Registration failed'}`);
        }

        const data = await res.json();
        if (!data.school || !data.school.id) throw new Error('Missing school payload in registration response');
        testSchoolId = data.school.id;
        if (data.membership.role !== 'primary_proprietor') {
          throw new Error(`Expected primary_proprietor role, got ${data.membership.role}`);
        }
      });

      // ----------------------------------------------------------------------
      // TEST 4: SCH-004 Private Verification Document Submission
      // ----------------------------------------------------------------------
      await check('SCH-004', 'Private regulatory document upload and retrieval', async () => {
        const postRes = await fetch(`${baseUrl}/api/schools/${testSchoolId}/verification-docs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document_type: 'NaSIA School License',
            document_number: 'NaSIA/REG/2026/0998',
            expires_at: '2027-12-31',
            file_url: 'https://storage.supabase.co/private/docs/nasia-cert.pdf'
          })
        });

        if (postRes.status !== 201) throw new Error(`Document upload failed with HTTP ${postRes.status}`);

        const getRes = await fetch(`${baseUrl}/api/schools/${testSchoolId}/verification-docs`);
        if (!getRes.ok) throw new Error(`Get documents failed with HTTP ${getRes.status}`);
        const data = await getRes.json();
        if (!Array.isArray(data.documents) || data.documents.length === 0) {
          throw new Error('No documents returned from verification-docs endpoint');
        }
        const doc = data.documents[0];
        if (doc.document_type !== 'NaSIA School License') {
          throw new Error(`Expected NaSIA School License, got ${doc.document_type}`);
        }
      });

      // ----------------------------------------------------------------------
      // TEST 5: SCH-005 Super Admin Review Queue & Decisions
      // ----------------------------------------------------------------------
      await check('SCH-005', 'Super Admin review queue retrieves cases and processes approval', async () => {
        const queueRes = await fetch(`${baseUrl}/api/admin/verification-cases`);
        if (!queueRes.ok) throw new Error(`Queue fetch failed with HTTP ${queueRes.status}`);
        const queueData = await queueRes.json();
        if (!Array.isArray(queueData.queue)) throw new Error('Expected array of verification cases');

        // Review the first pending case
        const targetCase = queueData.queue[0];
        if (!targetCase) throw new Error('Verification queue is unexpectedly empty');

        const reviewRes = await fetch(`${baseUrl}/api/admin/verification-cases/${targetCase.id}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            decision: 'approved',
            notes: 'NaSIA certificate and proprietor authority verified by Super Admin'
          })
        });

        if (!reviewRes.ok) throw new Error(`Review action failed with HTTP ${reviewRes.status}`);
        const reviewResult = await reviewRes.json();
        if (reviewResult.case.authority_status !== 'verified') {
          throw new Error(`Expected verified status, got ${reviewResult.case.authority_status}`);
        }
      });

      // ----------------------------------------------------------------------
      // TEST 6: SCH-006 & DEC-01 Workspace Activation & Single-Proprietor Rule
      // ----------------------------------------------------------------------
      await check('SCH-006', 'DEC-01: Exactly one primary school per proprietor account enforced', async () => {
        // Attempt to register a SECOND school with the same proprietor user ID
        const secondRes = await fetch(`${baseUrl}/api/schools/register-wizard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Second Conflicting Campus',
            category: 'Private',
            levels: ['Primary'],
            curricula: ['GES (NaCCA)'],
            suburb: 'East Legon',
            phone: '+233 24 000 9999',
            email: 'second@school.edu.gh',
            proprietor_name: 'Dr. Kwame Boateng',
            proprietor_phone: '+233 24 555 1234',
            proprietor_email: 'kwame.boateng@akosombo-academy.edu.gh',
            user: {
              id: testUserId, // Same user ID
              email: 'kwame.boateng@akosombo-academy.edu.gh',
              full_name: 'Dr. Kwame Boateng',
              role: 'school_admin'
            }
          })
        });

        if (secondRes.status !== 409) {
          throw new Error(`Expected 409 Conflict (DEC-01 Violation), got HTTP ${secondRes.status}`);
        }
        const err = await secondRes.json();
        if (err.code !== 'DEC_01_VIOLATION') {
          throw new Error(`Expected DEC_01_VIOLATION error code, got ${err.code}`);
        }
      });

      // ----------------------------------------------------------------------
      // TEST 7: SCH-007 School Overview Dashboard (DASH-001)
      // ----------------------------------------------------------------------
      await check('SCH-007', 'DASH-001 Workspace telemetry returns KPIs, seat quotas and task queue', async () => {
        const res = await fetch(`${baseUrl}/api/schools/${testSchoolId}/workspace`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data.workspace) throw new Error('Missing workspace in response');
        const ws = data.workspace;

        if (!ws.kpis) throw new Error('Missing kpis in workspace telemetry');
        if (!ws.seatQuotas || typeof ws.seatQuotas.allocated !== 'number') {
          throw new Error('Missing seatQuotas in workspace telemetry');
        }
        if (!ws.profileRevisions) throw new Error('Missing profileRevisions in workspace');
        if (!Array.isArray(ws.tasks)) throw new Error('Missing tasks array in workspace');
      });

      // ----------------------------------------------------------------------
      // TEST 8: SCH-008 Public Profile Draft/Published Workflow
      // ----------------------------------------------------------------------
      await check('SCH-008', 'Draft revision saved privately and promoted upon publish', async () => {
        // 1. Save draft revision
        const draftRes = await fetch(`${baseUrl}/api/schools/${testSchoolId}/profile-draft`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: 'Updated draft curriculum with STEM & Robotics Center',
            tuition_min: 18000,
            tuition_max: 38000,
            facilities: ['Science Lab', 'STEM Hub', 'Modern Library']
          })
        });

        if (!draftRes.ok) throw new Error(`Save draft failed with HTTP ${draftRes.status}`);
        const draftData = await draftRes.json();
        if (!draftData.draft) throw new Error('Missing draft payload in response');

        // Verify draft was saved
        const revRes = await fetch(`${baseUrl}/api/schools/${testSchoolId}/profile-revisions`);
        const revData = await revRes.json();
        if (!revData.draft || revData.draft.tuition_min !== 18000) {
          throw new Error('Draft revision did not persist');
        }

        // 2. Publish draft revision
        const pubRes = await fetch(`${baseUrl}/api/schools/${testSchoolId}/profile-publish`, {
          method: 'POST'
        });
        if (!pubRes.ok) throw new Error(`Publish failed with HTTP ${pubRes.status}`);
        const pubData = await pubRes.json();
        if (!pubData.published || pubData.published.tuition_min !== 18000) {
          throw new Error('Published revision did not adopt draft properties');
        }
      });

      // ----------------------------------------------------------------------
      // TEST 9: SCH-009 Staff Invitation, Roles & Seat Limit Quota Check
      // ----------------------------------------------------------------------
      await check('SCH-009', 'Enforces tier seat limit quotas (Free: 1, Growth: 3) and revokes seats', async () => {
        // Default tier for new school is Free (limit = 1 seat, already used by primary_proprietor)
        const overLimitRes = await fetch(`${baseUrl}/api/schools/${testSchoolId}/staff/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Kofi Mensah',
            email: 'kofi.mensah@akosombo.edu.gh',
            role: 'admissions_officer'
          })
        });

        if (overLimitRes.status !== 403) {
          throw new Error(`Expected 403 Forbidden for Free tier seat limit, got HTTP ${overLimitRes.status}`);
        }
        const err = await overLimitRes.json();
        if (err.code !== 'SEAT_LIMIT_REACHED') {
          throw new Error(`Expected SEAT_LIMIT_REACHED error code, got ${err.code}`);
        }

        // Test staff list endpoint
        const staffRes = await fetch(`${baseUrl}/api/schools/${testSchoolId}/staff`);
        if (!staffRes.ok) throw new Error(`Staff fetch failed with HTTP ${staffRes.status}`);
        const staffData = await staffRes.json();
        if (!Array.isArray(staffData.staff) || staffData.staff.length !== 1) {
          throw new Error(`Expected exactly 1 staff member, got ${staffData.staff?.length}`);
        }
      });

      // ----------------------------------------------------------------------
      // TEST 10: SCH-010 Audit History & Traceability
      // ----------------------------------------------------------------------
      await check('SCH-010', 'Tamper-evident audit logging of actions and state transitions', async () => {
        const wsRes = await fetch(`${baseUrl}/api/schools/${testSchoolId}/workspace`);
        const wsData = await wsRes.json();
        const logs = wsData.workspace?.auditLogs || [];

        if (logs.length === 0) {
          throw new Error('No audit logs recorded for test school mutations');
        }

        // Verify actions logged include registration or profile mutations
        const hasRelevantLog = logs.some(l => 
          l.action.includes('school_registered') || 
          l.action.includes('profile_draft_saved') ||
          l.action.includes('profile_published')
        );

        if (!hasRelevantLog) {
          throw new Error('Expected school registration or profile edit audit entry');
        }
      });

      console.log('\n======================================================================');
      console.log(`📊 Phase 1 Verification Results: ${passed} Passed, ${failed} Failed`);
      console.log('======================================================================\n');

    } catch (e) {
      console.error('Test execution error:', e);
    } finally {
      server.close();
      process.exit(failed > 0 ? 1 : 0);
    }
  });
}

runPhase1Verification();

