const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'skoolfinder-jwt-secret-key-ghana-2026';

/**
 * Authentication middleware that verifies Bearer token
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];

    // Try decoding our internal JWT first
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (jwtErr) {
      // Fallback: check if it is a Supabase Auth access token
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      // Fetch user profile from profiles table
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      req.user = {
        id: profile ? profile.id : user.id,
        auth_user_id: user.id,
        email: user.email,
        role: profile ? profile.role : 'parent',
        full_name: profile ? profile.full_name : user.user_metadata?.full_name || 'User'
      };

      return next();
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Authentication verification failure' });
  }
}

/**
 * Role-based authorization middleware
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!roles.includes(req.user.role) && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: `Forbidden: requires one of [${roles.join(', ')}] permissions` });
    }
    next();
  };
}

module.exports = {
  authenticate,
  requireRole,
  JWT_SECRET
};
