/**
 * SkoolFinder Ghana - SMS OTP Verification Service
 * 
 * Generates, dispatches, and verifies one-time passwords (OTP) for Ghanaian mobile
 * numbers (+233) via Hubtel Ghana SMS gateway. Powers the phone-based parent authentication.
 */

const crypto = require('crypto');
const hubtelService = require('./hubtelService');

class OTPService {
  constructor() {
    // In-memory store: phone -> { code, expiresAt, attempts, createdAt }
    this.otpStore = new Map();
    this.OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
    this.MAX_ATTEMPTS = 5;
  }

  /**
   * Generates a secure 6-digit numeric OTP
   */
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Sends an OTP code to a Ghanaian mobile number via Hubtel SMS
   * @param {string} phone - Mobile number (e.g., 0244318900 or 233244318900)
   * @param {string} [purpose='login'] - Purpose of OTP ('login', 'verification', 'fees')
   */
  async sendOTP(phone, purpose = 'login') {
    if (!phone) {
      throw new Error('Phone number is required');
    }

    const normalizedPhone = hubtelService.normalizePhoneNumber(phone);
    if (!normalizedPhone || normalizedPhone.length < 10) {
      throw new Error('Invalid Ghanaian phone number. Must be MTN, Telecel, or AT.');
    }

    // Rate limiting: check if recent OTP was requested within 30 seconds
    const existing = this.otpStore.get(normalizedPhone);
    if (existing && Date.now() - existing.createdAt < 30 * 1000) {
      const waitSec = Math.ceil((30 * 1000 - (Date.now() - existing.createdAt)) / 1000);
      throw new Error(`Please wait ${waitSec}s before requesting a new OTP code.`);
    }

    const code = this.generateCode();
    const expiresAt = Date.now() + this.OTP_EXPIRY_MS;

    this.otpStore.set(normalizedPhone, {
      code,
      expiresAt,
      attempts: 0,
      createdAt: Date.now(),
      purpose
    });

    const network = hubtelService.detectNetwork(normalizedPhone);
    const smsMessage = `SkoolFinder Ghana: Your verification code is ${code}. Valid for 5 minutes. Do not share this code.`;

    // Dispatch SMS via Hubtel Ghana
    const smsResult = await hubtelService.sendSMS({
      to: normalizedPhone,
      message: smsMessage,
      senderId: 'SkoolFinder'
    });

    return {
      success: true,
      phone: normalizedPhone,
      network,
      expiresInSeconds: 300,
      smsDispatched: smsResult.success,
      isLive: smsResult.isLive,
      // Include code in response during simulation/development for instant testing
      debugCode: smsResult.isLive ? undefined : code,
      message: `Verification code sent via SMS to ${normalizedPhone} (${network})`
    };
  }

  /**
   * Verifies an OTP code
   * @param {string} phone
   * @param {string} code
   */
  verifyOTP(phone, code) {
    if (!phone || !code) {
      return { success: false, error: 'Phone number and verification code are required.' };
    }

    const normalizedPhone = hubtelService.normalizePhoneNumber(phone);
    const record = this.otpStore.get(normalizedPhone);

    if (!record) {
      return { success: false, error: 'No active verification code found for this number. Please request a new code.' };
    }

    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(normalizedPhone);
      return { success: false, error: 'Verification code has expired. Please request a new code.' };
    }

    if (record.attempts >= this.MAX_ATTEMPTS) {
      this.otpStore.delete(normalizedPhone);
      return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
    }

    if (record.code !== code.trim()) {
      record.attempts += 1;
      const remaining = this.MAX_ATTEMPTS - record.attempts;
      return { success: false, error: `Invalid code. ${remaining} attempts remaining.` };
    }

    // Code verified successfully
    this.otpStore.delete(normalizedPhone);
    return {
      success: true,
      phone: normalizedPhone,
      verifiedAt: new Date().toISOString()
    };
  }
}

module.exports = new OTPService();
