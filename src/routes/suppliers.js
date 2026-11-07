const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const { SupplierBillingService, SUPPLIER_PLANS } = require('../services/supplierBillingService');

const JWT_SECRET = process.env.JWT_SECRET || 'skoolfinder-jwt-secret-key-ghana-2026';

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (e) {
    try {
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) req.user = { id: user.id, email: user.email };
    } catch (err) {}
    return next();
  }
};

const IN_MEMORY_SHORTLISTS = [];
const IN_MEMORY_INQUIRIES = [];
const IN_MEMORY_INQUIRY_MESSAGES = [];

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
 * GET /api/suppliers/shortlist
 * Retrieve shortlisted suppliers for authenticated user or guest session (SUP-03-08)
 */
router.get('/shortlist', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.query.sessionId || req.headers['x-guest-session'];

    if (!userId && !sessionId) {
      return res.json({ success: true, count: 0, suppliers: [] });
    }

    let supplierIds = [];

    try {
      let query = supabaseAdmin.from('supplier_shortlists').select('supplier_id, notes, created_at');
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.eq('session_id', sessionId);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        supplierIds = data.map(item => item.supplier_id);
      }
    } catch (e) {}

    // In-memory fallback
    const memItems = IN_MEMORY_SHORTLISTS.filter(item => {
      if (userId && item.user_id === userId) return true;
      if (sessionId && item.session_id === sessionId) return true;
      return false;
    });
    memItems.forEach(item => {
      if (!supplierIds.includes(item.supplier_id)) {
        supplierIds.push(item.supplier_id);
      }
    });

    if (supplierIds.length === 0) {
      return res.json({ success: true, count: 0, suppliers: [] });
    }

    // Hydrate supplier details
    let suppliers = [];
    try {
      const { data: dbSuppliers } = await supabaseAdmin.from('suppliers').select('*').in('id', supplierIds);
      if (dbSuppliers && dbSuppliers.length > 0) {
        suppliers = [...dbSuppliers];
      }
    } catch (e) {}

    supplierIds.forEach(id => {
      if (!suppliers.some(s => s.id === id)) {
        const fb = FALLBACK_SUPPLIERS.find(s => s.id === id);
        if (fb) suppliers.push(fb);
      }
    });

    const formatted = suppliers.map(formatSupplier);
    return res.json({
      success: true,
      count: formatted.length,
      suppliers: formatted
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve shortlist' });
  }
});

/**
 * POST /api/suppliers/shortlist
 * Add a supplier to shortlist (guest session or authenticated user) (SUP-03-08)
 */
