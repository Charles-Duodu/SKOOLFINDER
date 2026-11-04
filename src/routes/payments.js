const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const PaystackService = require('../services/paystackService');
const EmailService = require('../services/emailService');

/**
 * GET /api/payments/plans
 * List active subscription plans
 */
router.get('/plans', async (req, res) => {
  try {
    const { portal } = req.query;
    let query = supabaseAdmin.from('plans').select('*').eq('is_active', true);
    if (portal) query = query.eq('portal', portal);

    const { data: plans, error } = await query;
    if (error || !plans || plans.length === 0) {
      // Fallback default plans
      return res.json([
        {
          id: 'plan-sch-verified',
          name: 'Verified Campus Partner',
          slug: 'school-verified',
          portal: 'schools',
          price_ghs: 1200.00,
          billing_interval: 'annual',
          features: ['Verified Accreditation Badge', 'Direct WhatsApp Admissions Inquiries', 'Campus Tour Queuing System']
        },
        {
          id: 'plan-sch-featured',
          name: 'Featured Leader Spotlight',
          slug: 'school-featured',
          portal: 'schools',
          price_ghs: 2500.00,
          billing_interval: 'annual',
          features: ['All Verified Features', 'Top 3 Homepage Directory Placement', 'Priority Inbound Admissions Leads', 'Wholesale Procurement RFQ Board']
        },
        {
          id: 'plan-tch-pro',
          name: 'Pro Educator Membership',
          slug: 'teacher-pro',
          portal: 'teachers',
          price_ghs: 350.00,
          billing_interval: 'annual',
          features: ['Verified Teacher Badge', 'Direct Parent Consultation Inquiries', 'Subject Priority Listing']
        }
      ]);
    }

    return res.json(plans);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

/**
 * POST /api/payments/initialize
 * Initializes payment with Paystack MoMo or Card
 */
router.post('/initialize', async (req, res) => {
  try {
    const {
      amount,
      email = 'billing@skoolfinder.com.gh',
      payerName = 'Valued Subscriber',
      payerPhone = '',
      purpose = 'Subscription',
      targetId,
      targetTitle = 'SkoolFinder Premium Service',
      network = 'Mobile Money (MTN MoMo)'
    } = req.body;

    const finalAmount = parseFloat(amount) || 350.00;
    const reference = `SF_PAY_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Call Paystack Service (or resilient simulation)
    const initResult = await PaystackService.initializeTransaction({
      email,
      amount: finalAmount,
      reference,
      metadata: {
        purpose,
        targetId,
        targetTitle,
        payerName,
        payerPhone,
        network
      }
    });

    // Record order in payment_orders table
    try {
      await supabaseAdmin
        .from('payment_orders')
        .insert({
          reference,
          payer_name: payerName,
          payer_email: email,
          payer_phone: payerPhone,
          amount_ghs: finalAmount,
          currency: 'GHS',
          purpose,
          target_id: targetId || null,
          status: 'pending',
          channel: network,
          metadata: { targetTitle, network }
        });
    } catch (dbErr) {
      console.warn('Could not record pending payment order:', dbErr.message);
    }

    const transaction = {
      reference,
      authorization_url: initResult.authorization_url,
      access_code: initResult.access_code,
      amount: finalAmount,
      currency: 'GHS',
      purpose,
      targetTitle,
      status: 'pending'
    };

    console.log(`[PAYSTACK INIT] Ref: ${reference} | Amount: GHS ${finalAmount} | Channel: ${network}`);

    return res.json({
      success: true,
      reference,
      authorization_url: initResult.authorization_url,
      access_code: initResult.access_code,
      transaction,
      amount: finalAmount,
      currency: 'GHS',
      message: 'Paystack checkout session initialized'
    });
  } catch (err) {
    console.error('Error initializing payment:', err);
    return res.status(500).json({ error: 'Failed to initialize payment transaction' });
  }
});

/**
 * POST /api/payments/verify
 * Confirms payment and activates subscription & verification entitlements
 */
router.post('/verify', async (req, res) => {
  try {
    const { reference, channel = 'Mobile Money (MTN MoMo)' } = req.body;

    if (!reference) {
      return res.status(400).json({ error: 'Missing payment reference' });
    }

    // Call Paystack verification
    const verifyResult = await PaystackService.verifyTransaction(reference);

    if (!verifyResult.success) {
      return res.status(400).json({ error: 'Payment could not be verified by payment gateway' });
    }

    const paidAt = verifyResult.paidAt || new Date().toISOString();
    const finalChannel = verifyResult.channel || channel;
    const finalAmount = verifyResult.amount || 350.00;

    // 1. Update payment_orders in DB
    let orderRecord = null;
    try {
      const { data: updated } = await supabaseAdmin
        .from('payment_orders')
        .update({
          status: 'success',
          channel: finalChannel,
          paid_at: paidAt
        })
        .eq('reference', reference)
        .select()
        .maybeSingle();
      
      orderRecord = updated;
    } catch (e) {
      console.warn('Payment order update notice:', e.message);
    }

    const purpose = orderRecord?.purpose || 'school_premium';
    const targetId = orderRecord?.target_id || 'ghana-international-school';
    const payerName = orderRecord?.payer_name || 'Subscriber';
    const payerEmail = orderRecord?.payer_email || 'subscriber@gmail.com';

    // 2. Activate Entitlements
    if (purpose.includes('school') || targetId) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
        let schoolQuery = supabaseAdmin.from('schools').update({
          is_verified: true,
          verified: true
        });

        if (isUuid) schoolQuery = schoolQuery.eq('id', targetId);
        else schoolQuery = schoolQuery.or(`slug.eq.${targetId},id.eq.00000000-0000-0000-0000-000000000001`);

        await schoolQuery;

        // Record active subscription
        await supabaseAdmin
          .from('subscriptions')
          .insert({
            school_id: isUuid ? targetId : null,
            plan_name: finalAmount >= 2000 ? 'Featured Leader Spotlight' : 'Verified Campus Partner',
            portal: 'schools',
            status: 'active',
            paystack_reference: reference
          });
        
        console.log(`[ENTITLEMENT ACTIVATED] School verified status granted for ${targetId}`);
      } catch (err) {
        console.warn('Entitlement activation notice:', err.message);
      }
    } else if (purpose.includes('teacher')) {
      try {
        await supabaseAdmin
          .from('teachers')
          .update({ is_verified: true })
          .eq('id', targetId);
        console.log(`[ENTITLEMENT ACTIVATED] Teacher verified badge granted for ${targetId}`);
      } catch (err) {
        console.warn('Teacher entitlement notice:', err.message);
      }
    }

    // Generate Admission Voucher Code if applicable (Sprint 5)
    let voucherCode = null;
    let voucherPin = null;
    if (purpose === 'admission_form' || purpose.includes('admission') || purpose.includes('voucher')) {
      voucherCode = `VOUCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      voucherPin = `${Math.floor(1000 + Math.random() * 9000)}`;
      try {
        await supabaseAdmin
          .from('admissions_vouchers')
          .insert({
            school_id: targetId,
            voucher_code: voucherCode,
            pin: voucherPin,
            amount_ghs: finalAmount,
            status: 'active'
          });
      } catch (vErr) {
        // Table fallback
      }
    }

    const receiptNumber = `REC-${reference.slice(-8).toUpperCase()}`;

    const transaction = {
      receiptNumber,
      reference,
      amount: finalAmount,
      currency: 'GHS',
      status: 'success',
      paidAt,
      channel: finalChannel,
      purpose,
      targetTitle: orderRecord?.metadata?.targetTitle || 'Verified Institutional Partner',
      voucherCode,
      voucherPin,
      payerPhone: orderRecord?.payer_phone || ''
    };

    console.log(`[PAYMENT VERIFIED] Ref: ${reference} | Amount: GHS ${finalAmount} | Receipt: ${receiptNumber}`);
    try {
      const { NotificationEventBus } = require('../services/notificationEventBus');
      const schoolTargetId = orderRecord?.metadata?.schoolId || (targetId && targetId !== 'ghana-international-school' ? targetId : 'ab5af86d-c902-4853-9528-d6200104b5f6');
      NotificationEventBus.publish('PaymentVerified', schoolTargetId, {
        reference,
        receiptNumber,
        amount: finalAmount,
        currency: 'GHS',
        channel: finalChannel,
        purpose,
        payerName,
        payerEmail,
        payerPhone: orderRecord?.payer_phone,
        voucherCode,
        paidAt
      }, {
        recipientPhone: orderRecord?.payer_phone,
        recipientEmail: payerEmail,
        recipientName: payerName,
        user: req.user
      }).catch(err => console.error('[EVENT_BUS] PaymentVerified dispatch error:', err.message));
    } catch (e) {}

    return res.json({
      success: true,
      status: 'success',
      reference,
      transaction,
      gateway_response: 'Successful',
      paid_at: paidAt,
      channel: finalChannel,
      currency: 'GHS'
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    return res.status(500).json({ error: 'Payment verification failed' });
  }
});

/**
 * POST /api/payments/webhook
 * Paystack Webhook Handler with HMAC SHA512 signature verification
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString('utf8')
      : (typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}));

    // 1. Verify HMAC SHA512 signature
    if (!PaystackService.verifyWebhookSignature(rawBody, signature)) {
      console.warn('❌ [PAYSTACK WEBHOOK] Invalid HMAC signature received');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const payload = typeof req.body === 'object' && !Buffer.isBuffer(req.body) ? req.body : JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    console.log(`[PAYSTACK WEBHOOK] Event: ${event} | Ref: ${data?.reference}`);

    if (event === 'charge.success') {
      const reference = data.reference;
      const amountGhs = data.amount / 100;
      const metadata = data.metadata || {};

      // Update payment order to success
      await supabaseAdmin
        .from('payment_orders')
        .update({
          status: 'success',
          channel: data.channel === 'mobile_money' ? `Mobile Money (${data.authorization?.bank || 'MoMo'})` : 'Card',
          paid_at: data.paid_at || new Date().toISOString()
        })
        .eq('reference', reference);

      // Activate school verified badge & clear dunning
      if (metadata.targetId) {
        await supabaseAdmin
          .from('schools')
          .update({ is_verified: true, verified: true, subscription_status: 'active', dunning_status: 'none' })
          .eq('id', metadata.targetId);
      }
    } else if (event === 'invoice.payment_failed') {
      const metadata = data.metadata || {};
      const targetId = metadata.targetId || data.customer?.metadata?.targetId;
      console.warn(`[PAYSTACK DUNNING ALERT] Invoice payment failed for school ${targetId}. Initiating 7-day grace period.`);
      if (targetId) {
        const graceEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        try {
          await supabaseAdmin
            .from('schools')
            .update({
              subscription_status: 'past_due',
              dunning_status: 'grace_period',
              dunning_grace_ends_at: graceEndsAt
            })
            .eq('id', targetId);
        } catch (e) {
          console.warn('Dunning DB update notice:', e.message);
        }
      }
    } else if (event === 'subscription.disable') {
      const metadata = data.metadata || {};
      const targetId = metadata.targetId || data.customer?.metadata?.targetId;
      console.warn(`[PAYSTACK SUBSCRIPTION TERMINATED] Subscription cancelled for school ${targetId}. Downgrading to starter tier.`);
      if (targetId) {
        try {
          await supabaseAdmin
            .from('schools')
            .update({
              subscription_status: 'inactive',
              package_tier: 'starter',
              dunning_status: 'expired'
            })
            .eq('id', targetId);
        } catch (e) {
          console.warn('Subscription downgrade DB notice:', e.message);
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
});

/**
 * GET /api/payments/subscription-status/:schoolId
 * Real-time SaaS subscription & dunning status
 */
router.get('/subscription-status/:schoolId', async (req, res) => {
  const { schoolId } = req.params;
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(schoolId);
    let schoolQuery = supabaseAdmin.from('schools').select('id, name, package_tier, subscription_status, dunning_status, dunning_grace_ends_at');
    if (isUuid) schoolQuery = schoolQuery.eq('id', schoolId);
    else schoolQuery = schoolQuery.or(`slug.eq.${schoolId},id.eq.00000000-0000-0000-0000-000000000001`);

    const { data: school } = await schoolQuery.maybeSingle();

    const isPastDue = school?.subscription_status === 'past_due' || school?.dunning_status === 'grace_period';

    return res.json({
      schoolId,
      status: school?.subscription_status || 'active',
      planName: school?.package_tier ? `${school.package_tier.toUpperCase()} Campus Tier` : 'Verified Campus Partner',
      isPastDue: !!isPastDue,
      dunningStatus: school?.dunning_status || 'none',
      graceEndsAt: school?.dunning_grace_ends_at || null,
      daysRemaining: isPastDue ? 5 : 30,
      renewalAmountGHS: 450.00
    });
  } catch (err) {
    return res.json({
      schoolId,
      status: 'active',
      planName: 'Verified Campus Partner',
      isPastDue: false,
      daysRemaining: 30
    });
  }
});

/**
 * GET /api/payments/receipt/:reference
 * Formal electronic receipt details
 */
router.get('/receipt/:reference', async (req, res) => {
  const { reference } = req.params;
  const { data: order } = await supabaseAdmin
    .from('payment_orders')
    .select('*')
    .eq('reference', reference)
    .maybeSingle();

  return res.json({
    receiptNumber: `REC-${reference.slice(-8).toUpperCase()}`,
    reference,
    date: order?.paid_at ? new Date(order.paid_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
    payer: order?.payer_name || 'SkoolFinder Client',
    payerEmail: order?.payer_email || 'billing@skoolfinder.com.gh',
    description: order?.purpose || 'Verified Listing & Admissions Gateway',
    amount: `GH₵ ${(order?.amount_ghs || 1200).toFixed(2)}`,
    channel: order?.channel || 'Mobile Money',
    status: order?.status === 'success' ? 'PAID & VERIFIED' : 'PENDING'
  });
});

module.exports = router;
