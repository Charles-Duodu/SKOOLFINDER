/**
 * SkoolFinder Ghana - Hubtel SMS Integration Service
 * 
 * Official REST API client for dispatching SMS notifications to Ghanaian mobile networks
 * (MTN, Telecel, AT) via the Hubtel Ghana Gateway.
 * 
 * Documentation: https://developers.hubtel.com/documentations/sms-api
 */

require('dotenv').config();

const HUBTEL_API_BASE = 'https://sms.hubtel.com/v1/messages/send';

class HubtelSMSService {
  constructor() {
    this.clientId = process.env.HUBTEL_CLIENT_ID || '';
    this.clientSecret = process.env.HUBTEL_CLIENT_SECRET || '';
    this.defaultSenderId = process.env.HUBTEL_SENDER_ID || 'SkoolFinder';
  }

  /**
   * Formats Ghanaian phone numbers to international E.164 standard (e.g., 233XXXXXXXXX)
   */
  normalizePhoneNumber(phone) {
    if (!phone) return '';
    let digits = phone.replace(/[^0-9]/g, '');
    if (digits.startsWith('0') && digits.length === 10) {
      digits = '233' + digits.substring(1);
    } else if (digits.startsWith('233') && digits.length === 12) {
      // Already E.164
    } else if (digits.length === 9) {
      digits = '233' + digits;
    }
    return digits;
  }

  /**
   * Detects Ghanaian network provider from normalized phone number
   */
  detectNetwork(phone) {
    const p = this.normalizePhoneNumber(phone);
    if (/^233(24|54|55|59|53)/.test(p)) return 'MTN Ghana';
    if (/^233(20|50)/.test(p)) return 'Telecel Ghana';
    if (/^233(26|56|27|57)/.test(p)) return 'AT Ghana';
    return 'Ghana Telecom Network';
  }

  /**
   * Checks if live Hubtel credentials are configured
   */
  isConfigured() {
    return (
      Boolean(this.clientId) &&
      Boolean(this.clientSecret) &&
      !this.clientId.includes('mock') &&
      !this.clientSecret.includes('mock')
    );
  }

  /**
   * Returns gateway production diagnostic metadata
   */
  getProductionStatus() {
    return {
      isConfigured: this.isConfigured(),
      mode: this.isConfigured() ? 'live_production' : 'simulation_sandbox',
      senderId: this.defaultSenderId,
      clientIdPrefix: this.clientId && !this.clientId.includes('mock') ? this.clientId.slice(0, 6) + '...' : null,
      supportedTelcos: ['MTN Ghana', 'Telecel Ghana', 'AT Ghana'],
      e164Formatting: true
    };
  }

  /**
   * Dispatches an SMS message via Hubtel
   * @param {Object} params
   * @param {string} params.to - Recipient phone number (e.g. 0244318900 or 233244318900)
   * @param {string} params.message - Content of SMS
   * @param {string} [params.senderId] - Approved Sender ID (max 11 chars)
   * @returns {Promise<Object>}
   */
  async sendSMS({ to, message, senderId }) {
    const formattedRecipient = this.normalizePhoneNumber(to);
    const activeSenderId = (senderId || this.defaultSenderId).substring(0, 11);
    const network = this.detectNetwork(formattedRecipient);

    // 1. Live Hubtel API Dispatch
    if (this.isConfigured()) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        const url = new URL(HUBTEL_API_BASE);
        url.searchParams.append('From', activeSenderId);
        url.searchParams.append('To', formattedRecipient);
        url.searchParams.append('Content', message);
        url.searchParams.append('RegisteredDelivery', 'true');

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.status === 0) {
          return {
            success: true,
            isLive: true,
            messageId: data.messageId || `hubtel-${Date.now()}`,
            recipient: formattedRecipient,
            network,
            units: data.rate || 1,
            rateGHS: (data.rate || 1) * 0.045, // ~GH₵ 0.045 per standard SMS unit
            status: 'Delivered',
            gatewayResponse: data
          };
        } else {
          console.warn('[Hubtel API Error]:', data);
          return {
            success: false,
            isLive: true,
            error: data.description || 'Hubtel transmission error',
            gatewayResponse: data
          };
        }
      } catch (err) {
        console.error('[Hubtel Dispatch Exception]:', err.message);
        return {
          success: false,
          isLive: true,
          error: err.message
        };
      }
    }

    // 2. Simulated Local/Sandbox Dispatch (when live keys not provided)
    return {
      success: true,
      isLive: false,
      isSimulated: true,
      messageId: `sim-hubtel-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      recipient: formattedRecipient,
      senderId: activeSenderId,
      network,
      units: 1,
      rateGHS: 0.045,
      status: 'Delivered',
      note: 'Processed via SkoolFinder Local Sandbox Simulation. Set live HUBTEL_CLIENT_ID and HUBTEL_CLIENT_SECRET in .env for production telco dispatch.'
    };
  }
}

module.exports = new HubtelSMSService();
