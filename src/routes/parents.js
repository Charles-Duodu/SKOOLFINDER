const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// In-memory linked wards store per user (synced with session)
const userWardsStore = new Map();

/**
 * GET /api/parents/overview & /api/parent/overview
 */
router.get('/overview', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch bookmarks
    const { data: rawBookmarks } = await supabaseAdmin
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId);

    const bookmarks = rawBookmarks || [];

    // Fetch school details for saved school bookmarks
    const schoolIds = bookmarks
      .filter(b => b.listing_type === 'school')
      .map(b => b.listing_id);

    let savedSchools = [];
    if (schoolIds.length > 0) {
      const { data: schs } = await supabaseAdmin
        .from('schools')
        .select('*')
        .in('id', schoolIds);
      savedSchools = schs || [];
    }

    // Fetch enquiries for this user
    const { data: rawEnquiries } = await supabaseAdmin
      .from('enquiries')
      .select('*')
      .or(`sender_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    const enquiries = rawEnquiries || [];

    // User's linked wards
    const userWards = userWardsStore.get(userId) || [
      {
        id: 'ward-01',
        name: 'Kojo Duodu',
        level: 'Class 4 (Primary)',
        currentSchool: 'Ghana International School',
        status: 'Enrolled'
      }
    ];

    return res.json({
      success: true,
      user: req.user,
      metrics: {
        savedSchoolsCount: bookmarks.filter(b => b.listing_type === 'school').length,
        savedTeachersCount: bookmarks.filter(b => b.listing_type === 'teacher').length,
        activeEnquiriesCount: enquiries.length,
        wardsCount: userWards.length
      },
      bookmarks,
      savedSchools,
      enquiries,
      linkedWards: userWards,
      recentApplications: enquiries.map(e => ({
        id: e.id,
        schoolName: e.subject.includes(':') ? e.subject.split(':')[0] : 'Institution',
        subject: e.subject,
        status: e.status === 'pending' ? 'Pending Review' : e.status,
        date: new Date(e.created_at).toLocaleDateString('en-GB')
      }))
    });
  } catch (err) {
    console.error('Parent overview error:', err);
    return res.status(500).json({ error: 'Failed to fetch parent overview' });
  }
});

/**
 * POST /api/parents/bookmarks & /api/parent/bookmarks (Toggle Bookmark)
 */
router.post('/bookmarks', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const listingId = req.body.schoolId || req.body.listingId;
    const listingType = req.body.listingType || 'school';

    if (!listingId) {
      return res.status(400).json({ error: 'listingId or schoolId is required' });
    }

    // Check if already bookmarked
    const { data: existing } = await supabaseAdmin
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('listing_id', listingId)
      .maybeSingle();

    if (existing) {
      // Remove bookmark
      await supabaseAdmin
        .from('bookmarks')
        .delete()
        .eq('id', existing.id);

      return res.json({
        success: true,
        bookmarked: false,
        message: 'Removed from saved bookmarks'
      });
    } else {
      // Add bookmark
      const { data: newBookmark } = await supabaseAdmin
        .from('bookmarks')
        .insert({
          user_id: userId,
          listing_type: listingType,
          listing_id: listingId
        })
        .select()
        .single();

      return res.json({
        success: true,
        bookmarked: true,
        message: 'Saved to bookmarks',
        bookmark: newBookmark
      });
    }
  } catch (err) {
    console.error('Toggle bookmark error:', err);
    return res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
});

/**
 * POST /api/parents/wards & /api/parents/link-student (Add or link ward)
 */
const handleAddWard = async (req, res) => {
  try {
    const userId = req.user.id;
    const body = req.body;
    const wardName = body.studentName || body.childName || body.name || 'Student Ward';
    const gradeLevel = body.gradeLevel || body.level || body.childLevel || 'Class 1';
    const schoolName = body.schoolName || body.currentSchool || 'Ghana International School';

    const newWard = {
      id: `ward-${Date.now()}`,
      name: wardName,
      level: gradeLevel,
      currentSchool: schoolName,
      status: 'Registered'
    };

    const currentWards = userWardsStore.get(userId) || [
      {
        id: 'ward-01',
        name: 'Kojo Duodu',
        level: 'Class 4 (Primary)',
        currentSchool: 'Ghana International School',
        status: 'Enrolled'
      }
    ];

    currentWards.push(newWard);
    userWardsStore.set(userId, currentWards);

    return res.status(201).json({
      success: true,
      message: `Ward ${wardName} linked to your parent portal.`,
      ward: newWard,
      student: newWard,
      wards: currentWards
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add ward' });
  }
};

router.post('/wards', authenticate, handleAddWard);
router.post('/link-student', authenticate, handleAddWard);

/**
 * GET /api/bookmarks
 */
router.get('/bookmarks', authenticate, async (req, res) => {
  try {
    const { data: bookmarks } = await supabaseAdmin
      .from('bookmarks')
      .select('*')
      .eq('user_id', req.user.id);

    return res.json(bookmarks || []);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

module.exports = router;
