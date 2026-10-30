const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

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

    const { data: suppliers, error } = await query;
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
    return res.json(suppliers || []);
  } catch (err) {
    return res.status(500).json({ error: 'Suppliers query failed' });
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
    return res.json(supplier);
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
