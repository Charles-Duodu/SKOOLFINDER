/**
 * SkoolFinder Ghana — Regulatory Integration Express Router
 * ============================================================================
 * Official endpoints for Ghana National Schools Inspectorate Authority (NaSIA)
 * Pre-Tertiary School Register (Act 1023), Ghana Education Service (GES) EMIS,
 * and National Identification Authority (Ghana Card PIN) validation.
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const { NasiaRegistryService } = require('../services/nasiaRegistryService');

/**
 * POST /api/regulatory/nasia/cross-check
 * Algorithmic cross-check of submitted school claim against official NaSIA register
 */
router.post('/nasia/cross-check', async (req, res, next) => {
  try {
    const result = NasiaRegistryService.crossCheckSchool(req.body);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/regulatory/nasia/lookup
 * Search official NaSIA register by name, license number, or locality
 */
router.get('/nasia/lookup', async (req, res, next) => {
  try {
    const query = req.query.q || req.query.query || '';
    if (!query) {
      return res.status(400).json({ error: 'Search query parameter (q) is required' });
    }
    const results = NasiaRegistryService.lookupRegistry(query);
    return res.json({
      success: true,
      query,
      count: results.length,
      results
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/regulatory/nasia/stats
 * Telemetry and aggregated licensing statistics across Ghana pre-tertiary institutions
 */
router.get('/nasia/stats', async (req, res, next) => {
  try {
    const stats = NasiaRegistryService.getRegistryStatistics();
    return res.json({
      success: true,
      stats,
      regulatoryFramework: 'Education Regulatory Bodies Act, 2020 (Act 1023)',
      inspectorate: 'National Schools Inspectorate Authority (NaSIA) Ghana'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/regulatory/nasia/validate-pin
 * Validate Ghana Card PIN format and checksum
 */
router.post('/nasia/validate-pin', async (req, res, next) => {
  try {
    const pin = req.body.pin || req.body.ghanaCardPin || '';
    const validation = NasiaRegistryService.validateGhanaCard(pin);
    return res.json(validation);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/regulatory/nasia/validate-license
 * Validate NaSIA license formatting
 */
router.post('/nasia/validate-license', async (req, res, next) => {
  try {
    const licenseNumber = req.body.licenseNumber || req.body.nasiaLicense || '';
    const validation = NasiaRegistryService.validateNasiaLicense(licenseNumber);
    return res.json(validation);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
