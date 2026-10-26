/**
 * SkoolFinder Ghana - Paystack Mobile Money & Card Gateway Integration
 * 
 * Official client for initializing and verifying Mobile Money (MTN MoMo, Telecel Cash, AT Money)
 * and Visa/Mastercard payments for school fees, vouchers, and procurement in Ghana.
 * 
 * Documentation: https://paystack.com/docs/api/
 */

require('dotenv').config();
const crypto = require('crypto');

const PAYSTACK_API_BASE = 'https://api.paystack.co';

class PaystackPaymentService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY || '';
    this.webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET || this.secretKey;
  }

  /**
   * Checks if live or test Paystack credentials are configured
   */
  isConfigured() {
    return (
      Boolean(this.secretKey) &&
      !this.secretKey.includes('mock') &&
      this.secretKey.startsWith('sk_')
    );
  }

  /**
   * Checks if production live keys (sk_live_...) are active
   */
  isLiveMode() {
    return this.isConfigured() && this.secretKey.startsWith('sk_live_');
  }

  /**
   * Returns gateway production diagnostic metadata
   */
  getProductionStatus() {
    return {
      isConfigured: this.isConfigured(),
      isLive: this.isLiveMode(),
      mode: this.isLiveMode() ? 'live_production' : (this.isConfigured() ? 'test_sandbox' : 'simulation_sandbox'),
      publicKeyPrefix: this.publicKey ? this.publicKey.slice(0, 10) + '...' : null,
      currency: 'GHS',
      channels: ['mobile_money', 'card'],
      networks: ['MTN Mobile Money', 'Telecel Cash', 'AT Money'],
      webhookSecretConfigured: Boolean(this.webhookSecret && !this.webhookSecret.includes('mock'))
    };
  }

  /**
   * Initializes a Mobile Money / Card transaction
   * @param {Object} params
   * @param {string} params.email - Parent or user email
   * @param {number} params.amountGHS - Amount in Ghana Cedis (GH₵)
   * @param {string} [params.reference] - Unique internal transaction reference
   * @param {string} [params.callbackUrl] - URL to redirect user after checkout
   * @param {Object} [params.metadata] - Custom invoice/student metadata
   * @param {Array<string>} [params.channels] - Supported channels (default: ['mobile_money', 'card'])
   * @returns {Promise<Object>}
   */
  async initializeTransaction({
    email,
    amountGHS,
    reference,
    callbackUrl,
    metadata = {},
    channels = ['mobile_money', 'card']
  }) {
    const amountInPesewas = Math.round(Number(amountGHS) * 100);
    const txRef = reference || `SF-PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Live Paystack API Request
    if (this.isConfigured()) {
      try {
        const payload = {
          email,
          amount: amountInPesewas,
          currency: 'GHS',
          reference: txRef,
          callback_url: callbackUrl || 'http://localhost:3000/#/parent-portal',
          channels,
          metadata: {
            ...metadata,
            platform: 'SkoolFinder Ghana',
            country: 'GH'
          }
        };

        const response = await fetch(`${PAYSTACK_API_BASE}/transaction/initialize`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.status) {
          return {
            success: true,
            isLive: true,
            authorizationUrl: data.data.authorization_url,
            accessCode: data.data.access_code,
            reference: data.data.reference,
            amountGHS,
            currency: 'GHS',
            raw: data.data
          };
        } else {
          console.warn('[Paystack Initialize Error]:', data);
          return {
            success: false,
            isLive: true,
            error: data.message || 'Payment initialization failed',
            raw: data
          };
        }
      } catch (err) {
        console.error('[Paystack Exception]:', err.message);
        return {
          success: false,
          isLive: true,
          error: err.message
        };
      }
    }

    // 2. Simulated Local/Sandbox Transaction (when live keys not provided)
    return {
      success: true,
      isLive: false,
      isSimulated: true,
      reference: txRef,
      accessCode: `sim_access_${Date.now()}`,
      authorizationUrl: `http://localhost:3000/#/parent-portal?mock_payment=true&ref=${txRef}`,
      amountGHS,
      currency: 'GHS',
      channels,
      note: 'Processed via SkoolFinder Local Sandbox Simulation. Set live PAYSTACK_SECRET_KEY in .env for production MoMo prompt processing.'
    };
  }

  /**
   * Verifies transaction status with Paystack
   * @param {string} reference - The transaction reference to verify
   * @returns {Promise<Object>}
   */
  async verifyTransaction(reference) {
    if (this.isConfigured()) {
      try {
        const response = await fetch(`${PAYSTACK_API_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.status) {
          const tx = data.data;
          const isSuccess = tx.status === 'success';

          return {
            success: isSuccess,
            isLive: true,
            status: tx.status,
            reference: tx.reference,
            amountGHS: tx.amount / 100,
            currency: tx.currency,
            paidAt: tx.paid_at,
            channel: tx.channel, // 'mobile_money' or 'card'
            customer: tx.customer,
            authorization: tx.authorization,
            gatewayResponse: tx.gateway_response,
            metadata: tx.metadata
          };
        } else {
          return {
            success: false,
            isLive: true,
            status: 'failed',
            error: data.message || 'Verification failed'
          };
        }
      } catch (err) {
        return {
          success: false,
          isLive: true,
          error: err.message
        };
      }
    }

    // Simulated Verification
    return {
      success: true,
      isLive: false,
      isSimulated: true,
      status: 'success',
      reference,
      amountGHS: 1500,
      currency: 'GHS',
      paidAt: new Date().toISOString(),
      channel: 'mobile_money',
      gatewayResponse: 'Approved (Simulated Teleco MoMo Settlement)'
    };
  }

  /**
   * Validates Paystack webhook HMAC-SHA512 signature
   * @param {string} signature - Header 'x-paystack-signature'
   * @param {string|Buffer} rawBody - Raw body of the webhook request
   * @returns {boolean}
   */
  verifyWebhookSignature(signature, rawBody) {
    if (!signature || !this.secretKey) return false;
    try {
      const hash = crypto
        .createHmac('sha512', this.secretKey)
        .update(rawBody)
        .digest('hex');
      return hash === signature;
    } catch (err) {
      console.error('[Paystack Webhook Verification Error]:', err.message);
      return false;
    }
  }
}

module.exports = new PaystackPaymentService();
