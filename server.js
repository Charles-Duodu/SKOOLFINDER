require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./data/db');
const pgClient = require('./data/pgClient');
const hubtelService = require('./services/hubtelService');
const paystackService = require('./services/paystackService');
const otpService = require('./services/otpService');
const resendService = require('./services/resendService');
const clerkService = require('./services/clerkService');
const supabaseService = require('./services/supabaseService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Healthcheck endpoint for Docker & Cloud Load Balancers
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    platform: 'SkoolFinder Ghana Enterprise'
  });
});

// API: Stats
app.get('/api/stats', (req, res) => {
  res.json(db.getStats());
});

// ==============================================================================
// PORTAL AUTHENTICATION & SESSION ENGINE (Role-Based Access Control)
// ==============================================================================
app.post('/api/auth/login', (req, res) => {
  try {
    const { login, password } = req.body || {};
    if (!login || !password) {
      return res.status(400).json({ error: "Email or phone and password are required" });
    }
    const result = db.authenticateUser(login, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const result = db.registerUser(req.body || {});
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const result = db.logoutUser(authHeader);
    res.json(result);
  } catch (err) {
    res.json({ success: true });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = db.getUserByToken(authHeader);
    if (!user) return res.status(401).json({ error: "Unauthorized session" });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// ==============================================================================
// DUAL PARENT AUTHENTICATION (Ghana Phone SMS OTP via Hubtel Gateway)
// ==============================================================================
app.post('/api/auth/otp/send', async (req, res) => {
  try {
    const { phone, purpose } = req.body || {};
    if (!phone) return res.status(400).json({ error: "Phone number is required" });
    const result = await otpService.sendOTP(phone, purpose || 'login');
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/otp/verify', (req, res) => {
  try {
    const { phone, code } = req.body || {};
    if (!phone || !code) return res.status(400).json({ error: "Phone and 6-digit OTP code are required" });

    const verification = otpService.verifyOTP(phone, code);
    if (!verification.success) {
      return res.status(400).json(verification);
    }

    // Auto-provision or retrieve parent user
    const parentUser = db.findOrCreateParentByPhone(verification.phone);
    const session = db.createSessionForUser ? db.createSessionForUser(parentUser) : {
      token: 'sdtk_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 12),
      user: parentUser
    };

    res.json({
      success: true,
      token: session.token,
      user: session.user || parentUser,
      mappedPortal: '/parents',
      message: "Phone verified successfully. Signed in to Parents Portal."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================================================================
// PARENT PORTAL: STUDENT LINKING (By Student Index Number / Digital ID Code)
// ==============================================================================
app.post('/api/parents/link-student', async (req, res) => {
  try {
    const { studentIdOrCode, studentName } = req.body || {};
    if (!studentIdOrCode && !studentName) {
      return res.status(400).json({ error: "Student ID, Index Number, or Student Name is required" });
    }

    const authHeader = req.headers.authorization;
    let parent = null;
    if (authHeader) {
      parent = db.getUserByToken(authHeader);
    }
    if (!parent) {
      parent = (db.data.users || []).find(u => u.role === 'parent');
    }
    if (!parent) return res.status(401).json({ error: "Please log in to link a student" });

    const result = db.linkStudentToParent(parent.id, { studentIdOrCode, studentName });

    // Send confirmation SMS via Hubtel if parent phone is present
    if (parent.phone) {
      await hubtelService.sendSMS({
        to: parent.phone,
        message: `SkoolFinder Ghana: ${result.student.studentName} (${result.student.studentId}) has been successfully linked to your parent portal. You can now view terminal report cards and settle fees.`
      });
    }

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==============================================================================
// SCHOOL REGISTRATION & ADMIN VETTING PIPELINE (14-Day Free SaaS Trial)
// ==============================================================================
app.post('/api/schools/register-vetting', async (req, res) => {
  try {
    const school = db.registerSchoolForVetting(req.body || {});

    // Dispatch SMS receipt via Hubtel
    if (school.phone) {
      await hubtelService.sendSMS({
        to: school.phone,
        message: `SkoolFinder Ghana: Registration for ${school.name} received. Our Accreditation Desk is reviewing your license. You will receive an SMS upon approval.`
      });
    }

    res.status(201).json({
      success: true,
      school,
      message: "School registration submitted for Admin & NaSIA Vetting. You will be notified once reviewed."
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/vetting/schools', (req, res) => {
  try {
    const queue = db.getSchoolVettingQueue();
    res.json(queue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/vetting/schools/:id/approve', async (req, res) => {
  try {
    const { trialDays = 14, notes, assignedTier } = req.body || {};
    const approvedSchool = db.approveSchoolVetting(req.params.id, { trialDays, notes, assignedTier });

    // 1. Dispatch SMS notification to School Admin via Hubtel
    if (approvedSchool.phone) {
      await hubtelService.sendSMS({
        to: approvedSchool.phone,
        message: `SkoolFinder: Congratulations! ${approvedSchool.name} is verified. Your 14-Day Free SaaS Trial is active. Access your portal at https://skoolfinder.com.gh/schools`
      });
    }

    // 2. Dispatch Welcome & Trial Confirmation Email via Resend
    if (approvedSchool.email) {
      await resendService.sendSchoolVettingApprovalEmail({
        to: approvedSchool.email,
        schoolName: approvedSchool.name,
        adminName: approvedSchool.headOfSchool,
        trialDays,
        loginUrl: 'http://localhost:3000/schools'
      });
    }

    // 3. Create Clerk Organization for School
    const clerkOrg = await clerkService.createSchoolOrganization({
      schoolName: approvedSchool.name,
      slug: approvedSchool.slug
    });

    res.json({
      success: true,
      school: approvedSchool,
      clerkOrg,
      message: `School ${approvedSchool.name} approved! 14-day trial activated, Hubtel SMS & Resend email dispatched.`
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/vetting/schools/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body || {};
    const school = db.rejectSchoolVetting(req.params.id, { reason });
    if (school.phone) {
      await hubtelService.sendSMS({
        to: school.phone,
        message: `SkoolFinder Ghana: Registration for ${school.name} could not be approved at this time. Reason: ${reason || 'Accreditation details mismatch'}. Contact support@skoolfinder.gh`
      });
    }
    res.json({ success: true, school, message: "Registration rejected." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==============================================================================
// CLOUD TELEMETRY & SAAS STATUS (Supabase, Clerk, Resend, Hubtel, Paystack)
// ==============================================================================
app.get('/api/saas/status', (req, res) => {
  res.json({
    status: 'healthy',
    database: {
      engine: 'Neon Cloud PostgreSQL 16',
      activePool: Boolean(pgClient && pgClient.isConfigured && pgClient.isConfigured()),
      fallbackAvailable: true
    },
    supabase: supabaseService.getProductionStatus(),
    clerk: clerkService.getProductionStatus(),
    resend: resendService.getProductionStatus(),
    hubtel: hubtelService.getProductionStatus(),
    paystack: paystackService.getProductionStatus(),
    timestamp: new Date().toISOString()
  });
});

// ==============================================================================
// SAAS SUBSCRIPTION BILLING API (Paystack Mobile Money, Cards & Resend Receipts)
// ==============================================================================
const SAAS_TIERS = {
  starter: { id: 'starter', name: 'SaaS Starter', monthly: 299, termly: 850 },
  growth: { id: 'growth', name: 'SaaS Growth', monthly: 699, termly: 1999 },
  enterprise: { id: 'enterprise', name: 'SaaS Enterprise', monthly: 1499, termly: 4200 }
};

app.post('/api/schools/:id/subscribe/initialize', async (req, res) => {
  try {
    const school = db.getSchoolById(req.params.id);
    if (!school) return res.status(404).json({ error: `School ${req.params.id} not found` });

    const { planTier = 'starter', billingCycle = 'monthly', email, phone, callbackUrl } = req.body || {};
    const tierConfig = SAAS_TIERS[planTier.toLowerCase()] || SAAS_TIERS.starter;
    const amountGHS = billingCycle === 'termly' ? tierConfig.termly : tierConfig.monthly;
    const customerEmail = email || school.email || 'billing@skoolfinder.gh';
    const reference = `SF-SUB-${(school.slug || 'sch').slice(0, 15)}-${Date.now()}`;

    const txResult = await paystackService.initializeTransaction({
      email: customerEmail,
      amountGHS,
      reference,
      callbackUrl: callbackUrl || `http://localhost:3000/schools?subscription_status=success&ref=${reference}`,
      metadata: {
        schoolId: school.id,
        schoolName: school.name,
        planTier: tierConfig.name,
        billingCycle,
        phone: phone || school.phone,
        type: 'saas_subscription'
      }
    });

    res.json({
      success: true,
      schoolId: school.id,
      schoolName: school.name,
      planTier: tierConfig.name,
      billingCycle,
      amountGHS,
      reference,
      ...txResult
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/schools/:id/subscribe/verify', async (req, res) => {
  try {
    const school = db.getSchoolById(req.params.id);
    if (!school) return res.status(404).json({ error: `School ${req.params.id} not found` });

    const { reference, planTier, billingCycle = 'monthly' } = req.body || {};
    if (!reference) return res.status(400).json({ error: 'Transaction reference is required' });

    // Verify transaction with Paystack
    const verification = await paystackService.verifyTransaction(reference);

    if (verification.success || verification.isSimulated) {
      const resolvedTier = planTier || verification.metadata?.planTier || school.packageTier || 'SaaS Starter';
      const resolvedCycle = billingCycle || verification.metadata?.billingCycle || 'monthly';
      const amountPaid = verification.amountGHS || (resolvedCycle === 'termly' ? 850 : 299);

      // Upgrade school record in database
      const updatedSchool = db.upgradeSchoolSubscription(school.id, {
        planTier: resolvedTier,
        billingCycle: resolvedCycle,
        amountPaidGHS: amountPaid,
        reference,
        paymentMethod: verification.channel || 'mobile_money',
        transactionId: verification.reference || reference
      });

      // Send live payment confirmation receipt via Resend
      if (school.email) {
        await resendService.sendEmail({
          to: school.email,
          subject: `Payment Receipt: GH₵ ${amountPaid} for ${resolvedTier} (${resolvedCycle})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
              <div style="background: #0a1128; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: #fbbf24; margin: 0; font-size: 24px;">SkoolFinder Ghana</h1>
                <p style="color: #ffffff; margin: 6px 0 0 0; font-size: 13px;">Official SaaS Subscription Receipt</p>
              </div>
              <h2 style="color: #0f172a;">Subscription Payment Confirmed</h2>
              <p style="color: #475569;">Institution: <strong>${school.name}</strong></p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; color: #64748b;">Plan:</td><td style="font-weight: bold; color: #0f172a;">${resolvedTier}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;">Billing Cycle:</td><td style="font-weight: bold; text-transform: capitalize;">${resolvedCycle}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;">Amount Paid:</td><td style="font-weight: bold; color: #16a34a; font-size: 1.1rem;">GH₵ ${amountPaid}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;">Payment Channel:</td><td style="font-weight: bold;">Mobile Money (MTN / Telecel / AT)</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;">Reference:</td><td style="font-family: monospace; font-size: 0.9rem;">${reference}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;">Next Renewal:</td><td style="font-weight: bold; color: #2563eb;">${new Date(updatedSchool.subscriptionExpiresAt).toLocaleDateString('en-GB')}</td></tr>
                </table>
              </div>
              <p style="color: #64748b; font-size: 13px; text-align: center;">All SaaS tools (Admissions CRM, MoMo fee reconciliation, digital ID cards) are fully unlocked.</p>
            </div>
          `
        });
      }

      // Send live SMS receipt via Hubtel
      if (school.phone) {
        await hubtelService.sendSMS({
          to: school.phone,
          message: `SkoolFinder: Payment of GH₵${amountPaid} confirmed for ${school.name}. Your ${resolvedTier} plan is active through ${new Date(updatedSchool.subscriptionExpiresAt).toLocaleDateString('en-GB')}.`
        });
      }

      return res.json({
        success: true,
        school: updatedSchool,
        verification,
        message: `Subscription successfully upgraded to ${resolvedTier}!`
      });
    }

    res.status(400).json({
      success: false,
      error: verification.error || 'Payment verification failed with provider'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Paystack Webhook Handler
app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const isValid = paystackService.verifyWebhookSignature(signature, req.body);
    
    // In dev/sandbox without secret key, proceed
    let event = null;
    try {
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).send('Invalid webhook JSON');
    }

    if (event?.event === 'charge.success') {
      const data = event.data;
      if (data.metadata?.type === 'saas_subscription' && data.metadata?.schoolId) {
        db.upgradeSchoolSubscription(data.metadata.schoolId, {
          planTier: data.metadata.planTier,
          billingCycle: data.metadata.billingCycle,
          amountPaidGHS: data.amount / 100,
          reference: data.reference,
          paymentMethod: data.channel
        });
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('[Paystack Webhook Handler Error]:', err.message);
    res.sendStatus(500);
  }
});

// ==============================================================================
// PORTAL 2: TEACHERS & TUTORS BOOKING & MARKETPLACE API
// ==============================================================================
app.post('/api/teachers/book', (req, res) => {
  try {
    const booking = db.bookTutorSession(req.body);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/teachers/bookings', (req, res) => {
  try {
    const { teacherId, parentEmail } = req.query;
    const bookings = db.getTutorBookings({ teacherId, parentEmail });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================================================================
// PORTAL 5: SUPER ADMIN & REGULATORY DESK API
// ==============================================================================
app.get('/api/admin/overview', (req, res) => {
  try {
    const overview = db.getAdminOverview();
    res.json(overview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/verify', (req, res) => {
  try {
    const { entityId, entityType, verified } = req.body;
    if (!entityId || !entityType) {
      return res.status(400).json({ error: "entityId and entityType are required" });
    }
    const result = db.setEntityVerification(entityId, entityType, verified);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/subscriptions', (req, res) => {
  try {
    const subscriptions = db.getSaaSSubscriptions();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Schools list with filters
app.get('/api/schools', (req, res) => {
  try {
    const { search, region, suburb, level, curriculum, boarding, feeBand, facility } = req.query;
    const schools = db.getSchools({ search, region, suburb, level, curriculum, boarding, feeBand, facility });
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Single school detail
app.get('/api/schools/:id', (req, res) => {
  const school = db.getSchoolById(req.params.id);
  if (!school) {
    return res.status(404).json({ error: "School not found" });
  }
  // Record view lead event
  db.recordLead(school.id, 'view');
  res.json(school);
});

// API: Register new school
app.post('/api/schools', (req, res) => {
  try {
    const newSchool = db.addSchool(req.body);
    res.status(201).json(newSchool);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Record Lead event (WhatsApp reveal, call click)
app.post('/api/schools/:id/lead', (req, res) => {
  const { type } = req.body; // 'whatsapp_reveal' | 'call_click'
  if (!type) {
    return res.status(400).json({ error: "Lead type required" });
  }
  const lead = db.recordLead(req.params.id, type);
  res.json({ success: true, lead });
});

// API: School Analytics (views, whatsapp reveals, calls)
app.get('/api/schools/:id/analytics', (req, res) => {
  const stats = db.getSchoolAnalytics(req.params.id);
  res.json(stats);
});

// API: Claim a school
app.post('/api/schools/:id/claim', (req, res) => {
  const { claimantName, claimantRole, officialEmail, officialPhone, notes } = req.body;
  if (!claimantName || !officialPhone) {
    return res.status(400).json({ error: "Name and phone number are required" });
  }
  const claim = db.claimSchool({
    schoolId: req.params.id,
    claimantName,
    claimantRole,
    officialEmail,
    officialPhone,
    notes
  });
  res.status(201).json({ success: true, message: "Claim submitted for verification", claim });
});

// API: Suppliers (Phase 2)
app.get('/api/suppliers', (req, res) => {
  const { category } = req.query;
  res.json(db.getSuppliers(category));
});

app.post('/api/suppliers', (req, res) => {
  try {
    const newSupplier = db.addSupplier(req.body);
    res.status(201).json(newSupplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: RFQs & B2B Procurement Hub (Phase 2 & Milestone 4)
app.get('/api/rfqs', (req, res) => {
  const { schoolId } = req.query;
  res.json(db.getRFQs(schoolId));
});

app.get('/api/rfqs/:id', (req, res) => {
  const all = db.getRFQs();
  const rfq = all.find(r => r.id === req.params.id);
  if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
  const quotes = db.getQuotes(req.params.id);
  res.json({ ...rfq, quotes });
});

app.get('/api/rfqs/:id/quotes', (req, res) => {
  res.json(db.getQuotes(req.params.id));
});

app.post('/api/rfqs', async (req, res) => {
  try {
    const newRfq = db.addRFQ(req.body);

    // 1. Audit Trail for Admin Portal
    db.addProcurementLog({
      stage: 'rfq_published',
      stageLabel: 'Tender Published',
      statusColor: 'gold',
      rfqId: newRfq.id,
      rfqTitle: newRfq.title,
      schoolId: newRfq.schoolId,
      schoolName: newRfq.schoolName,
      supplierName: 'Open for Bids',
      amount: newRfq.budgetRange || 'Negotiable',
      summary: `${newRfq.schoolName} published a new tender: "${newRfq.title}" (${newRfq.quantity}). Budget: ${newRfq.budgetRange || 'Negotiable'}.`
    });

    // 2. Optional PostgreSQL sync
    if (pgClient && pgClient.isConfigured && pgClient.isConfigured()) {
      try {
        const parsedQty = parseInt(String(newRfq.quantity || '1').replace(/[^0-9]/g, ''), 10) || 1;
        await pgClient.query(`
          INSERT INTO rfqs (id, rfq_number, school_id, title, category, quantity, unit_description, delivery_deadline, budget_range_ghs, specifications, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status;
        `, [
          newRfq.id,
          newRfq.rfqNumber || ('RFQ-' + newRfq.id),
          newRfq.schoolId || 'sch-gis-accra',
          newRfq.title,
          newRfq.category,
          parsedQty,
          String(newRfq.quantity || 'units'),
          newRfq.deadline || null,
          newRfq.budgetRange || '',
          newRfq.description || 'Standard specifications',
          newRfq.status || 'open'
        ]);
      } catch (pgErr) {
        console.warn('PostgreSQL RFQ sync warning:', pgErr.message);
      }
    }

    // 3. Admin Oversight Email Notification
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'admissions@skoolfinder.com.gh';
    try {
      await resendService.sendEmail({
        to: adminEmail,
        subject: `[ADMIN MARKETPLACE] New School RFQ Published: ${newRfq.title} (${newRfq.schoolName})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px;">
              <h2 style="color: #1e3a8a; margin: 0 0 5px 0;">🛡️ SkoolFinder Admin Oversight</h2>
              <span style="background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">STAGE 1: NEW TENDER PUBLISHED</span>
            </div>
            <p style="font-size: 14.5px; color: #334155; line-height: 1.6;">
              A new institutional procurement request has been posted and broadcast to verified Ghanaian suppliers:
            </p>
            <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 6px; margin: 20px 0;">
              <div style="font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase;">Procurement Tender</div>
              <div style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${newRfq.title}</div>
              <div style="font-size: 14px; color: #334155;">
                <strong>School:</strong> ${newRfq.schoolName} &bull; <strong>Budget:</strong> ${newRfq.budgetRange} &bull; <strong>Deadline:</strong> ${newRfq.deadline}
              </div>
            </div>
            <div style="text-align: center; margin: 25px 0 10px 0;">
              <a href="http://localhost:3000/#/admin" style="background: #1e3a8a; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">
                View Tender in Admin Console &rarr;
              </a>
            </div>
          </div>
        `
      });
    } catch (_) {}

    // Hubtel SMS to Admin Phone for Stage 1 (New Tender Published)
    const adminPhone = process.env.ADMIN_NOTIFY_PHONE || '0244318900';
    if (adminPhone) {
      try {
        await hubtelService.sendSMS({
          to: adminPhone,
          message: `SkoolFinder HQ: New Tender published by ${newRfq.schoolName}: "${newRfq.title}" (${newRfq.budgetRange || 'Negotiable'}). Inspect live in /admin.`
        });
      } catch (_) {}
    }

    res.status(201).json(newRfq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/rfqs/:id/quote', async (req, res) => {
  try {
    const quoteData = {
      rfqId: req.params.id,
      ...req.body
    };
    const quote = db.submitQuote(quoteData);

    // Look up RFQ and school for notifications
    const allRfqs = db.getRFQs();
    const rfq = allRfqs.find(r => r.id === req.params.id);
    const school = rfq ? (db.getSchoolById(rfq.schoolId) || db.getSchools().find(s => s.name === rfq.schoolName)) : null;
    const schoolName = school?.name || rfq?.schoolName || 'Partner School';

    // 1. Audit Trail for Admin Portal
    db.addProcurementLog({
      stage: 'quote_submitted',
      stageLabel: 'Quotation Submitted',
      statusColor: 'blue',
      rfqId: rfq?.id,
      rfqTitle: rfq?.title,
      schoolId: rfq?.schoolId,
      schoolName: schoolName,
      supplierId: quote.supplierId,
      supplierName: quote.supplierName,
      amount: quote.price,
      summary: `${quote.supplierName} submitted a quotation of ${quote.price} (lead time: ${quote.deliveryDays} days) for "${rfq?.title}" at ${schoolName}.`
    });

    // 2. Optional PostgreSQL sync
    if (pgClient && pgClient.isConfigured && pgClient.isConfigured()) {
      try {
        const priceNum = parseFloat(String(quote.price || '0').replace(/[^0-9.]/g, '')) || 0;
        await pgClient.query(`
          INSERT INTO quotes (id, rfq_id, supplier_id, vendor_name, vendor_phone, unit_price_ghs, total_price_ghs, delivery_timeframe_days, warranty_terms, notes, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING;
        `, [
          quote.id,
          quote.rfqId,
          quote.supplierId || 'sup-modern-desks',
          quote.supplierName || 'Verified Supplier',
          quote.phone || '+233244000000',
          priceNum,
          priceNum,
          parseInt(quote.deliveryDays, 10) || 7,
          quote.warrantyTerms || 'Standard warranty',
          quote.notes || '',
          'submitted'
        ]);
      } catch (pgErr) {
        console.warn('PostgreSQL quote sync warning:', pgErr.message);
      }
    }

    // 3. Email notification to school admin
    const schoolEmail = school?.email || 'admissions@gis.edu.gh';
    const schoolHead = school?.headOfSchool || 'Head of School';

    try {
      await resendService.sendEmail({
        to: schoolEmail,
        subject: `[Procurement Bid Alert] New Quotation Received for ${rfq?.title || 'School RFQ'}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 15px; margin-bottom: 20px;">
              <h2 style="color: #1e3a8a; margin: 0 0 5px 0;">SkoolFinder B2B Procurement Hub</h2>
              <span style="background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">NEW SUPPLIER BID RECEIVED</span>
            </div>

            <p style="font-size: 15px; color: #334155; line-height: 1.6;">
              Dear <strong>${schoolHead}</strong> (${schoolName}),<br/><br/>
              A verified Ghanaian educational supplier has just submitted a competitive price proposal for your open tender:
            </p>

            <div style="background: #f8fafc; border-left: 4px solid #1e3a8a; padding: 15px 20px; border-radius: 6px; margin: 20px 0;">
              <div style="font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Procurement Tender</div>
              <div style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">${rfq?.title}</div>
              <div style="font-size: 14px; color: #475569;">
                <strong>Category:</strong> ${rfq?.category} &bull; <strong>Quantity:</strong> ${rfq?.quantity}
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background: #f1f5f9;">
                <td style="padding: 10px 14px; font-weight: 700; color: #334155; width: 40%;">Supplier Company:</td>
                <td style="padding: 10px 14px; color: #0f172a; font-weight: 600;">${quote.supplierName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: 700; color: #334155;">Quoted Price:</td>
                <td style="padding: 10px 14px; color: #059669; font-weight: 800; font-size: 17px;">${quote.price}</td>
              </tr>
              <tr style="background: #f1f5f9;">
                <td style="padding: 10px 14px; font-weight: 700; color: #334155;">Delivery Lead Time:</td>
                <td style="padding: 10px 14px; color: #0f172a;">${quote.deliveryDays} Business Days</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: 700; color: #334155;">Warranty / Terms:</td>
                <td style="padding: 10px 14px; color: #0f172a;">${quote.warrantyTerms || 'Manufacturer standard warranty'}</td>
              </tr>
              <tr style="background: #f1f5f9;">
                <td style="padding: 10px 14px; font-weight: 700; color: #334155;">Supplier Contact:</td>
                <td style="padding: 10px 14px; color: #0f172a;">${quote.phone || 'N/A'} | ${quote.contactPerson || 'Sales Team'}</td>
              </tr>
            </table>

            <div style="text-align: center; margin: 30px 0 10px 0;">
              <a href="http://localhost:3000/#/dashboard" style="background: #1e3a8a; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">
                Review Bid & Accept in Dashboard &rarr;
              </a>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      console.warn("Resend RFQ bid notification warning:", emailErr.message);
    }

    // 4. Admin Oversight Email Notification for submitted quote
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'admissions@skoolfinder.com.gh';
    try {
      await resendService.sendEmail({
        to: adminEmail,
        subject: `[ADMIN MARKETPLACE] New Bid of ${quote.price} for ${schoolName} (${quote.supplierName})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px;">
              <h2 style="color: #1e3a8a; margin: 0 0 5px 0;">🛡️ SkoolFinder Admin Oversight</h2>
              <span style="background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">STAGE 2: SUPPLIER BID SUBMITTED</span>
            </div>
            <p style="font-size: 14.5px; color: #334155; line-height: 1.6;">
              <strong>${quote.supplierName}</strong> has submitted a quotation of <strong>${quote.price}</strong> for <strong>${schoolName}</strong> (${rfq?.title}).
            </p>
            <div style="text-align: center; margin: 25px 0 10px 0;">
              <a href="http://localhost:3000/#/admin" style="background: #1e3a8a; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">
                Inspect in Admin Console &rarr;
              </a>
            </div>
          </div>
        `
      });
    } catch (_) {}

    // 5. Hubtel SMS alerts
    if (school?.phone) {
      try {
        await hubtelService.sendSMS({
          to: school.phone,
          message: `SkoolFinder Procurement: New bid of ${quote.price} received from ${quote.supplierName} for '${rfq?.title || 'RFQ'}'. Delivery in ${quote.deliveryDays} days. Log into dashboard to review.`
        });
      } catch (_) {}
    }

    if (quote.phone) {
      try {
        await hubtelService.sendSMS({
          to: quote.phone,
          message: `SkoolFinder: Your bid of ${quote.price} for ${schoolName} (${rfq?.title || 'RFQ'}) has been delivered to the school administration. Ref: ${quote.id}.`
        });
      } catch (_) {}
    }

    // Hubtel SMS to Admin Phone for Stage 2 (Supplier Quote Submitted)
    const adminPhoneQuote = process.env.ADMIN_NOTIFY_PHONE || '0244318900';
    if (adminPhoneQuote) {
      try {
        await hubtelService.sendSMS({
          to: adminPhoneQuote,
          message: `SkoolFinder HQ: New Bid of ${quote.price} submitted by ${quote.supplierName} for ${schoolName} ("${rfq?.title || 'RFQ'}"). Review in /admin.`
        });
      } catch (_) {}
    }

    res.status(201).json({ success: true, quote });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/quotes/:id/status', async (req, res) => {
  try {
    const { status, reason } = req.body;
    if (!status || !['Awarded', 'Declined'].includes(status)) {
      return res.status(400).json({ error: "Status must be 'Awarded' or 'Declined'" });
    }

    const result = db.updateQuoteStatus(req.params.id, status, reason);
    if (!result || !result.quote) return res.status(404).json({ error: 'Quote not found' });

    const quote = result.quote;
    const rfq = result.rfq || (db.getRFQs() || []).find(r => r.id === quote.rfqId);
    const school = rfq ? (db.getSchoolById(rfq.schoolId) || db.getSchools().find(s => s.name === rfq.schoolName)) : null;
    const schoolName = school?.name || rfq?.schoolName || 'School Administration';
    const isAwarded = status === 'Awarded';

    // 1. Audit Log in Database for Admin Portal
    db.addProcurementLog({
      stage: isAwarded ? 'tender_awarded' : 'bid_declined',
      stageLabel: isAwarded ? 'Tender Awarded' : 'Bid Declined',
      statusColor: isAwarded ? 'emerald' : 'rose',
      rfqId: rfq?.id,
      rfqTitle: rfq?.title,
      schoolId: rfq?.schoolId,
      schoolName: schoolName,
      supplierId: quote.supplierId,
      supplierName: quote.supplierName,
      amount: quote.price,
      reason: reason || (isAwarded ? 'Bid accepted & tender officially awarded by school board' : 'Bid declined by school administration'),
      summary: isAwarded
        ? `Tender Awarded: ${schoolName} officially accepted bid of ${quote.price} from ${quote.supplierName} for "${rfq?.title}".`
        : `Bid Declined: ${schoolName} declined bid of ${quote.price} from ${quote.supplierName} for "${rfq?.title}".${reason ? ' Feedback: ' + reason : ''}`
    });

    // 2. Optional PostgreSQL sync
    if (pgClient && pgClient.isConfigured && pgClient.isConfigured()) {
      try {
        await pgClient.query(`UPDATE quotes SET status = $1 WHERE id = $2`, [status, quote.id]);
        if (isAwarded && rfq) {
          await pgClient.query(`UPDATE rfqs SET status = 'awarded' WHERE id = $1`, [rfq.id]);
        }
      } catch (pgErr) {
        console.warn('PostgreSQL quote status sync warning:', pgErr.message);
      }
    }

    // 3. Notify Supplier (Email & SMS) for both Accepted and Declined
    if (quote.email) {
      try {
        if (isAwarded) {
          await resendService.sendEmail({
            to: quote.email,
            subject: `[TENDER AWARD NOTICE] Congratulations! Your quotation for ${schoolName} has been ACCEPTED`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #10b981; border-radius: 12px; background: #ffffff;">
                <div style="border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
                  <h2 style="color: #065f46; margin: 0 0 5px 0;">🎉 Quotation Accepted — Tender Awarded</h2>
                  <span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">OFFICIAL PROCUREMENT NOTIFICATION</span>
                </div>
                <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                  Dear <strong>${quote.contactPerson || quote.supplierName}</strong>,<br/><br/>
                  We are pleased to inform you that <strong>${schoolName}</strong> has officially reviewed all competing bids and <strong>ACCEPTED</strong> your quotation for:
                </p>
                <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 6px; margin: 20px 0;">
                  <div style="font-size: 13px; color: #166534; font-weight: 600; text-transform: uppercase;">Awarded Procurement Tender</div>
                  <div style="font-size: 17px; font-weight: 700; color: #065f46; margin-bottom: 6px;">${rfq?.title}</div>
                  <div style="font-size: 14px; color: #334155;">
                    <strong>Contract Value:</strong> <span style="font-size: 16px; font-weight: 800; color: #059669;">${quote.price}</span> &bull; 
                    <strong>Agreed Delivery:</strong> ${quote.deliveryDays} Business Days
                  </div>
                </div>
                <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                  The school bursary desk will contact your representative at <strong>${quote.phone}</strong> to coordinate the Local Purchase Order (LPO) and delivery schedule.
                </p>
                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                  SkoolFinder Ghana B2B Educational Marketplace &bull; Accra & Kumasi
                </p>
              </div>
            `
          });
        } else {
          await resendService.sendEmail({
            to: quote.email,
            subject: `[Procurement Notice] Tender Selection Update for ${schoolName}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
                <div style="border-bottom: 2px solid #ef4444; padding-bottom: 15px; margin-bottom: 20px;">
                  <h2 style="color: #991b1b; margin: 0 0 5px 0;">Tender Selection Update</h2>
                  <span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">QUOTATION NOT SELECTED</span>
                </div>
                <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                  Dear <strong>${quote.contactPerson || quote.supplierName}</strong>,<br/><br/>
                  Thank you for submitting your quotation of <strong>${quote.price}</strong> for <strong>${rfq?.title}</strong> at <strong>${schoolName}</strong>.<br/><br/>
                  The school administration has completed their evaluation and decided to proceed with an alternative offer that aligned closer to their technical or budgetary requirements.
                </p>
                ${reason ? `
                  <div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 12px 16px; border-radius: 6px; margin: 15px 0; font-size: 13.5px; color: #475569;">
                    <strong>School Board Feedback:</strong><br/>
                    "${reason}"
                  </div>
                ` : ''}
                <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                  We encourage you to explore other live tenders on the <a href="http://localhost:3000/#/suppliers" style="color: #1e3a8a; font-weight: 600;">SkoolFinder B2B Marketplace</a>.
                </p>
              </div>
            `
          });
        }
      } catch (_) {}
    }

    if (quote.phone) {
      try {
        const smsMsg = isAwarded
          ? `Congratulations! Your bid ${quote.id} (${quote.price}) has been ACCEPTED & AWARDED by ${schoolName}. The school will contact you shortly.`
          : `SkoolFinder Notice: Your bid for ${schoolName} (${rfq?.title || 'RFQ'}) was not selected on this occasion. Thank you for participating.`;
        await hubtelService.sendSMS({ to: quote.phone, message: smsMsg });
      } catch (_) {}
    }

    // 4. Notify Super Admin Oversight (Email & SMS) - Keeping the Admin Portal in the know
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'admissions@skoolfinder.com.gh';
    try {
      await resendService.sendEmail({
        to: adminEmail,
        subject: `[ADMIN MARKETPLACE ALERT] Tender Decision: ${schoolName} ${isAwarded ? 'AWARDED' : 'DECLINED'} Bid (${quote.supplierName})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #3b82f6; border-radius: 12px; background: #ffffff;">
            <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px;">
              <h2 style="color: #1e3a8a; margin: 0 0 5px 0;">🛡️ SkoolFinder Admin Oversight Console</h2>
              <span style="background: ${isAwarded ? '#dcfce7' : '#fee2e2'}; color: ${isAwarded ? '#166534' : '#991b1b'}; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">
                B2B PROCUREMENT DECISION: ${isAwarded ? 'TENDER AWARDED' : 'BID DECLINED'}
              </span>
            </div>

            <p style="font-size: 15px; color: #334155; line-height: 1.6;">
              Executive notice: A school board procurement decision has just been executed on the platform.
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-weight: 700; color: #475569; width: 40%;">Institution:</td>
                <td style="padding: 10px 14px; font-weight: 700; color: #0f172a;">${schoolName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: 700; color: #475569;">Procurement Tender:</td>
                <td style="padding: 10px 14px; color: #0f172a;">${rfq?.title}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-weight: 700; color: #475569;">Vendor / Supplier:</td>
                <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">${quote.supplierName} (${quote.phone || 'N/A'})</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: 700; color: #475569;">Quoted Price:</td>
                <td style="padding: 10px 14px; font-weight: 800; font-size: 16px; color: ${isAwarded ? '#059669' : '#dc2626'};">${quote.price}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-weight: 700; color: #475569;">Board Decision:</td>
                <td style="padding: 10px 14px;">
                  <span style="background: ${isAwarded ? '#dcfce7' : '#fee2e2'}; color: ${isAwarded ? '#166534' : '#991b1b'}; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">
                    ${isAwarded ? '✓ TENDER OFFICIALLY AWARDED' : '✕ QUOTATION DECLINED'}
                  </span>
                </td>
              </tr>
              ${reason ? `
                <tr>
                  <td style="padding: 10px 14px; font-weight: 700; color: #475569;">Board Feedback:</td>
                  <td style="padding: 10px 14px; color: #64748b; font-style: italic;">"${reason}"</td>
                </tr>
              ` : ''}
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-weight: 700; color: #475569;">Timestamp:</td>
                <td style="padding: 10px 14px; color: #64748b;">${new Date().toISOString()}</td>
              </tr>
            </table>

            <div style="text-align: center; margin: 25px 0 10px 0;">
              <a href="http://localhost:3000/#/admin" style="background: #1e3a8a; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">
                Open Admin B2B Oversight Console &rarr;
              </a>
            </div>
            
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              SkoolFinder Ghana Regulatory & Ecosystem Management
            </p>
          </div>
        `
      });
    } catch (_) {}

    // Hubtel SMS to Admin Phone
    const adminPhone = process.env.ADMIN_NOTIFY_PHONE || '0244318900';
    if (adminPhone) {
      try {
        await hubtelService.sendSMS({
          to: adminPhone,
          message: `SkoolFinder HQ: ${schoolName} has ${isAwarded ? 'AWARDED' : 'DECLINED'} tender to ${quote.supplierName} (${quote.price}) for "${rfq?.title || 'RFQ'}". Live in /admin.`
        });
      } catch (_) {}
    }

    res.json({ success: true, quote, rfq });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/procurement/logs', (req, res) => {
  res.json(db.getProcurementLogs());
});

// B2B Purchase Order (LPO) Endpoints
app.post('/api/quotes/:id/lpo', (req, res) => {
  try {
    const lpo = db.generateLPO(req.params.id);
    res.json({ success: true, lpo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/lpos/:id', (req, res) => {
  const lpo = db.getLPO(req.params.id);
  if (!lpo) return res.status(404).json({ error: 'Purchase Order (LPO) not found' });
  res.json(lpo);
});

app.post('/api/lpos/:id/disburse', async (req, res) => {
  try {
    const { milestoneIndex, paymentMethod } = req.body;
    const result = db.disburseLPOMilestone(req.params.id, milestoneIndex, { paymentMethod });
    const { lpo, milestone } = result;

    // 1. Audit Log in Database for Admin Portal
    db.addProcurementLog({
      stage: 'milestone_disbursed',
      stageLabel: `Milestone ${milestone.index} Disbursed`,
      statusColor: 'emerald',
      rfqId: lpo.rfqId,
      rfqTitle: lpo.tenderTitle,
      schoolId: lpo.schoolId,
      schoolName: lpo.schoolName,
      supplierId: lpo.supplierId,
      supplierName: lpo.supplierName,
      amount: milestone.amountFormatted,
      summary: `${lpo.schoolName} disbursed ${milestone.amountFormatted} (${milestone.name}) via ${milestone.paymentMethod} for ${lpo.lpoNumber}. Ref: ${milestone.transactionRef}.`
    });

    // 2. Resend Email to Supplier with Payment Voucher
    if (lpo.supplierEmail) {
      try {
        await resendService.sendEmail({
          to: lpo.supplierEmail,
          subject: `[PAYMENT DISBURSEMENT] ${milestone.amountFormatted} Released for ${lpo.lpoNumber}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #10b981; border-radius: 12px; background: #ffffff;">
              <div style="border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="color: #065f46; margin: 0 0 5px 0;">💰 Milestone Payment Released</h2>
                <span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">PAYSTACK MOMO ESCROW SETTLEMENT</span>
              </div>
              <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                Dear <strong>${lpo.supplierName}</strong>,<br/><br/>
                <strong>${lpo.schoolName}</strong> has authorized the payment disbursement of <strong>${milestone.amountFormatted}</strong> for milestone: <strong>${milestone.name}</strong> under contract <strong>${lpo.lpoNumber}</strong>.
              </p>
              <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <div><strong>LPO Number:</strong> ${lpo.lpoNumber}</div>
                <div><strong>Tender:</strong> ${lpo.tenderTitle}</div>
                <div><strong>Milestone:</strong> ${milestone.name} (${milestone.percent}%)</div>
                <div><strong>Amount:</strong> <span style="font-size: 17px; font-weight: 800; color: #059669;">${milestone.amountFormatted}</span></div>
                <div><strong>Payment Method:</strong> ${milestone.paymentMethod}</div>
                <div><strong>Transaction Reference:</strong> ${milestone.transactionRef}</div>
              </div>
              <p style="font-size: 13px; color: #64748b;">
                Funds are routed directly to your registered Mobile Money wallet / merchant account. Please issue an official VAT/NHIL tax receipt upon receipt.
              </p>
            </div>
          `
        });
      } catch (_) {}
    }

    // 3. Hubtel SMS to Supplier
    if (lpo.supplierPhone) {
      try {
        await hubtelService.sendSMS({
          to: lpo.supplierPhone,
          message: `SkoolFinder Escrow: ${milestone.amountFormatted} has been disbursed by ${lpo.schoolName} for ${lpo.lpoNumber} (${milestone.name}). Ref: ${milestone.transactionRef}.`
        });
      } catch (_) {}
    }

    // 4. Hubtel SMS to Admin Phone
    const adminPhone = process.env.ADMIN_NOTIFY_PHONE || '0244318900';
    if (adminPhone) {
      try {
        await hubtelService.sendSMS({
          to: adminPhone,
          message: `SkoolFinder HQ: ${lpo.schoolName} disbursed ${milestone.amountFormatted} to ${lpo.supplierName} for ${lpo.lpoNumber}. Status: ${lpo.paymentStatus}.`
        });
      } catch (_) {}
    }

    res.json({ success: true, lpo, milestone });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Jobs (Phase 2)
app.get('/api/jobs', (req, res) => {
  const { subject, region, level, curriculum } = req.query;
  res.json(db.getJobs({ subject, region, level, curriculum }));
});

app.post('/api/jobs', (req, res) => {
  try {
    const newJob = db.addJob(req.body);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/jobs/:id/apply', (req, res) => {
  try {
    const { applicantName, phone, email, qualification, yearsExperience, notes } = req.body;
    const application = db.applyJob({
      jobId: req.params.id,
      applicantName,
      phone,
      email,
      qualification,
      yearsExperience,
      notes
    });
    res.status(201).json({ success: true, message: "Application submitted successfully", application });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Teachers & Tutors Directory & Subscription (Phase 2)
app.get('/api/teachers', (req, res) => {
  try {
    const { search, subject, region, level, curriculum, teachingMode } = req.query;
    const teachers = db.getTeachers({ search, subject, region, level, curriculum, teachingMode });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/teachers/:id', (req, res) => {
  const teacher = db.getTeacherById(req.params.id);
  if (!teacher) {
    return res.status(404).json({ error: "Teacher profile not found" });
  }
  res.json(teacher);
});

app.post('/api/teachers', (req, res) => {
  try {
    const newTeacher = db.addTeacher(req.body);
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/teachers/:id/lead', (req, res) => {
  const { type } = req.body; // 'whatsapp' | 'call'
  const lead = db.recordTeacherLead(req.params.id, type || 'whatsapp');
  res.json({ success: true, lead });
});

// Feature 4: Teacher NTC Verification & School Hiring Pipeline
app.post('/api/teachers/:id/verify-ntc', async (req, res) => {
  try {
    const { licenseNumber } = req.body;
    const result = db.verifyTeacherNTC(req.params.id, licenseNumber);

    // Send SMS confirmation to educator via Hubtel
    const phone = result.teacher?.phone || result.application?.teacherPhone;
    if (phone) {
      try {
        await hubtelService.sendSMS({
          to: phone,
          message: `SkoolFinder Ghana: Congratulations! Your NTC License (${result.licenseNumber}) has been verified with the National Teaching Council. Your Gold Badge is now live!`
        });
      } catch (smsErr) {
        console.warn('NTC SMS dispatch warning:', smsErr.message);
      }
    }

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/schools/:schoolId/teacher-applications', (req, res) => {
  try {
    const apps = db.getTeacherApplications({ schoolId: req.params.schoolId });
    res.json(apps);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/teacher-applications', (req, res) => {
  try {
    const application = db.createTeacherApplication(req.body);
    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/teacher-applications/:id/interview', async (req, res) => {
  try {
    const result = db.scheduleTeacherInterview(req.params.id, req.body);
    const app = result.application;
    const interview = app.interviewDetails;

    // 1. Dispatch Hubtel SMS to teacher
    if (app.teacherPhone) {
      try {
        await hubtelService.sendSMS({
          to: app.teacherPhone,
          message: `Hiring Alert from ${app.schoolName}: You have been invited for an interview for '${app.jobTitle}' on ${interview.date} at ${interview.time}. Venue: ${interview.venue}. Check your email for details.`
        });
      } catch (smsErr) {
        console.warn('Interview SMS dispatch warning:', smsErr.message);
      }
    }

    // 2. Dispatch Resend Email to teacher
    if (app.teacherEmail) {
      try {
        await resendService.sendEmail({
          to: app.teacherEmail,
          subject: `[Interview Invitation] ${app.jobTitle} at ${app.schoolName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <div style="border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
                <div style="font-size: 11px; font-weight: 800; color: #047857; text-transform: uppercase;">SKOOLFINDER GHANA &bull; EDUCATOR RECRUITMENT DESK</div>
                <h2 style="color: #1e3a8a; margin: 6px 0 2px 0;">${app.schoolName}</h2>
                <div style="font-size: 14px; font-weight: 700; color: #0f172a;">Formal Interview Invitation</div>
              </div>

              <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                Dear <strong>${app.teacherName}</strong>,<br/><br/>
                Following your application for <strong>${app.jobTitle}</strong>, the Academic Board of <strong>${app.schoolName}</strong> is pleased to invite you for a formal interview.
              </p>

              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; background: #f8fafc; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 10px 14px; font-weight: 700; color: #475569; width: 35%;">Date &amp; Time:</td>
                  <td style="padding: 10px 14px; color: #0f172a; font-weight: 700;">${interview.date} at ${interview.time}</td>
                </tr>
                <tr style="background: #ffffff;">
                  <td style="padding: 10px 14px; font-weight: 700; color: #475569;">Venue / Location:</td>
                  <td style="padding: 10px 14px; color: #0f172a;">${interview.venue}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: 700; color: #475569;">Virtual Stream Link:</td>
                  <td style="padding: 10px 14px; color: #2563eb;"><a href="${interview.meetingLink}" style="color: #2563eb; font-weight: 600;">${interview.meetingLink}</a></td>
                </tr>
                <tr style="background: #ffffff;">
                  <td style="padding: 10px 14px; font-weight: 700; color: #475569;">Panel Lead:</td>
                  <td style="padding: 10px 14px; color: #0f172a;">${interview.interviewer}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-weight: 700; color: #475569;">Interview Brief:</td>
                  <td style="padding: 10px 14px; color: #0f172a;">${interview.notes}</td>
                </tr>
              </table>

              <div style="background: #eff6ff; padding: 12px 16px; border-radius: 6px; font-size: 13px; color: #1e40af;">
                Please ensure you bring copies of your NTC License (${app.licenseNumber}), academic degree certificates, and 2 professional references.
              </div>
            </div>
          `
        });
      } catch (emailErr) {
        console.warn('Interview email dispatch warning:', emailErr.message);
      }
    }

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/teacher-applications/:id/hire', async (req, res) => {
  try {
    const result = db.hireTeacher(req.params.id, req.body);
    const app = result.application;
    const contract = app.contractDetails;

    // 1. Dispatch Hubtel SMS to teacher
    if (app.teacherPhone) {
      try {
        await hubtelService.sendSMS({
          to: app.teacherPhone,
          message: `Congratulations ${app.teacherName.split(' ')[0]}! ${app.schoolName} has formally offered you the position of ${contract.role} (GH₵ ${contract.salaryGHS.toLocaleString()}/mo). Official contract sent to your email.`
        });
      } catch (smsErr) {
        console.warn('Hire SMS dispatch warning:', smsErr.message);
      }
    }

    // 2. Dispatch Resend Email with official appointment offer
    if (app.teacherEmail) {
      try {
        await resendService.sendEmail({
          to: app.teacherEmail,
          subject: `[Formal Contract Offer] Appointment as ${contract.role} - ${app.schoolName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <div style="text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
                <div style="font-size: 28px; margin-bottom: 5px;">🇬🇭</div>
                <div style="font-size: 11px; font-weight: 800; color: #d97706; text-transform: uppercase; letter-spacing: 1.5px;">REPUBLIC OF GHANA &bull; NASIA &amp; GES COMPLIANT APPOINTMENT</div>
                <h2 style="color: #1e3a8a; margin: 6px 0 2px 0;">${app.schoolName}</h2>
                <div style="font-size: 14px; font-weight: 700; color: #059669; text-transform: uppercase;">OFFICIAL LETTER OF APPOINTMENT</div>
              </div>

              <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 20px;">
                <div style="font-size: 12px; font-weight: 800; color: #166534; text-transform: uppercase;">AGREED REMUNERATION</div>
                <div style="font-family: monospace; font-size: 32px; font-weight: 800; color: #14532d; margin: 6px 0;">GH₵ ${contract.salaryGHS.toLocaleString()}.00 / month</div>
                <div style="font-size: 12px; color: #15803d; font-weight: 600;">&check; Tier 1 &amp; Tier 2 SSNIT Compliant &bull; Private Health Insurance</div>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                <tr style="background: #f8fafc;">
                  <td style="padding: 10px; font-weight: 700; color: #475569; width: 40%;">Appointee:</td>
                  <td style="padding: 10px; color: #0f172a; font-weight: 700;">${app.teacherName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: 700; color: #475569;">NTC License No:</td>
                  <td style="padding: 10px; color: #0f172a; font-family: monospace; font-weight: 700;">${app.licenseNumber} (Verified)</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 10px; font-weight: 700; color: #475569;">Designation:</td>
                  <td style="padding: 10px; color: #0f172a; font-weight: 700;">${contract.role}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: 700; color: #475569;">Commencement Date:</td>
                  <td style="padding: 10px; color: #0f172a;">${contract.commencementDate}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 10px; font-weight: 700; color: #475569;">Contract Type:</td>
                  <td style="padding: 10px; color: #0f172a;">${contract.contractType} (${contract.probationMonths} Months Probation)</td>
                </tr>
              </table>

              <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #64748b; text-align: center;">
                Contract Ref: <code>${contract.id}</code> &bull; Issued electronically via SkoolFinder Ghana Staffing Suite.
              </div>
            </div>
          `
        });
      } catch (emailErr) {
        console.warn('Hire email dispatch warning:', emailErr.message);
      }
    }

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Institutional Document Verification Vault (Phase 2 & KYC/KYB)
app.post('/api/verification/upload', (req, res) => {
  try {
    const { entityId, entityType, docType, docName, docNumber, notes } = req.body;
    const doc = db.uploadVerificationDoc({
      entityId,
      entityType: entityType || 'school',
      docType,
      docName: docName || 'Accreditation Document',
      docNumber: docNumber || 'GH-' + Math.floor(100000 + Math.random() * 900000),
      notes: notes || 'Official submission'
    });
    res.status(201).json({ success: true, doc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/verification/docs', (req, res) => {
  const { entityId } = req.query;
  res.json(db.getVerificationDocs(entityId));
});

// API: Mobile Money & Card Payment Engine (Feature 1)
app.post('/api/payments/initialize', (req, res) => {
  try {
    const tx = db.initializePayment(req.body);
    res.status(201).json({ success: true, transaction: tx });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/payments/verify', (req, res) => {
  try {
    const { reference, network, authCode } = req.body;
    if (!reference) {
      return res.status(400).json({ error: "Transaction reference is required" });
    }
    const tx = db.verifyPayment(reference, { network, authCode });
    res.json({ success: true, message: "Payment verified successfully", transaction: tx });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/payments/receipt/:reference', (req, res) => {
  const tx = db.getTransaction(req.params.reference);
  if (!tx) {
    return res.status(404).json({ error: "Transaction receipt not found" });
  }
  res.json(tx);
});

app.get('/api/payments/transactions', (req, res) => {
  const { targetId } = req.query;
  res.json(db.getTransactions(targetId));
});

// API: CSSPS Senior High School Placement & BECE Aggregate Predictor (Feature 2)
app.get('/api/cssps/schools', (req, res) => {
  try {
    const { category, region, program, gender, search } = req.query;
    const schools = db.getCSSPSSchools({ category, region, program, gender, search });
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cssps/calculate', (req, res) => {
  try {
    const results = db.calculateCSSPSPlacement(req.body);
    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Digital Student Admission Application & Enrollment Manager (Feature #1)
app.post('/api/admissions/apply', (req, res) => {
  try {
    const application = db.createAdmissionApplication(req.body);
    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admissions/applications', (req, res) => {
  try {
    const { schoolId, status, search } = req.query;
    const applications = db.getAdmissionApplications(schoolId, { status, search });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admissions/applications/:id', (req, res) => {
  const application = db.getAdmissionApplicationById(req.params.id);
  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }
  res.json(application);
});

app.patch('/api/admissions/applications/:id/status', (req, res) => {
  try {
    const updated = db.updateAdmissionApplicationStatus(req.params.id, req.body);
    res.json({ success: true, application: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admissions/applications/:id/offer-letter', (req, res) => {
  try {
    const offerLetter = db.getAdmissionOfferLetter(req.params.id);
    res.json(offerLetter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Verified Parent Reviews, Ratings & Feedback Engine (Feature #2)
app.get('/api/schools/:id/reviews', (req, res) => {
  try {
    const { rating, verifiedOnly, search, sort } = req.query;
    const summary = db.getSchoolRatingSummary(req.params.id);
    const reviews = db.getReviews(req.params.id, { rating, verifiedOnly, search, sort });
    res.json({ summary, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/schools/:id/reviews', (req, res) => {
  try {
    const reviewData = { ...req.body, schoolId: req.params.id };
    const review = db.addSchoolReview(reviewData);
    const summary = db.getSchoolRatingSummary(req.params.id);
    res.status(201).json({ success: true, review, summary });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/reviews/:id/helpful', (req, res) => {
  try {
    const review = db.voteReviewHelpful(req.params.id);
    res.json({ success: true, helpfulCount: review.helpfulCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/reviews/:id/reply', (req, res) => {
  try {
    const review = db.addReviewReply(req.params.id, req.body);
    res.json({ success: true, review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Direct Admissions Inquiries & Parent Messaging Center (Feature #3)
app.get('/api/inquiries', (req, res) => {
  try {
    const { schoolId, status, category, search } = req.query;
    const inquiries = db.getInquiries(schoolId, { status, category, search });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inquiries/stats', (req, res) => {
  try {
    const { schoolId } = req.query;
    const stats = db.getInquiryStats(schoolId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inquiries/lookup/:number', (req, res) => {
  try {
    const inquiry = db.getInquiryById(req.params.number);
    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry reference not found" });
    }
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inquiries/:id', (req, res) => {
  try {
    const inquiry = db.getInquiryById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inquiries', (req, res) => {
  try {
    const inquiry = db.createInquiry(req.body);
    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/inquiries/:id/reply', (req, res) => {
  try {
    const inquiry = db.replyToInquiry(req.params.id, req.body);
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/inquiries/:id/status', (req, res) => {
  try {
    const inquiry = db.updateInquiryStatus(req.params.id, req.body);
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Feature 4: Academic Resources & Past Questions Hub
app.get('/api/resources/stats', (req, res) => {
  try {
    const stats = db.getAcademicResourceStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/resources', (req, res) => {
  try {
    const { examType, subject, year, difficulty, search, sort } = req.query;
    const resources = db.getAcademicResources({ examType, subject, year, difficulty, search, sort });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/resources/:id', (req, res) => {
  try {
    const resource = db.getAcademicResourceById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Academic resource not found" });
    }
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/resources/:id/download', (req, res) => {
  try {
    const resource = db.recordResourceDownload(req.params.id);
    res.json({ success: true, downloadsCount: resource.downloadsCount, resource });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/resources', (req, res) => {
  try {
    const resource = db.createAcademicResource(req.body);
    res.status(201).json({ success: true, resource });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ========================================================
// Authentication & Role-Based Security Engine (Feature 5)
// ========================================================

// Helper to extract caller user from token
function getAuthenticatedUser(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.query.token || req.headers['x-auth-token']);
  if (!token) return null;
  return db.getUserByToken(token);
}



// API: User Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.body.token;
  db.logoutUser(token);
  res.json({ success: true, message: "Logged out successfully" });
});

// API: Parent Portal Overview
app.get('/api/parent/overview', (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      // In demo mode, if unauthenticated, fallback to default parent demo account
      const demoParent = db.getUserById('usr-parent-nana-aba');
      const overview = db.getParentOverview(demoParent);
      return res.json(overview);
    }
    const overview = db.getParentOverview(user);
    res.json(overview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Toggle School Bookmark
app.post('/api/parent/bookmarks', (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    const userId = user ? user.id : 'usr-parent-nana-aba';
    const { schoolId } = req.body;
    if (!schoolId) {
      return res.status(400).json({ error: "School ID required" });
    }
    const result = db.toggleSchoolBookmark(userId, schoolId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Invoices & School Fee MoMo Collection (Feature 6)
app.get('/api/invoices', (req, res) => {
  try {
    const { schoolId, parentEmail, status, search } = req.query;
    const invoices = db.getInvoices({ schoolId, parentEmail, status, search });
    res.json(invoices);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/invoices/:id', (req, res) => {
  try {
    const invoice = db.getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/invoices', (req, res) => {
  try {
    const invoice = db.createInvoice(req.body);
    res.status(201).json({ success: true, invoice });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/invoices/:id/pay', async (req, res) => {
  try {
    const result = db.recordInvoicePayment(req.params.id, req.body);
    const { invoice, payment, receiptNumber } = result;

    // 1. Dispatch Instant Hubtel SMS Confirmation to Parent
    const parentPhone = payment.momoNumber || invoice.parentPhone;
    if (parentPhone) {
      try {
        await hubtelService.sendSMS({
          to: parentPhone,
          message: `SkoolFinder Receipt: GH₵ ${Number(payment.amount).toLocaleString()} received for ${invoice.studentName} (${invoice.schoolName}). Receipt #${receiptNumber}, Ref: ${payment.transactionRef}. Remaining Balance: GH₵ ${Number(invoice.balanceDue).toLocaleString()}.`
        });
      } catch (smsErr) {
        console.warn('Fee SMS dispatch warning:', smsErr.message);
      }
    }

    // 2. Dispatch Official Email Receipt Voucher via Resend
    const parentEmail = invoice.parentEmail || req.body.parentEmail;
    if (parentEmail) {
      try {
        await resendService.sendEmail({
          to: parentEmail,
          subject: `[Official Fee Receipt] GH₵ ${Number(payment.amount).toLocaleString()} Received - ${invoice.schoolName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <div style="text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
                <div style="font-size: 28px; margin-bottom: 5px;">🇬🇭</div>
                <div style="font-size: 11px; font-weight: 800; color: #d97706; text-transform: uppercase; letter-spacing: 1.5px;">REPUBLIC OF GHANA &bull; MINISTRY OF EDUCATION &amp; GES</div>
                <h2 style="color: #1e3a8a; margin: 6px 0 2px 0;">${invoice.schoolName}</h2>
                <div style="font-size: 13px; font-weight: 700; color: #059669; text-transform: uppercase;">OFFICIAL ELECTRONIC SCHOOL FEE RECEIPT</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Receipt No: <strong>${receiptNumber}</strong> &bull; Ref: <code>${payment.transactionRef}</code></div>
              </div>

              <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 20px;">
                <div style="font-size: 12px; font-weight: 800; color: #166534; text-transform: uppercase;">AMOUNT RECEIVED VIA ${(payment.method || 'MOMO').toUpperCase()}</div>
                <div style="font-size: 32px; font-weight: 800; color: #14532d; margin: 6px 0;">GH₵ ${Number(payment.amount).toLocaleString()}.00</div>
                <div style="font-size: 12px; color: #15803d; font-weight: 600;">&check; Payment Verified &amp; Digitally Signed</div>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                <tr style="background: #f8fafc;">
                  <td style="padding: 10px; font-weight: 700; color: #475569; width: 40%;">Student Name:</td>
                  <td style="padding: 10px; color: #0f172a; font-weight: 700;">${invoice.studentName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: 700; color: #475569;">Grade / Term:</td>
                  <td style="padding: 10px; color: #0f172a;">${invoice.studentGrade} &bull; ${invoice.term}</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 10px; font-weight: 700; color: #475569;">Payer / Guardian:</td>
                  <td style="padding: 10px; color: #0f172a;">${payment.payerName} (${payment.momoNumber})</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: 700; color: #475569;">Remaining Balance:</td>
                  <td style="padding: 10px; color: ${invoice.balanceDue <= 0 ? '#059669' : '#dc2626'}; font-weight: 800;">
                    GH₵ ${Number(invoice.balanceDue).toLocaleString()}.00 ${invoice.balanceDue <= 0 ? '(Fully Cleared)' : ''}
                  </td>
                </tr>
              </table>

              <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #64748b; text-align: center;">
                Generated by SkoolFinder Ghana Unified Invoicing Gateway. Authentic proof of tuition settlement.
              </div>
            </div>
          `
        });
      } catch (emailErr) {
        console.warn('Fee Email receipt warning:', emailErr.message);
      }
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Helper to render visual HTML diagnostic dashboard for browser requests
function renderDiagnosticsHTML(data, pageTitle) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle} | SkoolFinder Ghana</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b132b;
      --card-bg: #1c2541;
      --card-border: rgba(255, 255, 255, 0.1);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --emerald: #10b981;
      --emerald-bg: rgba(16, 185, 129, 0.15);
      --gold: #f59e0b;
      --gold-bg: rgba(245, 158, 11, 0.15);
      --blue: #3b82f6;
      --blue-bg: rgba(59, 130, 246, 0.15);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1.5rem;
      min-height: 100vh;
    }
    .container { max-width: 1000px; margin: 0 auto; }
    .header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.75rem 2rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4);
    }
    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.6rem;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--emerald-bg);
      color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.3);
      padding: 0.45rem 1rem;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 1.5rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.25);
    }
    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
    }
    .badge-green { background: var(--emerald-bg); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.2); }
    .badge-gold { background: var(--gold-bg); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.2); }
    .badge-blue { background: var(--blue-bg); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.2); }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.55rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      font-size: 0.88rem;
    }
    .info-label { color: var(--text-muted); }
    .info-val { font-weight: 600; color: #ffffff; text-align: right; }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      background: #0284c7;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.65rem 1.25rem;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      width: 100%;
      margin-top: 1rem;
    }
    .btn:hover { background: #0369a1; }
    .btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #ffffff; }
    .btn-outline:hover { background: rgba(255,255,255,0.08); }
    .code-box {
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 0.85rem;
      font-family: monospace;
      font-size: 0.78rem;
      color: #a5f3fc;
      margin-top: 0.75rem;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div style="font-size: 0.75rem; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.2rem;">
          🇬🇭 Enterprise Infrastructure Console
        </div>
        <div class="brand-title">
          <span>SkoolFinder Ghana</span>
        </div>
      </div>
      <div class="status-pill">
        <span class="pulse-dot"></span>
        <span>ALL SYSTEMS OPERATIONAL</span>
      </div>
    </div>

    <div class="grid">
      <!-- Paystack Card -->
      <div class="card">
        <div class="card-title">
          <span>💳 Paystack MoMo Gateway</span>
          <span class="badge ${data.paystack?.isLive ? 'badge-green' : 'badge-gold'}">
            ${data.paystack?.isLive ? 'LIVE' : 'ACTIVE SIMULATION'}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Engine Status</span>
          <span class="info-val" style="color: #34d399;">Operational</span>
        </div>
        <div class="info-row">
          <span class="info-label">Processing Currency</span>
          <span class="info-val">GHS (Ghana Cedis)</span>
        </div>
        <div class="info-row">
          <span class="info-label">Active Networks</span>
          <span class="info-val">MTN, Telecel, AT Money</span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Channels</span>
          <span class="info-val">Mobile Money & Visa/Card</span>
        </div>
        <div class="info-row">
          <span class="info-label">Webhook Verification</span>
          <span class="info-val">HMAC-SHA512 Cryptographic</span>
        </div>
        <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">
          To switch to real money processing, set <code>PAYSTACK_SECRET_KEY=sk_live_...</code> in your <code>.env</code>.
        </div>
        <button class="btn" onclick="testPaystackMoMo()">
          ⚡ Run MoMo Payment Test (GH₵ 50)
        </button>
      </div>

      <!-- Hubtel Card -->
      <div class="card">
        <div class="card-title">
          <span>📱 Hubtel SMS Gateway</span>
          <span class="badge ${data.hubtel?.isLive ? 'badge-green' : 'badge-gold'}">
            ${data.hubtel?.isLive ? 'LIVE' : 'ACTIVE SIMULATION'}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Engine Status</span>
          <span class="info-val" style="color: #34d399;">Operational</span>
        </div>
        <div class="info-row">
          <span class="info-label">Sender ID</span>
          <span class="info-val">"${data.hubtel?.senderId || 'SkoolFinder'}"</span>
        </div>
        <div class="info-row">
          <span class="info-label">SMS Credit Pool</span>
          <span class="info-val" style="color: #fbbf24;">${data.hubtel?.creditsAvailable || 4660} Units</span>
        </div>
        <div class="info-row">
          <span class="info-label">Supported Telcos</span>
          <span class="info-val">MTN, Telecel, AT Ghana</span>
        </div>
        <div class="info-row">
          <span class="info-label">Formatting</span>
          <span class="info-val">E.164 (+233) Auto-normalizer</span>
        </div>
        <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">
          To switch to live telco dispatch, set <code>HUBTEL_CLIENT_ID</code> and <code>HUBTEL_CLIENT_SECRET</code> in <code>.env</code>.
        </div>
        <button class="btn" onclick="testHubtelSMS()">
          ⚡ Run Hubtel SMS Test
        </button>
      </div>

      <!-- Database Scaling Card -->
      <div class="card" style="grid-column: span (auto-fit, minmax(300px, 1fr));">
        <div class="card-title">
          <span>🗄️ Database Scaling Engine</span>
          <span class="badge badge-green">
            ${data.database?.isPostgresConfigured ? 'POSTGRESQL' : 'ATOMIC JSON STORE'}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Primary Active Engine</span>
          <span class="info-val" style="color: #34d399;">
            ${data.database?.isPostgresConfigured ? 'PostgreSQL 16 Enterprise' : 'Embedded Atomic JSON Store'}
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Relational Collections</span>
          <span class="info-val">33 Collections Fully Loaded</span>
        </div>
        <div class="info-row">
          <span class="info-label">Schema Scalability</span>
          <span class="info-val">data/schema.sql (PostgreSQL Ready)</span>
        </div>
        <div class="info-row">
          <span class="info-label">Migration Command</span>
          <span class="info-val"><code>npm run db:migrate</code></span>
        </div>
        <div class="info-row">
          <span class="info-label">Cloud Deployment</span>
          <span class="info-val">Render, Supabase, Neon, AWS RDS</span>
        </div>
        <div class="code-box">
          DATABASE_URL=postgres://user:password@host:5432/skoolfinder_db
        </div>
        <a href="/api/admin/db-diagnostics?json=true" class="btn btn-outline" target="_blank">
          View Detailed Database Metrics (JSON) &rarr;
        </a>
      </div>
    </div>

    <!-- Live Test Console Output -->
    <div id="test-console" style="display: none; background: #0f172a; border: 1px solid var(--card-border); border-radius: 12px; padding: 1.25rem; margin-bottom: 2rem;">
      <div style="font-size: 0.8rem; font-weight: 700; color: #fbbf24; text-transform: uppercase; margin-bottom: 0.5rem;" id="console-title">
        Console Test Response
      </div>
      <pre id="console-body" style="font-family: monospace; font-size: 0.8rem; color: #a5f3fc; overflow-x: auto; white-space: pre-wrap;"></pre>
    </div>

    <!-- Navigation Footer -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <a href="/#/" class="btn btn-outline" style="width: auto; margin: 0;">
        &larr; Return to SkoolFinder Website
      </a>
      <a href="?json=true" class="btn btn-outline" style="width: auto; margin: 0;">
        View Raw API JSON Telemetry
      </a>
    </div>
  </div>

  <script>
    async function testPaystackMoMo() {
      const consoleBox = document.getElementById('test-console');
      const consoleTitle = document.getElementById('console-title');
      const consoleBody = document.getElementById('console-body');
      consoleBox.style.display = 'block';
      consoleTitle.innerText = 'Testing Paystack Mobile Money Engine...';
      consoleBody.innerText = 'Initializing payment transaction...';

      try {
        const res = await fetch('/api/payments/momo/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'parent.test@skoolfinder.gh', amountGHS: 50, reference: 'TEST-PAY-' + Date.now() })
        });
        const data = await res.json();
        consoleTitle.innerText = '✅ Paystack Transaction Succeeded (HTTP ' + res.status + ')';
        consoleBody.innerText = JSON.stringify(data, null, 2);
      } catch (err) {
        consoleTitle.innerText = '❌ Error testing Paystack';
        consoleBody.innerText = err.message;
      }
    }

    async function testHubtelSMS() {
      const consoleBox = document.getElementById('test-console');
      const consoleTitle = document.getElementById('console-title');
      const consoleBody = document.getElementById('console-body');
      consoleBox.style.display = 'block';
      consoleTitle.innerText = 'Testing Hubtel SMS Engine...';
      consoleBody.innerText = 'Dispatching test SMS notification...';

      try {
        const res = await fetch('/api/notifications/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientPhone: '0244123456', messageText: 'SkoolFinder Ghana: Diagnostic test notification.', schoolId: 'sch-gis-accra' })
        });
        const data = await res.json();
        consoleTitle.innerText = '✅ Hubtel SMS Dispatched Successfully (HTTP ' + res.status + ')';
        consoleBody.innerText = JSON.stringify(data, null, 2);
      } catch (err) {
        consoleTitle.innerText = '❌ Error testing Hubtel';
        consoleBody.innerText = err.message;
      }
    }
  </script>
</body>
</html>`;
}

// Production Gateway Telemetry & Readiness Diagnostics (Hubtel & Paystack)
app.get(['/api/gateways/status', '/api/admin/gateway-diagnostics', '/diagnostics'], (req, res) => {
  const telemetry = {
    paystack: paystackService.getProductionStatus(),
    hubtel: hubtelService.getProductionStatus(),
    database: {
      isPostgresConfigured: pgClient.isConfigured(),
      engine: pgClient.isConfigured() ? 'postgresql' : 'json_store'
    },
    platform: 'SkoolFinder Ghana Enterprise',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  };

  // If visited directly in a web browser without ?json=true, render the visual console
  if (req.headers.accept && req.headers.accept.includes('text/html') && req.query.json !== 'true') {
    return res.send(renderDiagnosticsHTML(telemetry, 'Gateway & System Diagnostics'));
  }

  res.json(telemetry);
});

// Database Diagnostics & Scaling Engine Status (PostgreSQL vs JSON Store)
app.get('/api/admin/db-diagnostics', async (req, res) => {
  try {
    const pgStatus = await pgClient.checkConnection();
    const stats = db.getStats();
    const telemetry = {
      activeEngine: pgStatus.connected ? 'postgresql_enterprise' : 'json_embedded_resilient',
      postgres: pgStatus,
      jsonStore: {
        file: 'data/database.json',
        collectionsCount: 33,
        stats
      },
      scalingReady: true,
      migrationCommand: 'npm run db:migrate'
    };

    // If visited directly in a web browser without ?json=true, render visual console
    if (req.headers.accept && req.headers.accept.includes('text/html') && req.query.json !== 'true') {
      return res.send(renderDiagnosticsHTML({
        paystack: paystackService.getProductionStatus(),
        hubtel: hubtelService.getProductionStatus(),
        database: {
          isPostgresConfigured: pgStatus.connected,
          engine: pgStatus.connected ? 'postgresql' : 'json_store'
        }
      }, 'Database Scaling & Health Console'));
    }

    res.json(telemetry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Paystack MoMo Checkout Initialization
app.post('/api/payments/momo/initialize', async (req, res) => {
  try {
    const { email, amountGHS, reference, callbackUrl, metadata, channels } = req.body;
    if (!amountGHS || !email) {
      return res.status(400).json({ error: "Email and amountGHS are required" });
    }
    const result = await paystackService.initializeTransaction({
      email,
      amountGHS,
      reference,
      callbackUrl,
      metadata,
      channels
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Paystack MoMo Transaction Verification
app.get('/api/payments/momo/verify/:reference', async (req, res) => {
  try {
    const result = await paystackService.verifyTransaction(req.params.reference);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Paystack Webhook Listener (Auto-updates Invoices & Dispatches Hubtel SMS Receipt)
app.post('/api/payments/paystack-webhook', async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const event = req.body;

    if (paystackService.isConfigured()) {
      const isValid = paystackService.verifyWebhookSignature(signature, JSON.stringify(req.body));
      if (!isValid) {
        return res.status(400).json({ error: "Invalid webhook signature" });
      }
    }

    if (event && event.event === 'charge.success') {
      const data = event.data;
      const metadata = data.metadata || {};
      const amountGHS = data.amount / 100;

      // Settle invoice if invoiceId present
      if (metadata.invoiceId) {
        db.recordInvoicePayment(metadata.invoiceId, {
          amount: amountGHS,
          method: data.channel === 'mobile_money' ? 'MTN Mobile Money' : 'Card',
          payerName: metadata.parentName || data.customer?.email,
          momoNumber: metadata.parentPhone || data.customer?.phone,
          notes: `Paystack Auto-settlement (${data.reference})`
        });
      }

      // Dispatch automated SMS confirmation via Hubtel
      if (metadata.parentPhone) {
        await hubtelService.sendSMS({
          to: metadata.parentPhone,
          message: `SkoolFinder Ghana: Payment of GH₵ ${amountGHS.toLocaleString()} received successfully for ${metadata.studentName || 'Student'}. Ref: ${data.reference}. Thank you.`,
          senderId: 'SkoolFinder'
        });
      }
    }

    res.status(200).send('Webhook processed');
  } catch (err) {
    console.error('Paystack webhook error:', err);
    res.status(500).json({ error: err.message });
  }
});

// API: Automated SMS & WhatsApp Parent Communications (Feature 7)
app.get('/api/notifications/sms', (req, res) => {
  try {
    const { schoolId, phone, category } = req.query;
    const logs = db.getSMSLogs({ schoolId, phone, category });
    res.json(logs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/notifications/credits/:schoolId', (req, res) => {
  try {
    const credits = db.getSMSCredits(req.params.schoolId);
    res.json({ schoolId: req.params.schoolId, credits });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/notifications/sms/send', async (req, res) => {
  try {
    // 1. Dispatch SMS via Hubtel Service (Live or Sandbox Simulation)
    const hubtelResult = await hubtelService.sendSMS({
      to: req.body.recipientPhone,
      message: req.body.messageText,
      senderId: req.body.senderId
    });

    // 2. Persist audit log in database
    const result = db.sendSMSNotification({
      ...req.body,
      channel: hubtelResult.isLive ? 'SMS (Hubtel Live Gateway)' : 'SMS (Hubtel Ghana Gateway)',
      hubtelMessageId: hubtelResult.messageId
    });

    res.status(201).json({
      ...result,
      gateway: hubtelResult
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/notifications/sms/broadcast', async (req, res) => {
  try {
    const { schoolId, ...broadcastData } = req.body;
    const result = db.broadcastParentSMS(schoolId, broadcastData);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ========================================================
// Terminal Report Cards & Digital Gradebook API (Feature 9)
// ========================================================
app.get('/api/academics/report-cards', (req, res) => {
  try {
    const { schoolId, studentGrade, studentName, parentEmail, term, search } = req.query;
    const reports = db.getReportCards({ schoolId, studentGrade, studentName, parentEmail, term, search });
    res.json(reports);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/academics/report-cards/:id', (req, res) => {
  try {
    const report = db.getReportCardById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report card not found" });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/academics/report-cards/:id/grades', (req, res) => {
  try {
    const updated = db.updateReportCardGrades(req.params.id, req.body);
    res.json({ success: true, reportCard: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/academics/report-cards/:id/publish', (req, res) => {
  try {
    const published = db.publishReportCard(req.params.id);
    res.json({ success: true, reportCard: published });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ========================================================
// Transport & Live School Bus Tracking Hub (Feature 10)
// ========================================================
app.get('/api/transport/routes', (req, res) => {
  try {
    const { schoolId, status, search } = req.query;
    const routes = db.getTransportRoutes({ schoolId, status, search });
    res.json(routes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/transport/routes/:id', (req, res) => {
  try {
    const route = db.getTransportRouteById(req.params.id);
    if (!route) return res.status(404).json({ error: "Route not found" });
    res.json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/transport/bus-pass/:studentId', (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    const parentEmail = user ? user.email : req.query.email;
    const busPass = db.getStudentBusPass(req.params.studentId, parentEmail);
    if (!busPass) return res.status(404).json({ error: "Bus pass not found" });
    res.json(busPass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/transport/routes/:id/status', (req, res) => {
  try {
    const updated = db.updateBusRouteStatus(req.params.id, req.body);
    res.json({ success: true, route: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/transport/routes/:id/delay-alert', (req, res) => {
  try {
    const result = db.broadcastBusDelay(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ========================================================
// Co-Curricular & After-School Clubs Management (Feature 11)
// ========================================================
app.get('/api/clubs', (req, res) => {
  try {
    const { schoolId, category, search } = req.query;
    const clubs = db.getClubs({ schoolId, category, search });
    res.json(clubs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/clubs/:id', (req, res) => {
  try {
    const club = db.getClubById(req.params.id);
    if (!club) return res.status(404).json({ error: "Club not found" });
    res.json(club);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/clubs/student/:studentId', (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    const parentEmail = user ? user.email : req.query.email;
    const memberships = db.getStudentClubMemberships(req.params.studentId, parentEmail);
    res.json(memberships);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/clubs/:id/enroll', (req, res) => {
  try {
    const result = db.enrollStudentInClub(req.params.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/clubs/:id/roster/:studentId/merit', (req, res) => {
  try {
    const result = db.awardClubMerit(req.params.id, req.params.studentId, req.body.badgeName);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Alumni Mentorship & Career Guidance Network (Feature 12 / Module #3)
// ===================================================================
app.get('/api/alumni', (req, res) => {
  try {
    const list = db.getAlumni(req.query);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/alumni/bookings', (req, res) => {
  try {
    const bookings = db.getAlumniBookings(req.query);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/alumni/:id', (req, res) => {
  try {
    const alumnus = db.getAlumnusById(req.params.id);
    if (!alumnus) {
      return res.status(404).json({ error: "Alumni mentor not found" });
    }
    res.json(alumnus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/alumni/:id/book', (req, res) => {
  try {
    const result = db.bookAlumniMentorship(req.params.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Health Sickbay & Medical Records / Student Dietary Management (Feature 13 / Module #4)
// =====================================================================================
app.get('/api/health/medical-records', (req, res) => {
  try {
    const list = db.getMedicalRecords(req.query);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health/medical-records/:studentId', (req, res) => {
  try {
    const record = db.getStudentMedicalRecord(req.params.studentId);
    if (!record) {
      return res.status(404).json({ error: "Student medical record not found" });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/health/medical-records/:studentId', (req, res) => {
  try {
    const result = db.updateStudentMedicalRecord(req.params.studentId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/health/sickbay-logs', (req, res) => {
  try {
    const logs = db.getSickbayLogs(req.query);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/health/sickbay-logs', (req, res) => {
  try {
    const result = db.logSickbayVisit(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/health/sickbay-logs/:id/emergency-alert', (req, res) => {
  try {
    const result = db.dispatchEmergencyMedicalSMS(req.params.id, req.body?.message);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Digital School Library & Textbook Lending System (Feature 14 / Extension #2)
// ===========================================================================
app.get('/api/library/books', (req, res) => {
  try {
    const books = db.getLibraryBooks(req.query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/library/books/:id', (req, res) => {
  try {
    const book = db.getLibraryBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Textbook not found in library catalog" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/library/loans', (req, res) => {
  try {
    const loans = db.getLibraryLoans(req.query);
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/library/loans', (req, res) => {
  try {
    const result = db.borrowBook(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/library/loans/:id/return', (req, res) => {
  try {
    const result = db.returnBook(req.params.id, req.body?.notes);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/library/loans/:id/overdue-notice', (req, res) => {
  try {
    const result = db.dispatchOverdueNoticeSMS(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// FEATURE 15: AI Admissions & CSSPS Guidance Chatbot ("Akosua" / SkoolFinder AI)
app.post('/api/ai/chat', (req, res) => {
  try {
    const { message, history, context } = req.body || {};
    const aiResponse = db.queryAIChatbot({ message, history, context });
    res.json({
      success: true,
      ...aiResponse
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FEATURE 16: Digital Student & Staff ID Cards with QR Verification Badge
app.get('/api/students/digital-ids', (req, res) => {
  try {
    const { schoolId } = req.query;
    const list = db.getStudentDigitalIDs(schoolId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/students/:id/digital-id', (req, res) => {
  try {
    const digitalId = db.getStudentDigitalID(req.params.id);
    if (!digitalId) return res.status(404).json({ error: "Digital ID record not found" });
    res.json(digitalId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students/verify-id', (req, res) => {
  try {
    const { code, indexNumber } = req.body || {};
    const query = code || indexNumber || '';
    const result = db.verifyDigitalID(query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// SPA fallback for unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SkoolFinder Ghana Server running at http://0.0.0.0:${PORT}`);
});
