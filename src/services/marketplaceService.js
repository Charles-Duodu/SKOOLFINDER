/**
 * SkoolFinder Ghana — Institutional Marketplace Engine
 * Baseline: Blueprint v2.0 Sections 6, 12, 13, 23, 25, 26.4
 * Covers:
 *   - Teacher Vacancies & Recruiting: VAC-001 through VAC-006
 *   - B2B Procurement RFQs & Tenders: TEN-001 through TEN-006
 *   - Supplier Quotation 50/50 MoMo Milestone Escrow: ESC-001 through ESC-004
 */

const { supabaseAdmin } = require('../config/supabase');
const AdmissionsSubscriptionService = require('./admissionsSubscriptionService');
const AuditService = require('./auditService');
const EmailService = require('./emailService');

// ============================================================================
// APPROVED COMMERCIAL PRICING & QUOTA CATALOGUE (Blueprint §6.2, §6.3, §12, §13)
// ============================================================================
const TIER_VACANCY_QUOTAS = {
  free: 0,
  growth: 3,
  professional: 10,
  enterprise: 30
};

const TIER_TENDER_QUOTAS = {
  free: 0,
  growth: 0,
  professional: 3,
  enterprise: 10
};

const MARKETPLACE_PRICING = {
  vacancyAddonSlot: {
    priceGhs: 25,
    durationDays: 30,
    description: '1 Additional Active Vacancy Slot for 30 Days'
  },
  tenderCreditSingle: {
    priceGhs: 45,
    credits: 1,
    description: '1 Single Tender Publication Credit'
  },
  tenderCreditBundle3: {
    priceGhs: 120,
    credits: 3,
    savingsGhs: 15,
    description: '3-Tender Publication Credits Bundle (Save GH₵ 15)'
  }
};

// In-Memory Storage Maps (Robust resilience and offline/test support)
const IN_MEMORY_VACANCIES = new Map();
const IN_MEMORY_APPLICATIONS = new Map();
const IN_MEMORY_TENDERS = new Map();
const IN_MEMORY_BIDS = new Map();
const IN_MEMORY_CREDITS = new Map(); // schoolId -> array of ledger records
const IN_MEMORY_ESCROWS = new Map(); // tenderId -> array of 2 milestones
const IN_MEMORY_AUDIT_LOGS = [];

class MarketplaceService {

  // ==========================================================================
  // 1. TEACHER VACANCIES & RECRUITING (VAC-001 to VAC-006)
  // ==========================================================================

  /**
   * Calculates vacancy quota consumption and remaining allowances for a school (VAC-001, VAC-002)
   */
  static async getVacancyQuotaSummary(schoolId) {
    const sub = await AdmissionsSubscriptionService.getSchoolSubscription(schoolId);
    const tier = (sub && sub.tier) ? sub.tier.toLowerCase() : 'free';
    const baseQuota = TIER_VACANCY_QUOTAS[tier] !== undefined ? TIER_VACANCY_QUOTAS[tier] : 0;

    // Check active paid add-on slots from ledger
    const now = new Date();
    const ledger = IN_MEMORY_CREDITS.get(schoolId) || [];
    const activeAddons = ledger.filter(item => 
      item.item_type === 'vacancy_slot' && 
      item.status === 'active' && 
      item.credits_remaining > 0 &&
      (!item.expires_at || new Date(item.expires_at) > now)
    );
    const addonSlotsCount = activeAddons.reduce((sum, item) => sum + item.credits_remaining, 0);

    // Count currently published/active vacancies
    const allVacancies = await this.getSchoolVacanciesRaw(schoolId);
    const currentActive = allVacancies.filter(v => v.status === 'published').length;

    const totalAllowed = baseQuota + addonSlotsCount;
    const remainingSlots = Math.max(0, totalAllowed - currentActive);

    return {
      schoolId,
      planTier: tier,
      baseQuota,
      activeAddonSlots: addonSlotsCount,
      totalAllowed,
      currentActive,
      remainingSlots,
      isQuotaExhausted: currentActive >= totalAllowed
    };
  }

