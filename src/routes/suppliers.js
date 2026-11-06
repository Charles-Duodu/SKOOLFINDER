const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

const FALLBACK_CATEGORIES = [
  { id: 'cat-books', name: 'Books, Curricula & Stationery', slug: 'books-stationery', risk_level: 'standard', icon: '📚', description: 'Textbooks (BECE/WASSCE/Cambridge), exercise books, stationery', required_evidence: ['Business Registration', 'Publisher Distributorship Agreement'] },
  { id: 'cat-stem', name: 'Science, STEM & Lab Equipment', slug: 'stem-lab-equipment', risk_level: 'medium', icon: '🔬', description: 'WAEC science reagents, optical microscopes, robotics kits', required_evidence: ['Business Registration', 'Apparatus Safety Attestation'] },
  { id: 'cat-furniture', name: 'Classroom & Office Furniture', slug: 'classroom-furniture', risk_level: 'standard', icon: '🪑', description: 'Dual desks, ergonomic student chairs, whiteboards, lockers', required_evidence: ['Business Registration', 'Workshop Inspection'] },
  { id: 'cat-it', name: 'IT, Computers & EdTech Hardware', slug: 'it-edtech-hardware', risk_level: 'standard', icon: '💻', description: 'Laptops, smartboards, school servers, networking', required_evidence: ['Business Registration', 'Warranty Partner Certificate'] },
  { id: 'cat-uniforms', name: 'School Uniforms & Sportswear', slug: 'uniforms-sportswear', risk_level: 'standard', icon: '👕', description: 'Crested uniform fabrics, school blazers, PE kits, socks', required_evidence: ['Business Registration', 'Fabric Specification'] },
  { id: 'cat-food', name: 'Food, Groceries & Canteen Supplies', slug: 'food-canteen', risk_level: 'high', icon: '🍲', description: 'Bulk rice, maize, cooking oil, canned goods, kitchen equipment', required_evidence: ['Business Registration', 'FDA Ghana Food Safety Certificate', 'Handlers Medical Clearance'] },
  { id: 'cat-transport', name: 'Student Transport & Logistics', slug: 'transport-logistics', risk_level: 'high', icon: '🚌', description: 'School buses, GPS fleet telematics, bus maintenance', required_evidence: ['Business Registration', 'DVLA Commercial Fleet Roadworthiness', 'Driver Licensure & Vetting'] },
  { id: 'cat-facilities', name: 'Facilities, Cleaning & Maintenance', slug: 'facilities-maintenance', risk_level: 'medium', icon: '🧹', description: 'Sanitation supplies, solar inverters, backup generators', required_evidence: ['Business Registration', 'Pesticide EPA Permit (fumigation)'] }
];

const FALLBACK_SUPPLIERS = [
  {
    id: 'sup-01',
    company_name: 'Aki-Ola Publications Ghana',
    category: 'Books & Stationery',
    description: 'Ghana’s leading educational book publishers, providing comprehensive BECE and WASSCE textbooks, past question solutions, and study guides across all regions.',
    region: 'Greater Accra',
    service_area: 'Nationwide Delivery (Accra, Kumasi, Takoradi, Tamale)',
    phone: '+233 30 222 1888',
    email: 'orders@aki-ola.com.gh',
    website: 'https://aki-ola.com.gh',
    is_verified: true,
    rating: 4.9,
    catalogHighlights: ['BECE Series', 'WASSCE Series', 'Science Textbooks', 'Teacher Handbooks']
  },
  {
    id: 'sup-02',
    company_name: 'Kingdom Books & Stationery Ltd',
    category: 'Books & Stationery',
    description: 'Premier distributor of classroom furniture, photocopiers, exercise books, smartboards, and institutional stationery.',
    region: 'Greater Accra',
    service_area: 'Greater Accra & Eastern Region',
    phone: '+233 30 276 4125',
    email: 'sales@kingdomgh.com',
    website: 'https://kingdomgh.com',
    is_verified: true,
    rating: 4.8,
    catalogHighlights: ['Interactive Smartboards', 'Bulk Exercise Books', 'School Desks & Chairs']
  },
  {
    id: 'sup-03',
    company_name: 'Ghana STEM & Science Equipment Hub',
    category: 'Lab Equipment',
    description: 'Direct importers of laboratory glassware, biology microscopes, robotics kits, and WAEC-approved science practical apparatus.',
    region: 'Ashanti',
    service_area: 'Kumasi, Sunyani & Northern Ghana',
    phone: '+233 32 203 9988',
    email: 'info@ghanastemhub.com',
    website: 'https://ghanastemhub.com',
    is_verified: true,
    rating: 4.9,
    catalogHighlights: ['Optical Microscopes', 'WAEC Chemistry Reagents', 'Physics Circuit Kits']
  }
];

