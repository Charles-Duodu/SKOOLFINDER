/**
 * SkoolFinder Ghana — Unified Case Management Engine Express Router
 * Baseline: Master Blueprint v2.0 Module 3.1 & Module 1.3
 */

const express = require('express');
const router = express.Router();
const { caseManagementService } = require('../services/caseManagementService');
const { authenticate } = require('../middleware/auth');

/**
 * Super Admin authorization guard
 */
function adminOnlyGuard(req, res, next) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden: Super Administrator access required.' });
  }
  next();
}

router.use(authenticate);
router.use(adminOnlyGuard);

/**
 * GET /api/cases
 * Returns all cases with SLA countdowns, urgency badges, and filters
 */
router.get('/', async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      case_type: req.query.case_type,
      search: req.query.search
    };
    const cases = await caseManagementService.getCases(filters);

    const pendingApprovalsCount = cases.filter(c => c.status === 'dual_approval_required').length;
    const overdueCount = cases.filter(c => c.sla_status_badge === 'OVERDUE').length;
    const urgentCount = cases.filter(c => c.sla_status_badge === 'URGENT').length;

    res.json({
      success: true,
      total: cases.length,
      metrics: {
        pendingDualApprovals: pendingApprovalsCount,
        overdueCases: overdueCount,
        urgentCases: urgentCount
      },
      cases
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/cases/:id
 * Retrieve details for a specific case
 */
router.get('/:id', async (req, res) => {
  try {
    const c = await caseManagementService.getCaseById(req.params.id);
    if (!c) {
      return res.status(404).json({ success: false, error: 'Case not found.' });
    }
    res.json({ success: true, case: c });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/cases/:id/primary-decision
 * Primary review decision (approve, reject)
 */
router.post('/:id/primary-decision', async (req, res) => {
  try {
    const { decision, notes } = req.body;
    if (!decision) {
      return res.status(400).json({ success: false, error: 'Decision (approve or reject) is required.' });
    }
    const updated = await caseManagementService.recordPrimaryDecision(req.params.id, { decision, notes }, req.user);
    res.json({ success: true, message: `Primary decision recorded: ${decision}`, case: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/cases/:id/dual-approval
 * Independent dual-control approval (POL-003 Zero Self-Approval Enforced)
 */
router.post('/:id/dual-approval', async (req, res) => {
  try {
    const { notes } = req.body;
    const updated = await caseManagementService.recordDualApproval(req.params.id, { notes }, req.user);
    res.json({ success: true, message: 'Dual-control independent approval successfully executed.', case: updated });
  } catch (err) {
    res.status(403).json({ success: false, error: err.message });
  }
});

module.exports = router;

