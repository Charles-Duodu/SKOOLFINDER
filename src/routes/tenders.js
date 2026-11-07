/**
 * SkoolFinder Ghana — Institutional Managed Tenders & Sealed Bid Vault Routes
 * Baseline: Master Blueprint v2.0 (SUP-06-01 through SUP-06-08)
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { TenderService } = require('../services/tenderService');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
  try {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'skoolfinder-jwt-secret-key-ghana-2026';
    req.user = jwt.verify(authHeader.split(' ')[1], secret);
  } catch (e) {}
  return next();
};

/**
 * GET /api/tenders
 * Public: List active institutional tenders and framework agreements (SUP-06-01, SUP-06-06)
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category_id, school_id, procurement_type } = req.query;
    const tenders = await TenderService.listTenders({ category_id, school_id, procurement_type });
    return res.json({ success: true, count: tenders.length, tenders });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve institutional tenders' });
  }
});

/**
 * GET /api/tenders/:id
 * Public: Retrieve tender details, specification requirements, deadlines & addenda
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const tender = await TenderService.getTender(req.params.id);
    if (!tender) return res.status(404).json({ error: 'Tender not found' });
    return res.json({ success: true, tender });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve tender specifications' });
  }
});

/**
 * POST /api/tenders
 * Protected: School Administrator publishes high-value tender or multi-year framework (SUP-06-01, SUP-06-06)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const tender = await TenderService.createTender(req.user, req.body);
    return res.status(201).json({
      success: true,
      message: `Tender ${tender.tender_number} published successfully`,
      tender
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to publish tender' });
  }
});

/**
 * POST /api/tenders/:id/bids
 * Protected: Supplier submits sealed bid into vault with mandatory Non-Collusion Attestation (SUP-06-02, SUP-06-07)
 */
router.post('/:id/bids', authenticate, async (req, res) => {
  try {
    const bid = await TenderService.submitSealedBid(req.user, req.params.id, req.body);
    return res.status(201).json({
      success: true,
      message: `Sealed bid ${bid.bid_number} vaulted. Retains cryptographic lock until deadline.`,
      bid
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to submit sealed bid' });
  }
});

/**
 * GET /api/tenders/:id/bids
 * Protected: Enforces Sealed Vault Invariant: School evaluators blocked from viewing bids before deadline (SUP-06-02)
 */
router.get('/:id/bids', authenticate, async (req, res) => {
  try {
    const result = await TenderService.getTenderBids(req.params.id, req.user);
    if (result.is_vault_sealed && req.user.role !== 'supplier' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        code: 'BID_VAULT_SEALED',
        error: result.message,
        is_vault_sealed: true,
        submission_deadline: result.submission_deadline,
        sealed_bids_count: result.sealed_bids_count
      });
    }
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to inspect tender bids' });
  }
});

/**
 * POST /api/tenders/:id/unseal
 * Protected: School procurement desk opens bids post-deadline (SUP-06-02)
 */
router.post('/:id/unseal', authenticate, async (req, res) => {
  try {
    const force = Boolean(req.body && req.body.force) && (req.user.role === 'school_admin' || req.user.role === 'super_admin');
    const unsealed = await TenderService.unsealBids(req.params.id, req.user, force);
    return res.json(unsealed);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to unseal bids' });
  }
});

/**
 * POST /api/tenders/:id/clarifications
 * Protected: Supplier submits anonymous clarification query (SUP-06-03)
 */
router.post('/:id/clarifications', authenticate, async (req, res) => {
  try {
    const clarif = await TenderService.submitClarification(req.user, req.params.id, req.body.question_text);
    return res.status(201).json({
      success: true,
      message: 'Anonymous clarification submitted to procurement desk',
      clarification: clarif
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to submit clarification' });
  }
});

/**
 * POST /api/tenders/:id/addenda
 * Protected: School publishes formal public clarification addendum (SUP-06-03)
 */
router.post('/:id/addenda', authenticate, async (req, res) => {
  try {
    const addendum = await TenderService.publishAddendum(req.user, req.params.id, req.body);
    return res.status(201).json({
      success: true,
      message: `Addendum ${addendum.addendum_number} published to all bidders`,
      addendum
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to publish addendum' });
  }
});

/**
 * POST /api/tenders/:id/evaluate
 * Protected: Committee member records technical and commercial score (SUP-06-04)
 */
router.post('/:id/evaluate', authenticate, async (req, res) => {
  try {
    const evaluation = await TenderService.evaluateBid(req.user, req.params.id, req.body.bid_id, req.body);
    return res.status(201).json({
      success: true,
      message: 'Bid evaluation recorded with weighted scoring',
      evaluation
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to record bid evaluation' });
  }
});

/**
 * POST /api/tenders/:id/award
 * Protected: Human-approved award decision with Notice of Award and Framework Contract (DEC-015, SUP-06-05, SUP-06-06)
 */
router.post('/:id/award', authenticate, async (req, res) => {
  try {
    const awardResult = await TenderService.confirmAward(req.user, req.params.id, req.body);
    return res.status(200).json(awardResult);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to confirm tender award' });
  }
});

module.exports = router;
