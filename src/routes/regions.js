/**
 * SkoolFinder Ghana - Multi-Region Directory & CSSPS Express Router
 */

const express = require('express');
const router = express.Router();
const { RegionalExpansionService } = require('../services/regionalExpansionService');

// Get all supported regions metadata
router.get('/', (req, res) => {
  const result = RegionalExpansionService.getRegions();
  res.json(result);
});

// Search schools across regions
router.get('/schools', (req, res) => {
  const { region, csspsCategory, genderType, curriculum } = req.query;
  const result = RegionalExpansionService.searchRegionalSchools({
    region, csspsCategory, genderType, curriculum
  });
  res.json(result);
});

// Get CSSPS categorized placement directory
router.get('/cssps-categories', (req, res) => {
  const result = RegionalExpansionService.getCsspsDirectory();
  res.json(result);
});

// Get single region overview and anchor schools
router.get('/:regionId', (req, res, next) => {
  try {
    const result = RegionalExpansionService.getRegionalOverview(req.params.regionId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
