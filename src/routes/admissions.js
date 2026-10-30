const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const EmailService = require('../services/emailService');

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
    const schoolId = data.schoolId || '00000000-0000-0000-0000-000000000001';

    // Store in enquiries table as formal admission
    const isSchoolUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(schoolId);
    const targetRecipientId = isSchoolUuid ? schoolId : '00000000-0000-0000-0000-000000000001';

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
Parent Contact: ${data.parentName || 'Parent'} (${data.parentPhone || data.phone || 'Phone unstated'})
Previous School: ${data.previousSchool || 'N/A'}
Submitted At: ${new Date().toISOString()}
        `.trim(),
        status: 'pending'
      });

    console.log(`[ADMISSIONS] Application #${applicationNumber} submitted for ${applicantName}`);

    // Dispatch formal application confirmation to parent
    const parentEmail = data.parentEmail || data.email;
    if (parentEmail && parentEmail.includes('@')) {
      EmailService.sendParentApplicationConfirmation({
        to: parentEmail,
        parentName: data.parentName || 'Parent / Guardian',
        schoolName: data.schoolName || 'Accredited Institution',
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
 * GET /api/admissions
 */
router.get('/', async (req, res) => {
  return res.json([
    {
      id: 'app-01',
      applicationNumber: 'SF-ADM-2026-782194',
      studentName: 'Nana Yaa Boateng',
      gradeApplying: 'Primary Class 4',
      parentName: 'Kwame Boateng',
      parentPhone: '+233 24 455 1290',
      status: 'Entrance Exam Scheduled',
      submittedAt: new Date().toISOString()
    }
  ]);
});

module.exports = router;

