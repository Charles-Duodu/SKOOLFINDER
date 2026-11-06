/**
 * SkoolFinder Ghana — Governance Policy Engine & Tamper-Evident Audit Router
 * Baseline: Master Blueprint v2.0 §5.4, §5.5, Decisions v0.4-7, POL-001 through POL-021
 */

const express = require('express');
const router = express.Router();
const { governancePolicyEngine, GOVERNANCE_POLICIES } = require('../services/governancePolicyEngine');
const AuditService = require('../services/auditService');
const { authenticate } = require('../middleware/auth');

/**
 * Super Admin authorization guard for policy modifications and audit verification
 */
function adminOnlyGuard(req, res, next) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden: Super Administrator access required.' });
  }
  next();
}

// ============================================================================
// 1. POLICY ENGINE RULES CATALOGUE (POL-001 to POL-021)
// ============================================================================

/**
 * GET /api/policy/rules
 * Returns active platform governance policies with server-enforced statuses
 */
router.get('/rules', (req, res) => {
  const policies = governancePolicyEngine.getPolicies();
  res.json({
    success: true,
    version: '2.0.0-GA',
    governingStandard: 'Ghana Master Blueprint v2.0 & Act 843 / Act 560 / Act 1023',
    totalPolicies: policies.length,
    activePoliciesCount: policies.filter(p => p.status === 'ACTIVE').length,
    policies
  });
});

/**
 * GET /api/policy/rules/:id
 * Retrieve details for a specific policy (e.g. POL-004)
 */
router.get('/rules/:id', (req, res) => {
  const policy = governancePolicyEngine.getPolicyById(req.params.id);
  if (!policy) {
    return res.status(404).json({ success: false, error: 'Policy rule not found.' });
  }
  res.json({ success: true, policy });
});

// ============================================================================
// 2. CONTEXT-AWARE POLICY EVALUATION (DEC-020)
// ============================================================================

/**
 * POST /api/policy/evaluate
 * Evaluates an actor + action + resource + scope on the server
 */
router.post('/evaluate', authenticate, (req, res) => {
  const { action, resource, scope, context } = req.body;
  if (!action || !resource) {
    return res.status(400).json({ error: 'Action and resource are required for policy evaluation.' });
  }

  const result = governancePolicyEngine.evaluate({
    actor: req.user,
    action,
    resource,
    scope: scope || {},
    context: context || {}
  });

  res.json({
    success: true,
    evaluation: result
  });
});

/**
 * POST /api/policy/validate-dual-control
 * Verifies two-officer independent authorization for high-risk operations (POL-003)
 */
router.post('/validate-dual-control', authenticate, adminOnlyGuard, (req, res) => {
  const { primaryOfficer, action, resourceId, amountGhs } = req.body;
  const dualOfficer = req.user;

  const result = governancePolicyEngine.validateDualControl({
    primaryOfficer,
    dualOfficer,
    action,
    resourceId,
    amountGhs
  });

  if (!result.valid) {
    return res.status(403).json({ success: false, ...result });
  }

  AuditService.log({
    actorEmail: dualOfficer.email,
    actorRole: dualOfficer.role,
    action: `DUAL_CONTROL_APPROVED_${action}`,
    targetType: 'governance_dual_signoff',
    targetId: resourceId,
    details: {
      primaryOfficer: primaryOfficer.email,
      dualOfficer: dualOfficer.email,
      amountGhs
    }
  });

  res.json({ success: true, ...result });
});

// ============================================================================
// 3. CRYPTOGRAPHIC AUDIT VERIFICATION & DECISION LOGS (POL-014)
// ============================================================================

/**
 * GET /api/policy/audit
 * Returns recent policy evaluation decisions
 */
router.get('/audit', authenticate, adminOnlyGuard, (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const logs = governancePolicyEngine.getEvaluationAuditLogs(limit);
  res.json({ success: true, total: logs.length, logs });
});

/**
 * GET /api/policy/verify-audit-chain
 * Executes real-time SHA-256 cryptographic verification of the audit ledger
 */
router.get('/verify-audit-chain', authenticate, adminOnlyGuard, (req, res) => {
  const integrity = AuditService.verifyIntegrity();
  res.json({
    success: true,
    integrity
  });
});

module.exports = router;

