/**
 * SkoolFinder Ghana — Unified Case Management Engine (Service Layer)
 * Baseline: Master Blueprint v2.0 §8, §3.1 (Module 3.1); Decision v0.2-3 (POL-003, POL-020)
 * 
 * Unifies:
 *   - School Ownership Transfers & Claims (SCH-005)
 *   - Educator Vetting & Gate G4 Safeguarding Clearances (POL-004)
 *   - Parent Support Inquiries & Escrow Arbitration Disputes (POL-011)
 *   - SLA tracking with automatic countdowns and Director escalation
 *   - Two-officer dual-control sign-off rail (POL-003)
 */

const { supabaseAdmin } = require('../config/supabase');
const AuditService = require('./auditService');
const { governancePolicyEngine } = require('./governancePolicyEngine');

// Unified operational cases in-memory store
const UNIFIED_CASES = [
  {
    id: 'CAS-2026-0891',
    case_ref: 'REQ-2026-0891',
    case_type: 'ownership_transfer',
    subject: 'School Ownership Transfer & Board Resolution',
    entity_name: 'Ghana International School (GIS)',
    entity_type: 'school',
    entity_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    risk_tier: 'tier3_high',
    confidentiality: 'confidential',
    region: 'Greater Accra',
    district: 'Accra Metropolitan (AMA)',
    priority: 'high',
    status: 'dual_approval_required',
    requires_dual_signoff: true,
    primary_officer_id: '00000000-0000-0000-0000-000000000001',
    primary_officer_name: 'Officer K. Boateng',
    primary_officer_email: 'admin@skoolfinder.com.gh',
    primary_signed_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    dual_officer_id: null,
    dual_officer_name: null,
    dual_signed_at: null,
    sla_hours: 24,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 18 * 3600000).toISOString(),
    evidence_docs: [
      { name: 'GIS_Board_Resolution_Proprietor_Transfer_2026.pdf', type: 'board_resolution', size: '2.4 MB' },
      { name: 'RGD_Form3_Registered_Trustees.pdf', type: 'rgd_form3', size: '1.8 MB' }
    ],
    impact_preview: {
      affected_campuses: ['Cantonments Main Campus'],
      active_intakes: 2,
      active_enquiries: 48,
      active_staff_seats: 12,
      open_invoices: 'GH₵ 0.00 (Current)'
    },
    chronology: [
      { timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), author: 'System', text: 'Case registered following verified ownership transfer request.' },
      { timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), author: 'Officer K. Boateng', text: 'Inspected RGD Form 3 & statutory declaration. Initial review approved. Queued for Dual Sign-off.' }
    ]
  },
  {
    id: 'CAS-2026-0904',
    case_ref: 'REQ-2026-0904',
    case_type: 'safeguarding_vetting',
    subject: 'Gate G4 Child Safeguarding & Police Clearance',
    entity_name: 'Kwame Mensah (Mathematics Specialist)',
    entity_type: 'educator',
    entity_id: 'tch-01-kwame',
    risk_tier: 'safety_critical',
    confidentiality: 'restricted_safeguarding',
    region: 'Greater Accra',
    district: 'Ayawaso West',
    priority: 'urgent',
    status: 'in_review',
    requires_dual_signoff: true,
    primary_officer_id: '00000000-0000-0000-0000-000000000001',
    primary_officer_name: 'Safeguarding Lead',
    primary_officer_email: 'admin@skoolfinder.com.gh',
    primary_signed_at: null,
    sla_hours: 12,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 6 * 3600000).toISOString(),
    evidence_docs: [
      { name: 'Ghana_Police_CID_Criminal_Record_Clearance.pdf', type: 'police_clearance', size: '1.2 MB' },
      { name: 'NTC_Licensed_Teacher_Certificate_2026.pdf', type: 'ntc_license', size: '940 KB' }
    ],
    impact_preview: {
      pending_parent_consultations: 3,
      child_facing_tutoring_status: 'LOCKED (POL-004 Enforcement Active)'
    },
    chronology: [
      { timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), author: 'System', text: 'CID Police Clearance uploaded by educator.' },
      { timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), author: 'Safeguarding Lead', text: 'Cross-checked CID hologram and NTC portal. Background verification clean.' }
    ]
  },
  {
    id: 'CAS-2026-0912',
    case_ref: 'REQ-2026-0912',
    case_type: 'institution_claim',
    subject: 'NaSIA Accreditation & Ownership Verification',
    entity_name: 'Achimota Basic School',
    entity_type: 'school',
    entity_id: 'sch-achimota',
    risk_tier: 'tier2_medium',
    confidentiality: 'internal',
    region: 'Greater Accra',
    district: 'Okaikwei North',
    priority: 'medium',
    status: 'submitted',
    requires_dual_signoff: false,
    primary_officer_id: null,
    primary_officer_name: 'Unassigned',
    primary_officer_email: null,
    primary_signed_at: null,
    sla_hours: 48,
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 34 * 3600000).toISOString(),
    evidence_docs: [
      { name: 'NaSIA_Accreditation_Certificate_2026.pdf', type: 'nasia_license', size: '3.1 MB' }
    ],
    impact_preview: {
      directory_status: 'Listed (Unclaimed)',
      confidence_score: '91% (Exact Register Match)'
    },
    chronology: [
      { timestamp: new Date(Date.now() - 14 * 3600000).toISOString(), author: 'System', text: 'Claim submitted by Headteacher with Ghana Card PIN GHA-729482910-4.' }
    ]
  },
  {
    id: 'CAS-2026-0925',
    case_ref: 'REQ-2026-0925',
    case_type: 'dispute_arbitration',
    subject: 'Escrow Milestone Refund Arbitration (Textbook Order)',
    entity_name: 'Wesley Girls Basic & Sedco Publishing',
    entity_type: 'procurement',
    entity_id: 'tender-089',
    risk_tier: 'tier2_medium',
    confidentiality: 'internal',
    region: 'Greater Accra',
    district: 'Ablekuma West',
    priority: 'high',
    status: 'arbitrating',
    requires_dual_signoff: true,
    primary_officer_id: '00000000-0000-0000-0000-000000000001',
    primary_officer_name: 'Finance Officer',
    primary_officer_email: 'admin@skoolfinder.com.gh',
    primary_signed_at: null,
    sla_hours: 24,
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    sla_due_at: new Date(Date.now() + 14 * 3600000).toISOString(),
    evidence_docs: [
      { name: 'Waybill_Short_Delivery_Notice.pdf', type: 'delivery_dispute', size: '650 KB' }
    ],
    impact_preview: {
      frozen_escrow_ghs: 'GH₵ 3,200.00',
      payout_rail: 'MTN Mobile Money'
    },
    chronology: [
      { timestamp: new Date(Date.now() - 10 * 3600000).toISOString(), author: 'School Head', text: 'Reported partial delivery of Cambridge science curriculum textbooks.' },
      { timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), author: 'Finance Officer', text: 'Vendor agrees to refund unfulfilled 40% balance. Preparing credit note.' }
    ]
  }
];

