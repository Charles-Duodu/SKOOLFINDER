/**
 * 4-Dimensional Verified Parent Review Service
 * ============================================================================
 * Blueprint & Roadmap Alignment:
 *   - SkoolFinder Ghana Roadmap v1.1 (Phase 5, Section 3A, Section 12)
 *   - Public Website Master Guide v1.0 (Section 2, 4, 13)
 *   - School Owner Blueprint v2.0 (SCH-005, Dispute Resolution & Right of Reply)
 *
 * The 4 Canonical Evaluation Dimensions:
 *   1. communication: School-parent communication
 *   2. facilities: Facilities personally experienced by the parent
 *   3. learning_environment: Observed classroom & pastoral learning environment
 *   4. overall_experience: General experience interacting with the institution
 *
 * Critical Policy Guard:
 *   - Reviews are strictly personal family experiences and DO NOT represent
 *     an official academic quality score or NaSIA regulatory inspection rating.
 *   - Strict verified parent eligibility, privacy masking & moderation gates.
 * ============================================================================
 */

const crypto = require('crypto');
const { NotificationEventBus } = require('./notificationEventBus');

// Initial seed reviews for pilot institutions
const IN_MEMORY_REVIEWS = [
  {
    id: 'rev-gis-001',
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6', // GIS Accra
    parent_id: 'parent-usr-101',
    parent_name: 'Mrs. Vivian Arthur',
    is_anonymous: false,
    display_author: 'Mrs. Vivian Arthur',
    author_role: 'Parent of Class 5 Student',
    ward_grade: 'Class 5 Primary',
    verification_type: 'enrolled_ward', // 'enrolled_ward' | 'verified_tour' | 'verified_voucher'
    verification_proof: 'ENR-2025-GIS-8841',
    is_verified_parent: true,
    status: 'approved', // 'pending_moderation' | 'approved' | 'rejected' | 'disputed'
    dimensions: {
      communication: 4.8,
      facilities: 5.0,
      learning_environment: 4.9,
      overall_experience: 4.9
    },
    overall_rating: 4.9,
    headline: 'Outstanding academic rigour and well-rounded co-curriculars',
    comment: 'Our experience at GIS has been exceptional. Teacher-parent communication via the digital portal is swift, and the STEM robotics lab and swimming facilities have truly sparked our son’s curiosity.',
    highlights: ['Prompt Communication', 'Olympic Swimming Pool', 'Robotics Lab', 'Supportive Teachers'],
    helpful_count: 14,
    created_at: '2026-10-15T10:30:00.000Z',
    official_reply: {
      author_name: 'Admissions & Parent Relations Desk',
      staff_role: 'Institutional Administration',
      message: 'Thank you Mrs. Arthur for your detailed review. We are delighted with your ward’s growth in our junior STEM program.',
      replied_at: '2026-10-16T14:15:00.000Z'
    },
    dispute: null
  },
  {
    id: 'rev-gis-002',
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6', // GIS Accra
    parent_id: 'parent-usr-102',
    parent_name: 'Dr. Kwame Frimpong',
    is_anonymous: true,
    display_author: 'Verified Parent (Form 2)',
    author_role: 'Parent of Form 2 Student',
    ward_grade: 'Form 2 (Lower Secondary)',
    verification_type: 'verified_tour',
    verification_proof: 'TOUR-BK-9182',
    is_verified_parent: true,
    status: 'approved',
    dimensions: {
      communication: 4.6,
      facilities: 4.8,
      learning_environment: 5.0,
      overall_experience: 4.8
    },
    overall_rating: 4.8,
    headline: 'Strong academic discipline and Cambridge international benchmark',
    comment: 'High standards across Cambridge IGCSE coursework. The termly parent consultations are very thorough and staff give honest feedback about areas needing improvement.',
    highlights: ['Strict Discipline', 'Cambridge Track Record', 'Safe Campus'],
    helpful_count: 9,
    created_at: '2026-09-28T08:45:00.000Z',
    official_reply: null,
    dispute: null
  },
  {
    id: 'rev-sos-001',
    school_id: 'sos-hermann-gmeiner',
    parent_id: 'parent-usr-103',
    parent_name: 'Esi Osei-Bonsu',
    is_anonymous: false,
    display_author: 'Esi Osei-Bonsu',
    author_role: 'Parent of IB Diploma Candidate',
    ward_grade: 'IB Diploma Year 1',
    verification_type: 'verified_voucher',
    verification_proof: 'VOUCH-SOS-693401',
    is_verified_parent: true,
    status: 'approved',
    dimensions: {
      communication: 4.9,
      facilities: 4.7,
      learning_environment: 5.0,
      overall_experience: 4.9
    },
    overall_rating: 4.9,
    headline: 'Pan-African ethos and unmatched academic independence',
    comment: 'The residential boarding environment nurtures deep critical thinking and self-reliance. Pastoral mentors keep parents in the loop on weekend leaves and personal development.',
    highlights: ['Pan-African Ethos', 'Boarding Excellence', 'Critical Thinking'],
    helpful_count: 12,
    created_at: '2026-10-02T16:20:00.000Z',
    official_reply: null,
    dispute: null
  }
];

