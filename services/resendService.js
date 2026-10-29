/**
 * SkoolFinder Ghana - Resend Transactional Email Service
 * 
 * High-deliverability transactional email delivery for:
 * - School onboarding vetting approvals & 14-day trial credentials
 * - Mobile Money fee payment receipts
 * - Parent admission offer letters
 * - Teacher hiring offers & RFQ alerts
 * 
 * Documentation: https://resend.com/docs/api-reference/emails/send-email
 */

require('dotenv').config();

class ResendEmailService {
  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'SkoolFinder Ghana <admissions@skoolfinder.com.gh>';
  }

  isConfigured() {
    return Boolean(this.apiKey) && !this.apiKey.includes('mock') && this.apiKey.startsWith('re_');
  }

  getProductionStatus() {
    const isLive = this.isConfigured();
    return {
      service: 'Resend Ghana Email Delivery',
      isLive,
      operational: true,
      mode: isLive ? 'live_production' : 'sandbox_simulation',
      fromEmail: this.fromEmail,
      apiKeyPrefix: isLive ? this.apiKey.slice(0, 7) + '...' : 'awaiting_live_key'
    };
  }

  /**
   * Generic send email method
   */
  async sendEmail({ to, subject, html, text }) {
    if (this.isConfigured()) {
      try {
        let actualTo = Array.isArray(to) ? to : [to];
        let actualSubject = subject;

        // If using Resend's free onboarding domain (resend.dev), Resend enforces sending only to the account owner
        if (this.fromEmail.includes('resend.dev')) {
          const ownerEmail = process.env.RESEND_TEST_RECIPIENT || 'omotade.duodu@gmail.com';
          actualSubject = `[Sandbox Test for ${actualTo.join(', ')}] ${subject}`;
          actualTo = [ownerEmail];
        }

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: this.fromEmail,
            to: actualTo,
            subject: actualSubject,
            html,
            text
          })
        });

        const data = await response.json();
        if (response.ok) {
          return { success: true, isLive: true, id: data.id, recipient: actualTo, subject: actualSubject };
        } else {
          console.warn('[Resend API Warning]:', data);
          return { success: false, isLive: true, error: data.message || 'Resend error' };
        }
      } catch (err) {
        console.error('[Resend Dispatch Error]:', err.message);
        return { success: false, isLive: true, error: err.message };
      }
    }

    // Simulated sandbox mode
    return {
      success: true,
      isLive: false,
      isSimulated: true,
      id: `sim-email-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      recipient: to,
      subject,
      note: 'Processed via SkoolFinder Sandbox Email Simulator. Set RESEND_API_KEY in .env for live SMTP delivery.'
    };
  }

  /**
   * Sends School Vetting Approval & 14-Day Free Trial Welcome Email
   */
  async sendSchoolVettingApprovalEmail({ to, schoolName, adminName, trialDays = 14, loginUrl }) {
    const subject = `🎉 Approved: 14-Day Free Trial Activated for ${schoolName} on SkoolFinder SaaS`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="background: #0a1128; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 24px;">SkoolFinder Ghana</h1>
          <p style="color: #ffffff; margin: 6px 0 0 0; font-size: 13px;">Verified Educational Directory & SaaS Platform</p>
        </div>
        
        <h2 style="color: #0f172a; margin-top: 0;">Congratulations ${adminName || 'School Administrator'},</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Your institution <strong>${schoolName}</strong> has been officially verified by the SkoolFinder Verification & NaSIA Accreditation Desk.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 18px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin: 0 0 8px 0; font-size: 16px;">🚀 ${trialDays}-Day Free SaaS Trial Active</h3>
          <p style="color: #15803d; margin: 0; font-size: 14px; line-height: 1.5;">
            You have full access to the <strong>Schools Portal (/schools)</strong> including Admissions CRM, MoMo fee reconciliation, digital ID badges, and teacher recruiting.
          </p>
        </div>

        <p style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl || 'https://skoolfinder.com.gh/schools'}" style="background: #f59e0b; color: #0a1128; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 8px; display: inline-block;">
            Access Schools Portal &rarr;
          </a>
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          SkoolFinder Ghana • Republic of Ghana Education Network • Cantonments, Accra
        </p>
      </div>
    `;
    return this.sendEmail({ to, subject, html });
  }

  /**
   * Sends School Fees Payment Receipt
   */
  async sendPaymentReceiptEmail({ to, parentName, studentName, amountGHS, transactionRef, schoolName }) {
    const subject = `Receipt: GH₵ ${amountGHS} Tuition Fee Payment for ${studentName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a;">Official Payment Confirmation</h2>
        <p>Dear ${parentName},</p>
        <p>Your payment via MTN Mobile Money has been confirmed by ${schoolName}.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; color: #64748b;">Student:</td><td style="padding: 8px 0; font-weight: bold;">${studentName}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; color: #64748b;">Amount:</td><td style="padding: 8px 0; font-weight: bold; color: #16a34a;">GH₵ ${amountGHS}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; color: #64748b;">Ref:</td><td style="padding: 8px 0;">${transactionRef}</td></tr>
        </table>
        <p style="color: #64748b; font-size: 13px;">This transaction is recorded in your Parents Portal (/parents).</p>
      </div>
    `;
    return this.sendEmail({ to, subject, html });
  }
}

module.exports = new ResendEmailService();
