-- ============================================================================
-- SKOOLFINDER GHANA — SCHOOL OWNER & PROPRIETOR MASTER BLUEPRINT v2.0
-- CONSOLIDATED PRODUCTION DATABASE MIGRATION (PHASES 1, 2A & 2B)
-- Run this in Supabase SQL Editor: New Query -> Paste & Run
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CORE PLATFORM ANCHOR: SCHOOLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    ownership_type TEXT DEFAULT 'Private' CHECK (ownership_type IN ('Private', 'Public', 'Mission/Faith-based')),
    education_level TEXT[] DEFAULT '{"Primary"}',
    curriculum TEXT[] DEFAULT '{"GES"}',
    region TEXT DEFAULT 'Greater Accra',
    district TEXT DEFAULT 'Accra Metropolitan',
    locality TEXT,
    address TEXT,
    gps_digital_address TEXT,
    gps_coordinates JSONB,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    facilities TEXT[] DEFAULT '{}',
    gender_type TEXT DEFAULT 'Mixed' CHECK (gender_type IN ('Boys', 'Girls', 'Mixed')),
    boarding_type TEXT DEFAULT 'Day' CHECK (boarding_type IN ('Day', 'Boarding', 'Day & Boarding')),
    min_fee NUMERIC(12, 2) DEFAULT 0,
    max_fee NUMERIC(12, 2) DEFAULT 0,
    fee_period TEXT DEFAULT 'Per Term',
    verified BOOLEAN DEFAULT false,
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    claim_status TEXT DEFAULT 'unclaimed' CHECK (claim_status IN ('unclaimed', 'pending', 'claimed')),
    nasia_registered BOOLEAN DEFAULT false,
    nasia_licence_number TEXT,
    featured BOOLEAN DEFAULT false,
    rating NUMERIC(3, 2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schools_slug ON public.schools(slug);
CREATE INDEX IF NOT EXISTS idx_schools_region ON public.schools(region);
CREATE INDEX IF NOT EXISTS idx_schools_verification_status ON public.schools(verification_status);
CREATE INDEX IF NOT EXISTS idx_schools_claim_status ON public.schools(claim_status);

-- ============================================================================
-- PART 1: PHASE 1 — IDENTITY, MEMBERSHIPS, VERIFICATION & PROFILE DRAFTS
-- Packages: SCH-001 through SCH-010, DEC-01
-- ============================================================================

-- 1.1 School Memberships (Seat Quotas, Scoped Staff Roles & Single Primary School DEC-01)
CREATE TABLE IF NOT EXISTS public.school_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'school_admin' CHECK (role IN ('primary_proprietor', 'school_admin', 'admissions_officer', 'bursar', 'recruiter', 'staff')),
    seat_allocated BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'revoked')),
    invite_token VARCHAR(100),
    invite_email VARCHAR(255),
    invited_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_school_user UNIQUE(school_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_school_memberships_school ON public.school_memberships(school_id);
CREATE INDEX IF NOT EXISTS idx_school_memberships_user ON public.school_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_school_memberships_token ON public.school_memberships(invite_token) WHERE invite_token IS NOT NULL;

-- DEC-01: Exactly ONE active primary proprietor per school
CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_primary_proprietor_per_school 
ON public.school_memberships(school_id) 
WHERE role = 'primary_proprietor' AND status = 'active';

-- DEC-01: Exactly ONE primary school per proprietor account at launch
CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_proprietor_single_primary_school 
ON public.school_memberships(user_id) 
WHERE role = 'primary_proprietor' AND status = 'active';


-- 1.2 Verification Cases (Multi-Document Regulatory Approval Workflow SCH-004, SCH-005)
CREATE TABLE IF NOT EXISTS public.verification_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    submitted_by UUID,
    authority_status VARCHAR(30) DEFAULT 'submitted' CHECK (authority_status IN ('draft', 'submitted', 'under_review', 'information_required', 'approved_owner', 'rejected', 'suspended')),
    reviewer_id UUID,
    reviewer_notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_cases_school ON public.verification_cases(school_id);
CREATE INDEX IF NOT EXISTS idx_verification_cases_status ON public.verification_cases(authority_status);


-- 1.3 Evidence Documents (NaSIA License, GES Cert, Registrar General SCH-004)
CREATE TABLE IF NOT EXISTS public.evidence_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_case_id UUID REFERENCES public.verification_cases(id) ON DELETE CASCADE,
    school_id VARCHAR(100) NOT NULL,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('nasia_license', 'ges_cert', 'registrar_general', 'proprietor_id', 'tax_clearance', 'other')),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    document_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'verified', 'rejected')),
    reviewer_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_docs_school ON public.evidence_documents(school_id);