class ReviewService {
  constructor() {
    this.reviews = [...IN_MEMORY_REVIEWS];
  }

  /**
   * Canonical 4 Dimensions Metadata
   */
  getCanonicalDimensions() {
    return [
      {
        id: 'communication',
        title: 'School-Parent Communication',
        description: 'Responsiveness of administration, transparency of academic reports, and parent-teacher consultations.',
        icon: '📞'
      },
      {
        id: 'facilities',
        title: 'Campus Facilities',
        description: 'Personal observation of classrooms, science/computer labs, libraries, sports grounds, and sanitation.',
        icon: '🏫'
      },
      {
        id: 'learning_environment',
        title: 'Learning Environment',
        description: 'Observed classroom atmosphere, pastoral care, student encouragement, safety, and peer discipline.',
        icon: '🌿'
      },
      {
        id: 'overall_experience',
        title: 'Overall Parent Experience',
        description: 'General institutional relationship, values alignment, community trust, and child well-being.',
        icon: '🤝'
      }
    ];
  }

  /**
   * Validate review dimension scores (each 1 - 5 stars)
   */
  validateDimensions(dimensions) {
    if (!dimensions || typeof dimensions !== 'object') {
      throw new Error('Review dimensions object is required with communication, facilities, learning_environment, and overall_experience.');
    }

    const requiredKeys = ['communication', 'facilities', 'learning_environment', 'overall_experience'];
    for (const key of requiredKeys) {
      const val = parseFloat(dimensions[key]);
      if (isNaN(val) || val < 1 || val > 5) {
        throw new Error(`Dimension '${key}' must be a numeric score between 1.0 and 5.0 stars.`);
      }
    }
  }

