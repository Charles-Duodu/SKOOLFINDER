/**
 * SkoolFinder Ghana — Tutoring & Mutual Consultation Booking Engine
 * Baseline: Blueprint v2.0 §14, §15, §16, §24, §26; DEC-004, DEC-005, DEC-010, DEC-025
 * Enforces:
 *   - Gate G4 Safeguarding: Adult-to-Adult Contracting & Consultation
 *   - 8-State Booking Machine (DEC-010)
 *   - Educator Availability Scheduling (AVA-01 to AVA-04)
 */

const { supabaseAdmin } = require('../config/supabase');
const EmailService = require('./emailService');

// In-Memory store for fast lookup and offline resilience
const IN_MEMORY_BOOKINGS = new Map();
const IN_MEMORY_AVAILABILITY = new Map(); // professionalId -> array of slots

const VALID_BOOKING_STATES = [
  'consultation_requested',
  'consultation_scheduled',
  'lesson_agreement_drafted',
  'escrow_funded',
  'session_confirmed',
  'session_conducted',
  'parent_signoff',
  'disbursed',
  'disputed',
  'cancelled'
];

class TutoringService {

  /**
   * Creates an Adult-to-Adult Educational Consultation / Booking (DEC-004, DEC-005, Gate G4)
   */
  static async createBooking(payload, parentUser = null) {
    const guardianAffirmation = payload.guardianAffirmation === true || 
                                payload.guardianAffirmation === 'true' ||
                                payload.guardian_affirmation === true ||
                                payload.guardian_affirmation === 'true';

    // Gate G4 Hard Safeguarding check
    if (!guardianAffirmation) {
      const err = new Error('Gate G4 Safeguarding Violation: Unaccompanied minor booking is prohibited. All educational consultations must be affirmed and scheduled by an adult guardian.');
      err.code = 'SAFEGUARDING_GATE_G4_BLOCKED';
      err.status = 403;
      throw err;
    }

    const teacherId = payload.teacherId || payload.professional_id || payload.teacher_id;
    if (!teacherId) {
      throw new Error('Educator ID is required to schedule a consultation.');
    }

    const now = new Date().toISOString();
    const referenceCode = `TUT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const bookingId = payload.id || `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const hourlyRate = Number(payload.hourlyRate || payload.hourly_rate || 80);
    const sessionsCount = Math.max(1, parseInt(payload.sessionsCount || payload.sessions_count || 1, 10));
    const totalAmount = hourlyRate * sessionsCount;

    const parentName = payload.parentName || payload.parent_name || parentUser?.full_name || 'Adult Guardian';
    const parentPhone = payload.phone || payload.parentPhone || parentUser?.phone || '+233 24 000 0000';
    const parentEmail = payload.email || payload.parentEmail || parentUser?.email || '';

    const booking = {
      id: bookingId,
      booking_reference: referenceCode,
      parent_user_id: parentUser?.id || payload.parent_user_id || null,
      parent_name: parentName,
      parent_phone: parentPhone,
      parent_email: parentEmail,
      ward_id: payload.wardId || payload.ward_id || null,
      student_name: payload.studentName || payload.student_name || 'Ward',
      student_grade: payload.gradeLevel || payload.studentLevel || payload.student_grade || 'Primary',
      professional_id: String(teacherId),
      teacher_name: payload.teacherName || payload.teacher_name || 'Verified Educator',
      subject: payload.subject || 'General Academic Tutoring',
      curriculum: payload.curriculum || 'GES',
      session_type: payload.sessionType || payload.session_type || 'in_person',
      hourly_rate: hourlyRate,
      sessions_count: sessionsCount,
      total_amount_ghs: totalAmount,
      scheduled_start: payload.scheduledStart || payload.scheduled_start || null,
      scheduled_end: payload.scheduledEnd || payload.scheduled_end || null,
      status: 'consultation_requested',
      escrow_status: 'unfunded',
      guardian_consent_verified: true,
      safeguarding_notice: 'Gate G4 Compliant: Adult-to-Adult consultation agreement between guardian and educator.',
      meeting_link: payload.meetingLink || payload.meeting_link || null,
      meeting_location: payload.meetingLocation || payload.meeting_location || payload.suburb || 'Accra',
      completion_notes: null,
      parent_rating: null,
      parent_feedback: null,
      cancellation_reason: null,
      created_at: now,
      updated_at: now
    };

    IN_MEMORY_BOOKINGS.set(bookingId, booking);

    // Persist to Supabase if valid UUID
    const isBookingUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookingId);
    if (isBookingUuid) {
      try {
        await supabaseAdmin.from('tutoring_bookings').insert(booking);
      } catch (e) {
        console.warn('Supabase tutoring_bookings insert notice:', e.message);
      }
    }

