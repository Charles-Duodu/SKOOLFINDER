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
      req.user.activePersona = decoded.activePersona || decoded.active_persona || decoded.role || 'parent';
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
        active_persona: profile?.active_persona || profile?.role || 'parent',
        activePersona: profile?.active_persona || profile?.role || 'parent',
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

/**
 * Persona-scoped authorization middleware (Release 1 DEC-001)
 */
function requirePersona(...personas) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const currentPersona = req.user.activePersona || req.user.role || 'parent';
    const normalizedTarget = personas.map(p => p === 'professional' ? 'teacher' : p);
    const normalizedCurrent = currentPersona === 'professional' ? 'teacher' : currentPersona;
    if (!normalizedTarget.includes(normalizedCurrent) && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: `Forbidden: requires active persona [${personas.join(', ')}]` });
    }
    next();
  };
}

/**
 * Optional authentication middleware: attaches req.user if valid token provided, but doesn't block guests
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
}

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
  requirePersona,
  JWT_SECRET
};

