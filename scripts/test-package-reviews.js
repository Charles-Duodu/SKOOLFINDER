/**
 * Automated Verification Suite for 4-Dimensional Verified Parent Review Intake
 * ============================================================================
 * Blueprint & Roadmap Alignment:
 *   - SkoolFinder Ghana Roadmap v1.1 (Phase 5, Section 3A, Section 12)
 *   - Public Website Master Guide v1.0 (Section 2, 4, 13)
 *   - School Owner Blueprint v2.0 (SCH-005, Dispute Resolution & Right of Reply)
 *
 * 4 Canonical Dimensions Tested:
 *   1. communication: School-parent communication
 *   2. facilities: Facilities personally experienced by the parent
 *   3. learning_environment: Observed classroom & pastoral learning environment
 *   4. overall_experience: General experience interacting with the institution
 * ============================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { ReviewService, reviewService } = require('../src/services/reviewService');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${totalTests}. ${name}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${totalTests}. ${name}: ${err.message}`);
    throw err;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${totalTests}. ${name}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${totalTests}. ${name}: ${err.message}`);
    throw err;
  }
}

async function runReviewTests() {
  console.log('\n========================================================================');
  console.log('🚀 RUNNING 4-DIMENSIONAL VERIFIED PARENT REVIEW INTAKE VERIFICATION');
  console.log('========================================================================\n');

  // Test 1: Canonical 4 Dimensions
  test('ReviewService defines the exact 4 Canonical Dimensions required by Roadmap v1.1', () => {
    const s = new ReviewService();
    const dims = s.getCanonicalDimensions();
    assert.strictEqual(dims.length, 4, 'Must define exactly 4 dimensions');
    const ids = dims.map(d => d.id);
    assert.ok(ids.includes('communication'), 'Must include communication');
    assert.ok(ids.includes('facilities'), 'Must include facilities');
    assert.ok(ids.includes('learning_environment'), 'Must include learning_environment');
    assert.ok(ids.includes('overall_experience'), 'Must include overall_experience');
  });

  // Test 2: Validation of Dimension Scores
  test('Dimension score validator enforces 1.0 - 5.0 numeric rating on all 4 keys', () => {
    const s = new ReviewService();
    // Valid
    assert.doesNotThrow(() => {
      s.validateDimensions({
        communication: 4.5,
        facilities: 5.0,
        learning_environment: 4.0,
        overall_experience: 4.8
      });
    });

    // Invalid: out of range
    assert.throws(() => {
      s.validateDimensions({
        communication: 6.0,
        facilities: 5.0,
        learning_environment: 4.0,
        overall_experience: 4.8
      });
    }, /Dimension 'communication'/);

    // Invalid: missing key
    assert.throws(() => {
      s.validateDimensions({
        communication: 4.0,
        facilities: 4.0,
        learning_environment: 4.0
      });
    }, /Dimension 'overall_experience'/);
  });

  // Test 3: Review Submission & Weighted Average Calculation
  await runAsyncTest('Review intake calculates 4-dimension average rating & sets pending_moderation status', async () => {
    const s = new ReviewService();
    const result = await s.submitReview('sch-test-gis', {
      parent_name: 'Mr. Kwame Darko',
      parent_email: 'kwame.darko@example.com',
      headline: 'Impressive STEM program and caring homeroom educators',
      comment: 'Our daughter has blossomed since joining Class 3. The teacher feedback is regular and the robotics club is world-class.',
      dimensions: {
        communication: 4.0,
        facilities: 5.0,
        learning_environment: 5.0,
        overall_experience: 4.0
      },
      verification_type: 'enrolled_ward',
      ward_grade: 'Primary Class 3'
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.status, 'pending_moderation');
    assert.strictEqual(result.overall_rating, 4.5, 'Average of (4+5+5+4)/4 must equal 4.5');
  });

  // Test 4: Privacy Safeguarding (Anonymous Parent Toggle)
  await runAsyncTest('Privacy safeguard anonymizes public display name while preserving audit identity', async () => {
    const s = new ReviewService();
    const result = await s.submitReview('sch-test-gis', {
      parent_name: 'Mrs. Secret Parent',
      parent_email: 'secret@example.com',
      is_anonymous: true,
      headline: 'Excellent facilities and responsive leadership team',
      comment: 'We have observed noticeable growth in mathematics confidence and sportsmanship. Communication from administration is timely.',
      dimensions: {
        communication: 5.0,
        facilities: 5.0,
        learning_environment: 5.0,
        overall_experience: 5.0
      },
      verification_type: 'verified_tour',
      ward_grade: 'JHS 2'
    });

    const stored = s.reviews.find(r => r.id === result.review_id);
    assert.ok(stored, 'Review must be stored');
    assert.strictEqual(stored.is_anonymous, true);
    assert.strictEqual(stored.display_author, 'Verified Parent (JHS 2)', 'Display author must be anonymized');
    assert.strictEqual(stored.parent_name, 'Mrs. Secret Parent', 'Audit name must be preserved internally');
  });

  // Test 5: Moderation Gate (Pending reviews are NOT visible on public profile)
  await runAsyncTest('Pending and unmoderated reviews are held back from public endpoint', async () => {
    const s = new ReviewService();
    const result = await s.submitReview('sch-pilot-alpha', {
      parent_name: 'Unverified Submitter',
      headline: 'Awaiting moderation review headline sample',
      comment: 'This is a genuine comment about campus life and school-parent communication transparency.',
      dimensions: {
        communication: 4.0,
        facilities: 4.0,
        learning_environment: 4.0,
        overall_experience: 4.0
      },
      ward_grade: 'Class 1'
    });

    const publicView = await s.getSchoolReviews('sch-pilot-alpha');
    const match = publicView.reviews.find(r => r.id === result.review_id);
    assert.strictEqual(match, undefined, 'Pending review must NOT appear on public school profile');
  });

  // Test 6: Super Admin Moderation Console (Approval Workflow)
  await runAsyncTest('Super Admin can list pending reviews and approve review for publication', async () => {
    const s = new ReviewService();
    const submission = await s.submitReview('sch-pilot-alpha', {
      parent_name: 'Mrs. Akosua Mensah',
      headline: 'Exceptional learning environment and caring teachers',
      comment: 'Class sizes are small and the teachers give personalized attention to every student.',
      dimensions: {
        communication: 5.0,
        facilities: 4.0,
        learning_environment: 5.0,
        overall_experience: 5.0
      },
      ward_grade: 'KG 2'
    });

    // List pending
    const pendingList = await s.getReviewsForModeration({ status: 'pending_moderation' });
    const inPending = pendingList.find(r => r.id === submission.review_id);
    assert.ok(inPending, 'Review must appear in admin pending queue');

    // Approve
    const modResult = await s.moderateReview(submission.review_id, 'approved', 'Verified parent enrollment confirmed', { id: 'admin-01' });
    assert.strictEqual(modResult.status, 'approved');

    // Check public appearance
    const publicView = await s.getSchoolReviews('sch-pilot-alpha');
    const approvedMatch = publicView.reviews.find(r => r.id === submission.review_id);
    assert.ok(approvedMatch, 'Approved review must now appear on public school profile');
    assert.strictEqual(approvedMatch.headline, 'Exceptional learning environment and caring teachers');
  });

  // Test 7: Public Summary with 4-Dimension Averages & Legal Disclaimer
  await runAsyncTest('getSchoolReviews computes canonical 4-dimension averages and mandatory legal disclaimer', async () => {
    const s = new ReviewService();
    const schoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6'; // GIS Accra
    const result = await s.getSchoolReviews(schoolId);

    assert.ok(result.summary, 'Summary must exist');
    assert.strictEqual(typeof result.summary.averageOverall, 'number');
    assert.ok(result.summary.dimensions, 'Dimensions breakdown must exist');
    assert.ok(result.summary.dimensions.communication >= 1.0);
    assert.ok(result.summary.dimensions.facilities >= 1.0);
    assert.ok(result.summary.dimensions.learning_environment >= 1.0);
    assert.ok(result.summary.dimensions.overall_experience >= 1.0);

    // Legal disclaimer guard (Roadmap v1.1 Phase 5)
    assert.ok(result.summary.disclaimer.includes('do not constitute official NaSIA regulatory quality inspection'), 'Disclaimer must clarify independence from NaSIA accreditation');
  });

  // Test 8: School Owner Official Institutional Reply
  await runAsyncTest('School Owner can publish an official institutional reply on a review', async () => {
    const s = new ReviewService();
    const reviewId = 'rev-gis-002';
    const schoolId = 'ab5af86d-c902-4853-9528-d6200104b5f6';

    const replyResult = await s.addOfficialReply(schoolId, reviewId, {
      message: 'Thank you for your commendation of our Cambridge curriculum standards and termly consultations.'
    }, { name: 'Principal Desk', role: 'Head of School' });

    assert.strictEqual(replyResult.success, true);
    assert.ok(replyResult.official_reply);

    const publicView = await s.getSchoolReviews(schoolId);
    const updatedRev = publicView.reviews.find(r => r.id === reviewId);
    assert.ok(updatedRev.officialReply, 'Official reply must be attached and visible publicly');
    assert.strictEqual(updatedRev.officialReply.author_name, 'Principal Desk');
  });

  // Test 9: School Owner Dispute & Right of Appeal
  await runAsyncTest('School Owner can formally dispute an inaccurate review for Super Admin arbitration', async () => {
    const s = new ReviewService();
    const reviewId = 'rev-sos-001';
    const schoolId = 'sos-hermann-gmeiner';

    const disputeResult = await s.disputeReview(schoolId, reviewId, {
      reason: 'The ward referenced was never enrolled in the senior boarding house indicated in this review.'
    }, { id: 'bursar-01', name: 'Registrar SOS-HGIC' });

    assert.strictEqual(disputeResult.success, true);
    assert.strictEqual(disputeResult.status, 'disputed');

    const targetReview = s.reviews.find(r => r.id === reviewId);
    assert.strictEqual(targetReview.status, 'disputed');
    assert.strictEqual(targetReview.dispute.resolution_status, 'under_super_admin_arbitration');
  });

  // Test 10: Express Routes in src/routes/schools.js
  test('src/routes/schools.js wires GET, POST, reply, and dispute review routes', () => {
    const code = fs.readFileSync(path.join(__dirname, '../src/routes/schools.js'), 'utf8');
    assert.ok(code.includes("router.get('/:id/reviews'"), 'Must define GET /:id/reviews');
    assert.ok(code.includes("router.post('/:id/reviews'"), 'Must define POST /:id/reviews');
    assert.ok(code.includes("router.post('/:id/reviews/:reviewId/reply'"), 'Must define POST /:id/reviews/:reviewId/reply');
    assert.ok(code.includes("router.post('/:id/reviews/:reviewId/dispute'"), 'Must define POST /:id/reviews/:reviewId/dispute');
  });

  // Test 11: Express Routes in src/routes/admin.js
  test('src/routes/admin.js wires Super Admin review moderation endpoints', () => {
    const code = fs.readFileSync(path.join(__dirname, '../src/routes/admin.js'), 'utf8');
    assert.ok(code.includes("router.get('/reviews'"), 'Must define GET /api/admin/reviews');
    assert.ok(code.includes("router.patch('/reviews/:id/moderation'"), 'Must define PATCH /api/admin/reviews/:id/moderation');
  });

  // Test 12: Client API client methods in public/js/api.js
  test('public/js/api.js implements all review intake, reply, dispute and moderation methods', () => {
    const code = fs.readFileSync(path.join(__dirname, '../public/js/api.js'), 'utf8');
    assert.ok(code.includes('getSchoolReviews(schoolId'), 'API must have getSchoolReviews');
    assert.ok(code.includes('submitSchoolReview(schoolId'), 'API must have submitSchoolReview');
    assert.ok(code.includes('replySchoolReview(schoolId'), 'API must have replySchoolReview');
    assert.ok(code.includes('disputeSchoolReview(schoolId'), 'API must have disputeSchoolReview');
    assert.ok(code.includes('getAdminPendingReviews('), 'API must have getAdminPendingReviews');
    assert.ok(code.includes('moderateReview('), 'API must have moderateReview');
  });

  // Test 13: Client Modal Intake in public/js/components/modals.js
  test('public/js/components/modals.js openWriteReviewModal captures 4 canonical dimensions & engagement proof', () => {
    const code = fs.readFileSync(path.join(__dirname, '../public/js/components/modals.js'), 'utf8');
    assert.ok(code.includes('rev-dim-communication'), 'Modal must have Communication dimension input');
    assert.ok(code.includes('rev-dim-facilities'), 'Modal must have Facilities dimension input');
    assert.ok(code.includes('rev-dim-learning'), 'Modal must have Learning Environment dimension input');
    assert.ok(code.includes('rev-dim-experience'), 'Modal must have Overall Experience dimension input');
    assert.ok(code.includes('rev-verification-type'), 'Modal must have verification proof type selector');
    assert.ok(code.includes('rev-is-anonymous'), 'Modal must have anonymous privacy toggle');
  });

  // Test 14: Client Detail View in public/js/views/schoolDetailView.js
  test('public/js/views/schoolDetailView.js visualizes 4 dimensions & mandatory NaSIA independence disclaimer', () => {
    const code = fs.readFileSync(path.join(__dirname, '../public/js/views/schoolDetailView.js'), 'utf8');
    assert.ok(code.includes('dim-score-communication'), 'Detail view must render communication score');
    assert.ok(code.includes('dim-score-facilities'), 'Detail view must render facilities score');
    assert.ok(code.includes('dim-score-learning'), 'Detail view must render learning environment score');
    assert.ok(code.includes('dim-score-experience'), 'Detail view must render overall experience score');
    assert.ok(code.includes('Independent Parent Feedback Notice'), 'Detail view must render regulatory disclaimer banner');
  });

  // Test 15: Cache Buster in public/index.html
  test('public/index.html incremented to ?v=76+ across all scripts', () => {
    const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
    assert.ok(/\/js\/api\.js\?v=(7[6-9]|[8-9][0-9])/.test(html), 'api.js must have ?v=76+');
    assert.ok(/\/js\/components\/modals\.js\?v=(7[6-9]|[8-9][0-9])/.test(html), 'modals.js must have ?v=76+');
    assert.ok(/\/js\/views\/schoolDetailView\.js\?v=(7[6-9]|[8-9][0-9])/.test(html), 'schoolDetailView.js must have ?v=76+');
  });

  console.log('\n========================================================================');
  console.log(`🎉 ALL ${passedTests} / ${totalTests} 4-DIMENSIONAL REVIEW TESTS PASSED SUCCESSFULLY!`);
  console.log('========================================================================\n');
}

runReviewTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

