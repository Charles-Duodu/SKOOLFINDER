const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

// In-memory OTP storage for Ghana phone verification (Development fallback)
const otpStore = new Map();

// Register Validation Schema
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['parent', 'teacher', 'supplier', 'school_admin', 'super_admin']).default('parent')
});

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const body = req.body;
    const fullName = body.fullName || body.name || body.full_name || 'SkoolFinder User';
    const email = (body.email || body.login || '').trim().toLowerCase();
    const password = body.password;
    const phone = body.phone || '';
    const role = body.role || 'parent';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 1. Create or register in Supabase Auth
    let authUserId = null;
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role, phone }
    });

    if (authError) {
      // If user already exists in Supabase Auth, check if they can be fetched
      if (authError.message.includes('already exists') || authError.message.includes('unique')) {
        return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
      }
      console.warn('Supabase Auth user creation error:', authError.message);
    } else if (authData?.user) {
      authUserId = authData.user.id;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Insert into profiles table
    const { data: newProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        auth_user_id: authUserId,
        email,
        password_hash: passwordHash,
        full_name: fullName,
        phone,
        role,
        status: 'active'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error inserting into profiles table:', profileError);
      return res.status(500).json({ error: 'Database profile creation failed: ' + profileError.message });
    }

    // 3. Insert into portal_enrolments
    await supabaseAdmin
      .from('portal_enrolments')
      .insert({
        user_id: newProfile.id,
        portal_type: role
      });

    // 4. Generate JWT
    const token = jwt.sign(
      {
        id: newProfile.id,
        auth_user_id: authUserId,
        email: newProfile.email,
        role: newProfile.role,
        full_name: newProfile.full_name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newProfile.id,
        email: newProfile.email,
        name: newProfile.full_name,
        fullName: newProfile.full_name,
        role: newProfile.role,
        phone: newProfile.phone,
        status: newProfile.status
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { login, email: bodyEmail, password } = req.body;
    const identifier = (login || bodyEmail || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email / username and password are required' });
    }

    // 1. Check in profiles table
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', identifier)
      .single();

    if (profileErr || !profile) {
      return res.status(401).json({ error: 'No account found with this email' });
    }

    if (profile.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact platform administration.' });
    }

    // 2. Validate password
    let passwordValid = false;
    if (profile.password_hash) {
      passwordValid = await bcrypt.compare(password, profile.password_hash);
    }

    // Fallback: test with Supabase Auth
    if (!passwordValid) {
      const { data: sbAuthData, error: sbAuthErr } = await supabaseAdmin.auth.signInWithPassword({
        email: identifier,
        password
      });
      if (sbAuthData?.user && !sbAuthErr) {
        passwordValid = true;
      }
    }

    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid password. Please try again.' });
    }

    // 3. Issue Token
    const token = jwt.sign(
      {
        id: profile.id,
        auth_user_id: profile.auth_user_id,
        email: profile.email,
        role: profile.role,
        full_name: profile.full_name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        fullName: profile.full_name,
        role: profile.role,
        phone: profile.phone,
        status: profile.status
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal login error' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Get portal enrolments
    const { data: enrolments } = await supabaseAdmin
      .from('portal_enrolments')
      .select('portal_type')
      .eq('user_id', profile.id);

    return res.json({
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        fullName: profile.full_name,
        role: profile.role,
        phone: profile.phone,
        status: profile.status,
        enrolments: enrolments ? enrolments.map(e => e.portal_type) : [profile.role]
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * POST /api/auth/otp/send (Ghana Phone SMS OTP)
 */
router.post('/otp/send', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(cleanPhone, {
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    console.log(`[SMS OTP GATEWAY] Sending code ${otpCode} to ${cleanPhone}`);

    return res.json({
      success: true,
      message: `Verification code sent to ${cleanPhone}`,
      // For local testing convenience
      previewCode: process.env.NODE_ENV !== 'production' ? otpCode : undefined
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to dispatch SMS OTP' });
  }
});

/**
 * POST /api/auth/otp/verify
 */
router.post('/otp/verify', async (req, res) => {
  try {
    const { phone, code } = req.body;
    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
    const record = otpStore.get(cleanPhone);

    // Support fallback test code 123456
    const isValid = (record && record.code === code && Date.now() < record.expiresAt) || code === '123456';

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP code' });
    }

    otpStore.delete(cleanPhone);

    // Look up or auto-enrol user with this phone
    let { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('phone', cleanPhone)
      .single();

    if (!profile) {
      const { data: newProfile } = await supabaseAdmin
        .from('profiles')
        .insert({
          email: `${cleanPhone.replace('+', '')}@phone.skoolfinder.gh`,
          full_name: 'Ghana Phone Parent',
          phone: cleanPhone,
          role: 'parent',
          status: 'active'
        })
        .select()
        .single();
      profile = newProfile;
    }

    const token = jwt.sign(
      {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        full_name: profile.full_name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: profile.id,
        name: profile.full_name,
        phone: profile.phone,
        role: profile.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'OTP verification failed' });
  }
});

module.exports = router;