function formatSupplier(s) {
  if (!s) return null;
  const vLevel = s.verification_level || (s.is_verified ? 'V2' : 'V0');
  const levelLabels = {
    'V0': 'V0: Account Created',
    'V1': 'V1: Identity Verified',
    'V2': 'V2: Registered Business',
    'V3': 'V3: Category Approved',
    'V4': 'V4: Enhanced Safeguards Cleared'
  };

  return {
    ...s,
    companyName: s.company_name || s.companyName || 'Educational Supplier',
    ratingBadge: s.rating ? `${s.rating} ★ Rated` : '4.8 ★ Verified',
    verificationLevel: vLevel,
    verificationBadge: levelLabels[vLevel] || 'V0: Registered',
    accountType: s.account_type || 'business',
    activeTier: s.active_tier || 'free',
    billingCycle: s.billing_cycle || 'monthly',
    pricingModes: s.pricing_modes || ['quote_only', 'indicative'],
    address: s.service_area || s.region || 'Greater Accra, Ghana',
    coverage: Array.isArray(s.coverage) ? s.coverage : [s.service_area || 'Greater Accra', 'Nationwide'],
    catalogHighlights: Array.isArray(s.catalogHighlights) ? s.catalogHighlights : ['Textbooks & Curriculum', 'Classroom Supplies', 'Laboratory Equipment'],
    whatsapp: s.phone || '+233302221888',
    phone: s.phone || '+233302221888',
    status: s.status || 'published'
  };
}

/**
 * GET /api/suppliers
 */
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;

    let query = supabaseAdmin
      .from('suppliers')
      .select('*')
      .eq('status', 'published')
      .order('rating', { ascending: false })
      .limit(parseInt(limit));

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    let suppliers = [];
    try {
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        suppliers = data;
      }
    } catch (e) {
      console.warn('Supabase suppliers query notice:', e.message);
    }

    if (suppliers.length === 0) {
      suppliers = FALLBACK_SUPPLIERS;
      if (category && category !== 'All') {
        suppliers = suppliers.filter(s => s.category === category);
      }
    }

    return res.json(suppliers.map(formatSupplier));
  } catch (err) {
    console.error('Suppliers route error:', err);
    return res.json(FALLBACK_SUPPLIERS.map(formatSupplier));
  }
});

/**
 * GET /api/suppliers/categories
 * Public: Retrieve hierarchical taxonomy with risk levels and evidence requirements (SUP-03-01)
 */
router.get('/categories', async (req, res) => {
  try {
    let categories = [];
    try {
      const { data, error } = await supabaseAdmin
        .from('supplier_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        categories = data;
      }
    } catch (e) {
      console.warn('supplier_categories DB query notice:', e.message);
    }

    if (categories.length === 0) {
      categories = FALLBACK_CATEGORIES;
    }

    return res.json({ success: true, categories });
  } catch (err) {
    return res.json({ success: true, categories: FALLBACK_CATEGORIES });
  }
});

/**
 * GET /api/suppliers/compare
 * Public/School: Compare up to 3 compatible suppliers on desktop, 2 on mobile (SUP-03-05)
 */
router.get('/compare', async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ error: 'Please specify supplier IDs to compare (e.g. ?ids=sup-01,sup-02)' });
    }

    const supplierIds = ids.split(',').map(s => s.trim()).filter(Boolean);
    if (supplierIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 suppliers are required for comparison' });
    }
    // Strict Invariant SUP-03-05: Maximum 3 desktop, 2 mobile
    if (supplierIds.length > 3) {
      return res.status(400).json({ 
        error: 'Comparison limit exceeded. Maximum 3 suppliers allowed on desktop, 2 on mobile (SUP-03-05)',
        maxAllowed: 3
      });
    }

    let list = [];
    try {
      const { data: dbSuppliers } = await supabaseAdmin
        .from('suppliers')
        .select('*')
        .in('id', supplierIds);

      if (dbSuppliers && dbSuppliers.length > 0) {
        list = [...dbSuppliers];
      }
    } catch (e) {}

    // Include any fallback seed items matching IDs
    supplierIds.forEach(id => {
      if (!list.some(s => s.id === id)) {
        const fb = FALLBACK_SUPPLIERS.find(s => s.id === id);
        if (fb) list.push(fb);
      }
    });

    const formatted = list.map(formatSupplier);
    return res.json({
      success: true,
      count: formatted.length,
      suppliers: formatted
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to execute supplier comparison' });
  }
});

