-- ============================================================================
-- SKOOLFINDER GHANA — RELEASE 0 SCHEMA MIGRATION
-- SECURITY HARDENING & PERSISTENCE FOUNDATION
-- Reference: Blueprint v2.0 §12, §13, §26; DEC-007, DEC-014, DEC-021, DEC-026
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PARENT WARDS TABLE (Replaces in-memory userWardsStore)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.parent_wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Prefer not to say')),
    grade_level TEXT NOT NULL, -- e.g. 'Class 4', 'JHS 2', 'Grade 7'
    current_school TEXT,
    curriculum_interest TEXT[] DEFAULT '{"GES"}', -- GES, Cambridge, IB, Montessori
    special_needs_notes TEXT,
    status TEXT NOT NULL DEFAULT 'Registered' CHECK (status IN ('Registered', 'Enrolled', 'Archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parent_wards_parent_id ON public.parent_wards(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_wards_grade ON public.parent_wards(grade_level);

-- ============================================================================
-- 2. PARENT SAVED COMPARISONS TABLE (Replaces in-memory userComparisonsStore)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.parent_saved_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'School Comparison',
    school_ids TEXT[] NOT NULL,
    criteria JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parent_comparisons_user_id ON public.parent_saved_comparisons(user_id);

-- ============================================================================
-- 3. FORMAL TEACHER EMPLOYMENT OFFER LETTERS (Replaces IN_MEMORY_OFFER_LETTERS)
-- DEC-007, VAC-004, VAC-005
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.job_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_number TEXT NOT NULL UNIQUE, -- e.g. OFF-2026-XXXXX
    application_id UUID NOT NULL REFERENCES public.vacancy_applications(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    candidate_name TEXT NOT NULL,
    candidate_email TEXT NOT NULL,
    position_title TEXT NOT NULL,
    department TEXT DEFAULT 'Academics',
    gross_salary_ghs NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GHS',
    contract_type TEXT NOT NULL DEFAULT 'full_time' CHECK (contract_type IN ('full_time', 'part_time', 'contract', 'substitute')),
    term_start_date DATE NOT NULL,
    probation_months INT NOT NULL DEFAULT 3,
    benefits JSONB DEFAULT '["Tier 1 & Tier 2 SSNIT Pension", "Institutional health cover", "Campus lunch allowance"]'::jsonb,
    signatory_name TEXT NOT NULL,
    signatory_role TEXT NOT NULL DEFAULT 'Head of School / HR',
    status TEXT NOT NULL DEFAULT 'pending_candidate_acceptance' CHECK (status IN ('pending_candidate_acceptance', 'accepted', 'declined', 'expired', 'withdrawn')),
    candidate_signature TEXT,
    decline_reason TEXT,
    response_date TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_offers_application ON public.job_offers(application_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_school ON public.job_offers(school_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_status ON public.job_offers(status);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.parent_wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_saved_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Parents manage own wards" ON public.parent_wards;
    DROP POLICY IF EXISTS "Parents manage own comparisons" ON public.parent_saved_comparisons;
    DROP POLICY IF EXISTS "School staff view school job offers" ON public.job_offers;
    DROP POLICY IF EXISTS "Candidates view their own job offers" ON public.job_offers;
END $$;

-- 4.1 Parents manage their own wards
CREATE POLICY "Parents manage own wards" ON public.parent_wards FOR ALL USING (
    parent_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = parent_wards.parent_id AND auth_user_id = auth.uid())
    OR auth.role() = 'service_role'
);

-- 4.2 Parents manage their own saved comparisons
CREATE POLICY "Parents manage own comparisons" ON public.parent_saved_comparisons FOR ALL USING (
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = parent_saved_comparisons.user_id AND auth_user_id = auth.uid())
    OR auth.role() = 'service_role'
);

-- 4.3 School staff manage their issued job offers
CREATE POLICY "School staff view school job offers" ON public.job_offers FOR ALL USING (
    school_id IN (SELECT school_id::uuid FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);

-- 4.4 Candidates view their own job offers by email or application link
CREATE POLICY "Candidates view their own job offers" ON public.job_offers FOR SELECT USING (
    candidate_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR auth.role() = 'service_role'
);

-- ============================================================================
-- 5. SECURE PRIVATE STORAGE BUCKETS SPECIFICATION (DEC-021)
-- ============================================================================
-- Insert private storage bucket definitions if supabase storage extension is active
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('credentials', 'credentials', false),
    ('safeguarding-evidence', 'safeguarding-evidence', false),
    ('resumes-private', 'resumes-private', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Credentials Bucket Policy: Only owner or Super Admin / Service Role can read
DO $$
BEGIN
    DROP POLICY IF EXISTS "Owner read private credentials" ON storage.objects;
    DROP POLICY IF EXISTS "Owner upload private credentials" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Owner read private credentials" ON storage.objects FOR SELECT USING (
    bucket_id IN ('credentials', 'safeguarding-evidence', 'resumes-private')
    AND (auth.uid() = owner OR auth.role() = 'service_role')
);

CREATE POLICY "Owner upload private credentials" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id IN ('credentials', 'safeguarding-evidence', 'resumes-private')
    AND (auth.uid() = owner OR auth.role() = 'service_role')
);