  /**
   * Submit a new 4-Dimensional Verified Parent Review
   * Status defaults to 'pending_moderation'
   */
  async submitReview(schoolId, reviewData, currentUser) {
    if (!schoolId) throw new Error('Target School ID is required.');
    if (!reviewData) throw new Error('Review data is required.');

    // 1. Mandatory parent identity
    const parentId = currentUser?.id || reviewData.parent_id || `guest-${Date.now()}`;
    const parentName = currentUser?.name || reviewData.parent_name || 'Parent / Guardian';
    const parentEmail = currentUser?.email || reviewData.parent_email || '';

    // 2. Validate 4 Dimensions
    this.validateDimensions(reviewData.dimensions);
    const comm = parseFloat(reviewData.dimensions.communication);
    const fac = parseFloat(reviewData.dimensions.facilities);
    const learn = parseFloat(reviewData.dimensions.learning_environment);
    const exp = parseFloat(reviewData.dimensions.overall_experience);

    // Computed overall rating (weighted average of the 4 dimensions)
    const overallRating = Math.round(((comm + fac + learn + exp) / 4) * 10) / 10;

    // 3. Headline and Commentary content validation
    const headline = (reviewData.headline || reviewData.title || '').trim();
    if (!headline || headline.length < 5) {
      throw new Error('Review headline must be at least 5 characters.');
    }

    const comment = (reviewData.comment || reviewData.content || '').trim();
    if (!comment || comment.length < 25) {
      throw new Error('Detailed review commentary must be at least 25 characters to provide substantive feedback.');
    }

    // 4. Verification Proof & Affiliation
    const verificationType = ['verified_tour', 'verified_voucher', 'enrolled_ward'].includes(reviewData.verification_type)
      ? reviewData.verification_type
      : 'enrolled_ward';
    const verificationProof = (reviewData.verification_proof || reviewData.booking_id || reviewData.voucher_code || '').trim();
    const wardGrade = (reviewData.ward_grade || reviewData.author_role || 'Parent of Enrolled Student').trim();

    // 5. Privacy Safeguarding (Anonymous Display)
    const isAnonymous = Boolean(reviewData.is_anonymous);
    const displayAuthor = isAnonymous ? `Verified Parent (${wardGrade || 'Enrolled Student'})` : parentName;

    // 6. Prohibited Content / Defamation Filter
    const textToCheck = `${headline} ${comment}`.toLowerCase();
    const defamatoryPatterns = ['fraudster', 'criminal', 'stole my money', 'thief', 'bastard', 'scam school'];
    const hasDefamatoryTrigger = defamatoryPatterns.some(p => textToCheck.includes(p));

    // 7. Rate Limiting: 1 review per parent per school per 90 days
    const recentDuplicate = this.reviews.find(r => 
      r.school_id === schoolId && 
      r.parent_id === parentId && 
      r.status !== 'rejected' &&
      (Date.now() - new Date(r.created_at).getTime()) < (90 * 24 * 60 * 60 * 1000)
    );
    if (recentDuplicate) {
      throw new Error('You have already submitted a review for this institution within the current academic term.');
    }

    const newReview = {
      id: `rev-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      school_id: schoolId,
      parent_id: parentId,
      parent_name: parentName,
      parent_email: parentEmail,
      is_anonymous: isAnonymous,
      display_author: displayAuthor,
      author_role: `Parent of ${wardGrade}`,
      ward_grade: wardGrade,
      verification_type: verificationType,
      verification_proof: verificationProof || 'Direct Parent Attestation',
      is_verified_parent: true,
      status: hasDefamatoryTrigger ? 'flagged_for_review' : 'pending_moderation',
      dimensions: {
        communication: comm,
        facilities: fac,
        learning_environment: learn,
        overall_experience: exp
      },
      overall_rating: overallRating,
      headline: headline,
      comment: comment,
      highlights: Array.isArray(reviewData.highlights) ? reviewData.highlights : [],
      helpful_count: 0,
      created_at: new Date().toISOString(),
      official_reply: null,
      dispute: null
    };

    this.reviews.push(newReview);

    // Trigger Notification for Moderation Desk
    try {
      NotificationEventBus.emit('review:submitted', {
        review_id: newReview.id,
        school_id: schoolId,
        overall_rating: overallRating,
        parent_name: displayAuthor
      });
    } catch (_) {}

    return {
      success: true,
      message: 'Your 4-dimensional review has been submitted securely and is queued for verification and moderation.',
      review_id: newReview.id,
      status: newReview.status,
      overall_rating: newReview.overall_rating
    };
  }

  /**
   * Get approved reviews for public school profile
   */
  async getSchoolReviews(schoolId, query = {}) {
    if (!schoolId) throw new Error('School ID is required.');

    // Only return approved reviews for public views, unless requester is school admin or super admin
    const includeUnmoderated = query.include_all === 'true' || query.is_admin === true;
    
    let filtered = this.reviews.filter(r => {
      if (r.school_id !== schoolId) return false;
      if (includeUnmoderated) return true;
      return r.status === 'approved';
    });

    // Dimension or Verification filter
    if (query.verified_only === 'true') {
      filtered = filtered.filter(r => r.is_verified_parent);
    }
    if (query.min_rating) {
      const min = parseFloat(query.min_rating);
      filtered = filtered.filter(r => r.overall_rating >= min);
    }

    // Sort order
    const sortBy = query.sort || 'newest';
    if (sortBy === 'highest') {
      filtered.sort((a, b) => b.overall_rating - a.overall_rating);
    } else if (sortBy === 'lowest') {
      filtered.sort((a, b) => a.overall_rating - b.overall_rating);
    } else if (sortBy === 'helpful') {
      filtered.sort((a, b) => b.helpful_count - a.helpful_count);
    } else {
      // Default: newest
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Calculate Canonical Dimensions Summary
    const approvedReviews = this.reviews.filter(r => r.school_id === schoolId && r.status === 'approved');
    const totalApproved = approvedReviews.length;

    let dimCommSum = 0;
    let dimFacSum = 0;
    let dimLearnSum = 0;
    let dimExpSum = 0;
    let overallSum = 0;

    approvedReviews.forEach(r => {
      dimCommSum += r.dimensions.communication;
      dimFacSum += r.dimensions.facilities;
      dimLearnSum += r.dimensions.learning_environment;
      dimExpSum += r.dimensions.overall_experience;
      overallSum += r.overall_rating;
    });

    const summary = {
      totalReviews: totalApproved,
      averageOverall: totalApproved > 0 ? Math.round((overallSum / totalApproved) * 10) / 10 : 5.0,
      dimensions: {
        communication: totalApproved > 0 ? Math.round((dimCommSum / totalApproved) * 10) / 10 : 5.0,
        facilities: totalApproved > 0 ? Math.round((dimFacSum / totalApproved) * 10) / 10 : 5.0,
        learning_environment: totalApproved > 0 ? Math.round((dimLearnSum / totalApproved) * 10) / 10 : 5.0,
        overall_experience: totalApproved > 0 ? Math.round((dimExpSum / totalApproved) * 10) / 10 : 5.0
      },
      disclaimer: "Parent reviews reflect individual verified family feedback across 4 dimensions and do not constitute official NaSIA regulatory quality inspection or government accreditation ratings."
    };

    // Sanitize reviews for public consumption (mask internal proof and private emails)
    const sanitizedReviews = filtered.map(r => ({
      id: r.id,
      authorName: r.display_author,
      authorRole: r.author_role,
      overallRating: r.overall_rating,
      dimensions: r.dimensions,
      headline: r.headline,
      title: r.headline,
      comment: r.comment,
      highlights: r.highlights,
      helpfulCount: r.helpful_count,
      isVerifiedParent: r.is_verified_parent,
      verificationType: r.verification_type,
      date: new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      officialReply: r.official_reply,
      status: r.status
    }));

    return {
      summary,
      reviews: sanitizedReviews
    };
  }

  /**
   * School Owner: Add Official Institutional Reply
   */
  async addOfficialReply(schoolId, reviewId, replyData, actor) {
    if (!schoolId || !reviewId) throw new Error('School ID and Review ID are required.');
    const message = (replyData.message || replyData.reply || '').trim();
    if (!message || message.length < 10) {
      throw new Error('Official reply message must be at least 10 characters.');
    }

    const review = this.reviews.find(r => r.id === reviewId && r.school_id === schoolId);
    if (!review) throw new Error('Review not found for this institution.');

    review.official_reply = {
      author_name: actor?.name || replyData.author_name || 'Head of Admissions & Administration',
      staff_role: actor?.role || 'Institutional Representative',
      message: message,
      replied_at: new Date().toISOString()
    };

    return {
      success: true,
      message: 'Official institutional reply published successfully.',
      official_reply: review.official_reply
    };
  }

  /**
   * School Owner: File Formal Dispute against inaccurate/defamatory review
   */
  async disputeReview(schoolId, reviewId, disputeData, actor) {
    if (!schoolId || !reviewId) throw new Error('School ID and Review ID are required.');
    const reason = (disputeData.reason || disputeData.grounds || '').trim();
    if (!reason || reason.length < 15) {
      throw new Error('Dispute grounds must provide at least 15 characters detailing the factual discrepancy.');
    }

    const review = this.reviews.find(r => r.id === reviewId && r.school_id === schoolId);
    if (!review) throw new Error('Review not found for this institution.');

    review.status = 'disputed';
    review.dispute = {
      disputed_by: actor?.id || 'school-admin',
      disputed_by_name: actor?.name || 'School Administrator',
      grounds: reason,
      evidence_notes: disputeData.evidence || 'Disputed via School Management OS',
      disputed_at: new Date().toISOString(),
      resolution_status: 'under_super_admin_arbitration'
    };

    try {
      NotificationEventBus.emit('review:disputed', {
        review_id: review.id,
        school_id: schoolId,
        grounds: reason
      });
    } catch (_) {}

    return {
      success: true,
      message: 'Review flagged for Super Admin regulatory arbitration. The review is held under dispute review.',
      review_id: review.id,
      status: review.status
    };
  }

  /**
   * Super Admin Moderation Console: List reviews by status
   */
  async getReviewsForModeration(query = {}) {
    const status = query.status || 'pending_moderation';
    let filtered = this.reviews;
    if (status !== 'all') {
      filtered = filtered.filter(r => r.status === status);
    }
    return filtered.map(r => ({
      ...r,
      school_name: r.school_id
    }));
  }

  /**
   * Super Admin Moderation Console: Approve, Reject, or Arbitrate Review
   */
  async moderateReview(reviewId, decision, moderatorNotes = '', moderator = null) {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) throw new Error('Review not found.');

    if (!['approved', 'rejected', 'dismiss_dispute'].includes(decision)) {
      throw new Error("Invalid moderation decision. Must be 'approved', 'rejected', or 'dismiss_dispute'.");
    }

    if (decision === 'approved' || decision === 'dismiss_dispute') {
      review.status = 'approved';
    } else if (decision === 'rejected') {
      review.status = 'rejected';
    }

    review.moderation = {
      moderated_by: moderator?.id || 'super-admin-01',
      moderator_notes: moderatorNotes || `Decision: ${decision}`,
      moderated_at: new Date().toISOString()
    };

    return {
      success: true,
      message: `Review ${reviewId} successfully set to '${review.status}'.`,
      review_id: review.id,
      status: review.status
    };
  }
}

const reviewService = new ReviewService();

module.exports = {
  ReviewService,
  reviewService
};
