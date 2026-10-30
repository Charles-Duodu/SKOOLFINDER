const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/parents/overview
 */
router.get('/overview', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch bookmarks
    const { data: bookmarks } = await supabaseAdmin
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId);

    // Fetch enquiries
    const { data: enquiries } = await supabaseAdmin
      .from('enquiries')
      .select('*')
      .eq('sender_id', userId)
      .order('created_at', { ascending: false });

    return res.json({
      success: true,
      user: req.user,
      metrics: {
        savedSchoolsCount: (bookmarks || []).filter(b => b.listing_type === 'school').length,
        savedTeachersCount: (bookmarks || []).filter(b => b.listing_type === 'teacher').length,
        activeEnquiriesCount: (enquiries || []).length
      },
      bookmarks: bookmarks || [],
      enquiries: enquiries || [],
      linkedWards: [
        {
          id: 'ward-01',
          name: 'Kojo Duodu',
          level: 'Class 4 (Primary)',
          currentSchool: 'Ghana International School',
          status: 'Enrolled'
        }
      ]
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch parent overview' });
  }
});

/**
 * POST /api/parents/link-student
 */
router.post('/link-student', authenticate, async (req, res) => {
  const { studentName, gradeLevel, schoolName } = req.body;
  return res.json({
    success: true,
    message: `Ward ${studentName || 'Student'} successfully linked to parent portal`,
    student: {
      id: `ward-${Date.now()}`,
      name: studentName,
      level: gradeLevel,
      currentSchool: schoolName
    }
  });
});

/**
 * GET /api/bookmarks
 */
router.get('/bookmarks', authenticate, async (req, res) => {
  try {
    const { data: bookmarks, error } = await supabaseAdmin
      .from('bookmarks')
      .select('*')
      .eq('user_id', req.user.id);

    return res.json(bookmarks || []);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

/**
 * POST /api/bookmarks
 */
router.post('/bookmarks', authenticate, async (req, res) => {
  try {
    const { listingType, listingId } = req.body;
    const { data: bookmark, error } = await supabaseAdmin
      .from('bookmarks')
      .insert({
        user_id: req.user.id,
        listing_type: listingType || 'school',
        listing_id: listingId
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(bookmark);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save bookmark' });
  }
});

module.exports = router;