    // Dispatch email notifications
    if (payload.teacherEmail && payload.teacherEmail.includes('@')) {
      EmailService.sendTutorBookingAlert({
        to: payload.teacherEmail,
        tutorName: booking.teacher_name,
        parentName: booking.parent_name,
        parentPhone: booking.parent_phone,
        parentEmail: booking.parent_email,
        studentName: booking.student_name,
        subject: booking.subject,
        gradeLevel: booking.student_grade,
        sessionType: booking.session_type,
        preferredDays: payload.preferredDays || 'Mutual Agreement',
        message: payload.message || '',
        referenceCode: booking.booking_reference
      }).catch(err => console.warn('Email dispatch warning:', err.message));
    }

    return {
      success: true,
      booking,
      referenceCode,
      status: booking.status,
      contractType: 'adult_to_adult_consultation',
      gateG4SafeguardingNotice: booking.safeguarding_notice,
      message: `Tutoring consultation #${referenceCode} successfully created under Gate G4 Safeguarding.`
    };
  }

  /**
   * Transitions booking through the 8-state booking machine (DEC-010)
   */
  static async transitionBookingStatus(bookingId, targetStatus, actorUser = null, payload = {}) {
    if (!VALID_BOOKING_STATES.includes(targetStatus)) {
      throw new Error(`Invalid booking state: ${targetStatus}. Must be one of [${VALID_BOOKING_STATES.join(', ')}]`);
    }

    let booking = IN_MEMORY_BOOKINGS.get(bookingId);
    if (!booking) {
      try {
        const { data } = await supabaseAdmin
          .from('tutoring_bookings')
          .select('*')
          .eq('id', bookingId)
          .maybeSingle();
        if (data) booking = data;
      } catch (e) {}
    }

    if (!booking) {
      throw new Error('Booking dossier not found');
    }

    const previousStatus = booking.status;
    const now = new Date().toISOString();

    // Specific state machine transitions & validations (DEC-010)
    switch (targetStatus) {
      case 'consultation_scheduled':
        if (payload.scheduledStart) booking.scheduled_start = payload.scheduledStart;
        if (payload.scheduledEnd) booking.scheduled_end = payload.scheduledEnd;
        if (payload.meetingLink) booking.meeting_link = payload.meetingLink;
        if (payload.meetingLocation) booking.meeting_location = payload.meetingLocation;
        break;

      case 'lesson_agreement_drafted':
        if (payload.hourlyRate) booking.hourly_rate = Number(payload.hourlyRate);
        if (payload.sessionsCount) booking.sessions_count = Number(payload.sessionsCount);
        booking.total_amount_ghs = booking.hourly_rate * booking.sessions_count;
        break;

      case 'escrow_funded':
        booking.escrow_status = 'held_in_escrow';
        break;

      case 'session_confirmed':
        if (payload.meetingLink) booking.meeting_link = payload.meetingLink;
        if (payload.meetingLocation) booking.meeting_location = payload.meetingLocation;
        break;

      case 'session_conducted':
        booking.completion_notes = payload.completionNotes || payload.notes || 'Session successfully completed according to instructional plan.';
        break;

      case 'parent_signoff':
        booking.parent_rating = Math.min(5, Math.max(1, Number(payload.rating || 5)));
        booking.parent_feedback = payload.feedback || 'Guardian approved session completion.';
        break;

      case 'disbursed':
        booking.escrow_status = 'disbursed';
        break;

      case 'disputed':
        booking.escrow_status = 'disputed';
        booking.cancellation_reason = payload.reason || 'Dispute opened by guardian / educator';
        break;

      case 'cancelled':
        booking.cancellation_reason = payload.reason || 'Cancelled mutually by agreement';
        break;
    }

    booking.status = targetStatus;
    booking.updated_at = now;
    IN_MEMORY_BOOKINGS.set(bookingId, booking);

    // Persist to Supabase
    const isBookingUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookingId);
    if (isBookingUuid) {
      try {
        await supabaseAdmin
          .from('tutoring_bookings')
          .update({
            status: targetStatus,
            escrow_status: booking.escrow_status,
            scheduled_start: booking.scheduled_start,
            scheduled_end: booking.scheduled_end,
            hourly_rate: booking.hourly_rate,
            sessions_count: booking.sessions_count,
            total_amount_ghs: booking.total_amount_ghs,
            meeting_link: booking.meeting_link,
            meeting_location: booking.meeting_location,
            completion_notes: booking.completion_notes,
            parent_rating: booking.parent_rating,
            parent_feedback: booking.parent_feedback,
            cancellation_reason: booking.cancellation_reason,
            updated_at: now
          })
          .eq('id', bookingId);
      } catch (e) {}
    }

    return {
      success: true,
      booking,
      previousStatus,
      newStatus: targetStatus,
      message: `Booking #${booking.booking_reference} successfully updated to ${targetStatus.replace(/_/g, ' ').toUpperCase()}`
    };
  }

  /**
   * Retrieves bookings assigned to an educator
   */
  static async getEducatorBookings(educatorId, status = null) {
    let list = Array.from(IN_MEMORY_BOOKINGS.values()).filter(b => 
      String(b.professional_id) === String(educatorId)
    );

    try {
      let query = supabaseAdmin
        .from('tutoring_bookings')
        .select('*')
        .eq('professional_id', educatorId)
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        data.forEach(dbBook => {
          if (!list.some(b => b.id === dbBook.id)) {
            list.push(dbBook);
          }
        });
      }
    } catch (e) {}

    if (status) {
      list = list.filter(b => b.status === status);
    }

    return list;
  }

  /**
   * Retrieves bookings initiated by a parent
   */
  static async getParentBookings(parentId, phone = null) {
    let list = Array.from(IN_MEMORY_BOOKINGS.values()).filter(b => 
      (parentId && String(b.parent_user_id) === String(parentId)) ||
      (phone && b.parent_phone && b.parent_phone.replace(/\s+/g, '') === String(phone).replace(/\s+/g, ''))
    );

    try {
      let query = supabaseAdmin
        .from('tutoring_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (parentId) {
        query = query.eq('parent_user_id', parentId);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        data.forEach(dbBook => {
          if (!list.some(b => b.id === dbBook.id)) {
            list.push(dbBook);
          }
        });
      }
    } catch (e) {}

    return list;
  }

  /**
   * Retrieves educator weekly calendar availability schedule (AVA-01 to AVA-04)
   */
  static async getEducatorAvailability(educatorId) {
    let slots = IN_MEMORY_AVAILABILITY.get(String(educatorId)) || [];

    try {
      const { data, error } = await supabaseAdmin
        .from('professional_availability')
        .select('*')
        .eq('professional_id', educatorId)
        .eq('is_active', true);

      if (!error && Array.isArray(data) && data.length > 0) {
        slots = data;
        IN_MEMORY_AVAILABILITY.set(String(educatorId), slots);
      }
    } catch (e) {}

    // Default standard recurring slots if none configured
    if (slots.length === 0) {
      slots = [
        { day_of_week: 1, start_time: '16:00', end_time: '19:00', session_format: 'both' }, // Mon
        { day_of_week: 2, start_time: '16:00', end_time: '19:00', session_format: 'both' }, // Tue
        { day_of_week: 3, start_time: '16:00', end_time: '19:00', session_format: 'both' }, // Wed
        { day_of_week: 4, start_time: '16:00', end_time: '19:00', session_format: 'both' }, // Thu
        { day_of_week: 5, start_time: '16:00', end_time: '19:00', session_format: 'both' }, // Fri
        { day_of_week: 6, start_time: '09:00', end_time: '16:00', session_format: 'in_person' } // Sat
      ];
    }

    const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return {
      professionalId: educatorId,
      totalSlots: slots.length,
      schedule: slots.map(s => ({
        dayOfWeek: Number(s.day_of_week),
        dayName: DAY_NAMES[Number(s.day_of_week)] || 'Weekday',
        startTime: s.start_time,
        endTime: s.end_time,
        sessionFormat: s.session_format || 'both'
      }))
    };
  }

  /**
   * Updates educator weekly availability slots (AVA-02)
   */
  static async setEducatorAvailability(educatorId, slots = []) {
    if (!Array.isArray(slots)) {
      throw new Error('Slots must be an array of recurring schedule items.');
    }

    const cleanedSlots = slots.map(s => ({
      professional_id: String(educatorId),
      day_of_week: Number(s.dayOfWeek ?? s.day_of_week ?? 1),
      start_time: s.startTime || s.start_time || '16:00',
      end_time: s.endTime || s.end_time || '18:00',
      session_format: s.sessionFormat || s.session_format || 'both',
      is_active: true
    }));

    IN_MEMORY_AVAILABILITY.set(String(educatorId), cleanedSlots);

    try {
      await supabaseAdmin
        .from('professional_availability')
        .delete()
        .eq('professional_id', educatorId);

      if (cleanedSlots.length > 0) {
        await supabaseAdmin
          .from('professional_availability')
          .insert(cleanedSlots);
      }
    } catch (e) {}

    return {
      success: true,
      message: 'Weekly availability schedule updated successfully.',
      availability: await this.getEducatorAvailability(educatorId)
    };
  }
}

module.exports = TutoringService;

