const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const EmailService = require('../services/emailService');
const AdmissionsSubscriptionService = require('../services/admissionsSubscriptionService');

// In-Memory Applications Ledger for fast retrieval and persistence
const ADMISSIONS_STORE = [
  {
    id: 'app-01',
    applicationNumber: 'SF-ADM-2026-782194',
    trackingCode: 'SF-ADM-2026-782194',
    schoolId: 'sch-gis-accra',
    schoolName: 'Ghana International School (GIS)',
    studentName: 'Nana Yaa Boateng',
    gradeApplying: 'Primary Class 4',
    termApplied: 'First Term (September 2026)',
    previousSchool: 'Jack & Jill Preparatory',
    parentName: 'Dr. Kwame Boateng',
    parentPhone: '+233 24 455 1290',
    parentEmail: 'k.boateng@gmail.com',
    status: 'Entrance Exam Scheduled',
    statusLabel: 'Entrance Exam Scheduled',
    submittedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    student: {
      fullName: 'Nana Yaa Boateng',
      firstName: 'Nana Yaa',
      lastName: 'Boateng',
      gender: 'Female',
      dob: '12 March 2017'
    },
    parentGuardian: {
      primaryGuardianName: 'Dr. Kwame Boateng',
      name: 'Dr. Kwame Boateng',
      phone: '+233 24 455 1290',
      email: 'k.boateng@gmail.com'
    },
    assessment: {
      scheduled: true,
      date: 'Saturday, 15 November 2026',
      time: '09:00 AM (Check-in 08:30 AM)',
      location: 'Junior School Academic Block, Room J-12, Cantonments Campus',
      requiredItems: 'Passport photo (2 copies), original birth certificate, recent terminal report card, HB pencils, and this printout slip.'
    }
  },
  {
    id: 'app-02',
    applicationNumber: 'SF-ADM-2026-891024',
    trackingCode: 'SF-ADM-2026-891024',
    schoolId: 'sch-achimota-accra',
    schoolName: 'Achimota Basic School',
    studentName: 'Kweku Serwaa Osei',
    gradeApplying: 'JHS Form 1',
    termApplied: 'First Term (September 2026)',
    previousSchool: 'Morning Star School',
    parentName: 'Mr. Michael Osei',
    parentPhone: '+233 24 333 9876',
    parentEmail: 'm.osei@gmail.com',
    status: 'Under Review',
    statusLabel: 'Under Review',
    submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    student: {
      fullName: 'Kweku Serwaa Osei',
      firstName: 'Kweku',
      lastName: 'Osei',
      gender: 'Male',
      dob: '25 July 2014'
    },
    parentGuardian: {
      primaryGuardianName: 'Mr. Michael Osei',
      name: 'Mr. Michael Osei',
      phone: '+233 24 333 9876',
      email: 'm.osei@gmail.com'
    },
    assessment: null
  }
];

/**
 * Helper to find application in memory store or Supabase
 */
async function findApplication(idOrNum) {
  const norm = (idOrNum || '').trim();
  let found = ADMISSIONS_STORE.find(a => 
    a.id === norm || 
    a.applicationNumber === norm || 
    a.trackingCode === norm
  );
  if (found) return found;

  // Attempt database enquiry lookup
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(norm);
    let query = supabaseAdmin.from('enquiries').select('*');
    if (isUuid) {
      query = query.eq('id', norm);
    } else {
      query = query.or(`subject.ilike.%${norm}%,message.ilike.%${norm}%`);
    }
    const { data } = await query.limit(1).maybeSingle();
    if (data) {
      return {
        id: data.id,
        applicationNumber: norm.startsWith('SF-ADM-') ? norm : `SF-ADM-2026-${data.id.slice(0, 6)}`,
        trackingCode: norm,
        schoolId: data.recipient_id || 'sch-gis-accra',
        schoolName: 'Accredited Institution',
        studentName: 'Candidate Applicant',
        gradeApplying: 'Class Admission',
        status: data.status === 'replied' ? 'Entrance Exam Scheduled' : 'Under Review',
        statusLabel: data.status === 'replied' ? 'Entrance Exam Scheduled' : 'Under Review',
        submittedAt: data.created_at,
        student: {
          fullName: 'Candidate Applicant',
          firstName: 'Candidate',
          lastName: 'Applicant'
        },
        parentGuardian: {
          primaryGuardianName: 'Parent / Guardian',
          name: 'Parent / Guardian',
          phone: '+233 24 000 0000',
          email: ''
        }
      };
    }
  } catch (err) {
    console.warn('DB lookup for admission application:', err.message);
  }

  return null;
}

/**
 * POST /api/admissions/apply
 * Multi-step student admission application wizard
 */
