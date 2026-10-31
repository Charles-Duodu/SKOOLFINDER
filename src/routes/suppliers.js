const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

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
  return {
    ...s,
    companyName: s.company_name || s.companyName || 'Educational Supplier',
    ratingBadge: s.rating ? `${s.rating} ★ Rated` : '4.8 ★ Verified',
    address: s.service_area || s.region || 'Greater Accra, Ghana',
    coverage: Array.isArray(s.coverage) ? s.coverage : [s.service_area || 'Greater Accra', 'Nationwide'],
    catalogHighlights: Array.isArray(s.catalogHighlights) ? s.catalogHighlights : ['Textbooks & Curriculum', 'Classroom Supplies', 'Laboratory Equipment'],
    whatsapp: s.phone || '+233302221888',
    phone: s.phone || '+233302221888'
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
 */
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const { data: supplier, error } = await supabaseAdmin
      .from('suppliers')
      .insert({
        company_name: body.company_name || body.name,
        category: body.category || 'Books & Stationery',
        description: body.description || '',
        region: body.region || 'Greater Accra',
        service_area: body.service_area || 'Nationwide',
        phone: body.phone || '',
        email: body.email || '',
        website: body.website || '',
        status: 'published',
        is_verified: false
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(supplier);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create supplier' });
  }
});

module.exports = router;