CREATE INDEX IF NOT EXISTS idx_evidence_docs_case ON public.evidence_documents(verification_case_id);


-- 1.4 School Profile Revisions (Draft vs Published Dual-State Pattern SCH-008)
CREATE TABLE IF NOT EXISTS public.school_profile_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    revision_type VARCHAR(20) NOT NULL CHECK (revision_type IN ('draft', 'published', 'archived')),
    version_number INT NOT NULL DEFAULT 1,
    content_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_live BOOLEAN DEFAULT false,
    published_by UUID,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_revisions_lookup ON public.school_profile_revisions(school_id, revision_type);
CREATE INDEX IF NOT EXISTS idx_school_revisions_live ON public.school_profile_revisions(school_id, is_live) WHERE is_live = true;


-- 1.5 School Staff Invitations (Role-Based Access & Seat Tracking SCH-009)
CREATE TABLE IF NOT EXISTS public.school_staff_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'school_admin' CHECK (role IN ('school_admin', 'admissions_officer', 'bursar', 'recruiter', 'staff')),
    invited_by UUID,
    invite_token VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_invites_school ON public.school_staff_invitations(school_id);
CREATE INDEX IF NOT EXISTS idx_staff_invites_token ON public.school_staff_invitations(invite_token);


-- ============================================================================
-- PART 2: PHASE 2A — ADMISSIONS LIFECYCLE, ENQUIRY CRM & COMMERCIAL BILLING
-- Packages: ENQ-001–ENQ-008, ADM-001–ADM-012, SUB-001–SUB-010, DEC-03
-- ============================================================================

-- 2.1 School Intakes & Capacity Allocations (ADM-001, ADM-002)
CREATE TABLE IF NOT EXISTS public.school_intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    name TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    term TEXT NOT NULL DEFAULT 'Term 1 (September)',
    open_date DATE NOT NULL,
    close_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'closed')),
    grades_config JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_intakes_school_id ON public.school_intakes(school_id);
CREATE INDEX IF NOT EXISTS idx_school_intakes_status ON public.school_intakes(status);


-- 2.2 Versioned Admission Form Definitions (ADM-003)
CREATE TABLE IF NOT EXISTS public.admission_form_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    intake_id UUID REFERENCES public.school_intakes(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    title TEXT NOT NULL DEFAULT 'Standard Admission Dossier',
    fields_config JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_defs_school_intake ON public.admission_form_definitions(school_id, intake_id);


-- 2.3 School Enquiries & Direct Leads CRM (ENQ-001, ENQ-002, ENQ-006)
CREATE TABLE IF NOT EXISTS public.school_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    source TEXT NOT NULL DEFAULT 'directory' CHECK (source IN ('directory', 'matchmaker', 'compare', 'profile_direct', 'external')),
    parent_name TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    child_name TEXT,
    child_grade TEXT,
    preferred_entry_year TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'tour_scheduled', 'converted', 'closed')),
    assigned_staff_id UUID,
    assigned_staff_name TEXT,
    follow_up_date TIMESTAMPTZ,
    closure_reason TEXT,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_enquiries_school_id ON public.school_enquiries(school_id);
CREATE INDEX IF NOT EXISTS idx_school_enquiries_status ON public.school_enquiries(status);


-- 2.4 School Enquiry Threaded Messages (ENQ-004)
CREATE TABLE IF NOT EXISTS public.school_enquiry_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES public.school_enquiries(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('parent', 'staff', 'system')),
    sender_id UUID,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    is_internal_note BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiry_messages_enquiry_id ON public.school_enquiry_messages(enquiry_id);