class CaseManagementService {
  /**
   * Retrieves all operational cases with computed SLA hours and search filters
   */
  async getCases(filters = {}) {
    let cases = [...UNIFIED_CASES];

    // Compute live SLA remaining time for each case
    const now = Date.now();
    cases = cases.map(c => {
      const dueTime = new Date(c.sla_due_at).getTime();
      const diffMs = dueTime - now;
      const hoursRemaining = Math.round((diffMs / 3600000) * 10) / 10;
      const isOverdue = diffMs < 0;

      return {
        ...c,
        hours_remaining: hoursRemaining,
        sla_status_badge: isOverdue ? 'OVERDUE' : (hoursRemaining <= 8 ? 'URGENT' : 'ON_TRACK'),
        sla_label: isOverdue ? `${Math.abs(hoursRemaining)}h overdue` : `${hoursRemaining}h remaining`
      };
    });

    if (filters.status && filters.status.toLowerCase() !== 'all' && filters.status !== 'undefined') {
      cases = cases.filter(c => c.status === filters.status);
    }
    if (filters.case_type && filters.case_type.toLowerCase() !== 'all' && filters.case_type !== 'undefined') {
      cases = cases.filter(c => c.case_type === filters.case_type);
    }
    if (filters.search && filters.search !== 'undefined') {
      const q = filters.search.toLowerCase();
      cases = cases.filter(c => 
        c.case_ref.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.entity_name.toLowerCase().includes(q)
      );
    }

    return cases;
  }