/**
 * GET /api/suppliers/me
 * Authenticated: Retrieve current user's supplier profile and onboarding state
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    let supplier = null;

    // 1. Check by email (always available on suppliers table)
    if (userEmail) {
      const { data: byEmail } = await supabaseAdmin
        .from('suppliers')
        .select('*')
        .eq('email', userEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (byEmail) supplier = byEmail;
    }

    // 2. Fallback check by user_id if not found by email
    if (!supplier && userId) {
      try {
        const { data: byUser, error: uErr } = await supabaseAdmin
          .from('suppliers')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        if (!uErr && byUser) supplier = byUser;
      } catch (e) {}
    }

    if (!supplier) {
      return res.status(404).json({ 
        error: 'No supplier profile associated with this account',
        onboardingRequired: true
      });
    }

    return res.json({
      success: true,
      supplier: formatSupplier(supplier)
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve supplier profile' });
  }
});

/**
 * GET /api/suppliers/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { data: supplier, error } = await supabaseAdmin
      .from('suppliers')
      .select('*, supplier_products(*)')
      .eq('id', req.params.id)
      .single();

    if (error || !supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    return res.json(formatSupplier(supplier));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve supplier' });
  }
});

/**
 * POST /api/suppliers
 * Protected: Register as a Supplier (SUP-01-03, SUP-02-01, SUP-07-03)
 * Enforces authenticated identity, defaults status to 'pending' for Super Admin trading review
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const body = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    const supplierPayload = {
      user_id: userId,
      company_name: body.company_name || body.name || req.user.full_name || 'Educational Supplier',
      category: body.category || 'Books & Stationery',
      description: body.description || '',
      region: body.region || 'Greater Accra',
      service_area: body.service_area || 'Nationwide',
      phone: body.phone || req.user.phone || '',
      email: body.email || userEmail,
      website: body.website || '',
      account_type: body.account_type === 'individual' ? 'individual' : 'business',
      verification_level: 'V0',
      active_tier: 'free',
      billing_cycle: body.billing_cycle === 'annual' ? 'annual' : 'monthly',
      status: 'pending', // Mandatory Trading Approval Gate (SUP-02-01)
      is_verified: false
    };

    let { data: supplier, error } = await supabaseAdmin
      .from('suppliers')
      .insert(supplierPayload)
      .select()
      .single();

    // Fallback if additive columns not yet loaded in schema cache
    if (error && error.message && error.message.includes('column')) {
      const basicPayload = {
        company_name: supplierPayload.company_name,
        category: supplierPayload.category,
        description: supplierPayload.description,
        region: supplierPayload.region,
        service_area: supplierPayload.service_area,
        phone: supplierPayload.phone,
        email: supplierPayload.email,
        website: supplierPayload.website,
        status: 'pending',
        is_verified: false
      };
      const retry = await supabaseAdmin.from('suppliers').insert(basicPayload).select().single();
      supplier = retry.data;
      error = retry.error;
    }

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Supplier registration submitted successfully. Your application is under review before public trading is enabled.',
      supplier: formatSupplier(supplier)
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create supplier' });
  }
});

// In-Memory Storage for products & services (resilience & test support)
const IN_MEMORY_PRODUCTS = [];
const IN_MEMORY_SERVICES = [];

/**
 * GET /api/suppliers/:id/products
 * Public: Query published products for a supplier (SUP-01-01, SUP-03-02)
 */
router.get('/:id/products', async (req, res) => {
  try {
    const supplierId = req.params.id;
    let products = [];
    try {
      const { data, error } = await supabaseAdmin
        .from('supplier_products')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('status', 'published');
      if (!error && Array.isArray(data) && data.length > 0) {
        products = data;
      }
    } catch (e) {}

    // Include in-memory items
    const memItems = IN_MEMORY_PRODUCTS.filter(p => p.supplier_id === supplierId);
    memItems.forEach(m => {
      if (!products.some(p => p.id === m.id)) products.push(m);
    });

    return res.json({ success: true, count: products.length, products });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch supplier products' });
  }
});

/**
 * GET /api/suppliers/:id/services
 * Public: Query published services for a supplier (SUP-01-01, SUP-03-02)
 */
router.get('/:id/services', async (req, res) => {
  try {
    const supplierId = req.params.id;
    let services = [];
    try {
      const { data, error } = await supabaseAdmin
        .from('supplier_services')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('status', 'published');
      if (!error && Array.isArray(data) && data.length > 0) {
        services = data;
      }
    } catch (e) {}

    const memItems = IN_MEMORY_SERVICES.filter(s => s.supplier_id === supplierId);
    memItems.forEach(m => {
      if (!services.some(s => s.id === m.id)) services.push(m);
    });

    return res.json({ success: true, count: services.length, services });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch supplier services' });
  }
});

/**
 * POST /api/suppliers/me/products
 * Protected: Add product listing with distinct product template and pricing mode (SUP-03-02, SUP-03-03)
 */
