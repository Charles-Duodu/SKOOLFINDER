-- ============================================================================
-- SKOOLFINDER GHANA — RELEASE 2 SCHEMA MIGRATION
-- EDUCATION PROFESSIONALS ONBOARDING & 5D VETTING ENGINE
-- Reference: Blueprint v2.0 §3, §10, §11, §12, §26; DEC-001, DEC-002, DEC-003, DEC-011, DEC-025 (Gate G4)
-- Packages: PRO-01-001 through PRO-01-010
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENHANCE PROFESSIONAL PROFILES WITH 5-DIMENSIONAL VETTING COLUMNS
-- ============================================================================
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d1_notes TEXT;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d1_verified_at TIMESTAMPTZ;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d1_verified_by UUID REFERENCES public.profiles(id);

ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d2_notes TEXT;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d2_verified_at TIMESTAMPTZ;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d2_verified_by UUID REFERENCES public.profiles(id);

ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d3_notes TEXT;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d3_verified_at TIMESTAMPTZ;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d3_verified_by UUID REFERENCES public.profiles(id);

ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d4_notes TEXT;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d4_verified_at TIMESTAMPTZ;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d4_verified_by UUID REFERENCES public.profiles(id);

ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d5_notes TEXT;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d5_reviewed_at TIMESTAMPTZ;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS d5_reviewed_by UUID REFERENCES public.profiles(id);

ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS onboarding_step INT DEFAULT 1;
ALTER TABLE public.professional_profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- 2. PROFESSIONAL REFEREES TABLE (PRO-01-007)
-- Minimum 2 professional references required for safeguarding verification
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.professional_referees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    referee_name TEXT NOT NULL,
    referee_title TEXT NOT NULL, -- e.g. 'Head of Department', 'Principal', 'Senior Subject Master'
    institution_name TEXT NOT NULL,
    referee_email TEXT NOT NULL,
    referee_phone TEXT NOT NULL,
    relationship TEXT NOT NULL, -- e.g. 'Former Supervisor', 'Department Head', 'Principal'
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'contacted', 'verified', 'unresponsive')),
    verification_notes TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prof_referees_prof_id ON public.professional_referees(professional_id);

-- ============================================================================
-- 3. PROFESSIONAL AVAILABILITY SLOTS TABLE (PRO-01-008, PRO-04)
-- Weekly recurring schedule (1=Mon ... 7=Sun)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.professional_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_format TEXT NOT NULL DEFAULT 'both' CHECK (session_format IN ('in_person', 'online', 'both')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prof_availability_prof_id ON public.professional_availability(professional_id);

-- ============================================================================
-- 4. PROFESSIONAL PAYOUT MOBILE MONEY ACCOUNTS (PRO-01-009)
-- Verified Ghana MoMo payout account matching Ghana Card NIA name
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.professional_payout_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    network TEXT NOT NULL CHECK (network IN ('MTN MoMo', 'Telecel Cash', 'AT Money')),
    account_number TEXT NOT NULL,
    account_name TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prof_payout_prof_id ON public.professional_payout_methods(professional_id);

-- ============================================================================
-- 5. TAMPER-EVIDENT PROFESSIONAL VETTING AUDIT TRAIL (DEC-014, DEC-023)
-- Immutable ledger recording every dimensional status change
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.professional_vetting_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    dimension TEXT NOT NULL CHECK (dimension IN ('D1', 'D2', 'D3', 'D4', 'D5')),
    action TEXT NOT NULL CHECK (action IN ('submitted', 'verified', 'rejected', 'requested_revision')),
    previous_status TEXT,
    new_status TEXT NOT NULL,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_name TEXT NOT NULL DEFAULT 'Admin Review Desk',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vetting_audits_prof_id ON public.professional_vetting_audits(professional_id);
CREATE INDEX IF NOT EXISTS idx_vetting_audits_dimension ON public.professional_vetting_audits(dimension);

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.professional_referees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_payout_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_vetting_audits ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Professionals manage own referees" ON public.professional_referees;
    DROP POLICY IF EXISTS "Professionals manage own availability" ON public.professional_availability;
    DROP POLICY IF EXISTS "Public view active availability" ON public.professional_availability;
    DROP POLICY IF EXISTS "Professionals manage own payout methods" ON public.professional_payout_methods;
    DROP POLICY IF EXISTS "Professionals view own vetting audits" ON public.professional_vetting_audits;
    DROP POLICY IF EXISTS "Admins view all vetting audits" ON public.professional_vetting_audits;
END $$;

-- 6.1 Referees: Professional manages own referees
CREATE POLICY "Professionals manage own referees" ON public.professional_referees FOR ALL USING (
    professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
);

-- 6.2 Availability: Professional manages own availability
CREATE POLICY "Professionals manage own availability" ON public.professional_availability FOR ALL USING (
    professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
);

-- 6.3 Public can view active availability slots for booking
CREATE POLICY "Public view active availability" ON public.professional_availability FOR SELECT USING (
    is_active = true
);

-- 6.4 Payout: Professional manages own payout methods
CREATE POLICY "Professionals manage own payout methods" ON public.professional_payout_methods FOR ALL USING (
    professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
);

-- 6.5 Vetting Audits: Professional views their own vetting audit history
CREATE POLICY "Professionals view own vetting audits" ON public.professional_vetting_audits FOR SELECT USING (
    professional_id IN (SELECT id FROM public.professional_profiles WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
);
