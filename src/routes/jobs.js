/**
 * SkoolFinder Ghana — Public Teacher Jobs & Vacancies Router
 * Baseline: Blueprint v2.0 §12, §23, §26.4 (VAC-004, VAC-006, DEC-007, REC-01 to REC-04)
 */

const express = require('express');
const router = express.Router();
const MarketplaceService = require('../services/marketplaceService');
const { optionalAuth, authenticate } = require('../middleware/auth');

/**
 * GET /api/jobs
 * Returns published active teacher vacancies with filters (VAC-006)
 */
router.get('/', async (req, res) => {
  try {
    const jobs = await MarketplaceService.getPublicJobs(req.query);
    return res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    return res.status(500).json({ error: 'Failed to fetch job vacancies' });
  }
});

// ============================================================================
// RECRUITER CANDIDATE SEARCH & UNLOCK ENDPOINTS (REC-01 to REC-04)
// Must be defined BEFORE /:id route
// ============================================================================

/**
 * GET /api/jobs/recruiter/search
 * School recruiters search verified educator pool with contact masking
 */
router.get('/recruiter/search', optionalAuth, async (req, res) => {
  try {
    const schoolId = req.query.schoolId || req.user?.school_id || 'sch-recruiter';
    const result = await MarketplaceService.searchCandidates(schoolId, req.query);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/jobs/recruiter/unlock
 * School recruiter unlocks candidate unmasked contact info (phone, email)
 */
router.post('/recruiter/unlock', optionalAuth, async (req, res) => {
  try {
    const schoolId = req.body.schoolId || req.user?.school_id;
    const candidateId = req.body.candidateId;
    if (!schoolId || !candidateId) {
      return res.status(400).json({ error: 'schoolId and candidateId are required to unlock contact details' });
    }
    const result = await MarketplaceService.unlockCandidate(schoolId, candidateId, req.user?.id);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ============================================================================
// CANDIDATE EMPLOYMENT OFFER LETTER ENDPOINTS (DEC-026)
// ============================================================================

/**
 * GET /api/jobs/applications/:appId/offer
 * Candidate reviews formal employment offer letter
 */
router.get('/applications/:appId/offer', async (req, res) => {
  try {
    const offer = await MarketplaceService.getTeacherOfferLetter(req.params.appId);
    if (!offer) return res.status(404).json({ error: 'Employment offer letter not found' });
    return res.json({ success: true, offer });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/jobs/applications/:appId/offer
 * School recruiter issues formal employment offer letter
 */
router.post('/applications/:appId/offer', optionalAuth, async (req, res) => {
  try {
    const schoolId = req.body.schoolId || req.user?.school_id || 'sch-gis';
    const result = await MarketplaceService.issueTeacherOfferLetter(schoolId, req.params.appId, req.body);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/jobs/applications/:appId/offer-response
 * Candidate accepts or declines employment offer letter
 */
router.post('/applications/:appId/offer-response', async (req, res) => {
  try {
    const result = await MarketplaceService.respondTeacherOfferLetter(req.params.appId, req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/jobs/:id
 * Single job details
 */
router.get('/:id', async (req, res) => {
  try {
    const jobs = await MarketplaceService.getPublicJobs({});
    const job = jobs.find(j => String(j.id) === String(req.params.id));
    if (!job) return res.status(404).json({ error: 'Job vacancy not found' });
    return res.json(job);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch job vacancy' });
  }
});

/**
 * POST /api/jobs
 * Post a job directly (e.g. from JobsView modal)
 */
router.post('/', optionalAuth, async (req, res) => {
  try {
    const schoolId = req.body.schoolId || req.body.school_id || req.user?.school_id;
    if (!schoolId) {
      return res.status(400).json({ error: 'School ID is required to post a vacancy' });
    }
    const result = await MarketplaceService.createVacancy(schoolId, req.body);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/jobs/:id/apply
 * Candidate submits application dossier with point-in-time immutable snapshot (DEC-007, VAC-004)
 */
router.post('/:id/apply', optionalAuth, async (req, res) => {
  try {
    const result = await MarketplaceService.submitJobApplication(req.params.id, req.body, req.user?.id);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
