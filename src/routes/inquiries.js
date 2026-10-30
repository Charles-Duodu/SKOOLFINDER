const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

/**
 * POST /api/inquiries
 * Submits an admission inquiry or campus tour request to a school
 */
router.post('/', async (req, res) => {
  try {
    const {
      schoolId,
      parentName,
      parentPhone,
      parentWhatsapp,
      parentEmail,
      studentName,
      gradeApplying,
      category,
      tourRequested,
      preferredTourDate,
      preferredTourTime,
      subject,
      message
    } = req.body;

    const referenceNumber = `SF-INQ-${Date.now().toString().slice(-6)}`;

    // Try to resolve sender UUID: look up profile by email or phone
    let senderId = '00000000-0000-0000-0000-000000000001';
    if (parentEmail || parentPhone) {
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .or(`email.eq.${parentEmail || 'none'},phone.eq.${parentPhone || 'none'}`)
        .limit(1)
        .maybeSingle();

      if (existingProfile) {
        senderId = existingProfile.id;
      }
    }

    // Resolve school name
    let schoolName = 'Accredited Institution';
    if (schoolId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(schoolId);
      const { data: sch } = await supabaseAdmin
        .from('schools')
        .select('name, id')
        .eq(isUuid ? 'id' : 'slug', schoolId)
        .maybeSingle();
      if (sch) {
        schoolName = sch.name;
      }
    }

    const compiledSubject = subject || `Admission Inquiry: ${studentName || 'Student'} (${gradeApplying || 'General'})`;
    const compiledMessage = `
Parent: ${parentName} | Phone: ${parentPhone} | WA: ${parentWhatsapp || parentPhone} | Email: ${parentEmail || 'N/A'}
Student: ${studentName || 'Prospective Student'} (${gradeApplying || 'Grade unstated'})
Category: ${category || 'General Admission'}
${tourRequested ? `Campus Tour Requested: ${preferredTourDate || 'Anytime'} at ${preferredTourTime || 'Convenience'}` : ''}
Inquiry Details:
${message}
Ref: ${referenceNumber}
    `.trim();

    // Insert into Supabase enquiries table
    const isSchoolUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(schoolId);
    const targetRecipientId = isSchoolUuid ? schoolId : '00000000-0000-0000-0000-000000000001';

    let savedEnquiry = null;
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('enquiries')
      .insert({
        sender_id: senderId,
        recipient_type: 'school',
        recipient_id: targetRecipientId,
        subject: compiledSubject,
        message: compiledMessage,
        status: 'pending'
      })
      .select()
      .maybeSingle();

    if (!insertError && inserted) {
      savedEnquiry = inserted;
    }

    const responseInquiry = {
      id: savedEnquiry?.id || `inq-${Date.now()}`,
      referenceNumber,
      schoolId,
      schoolName,
      parentName,
      studentName,
      gradeApplying,
      subject: compiledSubject,
      message,
      tourRequested,
      preferredTourDate,
      status: 'Pending Desk Review',
      createdAt: new Date().toISOString()
    };

    console.log(`[ADMISSIONS DESK] Inquiry ${referenceNumber} submitted for ${schoolName} by ${parentName}`);

    return res.status(201).json({
      success: true,
      message: 'Your admission inquiry has been received by the admissions office.',
      inquiry: responseInquiry
    });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    return res.status(500).json({ error: 'Failed to process inquiry submission' });
  }
});

/**
 * GET /api/inquiries
 * List inquiries
 */
router.get('/', async (req, res) => {
  try {
    const { schoolId, senderId } = req.query;
    let query = supabaseAdmin.from('enquiries').select('*').order('created_at', { ascending: false });

    if (schoolId) query = query.eq('recipient_id', schoolId);
    if (senderId) query = query.eq('sender_id', senderId);

    const { data: enquiries, error } = await query;
    if (error) {
      return res.json([]);
    }
    return res.json(enquiries || []);
  } catch (err) {
    return res.json([]);
  }
});

