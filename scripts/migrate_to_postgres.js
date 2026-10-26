/**
 * SkoolFinder Ghana - Automated JSON to PostgreSQL Data Migration Tool
 * 
 * Safely scales the local JSON database to a production PostgreSQL database
 * (Render PostgreSQL, Supabase, Neon, AWS RDS, or Docker PostgreSQL).
 * 
 * Usage:
 *   node scripts/migrate_to_postgres.js
 * 
 * Environment variables:
 *   DATABASE_URL=postgres://user:password@host:5432/dbname
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pgClient = require('../data/pgClient');

async function runMigration() {
  console.log('================================================================');
  console.log('🇬🇭  SkoolFinder Ghana - Enterprise Database Migration Engine');
  console.log('    JSON Document Store -> Production PostgreSQL Relational Store');
  console.log('================================================================\n');

  if (!pgClient.isConfigured()) {
    console.error('❌ Error: DATABASE_URL environment variable is not defined.');
    console.log('👉 Please set DATABASE_URL in your .env file or environment, e.g.:');
    console.log('   DATABASE_URL=postgres://user:password@localhost:5432/skoolfinder_db\n');
    process.exit(1);
  }

  // 1. Test Connection
  console.log('🔌 Step 1: Connecting to PostgreSQL...');
  const connStatus = await pgClient.checkConnection();
  if (!connStatus.connected) {
    console.error(`❌ Connection failed: ${connStatus.error}`);
    process.exit(1);
  }
  console.log(`   Connected to: ${connStatus.database} (${connStatus.version})`);
  console.log(`   Server Time: ${connStatus.serverTime}\n`);

  // 2. Initialize Schema
  console.log('📋 Step 2: Applying PostgreSQL relational schema (schema.sql)...');
  try {
    const schemaResult = await pgClient.initSchema();
    console.log(`   ${schemaResult.message}\n`);
  } catch (err) {
    console.error(`❌ Failed applying schema: ${err.message}`);
    process.exit(1);
  }

  // 3. Load JSON Source Data
  console.log('📂 Step 3: Reading source records from data/database.json...');
  const jsonPath = path.join(__dirname, '..', 'data', 'database.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Source database file not found at ${jsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const dbData = JSON.parse(rawData);
  const collections = Object.keys(dbData);
  console.log(`   Discovered ${collections.length} collections in JSON document store.\n`);

  // 4. Migrate Core Collections
  console.log('🚚 Step 4: Migrating records into PostgreSQL tables...');
  const stats = {};

  const client = await pgClient.pool.connect();
  try {
    await client.query('BEGIN');

    // 4.1 Schools
    if (Array.isArray(dbData.schools)) {
      for (const s of dbData.schools) {
        await client.query(`
          INSERT INTO schools (
            id, name, motto, slug, region, district, suburb, address, map_location,
            lat, lng, tuition_base, bus_fee, lunch_fee, boarding_fee, levels, curriculum,
            boarding_type, gender, fee_band, established, student_teacher_ratio,
            verified, claimed, package_tier, admissions_status, phone, whatsapp, email,
            website, cover_image, banner_type, facilities, description, head_of_school, featured
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            tuition_base = EXCLUDED.tuition_base,
            facilities = EXCLUDED.facilities,
            updated_at = CURRENT_TIMESTAMP;
        `, [
          s.id, s.name, s.motto || '', s.slug, s.region, s.district || '', s.suburb, s.address || '', s.mapLocation || '',
          s.lat || 0, s.lng || 0, s.tuitionBase || 0, s.busFee || 0, s.lunchFee || 0, s.boardingFee || 0,
          JSON.stringify(s.levels || []), JSON.stringify(s.curriculum || []), s.boardingType || 'Day Only',
          s.gender || 'Co-educational', s.feeBand || '', s.established || null, s.studentTeacherRatio || '',
          Boolean(s.verified), Boolean(s.claimed), s.packageTier || 'Standard', s.admissionsStatus || 'Open',
          s.phone || '', s.whatsapp || '', s.email || '', s.website || '', s.coverImage || '', s.bannerType || '',
          JSON.stringify(s.facilities || []), s.description || '', s.headOfSchool || '', Boolean(s.featured)
        ]);
      }
      stats.schools = dbData.schools.length;
    }

    // 4.2 Users
    if (Array.isArray(dbData.users)) {
      for (const u of dbData.users) {
        await client.query(`
          INSERT INTO users (id, email, phone, name, password_hash, role, school_id, avatar, verified)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;
        `, [
          u.id, u.email, u.phone || '', u.name, u.password || 'demo123',
          u.role, u.schoolId || null, u.avatar || '👤', Boolean(u.verified)
        ]);
      }
      stats.users = dbData.users.length;
    }

    // 4.3 Admissions
    if (Array.isArray(dbData.admissionApplications)) {
      for (const a of dbData.admissionApplications) {
        await client.query(`
          INSERT INTO admission_applications (
            id, reference_number, school_id, student_first_name, student_last_name,
            grade_applying, parent_name, parent_email, parent_phone, status, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING;
        `, [
          a.id, a.referenceNumber || a.id, a.schoolId, a.studentFirstName || a.studentName || 'Student',
          a.studentLastName || '', a.gradeApplying || 'Primary', a.parentName || 'Parent',
          a.parentEmail || '', a.parentPhone || '', a.status || 'pending', a.notes || ''
        ]);
      }
      stats.admissionApplications = dbData.admissionApplications.length;
    }

    // 4.4 Invoices
    if (Array.isArray(dbData.invoices)) {
      for (const inv of dbData.invoices) {
        await client.query(`
          INSERT INTO invoices (
            id, invoice_number, school_id, student_name, grade_level, term, academic_year,
            parent_name, parent_email, parent_phone, tuition_amount, total_amount, amount_paid, balance, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO NOTHING;
        `, [
          inv.id, inv.invoiceNumber || inv.id, inv.schoolId, inv.studentName, inv.gradeLevel || '',
          inv.term || 'Term 1', inv.academicYear || '2026/2027', inv.parentName || '', inv.parentEmail || '',
          inv.parentPhone || '', inv.tuitionAmount || 0, inv.totalAmount || inv.amount || 0,
          inv.amountPaid || 0, inv.balance || 0, inv.status || 'unpaid'
        ]);
      }
      stats.invoices = dbData.invoices.length;
    }

    // 4.5 Suppliers
    if (Array.isArray(dbData.suppliers)) {
      for (const sup of dbData.suppliers) {
        await client.query(`
          INSERT INTO suppliers (
            id, company_name, category, contact_person, phone, whatsapp, email, location, region, verified, rating
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING;
        `, [
          sup.id, sup.name || sup.companyName, sup.category, sup.contactPerson || '', sup.phone,
          sup.whatsapp || sup.phone, sup.email || '', sup.location || 'Accra', sup.region || 'Greater Accra',
          Boolean(sup.verified), sup.rating || 5.0
        ]);
      }
      stats.suppliers = dbData.suppliers.length;
    }

    // 4.6 RFQs
    if (Array.isArray(dbData.rfqs)) {
      for (const r of dbData.rfqs) {
        await client.query(`
          INSERT INTO rfqs (id, rfq_number, school_id, title, category, quantity, specifications, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING;
        `, [
          r.id, r.rfqNumber || r.id, r.schoolId, r.title, r.category, r.quantity || 1, r.specifications || '', r.status || 'open'
        ]);
      }
      stats.rfqs = dbData.rfqs.length;
    }

    // 4.7 Jobs
    if (Array.isArray(dbData.jobs)) {
      for (const j of dbData.jobs) {
        await client.query(`
          INSERT INTO jobs (id, school_id, title, subject, level, curriculum, region, salary_range_ghs, description, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING;
        `, [
          j.id, j.schoolId, j.title, j.subject, j.level, j.curriculum, j.region, j.salaryRange || '', j.description || '', j.status || 'active'
        ]);
      }
      stats.jobs = dbData.jobs.length;
    }

    // 4.8 Teachers / Tutors
    if (Array.isArray(dbData.teachers)) {
      for (const t of dbData.teachers) {
        await client.query(`
          INSERT INTO teachers (id, name, subjects, curriculum, levels, teaching_mode, hourly_rate_ghs, region, suburb, phone, whatsapp, bio, rating)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO NOTHING;
        `, [
          t.id, t.name, JSON.stringify(t.subjects || []), JSON.stringify(t.curriculum || []), JSON.stringify(t.levels || []),
          t.teachingMode || 'Hybrid', t.hourlyRateGHS || t.hourlyRate || 80, t.region || 'Greater Accra',
          t.suburb || '', t.phone || '', t.whatsapp || '', t.bio || '', t.rating || 5.0
        ]);
      }
      stats.teachers = dbData.teachers.length;
    }

    // 4.9 Digital Student IDs
    if (Array.isArray(dbData.studentDigitalIDs)) {
      for (const idCard of dbData.studentDigitalIDs) {
        await client.query(`
          INSERT INTO student_digital_ids (
            id, index_number, school_id, student_name, grade_level, house, blood_group, genotype,
            medical_alert, bus_pass_route, bus_pass_status, qr_verification_code, signature_hash, status, expiry_date
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO NOTHING;
        `, [
          idCard.id, idCard.indexNumber, idCard.schoolId, idCard.studentName, idCard.gradeLevel,
          idCard.house || '', idCard.bloodGroup || 'O+', idCard.genotype || 'AA', idCard.medicalAlert || 'None',
          idCard.busPassRoute || '', idCard.busPassStatus || 'active', idCard.qrVerificationCode || idCard.indexNumber,
          idCard.signatureHash || 'sha256-verified', idCard.status || 'active', idCard.expiryDate || '2027-08-31'
        ]);
      }
      stats.studentDigitalIDs = dbData.studentDigitalIDs.length;
    }

    await client.query('COMMIT');
    console.log('✅ PostgreSQL transaction successfully committed!\n');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`❌ Migration transaction failed: ${err.message}`);
    process.exit(1);
  } finally {
    client.release();
  }

  // 5. Final Report
  console.log('================================================================');
  console.log('🎉  Migration Complete! Summary of Records Transferred:');
  console.log('================================================================');
  for (const [table, count] of Object.entries(stats)) {
    console.log(`   ✓ ${table.padEnd(25)} : ${count} records migrated`);
  }
  console.log('================================================================');
  console.log('🚀 SkoolFinder is ready for enterprise multi-server cloud deployment!\n');
  process.exit(0);
}

runMigration().catch(err => {
  console.error('Migration execution error:', err);
  process.exit(1);
});
