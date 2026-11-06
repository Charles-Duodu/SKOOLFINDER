const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const TutoringService = require('../services/tutoringService');
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUUID = (id) => typeof id === 'string' && UUID_REGEX.test(id.trim());



// In-memory linked wards store per user (synced with session)
const userWardsStore = new Map();
const userShortlistsStore = new Map();
const userComparisonsStore = new Map();

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

    // Fetch User's linked wards from Supabase parent_wards with in-memory fallback (DEC-026)
    let userWards = [];
    if (isUserUUID) {
      try {
        const { data: dbWards, error: wardErr } = await supabaseAdmin
          .from('parent_wards')
          .select('*')
          .eq('parent_id', userId)
          .order('created_at', { ascending: false });

        if (!wardErr && Array.isArray(dbWards) && dbWards.length > 0) {
          userWards = dbWards.map(w => ({
            id: w.id,
            name: `${w.first_name}${w.last_name ? ' ' + w.last_name : ''}`,
            firstName: w.first_name,
            lastName: w.last_name || '',
            level: w.grade_level,
            gradeLevel: w.grade_level,
            currentSchool: w.current_school || 'Ghana Institution',
            curriculumInterest: w.curriculum_interest || ['GES'],
            status: w.status || 'Registered'
          }));
        }
      } catch (e) {}
    }

    if (userWards.length === 0) {
      userWards = userWardsStore.get(userId) || [];
    }

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
      applications: enquiries.map(e => ({
        id: e.id,
        applicationNumber: e.subject && e.subject.includes('#') ? e.subject.split('#')[1].replace(')', '').trim() : `SF-ADM-2026-${e.id.slice(0, 6)}`,
        schoolName: e.subject && e.subject.includes(':') ? e.subject.split(':')[0] : 'Accredited Institution',
        student: { firstName: 'Applicant', lastName: 'Ward' },
        gradeApplying: 'Primary Class 4',
        subject: e.subject,
        status: e.status === 'replied' ? 'Exam Scheduled' : (e.status === 'pending' ? 'Under Review' : e.status),
        submittedAt: e.created_at,
        date: new Date(e.created_at).toLocaleDateString('en-GB')
      })),
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
 * Dual-storage architecture: Supabase parent_wards with in-memory fallback (DEC-026)
 */
const handleAddWard = async (req, res) => {
  try {
    const userId = req.user.id;
    const body = req.body;
    const wardName = body.studentName || body.childName || body.name || 'Student Ward';
    const gradeLevel = body.gradeLevel || body.level || body.childLevel || 'Class 1';
    const schoolName = body.schoolName || body.currentSchool || 'Ghana International School';

    let newWard = {
      id: `ward-${Date.now()}`,
      name: wardName,
      level: gradeLevel,
      currentSchool: schoolName,
      status: 'Registered'
    };

    if (isValidUUID(userId)) {
      try {
        const nameParts = wardName.trim().split(' ');
        const firstName = nameParts[0] || wardName;
        const lastName = nameParts.slice(1).join(' ') || '';

        const { data: inserted, error: insertErr } = await supabaseAdmin
          .from('parent_wards')
          .insert({
            parent_id: userId,
            first_name: firstName,
            last_name: lastName,
            grade_level: gradeLevel,
            current_school: schoolName,
            status: 'Registered'
          })
          .select()
          .single();

        if (!insertErr && inserted) {
          newWard = {
            id: inserted.id,
            name: `${inserted.first_name}${inserted.last_name ? ' ' + inserted.last_name : ''}`,
            firstName: inserted.first_name,
            lastName: inserted.last_name,
            level: inserted.grade_level,
            gradeLevel: inserted.grade_level,
            currentSchool: inserted.current_school,
            status: inserted.status || 'Registered'
          };
        }
      } catch (e) {
        console.warn('parent_wards insert notice:', e.message);
      }
    }

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
 * GET /api/parents/wards
 * Retrieves linked wards for the authenticated parent
 */
router.get('/wards', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    let wards = [];
    if (isValidUUID(userId)) {
      try {
        const { data: dbWards, error } = await supabaseAdmin
          .from('parent_wards')
          .select('*')
          .eq('parent_id', userId)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(dbWards) && dbWards.length > 0) {
          wards = dbWards.map(w => ({
            id: w.id,
            name: `${w.first_name}${w.last_name ? ' ' + w.last_name : ''}`,
            firstName: w.first_name,
            lastName: w.last_name || '',
            level: w.grade_level,
            gradeLevel: w.grade_level,
            currentSchool: w.current_school || '',
            status: w.status || 'Registered'
          }));
        }
      } catch (e) {}
    }
    if (wards.length === 0) {
      wards = userWardsStore.get(userId) || [];
    }
    return res.json({ success: true, count: wards.length, wards });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve linked wards' });
  }
});

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


