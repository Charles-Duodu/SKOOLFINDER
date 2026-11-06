-- ============================================================================
-- SKOOLFINDER GHANA — PHASE 1: CONSOLIDATED MASTER DATABASE MIGRATION
-- Baseline: Super Admin Master Blueprint v2.0 (52 Approved Decisions)
-- Target: Supabase PostgreSQL 15 Engine
-- Idempotency: Fully safe to run multiple times (CREATE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. POSTGRESQL EXTENSIONS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 2. CORE IDENTITY & USER PROFILES (DEC-001)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'teacher', 'supplier', 'school_admin', 'super_admin')),
    active_persona TEXT NOT NULL DEFAULT 'parent' CHECK (active_persona IN ('parent', 'teacher', 'supplier', 'school_admin', 'super_admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    avatar_url TEXT,
    ghana_card_number TEXT,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    archive_reason TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.portal_enrolments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    portal_type TEXT NOT NULL CHECK (portal_type IN ('parent', 'teacher', 'supplier', 'school_admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, portal_type)
);

-- ----------------------------------------------------------------------------
-- 3. INSTITUTION & MULTI-TENANCY FOUNDATION (DEC-002)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('school', 'supplier', 'group')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organisation_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'manager', 'editor', 'billing', 'member')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organisation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Private',
    curriculum TEXT,
    level TEXT,
    region TEXT DEFAULT 'Greater Accra',
    district TEXT,
    locality TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    tuition_min NUMERIC DEFAULT 0,
    tuition_max NUMERIC DEFAULT 0,
    authority_status TEXT DEFAULT 'unclaimed',
    active_tier TEXT DEFAULT 'free',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status TEXT DEFAULT 'unverified',
    accreditation_number TEXT,
    description TEXT,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    archive_reason TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    campus_name TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'Greater Accra',
    district TEXT,
    locality TEXT,
    is_main_campus BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.school_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('primary_proprietor', 'school_admin', 'admissions_officer', 'finance_officer', 'viewer')),
    permissions JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 4. VERIFICATION DESK & EVIDENCE ARCHITECTURE (DEC-003, POL-021)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    claimant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    claimant_role TEXT NOT NULL DEFAULT 'proprietor',
    claimant_phone TEXT,
    nasia_license_number TEXT,
    ges_circuit_code TEXT,
    rgd_number TEXT,
    evidence_url TEXT,
    statutory_declaration BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS public.verification_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_ref TEXT UNIQUE NOT NULL,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    assigned_officer_id UUID REFERENCES public.profiles(id),
    case_status TEXT NOT NULL DEFAULT 'submitted' CHECK (case_status IN ('submitted', 'in_review', 'escalated', 'approved', 'rejected')),
    risk_tier TEXT NOT NULL DEFAULT 'medium' CHECK (risk_tier IN ('low', 'medium', 'high', 'critical')),
    sla_due_at TIMESTAMPTZ NOT NULL,
    decision_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.evidence_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_case_id UUID REFERENCES public.verification_cases(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('nasia_license', 'ges_certificate', 'rgd_form3', 'board_resolution', 'id_card', 'tax_clearance')),
    storage_path TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type TEXT DEFAULT 'application/pdf',
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. ADMISSIONS CRM & INTAKES ENGINE (DEC-002, MODULE 3.2)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL,
    term TEXT NOT NULL,
    title TEXT NOT NULL,
    open_date DATE,
    close_date DATE,
    capacity INTEGER DEFAULT 100,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.school_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    parent_name TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    child_name TEXT,
    target_grade TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'tour_scheduled', 'converted', 'closed')),
    source TEXT DEFAULT 'directory',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admissions_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_code TEXT UNIQUE NOT NULL,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    intake_id UUID REFERENCES public.school_intakes(id) ON DELETE SET NULL,
    amount_ghs NUMERIC NOT NULL DEFAULT 150.00,
    status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'redeemed', 'expired', 'refunded')),
    redeemed_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. GATE G4 CHILD SAFEGUARDING & TUTORING (DEC-004, DEC-005)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.parent_wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ward_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    current_grade TEXT,
    current_school TEXT,
    special_needs_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tutoring_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref TEXT UNIQUE NOT NULL,
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ward_id UUID NOT NULL REFERENCES public.parent_wards(id) ON DELETE RESTRICT,
    educator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    subject TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'funded_escrow', 'in_progress', 'completed', 'disputed', 'cancelled', 'refunded')),
    agreed_fee_ghs NUMERIC NOT NULL,
    parent_custody_attestation BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. RECRUITMENT & CANDIDATE UNLOCKS (DEC-002, MODULE 2.4)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    experience_years INTEGER DEFAULT 0,
    qualification TEXT,
    ntc_license_number TEXT,
    police_clearance_verified BOOLEAN DEFAULT FALSE,
    safeguarding_d4_cleared BOOLEAN DEFAULT FALSE,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    hourly_rate_ghs NUMERIC DEFAULT 80.00,
    active_tier TEXT DEFAULT 'free',
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    archive_reason TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recruiter_candidate_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    cost_credits INTEGER DEFAULT 1,
    unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. SUPPLIERS & RFQ PROCUREMENT MARKETPLACE (DEC-002, MODULE 2.5)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    location TEXT,
    region TEXT DEFAULT 'Greater Accra',
    is_verified BOOLEAN DEFAULT FALSE,
    rating NUMERIC DEFAULT 5.0,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    archive_reason TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rfqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_number TEXT UNIQUE NOT NULL,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    budget_max NUMERIC,
    deadline DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'evaluating', 'awarded', 'fulfilled', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rfq_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    quote_amount NUMERIC NOT NULL,
    delivery_timeline TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. FINANCE, ESCROW & PAYMENTS (DEC-011, DEC-012, MODULE 4.2)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference TEXT UNIQUE NOT NULL,
    amount_ghs NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GHS',
    channel TEXT NOT NULL DEFAULT 'mobile_money',
    purpose TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    provider TEXT NOT NULL DEFAULT 'paystack',
    provider_reference TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS public.escrow_ledgers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID,
    tender_id UUID,
    payer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    beneficiary_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount_ghs NUMERIC NOT NULL,
    platform_fee_ghs NUMERIC NOT NULL DEFAULT 0.00,
    net_payout_ghs NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'disbursed', 'disputed', 'refunded')),
    disbursed_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_ref TEXT UNIQUE NOT NULL,
    escrow_id UUID REFERENCES public.escrow_ledgers(id) ON DELETE CASCADE,
    initiator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'opened' CHECK (status IN ('opened', 'arbitrating', 'resolved_refund', 'resolved_disburse')),
    arbitrated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ DEFAULT NULL
);

