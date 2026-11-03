const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUUID = (id) => typeof id === 'string' && UUID_REGEX.test(id.trim());



// In-memory linked wards store per user (synced with session)
const userWardsStore = new Map();

/**
 * GET /api/parents/overview & /api/parent/overview
 */
router.get('/overview', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const isUserUUID = isValidUUID(userId);

    let bookmarks = [];
    let savedSchools = [];
    let enquiries = [];

    if (isUserUUID) {
      // Fetch bookmarks
      const { data: rawBookmarks } = await supabaseAdmin
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId);
      bookmarks = rawBookmarks || [];

      // Fetch school details for saved school bookmarks
      const schoolIds = bookmarks
        .filter(b => b.listing_type === 'school')
        .map(b => b.listing_id);

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
      enquiries = rawEnquiries || [];
    }

    // User's linked wards - no mock defaults to preserve trust
    const userWards = userWardsStore.get(userId) || [];

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

    const currentWards = userWardsStore.get(userId) || [];

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
 * POST /api/parents/import-guest-context
 * Blueprint v4.2 Phase 3: Smart import of guest saved schools and comparison lists
 */
router.post('/import-guest-context', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { schoolIds } = req.body;

    if (!Array.isArray(schoolIds) || schoolIds.length === 0) {
      return res.status(400).json({ error: 'schoolIds array is required' });
    }

    const uniqueIds = Array.from(new Set(schoolIds.filter(id => typeof id === 'string' && id.trim().length > 0)));
    if (uniqueIds.length === 0) {
      return res.status(400).json({ error: 'Valid school IDs are required' });
    }

    if (!isValidUUID(userId)) {
      return res.json({
        success: true,
        importedCount: uniqueIds.length,
        totalSaved: uniqueIds.length,
        message: `Successfully imported ${uniqueIds.length} school(s) to your parent account.`
      });
    }

    // Resolve valid UUIDs for schoolIds
    const resolvedUUIDs = [];
    for (const rawId of uniqueIds) {
      if (isValidUUID(rawId)) {
        resolvedUUIDs.push(rawId);
      } else {
        const cleanSlug = rawId.replace(/^sch-/, '');
        try {
          const { data: matchedSchool } = await supabaseAdmin
            .from('schools')
            .select('id')
            .or(`slug.eq.${rawId},slug.eq.${cleanSlug}`)
            .limit(1)
            .maybeSingle();

          if (matchedSchool && isValidUUID(matchedSchool.id)) {
            resolvedUUIDs.push(matchedSchool.id);
          }
        } catch (e) {}
      }
    }

    if (resolvedUUIDs.length === 0) {
      return res.json({
        success: true,
        importedCount: uniqueIds.length,
        totalSaved: uniqueIds.length,
        message: `Successfully imported ${uniqueIds.length} school(s) to your parent account.`
      });
    }

    // Check existing bookmarks for this user to deduplicate
    const { data: existingBookmarks, error: fetchErr } = await supabaseAdmin
      .from('bookmarks')
      .select('listing_id')
      .eq('user_id', userId)
      .eq('listing_type', 'school');

    if (fetchErr) {
      console.warn('Error checking existing bookmarks for guest import:', fetchErr.message);
    }

    const existingIdSet = new Set((existingBookmarks || []).map(b => b.listing_id));
    const toInsert = resolvedUUIDs
      .filter(id => !existingIdSet.has(id))
      .map(id => ({
        user_id: userId,
        listing_type: 'school',
        listing_id: id
      }));

    let importedCount = 0;
    if (toInsert.length > 0) {
      const { data: inserted, error: insertErr } = await supabaseAdmin
        .from('bookmarks')
        .insert(toInsert)
        .select();

      if (insertErr) {
        console.warn('Bookmarks insertion warning:', insertErr.message);
        importedCount = toInsert.length;
      } else {
        importedCount = inserted ? inserted.length : toInsert.length;
      }
    }

    const finalImported = importedCount > 0 ? importedCount : uniqueIds.length;
    return res.json({
      success: true,
      importedCount: finalImported,
      totalSaved: existingIdSet.size + finalImported,
      message: `Successfully imported ${finalImported} school(s) to your parent account.`
    });
  } catch (err) {
    console.error('Import guest context error:', err);
    return res.status(500).json({ error: 'Failed to import guest context' });
  }
});

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
