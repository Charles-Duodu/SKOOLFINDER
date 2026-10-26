const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./data/db');
const hubtelService = require('./services/hubtelService');
const paystackService = require('./services/paystackService');

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
    platform: 'SchoolDirect Ghana Enterprise'
  });
});

// API: Stats
app.get('/api/stats', (req, res) => {
  res.json(db.getStats());
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

// API: RFQs (Phase 2)
app.get('/api/rfqs', (req, res) => {
  res.json(db.getRFQs());
});

app.post('/api/rfqs', (req, res) => {
  try {
    const newRfq = db.addRFQ(req.body);
    res.status(201).json(newRfq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/rfqs/:id/quote', (req, res) => {
  try {
    const quote = db.submitQuote({
      rfqId: req.params.id,
      ...req.body
    });
    res.status(201).json({ success: true, quote });
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

// API: User Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({ error: "Email/Phone and password are required" });
    }
    const result = db.authenticateUser(login, password);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// API: User Registration
app.post('/api/auth/register', (req, res) => {
  try {
    const result = db.registerUser(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Current User Profile (Validate Session)
app.get('/api/auth/me', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Session invalid or expired" });
  }
  res.json({ success: true, user });
});

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

app.post('/api/invoices/:id/pay', (req, res) => {
  try {
    const result = db.recordInvoicePayment(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Gateway Telemetry Status (Hubtel & Paystack)
app.get('/api/gateways/status', (req, res) => {
  res.json({
    hubtel: {
      isConfigured: hubtelService.isConfigured(),
      senderId: hubtelService.defaultSenderId,
      mode: hubtelService.isConfigured() ? 'live' : 'simulation_sandbox'
    },
    paystack: {
      isConfigured: paystackService.isConfigured(),
      publicKey: paystackService.publicKey ? `${paystackService.publicKey.slice(0, 8)}...` : null,
      mode: paystackService.isConfigured() ? 'live' : 'simulation_sandbox'
    }
  });
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
          message: `SchoolDirect Ghana: Payment of GH₵ ${amountGHS.toLocaleString()} received successfully for ${metadata.studentName || 'Student'}. Ref: ${data.reference}. Thank you.`,
          senderId: 'SchoolDirect'
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

// FEATURE 15: AI Admissions & CSSPS Guidance Chatbot ("Akosua" / SchoolDirect AI)
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

app.listen(PORT, () => {
  console.log(`SchoolDirect Ghana Server running at http://localhost:${PORT}`);
});
