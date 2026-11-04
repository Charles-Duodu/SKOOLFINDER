/**
 * SkoolFinder Ghana - Production Environment Verification Tool
 * Audits environment variables and configurations for live Supabase Cloud & Vercel deployment.
 */

require('dotenv').config();

console.log('======================================================================');
console.log('☁️ SKOOLFINDER GHANA: PRODUCTION CLOUD ENVIRONMENT AUDIT');
console.log('======================================================================\n');

const checks = [
  {
    name: 'SUPABASE_URL',
    value: process.env.SUPABASE_URL,
    required: true,
    validator: v => v && v.startsWith('https://') && v.includes('.supabase.co'),
    hint: 'Must be a valid Supabase project URL (https://<project-ref>.supabase.co)'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    value: process.env.SUPABASE_SERVICE_ROLE_KEY,
    required: true,
    validator: v => v && v.length > 30,
    hint: 'Supabase Service Role JWT from Project Settings > API'
  },
  {
    name: 'SUPABASE_ANON_KEY',
    value: process.env.SUPABASE_ANON_KEY,
    required: false,
    validator: v => !v || v.length > 30,
    hint: 'Supabase Anon Public API Key'
  },
  {
    name: 'JWT_SECRET',
    value: process.env.JWT_SECRET,
    required: true,
    validator: v => v && v.length >= 16,
    hint: 'Minimum 16-character secure secret for token signing'
  },
  {
    name: 'PAYSTACK_SECRET_KEY',
    value: process.env.PAYSTACK_SECRET_KEY,
    required: true,
    validator: v => v && (v.startsWith('sk_test_') || v.startsWith('sk_live_')),
    hint: 'Paystack Secret Key (sk_test_... or sk_live_...)'
  },
  {
    name: 'PAYSTACK_PUBLIC_KEY',
    value: process.env.PAYSTACK_PUBLIC_KEY,
    required: false,
    validator: v => !v || (v.startsWith('pk_test_') || v.startsWith('pk_live_')),
    hint: 'Paystack Public Key (pk_test_... or pk_live_...)'
  },
  {
    name: 'HUBTEL_CLIENT_ID',
    value: process.env.HUBTEL_CLIENT_ID,
    required: false,
    validator: v => true,
    hint: 'Hubtel Ghana API Client ID for Live SMS Dispatch'
  },
  {
    name: 'HUBTEL_CLIENT_SECRET',
    value: process.env.HUBTEL_CLIENT_SECRET,
    required: false,
    validator: v => true,
    hint: 'Hubtel Ghana API Client Secret'
  },
  {
    name: 'RESEND_API_KEY',
    value: process.env.RESEND_API_KEY,
    required: false,
    validator: v => true,
    hint: 'Resend API Key for live transactional parent/school email dispatch'
  },
  {
    name: 'NODE_ENV',
    value: process.env.NODE_ENV || 'production',
    required: true,
    validator: v => ['production', 'development', 'staging'].includes(v),
    hint: 'Must be production for live deployment'
  }
];

let passes = 0;
let warnings = 0;
let failures = 0;

for (const check of checks) {
  const isPresent = Boolean(check.value && check.value.trim() !== '');
  const isValid = isPresent ? check.validator(check.value) : !check.required;

  if (isPresent && isValid) {
    const masked = check.value.length > 12 
      ? check.value.substring(0, 4) + '...' + check.value.substring(check.value.length - 4)
      : '********';
    console.log(`  ✅ [PASS] ${check.name.padEnd(28)}: Configured (${masked})`);
    passes++;
  } else if (!isPresent && !check.required) {
    console.log(`  ⚠️ [WARN] ${check.name.padEnd(28)}: Not configured (Optional: Fallback active)`);
    warnings++;
  } else {
    console.log(`  ❌ [FAIL] ${check.name.padEnd(28)}: Missing or Invalid!`);
    console.log(`     Hint: ${check.hint}`);
    failures++;
  }
}

console.log('\n======================================================================');
console.log(`📊 Production Environment Audit: ${passes} Passed, ${warnings} Warnings, ${failures} Failures`);
console.log('======================================================================');

if (failures > 0) {
  console.log('⚠️ Some mandatory environment variables are not yet populated in .env.');
  console.log('   Set these variables in your Vercel Project Settings > Environment Variables.');
} else {
  console.log('🚀 Environment is 100% ready for Vercel Serverless & Supabase Cloud deployment!');
}
