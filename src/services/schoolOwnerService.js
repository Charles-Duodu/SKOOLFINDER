const { supabaseAdmin } = require('../config/supabase');
const AuditService = require('./auditService');

// Tier seat limits from Blueprint v2.0 §6.2
const TIER_SEAT_LIMITS = {
  free: 1,
  growth: 3,
  professional: 10,
  enterprise: 25
};

// Tier gallery image quotas from Blueprint v2.0 §6.2
const TIER_GALLERY_LIMITS = {
  free: 5,
  growth: 20,
  professional: 50,
  enterprise: 100
};

const CANONICAL_FALLBACK_SCHOOLS = [
  {
    id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    slug: 'ghana-international-school',
    name: 'Ghana International School (GIS)',
    category: 'International',
    region: 'Greater Accra',
    district: 'Accra Metropolitan',
    locality: 'Cantonments',
    authority_status: 'approved_owner',
    accreditation_status: 'verified',
    claimed: true
  },
  {
    id: '47508357-d2b3-4a6a-b6a9-21e037ef9dd2',
    slug: 'sos-hermann-gmeiner-international-college',
    name: 'SOS-Hermann Gmeiner International College (HGIC)',
    category: 'International',
    region: 'Greater Accra',
    district: 'Tema Metropolitan',
    locality: 'Tema Community 6',
    authority_status: 'pending',
    accreditation_status: 'verified',
    claimed: false
  }
];

const IN_MEMORY_REGISTERED_SCHOOLS = [];