-- 2.5 12-State Candidate Admissions Dossier (ADM-004, ADM-005, ADM-007, DEC-03)
CREATE TABLE IF NOT EXISTS public.school_admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_code TEXT NOT NULL UNIQUE,
    school_id VARCHAR(100) NOT NULL,
    intake_id UUID REFERENCES public.school_intakes(id) ON DELETE SET NULL,
    form_version INT NOT NULL DEFAULT 1,
    student_first_name TEXT NOT NULL,
    student_last_name TEXT NOT NULL,
    student_dob DATE NOT NULL,
    student_gender TEXT NOT NULL,
    applied_grade TEXT NOT NULL,
    parent_guardian_name TEXT NOT NULL,
    parent_guardian_email TEXT NOT NULL,
    parent_guardian_phone TEXT NOT NULL,
    parent_guardian_relationship TEXT NOT NULL DEFAULT 'Parent',
    form_responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN (
        'draft', 'submitted', 'under_review', 'info_requested',
        'assessment_scheduled', 'assessment_completed', 'waitlisted',
        'accepted_offer_made', 'offer_accepted', 'declined_by_parent',
        'enrolled', 'rejected'
    )),
    assessment_date TIMESTAMPTZ,
    assessment_notes TEXT,
    assessment_score NUMERIC(5, 2),
    assessment_passed BOOLEAN,
    offer_date TIMESTAMPTZ,
    offer_letter_url TEXT,
    offer_response_deadline DATE,
    parent_response_date TIMESTAMPTZ,
    parent_decision TEXT CHECK (parent_decision IN ('accepted', 'declined')),
    rejection_reason TEXT,
    enrolment_confirmed_at TIMESTAMPTZ,
    enrolment_confirmed_by UUID,
    assigned_staff_id UUID,
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admissions_school_id ON public.school_admissions(school_id);
CREATE INDEX IF NOT EXISTS idx_admissions_tracking_code ON public.school_admissions(tracking_code);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.school_admissions(status);


-- 2.6 Campus Tour & Assessment Walkthrough Slots (ADM-008)
CREATE TABLE IF NOT EXISTS public.school_tour_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    title TEXT NOT NULL DEFAULT 'Campus Walkthrough & Admissions Q&A',
    slot_date DATE NOT NULL,
    slot_time TEXT NOT NULL DEFAULT '10:00 AM',
    venue TEXT NOT NULL DEFAULT 'Main Academic Block',
    type TEXT NOT NULL DEFAULT 'tour' CHECK (type IN ('tour', 'assessment', 'open_day')),
    capacity INT NOT NULL DEFAULT 15,
    booked_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tour_slots_school_id ON public.school_tour_slots(school_id);


-- 2.7 Tour Bookings Ledger (ADM-008)
CREATE TABLE IF NOT EXISTS public.tour_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id UUID NOT NULL REFERENCES public.school_tour_slots(id) ON DELETE CASCADE,
    school_id VARCHAR(100) NOT NULL,
    parent_name TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    child_name TEXT,
    attendees_count INT NOT NULL DEFAULT 1,
    booking_reference TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended', 'no_show')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tour_bookings_slot ON public.tour_bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_tour_bookings_school ON public.tour_bookings(school_id);


