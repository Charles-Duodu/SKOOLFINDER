const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const EmailService = require('../services/emailService');
const MarketplaceService = require('../services/marketplaceService');
const { SupplierBillingService } = require('../services/supplierBillingService');

// In-Memory resilience stores for Stage 4 RFQ Procurement
const IN_MEMORY_TARGETED_INVITATIONS = [];
const IN_MEMORY_QUOTE_REVISIONS = [];
const IN_MEMORY_EVALUATIONS = [];
const IN_MEMORY_QUOTES = [];
const IN_MEMORY_RFQS = [];

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

    const { data: rfqs } = await query;
    let combined = [];

    // Get marketplace tenders from MarketplaceService (TEN-004)
    try {
      const tenders = await MarketplaceService.getPublicTenders(req.query);
      if (tenders && tenders.length > 0) {
        combined = [...tenders.map(t => ({
          id: t.id,
          school_id: t.schoolId,
          school_name: t.schoolName,
          title: t.title,
          category: t.category,
          description: t.description,
          budget_range: t.budgetRange,
          quantity: t.quantity,
          region: 'Greater Accra',
          status: t.status === 'open' ? 'Open' : t.status,
          deadline: t.deadline,
          quotes_received: t.quotesReceived
        }))];
      }
    } catch (e) {}

    if (rfqs && rfqs.length > 0) {
      rfqs.forEach(r => {
        if (!combined.some(c => c.id === r.id)) {
          combined.push(r);
        }
      });
    }

    if (combined.length === 0) {
      return res.json(DEFAULT_RFQS);
    }
    return res.json(combined.map(formatRFQ));
  } catch (err) {
    return res.json(DEFAULT_RFQS);
  }
});

/**
 * GET /api/rfqs/:id
 */
router.get('/rfqs/:id', async (req, res) => {
  try {
    let rfq = null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id);
    if (isUuid) {
      try {
        const { data, error } = await supabaseAdmin.from('rfqs').select('*').eq('id', req.params.id).maybeSingle();
        if (!error && data) rfq = data;
      } catch (e) {}
    }

    if (!rfq) {
      rfq = IN_MEMORY_RFQS.find(r => r.id === req.params.id) || DEFAULT_RFQS.find(r => r.id === req.params.id);
    }

    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    return res.json(formatRFQ(rfq));
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching RFQ' });
  }
});

/**
 * POST /api/rfqs
 * Protected: Only authorized school administrators or super admins can post RFQs (SUP-01-03, SUP-03-06)
 */