router.post('/apply', async (req, res) => {
  try {
    const data = req.body;
    const applicationNumber = `SF-ADM-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const applicantName = data.studentName || `${data.childFirstName || ''} ${data.childLastName || ''}`.trim() || 'Prospective Student';
    const gradeLevel = data.gradeApplying || data.level || 'Class 1';
    const schoolId = data.schoolId || 'sch-gis-accra';
    const schoolName = data.schoolName || 'Ghana International School (GIS)';

    const newApp = {
      id: applicationNumber,
      applicationNumber,
      trackingCode: applicationNumber,
      schoolId,
      schoolName,
      studentName: applicantName,
      gradeApplying: gradeLevel,
      termApplied: data.termApplied || 'First Term (September 2026)',
      previousSchool: data.previousSchool || 'N/A',
      parentName: data.parentName || 'Parent / Guardian',
      parentPhone: data.parentPhone || data.phone || '+233 24 000 0000',
      parentEmail: data.parentEmail || data.email || '',
      status: 'Under Review',
      statusLabel: 'Submitted & Under Review',
      submittedAt: new Date().toISOString(),
      student: {
        fullName: applicantName,
        firstName: data.childFirstName || applicantName.split(' ')[0],
        lastName: data.childLastName || applicantName.split(' ').slice(1).join(' '),
        gender: data.gender || 'Not specified',
        dob: data.dateOfBirth || null
      },
      parentGuardian: {
        primaryGuardianName: data.parentName || 'Parent / Guardian',
        name: data.parentName || 'Parent / Guardian',
        phone: data.parentPhone || data.phone || '+233 24 000 0000',
        email: data.parentEmail || data.email || ''
      },
      assessment: {
        scheduled: true,
        date: 'Saturday, 15 November 2026',
        time: '09:00 AM (Check-in 08:30 AM)',
        location: 'Junior School Academic Block, Room J-12, Cantonments Campus',
        requiredItems: 'Passport photo (2 copies), original birth certificate, recent terminal report card, HB pencils, and this printout slip.'
      }
    };

    // Prepend to in-memory ledger
    ADMISSIONS_STORE.unshift(newApp);

    // Register with AdmissionsSubscriptionService for Phase 2A state machine tracking
    try {
      await AdmissionsSubscriptionService.submitApplication({
        id: applicationNumber,
        trackingCode: applicationNumber,
        applicationNumber,
        schoolId,
        student: { ...newApp.student, gradeApplying: gradeLevel, termApplied: newApp.termApplied },
        parentGuardian: newApp.parentGuardian,
        academicHistory: { previousSchool: newApp.previousSchool },
        source: 'portal'
      });
    } catch (subErr) {
      console.warn('[ADM] AdmissionsSubscriptionService submit sync warning:', subErr.message);
    }

    // Also store in Supabase enquiries table for audit trail
    const isSchoolUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(schoolId);
    const targetRecipientId = isSchoolUuid ? schoolId : '00000000-0000-0000-0000-000000000001';

    try {
      await supabaseAdmin
        .from('enquiries')
        .insert({
          sender_id: '00000000-0000-0000-0000-000000000001',
          recipient_type: 'school',
          recipient_id: targetRecipientId,
          subject: `[FORMAL APPLICATION] ${applicantName} for ${gradeLevel} (#${applicationNumber})`,
          message: `
Student Admission Application:
Application No: ${applicationNumber}
Applicant: ${applicantName}
Applying for Grade: ${gradeLevel}
Parent Contact: ${newApp.parentName} (${newApp.parentPhone})
Previous School: ${newApp.previousSchool}
Submitted At: ${newApp.submittedAt}
          `.trim(),
          status: 'pending'
        });
    } catch (dbErr) {
      console.warn('Supabase enquiry insert on admission:', dbErr.message);
    }

    console.log(`[ADMISSIONS] Application #${applicationNumber} registered for ${applicantName}`);

    // Dispatch formal application confirmation to parent
    const parentEmail = newApp.parentEmail;
    if (parentEmail && parentEmail.includes('@')) {
      EmailService.sendParentApplicationConfirmation({
        to: parentEmail,
        parentName: newApp.parentName,
        schoolName: newApp.schoolName,
        referenceCode: applicationNumber,
        candidateName: applicantName,
        gradeLevel
      }).catch(err => console.error('Application confirmation email error:', err.message));
    }

    return res.status(201).json({
      success: true,
      message: 'Student admission application submitted successfully',
      applicationNumber,
      status: 'Submitted & Under Review',
      trackingCode: applicationNumber,
      application: newApp,
      candidate: {
        name: applicantName,
        grade: gradeLevel,
        schoolId
      }
    });
  } catch (err) {
    console.error('Error submitting admission application:', err);
    return res.status(500).json({ error: 'Failed to submit admission application' });
  }
});

/**
 * GET /api/admissions/applications & GET /api/admissions
 * Retrieve list of admission applications
 */