-- 2.8 Platform Subscriptions (Approved GHS Pricing Catalogue SUB-001, SUB-004)
CREATE TABLE IF NOT EXISTS public.platform_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL UNIQUE,
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'growth', 'professional', 'enterprise')),
    billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'annual')),
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'GHS',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'in_grace_period', 'past_due', 'cancelled', 'expired')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    grace_period_end TIMESTAMPTZ,
    paystack_subscription_code TEXT,
    paystack_customer_code TEXT,
    payment_method TEXT NOT NULL DEFAULT 'none' CHECK (payment_method IN ('none', 'momo', 'card', 'bank_transfer', 'admin_override')),
    last_payment_reference TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_school ON public.platform_subscriptions(school_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON public.platform_subscriptions(tier);


-- 2.9 Sequential Subscription Invoices (SUB-009)
CREATE TABLE IF NOT EXISTS public.subscription_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    school_id VARCHAR(100) NOT NULL,
    tier TEXT NOT NULL,
    billing_interval TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GHS',
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
    payment_reference TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_school ON public.subscription_invoices(school_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.subscription_invoices(invoice_number);


-- ============================================================================
-- PART 3: PHASE 2B — INSTITUTIONAL MARKETPLACE (VACANCIES, TENDERS & ESCROW)
-- Packages: VAC-001–VAC-006, TEN-001–TEN-006, ESC-001–ESC-004
-- ============================================================================

-- 3.1 School Vacancies & Teacher Recruiting (VAC-001, VAC-003, VAC-006)
CREATE TABLE IF NOT EXISTS public.school_vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    school_name TEXT,
    title TEXT NOT NULL,
    department TEXT NOT NULL DEFAULT 'Academics',
    level TEXT NOT NULL DEFAULT 'Primary',
    job_type TEXT NOT NULL DEFAULT 'full_time' CHECK (job_type IN ('full_time', 'part_time', 'contract', 'substitute')),
    curriculum TEXT NOT NULL DEFAULT 'GES / NaCCA',
    min_qualification TEXT NOT NULL DEFAULT 'B.Ed',
    min_experience_years INT NOT NULL DEFAULT 1,
    salary_range TEXT DEFAULT 'GH₵ 2,500 - 4,000 / month',
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    location TEXT DEFAULT 'Greater Accra',
    ntc_required BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'closed', 'expired')),
    application_deadline DATE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    is_addon_slot BOOLEAN NOT NULL DEFAULT FALSE,
    addon_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vacancies_school_id ON public.school_vacancies(school_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_status ON public.school_vacancies(status);
CREATE INDEX IF NOT EXISTS idx_vacancies_published_at ON public.school_vacancies(published_at DESC);


-- 3.2 Vacancy Candidate Applications with NTC Licence (VAC-004, VAC-005)
CREATE TABLE IF NOT EXISTS public.vacancy_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vacancy_id UUID NOT NULL REFERENCES public.school_vacancies(id) ON DELETE CASCADE,
    school_id VARCHAR(100) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    ntc_number TEXT,
    ntc_verified BOOLEAN NOT NULL DEFAULT FALSE,
    qualification TEXT NOT NULL,
    years_experience INT NOT NULL DEFAULT 0,
    current_school TEXT,
    cv_url TEXT,
    cover_letter TEXT,
    expected_salary TEXT,
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'interview_scheduled', 'offered', 'rejected')),
    tracking_ref TEXT,
    interview_date TIMESTAMPTZ,
    interview_mode TEXT DEFAULT 'in_person' CHECK (interview_mode IN ('in_person', 'google_meet', 'phone')),
    interview_notes TEXT,
    review_notes TEXT,
    reviewed_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vacancy_apps_vacancy ON public.vacancy_applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_vacancy_apps_school ON public.vacancy_applications(school_id);
CREATE INDEX IF NOT EXISTS idx_vacancy_apps_status ON public.vacancy_applications(status);


-- 3.3 B2B Procurement Tenders (TEN-001, TEN-003, TEN-004)
CREATE TABLE IF NOT EXISTS public.school_tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    school_name TEXT,
    reference_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    specifications TEXT,
    quantity TEXT NOT NULL,
    budget_currency TEXT NOT NULL DEFAULT 'GHS',
    budget_min NUMERIC(12, 2) DEFAULT 0,
    budget_max NUMERIC(12, 2) DEFAULT 0,
    delivery_deadline DATE NOT NULL,
    submission_deadline DATE NOT NULL,
    delivery_location TEXT DEFAULT 'Main Campus Administration Gate',
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'reviewing', 'awarded', 'closed', 'cancelled')),
    awarded_bid_id UUID,
    awarded_supplier_name TEXT,
    awarded_amount NUMERIC(12, 2),
    escrow_status TEXT NOT NULL DEFAULT 'none' CHECK (escrow_status IN ('none', 'pending_deposit', 'deposit_funded', 'goods_delivered', 'fully_disbursed', 'disputed', 'refunded')),
    credit_source TEXT NOT NULL DEFAULT 'monthly_quota' CHECK (credit_source IN ('monthly_quota', 'purchased_credit')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenders_school_id ON public.school_tenders(school_id);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON public.school_tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_submission_deadline ON public.school_tenders(submission_deadline);


-- 3.4 Supplier Tender Bids (TEN-005, TEN-006)
CREATE TABLE IF NOT EXISTS public.tender_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL REFERENCES public.school_tenders(id) ON DELETE CASCADE,
    school_id VARCHAR(100) NOT NULL,
    supplier_id UUID,
    supplier_name TEXT NOT NULL,
    supplier_email TEXT NOT NULL,
    supplier_phone TEXT NOT NULL,
    supplier_rating NUMERIC(3, 1) NOT NULL DEFAULT 4.8,
    quote_amount NUMERIC(12, 2) NOT NULL,
    itemized_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    delivery_days_sla INT NOT NULL DEFAULT 7,
    warranty_terms TEXT DEFAULT '6 Months Manufacturer Guarantee',
    payment_terms TEXT DEFAULT '50% Mobilization / 50% upon Physical Inspection',
    proposal_notes TEXT,
    document_url TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'awarded', 'rejected')),
    awarded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tender_bids_tender ON public.tender_bids(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_bids_school ON public.tender_bids(school_id);
CREATE INDEX IF NOT EXISTS idx_tender_bids_status ON public.tender_bids(status);


-- 3.5 Marketplace Credits Ledger (VAC-002, TEN-002)
CREATE TABLE IF NOT EXISTS public.marketplace_credits_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100) NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('vacancy_slot', 'tender_credit')),
    quantity INT NOT NULL DEFAULT 1,
    amount_paid_ghs NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'momo' CHECK (payment_method IN ('momo', 'card', 'bank_transfer', 'admin_comp')),
    paystack_reference TEXT,
    credits_remaining INT NOT NULL DEFAULT 1,
    expires_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'exhausted', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credits_ledger_school ON public.marketplace_credits_ledger(school_id);