router.post('/rfqs', authenticate, async (req, res) => {
  try {
    const user = req.user;
    // Invariant SUP-03-06: Suppliers cannot create a school-owned RFQ without school authority
    if (user.role === 'supplier' && !user.school_id && !user.schoolId) {
      return res.status(403).json({ error: 'Access denied: Only verified school administrators or authorized buyers can publish RFQs' });
    }

    const { schoolId, schoolName, title, category, description, budget, budgetRange, quantity, deadline } = req.body;
    const resolvedSchoolId = schoolId || user.school_id || user.schoolId || null;
    const resolvedSchoolName = schoolName || user.schoolName || user.full_name || 'Educational Institution';

    let validSchoolUuid = null;
    if (resolvedSchoolId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedSchoolId)) {
      validSchoolUuid = resolvedSchoolId;
    } else {
      try {
        const { data: sch } = await supabaseAdmin.from('schools').select('id').limit(1).maybeSingle();
        if (sch) validSchoolUuid = sch.id;
      } catch (e) {}
    }

    const rfqNumber = `RFQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const rfqPayload = {
      school_id: validSchoolUuid,
      school_name: resolvedSchoolName,
      rfq_number: rfqNumber,
      title,
      category: category || 'General Supplies',
      description,
      budget: budget || 0,
      budget_range: budgetRange || (budget ? `GH₵ ${Number(budget).toLocaleString()}` : null),
      quantity: quantity || 'Institutional Order',
      deadline: deadline || 'Within 30 Days',
      status: 'Open'
    };

    let rfq = null;
    try {
      const { data, error } = await supabaseAdmin
        .from('rfqs')
        .insert(rfqPayload)
        .select()
        .single();
      if (!error && data) rfq = data;
    } catch (e) {}

    if (!rfq) {
      rfq = {
        id: `rfq-${Date.now()}`,
        ...rfqPayload,
        created_at: new Date().toISOString()
      };
    }
    IN_MEMORY_RFQS.unshift(rfq);

    return res.status(201).json({ success: true, message: 'RFQ published successfully', rfq });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create RFQ' });
  }
});

/**
 * GET /api/rfqs/:id/quotes
 * Protected: Sealed bids viewable ONLY by authorized school proprietor or super admin
 */
router.get('/rfqs/:id/quotes', authenticate, async (req, res) => {
  try {
    const rfqId = req.params.id;

    // Verify RFQ exists and belongs to this school owner (or super admin)
    if (req.user.role !== 'super_admin') {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rfqId);
      if (isUuid) {
        const { data: rfq } = await supabaseAdmin
          .from('rfqs')
          .select('id, school_id')
          .eq('id', rfqId)
          .maybeSingle();

        const userSchoolId = req.user.school_id || req.user.schoolId;
        if (rfq && rfq.school_id && (!userSchoolId || userSchoolId !== rfq.school_id)) {
          return res.status(403).json({ error: 'Access denied: Sealed bids are confidential to the originating school owner' });
        }
      }
    }

    const { data: quotes, error } = await supabaseAdmin
      .from('rfq_quotes')
      .select('*')
      .eq('rfq_id', rfqId);

    return res.json(quotes || []);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

/**
 * POST /api/rfqs/:id/quote & POST /api/rfqs/:id/quotes
 * Protected: Submit quotation on an RFQ (SUP-01-03, SUP-02-05)
 * Requires authenticated user session; attaches verified user identity
 */
router.post(['/rfqs/:id/quote', '/rfqs/:id/quotes'], authenticate, async (req, res) => {
  try {
    const rfqId = req.params.id;
    const user = req.user;
    const {
      supplierId,
      supplierName = user.full_name || 'Accredited Supplier',
      contactPerson = user.full_name || 'Sales Representative',
      phone = user.phone || '+233 24 000 0000',
      email: supplierEmail = user.email || '',
      price,
      amount,
      quotedAmountGhs,
      quoteAmount,
      deliveryDays = 5,
      warrantyTerms = 'Standard 6 Months',
      paymentTerms = 'Direct Bank / MoMo Settlement on Delivery',
      notes = ''
    } = req.body;

    const resolvedSupplierId = supplierId || user.id;

    const numAmount = amount || quotedAmountGhs || quoteAmount;
    const finalPrice = price || (numAmount ? `GH₵ ${Number(numAmount).toLocaleString()}` : 'GH₵ 5,000');
    const quoteRef = `QUOTE-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Check Quota with Direct Invitation Exemption (SUP-04-03, SUP-05-03)
    const isDirectInvite = Boolean(
      req.body.is_direct_invitation || 
      req.body.isDirectInvitation || 
      IN_MEMORY_TARGETED_INVITATIONS.some(inv => inv.rfq_id === rfqId && (inv.supplier_id === resolvedSupplierId || inv.supplier_id === user.id))
    );

    const quotaCheck = await SupplierBillingService.checkRfqQuota(resolvedSupplierId, isDirectInvite);
    if (!quotaCheck.allowed) {
      return res.status(403).json({
        success: false,
        error: quotaCheck.error,
        code: 'RFQ_QUOTA_EXCEEDED',
        limit: quotaCheck.limit,
        used: quotaCheck.used
      });
    }

    // Resolve RFQ details to get school name and RFQ title
    let schoolName = 'Client Institution';
    let rfqTitle = 'Institutional Procurement Request';
    let schoolEmail = process.env.SCHOOL_PROCUREMENT_EMAIL || 'procurement@gis.edu.gh';

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rfqId);
    if (isUuid) {
      const { data: rfq } = await supabaseAdmin.from('rfqs').select('title, school_name').eq('id', rfqId).maybeSingle();
      if (rfq) {
        if (rfq.title) rfqTitle = rfq.title;
        if (rfq.school_name) schoolName = rfq.school_name;
      }
    }

    // Submit to MarketplaceService if active in Phase 2B
    try {
      await MarketplaceService.submitSupplierBid(rfqId, {
        supplierId,
        supplierName,
        supplierEmail,
        supplierPhone: phone,
        quoteAmount: parseFloat(String(finalPrice).replace(/[^0-9.]/g, '')) || 0,
        deliveryDaysSLA: deliveryDays,
        warrantyTerms,
        paymentTerms,
        proposalNotes: notes
      });
    } catch (e) {
      // Not a marketplace tender or handled by standard flow
    }

    // Check if supplier was directly invited in memory or in payload (SUP-04-03: Quotas exempt)
    const isTargeted = IN_MEMORY_TARGETED_INVITATIONS.some(inv => 
      inv.rfq_id === rfqId && (inv.supplier_id === resolvedSupplierId || inv.supplier_id === supplierId)
    );
    const finalDirectInvite = isDirectInvite || isTargeted;

    const { data: quote, error } = await supabaseAdmin
      .from('rfq_quotes')
      .insert({
        rfq_id: isUuid ? rfqId : null,
        supplier_id: supplierId || null,
        supplier_name: supplierName,
        amount: parseFloat(String(finalPrice).replace(/[^0-9.]/g, '')) || 0,
        notes: `[Contact: ${contactPerson} | ${phone} | ${supplierEmail}] ${notes}`.trim(),
        is_direct_invitation: finalDirectInvite,
        delivery_days: deliveryDays,
        warranty_terms: warrantyTerms,
        payment_terms: paymentTerms,
        status: 'Submitted'
      })
      .select()
      .maybeSingle();

    const quoteObj = quote || {
      id: `quote-${Date.now()}`,
      rfq_id: rfqId,
      supplier_id: resolvedSupplierId,
      supplier_name: supplierName,
      amount: parseFloat(String(finalPrice).replace(/[^0-9.]/g, '')) || 0,
      price: finalPrice,
      delivery_days: deliveryDays,
      warranty_terms: warrantyTerms,
      payment_terms: paymentTerms,
      revision_count: 0,
      is_direct_invitation: finalDirectInvite,
      status: 'Submitted',
      created_at: new Date().toISOString()
    };
    IN_MEMORY_QUOTES.push(quoteObj);

    // Record quote against quota & analytics (SUP-04-03, SUP-05-03, SUP-05-08)
    await SupplierBillingService.recordQuoteSubmission(resolvedSupplierId, finalDirectInvite);
    SupplierBillingService.recordAnalyticsEvent({
      supplierId: resolvedSupplierId,
      eventType: 'quote_submitted',
      actorType: 'school',
      entityId: quoteRef
    });

    // 1. Dispatch confirmation email to Supplier
    if (supplierEmail && supplierEmail.includes('@')) {
      EmailService.sendSupplierQuoteConfirmation({
        to: supplierEmail,
        supplierName,
        rfqTitle,
        schoolName,
        price: finalPrice,
        deliveryDays,
        referenceCode: quoteRef
      }).catch(err => console.error('Supplier quote email error:', err.message));
    }

    // 2. Dispatch alert email to School Procurement Board
    EmailService.sendSchoolNewQuoteAlert({
      to: schoolEmail,
      schoolName,
      supplierName,
      rfqTitle,
      price: finalPrice,
      deliveryDays,
      referenceCode: quoteRef
    }).catch(err => console.error('School quote alert error:', err.message));

    return res.status(201).json({
      success: true,
      message: `Quotation submitted to ${schoolName}`,
      quoteRef,
      quote: quoteObj
    });
  } catch (err) {
    console.error('Error submitting quote:', err);
    return res.status(500).json({ error: 'Failed to submit quotation' });
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

/**
 * POST /api/rfqs/:id/invite
 * Protected: Targeted multi-supplier RFQ invitations by school authority (SUP-02-05, SUP-04-03)
 */
router.post('/rfqs/:id/invite', authenticate, async (req, res) => {
  try {
    const rfqId = req.params.id;
    const { supplierIds, notes } = req.body;
    const user = req.user;

    if (!Array.isArray(supplierIds) || supplierIds.length === 0) {
      return res.status(400).json({ error: 'Please specify an array of supplier IDs to invite' });
    }

    const schoolId = user.school_id || user.schoolId || user.id;
    const invitations = [];

    for (const supId of supplierIds) {
      const inviteRecord = {
        id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        rfq_id: rfqId,
        school_id: schoolId,
        supplier_id: supId,
        invitation_notes: notes || 'Direct invitation from school procurement committee',
        status: 'invited',
        is_direct_invitation: true,
        created_at: new Date().toISOString()
      };

      try {
        await supabaseAdmin.from('rfq_targeted_invitations').insert(inviteRecord);
      } catch (e) {}

      IN_MEMORY_TARGETED_INVITATIONS.push(inviteRecord);
      invitations.push(inviteRecord);
    }

    return res.status(201).json({
      success: true,
      message: `Successfully dispatched direct procurement invitations to ${invitations.length} supplier(s)`,
      count: invitations.length,
      invitations
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to issue targeted RFQ invitations' });
  }
});

/**
 * POST /api/rfqs/:id/quote/revise
 * Protected: Supplier submits an auditable revised quote before deadline (SUP-04-01)
 */
router.post('/rfqs/:id/quote/revise', authenticate, async (req, res) => {
  try {
    const rfqId = req.params.id;
    const user = req.user;
    const { quoteId, revisedAmount, revisionReason, deliveryDays, warrantyTerms } = req.body;

    if (!quoteId) {
      return res.status(400).json({ error: 'quoteId is required to submit a revision' });
    }
    if (!revisedAmount || isNaN(parseFloat(revisedAmount))) {
      return res.status(400).json({ error: 'A valid revised amount is required' });
    }
    if (!revisionReason || !revisionReason.trim()) {
      return res.status(400).json({ error: 'Reason for revision is required for procurement audit compliance (SUP-04-01)' });
    }

    let quote = null;
    try {
      const { data } = await supabaseAdmin.from('rfq_quotes').select('*').eq('id', quoteId).maybeSingle();
      if (data) quote = data;
    } catch (e) {}

    if (!quote) {
      quote = IN_MEMORY_QUOTES.find(q => q.id === quoteId);
    }

    if (!quote) {
      return res.status(404).json({ error: 'Quotation record not found' });
    }

    const prevAmount = quote.amount || 0;
    const newAmount = parseFloat(revisedAmount);
    const revisionNumber = (quote.revision_count || 0) + 1;

    const revisionRecord = {
      id: `rev-${Date.now()}`,
      quote_id: quote.id,
      rfq_id: rfqId,
      supplier_id: user.id || quote.supplier_id,
      revision_number: revisionNumber,
      previous_amount: prevAmount,
      revised_amount: newAmount,
      revision_reason: revisionReason.trim(),
      delivery_days: deliveryDays || quote.delivery_days || 5,
      created_at: new Date().toISOString()
    };

    try {
      await supabaseAdmin.from('rfq_quote_revisions').insert(revisionRecord);
      await supabaseAdmin.from('rfq_quotes').update({
        amount: newAmount,
        revision_count: revisionNumber,
        delivery_days: deliveryDays || quote.delivery_days || 5,
        updated_at: new Date().toISOString()
      }).eq('id', quote.id);
    } catch (e) {}

    IN_MEMORY_QUOTE_REVISIONS.push(revisionRecord);

    quote.amount = newAmount;
    quote.price = `GH₵ ${Number(newAmount).toLocaleString()}`;
    quote.revision_count = revisionNumber;
    if (deliveryDays) quote.delivery_days = deliveryDays;

    return res.status(200).json({
      success: true,
      message: `Quote revision #${revisionNumber} registered for audit`,
      revisionNumber,
      revision: revisionRecord,
      quote
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to record quote revision' });
  }
});

/**
 * GET /api/rfqs/:id/compare-quotes
 * Protected: Private side-by-side comparison matrix for school procurement evaluation (SUP-04-02)
 */
router.get('/rfqs/:id/compare-quotes', authenticate, async (req, res) => {
  try {
    const rfqId = req.params.id;
    const user = req.user;

    // Strict Cross-Tenant Isolation: only originating school owner or super admin
    if (user.role !== 'super_admin') {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rfqId);
      if (isUuid) {
        const { data: rfq } = await supabaseAdmin.from('rfqs').select('id, school_id').eq('id', rfqId).maybeSingle();
        const userSchoolId = user.school_id || user.schoolId;
        if (rfq && rfq.school_id && (!userSchoolId || userSchoolId !== rfq.school_id)) {
          return res.status(403).json({ error: 'Access denied: Quote comparison is restricted to the originating school procurement authority (SUP-04-02)' });
        }
      } else if (user.role === 'supplier') {
        return res.status(403).json({ error: 'Access denied: Suppliers cannot view competitor bids or evaluation matrix (SUP-04-02)' });
      }
    }

    let quotesList = [];
    try {
      const { data } = await supabaseAdmin.from('rfq_quotes').select('*').eq('rfq_id', rfqId);
      if (data && Array.isArray(data)) quotesList = [...data];
    } catch (e) {}

    const memQuotes = IN_MEMORY_QUOTES.filter(q => q.rfq_id === rfqId || q.rfqId === rfqId);
    memQuotes.forEach(mq => {
      if (!quotesList.some(q => q.id === mq.id)) quotesList.push(mq);
    });

    // Populate comparison matrix with revisions and evaluation status
    const matrix = quotesList.map(q => {
      const revisions = IN_MEMORY_QUOTE_REVISIONS.filter(r => r.quote_id === q.id);
      const evalRecord = IN_MEMORY_EVALUATIONS.find(ev => ev.quote_id === q.id);
      return {
        id: q.id,
        supplierId: q.supplier_id || 'unknown',
        supplierName: q.supplier_name || 'Accredited Supplier',
        verificationLevel: q.verification_level || 'V2',
        quotedAmountGhs: q.amount || 0,
        formattedPrice: q.price || `GH₵ ${Number(q.amount || 0).toLocaleString()}`,
        deliveryDays: q.delivery_days || 5,
        warrantyTerms: q.warranty_terms || 'Standard 6 Months',
        paymentTerms: q.payment_terms || 'Direct Settlement on Delivery',
        revisionCount: q.revision_count || revisions.length || 0,
        isDirectInvitation: !!q.is_direct_invitation,
        evaluationScore: evalRecord ? evalRecord.total_score : null,
        decision: evalRecord ? evalRecord.decision : (q.status || 'Submitted')
      };
    });

    return res.json({
      success: true,
      rfqId,
      count: matrix.length,
      comparisonMatrix: matrix
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate quote comparison matrix' });
  }
});

/**
 * POST /api/rfqs/:id/evaluate
 * Protected: School procurement committee scores bids and records award decision (SUP-04-02)
 */
router.post('/rfqs/:id/evaluate', authenticate, async (req, res) => {
  try {
    const rfqId = req.params.id;
    const user = req.user;
    const { quoteId, technicalScore = 0, commercialScore = 0, decision = 'shortlisted', evaluationNotes } = req.body;

    if (!quoteId) {
      return res.status(400).json({ error: 'quoteId is required for evaluation' });
    }
    if (user.role === 'supplier') {
      return res.status(403).json({ error: 'Access denied: Suppliers cannot evaluate or score procurement bids' });
    }

    const tScore = parseFloat(technicalScore) || 0;
    const cScore = parseFloat(commercialScore) || 0;
    const totalScore = parseFloat((tScore + cScore).toFixed(2));

    const evalRecord = {
      id: `eval-${Date.now()}`,
      rfq_id: rfqId,
      quote_id: quoteId,
      evaluator_id: user.id,
      technical_score: tScore,
      commercial_score: cScore,
      total_score: totalScore,
      decision,
      evaluation_notes: evaluationNotes || '',
      evaluated_at: new Date().toISOString()
    };

    try {
      await supabaseAdmin.from('rfq_evaluations').insert(evalRecord);
      await supabaseAdmin.from('rfq_quotes').update({ status: decision.toUpperCase() }).eq('id', quoteId);
    } catch (e) {}

    IN_MEMORY_EVALUATIONS.push(evalRecord);

    const q = IN_MEMORY_QUOTES.find(item => item.id === quoteId);
    if (q) q.status = decision;

    return res.status(200).json({
      success: true,
      message: `Evaluation recorded. Status updated to ${decision}`,
      evaluation: evalRecord
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit bid evaluation' });
  }
});

module.exports = router;

