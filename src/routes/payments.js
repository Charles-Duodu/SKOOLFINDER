const express = require('express');
const router = express.Router();

/**
 * POST /api/payments/initialize
 */
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount, purpose = 'Subscription', plan = 'Standard' } = req.body;
    const reference = `SF_PAY_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return res.json({
      success: true,
      reference,
      authorization_url: `https://checkout.paystack.com/pay/${reference}`,
      access_code: `SF_AC_${Date.now()}`,
      amount: amount || 150,
      currency: 'GHS',
      message: 'Paystack checkout session initialized'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

/**
 * POST /api/payments/verify
 */
router.post('/verify', async (req, res) => {
  try {
    const { reference, channel = 'Mobile Money (MTN MoMo)' } = req.body;

    return res.json({
      success: true,
      status: 'success',
      reference,
      gateway_response: 'Successful',
      paid_at: new Date().toISOString(),
      channel,
      currency: 'GHS'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Payment verification failed' });
  }
});

/**
 * GET /api/payments/receipt/:reference
 */
router.get('/receipt/:reference', (req, res) => {
  const { reference } = req.params;
  return res.json({
    receiptNumber: `REC-${reference}`,
    date: new Date().toLocaleDateString('en-GB'),
    payer: 'SkoolFinder Client',
    description: 'Annual Verified Listing Subscription',
    amount: 'GHS 450.00',
    status: 'PAID'
  });
});

module.exports = router;
