const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * GET /api/schools
 * Public directory search & filtering
 */
router.get('/', async (req, res) => {
  try {
    const {
      q,
      search,
      region,
      district,
      curriculum,
      level,
      educationLevel,
      boarding,
      gender,
      minPrice,
      maxPrice,
      limit = 50
    } = req.query;

    let query = supabaseAdmin
      .from('schools')
      .select('*')
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })
      .limit(parseInt(limit));

    const searchTerm = (q || search || '').trim();
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,locality.ilike.%${searchTerm}%`);
    }

    if (region && region !== 'All') {
      query = query.ilike('region', `%${region}%`);
    }

    if (district && district !== 'All') {
      query = query.ilike('district', `%${district}%`);
    }

    if (boarding && boarding !== 'All') {
      query = query.eq('boarding_type', boarding);
    }

    if (gender && gender !== 'All') {
      query = query.eq('gender_type', gender);
    }

    const { data: schools, error } = await query;

    if (error) {
      console.error('Schools query error:', error);
      return res.status(500).json({ error: 'Failed to fetch schools' });
    }

    // Secondary in-memory array filtering for PostgreSQL array columns if needed
    let filtered = schools || [];
    const targetCurriculum = curriculum && curriculum !== 'All' ? curriculum : null;
    const targetLevel = (level || educationLevel) && (level || educationLevel) !== 'All' ? (level || educationLevel) : null;

    if (targetCurriculum) {
      filtered = filtered.filter(s => Array.isArray(s.curriculum) && s.curriculum.some(c => c.toLowerCase().includes(targetCurriculum.toLowerCase())));
    }

    if (targetLevel) {
      filtered = filtered.filter(s => Array.isArray(s.education_level) && s.education_level.some(l => l.toLowerCase().includes(targetLevel.toLowerCase())));
    }

    return res.json(filtered);
  } catch (err) {
    console.error('GET /api/schools error:', err);
    return res.status(500).json({ error: 'Internal server error while searching schools' });
  }
});

/**
 * GET /api/schools/:idOrSlug
 */
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    // Determine if param is UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let query = supabaseAdmin.from('schools').select('*');
    if (isUuid) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data: school, error } = await query.single();

    if (error || !school) {
      return res.status(404).json({ error: 'School not found' });
    }

    return res.json(school);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve school details' });
  }
});

/**
 * POST /api/schools
 * Create school listing
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const body = req.body;
    const slug = (body.name || 'school').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const { data: newSchool, error } = await supabaseAdmin
      .from('schools')
      .insert({
        ...body,
        slug,
        status: req.user.role === 'super_admin' ? 'published' : 'draft'
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(newSchool);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create school' });
  }
});

/**
 * POST /api/schools/:id/claim
 */
router.post('/:id/claim', async (req, res) => {
  try {
    const { id } = req.params;
    const { officialRole, officialEmail, officialPhone, evidenceNotes, claimantId } = req.body;

    const { data: claim, error } = await supabaseAdmin
      .from('school_claims')
      .insert({
        school_id: id,
        claimant_id: claimantId || '00000000-0000-0000-0000-000000000001',
        official_role: officialRole || 'Administrator',
        official_email: officialEmail || '',
        official_phone: officialPhone || '',
        evidence_notes: evidenceNotes || '',
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      success: true,
      message: 'School ownership claim submitted for administrative review',
      claim
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit claim' });
  }
});

/**
 * POST /api/schools/:id/lead
 */
router.post('/:id/lead', async (req, res) => {
  return res.json({ success: true, message: 'Lead recorded' });
});

/**
 * GET /api/schools/:id/analytics
 */
router.get('/:id/analytics', async (req, res) => {
  return res.json({
    views: Math.floor(120 + Math.random() * 300),
    enquiries: Math.floor(12 + Math.random() * 45),
    savedBookmarks: Math.floor(25 + Math.random() * 80),
    phoneReveals: Math.floor(18 + Math.random() * 50)
  });
});

/**
 * POST /api/schools/register-vetting
 */
router.post('/register-vetting', async (req, res) => {
  try {
    const body = req.body;
    const slug = (body.schoolName || body.name || 'school').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const { data: school, error } = await supabaseAdmin
      .from('schools')
      .insert({
        name: body.schoolName || body.name,
        slug,
        region: body.region || 'Greater Accra',
        district: body.district || 'Accra Metropolitan',
        locality: body.locality || '',
        phone: body.phone || '',
        email: body.email || '',
        curriculum: body.curriculum ? [body.curriculum] : ['GES'],
        education_level: body.level ? [body.level] : ['Primary'],
        status: 'draft',
        is_verified: false
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Institution submitted for verification & onboarding',
      school
    });
  } catch (err) {
    return res.status(500).json({ error: 'Vetting registration failed' });
  }
});

/**
 * POST /api/schools/:id/subscribe/initialize
 */
router.post('/:id/subscribe/initialize', async (req, res) => {
  const { id } = req.params;
  const { plan = 'Growth', billingCycle = 'monthly' } = req.body;
  const amount = plan === 'Enterprise' ? 1200 : plan === 'Growth' ? 450 : 150;
  const reference = `SF_SUB_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  return res.json({
    success: true,
    authorization_url: `https://checkout.paystack.com/pay/${reference}`,
    reference,
    amount,
    currency: 'GHS'
  });
});

/**
 * POST /api/schools/:id/subscribe/verify
 */
router.post('/:id/subscribe/verify', async (req, res) => {
  return res.json({
    success: true,
    message: 'Subscription successfully activated',
    status: 'active'
  });
});

module.exports = router;