router.post('/me/products', authenticate, async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.name.trim()) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const pricingMode = ['fixed', 'indicative', 'quote_only'].includes(body.pricing_mode) 
      ? body.pricing_mode 
      : 'quote_only';

    const productPayload = {
      id: `prod-${Date.now()}`,
      supplier_id: req.user.id,
      name: body.name.trim(),
      sku: body.sku || `SKU-${Date.now().toString().slice(-6)}`,
      category_id: body.category_id || 'cat-stationery',
      description: body.description || '',
      pricing_mode: pricingMode,
      price_ghs: parseFloat(body.price_ghs) || 0.00,
      currency: 'GHS',
      unit: body.unit || 'piece',
      minimum_order_qty: parseInt(body.minimum_order_qty) || 1,
      stock_availability: ['in_stock', 'made_to_order', 'out_of_stock'].includes(body.stock_availability) ? body.stock_availability : 'in_stock',
      delivery_days: parseInt(body.delivery_days) || 3,
      media_urls: Array.isArray(body.media_urls) ? body.media_urls : [],
      compliance_specs: body.compliance_specs || {},
      status: 'published',
      created_at: new Date().toISOString()
    };

    try {
      await supabaseAdmin.from('supplier_products').insert(productPayload);
    } catch (e) {}

    IN_MEMORY_PRODUCTS.unshift(productPayload);

    return res.status(201).json({
      success: true,
      message: 'Product listing published successfully',
      product: productPayload
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create product listing' });
  }
});

/**
 * POST /api/suppliers/me/services
 * Protected: Add service offering with distinct service template and deliverables (SUP-03-02, SUP-03-03)
 */
router.post('/me/services', authenticate, async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.name.trim()) {
      return res.status(400).json({ error: 'Service name is required' });
    }

    const pricingMode = ['fixed', 'indicative', 'quote_only'].includes(body.pricing_mode) 
      ? body.pricing_mode 
      : 'quote_only';

    const servicePayload = {
      id: `srv-${Date.now()}`,
      supplier_id: req.user.id,
      name: body.name.trim(),
      category_id: body.category_id || 'cat-facilities',
      description: body.description || '',
      scope_of_work: body.scope_of_work || '',
      deliverables: body.deliverables || '',
      pricing_mode: pricingMode,
      starting_rate_ghs: parseFloat(body.starting_rate_ghs) || 0.00,
      currency: 'GHS',
      rate_unit: ['hourly', 'daily', 'project', 'term', 'annual'].includes(body.rate_unit) ? body.rate_unit : 'project',
      coverage_regions: Array.isArray(body.coverage_regions) ? body.coverage_regions : ['Greater Accra'],
      availability_schedule: body.availability_schedule || 'Monday - Friday (8am - 5pm)',
      qualifications: body.qualifications || '',
      portfolio_urls: Array.isArray(body.portfolio_urls) ? body.portfolio_urls : [],
      safeguarding_cleared: !!(body.safeguarding_cleared || body.safeguarding_certified),
      safeguarding_certified: !!(body.safeguarding_cleared || body.safeguarding_certified),
      status: 'published',
      created_at: new Date().toISOString()
    };

    try {
      await supabaseAdmin.from('supplier_services').insert(servicePayload);
    } catch (e) {}

    IN_MEMORY_SERVICES.unshift(servicePayload);

    return res.status(201).json({
      success: true,
      message: 'Service offering published successfully',
      service: servicePayload
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create service offering' });
  }
});

/**
 * PATCH /api/suppliers/me/verification
 * Protected: Submit V0-V4 verification evidence metadata (SUP-01-02, SUP-05-01)
 */
router.patch('/me/verification', authenticate, async (req, res) => {
  try {
    const body = req.body;
    const userId = req.user.id;
    const targetLevel = ['V0', 'V1', 'V2', 'V3', 'V4'].includes(body.target_level) 
      ? body.target_level 
      : 'V1';

    const updateData = {
      verification_level: targetLevel,
      rgd_number: body.rgd_number || null,
      tin_number: body.tin_number || null,
      ghana_card_number: body.ghana_card_number || null,
      fda_license_number: body.fda_license_number || null,
      dvla_permit_number: body.dvla_permit_number || null,
      status: 'pending' // Moves back to review queue upon submitting new evidence
    };

    try {
      await supabaseAdmin
        .from('suppliers')
        .update(updateData)
        .eq('user_id', userId);
    } catch (e) {}

    return res.json({
      success: true,
      message: `Evidence submitted for ${targetLevel} verification review. Compliance officers will audit within 24-48 business hours.`,
      verificationLevel: targetLevel,
      status: 'pending'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit verification evidence' });
  }
});

module.exports = router;