CREATE INDEX IF NOT EXISTS idx_credits_ledger_type_status ON public.marketplace_credits_ledger(item_type, status);


-- 3.6 50/50 MoMo Milestone Escrow Contract (ESC-001, ESC-002, ESC-003)
CREATE TABLE IF NOT EXISTS public.tender_escrow_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL REFERENCES public.school_tenders(id) ON DELETE CASCADE,
    school_id VARCHAR(100) NOT NULL,
    bid_id UUID NOT NULL REFERENCES public.tender_bids(id) ON DELETE CASCADE,
    milestone_index INT NOT NULL CHECK (milestone_index IN (1, 2)),
    milestone_name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    percentage INT NOT NULL DEFAULT 50,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'funded_in_escrow', 'disbursed', 'disputed', 'refunded')),
    funded_at TIMESTAMPTZ,
    disbursed_at TIMESTAMPTZ,
    disbursement_reference TEXT,
    inspection_notes TEXT,
    signed_off_by UUID,
    dispute_reason TEXT,
    disputed_at TIMESTAMPTZ,
    dispute_resolved_at TIMESTAMPTZ,
    dispute_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escrow_tender ON public.tender_escrow_milestones(tender_id);
CREATE INDEX IF NOT EXISTS idx_escrow_school ON public.tender_escrow_milestones(school_id);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON public.tender_escrow_milestones(status);


-- 3.7 Tamper-Evident Marketplace & Escrow Audit Log (ESC-004)
CREATE TABLE IF NOT EXISTS public.marketplace_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id VARCHAR(100),
    actor_id UUID,
    actor_name TEXT NOT NULL DEFAULT 'System / Staff',
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    reference_code TEXT,
    amount NUMERIC(12, 2),
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_audit_school ON public.marketplace_audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_market_audit_created ON public.marketplace_audit_logs(created_at DESC);


-- ============================================================================
-- PART 4: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.school_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profile_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_staff_invitations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.school_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_enquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_tour_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.school_vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancy_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_credits_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_escrow_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_audit_logs ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policy Recreation
DO $$ 
BEGIN
    -- Public Read Policies
    DROP POLICY IF EXISTS "Public read live profile revisions" ON public.school_profile_revisions;
    DROP POLICY IF EXISTS "Public read open intakes" ON public.school_intakes;
    DROP POLICY IF EXISTS "Public read active forms" ON public.admission_form_definitions;
    DROP POLICY IF EXISTS "Public read tour slots" ON public.school_tour_slots;
    DROP POLICY IF EXISTS "Public view published vacancies" ON public.school_vacancies;
    DROP POLICY IF EXISTS "Public view open tenders" ON public.school_tenders;

    -- Public Insert Policies
    DROP POLICY IF EXISTS "Guests submit enquiries" ON public.school_enquiries;
    DROP POLICY IF EXISTS "Parents submit applications" ON public.school_admissions;
    DROP POLICY IF EXISTS "Parents book tour slots" ON public.tour_bookings;
    DROP POLICY IF EXISTS "Candidates submit vacancy applications" ON public.vacancy_applications;
    DROP POLICY IF EXISTS "Suppliers submit bids" ON public.tender_bids;

    -- Staff & Service Role Policies
    DROP POLICY IF EXISTS "Staff manage school memberships" ON public.school_memberships;
    DROP POLICY IF EXISTS "Staff manage profile revisions" ON public.school_profile_revisions;
    DROP POLICY IF EXISTS "Staff manage verification cases" ON public.verification_cases;
    DROP POLICY IF EXISTS "Staff manage evidence docs" ON public.evidence_documents;
    DROP POLICY IF EXISTS "Staff manage invitations" ON public.school_staff_invitations;
    DROP POLICY IF EXISTS "Staff manage school intakes" ON public.school_intakes;
    DROP POLICY IF EXISTS "Staff manage admission forms" ON public.admission_form_definitions;
    DROP POLICY IF EXISTS "Staff manage school enquiries" ON public.school_enquiries;
    DROP POLICY IF EXISTS "Staff manage enquiry messages" ON public.school_enquiry_messages;
    DROP POLICY IF EXISTS "Staff manage admissions" ON public.school_admissions;
    DROP POLICY IF EXISTS "Staff manage tour slots" ON public.school_tour_slots;
    DROP POLICY IF EXISTS "Staff view subscriptions" ON public.platform_subscriptions;
    DROP POLICY IF EXISTS "Staff read invoices" ON public.subscription_invoices;
    DROP POLICY IF EXISTS "Staff manage vacancies" ON public.school_vacancies;
    DROP POLICY IF EXISTS "Staff view vacancy applicants" ON public.vacancy_applications;
    DROP POLICY IF EXISTS "Staff manage tenders" ON public.school_tenders;
    DROP POLICY IF EXISTS "Staff view tender bids" ON public.tender_bids;
    DROP POLICY IF EXISTS "Staff read credits ledger" ON public.marketplace_credits_ledger;
    DROP POLICY IF EXISTS "Staff view escrow milestones" ON public.tender_escrow_milestones;
    DROP POLICY IF EXISTS "Staff view marketplace audit log" ON public.marketplace_audit_logs;
