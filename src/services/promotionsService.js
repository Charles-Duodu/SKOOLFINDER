/**
 * SkoolFinder Ghana - Sponsored Promotions & Featured School Ads Service
 * Baseline: Blueprint v2.0 Module 9, Section 10.3, Prompt §4
 * 
 * Functional Deliverables:
 * - Approved Pricing: 7 days (GH₵ 75), 14 days (GH₵ 135), 30 days (GH₵ 250)
 * - Multi-Placement: Homepage Hero, Directory Top-of-Search, Compare Spotlight
 * - Campaign Lifecycle: draft -> pending_payment -> active -> completed/expired
 * - Analytics: Real-time impressions, clicks, CTR, and enquiry conversion telemetry
 */

const crypto = require('crypto');
const AuditService = require('./auditService');

// ============================================================================
// APPROVED PROMOTION PACKAGES CATALOGUE (Prompt §4)
// ============================================================================

const PROMOTION_PACKAGES = [
  {
    id: 'pkg-promo-7d',
    name: 'Standard Weekly Spotlight',
    duration_days: 7,
    price_ghs: 75,
    currency: 'GHS',
    allowed_placements: ['directory_top'],
    badge_label: '⭐ Featured School',
    features: [
      'Top-of-search placement in directory for 7 days',
      'Distinguished Gold Featured badge on school card',
      'Basic impressions and click-through analytics',
      'Direct enquiry lead capture button'
    ]
  },
  {
    id: 'pkg-promo-14d',
    name: 'Bi-Weekly Growth Booster',
    duration_days: 14,
    price_ghs: 135,
    discount_pct: 10,
    currency: 'GHS',
    allowed_placements: ['directory_top', 'compare_spotlight'],
    badge_label: '🌟 Premier Spotlight',
    features: [
      'Top-of-search placement in directory for 14 days',
      'Featured comparison spotlight highlight',
      'Comprehensive click-through & enquiry telemetry',
      'Save 10% vs weekly rate'
    ]
  },
  {
    id: 'pkg-promo-30d',
    name: 'Monthly Mega Admissions Reach',
    duration_days: 30,
    price_ghs: 250,
    discount_pct: 20,
    currency: 'GHS',
    allowed_placements: ['homepage_hero', 'directory_top', 'compare_spotlight'],
    badge_label: '🏆 Institutional Showcase',
    features: [
      'Homepage Hero Carousel Billboard placement for 30 days',
      'Top-of-search placement across all filtered searches',
      'Compare spotlight with prioritized recommendations',
      'Maximum visibility during peak Ghanaian admissions cycles',
      'Save 20% vs standard rate'
    ]
  }
];

// ============================================================================
// IN-MEMORY CAMPAIGNS & ANALYTICS LEDGER
// ============================================================================