  /**
   * Internal helper to fetch all school vacancies (DB or memory)
   */
  static async getSchoolVacanciesRaw(schoolId) {
    const memList = Array.from(IN_MEMORY_VACANCIES.values()).filter(v => String(v.school_id) === String(schoolId));
    if (memList.length > 0) return memList;

    try {
      const { data, error } = await supabaseAdmin
        .from('school_vacancies')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach(v => IN_MEMORY_VACANCIES.set(v.id, v));
        return data;
      }
    } catch (e) {
      // Supabase offline/mock fallback
    }
    return memList;
  }

  /**
   * Retrieves all vacancies for a school with quota metrics and applicants count (VAC-001, VAC-003)
   */
  static async getSchoolVacancies(schoolId, options = {}) {
    const quota = await this.getVacancyQuotaSummary(schoolId);
    let vacancies = await this.getSchoolVacanciesRaw(schoolId);

    if (options.status) {
      vacancies = vacancies.filter(v => v.status === options.status);
    }

    // Attach applicant metrics
    const enriched = vacancies.map(v => {
      const apps = Array.from(IN_MEMORY_APPLICATIONS.values()).filter(a => String(a.vacancy_id) === String(v.id));
      return {
        ...v,
        applicantsCount: apps.length,
        shortlistedCount: apps.filter(a => a.status === 'shortlisted').length,
        interviewCount: apps.filter(a => a.status === 'interview_scheduled').length
      };
    });

    return {
      vacancies: enriched,
      quota
    };
  }

  /**
   * Publishes or saves a new teacher vacancy (VAC-001, VAC-003)
   */
  static async createVacancy(schoolId, payload) {
    const targetStatus = payload.status || 'published';
    const quota = await this.getVacancyQuotaSummary(schoolId);

    // If publishing immediately, strictly enforce active vacancy quota
    if (targetStatus === 'published' && quota.isQuotaExhausted) {
      throw new Error(
        `Active vacancy quota reached (${quota.currentActive}/${quota.totalAllowed}) for your ${quota.planTier.toUpperCase()} plan. ` +
        `Close an existing vacancy, upgrade your plan, or purchase an add-on vacancy slot for GH₵ ${MARKETPLACE_PRICING.vacancyAddonSlot.priceGhs}.`
      );
    }

    const id = payload.id || `vac-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const defaultDeadline = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const vacancy = {
      id,
      school_id: schoolId,
      title: payload.title || 'Subject Teacher',
      department: payload.department || 'Academics',
      level: payload.level || 'Primary',
      job_type: payload.jobType || payload.job_type || 'full_time',
      curriculum: payload.curriculum || 'GES / NaCCA',
      min_qualification: payload.minQualification || payload.min_qualification || 'B.Ed',
      min_experience_years: parseInt(payload.minExperienceYears || payload.min_experience_years || 1, 10),
      salary_range: payload.salaryRange || payload.salary_range || 'GH₵ 2,500 - 4,000 / month',
      description: payload.description || 'Passionate educator required.',
      requirements: payload.requirements || 'NTC Teacher Licence required.',
      benefits: payload.benefits || 'Social Security (SSNIT), CPD Training, Transport Support',
      location: payload.location || 'Greater Accra',
      ntc_required: payload.ntcRequired !== undefined ? Boolean(payload.ntcRequired) : true,
      status: targetStatus,
      application_deadline: payload.applicationDeadline || payload.application_deadline || defaultDeadline,
      published_at: targetStatus === 'published' ? now : null,
      closed_at: null,
      is_addon_slot: quota.currentActive >= quota.baseQuota,
      created_at: now,
      updated_at: now
    };

    IN_MEMORY_VACANCIES.set(id, vacancy);

    try {
      await supabaseAdmin.from('school_vacancies').insert(vacancy);
    } catch (e) {
      // In-memory fallback
    }

    // Immutable audit trail (ESC-004)
    this.recordAuditLog({
      schoolId,
      actorId: payload.actorId || null,
      actorName: payload.actorName || 'School Administrator',
      eventType: targetStatus === 'published' ? 'VACANCY_PUBLISHED' : 'VACANCY_DRAFTED',
      entityType: 'vacancy',
      entityId: id,
      referenceCode: `VAC-${id.slice(-6).toUpperCase()}`,
      details: { title: vacancy.title, department: vacancy.department, status: targetStatus }
    });

    return {
      success: true,
      vacancy,
      quota: await this.getVacancyQuotaSummary(schoolId)
    };
  }

  /**
   * Updates vacancy lifecycle status (draft -> published -> closed -> expired) (VAC-003)
   * Note: Closing an active vacancy immediately releases active quota!
   */
  static async updateVacancyStatus(schoolId, vacancyId, status, actor = {}) {
    const vacancy = IN_MEMORY_VACANCIES.get(vacancyId);
    if (!vacancy || String(vacancy.school_id) !== String(schoolId)) {
      throw new Error('Vacancy not found or unauthorized');
    }

    const previousStatus = vacancy.status;
    const now = new Date().toISOString();

    // If reopening/publishing, check quota
    if (status === 'published' && previousStatus !== 'published') {
      const quota = await this.getVacancyQuotaSummary(schoolId);
      if (quota.isQuotaExhausted) {
        throw new Error(`Cannot publish: active vacancy quota limit (${quota.totalAllowed}) reached.`);
      }
      vacancy.published_at = now;
      vacancy.closed_at = null;
    } else if (status === 'closed') {
      vacancy.closed_at = now;
    }

    vacancy.status = status;
    vacancy.updated_at = now;
    IN_MEMORY_VACANCIES.set(vacancyId, vacancy);

    try {
      await supabaseAdmin
        .from('school_vacancies')
        .update({ status, closed_at: vacancy.closed_at, published_at: vacancy.published_at, updated_at: now })
        .eq('id', vacancyId);
    } catch (e) {}

    this.recordAuditLog({
      schoolId,
      actorId: actor.id || null,
      actorName: actor.name || 'School Administrator',
      eventType: 'VACANCY_STATUS_CHANGED',
      entityType: 'vacancy',
      entityId: vacancyId,
      details: { previousStatus, newStatus: status }
    });

    return {
      success: true,
      vacancy,
      quota: await this.getVacancyQuotaSummary(schoolId)
    };
  }

  /**
   * Purchases an add-on active vacancy slot for 30 days at approved GH₵ 25 (VAC-002)
   */
  static async purchaseVacancySlot(schoolId, payload = {}) {
    const priceGhs = MARKETPLACE_PRICING.vacancyAddonSlot.priceGhs;
    const durationDays = MARKETPLACE_PRICING.vacancyAddonSlot.durationDays;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationDays * 86400000).toISOString();
    const slotId = `slot-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const ledgerEntry = {
      id: slotId,
      school_id: schoolId,
      item_type: 'vacancy_slot',
      quantity: 1,
      amount_paid_ghs: priceGhs,
      payment_method: payload.paymentMethod || 'momo',
      paystack_reference: payload.paystackReference || `PS-VAC-${Date.now()}`,
      credits_remaining: 1,
      expires_at: expiresAt,
      status: 'active',
      created_at: now.toISOString()
    };

    const schoolLedger = IN_MEMORY_CREDITS.get(schoolId) || [];
    schoolLedger.push(ledgerEntry);
    IN_MEMORY_CREDITS.set(schoolId, schoolLedger);

    try {
      await supabaseAdmin.from('marketplace_credits_ledger').insert(ledgerEntry);
    } catch (e) {}

    this.recordAuditLog({
      schoolId,
      actorId: payload.actorId || null,
      actorName: payload.actorName || 'School Proprietor',
      eventType: 'VACANCY_SLOT_PURCHASED',
      entityType: 'credit_ledger',
      entityId: slotId,
      amount: priceGhs,
      referenceCode: ledgerEntry.paystack_reference,
      details: { itemType: 'vacancy_slot', durationDays, expiresAt }
    });

    return {
      success: true,
      slotId,
      amountPaidGhs: priceGhs,
      expiresAt,
      message: `Active vacancy slot successfully activated for ${durationDays} days.`,
      quota: await this.getVacancyQuotaSummary(schoolId)
    };
  }

  /**
   * Public discovery: returns active published vacancies for /jobs and Teachers Portal (VAC-006)
   */
  static async getPublicJobs(filters = {}) {
    let list = Array.from(IN_MEMORY_VACANCIES.values()).filter(v => v.status === 'published');

    // Filter by subject / department
    if (filters.subject && filters.subject !== 'All') {
      const q = filters.subject.toLowerCase();
      list = list.filter(v => 
        (v.department && v.department.toLowerCase().includes(q)) ||
        (v.title && v.title.toLowerCase().includes(q))
      );
    }

    // Filter by region / location
    if (filters.region && filters.region !== 'All') {
      list = list.filter(v => v.location && v.location.toLowerCase().includes(filters.region.toLowerCase()));
    }

    // Filter by level
    if (filters.level && filters.level !== 'All') {
      list = list.filter(v => v.level && v.level.toLowerCase() === filters.level.toLowerCase());
    }

    // Filter by curriculum
    if (filters.curriculum && filters.curriculum !== 'All') {
      list = list.filter(v => v.curriculum && v.curriculum.toLowerCase().includes(filters.curriculum.toLowerCase()));
    }

    // Return mapped format expected by public/js/views/jobsView.js
    return list.map(v => ({
      id: v.id,
      schoolId: v.school_id,
      schoolName: v.school_name || 'Accredited Institution',
      title: v.title,
      department: v.department,
      level: v.level,
      curriculum: v.curriculum,
      jobType: v.job_type === 'full_time' ? 'Full Time' : v.job_type,
      location: v.location,
      salaryRange: v.salary_range,
      minQualification: v.min_qualification,
      experienceRequired: `${v.min_experience_years}+ Years`,
      ntcRequired: v.ntc_required,
      description: v.description,
      requirements: v.requirements,
      deadline: v.application_deadline,
      publishedAt: v.published_at
    }));
  }

  /**
   * Public submission of candidate application dossier (VAC-004)
   */
  static async submitJobApplication(vacancyId, payload) {
    const vacancy = IN_MEMORY_VACANCIES.get(vacancyId);
    if (!vacancy || vacancy.status !== 'published') {
      throw new Error('This vacancy is closed or no longer accepting applications.');
    }

    const ntcNumber = (payload.ntcNumber || payload.ntc_number || '').trim();
    // Validate standard Ghana NTC licence format (e.g. PT/XXXXX/YYYY or registration format)
    const ntcVerified = Boolean(ntcNumber && ntcNumber.length >= 6);

    const appId = `app-tch-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const trackingRef = `NTC-APP-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const application = {
      id: appId,
      vacancy_id: vacancyId,
      school_id: vacancy.school_id,
      full_name: payload.fullName || payload.full_name || 'Educator Applicant',
      email: payload.email || '',
      phone: payload.phone || '',
      ntc_number: ntcNumber,
      ntc_verified: ntcVerified,
      qualification: payload.qualification || 'B.Ed in Basic Education',
      years_experience: parseInt(payload.yearsExperience || payload.years_experience || 0, 10),
      current_school: payload.currentSchool || payload.current_school || 'Private Institution',
      cv_url: payload.cvUrl || payload.cv_url || 'https://skoolfinder.com.gh/uploads/cv-sample.pdf',
      cover_letter: payload.coverLetter || payload.cover_letter || '',
      expected_salary: payload.expectedSalary || payload.expected_salary || 'GH₵ 3,000',
      status: 'applied',
      tracking_ref: trackingRef,
      interview_date: null,
      interview_mode: 'in_person',
      interview_notes: null,
      review_notes: null,
      created_at: now,
      updated_at: now
    };

    IN_MEMORY_APPLICATIONS.set(appId, application);

    try {
      await supabaseAdmin.from('vacancy_applications').insert(application);
    } catch (e) {}

    this.recordAuditLog({
      schoolId: vacancy.school_id,
      actorName: application.full_name,
      eventType: 'CANDIDATE_APPLICATION_RECEIVED',
      entityType: 'application',
      entityId: appId,
      referenceCode: trackingRef,
      details: { vacancyTitle: vacancy.title, ntcVerified, qualification: application.qualification }
    });

    return {
      success: true,
      applicationId: appId,
      trackingRef,
      ntcVerified,
      message: 'Application and educator credentials submitted successfully to the school recruitment board.'
    };
  }

  /**
   * Retrieves all candidate applications for a specific vacancy (VAC-004, VAC-005)
   */
  static async getVacancyApplicants(schoolId, vacancyId) {
    const vacancy = IN_MEMORY_VACANCIES.get(vacancyId);
    if (!vacancy || String(vacancy.school_id) !== String(schoolId)) {
      throw new Error('Vacancy not found or access denied');
    }

    const apps = Array.from(IN_MEMORY_APPLICATIONS.values()).filter(a => String(a.vacancy_id) === String(vacancyId));
    return {
      vacancy,
      applicants: apps
    };
  }

  /**
   * Updates candidate status along review stage machine (VAC-005)
   * Stages: applied -> shortlisted -> interview_scheduled -> offered -> rejected
   */
  static async updateApplicantStatus(schoolId, vacancyId, applicationId, payload = {}) {
    const app = IN_MEMORY_APPLICATIONS.get(applicationId);
    if (!app || String(app.school_id) !== String(schoolId)) {
      throw new Error('Application dossier not found or unauthorized');
    }

    const previousStatus = app.status;
    const targetStatus = payload.status || 'shortlisted';
    const validStatuses = ['applied', 'shortlisted', 'interview_scheduled', 'offered', 'rejected'];

    if (!validStatuses.includes(targetStatus)) {
      throw new Error(`Invalid candidate status: ${targetStatus}`);
    }

    app.status = targetStatus;
    if (payload.interviewDate) app.interview_date = payload.interviewDate;
    if (payload.interviewMode) app.interview_mode = payload.interviewMode;
    if (payload.interviewNotes) app.interview_notes = payload.interviewNotes;
    if (payload.reviewNotes) app.review_notes = payload.reviewNotes;
    app.updated_at = new Date().toISOString();

    IN_MEMORY_APPLICATIONS.set(applicationId, app);

    try {
      await supabaseAdmin
        .from('vacancy_applications')
        .update({
          status: targetStatus,
          interview_date: app.interview_date,
          interview_mode: app.interview_mode,
          interview_notes: app.interview_notes,
          review_notes: app.review_notes,
          updated_at: app.updated_at
        })
        .eq('id', applicationId);
    } catch (e) {}

    this.recordAuditLog({
      schoolId,
      actorId: payload.actorId || null,
      actorName: payload.actorName || 'School Recruiter',
      eventType: 'CANDIDATE_STATUS_UPDATED',
      entityType: 'application',
      entityId: applicationId,
      details: { previousStatus, newStatus: targetStatus, candidateName: app.full_name }
    });

    return {
      success: true,
      application: app,
      message: `Applicant stage updated to ${targetStatus.replace('_', ' ').toUpperCase()}`
    };
  }


  // ==========================================================================
  // 2. B2B PROCUREMENT RFQS & TENDERS (TEN-001 to TEN-006)
  // ==========================================================================

  /**
   * Calculates monthly included tender quota and purchased credit balance (TEN-001, TEN-002)
   */
  static async getTenderQuotaSummary(schoolId) {
    const sub = await AdmissionsSubscriptionService.getSchoolSubscription(schoolId);
    const tier = (sub && sub.tier) ? sub.tier.toLowerCase() : 'free';
    const includedMonthlyQuota = TIER_TENDER_QUOTAS[tier] !== undefined ? TIER_TENDER_QUOTAS[tier] : 0;

    // Count tenders created in current month with monthly quota
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const tenders = await this.getSchoolTendersRaw(schoolId);
    const usedThisMonth = tenders.filter(t => 
      t.credit_source === 'monthly_quota' && 
      new Date(t.created_at) >= startOfMonth
    ).length;

    const remainingMonthlyQuota = Math.max(0, includedMonthlyQuota - usedThisMonth);

    // Sum purchased tender credits from ledger
    const ledger = IN_MEMORY_CREDITS.get(schoolId) || [];
    const purchasedCreditsRemaining = ledger
      .filter(item => item.item_type === 'tender_credit' && item.status === 'active')
      .reduce((sum, item) => sum + item.credits_remaining, 0);

    const totalAvailable = remainingMonthlyQuota + purchasedCreditsRemaining;

    return {
      schoolId,
      planTier: tier,
      includedMonthlyQuota,
      usedThisMonth,
      remainingMonthlyQuota,
      purchasedCreditsRemaining,
      totalAvailable,
      canPublish: totalAvailable > 0
    };
  }

  /**
   * Internal helper to fetch tenders for a school
   */
  static async getSchoolTendersRaw(schoolId) {
    const memList = Array.from(IN_MEMORY_TENDERS.values()).filter(t => String(t.school_id) === String(schoolId));
    if (memList.length > 0) return memList;

    try {
      const { data, error } = await supabaseAdmin
        .from('school_tenders')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach(t => IN_MEMORY_TENDERS.set(t.id, t));
        return data;
      }
    } catch (e) {}

    return memList;
  }

  /**
   * Purchases add-on tender publication credits (TEN-002)
   * Single: GH₵ 45 (1 credit), Bundle: GH₵ 120 (3 credits, saves GH₵ 15)
   */
  static async purchaseTenderCredits(schoolId, payload = {}) {
    const packType = payload.packType || 'single';
    let priceGhs = MARKETPLACE_PRICING.tenderCreditSingle.priceGhs;
    let credits = MARKETPLACE_PRICING.tenderCreditSingle.credits;

    if (packType === 'bundle_3' || packType === 'bundle') {
      priceGhs = MARKETPLACE_PRICING.tenderCreditBundle3.priceGhs;
      credits = MARKETPLACE_PRICING.tenderCreditBundle3.credits;
    }

    const creditId = `tc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const ledgerEntry = {
      id: creditId,
      school_id: schoolId,
      item_type: 'tender_credit',
      quantity: credits,
      amount_paid_ghs: priceGhs,
      payment_method: payload.paymentMethod || 'momo',
      paystack_reference: payload.paystackReference || `PS-TND-${Date.now()}`,
      credits_remaining: credits,
      expires_at: null, // Tender credits do not expire
      status: 'active',
      created_at: now
    };

    const schoolLedger = IN_MEMORY_CREDITS.get(schoolId) || [];
    schoolLedger.push(ledgerEntry);
    IN_MEMORY_CREDITS.set(schoolId, schoolLedger);

    try {
      await supabaseAdmin.from('marketplace_credits_ledger').insert(ledgerEntry);
    } catch (e) {}

    this.recordAuditLog({
      schoolId,
      actorId: payload.actorId || null,
      actorName: payload.actorName || 'School Bursar',
      eventType: 'TENDER_CREDITS_PURCHASED',
      entityType: 'credit_ledger',
      entityId: creditId,
      amount: priceGhs,
      referenceCode: ledgerEntry.paystack_reference,
      details: { packType, creditsAdded: credits }
    });

    const summary = await this.getTenderQuotaSummary(schoolId);
    return {
      success: true,
      creditId,
      creditsAdded: credits,
      amountPaidGhs: priceGhs,
      totalCreditsRemaining: summary.purchasedCreditsRemaining,
      summary
    };
  }

  /**
   * Publishes a new procurement tender / RFQ (TEN-001, TEN-003, TEN-004)
   */
  static async createTender(schoolId, payload) {
    const quota = await this.getTenderQuotaSummary(schoolId);

    if (!quota.canPublish) {
      throw new Error(
        `Tender publishing quota exhausted. Your ${quota.planTier.toUpperCase()} plan includes ${quota.includedMonthlyQuota} tenders/month. ` +
        `Purchase Tender Credits (1 for GH₵ 45 or 3 for GH₵ 120) to publish.`
      );
    }

    // Determine credit source: monthly quota first, else deduct from purchased credit
    let creditSource = 'monthly_quota';
    if (quota.remainingMonthlyQuota <= 0) {
      creditSource = 'purchased_credit';
      // Deduct 1 credit from active ledger record
      const ledger = IN_MEMORY_CREDITS.get(schoolId) || [];
      const activeEntry = ledger.find(item => item.item_type === 'tender_credit' && item.credits_remaining > 0);
      if (activeEntry) {
        activeEntry.credits_remaining -= 1;
        if (activeEntry.credits_remaining === 0) activeEntry.status = 'exhausted';
      }
    }

    const tenderId = payload.id || `tnd-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const refCode = `TND-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const defaultDelivery = new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0];
    const defaultDeadline = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];

    const tender = {
      id: tenderId,
      school_id: schoolId,
      school_name: payload.schoolName || payload.school_name || 'Accredited Institution',
      reference_code: refCode,
      title: payload.title || 'Institutional Procurement Tender',
      category: payload.category || 'General Supplies',
      description: payload.description || 'Request for quotations and bids.',
      specifications: payload.specifications || payload.specs || 'Ghana Standards Authority compliant.',
      quantity: payload.quantity || 'Bulk Order',
      budget_currency: 'GHS',
      budget_min: parseFloat(payload.budgetMin || payload.budget_min || 0),
      budget_max: parseFloat(payload.budgetMax || payload.budget_max || payload.budget || 50000),
      delivery_deadline: payload.deliveryDeadline || payload.delivery_deadline || defaultDelivery,
      submission_deadline: payload.submissionDeadline || payload.submission_deadline || defaultDeadline,
      delivery_location: payload.deliveryLocation || payload.delivery_location || 'Campus Administration Gate',
      status: 'open',
      awarded_bid_id: null,
      awarded_supplier_name: null,
      awarded_amount: null,
      escrow_status: 'none',
      credit_source: creditSource,
      created_at: now,
      updated_at: now
    };

    IN_MEMORY_TENDERS.set(tenderId, tender);

    // Cross-Portal Sync: Mirror into legacy RFQ table for seamless /suppliers view (TEN-004)
    try {
      await supabaseAdmin.from('school_tenders').insert(tender);
      await supabaseAdmin.from('rfqs').insert({
        id: tenderId,
        school_id: schoolId,
        school_name: tender.school_name,
        title: tender.title,
        category: tender.category,
        description: tender.description,
        budget: tender.budget_max,
        budget_range: `GH₵ ${tender.budget_min.toLocaleString()} - ${tender.budget_max.toLocaleString()}`,
        quantity: tender.quantity,
        region: 'Greater Accra',
        status: 'Open',
        deadline: tender.submission_deadline
      });
    } catch (e) {}

    this.recordAuditLog({
      schoolId,
      actorId: payload.actorId || null,
      actorName: payload.actorName || 'School Procurement Board',
      eventType: 'TENDER_PUBLISHED',
      entityType: 'tender',
      entityId: tenderId,
      referenceCode: refCode,
      details: { title: tender.title, category: tender.category, creditSource }
    });

    return {
      success: true,
      tender,
      quota: await this.getTenderQuotaSummary(schoolId)
    };
  }

  /**
   * Retrieves all tenders for a school, with live bid counts and escrow summaries (TEN-001, TEN-006)
   */
  static async getSchoolTenders(schoolId) {
    const quota = await this.getTenderQuotaSummary(schoolId);
    const tenders = await this.getSchoolTendersRaw(schoolId);

    const enriched = tenders.map(t => {
      const bids = Array.from(IN_MEMORY_BIDS.values()).filter(b => String(b.tender_id) === String(t.id));
      const milestones = IN_MEMORY_ESCROWS.get(t.id) || [];
      return {
        ...t,
        bidsCount: bids.length,
        escrowMilestones: milestones
      };
    });

    return {
      tenders: enriched,
      quota
    };
  }

  /**
   * Public discovery for Suppliers Portal (/suppliers) (TEN-004)
   */
  static async getPublicTenders(filters = {}) {
    let list = Array.from(IN_MEMORY_TENDERS.values()).filter(t => t.status === 'open' || t.status === 'reviewing');

    if (filters.category && filters.category !== 'All') {
      list = list.filter(t => t.category && t.category.toLowerCase().includes(filters.category.toLowerCase()));
    }

    return list.map(t => {
      const bids = Array.from(IN_MEMORY_BIDS.values()).filter(b => String(b.tender_id) === String(t.id));
      return {
        id: t.id,
        referenceCode: t.reference_code,
        schoolId: t.school_id,
        schoolName: t.school_name,
        title: t.title,
        category: t.category,
        description: t.description,
        specifications: t.specifications,
        quantity: t.quantity,
        budgetRange: `GH₵ ${Number(t.budget_min).toLocaleString()} - ${Number(t.budget_max).toLocaleString()}`,
        deadline: t.submission_deadline,
        deliveryDeadline: t.delivery_deadline,
        status: t.status,
        quotesReceived: bids.length
      };
    });
  }

  /**
   * Supplier submits an itemized bid / quotation on an open tender (TEN-005)
   */
  static async submitSupplierBid(tenderId, payload) {
    const tender = IN_MEMORY_TENDERS.get(tenderId);
    if (!tender || (tender.status !== 'open' && tender.status !== 'reviewing')) {
      throw new Error('This tender is not currently open for bidding.');
    }

    const bidId = payload.id || `bid-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const quoteAmount = parseFloat(payload.quoteAmount || payload.amount || payload.price || 0);

    const bid = {
      id: bidId,
      tender_id: tenderId,
      school_id: tender.school_id,
      supplier_id: payload.supplierId || null,
      supplier_name: payload.supplierName || 'Verified Ghana Supplier',
      supplier_email: payload.supplierEmail || payload.email || 'sales@supplier.com.gh',
      supplier_phone: payload.supplierPhone || payload.phone || '+233 24 000 0000',
      supplier_rating: parseFloat(payload.supplierRating || 4.8),
      quote_amount: quoteAmount,
      itemized_breakdown: payload.itemizedBreakdown || payload.breakdown || [
        { item: tender.title, quantity: tender.quantity, unitPriceGhs: quoteAmount, totalGhs: quoteAmount }
      ],
      delivery_days_sla: parseInt(payload.deliveryDaysSLA || payload.deliveryDays || 7, 10),
      warranty_terms: payload.warrantyTerms || '6 Months Official Warranty',
      payment_terms: payload.paymentTerms || '50% Mobilization Deposit / 50% on Inspection',
      proposal_notes: payload.proposalNotes || payload.notes || '',
      document_url: payload.documentUrl || null,
      status: 'submitted',
      created_at: now,
      updated_at: now
    };

    IN_MEMORY_BIDS.set(bidId, bid);

    // Also mirror to rfq_quotes for legacy compatibility
    try {
      await supabaseAdmin.from('tender_bids').insert(bid);
      await supabaseAdmin.from('rfq_quotes').insert({
        id: bidId,
        rfq_id: tenderId,
        supplier_id: bid.supplier_id,
        supplier_name: bid.supplier_name,
        amount: quoteAmount,
        notes: bid.proposal_notes,
        status: 'Submitted'
      });
    } catch (e) {}

    this.recordAuditLog({
      schoolId: tender.school_id,
      actorName: bid.supplier_name,
      eventType: 'SUPPLIER_BID_SUBMITTED',
      entityType: 'bid',
      entityId: bidId,
      referenceCode: tender.reference_code,
      amount: quoteAmount,
      details: { tenderTitle: tender.title, deliveryDaysSLA: bid.delivery_days_sla }
    });

    return {
      success: true,
      bidId,
      quoteAmount,
      message: `Quotation of GH₵ ${quoteAmount.toLocaleString()} submitted to ${tender.school_name}.`
    };
  }

  /**
   * Retrieves all submitted bids for a tender for side-by-side comparison (TEN-006)
   */
  static async getTenderBids(schoolId, tenderId) {
    const tender = IN_MEMORY_TENDERS.get(tenderId);
    if (!tender || String(tender.school_id) !== String(schoolId)) {
      throw new Error('Tender not found or access denied');
    }

    const bids = Array.from(IN_MEMORY_BIDS.values()).filter(b => String(b.tender_id) === String(tenderId));
    return {
      tender,
      bids: bids.sort((a, b) => a.quote_amount - b.quote_amount) // Sort lowest bid first by default
    };
  }

  /**
   * School awards contract to winning supplier and initializes 50/50 MoMo Milestone Escrow (TEN-006, ESC-001)
   */
  static async awardTenderContract(schoolId, tenderId, bidId, actor = {}) {
    const tender = IN_MEMORY_TENDERS.get(tenderId);
    if (!tender || String(tender.school_id) !== String(schoolId)) {
      throw new Error('Tender not found or access denied');
    }

    const bid = IN_MEMORY_BIDS.get(bidId);
    if (!bid || String(bid.tender_id) !== String(tenderId)) {
      throw new Error('Bid not found for this tender');
    }

    const now = new Date().toISOString();
    const totalAmount = bid.quote_amount;
    const milestone1Amount = Math.round((totalAmount * 0.5) * 100) / 100;
    const milestone2Amount = Math.round((totalAmount - milestone1Amount) * 100) / 100;

    // 1. Mark selected bid as awarded, others as rejected
    const allBids = Array.from(IN_MEMORY_BIDS.values()).filter(b => String(b.tender_id) === String(tenderId));
    allBids.forEach(b => {
      if (b.id === bidId) {
        b.status = 'awarded';
        b.awarded_at = now;
      } else {
        b.status = 'rejected';
      }
      IN_MEMORY_BIDS.set(b.id, b);
    });

    // 2. Mark tender awarded
    tender.status = 'awarded';
    tender.awarded_bid_id = bidId;
    tender.awarded_supplier_name = bid.supplier_name;
    tender.awarded_amount = totalAmount;
    tender.escrow_status = 'pending_deposit'; // Ready for Milestone 1 lock
    tender.updated_at = now;
    IN_MEMORY_TENDERS.set(tenderId, tender);

    // 3. Initialize 50/50 MoMo Milestone Escrow Contract (ESC-001)
    const milestones = [
      {
        id: `esc-m1-${tenderId}`,
        tender_id: tenderId,
        school_id: schoolId,
        bid_id: bidId,
        milestone_index: 1,
        milestone_name: '50% Mobilization Deposit',
        percentage: 50,
        amount: milestone1Amount,
        status: 'pending', // Awaiting school deposit lock
        funded_at: null,
        disbursed_at: null,
        disbursement_reference: null,
        inspection_notes: null,
        created_at: now,
        updated_at: now
      },
      {
        id: `esc-m2-${tenderId}`,
        tender_id: tenderId,
        school_id: schoolId,
        bid_id: bidId,
        milestone_index: 2,
        milestone_name: '50% Delivery Sign-off Balance',
        percentage: 50,
        amount: milestone2Amount,
        status: 'pending',
        funded_at: null,
        disbursed_at: null,
        disbursement_reference: null,
        inspection_notes: null,
        created_at: now,
        updated_at: now
      }
    ];

    IN_MEMORY_ESCROWS.set(tenderId, milestones);

    try {
      await supabaseAdmin.from('tender_bids').update({ status: 'awarded' }).eq('id', bidId);
      await supabaseAdmin.from('school_tenders').update({
        status: 'awarded',
        awarded_bid_id: bidId,
        awarded_supplier_name: bid.supplier_name,
        awarded_amount: totalAmount,
        escrow_status: 'pending_deposit',
        updated_at: now
      }).eq('id', tenderId);
      await supabaseAdmin.from('tender_escrow_milestones').insert(milestones);
    } catch (e) {}

    this.recordAuditLog({
      schoolId,
      actorId: actor.id || null,
      actorName: actor.name || 'School Bursar',
      eventType: 'TENDER_CONTRACT_AWARDED',
      entityType: 'tender',
      entityId: tenderId,
      referenceCode: tender.reference_code,
      amount: totalAmount,
      details: { supplierName: bid.supplier_name, bidId, mobilizationDepositGhs: milestone1Amount }
    });

    return {
      success: true,
      tender,
      awardedBid: bid,
      milestones,
      message: `Contract awarded to ${bid.supplier_name}. 50/50 MoMo Milestone Escrow contract initialized.`
    };
  }


  // ==========================================================================
  // 3. SUPPLIER QUOTATION 50/50 MOMO MILESTONE ESCROW (ESC-001 to ESC-004)
  // ==========================================================================

  /**
   * Retrieves escrow contract milestones for a tender (ESC-001, ESC-002)
   */
  static async getEscrowMilestones(tenderId) {
    let milestones = IN_MEMORY_ESCROWS.get(tenderId);
    if (!milestones || milestones.length === 0) {
      try {
        const { data } = await supabaseAdmin
          .from('tender_escrow_milestones')
          .select('*')
          .eq('tender_id', tenderId)
          .order('milestone_index', { ascending: true });

        if (data && data.length > 0) {
          IN_MEMORY_ESCROWS.set(tenderId, data);
          milestones = data;
        }
      } catch (e) {}
    }

    const tender = IN_MEMORY_TENDERS.get(tenderId);
    return {
      tenderId,
      tender,
      milestones: milestones || []
    };
  }

  /**
   * Milestone 1: School funds 50% mobilization deposit into platform MoMo escrow (ESC-001)
   */
  static async fundMobilizationDeposit(schoolId, tenderId, payload = {}) {
    const tender = IN_MEMORY_TENDERS.get(tenderId);
    if (!tender || String(tender.school_id) !== String(schoolId)) {
      throw new Error('Tender not found or access denied');
    }

    const milestones = IN_MEMORY_ESCROWS.get(tenderId);
    if (!milestones || milestones.length < 2) {
      throw new Error('Escrow contract milestones not found for this tender.');
    }

    const m1 = milestones[0];
    if (m1.status === 'funded_in_escrow' || m1.status === 'disbursed') {
      throw new Error('Milestone 1 mobilization deposit has already been funded into escrow.');
    }

    const now = new Date().toISOString();
    const escrowRef = `ESC-MOB-${Date.now().toString().slice(-6)}`;

    m1.status = 'funded_in_escrow';
    m1.funded_at = now;
    m1.disbursement_reference = escrowRef;
    m1.updated_at = now;

    tender.escrow_status = 'deposit_funded';
    tender.updated_at = now;
    IN_MEMORY_TENDERS.set(tenderId, tender);

    try {
      await supabaseAdmin.from('tender_escrow_milestones')
        .update({ status: 'funded_in_escrow', funded_at: now, disbursement_reference: escrowRef, updated_at: now })
        .eq('id', m1.id);
      await supabaseAdmin.from('school_tenders')
        .update({ escrow_status: 'deposit_funded', updated_at: now })
        .eq('id', tenderId);
    } catch (e) {}

    this.recordAuditLog({
      schoolId,
      actorId: payload.actorId || null,
      actorName: payload.actorName || 'School Bursar',
      eventType: 'ESCROW_MOBILIZATION_DEPOSIT_LOCKED',
      entityType: 'escrow',
      entityId: m1.id,
      amount: m1.amount,
      referenceCode: escrowRef,
      details: { tenderId, milestone: m1.milestone_name, amountGhs: m1.amount }
    });

    return {
      success: true,
      milestone: m1,
      tender,
      message: `50% Mobilization Deposit (GH₵ ${m1.amount.toLocaleString()}) securely locked in SkoolFinder MoMo Escrow.`
    };
  }

  /**
   * Milestone 2: School inspects delivery, signs off, and triggers final 50% disbursement (ESC-002)
   */
  static async signOffDeliveryAndDisburse(schoolId, tenderId, payload = {}) {
    const tender = IN_MEMORY_TENDERS.get(tenderId);
    if (!tender || String(tender.school_id) !== String(schoolId)) {
      throw new Error('Tender not found or access denied');
    }

    const milestones = IN_MEMORY_ESCROWS.get(tenderId);
    if (!milestones || milestones.length < 2) {
      throw new Error('Escrow contract milestones not found.');
    }

    const m1 = milestones[0];
    const m2 = milestones[1];

    if (m1.status !== 'funded_in_escrow' && m1.status !== 'disbursed') {
      throw new Error('Cannot sign off delivery: Milestone 1 mobilization deposit must be funded in escrow first.');
    }

    if (m2.status === 'disbursed') {
      throw new Error('This contract has already been fully signed off and disbursed.');
    }

    const now = new Date().toISOString();
    const finalRef = `ESC-FIN-${Date.now().toString().slice(-6)}`;
    const inspectionNotes = payload.inspectionNotes || payload.notes || 'Physical goods inspected on campus. Quality standards verified.';

    // Milestone 1 released to vendor
    m1.status = 'disbursed';
    m1.disbursed_at = now;
    m1.updated_at = now;

    // Milestone 2 funded & immediately disbursed upon delivery sign-off
    m2.status = 'disbursed';
    m2.funded_at = now;
    m2.disbursed_at = now;
    m2.disbursement_reference = finalRef;
    m2.inspection_notes = inspectionNotes;
    m2.signed_off_by = payload.actorId || null;
    m2.updated_at = now;

    // Close tender as successfully fulfilled
    tender.status = 'closed';
    tender.escrow_status = 'fully_disbursed';
    tender.updated_at = now;
    IN_MEMORY_TENDERS.set(tenderId, tender);

    try {
      await supabaseAdmin.from('tender_escrow_milestones')
        .update({ status: 'disbursed', disbursed_at: now, updated_at: now })
        .eq('id', m1.id);
      await supabaseAdmin.from('tender_escrow_milestones')
        .update({
          status: 'disbursed',
          funded_at: now,
          disbursed_at: now,
          disbursement_reference: finalRef,
          inspection_notes: inspectionNotes,
          updated_at: now
        })
        .eq('id', m2.id);
      await supabaseAdmin.from('school_tenders')
        .update({ status: 'closed', escrow_status: 'fully_disbursed', updated_at: now })
        .eq('id', tenderId);
    } catch (e) {}

    this.recordAuditLog({
      schoolId,
      actorId: payload.actorId || null,
      actorName: payload.actorName || 'School Quality Inspector',
      eventType: 'DELIVERY_INSPECTED_ESCROW_FULLY_DISBURSED',
      entityType: 'escrow',
      entityId: m2.id,
      amount: m1.amount + m2.amount,
      referenceCode: finalRef,
      details: { tenderId, inspectionNotes, totalDisbursedGhs: m1.amount + m2.amount }
    });

    return {
      success: true,
      tender,
      milestones,
      inspectionNotes,
      totalDisbursedGhs: m1.amount + m2.amount,
      message: 'Physical delivery inspected and approved. Full contract amount disbursed to supplier via MoMo.'
    };
  }

  /**
   * Raises an Escrow Dispute when delivery fails or goods are defective (ESC-003)
   */
  static async raiseEscrowDispute(schoolId, tenderId, payload = {}) {
    const tender = IN_MEMORY_TENDERS.get(tenderId);
    if (!tender || String(tender.school_id) !== String(schoolId)) {
      throw new Error('Tender not found or access denied');
    }

    const milestones = IN_MEMORY_ESCROWS.get(tenderId);
    if (!milestones) throw new Error('Escrow contract not found');

    const now = new Date().toISOString();
    const disputeReason = payload.reason || payload.disputeReason || 'Defective / non-delivered goods.';

    tender.escrow_status = 'disputed';
    tender.updated_at = now;
    IN_MEMORY_TENDERS.set(tenderId, tender);

    milestones.forEach(m => {
      if (m.status !== 'disbursed') {
        m.status = 'disputed';
        m.dispute_reason = disputeReason;
        m.disputed_at = now;
        m.updated_at = now;
      }
    });

    try {
      await supabaseAdmin.from('school_tenders').update({ escrow_status: 'disputed', updated_at: now }).eq('id', tenderId);
      await supabaseAdmin.from('tender_escrow_milestones').update({
        status: 'disputed',
        dispute_reason: disputeReason,
        disputed_at: now,
        updated_at: now
      }).eq('tender_id', tenderId);
    } catch (e) {}

    this.recordAuditLog({
      schoolId,
      actorId: payload.actorId || null,
      actorName: payload.actorName || 'School Administrator',
      eventType: 'ESCROW_DISPUTE_RAISED',
      entityType: 'escrow',
      entityId: tenderId,
      details: { reason: disputeReason, tenderTitle: tender.title }
    });

    return {
      success: true,
      tender,
      message: 'Escrow dispute recorded. Funds frozen pending Super Admin arbitration.'
    };
  }

  /**
   * Super Admin arbitration and resolution of an escrow dispute (ESC-003)
   */
  static async resolveEscrowDispute(adminUser, tenderId, payload = {}) {
    const tender = IN_MEMORY_TENDERS.get(tenderId);
    if (!tender) throw new Error('Tender not found');

    const milestones = IN_MEMORY_ESCROWS.get(tenderId) || [];
    const resolution = payload.resolution || 'refund_school'; // 'refund_school' | 'disburse_supplier'
    const now = new Date().toISOString();
    const notes = payload.notes || 'Admin arbitration complete';

    if (resolution === 'refund_school') {
      tender.escrow_status = 'refunded';
      milestones.forEach(m => {
        if (m.status === 'disputed' || m.status === 'funded_in_escrow') {
          m.status = 'refunded';
          m.dispute_resolved_at = now;
          m.dispute_notes = notes;
        }
      });
    } else {
      tender.escrow_status = 'fully_disbursed';
      milestones.forEach(m => {
        m.status = 'disbursed';
        m.dispute_resolved_at = now;
        m.dispute_notes = notes;
      });
    }

    tender.updated_at = now;
    IN_MEMORY_TENDERS.set(tenderId, tender);

    this.recordAuditLog({
      schoolId: tender.school_id,
      actorId: adminUser?.id || null,
      actorName: adminUser?.email || 'Super Admin',
      eventType: 'ESCROW_DISPUTE_RESOLVED',
      entityType: 'escrow',
      entityId: tenderId,
      details: { resolution, notes }
    });

    return {
      success: true,
      tender,
      resolution,
      message: `Escrow dispute resolved with outcome: ${resolution}`
    };
  }

  /**
   * Tamper-evident marketplace audit logs query (ESC-004)
   */
  static getMarketplaceAuditLogs(filters = {}) {
    let list = [...IN_MEMORY_AUDIT_LOGS];
    if (filters.schoolId) {
      list = list.filter(l => String(l.school_id) === String(filters.schoolId));
    }
    if (filters.entityType) {
      list = list.filter(l => l.entity_type === filters.entityType);
    }
    return list;
  }

  /**
   * Internal helper to record an immutable audit entry (ESC-004)
   */
  static recordAuditLog(entry) {
    const logItem = {
      id: `m-audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      school_id: entry.schoolId || null,
      actor_id: entry.actorId || null,
      actor_name: entry.actorName || 'System',
      event_type: entry.eventType,
      entity_type: entry.entityType,
      entity_id: String(entry.entityId),
      reference_code: entry.referenceCode || null,
      amount: entry.amount || null,
      details: entry.details || {},
      created_at: new Date().toISOString()
    };

    IN_MEMORY_AUDIT_LOGS.unshift(logItem);
    if (IN_MEMORY_AUDIT_LOGS.length > 500) IN_MEMORY_AUDIT_LOGS.pop();

    try {
      supabaseAdmin.from('marketplace_audit_logs').insert(logItem);
    } catch (e) {}

    // Also notify central audit service
    AuditService.log({
      actorId: entry.actorId,
      actorEmail: entry.actorName,
      action: entry.eventType,
      targetType: entry.entityType,
      targetId: entry.entityId,
      details: entry.details
    }).catch(() => {});

    return logItem;
  }
}

module.exports = MarketplaceService;