  /**
   * Retrieves a single case by reference with complete history
   */
  async getCaseById(caseId) {
    const cases = await this.getCases();
    return cases.find(c => c.id === caseId || c.case_ref === caseId) || null;
  }

  /**
   * Primary Reviewer Decision Sign-off
   */
  async recordPrimaryDecision(caseId, { decision, notes = '' }, officer) {
    const targetCase = UNIFIED_CASES.find(c => c.id === caseId || c.case_ref === caseId);
    if (!targetCase) throw new Error('Case not found');

    targetCase.primary_officer_id = officer.id;
    targetCase.primary_officer_name = officer.name || officer.fullName || 'Admin Officer';
    targetCase.primary_officer_email = officer.email;
    targetCase.primary_signed_at = new Date().toISOString();

    if (decision === 'approve') {
      if (targetCase.requires_dual_signoff) {
        targetCase.status = 'dual_approval_required';
        targetCase.chronology.push({
          timestamp: new Date().toISOString(),
          author: targetCase.primary_officer_name,
          text: `Primary approval signed: "${notes || 'Approved based on regulatory review'}". Forwarded to Dual Sign-off Rail.`
        });
      } else {
        targetCase.status = 'approved';
        targetCase.chronology.push({
          timestamp: new Date().toISOString(),
          author: targetCase.primary_officer_name,
          text: `Case approved: "${notes || 'Verified and completed'}".`
        });
      }
    } else if (decision === 'reject') {
      targetCase.status = 'rejected';
      targetCase.chronology.push({
        timestamp: new Date().toISOString(),
        author: targetCase.primary_officer_name,
        text: `Case rejected: "${notes || 'Documentation insufficient'}".`
      });
    }

    // Audit log with SHA-256
    await AuditService.log({
      actorId: officer.id,
      actorEmail: officer.email,
      actorRole: officer.role,
      action: `CASE_PRIMARY_REVIEW_${decision.toUpperCase()}`,
      targetType: 'case_management',
      targetId: targetCase.case_ref,
      details: { decision, notes, status: targetCase.status }
    });

    return targetCase;
  }

  /**
   * Independent Dual-Control Sign-off (POL-003 Enforced)
   */
  async recordDualApproval(caseId, { notes = '' }, dualOfficer) {
    const targetCase = UNIFIED_CASES.find(c => c.id === caseId || c.case_ref === caseId);
    if (!targetCase) throw new Error('Case not found');

    if (!targetCase.requires_dual_signoff) {
      throw new Error('This case does not require dual-control sign-off.');
    }

    // Zero Self-Approval Guardrail Evaluation (POL-003)
    const policyResult = governancePolicyEngine.validateDualControl({
      primaryOfficer: { id: targetCase.primary_officer_id, email: targetCase.primary_officer_email },
      dualOfficer,
      action: targetCase.case_type,
      resourceId: targetCase.case_ref
    });

    if (!policyResult.valid) {
      throw new Error(policyResult.error);
    }

    targetCase.dual_officer_id = dualOfficer.id;
    targetCase.dual_officer_name = dualOfficer.name || dualOfficer.fullName || 'Dual Reviewer';
    targetCase.dual_signed_at = new Date().toISOString();
    targetCase.status = 'approved_dual_completed';

    targetCase.chronology.push({
      timestamp: new Date().toISOString(),
      author: targetCase.dual_officer_name,
      text: `Independent dual approval executed: "${notes || 'Verified board credentials and regulatory filings'}". Transaction sealed.`
    });

    // Audit log
    await AuditService.log({
      actorId: dualOfficer.id,
      actorEmail: dualOfficer.email,
      actorRole: dualOfficer.role,
      action: `CASE_DUAL_CONTROL_SEALED`,
      targetType: 'case_management',
      targetId: targetCase.case_ref,
      details: {
        primaryOfficer: targetCase.primary_officer_email,
        dualOfficer: dualOfficer.email,
        notes
      }
    });

    return targetCase;
  }
}

const caseManagementService = new CaseManagementService();
module.exports = {
  caseManagementService,
  UNIFIED_CASES
};
