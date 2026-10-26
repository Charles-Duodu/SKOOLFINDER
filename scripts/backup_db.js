/**
 * SkoolFinder Ghana - Automated Database Backup & Integrity Engine
 * 
 * Creates timestamped snapshots of data/database.json with SHA-256 integrity checks,
 * record audit telemetry, companion metadata manifests, and automatic backup rotation.
 * 
 * Usage:
 *   node scripts/backup_db.js
 *   npm run backup
 *   node scripts/backup_db.js --restore backups/db_backup_2026-10-25_130000.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'database.json');
const BACKUPS_DIR = path.join(__dirname, '..', 'backups');
const MAX_BACKUPS = parseInt(process.env.MAX_BACKUPS || '30', 10);

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function calculateHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function getFormattedTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${year}-${month}-${day}_${hours}${minutes}${seconds}`;
}

function runBackup() {
  console.log('====================================================');
  console.log('🇬🇭 SkoolFinder Ghana - Enterprise Database Backup');
  console.log('====================================================');

  if (!fs.existsSync(DB_PATH)) {
    console.error(`[ERROR] Database file not found at: ${DB_PATH}`);
    process.exit(1);
  }

  ensureDirectory(BACKUPS_DIR);

  // 1. Read & Validate JSON integrity
  let rawData;
  let parsedDb;
  try {
    rawData = fs.readFileSync(DB_PATH, 'utf8');
    parsedDb = JSON.parse(rawData);
  } catch (err) {
    console.error(`[ERROR] Database corruption detected! JSON failed to parse:`, err.message);
    process.exit(1);
  }

  // 2. Audit Telemetry
  const stats = {
    schools: Array.isArray(parsedDb.schools) ? parsedDb.schools.length : 0,
    suppliers: Array.isArray(parsedDb.suppliers) ? parsedDb.suppliers.length : 0,
    jobListings: Array.isArray(parsedDb.jobListings) ? parsedDb.jobListings.length : 0,
    applications: Array.isArray(parsedDb.applications) ? parsedDb.applications.length : 0,
    invoices: Array.isArray(parsedDb.invoices) ? parsedDb.invoices.length : 0,
    libraryBooks: Array.isArray(parsedDb.libraryBooks) ? parsedDb.libraryBooks.length : 0,
    libraryLoans: Array.isArray(parsedDb.libraryLoans) ? parsedDb.libraryLoans.length : 0,
    digitalIDs: Array.isArray(parsedDb.studentDigitalIDs) ? parsedDb.studentDigitalIDs.length : 0
  };

  const fileSize = fs.statSync(DB_PATH).size;
  const sha256 = calculateHash(DB_PATH);
  const timestamp = getFormattedTimestamp();

  const backupFileName = `db_backup_${timestamp}.json`;
  const backupFilePath = path.join(BACKUPS_DIR, backupFileName);
  const metaFileName = `db_backup_${timestamp}.meta.json`;
  const metaFilePath = path.join(BACKUPS_DIR, metaFileName);

  // 3. Write Backup Snapshot
  fs.writeFileSync(backupFilePath, rawData, 'utf8');

  // 4. Write Metadata Manifest
  const metadata = {
    backupName: backupFileName,
    createdAt: new Date().toISOString(),
    sourceFile: DB_PATH,
    fileSizeBytes: fileSize,
    fileSizeKB: (fileSize / 1024).toFixed(2),
    sha256Checksum: sha256,
    version: '1.0.0',
    platform: 'SkoolFinder Ghana Enterprise',
    recordAudit: stats
  };

  fs.writeFileSync(metaFilePath, JSON.stringify(metadata, null, 2), 'utf8');

  console.log(`[PASS] Backup written to: ${backupFilePath}`);
  console.log(`[PASS] Metadata manifest: ${metaFilePath}`);
  console.log(`[PASS] File Size: ${(fileSize / 1024).toFixed(2)} KB | SHA-256: ${sha256}`);
  console.log(`[AUDIT] Schools: ${stats.schools} | Applications: ${stats.applications} | Invoices: ${stats.invoices}`);
  console.log(`[AUDIT] Library Books: ${stats.libraryBooks} | Loans: ${stats.libraryLoans} | Digital IDs: ${stats.digitalIDs}`);

  // 5. Rotate Old Backups
  rotateBackups();
}

function rotateBackups() {
  try {
    const files = fs.readdirSync(BACKUPS_DIR);
    const backupFiles = files
      .filter(f => f.startsWith('db_backup_') && f.endsWith('.json') && !f.endsWith('.meta.json'))
      .sort()
      .reverse();

    if (backupFiles.length > MAX_BACKUPS) {
      const toDelete = backupFiles.slice(MAX_BACKUPS);
      console.log(`[ROTATION] Pruning ${toDelete.length} old backups exceeding retention limit (${MAX_BACKUPS})...`);

      toDelete.forEach(file => {
        const filePath = path.join(BACKUPS_DIR, file);
        const metaPath = path.join(BACKUPS_DIR, file.replace('.json', '.meta.json'));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);
        console.log(`  - Removed: ${file}`);
      });
    } else {
      console.log(`[ROTATION] Current backup count (${backupFiles.length}) within policy limit (${MAX_BACKUPS}).`);
    }
  } catch (err) {
    console.warn(`[WARNING] Backup rotation warning:`, err.message);
  }
}

function restoreBackup(backupTarget) {
  console.log('====================================================');
  console.log('🇬🇭 SkoolFinder Ghana - Database Restoration');
  console.log('====================================================');

  const resolvedPath = path.isAbsolute(backupTarget) 
    ? backupTarget 
    : path.join(process.cwd(), backupTarget);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`[ERROR] Restoration target file does not exist: ${resolvedPath}`);
    process.exit(1);
  }

  // Verify target is valid JSON
  try {
    const content = fs.readFileSync(resolvedPath, 'utf8');
    JSON.parse(content);
  } catch (err) {
    console.error(`[ERROR] Restoration file corrupted. Aborting.`, err.message);
    process.exit(1);
  }

  // Create pre-restore safety copy of current db
  if (fs.existsSync(DB_PATH)) {
    const safetyCopy = path.join(BACKUPS_DIR, `pre_restore_safety_${getFormattedTimestamp()}.json`);
    fs.copyFileSync(DB_PATH, safetyCopy);
    console.log(`[SAFETY] Pre-restoration backup saved to: ${safetyCopy}`);
  }

  fs.copyFileSync(resolvedPath, DB_PATH);
  console.log(`[PASS] Successfully restored database from: ${resolvedPath}`);
}

// CLI Arg Parsing
const args = process.argv.slice(2);
if (args[0] === '--restore' && args[1]) {
  restoreBackup(args[1]);
} else {
  runBackup();
}