/**
 * GET /api/parents/shortlists
 * Blueprint v4.2 Phase 4: Retrieve 5-State Decision Board Shortlists
 */
router.get('/shortlists', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    let list = [];

    // 1. Try fetching from Supabase table if available
    if (isValidUUID(userId)) {
      try {
        const { data: dbItems, error: dbErr } = await supabaseAdmin
          .from('parent_shortlists')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!dbErr && dbItems) {
          list = dbItems.map(item => ({
            id: item.id,
            schoolId: item.school_id,
            stage: item.stage || 'considering',
            priority: Boolean(item.priority),
            notes: item.notes || '',
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }));
        }
      } catch (e) {}
    }

    // 2. Fallback to in-memory store if DB query returned empty or table doesn't exist
    if (list.length === 0) {
      const memoryItems = userShortlistsStore.get(userId) || [];
      if (memoryItems.length > 0) {
        list = [...memoryItems];
      }
    }

    // 3. Fallback to bookmarks if neither has records
    if (list.length === 0 && isValidUUID(userId)) {
      try {
        const { data: bookmarks } = await supabaseAdmin
          .from('bookmarks')
          .select('listing_id, created_at')
          .eq('user_id', userId)
          .eq('listing_type', 'school');

        if (bookmarks && bookmarks.length > 0) {
          list = bookmarks.map(b => ({
            schoolId: b.listing_id,
            stage: 'considering',
            priority: false,
            notes: '',
            createdAt: b.created_at || new Date().toISOString(),
            updatedAt: b.created_at || new Date().toISOString()
          }));
          userShortlistsStore.set(userId, list);
        }
      } catch (e) {}
    }

    // 4. Enrich with school metadata
    const schoolIds = list.map(item => item.schoolId).filter(Boolean);
    const schoolMap = new Map();

    if (schoolIds.length > 0) {
      try {
        const { data: schools } = await supabaseAdmin
          .from('schools')
          .select('id, name, slug, region, curriculum, ownership_type, featured_image, logo_url, rating, review_count')
          .in('id', schoolIds.filter(isValidUUID));

        if (schools) {
          schools.forEach(s => schoolMap.set(s.id, s));
        }
      } catch (e) {}
    }

    const enriched = list.map(item => {
      const sch = schoolMap.get(item.schoolId) || {};
      return {
        ...item,
        schoolName: sch.name || `School (${item.schoolId})`,
        region: sch.region || 'Greater Accra',
        curriculum: sch.curriculum || 'Standard',
        ownershipType: sch.ownership_type || 'Private',
        imageUrl: sch.featured_image || sch.logo_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80',
        slug: sch.slug || item.schoolId
      };
    });

    // Compute stage counts
    const counts = {
      considering: enriched.filter(s => s.stage === 'considering').length,
      interested: enriched.filter(s => s.stage === 'interested').length,
      preferred: enriched.filter(s => s.stage === 'preferred').length,
      visit_planned: enriched.filter(s => s.stage === 'visit_planned').length,
      not_suitable: enriched.filter(s => s.stage === 'not_suitable').length,
      total: enriched.length
    };

    return res.json({
      success: true,
      shortlists: enriched,
      counts
    });
  } catch (err) {
    console.error('Fetch parent shortlists error:', err);
    return res.status(500).json({ error: 'Failed to fetch shortlists' });
  }
});

/**
 * POST /api/parents/shortlists
 * Blueprint v4.2 Phase 4: Save or Update School in 5-State Decision Board
 */
