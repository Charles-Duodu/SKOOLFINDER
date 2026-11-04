/**
 * SkoolFinder Ghana - Sponsored Promotions & Featured Ads Express Router
 */

const express = require('express');
const router = express.Router();
const { PromotionsService } = require('../services/promotionsService');

// Public: Get promotion packages catalogue
router.get('/packages', (req, res) => {
  const result = PromotionsService.getPackages();
  res.json(result);
});

// Public: Get currently active promotions (for homepage hero, top of directory, compare spotlight)
router.get('/active', (req, res) => {
  const placement = req.query.placement || null;
  const result = PromotionsService.getActivePromotions(placement);
  res.json(result);
});

// Public: Track impression
router.post('/:campaignId/track-impression', async (req, res, next) => {
  try {
    const result = await PromotionsService.trackImpression(req.params.campaignId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Public: Track click and return destination
router.post('/:campaignId/track-click', async (req, res, next) => {
  try {
    const result = await PromotionsService.trackClick(req.params.campaignId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// School Owner: Get campaigns for school
router.get('/school/:schoolId', async (req, res, next) => {
  try {
    const result = await PromotionsService.getSchoolCampaigns(req.params.schoolId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// School Owner: Create campaign
router.post('/school/:schoolId/create', async (req, res, next) => {
  try {
    const result = await PromotionsService.createCampaign(req.params.schoolId, req.body, req.user);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// School Owner: Initialize checkout
router.post('/school/:schoolId/:campaignId/checkout', async (req, res, next) => {
  try {
    const result = await PromotionsService.initializeCheckout(req.params.schoolId, req.params.campaignId, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// School Owner: Verify payment and activate
router.post('/school/:schoolId/:campaignId/verify', async (req, res, next) => {
  try {
    const result = await PromotionsService.verifyPayment(req.params.schoolId, req.params.campaignId, req.body, req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// School Owner: Get detailed campaign analytics
router.get('/:campaignId/analytics', async (req, res, next) => {
  try {
    const result = await PromotionsService.getCampaignAnalytics(req.params.campaignId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
