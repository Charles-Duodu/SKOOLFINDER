/**
 * SkoolFinder Ghana — Public Teacher Jobs & Vacancies Router
 * Baseline: Blueprint v2.0 §12, §23, §26.4 (VAC-004, VAC-006)
 */

const express = require('express');
const router = express.Router();
const MarketplaceService = require('../services/marketplaceService');

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
router.post('/', async (req, res) => {
  try {
    const schoolId = req.body.schoolId || req.body.school_id;
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
 * Candidate submits application dossier with NTC credentials (VAC-004)
 */
router.post('/:id/apply', async (req, res) => {
  try {
    const result = await MarketplaceService.submitJobApplication(req.params.id, req.body);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;