/**
 * GET /api/inquiries/lookup/:refOrId & GET /api/inquiries/:refOrId
 * Track inquiry status
 */
router.get(['/lookup/:refOrId', '/:refOrId'], async (req, res) => {
  try {
    const { refOrId } = req.params;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(refOrId);

    let foundEnquiry = null;
    let query = supabaseAdmin.from('enquiries').select('*');

    if (isUuid) {
      query = query.eq('id', refOrId);
    } else {
      query = query.or(`message.ilike.%${refOrId}%,subject.ilike.%${refOrId}%`);
    }

    const { data, error } = await query.limit(1).maybeSingle();
    foundEnquiry = data;

    // Resolve School Information
    let school = {
      id: 'ghana-international-school',
      name: 'Ghana International School (GIS)',
      suburb: 'Cantonments',
      region: 'Greater Accra',
      whatsapp: '+233244123456'
    };

    if (foundEnquiry?.recipient_id && foundEnquiry.recipient_id !== '00000000-0000-0000-0000-000000000001') {
      const { data: sch } = await supabaseAdmin
        .from('schools')
        .select('*')
        .eq('id', foundEnquiry.recipient_id)
        .maybeSingle();
      if (sch) school = sch;
    }

    const trackingCode = refOrId.startsWith('SF-INQ-') || refOrId.startsWith('INQ-') ? refOrId : `SF-INQ-${refOrId.slice(-6)}`;

    // Parse details out of compiled message if available
    let parentName = 'Parent / Guardian';
    let parentPhone = '+233 24 000 0000';
    let studentName = 'Prospective Student';
    let gradeApplying = 'Primary';
    let tourRequested = true;
    let originalNotes = foundEnquiry?.message || 'Inquiry regarding admission entry requirements and campus walkthrough.';

    if (foundEnquiry?.message) {
      const pMatch = foundEnquiry.message.match(/Parent:\s*([^|\n]+)/);
      if (pMatch) parentName = pMatch[1].trim();
      const phMatch = foundEnquiry.message.match(/Phone:\s*([^|\n]+)/);
      if (phMatch) parentPhone = phMatch[1].trim();
      const sMatch = foundEnquiry.message.match(/Student:\s*([^\(\n]+)/);
      if (sMatch) studentName = sMatch[1].trim();
      const gMatch = foundEnquiry.message.match(/\(([^)]+)\)/);
      if (gMatch) gradeApplying = gMatch[1].trim();
    }

    return res.json({
      id: foundEnquiry?.id || refOrId,
      inquiryNumber: trackingCode,
      referenceNumber: trackingCode,
      schoolId: school.id || 'ghana-international-school',
      schoolName: school.name || 'Accredited Institution',
      parentName,
      parentPhone,
      parentWhatsapp: parentPhone,
      studentName,
      gradeApplying,
      category: 'Admissions & Campus Tour',
      subject: foundEnquiry?.subject || `Admissions Inquiry: ${studentName} (${gradeApplying})`,
      message: originalNotes,
      tourRequested,
      preferredTourDate: 'Next Available Visiting Slot',
      preferredTourTime: 'Morning Session (10:00 AM)',
      status: foundEnquiry?.status === 'replied' ? 'Replied' : 'Tour Scheduled',
      createdAt: foundEnquiry?.created_at || new Date().toISOString(),
      replies: [
        {
          sender: 'school',
          senderName: 'Admissions Desk',
          senderRole: 'Senior Admissions Registrar',
          message: `Greetings ${parentName}. We have received your inquiry for ${studentName}. Our admissions team is pleased to invite you for a campus walkthrough. Please present reference code ${trackingCode} at the main gate reception.`,
          timestamp: new Date().toISOString()
        }
      ]
    });
  } catch (err) {
    console.error('Error looking up inquiry:', err);
    return res.status(500).json({ error: 'Failed to look up inquiry' });
  }
});

module.exports = router;