router.post('/shortlist', optionalAuth, async (req, res) => {
  try {
    const { supplierId, sessionId, notes } = req.body;
    if (!supplierId) {
      return res.status(400).json({ error: 'supplierId is required' });
    }

    const userId = req.user?.id || null;
    const session = sessionId || req.headers['x-guest-session'] || null;

    if (!userId && !session) {
      return res.status(400).json({ error: 'Either user authentication or sessionId is required' });
    }

    const record = {
      id: `sl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: userId,
      session_id: session,
      supplier_id: supplierId,
      notes: notes || '',
      created_at: new Date().toISOString()
    };

    try {
      await supabaseAdmin.from('supplier_shortlists').insert({
        user_id: userId,
        session_id: session,
        supplier_id: supplierId,
        notes: notes || ''
      });
    } catch (e) {}

    const exists = IN_MEMORY_SHORTLISTS.some(item => 
      (userId && item.user_id === userId && item.supplier_id === supplierId) ||
      (session && item.session_id === session && item.supplier_id === supplierId)
    );
    if (!exists) {
      IN_MEMORY_SHORTLISTS.push(record);
    }

    return res.status(201).json({
      success: true,
      message: 'Supplier added to shortlist',
      shortlist: record
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add to shortlist' });
  }
});

/**
 * DELETE /api/suppliers/shortlist/:supplierId
 * Remove a supplier from shortlist
 */
router.delete('/shortlist/:supplierId', optionalAuth, async (req, res) => {
  try {
    const { supplierId } = req.params;
    const userId = req.user?.id || null;
    const sessionId = req.query.sessionId || req.headers['x-guest-session'] || null;

    try {
      let query = supabaseAdmin.from('supplier_shortlists').delete().eq('supplier_id', supplierId);
      if (userId) query = query.eq('user_id', userId);
      else if (sessionId) query = query.eq('session_id', sessionId);
      await query;
    } catch (e) {}

    const idx = IN_MEMORY_SHORTLISTS.findIndex(item => 
      item.supplier_id === supplierId && 
      ((userId && item.user_id === userId) || (sessionId && item.session_id === sessionId))
    );
    if (idx !== -1) {
      IN_MEMORY_SHORTLISTS.splice(idx, 1);
    }

    return res.json({ success: true, message: 'Supplier removed from shortlist' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to remove from shortlist' });
  }
});

/**
 * POST /api/suppliers/shortlist/transfer
 * Transfer guest shortlist session items to authenticated user (SUP-03-08)
 */
router.post('/shortlist/transfer', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required for transfer' });
    }

    let transferredCount = 0;

    try {
      const { data: guestItems } = await supabaseAdmin
        .from('supplier_shortlists')
        .select('*')
        .eq('session_id', sessionId);

      if (guestItems && guestItems.length > 0) {
        for (const item of guestItems) {
          await supabaseAdmin
            .from('supplier_shortlists')
            .update({ user_id: userId, session_id: null })
            .eq('id', item.id);
          transferredCount++;
        }
      }
    } catch (e) {}

    IN_MEMORY_SHORTLISTS.forEach(item => {
      if (item.session_id === sessionId) {
        item.user_id = userId;
        item.session_id = null;
        transferredCount++;
      }
    });

    return res.json({
      success: true,
      message: `Successfully transferred ${transferredCount} shortlisted supplier(s) to your school procurement account`,
      transferredCount
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to transfer guest shortlist' });
  }
});

/**
 * GET /api/suppliers/me/inquiries
 * Authenticated: Retrieve incoming or sent inquiries for the current user/supplier (SUP-06-03)
 */
router.get('/me/inquiries', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const { status } = req.query;

    let list = [];

    try {
      let query = supabaseAdmin
        .from('supplier_inquiries')
        .select('*')
        .or(`sender_user_id.eq.${userId},supplier_id.eq.${userId},sender_email.eq.${userEmail}`)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        list = data;
      }
    } catch (e) {}

    const memList = IN_MEMORY_INQUIRIES.filter(inq => {
      const isParticipant = inq.sender_user_id === userId || 
                            inq.supplier_id === userId || 
                            inq.sender_email === userEmail ||
                            req.user.role === 'super_admin';
      if (!isParticipant) return false;
      if (status && inq.status !== status) return false;
      return true;
    });

    memList.forEach(m => {
      if (!list.some(item => item.id === m.id)) {
        list.push(m);
      }
    });

    return res.json({
      success: true,
      count: list.length,
      inquiries: list
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve inquiries' });
  }
});

/**
 * GET /api/suppliers/inquiries/:inquiryId
 * Authenticated: Retrieve single inquiry thread with messages and strict tenant isolation (SUP-06-03)
 */
router.get('/inquiries/:inquiryId', authenticate, async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const userId = req.user.id;
    const userEmail = req.user.email;
    const isSuperAdmin = req.user.role === 'super_admin';

    let inquiry = null;
    try {
      const { data } = await supabaseAdmin
        .from('supplier_inquiries')
        .select('*')
        .eq('id', inquiryId)
        .maybeSingle();
      if (data) inquiry = data;
    } catch (e) {}

    if (!inquiry) {
      inquiry = IN_MEMORY_INQUIRIES.find(i => i.id === inquiryId || i.inquiry_number === inquiryId);
    }

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    const hasAccess = isSuperAdmin || 
                      inquiry.sender_user_id === userId || 
                      inquiry.supplier_id === userId || 
                      inquiry.sender_email === userEmail;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access forbidden: You are not authorized to view this confidential inquiry' });
    }

    let messages = [];
    try {
      const { data: dbMessages } = await supabaseAdmin
        .from('supplier_inquiry_messages')
        .select('*')
        .eq('inquiry_id', inquiry.id)
        .order('created_at', { ascending: true });
      if (dbMessages && Array.isArray(dbMessages)) messages = dbMessages;
    } catch (e) {}

    const memMsgs = IN_MEMORY_INQUIRY_MESSAGES.filter(m => m.inquiry_id === inquiry.id);
    memMsgs.forEach(m => {
      if (!messages.some(item => item.id === m.id)) messages.push(m);
    });

    return res.json({
      success: true,
      inquiry,
      messages
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve inquiry thread' });
  }
});

/**
 * POST /api/suppliers/inquiries/:inquiryId/reply
 * Authenticated: Append response message to inquiry thread
 */
router.post('/inquiries/:inquiryId/reply', authenticate, async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { message, attachments } = req.body;
    const userId = req.user.id;
    const userName = req.user.full_name || req.user.email || 'Participant';

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Reply message cannot be empty' });
    }

    let inquiry = IN_MEMORY_INQUIRIES.find(i => i.id === inquiryId);
    if (!inquiry) {
      try {
        const { data } = await supabaseAdmin.from('supplier_inquiries').select('*').eq('id', inquiryId).maybeSingle();
        if (data) inquiry = data;
      } catch (e) {}
    }

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    const isSupplier = inquiry.supplier_id === userId;
    const role = req.user.role === 'super_admin' ? 'admin' : (isSupplier ? 'supplier' : 'school');

    const msg = {
      id: `msg-${Date.now()}`,
      inquiry_id: inquiry.id,
      sender_id: userId,
      sender_role: role,
      sender_name: userName,
      message: message.trim(),
      attachments: attachments || [],
      created_at: new Date().toISOString()
    };

    try {
      await supabaseAdmin.from('supplier_inquiry_messages').insert(msg);
      if (isSupplier && inquiry.status === 'sent') {
        await supabaseAdmin.from('supplier_inquiries').update({ status: 'read', updated_at: new Date().toISOString() }).eq('id', inquiry.id);
      }
    } catch (e) {}

    IN_MEMORY_INQUIRY_MESSAGES.push(msg);
    if (isSupplier && inquiry.status === 'sent') {
      inquiry.status = 'read';
    }

    return res.status(201).json({
      success: true,
      message: 'Reply delivered',
      reply: msg
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to post reply' });
  }
});

/**
 * PATCH /api/suppliers/inquiries/:inquiryId/status
 * Authenticated: Update inquiry status (read, quoted, declined, closed)
 */
router.patch('/inquiries/:inquiryId/status', authenticate, async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { status } = req.body;

    const allowed = ['sent', 'read', 'quoted', 'declined', 'closed'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }

    try {
      await supabaseAdmin.from('supplier_inquiries').update({
        status,
        updated_at: new Date().toISOString()
      }).eq('id', inquiryId);
    } catch (e) {}

    const inq = IN_MEMORY_INQUIRIES.find(i => i.id === inquiryId);
    if (inq) inq.status = status;

    return res.json({
      success: true,
      message: `Inquiry status updated to "${status}"`,
      status
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});

/**
 * GET /api/suppliers/plans
 * Public: List locked subscription plans for suppliers (SUP-05-01)
 */
router.get('/plans', async (req, res) => {
  try {
    const plans = SupplierBillingService.getPlans();
    return res.json({ success: true, count: plans.length, plans });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve supplier plans' });
  }
});

/**
 * GET /api/suppliers/me/billing
 * Authenticated: Retrieve current subscription, invoice history and grace status (SUP-05-01, SUP-05-06)
 */
router.get('/me/billing', authenticate, async (req, res) => {
  try {
    const supplierId = req.user.id;
    const sub = await SupplierBillingService.getSubscription(supplierId);
    const quotas = await SupplierBillingService.getQuotas(supplierId);

    // Retrieve invoices
    let invoices = [];
    try {
      const { data } = await supabaseAdmin
        .from('supplier_invoices')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('paid_at', { ascending: false });
      if (data) invoices = data;
    } catch (e) {}

    return res.json({
      success: true,
      subscription: sub,
      quotas,
      invoices
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve billing information' });
  }
});

/**
 * POST /api/suppliers/billing/checkout
 * Authenticated: Initialize Paystack platform fee checkout (SUP-05-01, SUP-05-04)
 */
router.post('/billing/checkout', authenticate, async (req, res) => {
  try {
    const supplierId = req.user.id;
    const email = req.user.email || req.body.email;
    const planTier = req.body.plan_tier || req.body.planTier || 'growth';
    const billingInterval = req.body.billing_interval || req.body.billingInterval || 'monthly';

    const checkout = await SupplierBillingService.initializeCheckout({
      supplierId,
      email,
      planTier,
      billingInterval
    });

    return res.status(200).json(checkout);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to initialize subscription checkout' });
  }
});

/**
 * POST /api/suppliers/billing/verify
 * Authenticated: Verify Paystack transaction and activate subscription with idempotency (SUP-05-04, SUP-05-05, SUP-05-06)
 */
router.post('/billing/verify', authenticate, async (req, res) => {
  try {
    const { reference, plan_tier, planTier, billing_interval, billingInterval } = req.body;
    if (!reference) {
      return res.status(400).json({ error: 'Payment reference is required' });
    }

    const verification = await SupplierBillingService.verifyPayment({
      reference,
      supplierId: req.user.id,
      planTier: plan_tier || planTier,
      billingInterval: billing_interval || billingInterval
    });

    return res.status(200).json(verification);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Payment verification failed' });
  }
});

/**
 * POST /api/suppliers/billing/simulate-grace-period
 * Authenticated / Testing: Simulate 7-day payment grace period transition (SUP-05-06, SUP-05-07)
 */
router.post('/billing/simulate-grace-period', authenticate, async (req, res) => {
  try {
    const { status = 'grace_period' } = req.body;
    const sub = SupplierBillingService.simulateGracePeriod(req.user.id, status);
    return res.json({
      success: true,
      message: `Subscription transitioned to ${status}`,
      subscription: sub
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to simulate grace period transition' });
  }
});

/**
 * GET /api/suppliers/me/quotas
 * Authenticated: Retrieve current catalogue and RFQ quoting quotas (SUP-05-02, SUP-05-03, SUP-04-03)
 */
router.get('/me/quotas', authenticate, async (req, res) => {
  try {
    const quotas = await SupplierBillingService.getQuotas(req.user.id);
    return res.json({ success: true, quotas });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve quotas' });
  }
});

/**
 * GET /api/suppliers/me/analytics
 * Authenticated: Retrieve commercial analytics and funnel metrics (SUP-05-08)
 */
router.get('/me/analytics', authenticate, async (req, res) => {
  try {
    const analytics = await SupplierBillingService.getAnalytics(req.user.id);
    return res.json({ success: true, analytics });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

/**
 * GET /api/suppliers/search/semantic
 * Rules-First Eligibility & Explainable Semantic Supplier Ranking (SUP-07-01)
 */
router.get('/search/semantic', async (req, res) => {
  try {
    const { ProcurementAiService } = require('../services/procurementAiService');
    const { query = '', category = 'All', region = 'Greater Accra', min_tier = 'V0' } = req.query;

    let suppliers = FALLBACK_SUPPLIERS;
    try {
      const { data } = await supabaseAdmin.from('suppliers').select('*').eq('status', 'published');
      if (data && data.length > 0) suppliers = data;
    } catch (e) {}

    const formattedSuppliers = suppliers.map(formatSupplier);
    const ranked = ProcurementAiService.rankSuppliers(formattedSuppliers, {
      query,
      category,
      region,
      minVerificationLevel: min_tier
    });

    return res.json({
      success: true,
      count: ranked.length,
      criteria: { query, category, region, min_tier },
      rankedSuppliers: ranked
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to execute semantic supplier ranking' });
  }
});

/**
 * GET /api/suppliers/telemetry/health
 * Operational Observability & Telemetry Health Check (SUP-07-08)
 */
router.get('/telemetry/health', (req, res) => {
  const { ProcurementAiService } = require('../services/procurementAiService');
  return res.json(ProcurementAiService.getObservabilityTelemetry());
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
 * POST /api/suppliers/:id/inquire
 * Submit structured private inquiry or direct procurement invitation (SUP-02-04, SUP-06-03)
 */
router.post('/:id/inquire', optionalAuth, async (req, res) => {
  try {
    const supplierId = req.params.id;
    const body = req.body;

    if (!body.subject || !body.subject.trim()) {
      return res.status(400).json({ error: 'Inquiry subject is required' });
    }
    if (!body.message || !body.message.trim()) {
      return res.status(400).json({ error: 'Inquiry message details are required' });
    }

    const senderUserId = req.user?.id || null;
    const senderName = body.sender_name || req.user?.full_name || 'School Administrator';
    const senderEmail = body.sender_email || req.user?.email || 'admin@school.edu.gh';
    const senderPhone = body.sender_phone || req.user?.phone || '';
    const isDirectInvite = !!body.direct_invitation;

    const inqNumber = `INQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const inquiryPayload = {
      id: `inq-${Date.now()}`,
      inquiry_number: inqNumber,
      sender_user_id: senderUserId,
      sender_name: senderName,
      sender_email: senderEmail,
      sender_phone: senderPhone,
      school_id: body.school_id || null,
      school_name: body.school_name || 'Ghana Educational Institution',
      supplier_id: supplierId,
      subject: body.subject.trim(),
      message: body.message.trim(),
      category_id: body.category_id || null,
      target_timeline: body.target_timeline || 'Within 2 weeks',
      estimated_volume: body.estimated_volume || '',
      status: 'sent',
      direct_invitation: isDirectInvite,
      is_confidential: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      await supabaseAdmin.from('supplier_inquiries').insert(inquiryPayload);
    } catch (e) {}

    IN_MEMORY_INQUIRIES.unshift(inquiryPayload);

    const msgPayload = {
      id: `msg-${Date.now()}`,
      inquiry_id: inquiryPayload.id,
      sender_id: senderUserId,
      sender_role: 'school',
      sender_name: senderName,
      message: body.message.trim(),
      attachments: body.attachments || [],
      created_at: new Date().toISOString()
    };

    try {
      await supabaseAdmin.from('supplier_inquiry_messages').insert(msgPayload);
    } catch (e) {}

    IN_MEMORY_INQUIRY_MESSAGES.push(msgPayload);

    return res.status(201).json({
      success: true,
      message: isDirectInvite 
        ? 'Direct procurement invitation dispatched to supplier (Quotas exempt - SUP-02-04)'
        : 'Private inquiry successfully delivered to supplier',
      inquiryNumber: inqNumber,
      inquiry: inquiryPayload
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit inquiry' });
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

    // Check Catalogue Quota (SUP-05-02)
    const currentProductsCount = IN_MEMORY_PRODUCTS.filter(p => p.supplier_id === req.user.id).length;
    const currentServicesCount = IN_MEMORY_SERVICES.filter(s => s.supplier_id === req.user.id).length;
    const totalCurrentItems = currentProductsCount + currentServicesCount;
    const quotaCheck = await SupplierBillingService.checkCatalogueQuota(req.user.id, totalCurrentItems);
    if (!quotaCheck.allowed) {
      return res.status(403).json({
        success: false,
        error: quotaCheck.error,
        code: 'CATALOGUE_QUOTA_EXCEEDED',
        limit: quotaCheck.limit,
        used: quotaCheck.used
      });
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

    // Check Catalogue Quota (SUP-05-02)
    const currentProductsCount = IN_MEMORY_PRODUCTS.filter(p => p.supplier_id === req.user.id).length;
    const currentServicesCount = IN_MEMORY_SERVICES.filter(s => s.supplier_id === req.user.id).length;
    const totalCurrentItems = currentProductsCount + currentServicesCount;
    const quotaCheck = await SupplierBillingService.checkCatalogueQuota(req.user.id, totalCurrentItems);
    if (!quotaCheck.allowed) {
      return res.status(403).json({
        success: false,
        error: quotaCheck.error,
        code: 'CATALOGUE_QUOTA_EXCEEDED',
        limit: quotaCheck.limit,
        used: quotaCheck.used
      });
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