END $$;

-- Public Select Policies
CREATE POLICY "Public read live profile revisions" ON public.school_profile_revisions FOR SELECT USING (is_live = true OR revision_type = 'published');
CREATE POLICY "Public read open intakes" ON public.school_intakes FOR SELECT USING (status = 'open');
CREATE POLICY "Public read active forms" ON public.admission_form_definitions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read tour slots" ON public.school_tour_slots FOR SELECT USING (true);
CREATE POLICY "Public view published vacancies" ON public.school_vacancies FOR SELECT USING (status = 'published');
CREATE POLICY "Public view open tenders" ON public.school_tenders FOR SELECT USING (status IN ('open', 'reviewing'));

-- Public Insert Policies
CREATE POLICY "Guests submit enquiries" ON public.school_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Parents submit applications" ON public.school_admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Parents book tour slots" ON public.tour_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Candidates submit vacancy applications" ON public.vacancy_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Suppliers submit bids" ON public.tender_bids FOR INSERT WITH CHECK (true);

-- Staff Management Policies
CREATE POLICY "Staff manage school memberships" ON public.school_memberships FOR ALL USING (true);
CREATE POLICY "Staff manage profile revisions" ON public.school_profile_revisions FOR ALL USING (true);
CREATE POLICY "Staff manage verification cases" ON public.verification_cases FOR ALL USING (true);
CREATE POLICY "Staff manage evidence docs" ON public.evidence_documents FOR ALL USING (true);
CREATE POLICY "Staff manage invitations" ON public.school_staff_invitations FOR ALL USING (true);
CREATE POLICY "Staff manage school intakes" ON public.school_intakes FOR ALL USING (true);
CREATE POLICY "Staff manage admission forms" ON public.admission_form_definitions FOR ALL USING (true);
CREATE POLICY "Staff manage school enquiries" ON public.school_enquiries FOR ALL USING (true);
CREATE POLICY "Staff manage enquiry messages" ON public.school_enquiry_messages FOR ALL USING (true);
CREATE POLICY "Staff manage admissions" ON public.school_admissions FOR ALL USING (true);
CREATE POLICY "Staff manage tour slots" ON public.school_tour_slots FOR ALL USING (true);
CREATE POLICY "Staff view subscriptions" ON public.platform_subscriptions FOR ALL USING (true);
CREATE POLICY "Staff read invoices" ON public.subscription_invoices FOR SELECT USING (true);
CREATE POLICY "Staff manage vacancies" ON public.school_vacancies FOR ALL USING (true);
CREATE POLICY "Staff view vacancy applicants" ON public.vacancy_applications FOR ALL USING (true);
CREATE POLICY "Staff manage tenders" ON public.school_tenders FOR ALL USING (true);
CREATE POLICY "Staff view tender bids" ON public.tender_bids FOR ALL USING (true);
CREATE POLICY "Staff read credits ledger" ON public.marketplace_credits_ledger FOR SELECT USING (true);
CREATE POLICY "Staff view escrow milestones" ON public.tender_escrow_milestones FOR ALL USING (true);
CREATE POLICY "Staff view marketplace audit log" ON public.marketplace_audit_logs FOR SELECT USING (true);


