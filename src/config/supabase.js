const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const cleanEnv = (val) => (val || '').trim().replace(/^["']|["']$/g, '');

const supabaseUrl = cleanEnv(process.env.SUPABASE_URL);
const supabaseAnonKey = cleanEnv(process.env.SUPABASE_ANON_KEY);
const supabaseServiceKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
}

// Fallback to avoid build-time top-level crashes if env vars are being loaded asynchronously
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeServiceKey = supabaseServiceKey || 'placeholder-service-key';
const safeAnonKey = supabaseAnonKey || 'placeholder-anon-key';

// Admin client for backend operations (bypasses RLS safely on server-side)
const supabaseAdmin = createClient(safeUrl, safeServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Public client for user-scoped operations
const supabasePublic = createClient(safeUrl, safeAnonKey);

module.exports = {
  supabaseAdmin,
  supabasePublic,
  supabaseUrl,
  supabaseServiceKey
};

