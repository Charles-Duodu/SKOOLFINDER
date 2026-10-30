const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const { supabaseAdmin } = require('../config/supabase');

// Initialize Resend client if API key is configured
const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

// Initialize SMTP transporter if configured
let smtpTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'SkoolFinder Ghana <admissions@skoolfinder.com.gh>';

// In-memory audit outbox (resilient cache)
const recentEmailLogs = [];

/**
 * Base email layout with Scholastic Navy & Gold styling
 */
function wrapInEmailTemplate(title, preheader, contentHtml) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
        .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); padding: 32px 28px; text-align: center; }
        .header-title { color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin: 8px 0 0; }
        .header-tag { display: inline-block; background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.4); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 9999px; }
        .body { padding: 32px 28px; }
        .voucher-card { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .voucher-ref { font-family: monospace; font-size: 24px; font-weight: 800; color: #1e1b4b; letter-spacing: 2px; margin: 8px 0; }
        .btn-gold { display: inline-block; background: #f59e0b; color: #1e1b4b; font-weight: 800; font-size: 15px; padding: 12px 24px; border-radius: 9999px; text-decoration: none; margin: 12px 0; text-align: center; }
        .btn-wa { display: inline-block; background: #25D366; color: #ffffff; font-weight: 800; font-size: 15px; padding: 12px 24px; border-radius: 9999px; text-decoration: none; margin: 8px 0; text-align: center; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .detail-label { color: #64748b; font-weight: 600; }
        .detail-val { color: #0f172a; font-weight: 700; text-align: right; }
        .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="header-tag">SkoolFinder Ghana • Notifications</div>
          <div class="header-title">${title}</div>
        </div>
        <div class="body">
          ${contentHtml}
        </div>
        <div class="footer">
          <p style="margin: 0 0 8px;">SkoolFinder Ghana — Independent Educational Directory & Institutional Gateway</p>
          <p style="margin: 0;">Greater Accra & Ashanti Regions, Ghana • <a href="https://skoolfinder.com.gh" style="color: #64748b;">www.skoolfinder.com.gh</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Core Dispatcher: sends via Resend, SMTP, or logs to DB / Console
 */
async function dispatchEmail({ to, subject, html, text, portal, templateType, referenceCode, recipientName = '' }) {
  let provider = 'simulated';
  let status = 'sent';
  let errorMessage = null;

  try {
    // 1. Try Resend if configured
    if (resendClient) {
      provider = 'resend';
      const resendRes = await resendClient.emails.send({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text: text || subject
      });
      if (resendRes.error) {
        throw new Error(resendRes.error.message);
      }
    } 
    // 2. Try SMTP if configured
    else if (smtpTransporter) {
      provider = 'smtp';
      await smtpTransporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject,
        html,
        text: text || subject
      });
    } 
    // 3. Simulated Development Delivery
    else {
      provider = 'simulated';
      console.log(`\n======================================================`);
      console.log(`📧 [TRANSACTIONAL EMAIL DISPATCHED — ${portal.toUpperCase()}]`);
      console.log(`To: ${to} (${recipientName})`);
      console.log(`Subject: ${subject}`);
      console.log(`Template: ${templateType} | Ref: ${referenceCode || 'N/A'}`);
      console.log(`Status: Simulated Delivery (Set RESEND_API_KEY in .env for live dispatch)`);
      console.log(`======================================================\n`);
    }
  } catch (err) {
    status = 'failed';
    errorMessage = err.message;
    console.error(`❌ [EMAIL DISPATCH ERROR] Failed to send email to ${to}:`, err.message);
  }

  const logEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    recipient_email: Array.isArray(to) ? to.join(', ') : to,
    recipient_name: recipientName,
    portal,
    subject,
    template_type: templateType,
    reference_code: referenceCode,
    status,
    provider,
    error_message: errorMessage,
    created_at: new Date().toISOString()
  };

  recentEmailLogs.unshift(logEntry);
  if (recentEmailLogs.length > 100) recentEmailLogs.pop();

  // 4. Log to Supabase email_logs table
  try {
    await supabaseAdmin
      .from('email_logs')
      .insert(logEntry);
  } catch (dbErr) {
    // Non-blocking DB audit log
    console.warn('[EMAIL AUDIT NOTICE] Could not record email log in DB:', dbErr.message);
  }

  return { success: status !== 'failed', provider, status, referenceCode };
}

const EmailService = {
  getRecentLogs() {
    return recentEmailLogs;
  },

  // ==========================================
  // PORTAL 1: PARENTS NOTIFICATIONS
  // ==========================================

  /**
   * Parent: Admission Inquiry & Campus Tour Confirmation
   */
  async sendParentInquiryConfirmation({ to, parentName, schoolName, referenceCode, grade, term, tourDate, schoolPhone, schoolWhatsapp }) {
    const cleanWa = (schoolWhatsapp || schoolPhone || '0244123456').replace(/[^0-9]/g, '');
    const waText = encodeURIComponent(`Hello ${schoolName} Admissions Desk, my name is ${parentName}. I received inquiry reference ${referenceCode} for ${grade} (${term}).`);
    const waUrl = `https://wa.me/${cleanWa}?text=${waText}`;

    const contentHtml = `
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">
        Dear <strong>${parentName}</strong>,
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        Your official admission inquiry for <strong>${schoolName}</strong> has been logged in the school's central admissions queue.
      </p>

      <div class="voucher-card">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #b45309; font-weight: 800;">
          Admissions Desk Reference Code
        </div>
        <div class="voucher-ref">${referenceCode}</div>
        <div style="font-size: 13px; color: #64748b;">
          Please present or quote this code during your campus tour or phone screening.
        </div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
        <div class="detail-row">
          <span class="detail-label">Institution:</span>
          <span class="detail-val">${schoolName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Target Grade:</span>
          <span class="detail-val">${grade}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Entry Term:</span>
          <span class="detail-val">${term}</span>
        </div>
        ${tourDate ? `
          <div class="detail-row">
            <span class="detail-label">Campus Walkthrough:</span>
            <span class="detail-val" style="color: #047857;">🗓️ ${tourDate} (Morning Slot)</span>
          </div>
        ` : ''}
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Admissions Office Phone:</span>
          <span class="detail-val">${schoolPhone || '+233 30 277 7163'}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${waUrl}" class="btn-wa">
          💬 Connect on Admissions WhatsApp
        </a>
      </div>
    `;

    return dispatchEmail({
      to,
      recipientName: parentName,
      portal: 'parents',
      templateType: 'admission_inquiry',
      referenceCode,
      subject: `[SkoolFinder] Admission Inquiry Confirmed: Ref ${referenceCode} for ${schoolName}`,
      html: wrapInEmailTemplate(`Admission Inquiry Confirmed`, `Inquiry ref ${referenceCode}`, contentHtml)
    });
  },

  /**
   * Parent: Formal Admission Application Confirmation
   */
  async sendParentApplicationConfirmation({ to, parentName, schoolName, referenceCode, candidateName, gradeLevel }) {
    const contentHtml = `
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">
        Dear <strong>${parentName}</strong>,
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        We have received your formal application dossier for <strong>${candidateName}</strong> applying to <strong>${schoolName}</strong> (${gradeLevel}).
      </p>

      <div class="voucher-card">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #b45309; font-weight: 800;">
          Application Dossier Reference
        </div>
        <div class="voucher-ref">${referenceCode}</div>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
        The admissions committee is reviewing previous academic transcripts and immunization records. You will receive an invitation for entrance diagnostic testing within 3 business days.
      </p>
    `;

    return dispatchEmail({
      to,
      recipientName: parentName,
      portal: 'parents',
      templateType: 'admission_application',
      referenceCode,
      subject: `[SkoolFinder] Application Dossier Received: Ref ${referenceCode} — ${candidateName}`,
      html: wrapInEmailTemplate(`Application Dossier Received`, `Application ref ${referenceCode}`, contentHtml)
    });
  },

  // ==========================================
  // PORTAL 2: SCHOOLS NOTIFICATIONS
  // ==========================================

  /**
   * School Administration: Inbound Admission Lead & Campus Tour Alert
   */
  async sendSchoolNewInquiryAlert({ to, schoolName, parentName, parentPhone, parentEmail, studentName, grade, message, referenceCode, tourRequested, tourDate }) {
    const cleanPhone = (parentPhone || '').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${parentName}, this is ${schoolName} Admissions Desk following up on your inquiry ${referenceCode}.`)}`;

    const contentHtml = `
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">
        Dear Admissions Director & Head of School,
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        A new prospective parent has submitted an admission inquiry for <strong>${schoolName}</strong> on the SkoolFinder platform.
      </p>

      <div class="voucher-card" style="background: #eff6ff; border-color: #93c5fd;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #1d4ed8; font-weight: 800;">
          Tracking Identifier
        </div>
        <div class="voucher-ref" style="color: #1e3a8a;">${referenceCode}</div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
        <div class="detail-row">
          <span class="detail-label">Parent / Guardian:</span>
          <span class="detail-val">${parentName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Contact Phone / WhatsApp:</span>
          <span class="detail-val" style="color: #0284c7;">${parentPhone}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-val">${parentEmail || 'Not specified'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Prospective Student:</span>
          <span class="detail-val">${studentName || 'Ward'} (${grade})</span>
        </div>
        ${tourRequested ? `
          <div class="detail-row">
            <span class="detail-label">Campus Visit Date:</span>
            <span class="detail-val" style="color: #15803d; font-weight: 800;">🗓️ ${tourDate || 'Flexible'}</span>
          </div>
        ` : ''}
      </div>

      <div style="background: #f8fafc; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 4px; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #b45309; text-transform: uppercase; margin-bottom: 4px;">Parent Notes:</div>
        <div style="font-size: 14px; color: #334155; line-height: 1.5;">${message || 'Parent requested general admission information.'}</div>
      </div>

      <div style="text-align: center;">
        <a href="${waUrl}" class="btn-wa">
          💬 WhatsApp Parent (${parentName.split(' ')[0]})
        </a>
      </div>
    `;

    return dispatchEmail({
      to,
      recipientName: `${schoolName} Admissions`,
      portal: 'schools',
      templateType: 'school_inbound_inquiry',
      referenceCode,
      subject: `[SkoolFinder Alert] New Admissions Inquiry for ${schoolName} from ${parentName}`,
      html: wrapInEmailTemplate(`New Prospective Student Inquiry`, `Inquiry ref ${referenceCode}`, contentHtml)
    });
  },

  /**
   * School Owner: Claim / Registration Acknowledgment
   */
  async sendSchoolClaimAcknowledgment({ to, schoolName, claimantName, officialRole, referenceCode }) {
    const contentHtml = `
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">
        Dear <strong>${claimantName}</strong> (${officialRole}),
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        Your ownership verification request for <strong>${schoolName}</strong> has been received by the SkoolFinder Institutional Accreditation Desk.
      </p>

      <div class="voucher-card">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #b45309; font-weight: 800;">
          Claim Verification Reference
        </div>
        <div class="voucher-ref">${referenceCode}</div>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
        Our team cross-references submissions against the National Schools Inspectorate Authority (NaSIA) and Ghana Education Service registry. You will receive an administrative telephone verification call within 24 to 48 hours.
      </p>
    `;

    return dispatchEmail({
      to,
      recipientName: claimantName,
      portal: 'schools',
      templateType: 'school_claim',
      referenceCode,
      subject: `[SkoolFinder] Institutional Ownership Claim: ${schoolName} (Ref ${referenceCode})`,
      html: wrapInEmailTemplate(`School Ownership Claim Registered`, `Claim ref ${referenceCode}`, contentHtml)
    });
  },

  // ==========================================
  // PORTAL 3: TEACHERS / TUTORS NOTIFICATIONS
  // ==========================================

  /**
   * Teacher / Tutor: New Private Tutoring Request Alert
   */
  async sendTutorBookingAlert({ to, tutorName, parentName, parentPhone, parentEmail, studentName, subject, gradeLevel, sessionType, preferredDays, message, referenceCode }) {
    const cleanPhone = (parentPhone || '').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${parentName}, I am ${tutorName}. I received your tutoring request on SkoolFinder regarding ${subject}.`)}`;

    const contentHtml = `
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">
        Dear <strong>${tutorName}</strong>,
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        A parent has booked a private tutoring consultation session with you on SkoolFinder Ghana.
      </p>

      <div class="voucher-card" style="background: #ecfdf5; border-color: #a7f3d0;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #047857; font-weight: 800;">
          Consultation Booking Reference
        </div>
        <div class="voucher-ref" style="color: #065f46;">${referenceCode}</div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
        <div class="detail-row">
          <span class="detail-label">Client Parent:</span>
          <span class="detail-val">${parentName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Contact Phone:</span>
          <span class="detail-val">${parentPhone}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Candidate Student:</span>
          <span class="detail-val">${studentName || 'Student'} (${gradeLevel})</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Focus Subject:</span>
          <span class="detail-val" style="color: #0369a1;">${subject}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Format:</span>
          <span class="detail-val">${sessionType || 'In-Person (Home)'}</span>
        </div>
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Preferred Days:</span>
          <span class="detail-val">${preferredDays || 'Weekends / Evenings'}</span>
        </div>
      </div>

      ${message ? `
        <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 4px; margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; margin-bottom: 4px;">Parent Requirements:</div>
          <div style="font-size: 14px; color: #334155; line-height: 1.5;">${message}</div>
        </div>
      ` : ''}

      <div style="text-align: center;">
        <a href="${waUrl}" class="btn-wa">
          💬 WhatsApp Parent Directly
        </a>
      </div>
    `;

    return dispatchEmail({
      to,
      recipientName: tutorName,
      portal: 'teachers',
      templateType: 'tutor_booking_alert',
      referenceCode,
      subject: `[SkoolFinder Tutors] New Tutoring Consultation from ${parentName} (${subject})`,
      html: wrapInEmailTemplate(`New Tutoring Consultation`, `Booking ref ${referenceCode}`, contentHtml)
    });
  },

  /**
   * Parent: Confirmation of Tutor Consultation Request
   */
  async sendParentTutorConfirmation({ to, parentName, tutorName, subject, referenceCode }) {
    const contentHtml = `
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">
        Dear <strong>${parentName}</strong>,
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        Your consultation request with verified educator <strong>${tutorName}</strong> for <strong>${subject}</strong> has been transmitted.
      </p>

      <div class="voucher-card">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #b45309; font-weight: 800;">
          Consultation Request Code
        </div>
        <div class="voucher-ref">${referenceCode}</div>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
        The tutor has been provided your contact details and will reach out via WhatsApp or phone call to confirm availability, hourly rates, and lesson schedules.
      </p>
    `;

    return dispatchEmail({
      to,
      recipientName: parentName,
      portal: 'teachers',
      templateType: 'parent_tutor_confirmation',
      referenceCode,
      subject: `[SkoolFinder] Tutoring Request Sent to ${tutorName} (${referenceCode})`,
      html: wrapInEmailTemplate(`Tutoring Request Logged`, `Request ref ${referenceCode}`, contentHtml)
    });
  },

  // ==========================================
  // PORTAL 4: SUPPLIERS NOTIFICATIONS
  // ==========================================

  /**
   * Supplier: Confirmation of Quote Submitted on Tender
   */
  async sendSupplierQuoteConfirmation({ to, supplierName, rfqTitle, schoolName, price, deliveryDays, referenceCode }) {
    const contentHtml = `
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">
        Dear <strong>${supplierName}</strong> Procurement Team,
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        Your wholesale quotation for <strong>${schoolName}</strong> on tender <em>"${rfqTitle}"</em> has been recorded.
      </p>

      <div class="voucher-card" style="background: #fffbeb; border-color: #fde68a;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #b45309; font-weight: 800;">
          Quotation Submission Code
        </div>
        <div class="voucher-ref" style="color: #92400e;">${referenceCode}</div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
        <div class="detail-row">
          <span class="detail-label">Tender:</span>
          <span class="detail-val">${rfqTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Client Institution:</span>
          <span class="detail-val">${schoolName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Quoted Price:</span>
          <span class="detail-val" style="color: #047857; font-size: 16px;">${price}</span>
        </div>
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Fulfillment Lead Time:</span>
          <span class="detail-val">${deliveryDays} Business Days</span>
        </div>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
        The school administration and bursar have been alerted. You will receive an official notification if your quotation is shortlisted or awarded.
      </p>
    `;

    return dispatchEmail({
      to,
      recipientName: supplierName,
      portal: 'suppliers',
      templateType: 'supplier_quote_confirmation',
      referenceCode,
      subject: `[SkoolFinder Procurement] Quotation Submitted: Tender ${rfqTitle} (${referenceCode})`,
      html: wrapInEmailTemplate(`Quotation Received by Board`, `Bid ref ${referenceCode}`, contentHtml)
    });
  },

  /**
   * School Bursar / Procurement Head: Alert on New Supplier Quote Received
   */
  async sendSchoolNewQuoteAlert({ to, schoolName, supplierName, rfqTitle, price, deliveryDays, referenceCode }) {
    const contentHtml = `
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">
        Dear <strong>${schoolName}</strong> Procurement Committee,
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        A verified Ghanaian vendor has submitted a competitive quotation on your institutional tender <em>"${rfqTitle}"</em>.
      </p>

      <div class="voucher-card" style="background: #f8fafc; border-color: #cbd5e1;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #475569; font-weight: 800;">
          Quotation Ref
        </div>
        <div class="voucher-ref">${referenceCode}</div>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
        <div class="detail-row">
          <span class="detail-label">Bidding Supplier:</span>
          <span class="detail-val">${supplierName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Bid Price:</span>
          <span class="detail-val" style="color: #047857; font-size: 16px;">${price}</span>
        </div>
        <div class="detail-row" style="border-bottom: none;">
          <span class="detail-label">Delivery Timeline:</span>
          <span class="detail-val">${deliveryDays} Business Days</span>
        </div>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
        Please sign in to your School Admin OS at <a href="https://skoolfinder.com.gh/schools" style="color: #2563eb; font-weight: 700;">/schools</a> to compare bids side-by-side and award the purchase order.
      </p>
    `;

    return dispatchEmail({
      to,
      recipientName: `${schoolName} Procurement`,
      portal: 'suppliers',
      templateType: 'school_new_quote_alert',
      referenceCode,
      subject: `[SkoolFinder Procurement] New Wholesale Quote: ${supplierName} on "${rfqTitle}"`,
      html: wrapInEmailTemplate(`New Procurement Quotation Received`, `Quote ref ${referenceCode}`, contentHtml)
    });
  }
};

module.exports = EmailService;
