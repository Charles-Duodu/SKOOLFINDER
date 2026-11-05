/**
 * Automated Verification Suite: Package B — School Tour Scheduling & Confirmation Management
 * Baseline: Blueprint v2.0 Section 26.3, Parents Blueprint v4.2 & Master Guide v1.0
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const AdmissionsSubscriptionService = require('../src/services/admissionsSubscriptionService');
const { NotificationEventBus } = require('../src/services/notificationEventBus');
const EmailService = require('../src/services/emailService');

async function runPackageBTests() {
  console.log('========================================================================');
  console.log('🚀 RUNNING PACKAGE B: CAMPUS TOUR SCHEDULING & CONFIRMATION MANAGEMENT');
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

  const schoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6'; // GIS Canonical UUID
  const freeSchoolId = 'school-free-starter-test';

  // Ensure schoolId is on active Growth subscription for test harness
  await AdmissionsSubscriptionService.verifySubscriptionPayment(schoolId, {
    tier: 'growth',
    interval: 'monthly',
    channel: 'mobile_money',
    reference: `SF-TEST-GROWTH-${Date.now()}`
  });

  // 1. Initial Seed Data Verification
  await test('1. Service loads initial seed tour slots and public Open Days', async () => {
    const slots = await AdmissionsSubscriptionService.getTourSlots(schoolId);
    assert.ok(Array.isArray(slots), 'Slots must be an array');
    assert.ok(slots.length >= 2, 'Should have at least 2 seed slots (walkthrough + open day)');

    const openDays = await AdmissionsSubscriptionService.getOpenDays(schoolId);
    assert.ok(openDays.length >= 1, 'Should have at least 1 public open day');
    const od = openDays.find(s => s.type === 'open_day');
    assert.ok(od, 'Open Day event must have type open_day');
    assert.ok(od.title.includes('Open Day'), 'Open day title must mention Open Day');
  });

  // 2. Entitlement Gating Verification (Free vs Growth+)
  await test('2. Entitlement Guard rejects Free tier tour creation and allows Growth+', async () => {
    // Free school creation should throw UPGRADE_REQUIRED
    let errorCaught = false;
    try {
      await AdmissionsSubscriptionService.createTourSlot(freeSchoolId, {
        title: 'Walkthrough Slot on Free Plan',
        slotDate: '2026-12-01',
        slotTime: '10:00 AM'
      });
    } catch (err) {
      errorCaught = true;
      assert.strictEqual(err.code, 'UPGRADE_REQUIRED', 'Error code must be UPGRADE_REQUIRED');
      assert.strictEqual(err.requiredTier, 'growth', 'Required tier must be growth');
    }
    assert.ok(errorCaught, 'Free school should be blocked from creating tour slot');

    // Growth school creation succeeds
    const createdSlot = await AdmissionsSubscriptionService.createTourSlot(schoolId, {
      title: 'Senior High Cambridge Physics Lab Walkthrough',
      type: 'tour',
      slotDate: '2026-12-05',
      slotTime: '11:00 AM',
      endTime: '12:30 PM',
      venue: 'GIS Senior Science Complex',
      capacity: 8,
      targetGrades: 'SHS 1 - 3'
    });
    assert.ok(createdSlot && createdSlot.id, 'Slot must be created with ID');
    assert.strictEqual(createdSlot.capacity, 8);
    assert.strictEqual(createdSlot.booked_count, 0);

    // Clean up created slot
    await AdmissionsSubscriptionService.deleteTourSlot(schoolId, createdSlot.id);
  });

  // 3. Tour Booking & Capacity Enforcement
  let testBookingSlotId = null;
  let testBookingId = null;
  await test('3. Parent tour slot booking and capacity limit enforcement', async () => {
    // Create a mini slot with capacity 1
    const slot = await AdmissionsSubscriptionService.createTourSlot(schoolId, {
      title: 'Limited Capacity Robotics Lab Tour',
      type: 'tour',
      slotDate: '2026-12-10',
      slotTime: '02:00 PM',
      venue: 'Innovation Hub',
      capacity: 1
    });
    testBookingSlotId = slot.id;

    // Booking 1 succeeds
    const bookingRes = await AdmissionsSubscriptionService.bookTourSlot(schoolId, slot.id, {
      parentName: 'Mrs. Abigail Mensah',
      parentPhone: '+233 24 555 7788',
      parentEmail: 'abigail.mensah@example.com',
      childName: 'Kofi Mensah',
      childGrade: 'Primary 5',
      notes: 'Interested in coding club and robotics'
    });

    assert.ok(bookingRes.success, 'Booking must succeed');
    assert.strictEqual(bookingRes.slot.booked_count, 1);
    testBookingId = bookingRes.booking.bookingId;
    assert.ok(testBookingId, 'Booking must have bookingId');
    assert.strictEqual(bookingRes.booking.status, 'pending');

    // Booking 2 fails due to capacity 1 limit
    let overbookedError = false;
    try {
      await AdmissionsSubscriptionService.bookTourSlot(schoolId, slot.id, {
        parentName: 'Mr. John Doe',
        parentPhone: '+233 20 111 2233',
        childGrade: 'Primary 5'
      });
    } catch (e) {
      overbookedError = true;
      assert.ok(e.message.includes('fully booked'), 'Must reject when capacity is full');
    }
    assert.ok(overbookedError, 'Overbooking must be rejected');
  });

  // 4. Inbound Tour Requests Desk & Booking Ledger
  await test('4. getTourBookings retrieves all flattened bookings across school slots', async () => {
    const bookings = await AdmissionsSubscriptionService.getTourBookings(schoolId);
    assert.ok(Array.isArray(bookings), 'Bookings must be an array');
    assert.ok(bookings.length >= 3, 'Should have multiple bookings');

    const foundTestBooking = bookings.find(b => b.bookingId === testBookingId);
    assert.ok(foundTestBooking, 'Newly created test booking must be present in ledger');
    assert.strictEqual(foundTestBooking.parentName, 'Mrs. Abigail Mensah');
    assert.strictEqual(foundTestBooking.status, 'pending');
  });

  // 5. Proprietor Confirmation Action & Host Staff Assignment
  await test('5. updateTourBooking confirms appointment, assigns host staff, and triggers notifications', async () => {
    const updateRes = await AdmissionsSubscriptionService.updateTourBooking(schoolId, testBookingSlotId, testBookingId, {
      status: 'confirmed',
      hostStaff: 'Mr. Ebenezer Mensah (Senior Admissions Officer)',
      slotDate: '2026-12-10',
      slotTime: '02:00 PM',
      venue: 'Innovation Hub Reception',
      notes: 'Please bring student report card and photo ID.'
    });

    assert.ok(updateRes.success, 'Update must succeed');
    assert.strictEqual(updateRes.booking.status, 'confirmed');
    assert.strictEqual(updateRes.booking.hostStaff, 'Mr. Ebenezer Mensah (Senior Admissions Officer)');
    assert.strictEqual(updateRes.booking.notes, 'Please bring student report card and photo ID.');
  });

  // 6. Reschedule, Cancel, and Complete Lifecycles
  await test('6. updateTourBooking handles reschedule, completion, and cancellation', async () => {
    // Reschedule
    const resched = await AdmissionsSubscriptionService.updateTourBooking(schoolId, testBookingSlotId, testBookingId, {
      status: 'rescheduled',
      slotDate: '2026-12-12',
      slotTime: '03:00 PM',
      notes: 'Rescheduled due to science fair prep.'
    });
    assert.strictEqual(resched.booking.status, 'rescheduled');
    assert.strictEqual(resched.booking.slotDate, '2026-12-12');

    // Complete
    const completed = await AdmissionsSubscriptionService.updateTourBooking(schoolId, testBookingSlotId, testBookingId, {
      status: 'completed'
    });
    assert.strictEqual(completed.booking.status, 'completed');

    // Cancel and capacity decrement check
    const cancelled = await AdmissionsSubscriptionService.updateTourBooking(schoolId, testBookingSlotId, testBookingId, {
      status: 'cancelled'
    });
    assert.strictEqual(cancelled.booking.status, 'cancelled');
    assert.strictEqual(cancelled.slot.booked_count, 0, 'Capacity should decrement on cancellation');

    // Clean up test slot
    await AdmissionsSubscriptionService.deleteTourSlot(schoolId, testBookingSlotId);
  });

  // 7. Multi-Channel Event Bus & Notification Simulation
  await test('7. NotificationEventBus dispatches TourBookingUpdated across channels', async () => {
    const report = await NotificationEventBus.publish('TourBookingUpdated', schoolId, {
      bookingId: 'bk-tour-001',
      schoolName: 'Ghana International School',
      parentName: 'Dr. Kwame Boateng',
      parentPhone: '+233244551290',
      parentEmail: 'k.boateng@gmail.com',
      childGrade: 'Primary 4',
      status: 'confirmed',
      hostStaff: 'Ebenezer Mensah (Admissions Officer)',
      slotDate: '2026-11-18',
      slotTime: '10:00 AM',
      venue: 'Main Administration Block',
      notes: 'Report to security post.'
    }, {
      recipientPhone: '+233244551290',
      recipientEmail: 'k.boateng@gmail.com',
      recipientName: 'Dr. Kwame Boateng'
    });

    assert.ok(report && report.eventId, 'Report must contain eventId');
    assert.strictEqual(report.eventName, 'TourBookingUpdated');
    assert.strictEqual(report.channels.email.success, true, 'Email channel must succeed');
    assert.strictEqual(report.channels.sms.attempted, true, 'SMS channel must be attempted');
  });

  // 8. Public Open Day Publisher
  await test('8. createOpenDay publishes public open days for Growth+ schools', async () => {
    const openDay = await AdmissionsSubscriptionService.createOpenDay(schoolId, {
      title: 'Spring STEM Showcase & Open House',
      slotDate: '2027-02-15',
      slotTime: '09:00 AM',
      endTime: '01:00 PM',
      venue: 'GIS Innovation Amphitheatre',
      capacity: 100,
      targetGrades: 'All Grades',
      description: 'Hands-on science demonstrations, music concerts, and admissions counseling.'
    });

    assert.ok(openDay && openDay.id, 'Open day must be created');
    assert.strictEqual(openDay.type, 'open_day');
    assert.strictEqual(openDay.capacity, 100);

    const openDays = await AdmissionsSubscriptionService.getOpenDays(schoolId);
    assert.ok(openDays.some(od => od.id === openDay.id), 'Newly published open day must be retrievable');

    // Clean up
    await AdmissionsSubscriptionService.deleteTourSlot(schoolId, openDay.id);
  });

  // 9. Client API Wiring
  await test('9. public/js/api.js exposes tour bookings and open days API methods', async () => {
    const apiCode = fs.readFileSync(path.resolve('public/js/api.js'), 'utf8');
    assert.ok(apiCode.includes('getSchoolTourBookings(schoolId)'), 'api.js must have getSchoolTourBookings');
    assert.ok(apiCode.includes('updateSchoolTourBooking(schoolId, slotId, bookingId, updateData)'), 'api.js must have updateSchoolTourBooking');
    assert.ok(apiCode.includes('deleteSchoolTourSlot(schoolId, slotId)'), 'api.js must have deleteSchoolTourSlot');
    assert.ok(apiCode.includes('getSchoolOpenDays(schoolId)'), 'api.js must have getSchoolOpenDays');
    assert.ok(apiCode.includes('createSchoolOpenDay(schoolId, openDayData)'), 'api.js must have createSchoolOpenDay');
  });

  // 10. Modals Integration
  await test('10. public/js/components/modals.js defines interactive tour management modals', async () => {
    const modalsCode = fs.readFileSync(path.resolve('public/js/components/modals.js'), 'utf8');
    assert.ok(modalsCode.includes('openConfirmTourBookingModal(booking, school, onConfirmed)'), 'modals.js must define openConfirmTourBookingModal');
    assert.ok(modalsCode.includes('openRescheduleTourModal(booking, school, onRescheduled)'), 'modals.js must define openRescheduleTourModal');
    assert.ok(modalsCode.includes('openCreateTourSlotModal(schoolId, onCreated, defaultType = \'tour\')'), 'modals.js must define openCreateTourSlotModal');
  });

  // 11. School Owner Dashboard Integration
  await test('11. dashboardView.js renders Operational Tour Requests Desk and Entitlement Guards', async () => {
    const dashCode = fs.readFileSync(path.resolve('public/js/views/dashboardView.js'), 'utf8');
    assert.ok(dashCode.includes('Inbound Campus Tour Requests & Confirmations'), 'dashboardView.js must render Tour Requests Desk');
    assert.ok(dashCode.includes('tour-status-filters'), 'dashboardView.js must render tour-status-filters');
    assert.ok(dashCode.includes('btn-confirm-tour'), 'dashboardView.js must wire btn-confirm-tour');
    assert.ok(dashCode.includes('btn-reschedule-tour'), 'dashboardView.js must wire btn-reschedule-tour');
    assert.ok(dashCode.includes('btn-create-open-day'), 'dashboardView.js must wire btn-create-open-day');
    assert.ok(dashCode.includes('Interactive Tour Scheduling & Automated Parent Notifications (Growth Plan Feature)'), 'dashboardView.js must render free plan upgrade banner');
  });

  // 12. Public School Detail Profile Display
  await test('12. schoolDetailView.js surfaces published Open Days and guided tours with RSVP', async () => {
    const detailCode = fs.readFileSync(path.resolve('public/js/views/schoolDetailView.js'), 'utf8');
    assert.ok(detailCode.includes('PACKAGE B: UPCOMING PUBLIC OPEN DAYS & GUIDED TOURS SHOWCASE'), 'schoolDetailView.js must include tours showcase');
    assert.ok(detailCode.includes('btn-rsvp-tour-slot'), 'schoolDetailView.js must have RSVP buttons');
    assert.ok(detailCode.includes('Package B: RSVP / Book Specific Tour Slot'), 'schoolDetailView.js must attach event to RSVP button');
  });

  // 13. Cache Buster Update in index.html
  await test('13. public/index.html includes cache-busters for updated scripts', async () => {
    const html = fs.readFileSync(path.resolve('public/index.html'), 'utf8');
    assert.ok(/src="\/js\/api\.js\?v=(7[0-9]|[8-9][0-9])"/.test(html), 'api.js must have cache-buster >= v=70');
    assert.ok(/src="\/js\/components\/modals\.js\?v=(7[0-9]|[8-9][0-9])"/.test(html), 'modals.js must have cache-buster >= v=70');
    assert.ok(/src="\/js\/views\/dashboardView\.js\?v=(7[0-9]|[8-9][0-9])"/.test(html), 'dashboardView.js must have cache-buster >= v=70');
    assert.ok(/src="\/js\/views\/schoolDetailView\.js\?v=(7[0-9]|[8-9][0-9])"/.test(html), 'schoolDetailView.js must have cache-buster >= v=70');
  });

  console.log(`\n========================================================================`);
  console.log(`PACKAGE B VERIFICATION COMPLETE: ${passed} / ${total} TESTS PASSED (100%)`);
  console.log(`========================================================================\n`);
}

runPackageBTests().catch(err => {
  console.error('\nTest suite failed with error:', err);
  process.exit(1);
});