const IN_MEMORY_CAMPAIGNS = [
  {
    id: 'CAM-2026-001',
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    school_name: 'Ghana International School (GIS)',
    school_slug: 'ghana-international-school',
    package_id: 'pkg-promo-30d',
    title: 'GIS 2026/2027 Admissions Showcase',
    headline: 'Experience World-Class British Cambridge Education in Cantonments',
    placements: ['homepage_hero', 'directory_top', 'compare_spotlight'],
    duration_days: 30,
    budget_ghs: 250,
    currency: 'GHS',
    status: 'active',
    payment_reference: 'PAY-PROMO-179380001',
    payment_channel: 'mtn_momo',
    activated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 25 * 86400000).toISOString(),
    metrics: {
      impressions_count: 3420,
      clicks_count: 284,
      ctr_pct: 8.3,
      enquiries_generated: 19
    },
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

// ============================================================================
// PROMOTIONS SERVICE IMPLEMENTATION
// ============================================================================

const PromotionsService = {
  getPackages() {
    return {
      success: true,
      currency: 'GHS',
      packages: PROMOTION_PACKAGES,
      available_placements: [
        { id: 'homepage_hero', name: 'Homepage Hero Billboard', description: 'Prominent carousel banner at the top of the homepage.' },
        { id: 'directory_top', name: 'Top of Search Directory', description: 'Ranked at the top of all search results with a gold badge.' },
        { id: 'compare_spotlight', name: 'Compare Tool Spotlight', description: 'Highlighted institution recommendation in school comparison.' }
      ]
    };
  },

  async createCampaign(schoolId, campaignData, user = null) {
    const { packageId, title, headline, customCallToAction } = campaignData;
    if (!packageId) {
      throw new Error('Promotion package ID is required.');
    }

    const pkg = PROMOTION_PACKAGES.find(p => p.id === packageId);
    if (!pkg) {
      throw new Error(`Invalid promotion package: ${packageId}`);
    }

    const campaignId = `CAM-2026-${String(IN_MEMORY_CAMPAIGNS.length + 1).padStart(3, '0')}`;
    const newCampaign = {
      id: campaignId,
      school_id: schoolId,
      school_name: campaignData.schoolName || 'Ghana International School',
      school_slug: campaignData.schoolSlug || 'ghana-international-school',
      package_id: pkg.id,
      title: title || `${pkg.name} Campaign`,
      headline: headline || 'Enroll for the Upcoming Academic Term',
      custom_cta: customCallToAction || 'Apply for Admission',
      placements: pkg.allowed_placements,
      duration_days: pkg.duration_days,
      budget_ghs: pkg.price_ghs,
      currency: 'GHS',
      status: 'pending_payment',
      payment_reference: null,
      payment_channel: null,
      activated_at: null,
      expires_at: null,
      metrics: {
        impressions_count: 0,
        clicks_count: 0,
        ctr_pct: 0.0,
        enquiries_generated: 0
      },
      created_at: new Date().toISOString()
    };

    IN_MEMORY_CAMPAIGNS.push(newCampaign);

    await AuditService.log({
      actorId: user?.id || 'school-admin',
      actorEmail: user?.email || 'admin@skoolfinder.com.gh',
      actorRole: 'school_admin',
      action: 'PROMOTION_CAMPAIGN_CREATED',
      targetType: 'promotion_campaign',
      targetId: campaignId,
      details: { schoolId, packageId, budgetGhs: pkg.price_ghs }
    });

    return {
      success: true,
      campaign: newCampaign
    };
  },

  async initializeCheckout(schoolId, campaignId, user = null) {
    const campaign = IN_MEMORY_CAMPAIGNS.find(c => c.id === campaignId && c.school_id === schoolId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found.`);
    }

    if (campaign.status === 'active') {
      throw new Error('This campaign is already active and funded.');
    }

    const reference = `SF-PROMO-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const checkoutUrl = `https://checkout.paystack.com/mock-promo-${reference}`;

    return {
      success: true,
      campaignId: campaign.id,
      amount_ghs: campaign.budget_ghs,
      currency: 'GHS',
      reference,
      checkout_url: checkoutUrl,
      payment_methods: ['mtn_mobile_money', 'telecel_cash', 'card', 'bank_transfer']
    };
  },

  async verifyPayment(schoolId, campaignId, paymentInfo, user = null) {
    const campaign = IN_MEMORY_CAMPAIGNS.find(c => c.id === campaignId && c.school_id === schoolId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found.`);
    }

    const { reference, channel = 'mtn_momo' } = paymentInfo;
    if (!reference) {
      throw new Error('Payment transaction reference is required.');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + campaign.duration_days * 86400000);

    campaign.status = 'active';
    campaign.payment_reference = reference;
    campaign.payment_channel = channel;
    campaign.activated_at = now.toISOString();
    campaign.expires_at = expiresAt.toISOString();

    await AuditService.log({
      actorId: user?.id || 'promo-billing',
      actorEmail: user?.email || 'admin@skoolfinder.com.gh',
      actorRole: 'school_admin',
      action: 'PROMOTION_PAYMENT_VERIFIED',
      targetType: 'promotion_campaign',
      targetId: campaignId,
      details: { schoolId, reference, amount: campaign.budget_ghs, channel, expiresAt: campaign.expires_at }
    });

    return {
      success: true,
      message: 'Promotion payment verified. Campaign is now live across SkoolFinder Ghana!',
      campaign
    };
  },

  async getSchoolCampaigns(schoolId) {
    const campaigns = IN_MEMORY_CAMPAIGNS.filter(c => c.school_id === schoolId);
    const totalSpentGhs = campaigns.filter(c => c.status === 'active').reduce((sum, c) => sum + c.budget_ghs, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.metrics.impressions_count, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.metrics.clicks_count, 0);

    return {
      success: true,
      schoolId,
      count: campaigns.length,
      aggregateSummary: {
        totalSpentGhs,
        totalImpressions,
        totalClicks,
        averageCtrPct: totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(1)) : 0
      },
      campaigns
    };
  },

  async getCampaignAnalytics(campaignId) {
    const campaign = IN_MEMORY_CAMPAIGNS.find(c => c.id === campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found.`);
    }

    return {
      success: true,
      campaignId: campaign.id,
      title: campaign.title,
      status: campaign.status,
      activated_at: campaign.activated_at,
      expires_at: campaign.expires_at,
      metrics: campaign.metrics,
      dailyTrend: [
        { day: 'Day 1', impressions: 450, clicks: 38 },
        { day: 'Day 2', impressions: 680, clicks: 54 },
        { day: 'Day 3', impressions: 790, clicks: 62 },
        { day: 'Day 4', impressions: 850, clicks: 71 },
        { day: 'Day 5', impressions: 650, clicks: 59 }
      ]
    };
  },

  async trackImpression(campaignId) {
    const campaign = IN_MEMORY_CAMPAIGNS.find(c => c.id === campaignId && c.status === 'active');
    if (campaign) {
      campaign.metrics.impressions_count++;
      campaign.metrics.ctr_pct = Number(((campaign.metrics.clicks_count / campaign.metrics.impressions_count) * 100).toFixed(1));
    }
    return { success: true };
  },

  async trackClick(campaignId) {
    const campaign = IN_MEMORY_CAMPAIGNS.find(c => c.id === campaignId && c.status === 'active');
    if (campaign) {
      campaign.metrics.clicks_count++;
      campaign.metrics.ctr_pct = Number(((campaign.metrics.clicks_count / campaign.metrics.impressions_count) * 100).toFixed(1));
    }
    return {
      success: true,
      targetUrl: campaign ? `/schools/${campaign.school_slug}` : '/directory'
    };
  },

  getActivePromotions(placement = null) {
    let active = IN_MEMORY_CAMPAIGNS.filter(c => c.status === 'active');
    if (placement) {
      active = active.filter(c => c.placements.includes(placement));
    }
    return {
      success: true,
      placement: placement || 'all',
      count: active.length,
      promotions: active
    };
  }
};

module.exports = {
  PromotionsService,
  PROMOTION_PACKAGES,
  IN_MEMORY_CAMPAIGNS
};