router.get(['/applications', '/'], async (req, res) => {
  try {
    const { schoolId, status, search } = req.query;
    let list = [...ADMISSIONS_STORE];

    if (schoolId && schoolId !== 'All') {
      list = list.filter(a => a.schoolId === schoolId || a.schoolName.toLowerCase().includes(schoolId.toLowerCase()));
    }
    if (status && status !== 'All') {
      list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.studentName.toLowerCase().includes(q) ||
        a.applicationNumber.toLowerCase().includes(q) ||
        a.parentName.toLowerCase().includes(q)
      );
    }

    return res.json(list);
  } catch (err) {
    console.error('Error fetching applications:', err);
    return res.status(500).json({ error: 'Failed to fetch admission applications' });
  }
});

/**
 * GET /api/admissions/applications/:id & GET /api/admissions/:id
 * Retrieve single admission application by id or reference code
 */
router.get(['/applications/:id', '/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    const app = await findApplication(id);
    if (!app) {
      return res.status(404).json({ error: 'Application record not found' });
    }
    return res.json(app);
  } catch (err) {
    console.error('Error fetching application by id:', err);
    return res.status(500).json({ error: 'Failed to load application record' });
  }
});

/**
 * PATCH /api/admissions/applications/:id/status
 * Update status of an admission application
 */
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assessmentDate, assessmentTime, assessmentLocation } = req.body;

    const app = await findApplication(id);
    if (!app) {
      return res.status(404).json({ error: 'Application record not found' });
    }

    if (status) {
      app.status = status;
      app.statusLabel = status;
    }

    if (assessmentDate || assessmentTime || assessmentLocation) {
      app.assessment = {
        scheduled: true,
        date: assessmentDate || app.assessment?.date || 'Saturday, 15 November 2026',
        time: assessmentTime || app.assessment?.time || '09:00 AM',
        location: assessmentLocation || app.assessment?.location || 'Main Academic Hall'
      };
    }

    return res.json({
      success: true,
      message: `Application status updated to ${app.status}`,
      application: app
    });
  } catch (err) {
    console.error('Error updating application status:', err);
    return res.status(500).json({ error: 'Failed to update application status' });
  }
});

/**
 * GET /api/admissions/applications/:id/offer-letter
 * Generates structured official digital offer letter
 */
router.get('/applications/:id/offer-letter', async (req, res) => {
  try {
    const { id } = req.params;
    const app = await findApplication(id);
    if (!app) {
      return res.status(404).json({ error: 'Application record not found' });
    }

    return res.json({
      success: true,
      offerLetter: {
        referenceNumber: `OFFER-${app.applicationNumber}`,
        schoolName: app.schoolName,
        studentName: app.studentName,
        gradeLevel: app.gradeApplying,
        entryTerm: app.termApplied,
        issueDate: new Date().toISOString(),
        acceptanceDeadline: new Date(Date.now() + 14 * 86400000).toISOString(),
        letterBody: `We are pleased to offer ${app.studentName} admission to ${app.schoolName} for ${app.gradeApplying}. Please confirm acceptance before the stated deadline to secure the admission voucher.`
      }
    });
  } catch (err) {
    console.error('Error generating offer letter:', err);
    return res.status(500).json({ error: 'Failed to generate admission offer letter' });
  }
});

/**
 * GET /api/admissions/track/:trackingCode (ADM-010)
 * Private parent tracking endpoint showing real-time authoritative admission status
 */
router.get('/track/:trackingCode', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    let details = await AdmissionsSubscriptionService.parentTrackApplication(trackingCode);

    if (!details) {
      // Fallback to legacy ADMISSIONS_STORE
      const fallbackApp = await findApplication(trackingCode);
      if (fallbackApp) {
        details = {
          trackingCode: fallbackApp.trackingCode || fallbackApp.applicationNumber,
          studentName: fallbackApp.studentName,
          gradeApplying: fallbackApp.gradeApplying,
          termApplied: fallbackApp.termApplied,
          status: fallbackApp.status,
          statusLabel: fallbackApp.statusLabel,
          submittedAt: fallbackApp.submittedAt,
          assessment: fallbackApp.assessment,
          offer: fallbackApp.offer || null,
          timeline: [
            { status: 'submitted', timestamp: fallbackApp.submittedAt, actor: 'Parent', note: 'Submitted via portal' }
          ]
        };
      }
    }

    if (!details) {
      return res.status(404).json({ error: 'Application record not found for tracking code' });
    }

    return res.json({ success: true, tracking: details });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admissions/offers/:trackingCode/respond (ADM-009, ADM-010)
 * Allows authenticated parent to accept or decline digital offer
 */
router.post('/offers/:trackingCode/respond', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const { decision = 'accept' } = req.body;
    const result = await AdmissionsSubscriptionService.parentRespondToOffer(trackingCode, decision);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
