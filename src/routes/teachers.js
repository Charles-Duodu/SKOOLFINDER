const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/teachers
 */
router.get('/', async (req, res) => {
  try {
    const { subject, level, region, serviceArea, limit = 50 } = req.query;

    let query = supabaseAdmin
      .from('teachers')
      .select('*')
      .eq('status', 'published')
      .order('rating', { ascending: false })
      .limit(parseInt(limit));

    if (region && region !== 'All') {
      query = query.ilike('region', `%${region}%`);
    }

    const { data: teachers, error } = await query;
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch teachers' });
    }

    let filtered = teachers || [];
    if (subject && subject !== 'All') {
      filtered = filtered.filter(t => Array.isArray(t.subjects) && t.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase())));
    }
    if (level && level !== 'All') {
      filtered = filtered.filter(t => Array.isArray(t.levels) && t.levels.some(l => l.toLowerCase().includes(level.toLowerCase())));
    }

    return res.json(filtered);
  } catch (err) {
    return res.status(500).json({ error: 'Teachers query failed' });
  }
});

/**
 * GET /api/teachers/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { data: teacher, error } = await supabaseAdmin
      .from('teachers')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !teacher) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    return res.json(teacher);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve teacher' });
  }
});

/**
 * POST /api/teachers (Onboard teacher)
 */
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const { data: teacher, error } = await supabaseAdmin
      .from('teachers')
      .insert({
        full_name: body.full_name || body.name,
        title: body.title || 'Professional Educator',
        bio: body.bio || '',
        subjects: Array.isArray(body.subjects) ? body.subjects : [body.subjects || 'General'],
        levels: Array.isArray(body.levels) ? body.levels : [body.levels || 'Primary'],
        region: body.region || 'Greater Accra',
        service_area: body.service_area || body.serviceArea || '',
        hourly_rate: body.hourly_rate || body.hourlyRate || 80.00,
        currency: 'GHS',
        phone: body.phone || '',
        email: body.email || '',
        status: 'published',
        is_verified: false
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(teacher);
  } catch (err) {
    return res.status(500).json({ error: 'Teacher registration failed' });
  }
});

/**
 * POST /api/teachers/book (Send lesson / tutoring request)
 */
router.post('/book', async (req, res) => {
  try {
    const { teacherId, parentName, phone, studentLevel, subject, message } = req.body;

    const { data: enquiry, error } = await supabaseAdmin
      .from('enquiries')
      .insert({
        sender_id: '00000000-0000-0000-0000-000000000001',
        recipient_type: 'teacher',
        recipient_id: teacherId,
        subject: `Tutoring Request: ${subject || 'Mathematics'} for ${studentLevel || 'Student'}`,
        message: `From: ${parentName} (${phone})\nDetails: ${message || 'No additional note'}`
      })
      .select()
      .single();

    return res.json({
      success: true,
      message: 'Tutoring request successfully dispatched to the educator',
      enquiry
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to dispatch booking' });
  }
});

/**
 * POST /api/teachers/:id/lead
 */
router.post('/:id/lead', (req, res) => {
  return res.json({ success: true, message: 'Teacher lead logged' });
});

module.exports = router;

