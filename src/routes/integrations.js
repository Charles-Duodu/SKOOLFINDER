/**
 * SkoolFinder Ghana - National Integrations Express Router
 * Routes for MoE/GES EMIS Census, WAEC Verification, and Hubtel/Arkesel SMS Gateway
 */

const express = require('express');
const router = express.Router();
const { NationalIntegrationsService } = require('../services/nationalIntegrationsService');
const { requireAuth, requireRole } = require('../middleware/auth');

// ============================================================================
// 1. MOE / GES EMIS CENSUS ENDPOINTS
// ============================================================================

// Generate EMIS census record
router.post('/emis/generate', async (req, res, next) => {
  try {
    const { schoolId, academicYear, reportingCycle, district, region, schoolName, emisCode, enrollment, staffing, facilities } = req.body;
    if (!schoolId) {
      return res.status(400).json({ error: 'School ID is required to generate EMIS census.' });
    }

    const result = await NationalIntegrationsService.generateEmisCensus(schoolId, {
      academicYear, reportingCycle, district, region, schoolName, emisCode, enrollment, staffing, facilities
    }, req.user);

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// Validate EMIS census payload
router.post('/emis/validate', async (req, res, next) => {
  try {
    const { censusData } = req.body;
    if (!censusData) {
      return res.status(400).json({ error: 'Census data payload is required for validation.' });
    }

    const result = await NationalIntegrationsService.validateEmisCensus(censusData);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// Export EMIS payload (JSON or CSV)
router.get('/emis/export/:censusId', async (req, res, next) => {
  try {
    const { censusId } = req.params;
    const format = req.query.format || 'json';

    const result = await NationalIntegrationsService.exportEmisPayload(censusId, format);
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      return res.send(result.content);
    }
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get all EMIS submissions for a school
router.get('/emis/submissions/:schoolId', async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const result = await NationalIntegrationsService.getEmisSubmissions(schoolId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 2. WAEC GHANA DIRECT VERIFICATION ENDPOINTS
// ============================================================================

// Verify candidate examination record (BECE / WASSCE)
router.post('/waec/verify', async (req, res, next) => {
  try {
    const { indexNumber, examType, examYear, candidateName } = req.body;
    if (!indexNumber) {
      return res.status(400).json({ error: 'WAEC 10-digit index number is required.' });
    }

    const result = await NationalIntegrationsService.verifyWaecCandidate({
      indexNumber, examType, examYear, candidateName
    }, req.user);

    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get school WAEC performance benchmarks
router.get('/waec/analytics/:schoolId', async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const examYear = req.query.year || '2025';

    const result = await NationalIntegrationsService.getSchoolWaecAnalytics(schoolId, examYear);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 3. OMNICHANNEL SMS GATEWAY (HUBTEL / ARKESEL) ENDPOINTS
// ============================================================================

// Dispatch priority SMS notice
router.post('/sms/dispatch', async (req, res, next) => {
  try {
    const { schoolId, recipientPhone, recipientName, message } = req.body;
    if (!recipientPhone || !message) {
      return res.status(400).json({ error: 'Recipient phone and message body are required.' });
    }

    const result = await NationalIntegrationsService.dispatchLiveSms(schoolId || 'sys-default', {
      recipientPhone, recipientName, message
    }, req.user);

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// Configure gateway credentials (Super Admin only or platform settings)
router.post('/sms/configure', async (req, res, next) => {
  try {
    const result = await NationalIntegrationsService.configureSmsGateway(req.body, req.user);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get SMS statistics and logs
router.get('/sms/stats/:schoolId', async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const result = await NationalIntegrationsService.getSmsDeliveryStats(schoolId === 'all' ? null : schoolId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// 4. NaSIA PRE-TERTIARY LICENSING (ACT 1023) REGULATORY ENDPOINTS
// ============================================================================

const { NasiaRegistryService } = require('../services/nasiaRegistryService');

router.post('/nasia/cross-check', async (req, res, next) => {
  try {
    const result = NasiaRegistryService.crossCheckSchool(req.body);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/nasia/lookup', async (req, res, next) => {
  try {
    const query = req.query.q || req.query.query || '';
    if (!query) {
      return res.status(400).json({ error: 'Search query parameter (q) is required' });
    }
    const results = NasiaRegistryService.lookupRegistry(query);
    return res.json({ success: true, count: results.length, results });
  } catch (err) {
    next(err);
  }
});

router.get('/nasia/stats', async (req, res, next) => {
  try {
    const stats = NasiaRegistryService.getRegistryStatistics();
    return res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

