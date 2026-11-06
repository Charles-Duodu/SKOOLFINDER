-- ============================================================================
-- SKOOLFINDER GHANA — RELEASE 3 SCHEMA MIGRATION
-- UNIFIED RECRUITMENT & TALENT MARKETPLACE (MILESTONES M05 & M06)
-- Blueprint Reference: v2.0 §12, §13, §23, §26.4; DEC-007, REC-01 through REC-04
-- ============================================================================

-- 1. ENHANCE VACANCY APPLICATIONS WITH POINT-IN-TIME IMMUTABLE SNAPSHOT (DEC-007)
DO $$
BEGIN
    -- Add snapshot_data JSONB column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'vacancy_applications' 
          AND column_name = 'snapshot_data'
    ) THEN
        ALTER TABLE public.vacancy_applications ADD COLUMN snapshot_data JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Add applicant_user_id foreign key if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'vacancy_applications' 
          AND column_name = 'applicant_user_id'
    ) THEN
        ALTER TABLE public.vacancy_applications ADD COLUMN applicant_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;

    -- Add withdrawn_at timestamp if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'vacancy_applications' 
          AND column_name = 'withdrawn_at'
    ) THEN
        ALTER TABLE public.vacancy_applications ADD COLUMN withdrawn_at TIMESTAMPTZ;
    END IF;

    -- Add tracking_ref column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'vacancy_applications' 
          AND column_name = 'tracking_ref'
    ) THEN
        ALTER TABLE public.vacancy_applications ADD COLUMN tracking_ref TEXT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_vacancy_apps_applicant_user ON public.vacancy_applications(applicant_user_id);
CREATE INDEX IF NOT EXISTS idx_vacancy_apps_tracking_ref ON public.vacancy_applications(tracking_ref);

-- 2. RECRUITER CANDIDATE UNLOCKS (REC-01 to REC-04)
-- Tracks which school institution has unlocked the unmasked contact information of an educator
CREATE TABLE IF NOT EXISTS public.recruiter_candidate_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    professional_id TEXT, -- references professional_profiles.id or user_id
    recruiter_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist even if table was created in an earlier partial schema
ALTER TABLE public.recruiter_candidate_unlocks ADD COLUMN IF NOT EXISTS professional_id TEXT;
ALTER TABLE public.recruiter_candidate_unlocks ADD COLUMN IF NOT EXISTS recruiter_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.recruiter_candidate_unlocks ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMPTZ DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS idx_recruiter_unlocks_school_prof ON public.recruiter_candidate_unlocks(school_id, professional_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_unlocks_school ON public.recruiter_candidate_unlocks(school_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_unlocks_prof ON public.recruiter_candidate_unlocks(professional_id);

-- 3. ENSURE JOB OFFERS TABLE PERSISTENCE (DEC-026)
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

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.vacancy_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_candidate_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Educators view own applications" ON public.vacancy_applications;
    DROP POLICY IF EXISTS "Schools view applications for own vacancies" ON public.vacancy_applications;
    DROP POLICY IF EXISTS "Public can submit vacancy application" ON public.vacancy_applications;
    DROP POLICY IF EXISTS "Schools manage own candidate unlocks" ON public.recruiter_candidate_unlocks;
    DROP POLICY IF EXISTS "School staff view school job offers" ON public.job_offers;
    DROP POLICY IF EXISTS "Candidates view their own job offers" ON public.job_offers;
END $$;

-- Educators can view their own submitted applications
CREATE POLICY "Educators view own applications" ON public.vacancy_applications
    FOR SELECT USING (
        auth.uid() = applicant_user_id
    );

-- School owners/administrators can view applications submitted to their vacancies
CREATE POLICY "Schools view applications for own vacancies" ON public.vacancy_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.school_memberships sm
            WHERE sm.school_id::text = vacancy_applications.school_id::text
              AND sm.user_id = auth.uid()
              AND sm.role IN ('owner', 'admin', 'principal', 'school_admin', 'primary_proprietor', 'recruiter')
        )
    );

-- Anyone authenticated or guest can submit an application dossier
CREATE POLICY "Public can submit vacancy application" ON public.vacancy_applications
    FOR INSERT WITH CHECK (true);

-- Schools manage their own candidate unlocks
CREATE POLICY "Schools manage own candidate unlocks" ON public.recruiter_candidate_unlocks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.school_memberships sm
            WHERE sm.school_id::text = recruiter_candidate_unlocks.school_id::text
              AND sm.user_id = auth.uid()
              AND sm.role IN ('owner', 'admin', 'principal', 'school_admin', 'primary_proprietor', 'recruiter')
        )
    );

-- School staff can view & issue job offers
CREATE POLICY "School staff view school job offers" ON public.job_offers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.school_memberships sm
            WHERE sm.school_id::text = job_offers.school_id::text
              AND sm.user_id = auth.uid()
              AND sm.role IN ('owner', 'admin', 'principal', 'school_admin', 'primary_proprietor', 'recruiter')
        )
    );

-- Candidates can view their own job offers
CREATE POLICY "Candidates view their own job offers" ON public.job_offers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.vacancy_applications va
            WHERE va.id::text = job_offers.application_id::text
              AND va.applicant_user_id::text = auth.uid()::text
        )
    );