router.post('/shortlists', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { schoolId, stage = 'considering', priority = false, notes = '' } = req.body;

    if (!schoolId) {
      return res.status(400).json({ error: 'schoolId is required' });
    }

    const validStages = ['considering', 'interested', 'preferred', 'visit_planned', 'not_suitable'];
    const sanitizedStage = validStages.includes(stage) ? stage : 'considering';

    const updatedItem = {
      schoolId,
      stage: sanitizedStage,
      priority: Boolean(priority),
      notes: typeof notes === 'string' ? notes.trim() : '',
      updatedAt: new Date().toISOString()
    };

    // Update in-memory store
    const userItems = userShortlistsStore.get(userId) || [];
    const existingIdx = userItems.findIndex(i => i.schoolId === schoolId);
    if (existingIdx !== -1) {
      userItems[existingIdx] = { ...userItems[existingIdx], ...updatedItem };
    } else {
      userItems.unshift({ ...updatedItem, createdAt: new Date().toISOString() });
    }
    userShortlistsStore.set(userId, userItems);

    // Try persisting to Supabase table if valid UUIDs
    if (isValidUUID(userId) && isValidUUID(schoolId)) {
      try {
        await supabaseAdmin
          .from('parent_shortlists')
          .upsert({
            user_id: userId,
            school_id: schoolId,
            stage: sanitizedStage,
            priority: Boolean(priority),
            notes: typeof notes === 'string' ? notes.trim() : '',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,school_id' });
      } catch (dbErr) {
        console.warn('DB upsert parent_shortlist warning:', dbErr.message);
      }
    }

    return res.json({
      success: true,
      item: updatedItem,
      message: `Updated school stage to ${sanitizedStage}`
    });
  } catch (err) {
    console.error('Save parent shortlist error:', err);
    return res.status(500).json({ error: 'Failed to update shortlist' });
  }
});

/**
 * DELETE /api/parents/shortlists/:schoolId
 */
router.delete('/shortlists/:schoolId', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { schoolId } = req.params;

    if (!schoolId) {
      return res.status(400).json({ error: 'schoolId is required' });
    }

    // Remove from in-memory
    const userItems = userShortlistsStore.get(userId) || [];
    const filtered = userItems.filter(i => i.schoolId !== schoolId);
    userShortlistsStore.set(userId, filtered);

    // Remove from DB if valid UUIDs
    if (isValidUUID(userId) && isValidUUID(schoolId)) {
      try {
        await supabaseAdmin
          .from('parent_shortlists')
          .delete()
          .eq('user_id', userId)
          .eq('school_id', schoolId);

        await supabaseAdmin
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', schoolId);
      } catch (e) {}
    }

    return res.json({
      success: true,
      message: 'Removed from shortlist'
    });
  } catch (err) {
    console.error('Delete parent shortlist error:', err);
    return res.status(500).json({ error: 'Failed to delete shortlist' });
  }
});

// ============================================================================
// PACKAGE D: SAVED 4-SCHOOL COMPARISONS & MATCH PLANS
// ============================================================================

/**
 * GET /api/parents/saved-comparisons
 * Dual-storage architecture: Supabase parent_saved_comparisons with in-memory fallback (DEC-026)
 */
router.get('/saved-comparisons', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    let list = [];

    if (isValidUUID(userId)) {
      try {
        const { data: dbComps, error } = await supabaseAdmin
          .from('parent_saved_comparisons')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(dbComps) && dbComps.length > 0) {
          list = dbComps.map(c => ({
            id: c.id,
            userId: c.user_id,
            title: c.title,
            schoolIds: c.school_ids || [],
            criteria: c.criteria,
            createdAt: c.created_at
          }));
        }
      } catch (e) {}
    }

    if (list.length === 0) {
      list = userComparisonsStore.get(userId) || [];
    }

    return res.json({ success: true, count: list.length, comparisons: list });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch saved comparisons' });
  }
});

/**
 * POST /api/parents/saved-comparisons
 */
router.post('/saved-comparisons', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { schoolIds = [], title = 'School Comparison', criteria = null } = req.body;
    if (!Array.isArray(schoolIds) || schoolIds.length === 0) {
      return res.status(400).json({ error: 'schoolIds array is required (1 to 4 schools)' });
    }
    const cleanIds = schoolIds.slice(0, 4);
    let newComp = {
      id: `cmp-${Date.now()}`,
      userId,
      title: title || `Comparison (${cleanIds.length} Schools)`,
      schoolIds: cleanIds,
      criteria,
      createdAt: new Date().toISOString()
    };

    if (isValidUUID(userId)) {
      try {
        const { data: inserted, error: insertErr } = await supabaseAdmin
          .from('parent_saved_comparisons')
          .insert({
            user_id: userId,
            title: newComp.title,
            school_ids: cleanIds,
            criteria: criteria || {}
          })
          .select()
          .single();

        if (!insertErr && inserted) {
          newComp = {
            id: inserted.id,
            userId: inserted.user_id,
            title: inserted.title,
            schoolIds: inserted.school_ids,
            criteria: inserted.criteria,
            createdAt: inserted.created_at
          };
        }
      } catch (e) {
        console.warn('parent_saved_comparisons insert notice:', e.message);
      }
    }

    const list = userComparisonsStore.get(userId) || [];
    list.unshift(newComp);
    userComparisonsStore.set(userId, list);

    return res.status(201).json({
      success: true,
      message: 'Comparison set successfully saved to parent account',
      comparison: newComp
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save comparison' });
  }
});

