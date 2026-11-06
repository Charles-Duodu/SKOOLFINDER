/**
 * SkoolFinder Ghana — Release 4 Verification Test Suite
 * Tests Safeguarded Tutoring & Mutual Booking Engine (Milestones M07, M08, M09)
 * Baseline: Blueprint v2.0 §14, §15, §16, §24, §26; DEC-004, DEC-005, DEC-010, DEC-025
 * Covers:
 *   - Gate G4 Child Safeguarding Hard Enforcement (Adult-to-Adult Contracting)
 *   - 10-State Mutual Consultation & Lesson State Machine (DEC-010)
 *   - Educator Availability Scheduling (AVA-01 to AVA-04)
 *   - Parent & Educator Booking Retrieval & Dossiers
 *   - Escrow Status Tracking (unfunded -> held_in_escrow -> disbursed / disputed)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');

const teachersRouter = require('../src/routes/teachers');
const parentsRouter = require('../src/routes/parents');
const { JWT_SECRET } = require('../src/middleware/auth');

const app = express();
app.use(express.json());

app.use('/api/teachers', teachersRouter);
app.use('/api/parents', parentsRouter);

let server;
const PORT = 3489;
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
  console.log('\n🚀 Starting SkoolFinder Ghana — Release 4 Safeguarded Tutoring Test Suite...\n');

  await new Promise(resolve => {
    server = app.listen(PORT, resolve);
  });

  try {
    const testEducatorId = '55555555-6666-7777-8888-999999999999';
    const testParentId = '11111111-2222-3333-4444-555555555555';

    const educatorToken = jwt.sign({
      id: testEducatorId,
      email: 'educator.boateng@gmail.com',
      role: 'teacher',
      name: 'Emmanuel Kwame Boateng',
      full_name: 'Emmanuel Kwame Boateng'
    }, JWT_SECRET, { expiresIn: '1h' });

    const parentToken = jwt.sign({
      id: testParentId,
      email: 'parent.arthur@gmail.com',
      role: 'parent',
      name: 'Mrs. Cynthia Arthur',
      full_name: 'Mrs. Cynthia Arthur',
      phone: '+233 24 412 8899'
    }, JWT_SECRET, { expiresIn: '1h' });

    // ========================================================================
    // 1. GATE G4 CHILD SAFEGUARDING ENFORCEMENT
    // ========================================================================
    console.log('\n--- Section 1: Gate G4 Child Safeguarding Hard Enforcement ---');

    // Test 1: POST /api/teachers/book WITHOUT guardianAffirmation -> 403 Forbidden
    const unverifiedBookingRes = await fetch(`${BASE_URL}/api/teachers/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacherId: testEducatorId,
        studentName: 'Unaccompanied Minor',
        subject: 'Mathematics',
        guardianAffirmation: false
      })
    });
    const unverifiedData = await unverifiedBookingRes.json();
    assert(unverifiedBookingRes.status === 403, 'Gate G4 blocks booking without guardian affirmation (Status 403)');
    assert(unverifiedData.code === 'SAFEGUARDING_GATE_G4_BLOCKED', 'Returns SAFEGUARDING_GATE_G4_BLOCKED error code');
    assert(unverifiedData.error.includes('Gate G4 Safeguarding Violation'), 'Error message cites Gate G4 Safeguarding');

    // Test 2: POST /api/teachers/:id/book WITHOUT guardianAffirmation -> 403
    const unverifiedParamRes = await fetch(`${BASE_URL}/api/teachers/${testEducatorId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: 'Junior Student',
        subject: 'Science'
      })
    });
    assert(unverifiedParamRes.status === 403, 'POST /api/teachers/:id/book blocks without guardianAffirmation (403)');

    // Test 3: POST /api/parents/book WITHOUT guardianAffirmation -> 403
    const unverifiedParentRes = await fetch(`${BASE_URL}/api/parents/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`
      },
      body: JSON.stringify({
        teacherId: testEducatorId,
        studentName: 'Nana Yaw',
        guardianAffirmation: false
      })
    });
    assert(unverifiedParentRes.status === 403, 'POST /api/parents/book blocks without guardianAffirmation (403)');

    // ========================================================================
    // 2. CONSULTATION & BOOKING INITIATION UNDER GATE G4
    // ========================================================================
    console.log('\n--- Section 2: Consultation Initiation under Gate G4 Affirmation ---');

    // Test 4: Successful booking creation with guardianAffirmation: true via /api/parents/book
    const validBookingRes = await fetch(`${BASE_URL}/api/parents/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`
      },
      body: JSON.stringify({
        teacherId: testEducatorId,
        teacherName: 'Emmanuel Kwame Boateng',
        studentName: 'Nana Yaw Arthur',
        gradeLevel: 'Class 5',
        subject: 'Core Mathematics & Coding',
        hourlyRate: 100,
        sessionsCount: 4,
        meetingLocation: 'East Legon, Accra',
        guardianAffirmation: true
      })
    });
    const validBookingData = await validBookingRes.json();
    assert(validBookingRes.status === 201, 'Valid consultation booking returns 201 Created');
    assert(validBookingData.success === true, 'Response contains success: true');
    assert(validBookingData.contractType === 'adult_to_adult_consultation', 'Contract type is adult_to_adult_consultation');
    assert(typeof validBookingData.referenceCode === 'string' && validBookingData.referenceCode.startsWith('TUT-2026-'), 'Reference code has TUT-2026- prefix');

    const bookingId = validBookingData.booking.id;
    assert(validBookingData.booking.status === 'consultation_requested', 'Initial state is consultation_requested');
    assert(validBookingData.booking.escrow_status === 'unfunded', 'Initial escrow status is unfunded');
    assert(validBookingData.booking.total_amount_ghs === 400, 'Total amount calculated accurately (100 * 4 = 400 GHS)');
    assert(validBookingData.booking.guardian_consent_verified === true, 'guardian_consent_verified is true');

    // ========================================================================
    // 3. 10-STATE MUTUAL BOOKING ENGINE TRANSITIONS (DEC-010)
    // ========================================================================
    console.log('\n--- Section 3: 10-State Mutual Booking Engine Transitions (DEC-010) ---');

    // Transition 1: consultation_requested -> consultation_scheduled
    const t1Res = await fetch(`${BASE_URL}/api/teachers/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        status: 'consultation_scheduled',
        scheduledStart: '2026-11-10T16:00:00Z',
        scheduledEnd: '2026-11-10T17:00:00Z',
        meetingLink: 'https://meet.google.com/abc-defg-hij'
      })
    });
    const t1Data = await t1Res.json();
    assert(t1Res.status === 200, 'Transition to consultation_scheduled returns 200');
    assert(t1Data.booking.status === 'consultation_scheduled', 'Status updated to consultation_scheduled');
    assert(t1Data.booking.meeting_link === 'https://meet.google.com/abc-defg-hij', 'Meeting link recorded');

    // Transition 2: consultation_scheduled -> lesson_agreement_drafted
    const t2Res = await fetch(`${BASE_URL}/api/teachers/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        status: 'lesson_agreement_drafted',
        hourlyRate: 120,
        sessionsCount: 5
      })
    });
    const t2Data = await t2Res.json();
    assert(t2Res.status === 200, 'Transition to lesson_agreement_drafted returns 200');
    assert(t2Data.booking.status === 'lesson_agreement_drafted', 'Status updated to lesson_agreement_drafted');
    assert(t2Data.booking.total_amount_ghs === 600, 'Updated total amount (120 * 5 = 600 GHS)');

    // Transition 3: lesson_agreement_drafted -> escrow_funded
    const t3Res = await fetch(`${BASE_URL}/api/teachers/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`
      },
      body: JSON.stringify({
        status: 'escrow_funded'
      })
    });
    const t3Data = await t3Res.json();
    assert(t3Res.status === 200, 'Transition to escrow_funded returns 200');
    assert(t3Data.booking.status === 'escrow_funded', 'Status updated to escrow_funded');
    assert(t3Data.booking.escrow_status === 'held_in_escrow', 'Escrow status updated to held_in_escrow');

    // Transition 4: escrow_funded -> session_confirmed
    const t4Res = await fetch(`${BASE_URL}/api/teachers/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        status: 'session_confirmed',
        meetingLocation: 'East Legon Residence'
      })
    });
    const t4Data = await t4Res.json();
    assert(t4Res.status === 200, 'Transition to session_confirmed returns 200');
    assert(t4Data.booking.status === 'session_confirmed', 'Status updated to session_confirmed');

    // Transition 5: session_confirmed -> session_conducted
    const t5Res = await fetch(`${BASE_URL}/api/teachers/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        status: 'session_conducted',
        completionNotes: 'All 5 modules completed. Student mastered fraction operations and intro Python.'
      })
    });
    const t5Data = await t5Res.json();
    assert(t5Res.status === 200, 'Transition to session_conducted returns 200');
    assert(t5Data.booking.status === 'session_conducted', 'Status updated to session_conducted');
    assert(t5Data.booking.completion_notes.includes('mastered fraction'), 'Completion notes stored');

    // Transition 6: session_conducted -> parent_signoff (via parent route)
    const t6Res = await fetch(`${BASE_URL}/api/parents/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${parentToken}`
      },
      body: JSON.stringify({
        status: 'parent_signoff',
        rating: 5,
        feedback: 'Outstanding educator. Nana Yaw improved remarkably.'
      })
    });
    const t6Data = await t6Res.json();
    assert(t6Res.status === 200, 'Parent signoff via /api/parents/bookings/:id/status returns 200');
    assert(t6Data.booking.status === 'parent_signoff', 'Status updated to parent_signoff');
    assert(t6Data.booking.parent_rating === 5, 'Parent rating 5 stars stored');

    // Transition 7: parent_signoff -> disbursed
    const t7Res = await fetch(`${BASE_URL}/api/teachers/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        status: 'disbursed'
      })
    });
    const t7Data = await t7Res.json();
    assert(t7Res.status === 200, 'Transition to disbursed returns 200');
    assert(t7Data.booking.status === 'disbursed', 'Status updated to disbursed');
    assert(t7Data.booking.escrow_status === 'disbursed', 'Escrow status transitioned to disbursed');

    // Invalid state transition rejection test
    const invalidStateRes = await fetch(`${BASE_URL}/api/teachers/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'invalid_status_xyz' })
    });
    assert(invalidStateRes.status === 400, 'Invalid booking status rejected with 400 Bad Request');

    // ========================================================================
    // 4. DISPUTE & CANCELLATION BRANCHES
    // ========================================================================
    console.log('\n--- Section 4: Dispute & Cancellation Branches ---');

    // Create booking for dispute test
    const disputeBookingRes = await fetch(`${BASE_URL}/api/teachers/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacherId: testEducatorId,
        parentName: 'Mr. Kofi Badu',
        parentPhone: '+233 20 888 7766',
        studentName: 'Junior Badu',
        guardianAffirmation: true
      })
    });
    const disputeBooking = (await disputeBookingRes.json()).booking;

    const disputeRes = await fetch(`${BASE_URL}/api/teachers/bookings/${disputeBooking.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'disputed',
        reason: 'Session schedule mismatch not resolved'
      })
    });
    const disputeData = await disputeRes.json();
    assert(disputeData.booking.status === 'disputed', 'Dispute transition updates status to disputed');
    assert(disputeData.booking.escrow_status === 'disputed', 'Escrow status set to disputed');

    // Create booking for cancellation test
    const cancelBookingRes = await fetch(`${BASE_URL}/api/teachers/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacherId: testEducatorId,
        parentName: 'Mrs. Akua Mensah',
        parentPhone: '+233 24 555 4433',
        studentName: 'Kwesi Mensah',
        guardianAffirmation: true
      })
    });
    const cancelBooking = (await cancelBookingRes.json()).booking;

    const cancelRes = await fetch(`${BASE_URL}/api/teachers/bookings/${cancelBooking.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'cancelled',
        reason: 'Family relocated to Takoradi'
      })
    });
    const cancelData = await cancelRes.json();
    assert(cancelData.booking.status === 'cancelled', 'Cancel transition updates status to cancelled');
    assert(cancelData.booking.cancellation_reason.includes('relocated'), 'Cancellation reason stored');

    // ========================================================================
    // 5. EDUCATOR WEEKLY AVAILABILITY SCHEDULING (AVA-01 to AVA-04)
    // ========================================================================
    console.log('\n--- Section 5: Educator Weekly Availability Scheduling (AVA-01 to AVA-04) ---');

    // Test default availability for unconfigured educator
    const defaultAvailRes = await fetch(`${BASE_URL}/api/teachers/${testEducatorId}/availability`);
    const defaultAvail = await defaultAvailRes.json();
    assert(defaultAvailRes.status === 200, 'GET /api/teachers/:id/availability returns 200');
    assert(defaultAvail.success === true, 'Availability fetch reports success: true');
    assert(Array.isArray(defaultAvail.schedule) && defaultAvail.schedule.length > 0, 'Returns recurring weekly slots array');
    assert(defaultAvail.schedule.some(s => s.dayName === 'Monday'), 'Schedule contains Monday slot');

    // Set custom availability slots (authenticated educator)
    const setAvailRes = await fetch(`${BASE_URL}/api/teachers/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${educatorToken}`
      },
      body: JSON.stringify({
        slots: [
          { dayOfWeek: 1, startTime: '15:30', endTime: '18:30', sessionFormat: 'in_person' },
          { dayOfWeek: 3, startTime: '15:30', endTime: '18:30', sessionFormat: 'in_person' },
          { dayOfWeek: 6, startTime: '09:00', endTime: '13:00', sessionFormat: 'both' }
        ]
      })
    });
    const setAvailData = await setAvailRes.json();
    assert(setAvailRes.status === 200, 'POST /api/teachers/availability returns 200');
    assert(setAvailData.success === true, 'Availability set reports success: true');

    // Verify custom schedule retrieval
    const verifyAvailRes = await fetch(`${BASE_URL}/api/teachers/${testEducatorId}/availability`);
    const verifyAvail = await verifyAvailRes.json();
    assert(verifyAvail.totalSlots === 3, 'Educator schedule now reflects 3 custom slots');
    assert(verifyAvail.schedule.some(s => s.dayName === 'Saturday' && s.startTime === '09:00'), 'Saturday slot preserved with correct time');

    // ========================================================================
    // 6. PARENT & EDUCATOR BOOKING DOSSIER RETRIEVAL
    // ========================================================================
    console.log('\n--- Section 6: Parent & Educator Booking Dossiers ---');

    // Educator retrieves their bookings
    const educatorBookingsRes = await fetch(`${BASE_URL}/api/teachers/bookings/me`, {
      headers: { Authorization: `Bearer ${educatorToken}` }
    });
    const educatorBookings = await educatorBookingsRes.json();
    assert(educatorBookingsRes.status === 200, 'GET /api/teachers/bookings/me returns 200');
    assert(educatorBookings.success === true, 'Response reports success: true');
    assert(educatorBookings.total >= 3, `Educator has at least 3 bookings (found ${educatorBookings.total})`);

    // Parent retrieves their bookings
    const parentBookingsRes = await fetch(`${BASE_URL}/api/parents/bookings`, {
      headers: { Authorization: `Bearer ${parentToken}` }
    });
    const parentBookings = await parentBookingsRes.json();
    assert(parentBookingsRes.status === 200, 'GET /api/parents/bookings returns 200');
    assert(parentBookings.success === true, 'Response reports success: true');
    assert(parentBookings.bookings.some(b => b.id === bookingId), 'Parent bookings list includes scheduled booking');

    // Parent retrieves specific booking by ID
    const parentSingleRes = await fetch(`${BASE_URL}/api/parents/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${parentToken}` }
    });
    const parentSingle = await parentSingleRes.json();
    assert(parentSingleRes.status === 200, 'GET /api/parents/bookings/:id returns 200');
    assert(parentSingle.booking.booking_reference.startsWith('TUT-2026-'), 'Specific booking record returned with correct reference');

    // ========================================================================
    // TEST SUMMARY
    // ========================================================================
    console.log('\n======================================================');
    console.log(`RELEASE 4 TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('======================================================\n');

    if (failedTests > 0) {
      process.exit(1);
    }

  } catch (err) {
    console.error('Test run failed with error:', err);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
  }
}

runTests();
