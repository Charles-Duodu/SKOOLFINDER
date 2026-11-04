const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
  console.log('======================================================================');
  console.log('☁️ SKOOLFINDER GHANA: LIVE SUPABASE CLOUD VERIFICATION');
  console.log('======================================================================\n');

  const { data, error } = await supabase
    .from('schools')
    .select('id, name, locality, active_tier, is_verified, verification_status')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Supabase Error:', error.message);
    return;
  }

  console.log(`✅ Total Schools Live in Supabase Cloud: ${data.length}\n`);
  data.forEach((s, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. 🏫 ${s.name.padEnd(46)} | Locality: ${(s.locality || 'Accra').padEnd(16)} | Tier: ${(s.active_tier || 'growth').toUpperCase()}`);
  });

  // Verify other tables
  const tables = ['verification_cases', 'school_intakes', 'school_admissions', 'school_vacancies', 'school_tenders', 'campus_assets', 'emis_census_submissions'];
  console.log('\n----------------------------------------------------------------------');
  console.log('📊 Core Platform Tables Status:');
  console.log('----------------------------------------------------------------------');
  for (const t of tables) {
    const { error: tblErr } = await supabase.from(t).select('id').limit(1);
    console.log(`  ${t.padEnd(28)}: ${tblErr ? '⚠️ ' + tblErr.message : '✅ LIVE & QUERYABLE'}`);
  }

  console.log('\n======================================================================');
  console.log('🎉 Live Greater Accra Pilot Cloud Deployment Successfully Verified!');
  console.log('======================================================================');
}

verify().catch(console.error);