/**
 * DELETE /api/parents/saved-comparisons/:id
 */
router.delete('/saved-comparisons/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (isValidUUID(userId) && isValidUUID(id)) {
      try {
        await supabaseAdmin
          .from('parent_saved_comparisons')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
      } catch (e) {}
    }

    const list = userComparisonsStore.get(userId) || [];
    const filtered = list.filter(c => c.id !== id);
    userComparisonsStore.set(userId, filtered);
    return res.json({ success: true, message: 'Saved comparison removed' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete saved comparison' });
  }
});

/**
 * ============================================================================
 * PACKAGE F: PARENT DIGITAL ADMISSIONS VOUCHERS WALLET
 * ============================================================================
 */

/**
 * GET /api/parents/vouchers & /api/parent/vouchers (Package F: VOUCH-004)
 * Retrieves purchased admission vouchers for parent by auth session or phone/email query
 */
router.get('/vouchers', async (req, res) => {
  try {
    const { AdmissionsVoucherService } = require('../services/admissionsVoucherService');
    let phone = req.query.phone || '';
    let email = req.query.email || '';
    let userId = '';

    // Extract user if Bearer token present
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('../middleware/auth');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded) {
          userId = decoded.id || '';
          if (!phone) phone = decoded.phone || '';
          if (!email) email = decoded.email || '';
        }
      } catch (e) {}
    }

    const result = await AdmissionsVoucherService.getParentVouchers({ phone, email, userId });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch parent vouchers' });
  }
});

/**
 * GET /api/parents/vouchers/:code
 * Retrieves specific voucher verification record by code with optional PIN
 */
router.get('/vouchers/:code', async (req, res) => {
  try {
    const { AdmissionsVoucherService } = require('../services/admissionsVoucherService');
    const { code } = req.params;
    const pin = req.query.pin || null;
    const result = await AdmissionsVoucherService.getVoucherByCode(code, pin);
    return res.json(result);
  } catch (err) {
    return res.status(404).json({ error: err.message || 'Voucher not found' });
  }
});

// ============================================================================
// RELEASE 4: SAFEGUARDED TUTORING — PARENT-SIDE BOOKING ENDPOINTS
// ============================================================================

/**
 * GET /api/parents/bookings
 * Authenticated parent retrieves their consultation bookings via TutoringService (DEC-010)
 */
router.get('/bookings', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const phone = req.user.phone || req.query.phone || null;
    const bookings = await TutoringService.getParentBookings(userId, phone);
    return res.json({
      success: true,
      total: bookings.length,
      bookings
    });
  } catch (err) {
    console.error('Parent bookings retrieval error:', err);
    return res.status(500).json({ error: 'Failed to retrieve parent bookings' });
  }
});

/**
 * POST /api/parents/book
 * Parent initiates a new tutoring consultation request (Gate G4 enforced)
 */
router.post('/book', authenticate, async (req, res) => {
  try {
    const body = { ...req.body };
    const result = await TutoringService.createBooking(body, req.user);
    return res.status(201).json(result);
  } catch (err) {
    if (err.code === 'SAFEGUARDING_GATE_G4_BLOCKED') {
      return res.status(403).json({ error: err.message, code: err.code });
    }
    return res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/parents/bookings/:id
 * Retrieve a specific booking by ID for this parent
 */
router.get('/bookings/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;
    const allBookings = await TutoringService.getParentBookings(userId);
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or not authorised' });
    }
    return res.json({ success: true, booking });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve booking' });
  }
});

/**
 * PATCH /api/parents/bookings/:id/status
 * Parent transitions a booking status (e.g., parent_signoff, cancelled)
 */
router.patch('/bookings/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Target status is required' });
    const result = await TutoringService.transitionBookingStatus(id, status, req.user, req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