-- ----------------------------------------------------------------------------
-- 10. GOVERNANCE POLICY REGISTRY (DEC-004-7, POL-001 to POL-021)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.governance_policies (
    id TEXT PRIMARY KEY,               -- e.g. 'POL-001', 'POL-004'
    decision_code TEXT NOT NULL,       -- e.g. 'DEC-001'
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    tier TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '2.0.0',
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'UNDER_REVIEW')),
    enforcement_mode TEXT NOT NULL DEFAULT 'STRICT_BLOCK' CHECK (enforcement_mode IN ('STRICT_BLOCK', 'AUDITED_ALLOW')),
    description TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed core governance policies
INSERT INTO public.governance_policies (id, decision_code, name, category, tier, version, status, enforcement_mode, description)
VALUES 
    ('POL-001', 'DEC-001', 'Canonical Platform Identity & Persona Scoping', 'Identity & Access', 'Foundational', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Single authenticated UUID linked to user profile, parent profile, professional profile, and institutional memberships.'),
    ('POL-002', 'DEC-002', 'Multi-Tenant Institutional Data Isolation', 'Tenancy & Privacy', 'Security Critical', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Proprietors access records strictly within verified school institution.'),
    ('POL-003', 'DEC-003', 'Zero Self-Approval & Dual-Control Mandate', 'Governance & Risk', 'High Risk', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Sensitive mutations require two independent authorized officers.'),
    ('POL-004', 'DEC-004', 'Gate G4 Child Safeguarding Hard-Stop', 'Safeguarding', 'Safety Critical', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Unvetted educators strictly blocked from child-facing bookings and direct parent contact.'),
    ('POL-005', 'DEC-005', 'Adult-to-Adult Legal Contracting Mandate', 'Legal & Compliance', 'Safety Critical', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Under Act 560, tutoring agreements executed exclusively between verified adult guardians and providers.'),
    ('POL-006', 'DEC-006', 'Zero Staff Password Visibility', 'Security & IAM', 'Foundational', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Passphrases hashed; never exposed in logs or admin inspection consoles.'),
    ('POL-008', 'DEC-008', 'Ghana Data Protection Act 843 Compliance', 'Data Governance', 'Regulatory', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Enforces statutory registration, SAR requests, and 3-year data retention schedules.'),
    ('POL-011', 'DEC-011', 'Mobile Money Lesson & Tender Escrow Assurance', 'Finance & Payments', 'Financial Integrity', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Funds locked in escrow ledger until delivery sign-off; dual authorization for refunds.'),
    ('POL-012', 'DEC-012', 'Idempotent Financial Event Reconciliation', 'Finance & Payments', 'Financial Integrity', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Paystack webhooks verified via HMAC SHA-512 signatures with deduplication.'),
    ('POL-014', 'DEC-014', 'Tamper-Resistant Cryptographic Audit Trail', 'Compliance & Audit', 'High Assurance', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Append-only ledger with SHA-256 hash chaining guaranteeing non-repudiation.'),
    ('POL-015', 'DEC-015', 'Prohibited Autonomous AI Decision Guardrail', 'AI & Automation', 'High Risk', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'AI Copilot is strictly advisory. AI cannot approve safeguarding, grant roles, or disburse funds.'),
    ('POL-020', 'DEC-020', 'Granular Context-Aware Authorization Guard', 'Security & Authz', 'Foundational', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Evaluates Actor + Action + Resource + Scope + Purpose on server before mutating state.'),
    ('POL-021', 'DEC-021', 'Ephemeral Private Storage & Watermarking', 'Privacy & Storage', 'Security Critical', '2.0.0', 'ACTIVE', 'STRICT_BLOCK', 'Regulatory evidence stored in private buckets with short-lived signed URLs (max 15 mins).')
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    enforcement_mode = EXCLUDED.enforcement_mode,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ----------------------------------------------------------------------------
-- 11. CRYPTOGRAPHIC TAMPER-EVIDENT AUDIT TRAIL (DEC-014, POL-014)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL,
    actor_role TEXT NOT NULL DEFAULT 'super_admin',
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    old_state JSONB DEFAULT NULL,
    new_state JSONB DEFAULT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT DEFAULT '127.0.0.1',
    user_agent TEXT DEFAULT NULL,
    prev_hash TEXT NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
    hash TEXT NOT NULL,
    signature_status TEXT DEFAULT 'cryptographically_verified',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_created ON public.audit_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_hash ON public.audit_events (hash);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events (action);

-- ----------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutoring_bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active verified schools
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schools' AND policyname = 'public_read_active_schools') THEN
        CREATE POLICY "public_read_active_schools" ON public.schools
            FOR SELECT USING (deleted_at IS NULL AND (status = 'published' OR is_verified = TRUE));
    END IF;
END $$;

-- Allow Super Admins complete access to all tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schools' AND policyname = 'super_admin_all_schools') THEN
        CREATE POLICY "super_admin_all_schools" ON public.schools
            FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_events' AND policyname = 'super_admin_all_audit') THEN
        CREATE POLICY "super_admin_all_audit" ON public.audit_events
            FOR SELECT USING (auth.jwt() ->> 'role' = 'super_admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'governance_policies' AND policyname = 'public_read_policies') THEN
        CREATE POLICY "public_read_policies" ON public.governance_policies
            FOR SELECT USING (TRUE);
    END IF;
END $$;

-- Parents only see their own wards
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'parent_wards' AND policyname = 'parents_own_wards') THEN
        CREATE POLICY "parents_own_wards" ON public.parent_wards
            FOR ALL USING (parent_id = auth.uid() OR auth.jwt() ->> 'role' = 'super_admin');
    END IF;
END $$;

SELECT 'SkoolFinder Ghana Phase 1 Consolidated Master Migration Ready' AS migration_status;

