const express = require('express');
const router = express.Router();
const { IntelligenceOperationsService } = require('../services/intelligenceOperationsService');
const { authenticate } = require('../middleware/auth');

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
}

/**
 * POST /api/groups/create
 * Educational trust or corporate school group creation (DEC-02)
 */
router.post('/create', optionalAuth, async (req, res) => {
  try {
    const data = await IntelligenceOperationsService.createGroup(req.body, req.user);
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/groups/:groupId/link-school
 * Link a branch campus to educational group
 */
router.post('/:groupId/link-school', optionalAuth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const data = await IntelligenceOperationsService.linkSchoolToGroup(groupId, req.body, req.user);
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/groups/:groupId/dashboard
 * Aggregated multi-campus executive overview
 */
router.get('/:groupId/dashboard', optionalAuth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const data = await IntelligenceOperationsService.getGroupDashboard(groupId);
    return res.json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

module.exports = router;

