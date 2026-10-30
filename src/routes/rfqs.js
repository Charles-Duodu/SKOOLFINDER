const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');

const DEFAULT_RFQS = [
  {
    id: 'rfq-01',
    schoolName: 'Ghana International School (GIS)',
    title: 'Supply of 150 Robotics & STEM Microcontroller Starter Kits',
    category: 'IT / Software / Computers',
    description: 'Seeking accredited suppliers for Arduino & ESP32 STEM kits with sensor modules for secondary robotics lab in Cantonments.',
    budgetRange: 'GH₵ 40,000 - 55,000',
    quantity: '150 Student Sets',
    deadline: 'Within 30 Days',
    region: 'Greater Accra',
    status: 'Open',
    quotesReceived: 4
  },
  {
    id: 'rfq-02',
    schoolName: 'Achimota School',
    title: 'Bulk Supply of Core Mathematics & Science Textbooks',
    category: 'Books & Stationery',
    description: 'Procurement of 500 BECE / WASSCE revision textbooks and past question guides for senior high school library.',
    budgetRange: 'GH₵ 25,000 - 35,000',
    quantity: '500 Books',
    deadline: 'Within 14 Days',
    region: 'Greater Accra',
    status: 'Open',
    quotesReceived: 6
  }
];

function formatRFQ(r) {
  if (!r) return null;
  return {
    ...r,
    schoolName: r.school_name || r.schoolName || 'Educational Institution',
    region: r.region || 'Greater Accra',
    budgetRange: r.budget ? `GH₵ ${Number(r.budget).toLocaleString()}` : (r.budgetRange || 'GH₵ 25,000 - 50,000'),
    quantity: r.quantity || 'Bulk Order (Term Requirement)',
    deadline: r.deadline ? (typeof r.deadline === 'string' && r.deadline.includes('T') ? new Date(r.deadline).toLocaleDateString('en-GB') : r.deadline) : 'Within 30 Days',
    quotesReceived: r.quotes_received || r.quotesReceived || 3
  };
}

/**
 * GET /api/rfqs
 */
router.get('/rfqs', async (req, res) => {
  try {
    const { schoolId } = req.query;
    let query = supabaseAdmin.from('rfqs').select('*').order('created_at', { ascending: false });
    if (schoolId) query = query.eq('school_id', schoolId);

    const { data: rfqs, error } = await query;
    if (error || !rfqs || rfqs.length === 0) {
      return res.json(DEFAULT_RFQS);
    }
    return res.json(rfqs.map(formatRFQ));
  } catch (err) {
    return res.json(DEFAULT_RFQS);
  }
});

/**
 * GET /api/rfqs/:id
 */
router.get('/rfqs/:id', async (req, res) => {
  try {
    const { data: rfq, error } = await supabaseAdmin.from('rfqs').select('*').eq('id', req.params.id).single();
    if (error || !rfq) return res.status(404).json({ error: 'RFQ not found' });
    return res.json(formatRFQ(rfq));
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching RFQ' });
  }
});

/**
 * POST /api/rfqs
 */
router.post('/rfqs', async (req, res) => {
  try {
    const { schoolId, schoolName, title, category, description, budget } = req.body;
    const { data: rfq, error } = await supabaseAdmin
      .from('rfqs')
      .insert({
        school_id: schoolId || null,
        school_name: schoolName || 'Educational Institution',
        title,
        category: category || 'General Supplies',
        description,
        budget: budget || 0,
        status: 'Open'
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(rfq);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create RFQ' });
  }
});

/**
 * GET /api/rfqs/:id/quotes
 */
router.get('/rfqs/:id/quotes', async (req, res) => {
  try {
    const { data: quotes, error } = await supabaseAdmin
      .from('rfq_quotes')
      .select('*')
      .eq('rfq_id', req.params.id);

    return res.json(quotes || []);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

/**
 * POST /api/rfqs/:id/quote
 */
router.post('/rfqs/:id/quote', async (req, res) => {
  try {
    const { supplierId, supplierName, amount, notes } = req.body;
    const { data: quote, error } = await supabaseAdmin
      .from('rfq_quotes')
      .insert({
        rfq_id: req.params.id,
        supplier_id: supplierId || null,
        supplier_name: supplierName || 'Accredited Supplier',
        amount,
        notes,
        status: 'Submitted'
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(quote);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit quote' });
  }
});

/**
 * POST /api/quotes/:id/status
 */
router.post('/quotes/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { data: quote, error } = await supabaseAdmin
      .from('rfq_quotes')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    return res.json({ success: true, quote });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update quote status' });
  }
});

module.exports = router;