-- ============================================================================
-- PART 5: CAMPUS PHYSICAL OPERATIONS, MULTI-CAMPUS GROUPS & NATIONAL INTEGRATIONS
-- (Phase 5 School OS & Phase 6 National Regulatory Ecosystem)
-- ============================================================================

-- 5.1 Campus Fixed Assets Registry (Module 19)
CREATE TABLE IF NOT EXISTS public.campus_assets (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General Campus Asset',
    building TEXT NOT NULL DEFAULT 'Main Campus',
    room TEXT NOT NULL DEFAULT 'General Storage',
    purchase_date DATE DEFAULT CURRENT_DATE,
    purchase_value_ghs NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    condition TEXT NOT NULL DEFAULT 'operational' CHECK (condition IN ('operational', 'needs_maintenance', 'decommissioned')),
    assigned_custodian TEXT NOT NULL DEFAULT 'Campus Facilities Manager',
    warranty_expiry DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campus_assets_school ON public.campus_assets(school_id);
CREATE INDEX IF NOT EXISTS idx_campus_assets_condition ON public.campus_assets(condition);

-- 5.2 Library Management System (LMS) Books & Student Loans
CREATE TABLE IF NOT EXISTS public.library_books (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    category TEXT NOT NULL DEFAULT 'General Reading',
    total_copies INTEGER NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
    available_copies INTEGER NOT NULL DEFAULT 1 CHECK (available_copies >= 0),
    shelf_location TEXT NOT NULL DEFAULT 'Main Library',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lib_books_school ON public.library_books(school_id);
CREATE INDEX IF NOT EXISTS idx_lib_books_category ON public.library_books(category);

CREATE TABLE IF NOT EXISTS public.library_loans (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    book_id VARCHAR(100) NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
    borrower_name TEXT NOT NULL,
    borrower_role TEXT NOT NULL DEFAULT 'student' CHECK (borrower_role IN ('student', 'teacher', 'staff')),
    borrower_id TEXT NOT NULL,
    borrowed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    returned_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue', 'lost')),
    return_condition TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lib_loans_school ON public.library_loans(school_id);
CREATE INDEX IF NOT EXISTS idx_lib_loans_status ON public.library_loans(status);

-- 5.3 Campus Transport Fleet & Scheduled GPS Routes
CREATE TABLE IF NOT EXISTS public.transport_fleet (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    plate_number TEXT NOT NULL UNIQUE,
    model TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 30 CHECK (capacity > 0),
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'in_service', 'out_of_service')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transport_fleet_school ON public.transport_fleet(school_id);

CREATE TABLE IF NOT EXISTS public.transport_routes (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    assigned_bus_id VARCHAR(100) REFERENCES public.transport_fleet(id) ON DELETE SET NULL,
    capacity INTEGER NOT NULL DEFAULT 30,
    enrolled_students INTEGER NOT NULL DEFAULT 0,
    stops JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transport_routes_school ON public.transport_routes(school_id);

-- 5.4 Multi-Campus Educational Trust Groups (DEC-02)
CREATE TABLE IF NOT EXISTS public.school_groups (
    id VARCHAR(100) PRIMARY KEY,
    name TEXT NOT NULL,
    headquarters TEXT NOT NULL DEFAULT 'Accra, Ghana',
    proprietor_user_id UUID,
    trust_lead TEXT NOT NULL DEFAULT 'Executive Director',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id VARCHAR(100) NOT NULL REFERENCES public.school_groups(id) ON DELETE CASCADE,
    school_id VARCHAR(100) NOT NULL,
    name TEXT NOT NULL,
    campus_type TEXT NOT NULL DEFAULT 'Main Campus',
    location TEXT NOT NULL DEFAULT 'Accra, Ghana',
    students_count INTEGER NOT NULL DEFAULT 0,
    staff_count INTEGER NOT NULL DEFAULT 0,
    accreditation_status TEXT NOT NULL DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, school_id)
);

CREATE INDEX IF NOT EXISTS idx_group_schools_group ON public.group_schools(group_id);

-- 5.5 National Regulatory Integrations: MoE/GES EMIS Submissions
CREATE TABLE IF NOT EXISTS public.emis_census_submissions (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    school_name TEXT NOT NULL,
    emis_code TEXT NOT NULL,
    district TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'Greater Accra',
    academic_year TEXT NOT NULL,
    reporting_cycle TEXT NOT NULL DEFAULT 'Annual Census',
    submission_status TEXT NOT NULL DEFAULT 'draft' CHECK (submission_status IN ('draft', 'validated', 'verified_and_exported', 'acknowledged')),
    census_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    certification_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emis_submissions_school ON public.emis_census_submissions(school_id);
CREATE INDEX IF NOT EXISTS idx_emis_submissions_year ON public.emis_census_submissions(academic_year);

-- 5.6 WAEC Examination Verifications Archive
CREATE TABLE IF NOT EXISTS public.waec_verification_records (
    id VARCHAR(100) PRIMARY KEY,
    index_number VARCHAR(10) NOT NULL,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('BECE', 'WASSCE', 'NOVDEC')),
    exam_year VARCHAR(4) NOT NULL,
    candidate_name TEXT NOT NULL,
    center_name TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'verified',
    raw_score_aggregate INTEGER NOT NULL DEFAULT 0,
    distinction_grade TEXT,
    subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
    verified_by TEXT NOT NULL DEFAULT 'Admissions Officer',
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waec_verifications_index ON public.waec_verification_records(index_number);
CREATE INDEX IF NOT EXISTS idx_waec_verifications_type_year ON public.waec_verification_records(exam_type, exam_year);

-- 5.7 Omnichannel SMS Gateway Configurations & Dispatch Logs
CREATE TABLE IF NOT EXISTS public.sms_gateway_configurations (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'primary_gateway',
    active_provider TEXT NOT NULL DEFAULT 'hubtel' CHECK (active_provider IN ('hubtel', 'arkesel', 'mock')),
    hubtel_client_id TEXT,
    hubtel_client_secret TEXT,
    hubtel_sender_id VARCHAR(11) NOT NULL DEFAULT 'SKOOLFINDER',
    arkesel_api_key TEXT,
    arkesel_sender_id VARCHAR(11) NOT NULL DEFAULT 'SKOOLFINDER',
    cost_per_sms_ghs NUMERIC(6, 4) NOT NULL DEFAULT 0.0450,
    account_balance_ghs NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sms_dispatch_logs (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100),
    recipient_phone VARCHAR(30) NOT NULL,
    recipient_name TEXT NOT NULL,
    network TEXT,
    units INTEGER NOT NULL DEFAULT 1,
    cost_ghs NUMERIC(8, 4) NOT NULL DEFAULT 0.0450,
    sender_id VARCHAR(11) NOT NULL DEFAULT 'SKOOLFINDER',
    provider TEXT NOT NULL,
    delivery_status TEXT NOT NULL DEFAULT 'delivered' CHECK (delivery_status IN ('delivered', 'pending', 'failed')),
    message TEXT NOT NULL,
    dispatched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_dispatch_school ON public.sms_dispatch_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_sms_dispatch_phone ON public.sms_dispatch_logs(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_sms_dispatch_dispatched ON public.sms_dispatch_logs(dispatched_at DESC);

-- Enable RLS on New Tables
ALTER TABLE public.campus_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emis_census_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waec_verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_gateway_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_dispatch_logs ENABLE ROW LEVEL SECURITY;

-- Allow Staff and Authorized Users Access
CREATE POLICY "Staff manage campus assets" ON public.campus_assets FOR ALL USING (true);
CREATE POLICY "Staff manage library books" ON public.library_books FOR ALL USING (true);
CREATE POLICY "Staff manage library loans" ON public.library_loans FOR ALL USING (true);
CREATE POLICY "Staff manage transport fleet" ON public.transport_fleet FOR ALL USING (true);
CREATE POLICY "Staff manage transport routes" ON public.transport_routes FOR ALL USING (true);
CREATE POLICY "Staff view groups" ON public.school_groups FOR ALL USING (true);
CREATE POLICY "Staff view group schools" ON public.group_schools FOR ALL USING (true);
CREATE POLICY "Staff manage emis submissions" ON public.emis_census_submissions FOR ALL USING (true);
CREATE POLICY "Staff read waec verifications" ON public.waec_verification_records FOR ALL USING (true);
CREATE POLICY "Super admin configure sms" ON public.sms_gateway_configurations FOR ALL USING (true);
CREATE POLICY "Staff view sms dispatch logs" ON public.sms_dispatch_logs FOR ALL USING (true);