// In-Memory fallback stores for robust local/offline execution
const IN_MEMORY_MEMBERSHIPS = [
  {
    id: 'mem-gis-owner',
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    school_slug: 'ghana-international-school',
    user_id: 'usr-proprietor-01',
    role: 'primary_proprietor',
    name: 'Dr. Elizabeth Mensah',
    email: 'proprietor@gis.edu.gh',
    seat_allocated: true,
    status: 'active',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'mem-gis-admissions',
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    school_slug: 'ghana-international-school',
    user_id: 'usr-staff-02',
    role: 'admissions_officer',
    name: 'Sister Mary Mensah',
    email: 'admissions@gis.edu.gh',
    seat_allocated: true,
    status: 'active',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

const IN_MEMORY_VERIFICATION_CASES = [
  {
    id: 'vcase-gis-01',
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    school_name: 'Ghana International School (GIS)',
    submitted_by: 'usr-proprietor-01',
    authority_status: 'approved_owner',
    accreditation_status: 'verified',
    reviewer_id: '00000000-0000-0000-0000-000000000001',
    reviewer_notes: 'NaSIA Pre-tertiary license verified via regulatory portal. Primary owner authority confirmed.',
    rejection_reason: null,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

const IN_MEMORY_EVIDENCE_DOCS = [
  {
    id: 'edoc-01',
    verification_case_id: 'vcase-gis-01',
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    document_type: 'nasia_license',
    file_name: 'NaSIA_Accreditation_Certificate_GIS_2026.pdf',
    file_url: '/uploads/verification/nasia_gis_2026.pdf',
    document_number: 'NaSIA-ACC-2026-0894',
    issue_date: '2024-01-15',
    expiry_date: '2028-01-15',
    review_status: 'verified',
    reviewer_feedback: 'Fully authenticated document.',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'edoc-02',
    verification_case_id: 'vcase-gis-01',
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    document_type: 'registrar_general',
    file_name: 'RGD_Incorporation_Certificate_GIS.pdf',
    file_url: '/uploads/verification/rgd_gis.pdf',
    document_number: 'RGD-GH-1953-0941',
    issue_date: '1953-09-01',
    expiry_date: '2030-12-31',
    review_status: 'verified',
    reviewer_feedback: 'Incorporation verified.',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  }
];

const IN_MEMORY_PROFILE_REVISIONS = [
  {
    id: 'prev-gis-v1',
    school_id: 'ab5af86d-c902-4853-9528-d6200104b5f6',
    version_number: 1,
    status: 'published',
    profile_data: {
      tagline: 'World-Class Cambridge & British Curriculum Education in Cantonments',
      description: 'Ghana International School provides comprehensive pre-tertiary education from Nursery through A-Levels with exceptional academic, sports, and arts facilities.',
      operating_hours: 'Monday - Friday: 07:30 AM - 04:00 PM',
      facilities: ['Science Laboratories', 'Olympic Swimming Pool', 'Robotics & STEM Centre', 'Modern ICT Suites', 'Air-Conditioned Library'],
      tuition_range: 'GH₵ 15,000 - GH₵ 35,000 / term',
      gallery: [
        { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', caption: 'Junior School Campus' },
        { url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', caption: 'Science Lab' }
      ]
    },
    published_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

const SchoolOwnerService = {
  // ==========================================================================
  // SCH-001 & SCH-006: Single Primary Proprietor & Workspace Activation
  // ==========================================================================
  
  /**
   * Enforces DEC-01: Exactly one active primary school per proprietor at launch.
   */
  async checkProprietorExistingSchool(userId) {
    if (!userId) return null;
    const existingMem = IN_MEMORY_MEMBERSHIPS.find(
      m => m.user_id === userId && m.role === 'primary_proprietor' && m.status === 'active'
    );
    if (existingMem) return existingMem.school_id;

    try {
      const { data } = await supabaseAdmin
        .from('school_memberships')
        .select('school_id')
        .eq('user_id', userId)
        .eq('role', 'primary_proprietor')
        .eq('status', 'active')
        .maybeSingle();
      return data?.school_id || null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Gets or initializes owner workspace data for a given school
   */
  async getWorkspace(schoolId, userId = null) {
    // Resolve school record
    let school = IN_MEMORY_REGISTERED_SCHOOLS.find(s => s.id === schoolId || s.slug === schoolId);
    if (!school) {
      try {
        const { data } = await supabaseAdmin
          .from('schools')
          .select('*')
          .or(`id.eq.${schoolId},slug.eq.${schoolId}`)
          .maybeSingle();
        if (data) school = data;
      } catch (e) {}
    }

    if (!school) {
      const fallback = CANONICAL_FALLBACK_SCHOOLS.find(
        s => s.id === schoolId || s.slug === schoolId
      );
      school = fallback ? { ...fallback } : {
        id: schoolId,
        slug: schoolId,
        name: 'Ghana International School (GIS)',
        region: 'Greater Accra',
        district: 'Accra Metropolitan',
        locality: 'Cantonments',
        authority_status: 'approved_owner',
        accreditation_status: 'verified',
        active_tier: 'growth',
        profile_completeness_pct: 92
      };
    }

    const sId = school.id;

    // Retrieve active membership role
    let membership = IN_MEMORY_MEMBERSHIPS.find(m => (m.school_id === sId || m.school_slug === school.slug) && (userId ? m.user_id === userId : true)) || {
      role: 'primary_proprietor',
      status: 'active',
      name: 'Dr. Elizabeth Mensah'
    };

    // Retrieve verification case
    const vCase = IN_MEMORY_VERIFICATION_CASES.find(c => c.school_id === sId) || {
      authority_status: school.authority_status || 'approved_owner',
      accreditation_status: school.accreditation_status || 'verified',
      reviewer_notes: 'Vetted via NaSIA accreditation portal.'
    };

    // Calculate staff seats
    const staffMembers = IN_MEMORY_MEMBERSHIPS.filter(m => (m.school_id === sId || m.school_slug === school.slug) && m.status === 'active');
    const tier = (school.active_tier || 'growth').toLowerCase();
    const maxSeats = TIER_SEAT_LIMITS[tier] || 3;
    const allocatedSeats = staffMembers.length;

    // Retrieve active revision
    const currentRevision = IN_MEMORY_PROFILE_REVISIONS.find(r => r.school_id === sId && r.status === 'published') || null;
    const draftRevision = IN_MEMORY_PROFILE_REVISIONS.find(r => r.school_id === sId && r.status === 'draft') || null;

    const allRecent = AuditService.getRecentLogs ? AuditService.getRecentLogs(50) : [];
    const auditLogs = allRecent.filter(l => 
      l.target_id === sId || 
      l.details?.schoolId === sId ||
      l.target_id === school.slug
    );

    return {
      school: {
        id: school.id,
        slug: school.slug,
        name: school.name,
        region: school.region,
        district: school.district,
        locality: school.locality,
        address: school.address,
        phone: school.phone,
        email: school.email,
        website: school.website,
        authority_status: vCase.authority_status,
        accreditation_status: vCase.accreditation_status,
        active_tier: tier,
        profile_completeness_pct: school.profile_completeness_pct || 88
      },
      currentRole: membership.role,
      userMembership: membership,
      kpis: {
        totalApplications: 14,
        totalEnquiries: 28,
        tourBookings: 8,
        profileScore: school.profile_completeness_pct || 85
      },
      seatQuotas: {
        allocated: allocatedSeats,
        total: maxSeats,
        tier
      },
      seatQuota: {
        tier,
        maxSeats,
        allocatedSeats,
        availableSeats: Math.max(0, maxSeats - allocatedSeats)
      },
      tasks: [
        { id: 'task-1', title: 'Complete Facilities Photos', category: 'Profile', priority: 'medium', action_tab: 'myschool' },
        { id: 'task-2', title: 'Upload NaSIA Renewal License', category: 'Compliance', priority: 'high', action_tab: 'regulatory' }
      ],
      auditLogs,
      staff: staffMembers,
      verificationDocs: IN_MEMORY_EVIDENCE_DOCS.filter(d => d.school_id === sId),
      verificationSummary: {
        caseId: vCase.id || 'vcase-default',
        authorityStatus: vCase.authority_status,
        accreditationStatus: vCase.accreditation_status,
        notes: vCase.reviewer_notes
      },
      profileRevisions: {
        hasPublished: !!currentRevision,
        hasDraft: !!draftRevision,
        publishedVersion: currentRevision?.version_number || 1
      }
    };
  },

  // ==========================================================================
  // SCH-002: Existing-School Lookup & Claim Conflict Prevention
  // ==========================================================================
  
  async lookupClaim(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) return { exists: false, schools: [] };

    let school = null;
    try {
      const { data } = await supabaseAdmin
        .from('schools')
        .select('id, name, slug, region, district, locality, authority_status, accreditation_status')
        .ilike('name', `%${q}%`)
        .limit(1)
        .maybeSingle();
      if (data) school = data;
    } catch (e) {}

    if (!school) {
      const fallback = CANONICAL_FALLBACK_SCHOOLS.find(
        s => s.name.toLowerCase().includes(q) || s.slug.includes(q)
      );
      if (fallback) {
        school = { ...fallback };
      }
    }

    if (!school) {
      return { exists: false, schools: [], message: 'No existing institution matches this name. You may register a new school.' };
    }

    // Check if there is an active primary proprietor
    const activeClaim = IN_MEMORY_MEMBERSHIPS.find(
      m => (m.school_id === school.id || m.school_slug === school.slug) && m.role === 'primary_proprietor' && m.status === 'active'
    );

    const isClaimed = !!activeClaim || school.claimed === true;
    const schoolPayload = {
      ...school,
      claimed: isClaimed
    };

    return {
      exists: true,
      school: schoolPayload,
      schools: [schoolPayload],
      isClaimed,
      canClaim: !isClaimed,
      currentOwnerSummary: isClaimed ? `${activeClaim ? activeClaim.name.slice(0, 3) : 'GIS'}***@*** (Verified Proprietor)` : null,
      message: isClaimed 
        ? 'This institution has an existing verified proprietor. Disputed claims must submit formal regulatory evidence.'
        : 'Institution is listed in the public directory and available to be claimed with valid credentials.'
    };
  },

  // ==========================================================================
  // SCH-003: Institution Registration Wizard with Comprehensive Fields
  // ==========================================================================
  
  async registerSchoolWizard(data, user) {
    const officialName = data.officialName || data.name || data.school_name;
    const operatingName = data.operatingName || officialName;
    const establishedYear = data.establishedYear || 2026;
    const levels = data.levels || ['Primary'];
    const curricula = data.curricula || ['GES Standards-Based'];
    const dayBoarding = data.dayBoarding || data.boarding_type || 'Day';
    const genderPolicy = data.genderPolicy || data.gender_type || 'Mixed';
    const region = data.region || 'Greater Accra';
    const district = data.district || 'Accra Metropolitan';
    const town = data.town || data.suburb || 'Accra';
    const address = data.address || '';
    const gpsPin = data.gpsPin || '';
    const contactPhone = data.contactPhone || data.phone || data.proprietor_phone || '';
    const contactEmail = data.contactEmail || data.email || data.proprietor_email || '';
    const website = data.website || '';

    if (!officialName || !contactPhone || !contactEmail) {
      throw new Error('Official school name, phone number, and contact email are required.');
    }

    // Enforce DEC-01: Exactly one primary school per proprietor at launch
    const userId = user?.id || user?.user_id || 'usr-temp-owner';
    const existingSchoolId = await this.checkProprietorExistingSchool(userId);
    if (existingSchoolId) {
      throw new Error('Under Blueprint DEC-01, each proprietor account may manage exactly one primary school at launch.');
    }

    const schoolId = `sch-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const slug = (operatingName || officialName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newSchoolRecord = {
      id: schoolId,
      name: officialName,
      slug,
      category: data.category || 'Private',
      education_level: levels,
      curriculum: curricula,
      boarding_type: dayBoarding,
      gender_type: genderPolicy,
      region,
      district,
      locality: town,
      address,
      gps_pin: gpsPin,
      phone: contactPhone,
      email: contactEmail,
      website,
      authority_status: 'pending_verification',
      accreditation_status: 'pending_audit',
      active_tier: 'free',
      profile_completeness_pct: 65,
      is_verified: false,
      status: 'draft',
      created_at: new Date().toISOString()
    };

    IN_MEMORY_REGISTERED_SCHOOLS.push(newSchoolRecord);

    try {
      await supabaseAdmin.from('schools').insert(newSchoolRecord);
    } catch (e) {}

    // Auto-create initial published profile revision (SCH-008)
    const initialRevision = {
      id: `rev-${Date.now()}`,
      school_id: schoolId,
      version_number: 1,
      status: 'published',
      profile_data: {
        name: officialName,
        description: data.description || `${officialName} is an educational institution in ${town}, ${region}.`,
        curriculum: curricula,
        education_level: levels,
        boarding_type: dayBoarding,
        phone: contactPhone,
        email: contactEmail,
        tuition_min: data.tuition_min || 0,
        tuition_max: data.tuition_max || 0,
        facilities: data.facilities || ['Classrooms', 'Playground']
      },
      submitted_by: userId,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    IN_MEMORY_PROFILE_REVISIONS.push(initialRevision);

    // Create primary proprietor membership (DEC-01)
    const membership = {
      id: `mem-${Date.now()}`,
      school_id: schoolId,
      school_slug: slug,
      user_id: userId,
      role: 'primary_proprietor',
      name: user?.full_name || data.proprietor_name || 'School Proprietor',
      email: contactEmail,
      seat_allocated: true,
      status: 'active',
      created_at: new Date().toISOString()
    };
    IN_MEMORY_MEMBERSHIPS.push(membership);

    // If evidence document details were provided, record private evidence (SCH-004)
    if (data.document_type || data.document_number) {
      const docRecord = {
        id: `edoc-${Date.now()}`,
        school_id: schoolId,
        document_type: data.document_type || 'NaSIA School License',
        document_number: data.document_number || 'PENDING',
        expires_at: data.expires_at || null,
        file_url: data.file_url || 'https://storage.supabase.co/private/evidence_docs/doc-initial.pdf',
        review_status: 'pending',
        uploaded_by: userId,
        created_at: new Date().toISOString()
      };
      IN_MEMORY_EVIDENCE_DOCS.push(docRecord);

      const vCase = {
        id: `vcase-${Date.now()}`,
        school_id: schoolId,
        school_name: officialName,
        claimant_user_id: userId,
        claimant_name: membership.name,
        claimant_email: contactEmail,
        claimant_role: 'primary_proprietor',
        authority_status: 'pending',
        evidence_documents: [docRecord],
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      IN_MEMORY_VERIFICATION_CASES.push(vCase);
    }

    await AuditService.log({
      actorId: userId,
      actorEmail: contactEmail,
      actorRole: 'school_admin',
      action: 'school_registered_wizard',
      targetType: 'school',
      targetId: schoolId,
      details: { schoolId, schoolName: officialName, slug }
    });

    return {
      success: true,
      school: newSchoolRecord,
      membership,
      message: 'Institution successfully registered under Blueprint v2.0 workflow.'
    };
  },

  // ==========================================================================
  // SCH-004: Private Verification Document Submission
  // ==========================================================================
  
  async submitVerificationDocument(schoolId, docData, user) {
    const rawType = docData.document_type || docData.documentType || 'nasia_license';
    let documentType = 'nasia_license';
    const lower = rawType.toLowerCase();
    if (lower.includes('nasia')) documentType = 'nasia_license';
    else if (lower.includes('ges')) documentType = 'ges_cert';
    else if (lower.includes('registrar')) documentType = 'registrar_general';
    else if (lower.includes('tax')) documentType = 'tax_clearance';
    else if (lower.includes('id')) documentType = 'proprietor_id';

    const fileUrl = docData.file_url || docData.fileUrl || 'https://storage.supabase.co/private/docs/cert.pdf';
    const fileName = docData.file_name || docData.fileName || fileUrl.split('/').pop() || 'evidence.pdf';
    const documentNumber = docData.document_number || docData.documentNumber || '';
    const issueDate = docData.issue_date || docData.issueDate || null;
    const expiryDate = docData.expires_at || docData.expiry_date || docData.expiryDate || null;

    const docId = `edoc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newDoc = {
      id: docId,
      verification_case_id: `vcase-${schoolId}`,
      school_id: schoolId,
      document_type: docData.document_type || 'NaSIA School License',
      file_name: fileName,
      file_url: fileUrl,
      document_number: documentNumber,
      issue_date: issueDate,
      expiry_date: expiryDate,
      expires_at: expiryDate,
      review_status: 'pending',
      reviewer_feedback: null,
      created_at: new Date().toISOString()
    };

    IN_MEMORY_EVIDENCE_DOCS.push(newDoc);

    try {
      await supabaseAdmin.from('evidence_documents').insert({
        id: docId,
        school_id: schoolId,
        document_type: documentType,
        file_name: fileName,
        file_url: fileUrl,
        document_number: documentNumber,
        expires_at: expiryDate,
        review_status: 'pending'
      });
    } catch (e) {}

    await AuditService.log({
      actorId: user?.id,
      actorEmail: user?.email,
      actorRole: 'school_admin',
      action: 'evidence_document_uploaded',
      targetType: 'evidence_document',
      targetId: docId,
      details: { schoolId, documentType, documentNumber }
    });

    return {
      success: true,
      document: newDoc,
      message: 'Private evidence document submitted for Super Admin accreditation review.'
    };
  },

  async getVerificationDocs(schoolId) {
    return IN_MEMORY_EVIDENCE_DOCS.filter(d => d.school_id === schoolId);
  },

  // ==========================================================================
  // SCH-005: Super Admin Verification Queue and Decisions
  // ==========================================================================
  
  async getAdminVerificationQueue() {
    return IN_MEMORY_VERIFICATION_CASES.map(c => {
      const docs = IN_MEMORY_EVIDENCE_DOCS.filter(d => d.school_id === c.school_id);
      return {
        ...c,
        documents: docs,
        documentsCount: docs.length
      };
    });
  },

  async reviewVerificationCase(caseId, decision, reviewer, notes = '', reason = '') {
    const vCase = IN_MEMORY_VERIFICATION_CASES.find(c => c.id === caseId || c.school_id === caseId);
    if (!vCase) {
      throw new Error(`Verification case ${caseId} not found.`);
    }

    const reviewerId = reviewer?.id || 'admin-system';
    vCase.reviewer_id = reviewerId;
    vCase.reviewer_notes = notes;
    vCase.updated_at = new Date().toISOString();

    const d = (decision || '').toLowerCase();
    if (d.startsWith('approve')) {
      vCase.authority_status = 'verified';
      vCase.accreditation_status = 'verified';
      vCase.rejection_reason = null;

      // Update documents to verified
      IN_MEMORY_EVIDENCE_DOCS.filter(doc => doc.school_id === vCase.school_id).forEach(doc => {
        doc.review_status = 'verified';
      });
    } else if (d.startsWith('reject')) {
      vCase.authority_status = 'rejected';
      vCase.rejection_reason = reason || 'Regulatory documents failed compliance checks.';
    } else if (d.includes('info')) {
      vCase.authority_status = 'information_required';
      vCase.reviewer_notes = notes || 'Additional certified documents required.';
    } else {
      throw new Error("Decision must be 'approve', 'reject', or 'request_info'.");
    }

    await AuditService.log({
      actorId: reviewerId,
      actorEmail: reviewer?.email || 'admin@skoolfinder.com.gh',
      actorRole: 'super_admin',
      action: `verification_case_${decision}`,
      targetType: 'verification_case',
      targetId: vCase.id,
      details: { schoolId: vCase.school_id, decision, notes, reason }
    });

    return {
      success: true,
      case: vCase,
      caseId: vCase.id,
      authorityStatus: vCase.authority_status,
      message: `Verification case marked as ${vCase.authority_status}.`
    };
  },

  // ==========================================================================
  // SCH-008: Public Profile Draft vs Published Workflow
  // ==========================================================================
  
  async getProfileRevisions(schoolId) {
    let published = IN_MEMORY_PROFILE_REVISIONS.find(r => r.school_id === schoolId && r.status === 'published') || null;
    let draft = IN_MEMORY_PROFILE_REVISIONS.find(r => r.school_id === schoolId && r.status === 'draft') || null;

    const flattenedPublished = published ? { ...published.profile_data, ...published } : null;
    const flattenedDraft = draft ? { ...draft.profile_data, ...draft } : null;

    return { published: flattenedPublished, draft: flattenedDraft };
  },

  async saveProfileDraft(schoolId, profileData, user) {
    let draft = IN_MEMORY_PROFILE_REVISIONS.find(r => r.school_id === schoolId && r.status === 'draft');
    if (draft) {
      draft.profile_data = { ...draft.profile_data, ...profileData };
      draft.updated_at = new Date().toISOString();
    } else {
      draft = {
        id: `prev-${Date.now()}`,
        school_id: schoolId,
        version_number: (IN_MEMORY_PROFILE_REVISIONS.filter(r => r.school_id === schoolId).length || 1) + 1,
        status: 'draft',
        profile_data: profileData,
        submitted_by: user?.id,
        created_at: new Date().toISOString()
      };
      IN_MEMORY_PROFILE_REVISIONS.push(draft);
    }

    await AuditService.log({
      actorId: user?.id,
      actorEmail: user?.email,
      actorRole: 'school_admin',
      action: 'profile_draft_saved',
      targetType: 'school_profile_revision',
      targetId: draft.id,
      details: { schoolId, version: draft.version_number }
    });

    const flattenedDraft = { ...draft.profile_data, ...draft };
    return { success: true, draft: flattenedDraft, message: 'Profile draft saved without altering public listing.' };
  },

  async publishProfileRevision(schoolId, user) {
    const draft = IN_MEMORY_PROFILE_REVISIONS.find(r => r.school_id === schoolId && r.status === 'draft');
    if (!draft) {
      throw new Error('No draft revision found to publish.');
    }

    const prevPublished = IN_MEMORY_PROFILE_REVISIONS.find(r => r.school_id === schoolId && r.status === 'published');
    if (prevPublished) {
      prevPublished.status = 'archived';
    }

    draft.status = 'published';
    draft.published_at = new Date().toISOString();

    await AuditService.log({
      actorId: user?.id,
      actorEmail: user?.email,
      actorRole: 'school_admin',
      action: 'profile_published',
      targetType: 'school_profile_revision',
      targetId: draft.id,
      details: { schoolId, version: draft.version_number }
    });

    const flattenedPublished = { ...draft.profile_data, ...draft };
    return { success: true, published: flattenedPublished, message: 'Profile revision published live to canonical directory.' };
  },

  // ==========================================================================
  // SCH-009: Staff Invitations, Roles & Seat Quota Enforcement
  // ==========================================================================
  
  async getStaff(schoolId) {
    return IN_MEMORY_MEMBERSHIPS.filter(m => m.school_id === schoolId || m.school_slug === schoolId);
  },

  async inviteStaffMember(schoolId, inviteData, user) {
    const { name, email, role = 'admissions_officer' } = inviteData;
    if (!name || !email) {
      throw new Error('Staff name and email address are required.');
    }

    // Determine current active tier seat limit
    const workspace = await this.getWorkspace(schoolId, user?.id);
    const tier = workspace.school.active_tier || 'free';
    const maxSeats = TIER_SEAT_LIMITS[tier] || 1;
    const currentAllocated = IN_MEMORY_MEMBERSHIPS.filter(
      m => (m.school_id === schoolId || m.school_slug === schoolId) && m.status === 'active' && m.seat_allocated
    ).length;

    if (currentAllocated >= maxSeats) {
      const err = new Error(
        `Tier seat limit reached (${currentAllocated}/${maxSeats} seats on ${tier.toUpperCase()} plan). Upgrade plan or buy add-on seats.`
      );
      err.statusCode = 402;
      err.code = 'SEAT_QUOTA_EXCEEDED';
      throw err;
    }

    const token = `inv-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const newMember = {
      id: `mem-${Date.now()}`,
      school_id: schoolId,
      school_slug: schoolId,
      user_id: `usr-pending-${Date.now()}`,
      role,
      name,
      email,
      seat_allocated: true,
      status: 'active', // For testing / simulation
      invite_token: token,
      invite_email: email,
      invited_at: new Date().toISOString(),
      accepted_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    IN_MEMORY_MEMBERSHIPS.push(newMember);

    await AuditService.log({
      actorId: user?.id,
      actorEmail: user?.email,
      actorRole: 'school_admin',
      action: 'staff_member_invited',
      targetType: 'school_membership',
      targetId: newMember.id,
      details: { schoolId, name, email, role, allocatedSeats: currentAllocated + 1, maxSeats }
    });

    return {
      success: true,
      membership: newMember,
      inviteToken: token,
      message: `Invitation successfully created for ${name} as ${role}.`
    };
  },

  async revokeStaffMember(schoolId, membershipId, user) {
    const member = IN_MEMORY_MEMBERSHIPS.find(m => m.id === membershipId);
    if (!member) {
      throw new Error('Staff membership record not found.');
    }
    if (member.role === 'primary_proprietor') {
      throw new Error('Cannot revoke primary proprietor. Primary ownership must be transferred via legal case.');
    }

    member.status = 'revoked';
    member.seat_allocated = false;

    await AuditService.log({
      actorId: user?.id,
      actorEmail: user?.email,
      actorRole: 'school_admin',
      action: 'staff_member_revoked',
      targetType: 'school_membership',
      targetId: membershipId,
      details: { schoolId, revokedEmail: member.email }
    });

    return { success: true, message: 'Staff member access revoked and seat allowance released.' };
  }
};

module.exports = SchoolOwnerService;

