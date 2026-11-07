/**
 * SkoolFinder Ghana — Institutional Managed Tenders & Sealed Bid Vault Service
 * Baseline: Master Blueprint v2.0 (SUP-06-01 through SUP-06-08)
 */

const { supabaseAdmin } = require('../config/supabase');

// In-Memory Resilience Storage for Stage 6 Managed Tenders
const IN_MEMORY_TENDERS = [
  {
    id: 'tnd-sample-01',
    tender_number: 'TND-2026-88102',
    school_id: 'sch-gis-accra',
    school_name: 'Ghana International School',
    title: 'Supply and Installation of Campus-Wide STEM Robotics & AI Laboratories',
    category_id: 'cat-stem',
    procurement_type: 'high_value_tender',
    estimated_value_ghs: 350000.00,
    is_framework_agreement: false,
    framework_duration_months: 0,
    clarification_deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
    submission_deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
    opening_date: new Date(Date.now() + 10 * 86400000).toISOString(),
    status: 'published',
    technical_weight_percent: 60,
    commercial_weight_percent: 40,
    tender_security_required: true,
    tender_security_amount_ghs: 7000.00,
    specifications_doc_url: 'https://cdn.skoolfinder.com.gh/tenders/GIS-STEM-SPEC-2026.pdf',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'tnd-sample-02',
    tender_number: 'TND-2026-44019',
    school_id: 'sch-sos-tema',
    school_name: 'SOS-Hermann Gmeiner International College',
    title: '3-Year Multi-Campus Educational Stationery & Examination Materials Framework',
    category_id: 'cat-books',
    procurement_type: 'framework_agreement',
    estimated_value_ghs: 600000.00,
    is_framework_agreement: true,
    framework_duration_months: 36,
    clarification_deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
    submission_deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
    opening_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    status: 'published',
    technical_weight_percent: 50,
    commercial_weight_percent: 50,
    tender_security_required: false,
    tender_security_amount_ghs: 0.00,
    specifications_doc_url: 'https://cdn.skoolfinder.com.gh/tenders/SOS-STATIONERY-FWC-2026.pdf',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const IN_MEMORY_SEALED_BIDS = [];
const IN_MEMORY_CLARIFICATIONS = [];
const IN_MEMORY_ADDENDA = [];
const IN_MEMORY_EVALUATIONS = [];
const IN_MEMORY_AWARDS = [];
const IN_MEMORY_FRAMEWORK_CONTRACTS = [];

class TenderService {
  /**
   * List active published institutional tenders (SUP-06-01)
   */
  static async listTenders(filters = {}) {
    let tenders = [...IN_MEMORY_TENDERS];

    if (filters.school_id) {
      tenders = tenders.filter(t => t.school_id === filters.school_id);
    }
    if (filters.category_id && filters.category_id !== 'All') {
      tenders = tenders.filter(t => t.category_id === filters.category_id);
    }
    if (filters.procurement_type) {
      tenders = tenders.filter(t => t.procurement_type === filters.procurement_type);
    }

    return tenders;
  }

  /**
   * Get single tender by ID or tender_number
   */
  static async getTender(idOrNumber) {
    let t = IN_MEMORY_TENDERS.find(item => item.id === idOrNumber || item.tender_number === idOrNumber);
    if (!t) {
      try {
        const { data } = await supabaseAdmin.from('institutional_tenders').select('*').or(`id.eq.${idOrNumber},tender_number.eq.${idOrNumber}`).maybeSingle();
        if (data) t = data;
      } catch (e) {}
    }
    return t;
  }

  /**
   * Publish a high-value tender or multi-year framework (SUP-06-01, SUP-06-06)
   */
  static async createTender(schoolUser, payload) {
    if (!['school_admin', 'super_admin'].includes(schoolUser.role)) {
      throw new Error('Only accredited school administrators and super admins can publish managed tenders (SUP-06-01)');
    }

    if (!payload.title || !payload.title.trim()) throw new Error('Tender title is required');
    if (!payload.submission_deadline) throw new Error('Submission deadline is required');

    const tenderNumber = `TND-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const submissionDeadline = new Date(payload.submission_deadline);
    const clarificationDeadline = payload.clarification_deadline ? new Date(payload.clarification_deadline) : new Date(now.getTime() + 5 * 86400000);
    const openingDate = payload.opening_date ? new Date(payload.opening_date) : submissionDeadline;

    const tender = {
      id: `tnd-${Date.now()}`,
      tender_number: tenderNumber,
      school_id: schoolUser.school_id || schoolUser.id,
      school_name: schoolUser.schoolName || 'Accredited Institution',
      title: payload.title.trim(),
      category_id: payload.category_id || 'cat-stem',
      procurement_type: payload.is_framework_agreement ? 'framework_agreement' : (payload.procurement_type || 'high_value_tender'),
      estimated_value_ghs: parseFloat(payload.estimated_value_ghs) || 150000.00,
      is_framework_agreement: !!payload.is_framework_agreement,
      framework_duration_months: payload.is_framework_agreement ? (parseInt(payload.framework_duration_months) || 12) : 0,
      clarification_deadline: clarificationDeadline.toISOString(),
      submission_deadline: submissionDeadline.toISOString(),
      opening_date: openingDate.toISOString(),
      status: 'published',
      technical_weight_percent: parseInt(payload.technical_weight_percent) || 60,
      commercial_weight_percent: parseInt(payload.commercial_weight_percent) || 40,
      tender_security_required: !!payload.tender_security_required,
      tender_security_amount_ghs: parseFloat(payload.tender_security_amount_ghs) || 0.00,
      specifications_doc_url: payload.specifications_doc_url || '',
      created_at: now.toISOString()
    };

    IN_MEMORY_TENDERS.unshift(tender);

    try {
      await supabaseAdmin.from('institutional_tenders').insert(tender);
    } catch (e) {}

    return tender;
  }

  /**
   * Submit a sealed bid to the tender vault (SUP-06-02, SUP-06-07)
   */
  static async submitSealedBid(supplierUser, tenderId, payload) {
    const tender = await this.getTender(tenderId);
    if (!tender) throw new Error('Tender not found');

    const now = new Date();
    const deadline = new Date(tender.submission_deadline);
    if (now > deadline) {
      throw new Error('Tender submission deadline has passed. Tender vault is closed for new bids (SUP-06-02)');
    }

    // SUP-06-07: Mandatory Non-Collusion Attestation
    if (!payload.non_collusion_attestation) {
      throw new Error('Submission rejected: Statutory Non-Collusion and Integrity Declaration must be accepted (SUP-06-07)');
    }

    const bidAmount = parseFloat(payload.bid_amount_ghs);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      throw new Error('A valid commercial bid amount is required');
    }

    const bidNumber = `BID-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const sealedBid = {
      id: `bid-${Date.now()}`,
      bid_number: bidNumber,
      tender_id: tender.id,
      supplier_id: supplierUser.id,
      supplier_name: supplierUser.companyName || supplierUser.full_name || 'Accredited Supplier',
      bid_amount_ghs: bidAmount,
      currency: 'GHS',
      technical_proposal_url: payload.technical_proposal_url || '',
      commercial_proposal_url: payload.commercial_proposal_url || '',
      tender_security_ref: payload.tender_security_ref || '',
      delivery_schedule_days: parseInt(payload.delivery_schedule_days) || 30,
      warranty_months: parseInt(payload.warranty_months) || 12,
      non_collusion_attestation: true,
      conflict_of_interest_declaration: payload.conflict_of_interest_declaration || 'None declared',
      is_sealed: true, // Sealed until deadline unsealing
      unsealed_at: null,
      status: 'submitted',
      created_at: now.toISOString()
    };

    IN_MEMORY_SEALED_BIDS.unshift(sealedBid);

    try {
      await supabaseAdmin.from('tender_sealed_bids').insert(sealedBid);
    } catch (e) {}

    return sealedBid;
  }

  /**
   * Check bid vault access and enforce deadline unsealing invariant (SUP-06-02)
   */
  static async getTenderBids(tenderId, requestingUser) {
    const tender = await this.getTender(tenderId);
    if (!tender) throw new Error('Tender not found');

    const now = new Date();
    const deadline = new Date(tender.submission_deadline);
    const deadlinePassed = now >= deadline || tender.status === 'opened' || tender.status === 'evaluating';

    // If requester is a supplier: can only inspect their OWN bid
    if (requestingUser.role === 'supplier') {
      const myBids = IN_MEMORY_SEALED_BIDS.filter(b => b.tender_id === tender.id && b.supplier_id === requestingUser.id);
      return {
        tender_number: tender.tender_number,
        is_vault_sealed: !deadlinePassed,
        submission_deadline: tender.submission_deadline,
        bids: myBids
      };
    }

    // Requester is School Admin / Evaluator:
    // INVARIANT CHECK (SUP-06-02): If deadline has not passed, bid vault is SEALED
    if (!deadlinePassed && requestingUser.role !== 'super_admin') {
      const bidCount = IN_MEMORY_SEALED_BIDS.filter(b => b.tender_id === tender.id).length;
      return {
        tender_number: tender.tender_number,
        is_vault_sealed: true,
        submission_deadline: tender.submission_deadline,
        message: 'SEALED BID VAULT ACTIVE: Tender submissions are locked and inaccessible until the deadline passes (SUP-06-02)',
        sealed_bids_count: bidCount,
        bids: [] // strictly empty before deadline!
      };
    }

    // Deadline has passed: Return unsealed bids
    const tenderBids = IN_MEMORY_SEALED_BIDS.filter(b => b.tender_id === tender.id);
    return {
      tender_number: tender.tender_number,
      is_vault_sealed: false,
      submission_deadline: tender.submission_deadline,
      unsealed_count: tenderBids.length,
      bids: tenderBids
    };
  }

  /**
   * Unseal bids post-deadline (SUP-06-02)
   */
  static async unsealBids(tenderId, schoolUser, force = false) {
    const tender = await this.getTender(tenderId);
    if (!tender) throw new Error('Tender not found');

    const now = new Date();
    const deadline = new Date(tender.submission_deadline);

    if (now < deadline && schoolUser.role !== 'super_admin' && !force) {
      throw new Error(`Cannot unseal bids: Submission deadline (${tender.submission_deadline}) has not elapsed (SUP-06-02)`);
    }

    tender.status = 'opened';
    const bids = IN_MEMORY_SEALED_BIDS.filter(b => b.tender_id === tender.id);
    bids.forEach(b => {
      b.is_sealed = false;
      b.unsealed_at = now.toISOString();
      b.status = 'unsealed';
    });

    return {
      success: true,
      tender_number: tender.tender_number,
      unsealed_count: bids.length,
      unsealed_at: now.toISOString()
    };
  }

  /**
   * Submit anonymous clarification inquiry (SUP-06-03)
   */
  static async submitClarification(supplierUser, tenderId, questionText) {
    const tender = await this.getTender(tenderId);
    if (!tender) throw new Error('Tender not found');

    if (!questionText || !questionText.trim()) throw new Error('Clarification question is required');

    const clarif = {
      id: `clr-${Date.now()}`,
      tender_id: tender.id,
      supplier_id: supplierUser.id,
      question_text: questionText.trim(),
      is_anonymous: true,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    IN_MEMORY_CLARIFICATIONS.push(clarif);
    return clarif;
  }

  /**
   * Publish formal clarification addendum to all bidders (SUP-06-03)
   */
  static async publishAddendum(schoolUser, tenderId, payload) {
    const tender = await this.getTender(tenderId);
    if (!tender) throw new Error('Tender not found');

    if (!payload.title || !payload.response_details) throw new Error('Addendum title and response details are required');

    const count = IN_MEMORY_ADDENDA.filter(a => a.tender_id === tender.id).length + 1;
    const addendum = {
      id: `add-${Date.now()}`,
      addendum_number: `ADD-${tender.tender_number}-${String(count).padStart(2, '0')}`,
      tender_id: tender.id,
      title: payload.title.trim(),
      clarification_summary: payload.clarification_summary || payload.title,
      response_details: payload.response_details.trim(),
      published_at: new Date().toISOString()
    };

    IN_MEMORY_ADDENDA.push(addendum);
    return addendum;
  }

  /**
   * Score bid in committee evaluation (SUP-06-04)
   */
  static async evaluateBid(evaluatorUser, tenderId, bidId, payload) {
    const tender = await this.getTender(tenderId);
    if (!tender) throw new Error('Tender not found');

    const bid = IN_MEMORY_SEALED_BIDS.find(b => b.id === bidId);
    if (!bid) throw new Error('Bid not found');

    const techScore = parseFloat(payload.technical_score) || 0;
    const commScore = parseFloat(payload.commercial_score) || 0;

    const techWeight = (tender.technical_weight_percent || 60) / 100;
    const commWeight = (tender.commercial_weight_percent || 40) / 100;
    const weightedScore = parseFloat(((techScore * techWeight) + (commScore * commWeight)).toFixed(2));

    const evalRecord = {
      id: `eval-${Date.now()}`,
      tender_id: tender.id,
      bid_id: bid.id,
      evaluator_user_id: evaluatorUser.id,
      evaluator_name: evaluatorUser.full_name || 'Procurement Committee Member',
      evaluator_role: evaluatorUser.role || 'Evaluator',
      technical_score: techScore,
      commercial_score: commScore,
      weighted_total_score: weightedScore,
      compliance_notes: payload.compliance_notes || '',
      recommendation: payload.recommendation || (weightedScore >= 70 ? 'shortlist' : 'reject'),
      created_at: new Date().toISOString()
    };

    IN_MEMORY_EVALUATIONS.push(evalRecord);
    return evalRecord;
  }

  /**
   * Confirm human-authorized award decision (DEC-015, SUP-06-05, SUP-06-06)
   */
  static async confirmAward(authorizingUser, tenderId, payload) {
    // DEC-015 Compliance: Explicit human authorization check
    if (!authorizingUser || !payload.human_confirmation_signed) {
      throw new Error('DEC-015 Policy Violation: Autonomous contract award is prohibited. Authenticated human procurement officer signature is required (SUP-06-05)');
    }

    const tender = await this.getTender(tenderId);
    if (!tender) throw new Error('Tender not found');

    const winningBid = IN_MEMORY_SEALED_BIDS.find(b => b.id === payload.winning_bid_id);
    if (!winningBid) throw new Error('Winning bid record not found');

    const awardNoticeNumber = `NOA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const awardRecord = {
      id: `award-${Date.now()}`,
      award_notice_number: awardNoticeNumber,
      tender_id: tender.id,
      winning_bid_id: winningBid.id,
      winning_supplier_id: winningBid.supplier_id,
      winning_supplier_name: winningBid.supplier_name,
      awarded_amount_ghs: winningBid.bid_amount_ghs,
      approved_by_user_id: authorizingUser.id,
      approved_by_name: authorizingUser.full_name || 'Prof. Kwesi Mensah',
      approved_by_title: payload.approved_by_title || 'Chair of Procurement Committee',
      award_rationale: payload.award_rationale || 'Highest combined technical and commercial score in accordance with tender evaluation criteria',
      awarded_at: new Date().toISOString()
    };

    // Update statuses
    tender.status = 'awarded';
    winningBid.status = 'awarded';

    // Mark other bids as unsuccessful
    IN_MEMORY_SEALED_BIDS.filter(b => b.tender_id === tender.id && b.id !== winningBid.id).forEach(b => {
      b.status = 'unsuccessful';
    });

    IN_MEMORY_AWARDS.push(awardRecord);

    // If multi-year framework agreement: generate framework contract (SUP-06-06)
    let frameworkContract = null;
    if (tender.is_framework_agreement) {
      const contractNumber = `FWC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      frameworkContract = {
        id: `fwc-${Date.now()}`,
        contract_number: contractNumber,
        tender_id: tender.id,
        supplier_id: winningBid.supplier_id,
        school_id: tender.school_id,
        term_months: tender.framework_duration_months || 36,
        ceiling_value_ghs: tender.estimated_value_ghs,
        drawdowns_total_ghs: 0.00,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + (tender.framework_duration_months || 36) * 30 * 86400000).toISOString(),
        created_at: new Date().toISOString()
      };
      IN_MEMORY_FRAMEWORK_CONTRACTS.push(frameworkContract);
    }

    return {
      success: true,
      award_notice: awardRecord,
      framework_contract: frameworkContract,
      message: `Tender contract awarded to ${winningBid.supplier_name}. Notice of Award ${awardNoticeNumber} issued.`
    };
  }
}

module.exports = {
  TenderService,
  IN_MEMORY_TENDERS,
  IN_MEMORY_SEALED_BIDS,
  IN_MEMORY_ADDENDA,
  IN_MEMORY_EVALUATIONS,
  IN_MEMORY_AWARDS,
  IN_MEMORY_FRAMEWORK_CONTRACTS
};
