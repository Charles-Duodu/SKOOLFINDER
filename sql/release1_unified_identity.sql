-- ============================================================================
-- SKOOLFINDER GHANA — RELEASE 1 SCHEMA MIGRATION
-- UNIFIED IDENTITY & MULTI-PERSONA EXTENSION ARCHITECTURE
-- Reference: Blueprint v2.0 §3, §10, §11, §26; DEC-001, DEC-002, DEC-011
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENHANCE CANONICAL PROFILES TABLE
-- ============================================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_persona TEXT DEFAULT 'parent';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ghana_card_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================================================
-- 2. PARENT PROFILES EXTENSION
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.parent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    default_region TEXT DEFAULT 'Greater Accra',
    phone_verified BOOLEAN DEFAULT FALSE,
    whatsapp_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    preferences JSONB DEFAULT '{"curricula": ["GES"], "max_budget": null}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parent_profiles_user ON public.parent_profiles(user_id);

-- ============================================================================
-- 3. PROFESSIONAL PROFILES EXTENSION (Teachers & Education Professionals)
-- Covers DEC-001, DEC-002, DEC-003, DEC-011
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    headline TEXT DEFAULT 'Senior Educational Specialist',
    bio TEXT DEFAULT '',
    professional_category TEXT DEFAULT 'Academic Teacher', -- Academic, Specialist/SEN, STEM/Robotics, Arts/Music, Early Years, Consultant
    subjects TEXT[] DEFAULT '{}',
    levels TEXT[] DEFAULT '{}',
    curricula TEXT[] DEFAULT '{"GES"}',
    service_formats TEXT[] DEFAULT '{"Both"}', -- 'In-Person', 'Online', 'Both'
    service_regions TEXT[] DEFAULT '{"Greater Accra"}',
    service_suburbs TEXT[] DEFAULT '{}',
    hourly_rate NUMERIC(10, 2) DEFAULT 80.00,
    currency TEXT DEFAULT 'GHS',
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'plus', 'business')),
    active_dashboard_view TEXT NOT NULL DEFAULT 'both' CHECK (active_dashboard_view IN ('career', 'services', 'both')),
    recruiter_search_opt_in BOOLEAN DEFAULT TRUE,
    ntc_number TEXT,
    ntc_verified BOOLEAN DEFAULT FALSE,
    ghana_card_number TEXT,
    ghana_card_verified BOOLEAN DEFAULT FALSE,
    safeguarding_verified BOOLEAN DEFAULT FALSE,
    d1_identity_status TEXT DEFAULT 'pending' CHECK (d1_identity_status IN ('pending', 'verified', 'rejected')),
    d2_qualifications_status TEXT DEFAULT 'pending' CHECK (d2_qualifications_status IN ('pending', 'verified', 'rejected')),
    d3_licence_status TEXT DEFAULT 'pending' CHECK (d3_licence_status IN ('pending', 'verified', 'rejected')),
    d4_child_facing_status TEXT DEFAULT 'pending' CHECK (d4_child_facing_status IN ('pending', 'verified', 'rejected')),
    d5_profile_status TEXT DEFAULT 'draft' CHECK (d5_profile_status IN ('draft', 'published', 'archived', 'suspended')),
    rating NUMERIC(3, 2) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    experience_years INT DEFAULT 1,
    qualification TEXT DEFAULT 'B.Ed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_professional_profiles_user ON public.professional_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_tier ON public.professional_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_d5 ON public.professional_profiles(d5_profile_status);

-- ============================================================================
-- 4. ENSURE PORTAL ENROLMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portal_enrolments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    portal_type TEXT NOT NULL CHECK (portal_type IN ('parent', 'teacher', 'supplier', 'school_admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, portal_type)
);

CREATE INDEX IF NOT EXISTS idx_portal_enrolments_user ON public.portal_enrolments(user_id);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_enrolments ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users manage own parent profile" ON public.parent_profiles;
    DROP POLICY IF EXISTS "Users manage own professional profile" ON public.professional_profiles;
    DROP POLICY IF EXISTS "Public view published professional profiles" ON public.professional_profiles;
    DROP POLICY IF EXISTS "Users view own portal enrolments" ON public.portal_enrolments;
END $$;

-- 5.1 Parent Profiles: User can read/write their own
CREATE POLICY "Users manage own parent profile" ON public.parent_profiles FOR ALL USING (
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = parent_profiles.user_id AND auth_user_id = auth.uid())
    OR auth.role() = 'service_role'
);

-- 5.2 Professional Profiles: User can manage their own
CREATE POLICY "Users manage own professional profile" ON public.professional_profiles FOR ALL USING (
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = professional_profiles.user_id AND auth_user_id = auth.uid())
    OR auth.role() = 'service_role'
);

-- 5.3 Public can view published professional profiles
CREATE POLICY "Public view published professional profiles" ON public.professional_profiles FOR SELECT USING (
    d5_profile_status = 'published'
);

-- 5.4 Portal Enrolments: User can manage their own enrolments
CREATE POLICY "Users view own portal enrolments" ON public.portal_enrolments FOR ALL USING (
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = portal_enrolments.user_id AND auth_user_id = auth.uid())
    OR auth.role() = 'service_role'
);
