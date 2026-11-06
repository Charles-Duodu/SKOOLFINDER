-- ============================================================================
-- SKOOLFINDER GHANA — RELEASE 4 SCHEMA MIGRATION
-- SAFEGUARDED TUTORING & MUTUAL BOOKING ENGINE (MILESTONES M07, M08, M09)
-- Blueprint Reference: v2.0 §14, §15, §16, §24, §26; DEC-004, DEC-005, DEC-010, DEC-025
-- ============================================================================

-- 0. ENSURE PARENT WARDS TABLE EXISTS (PREREQUISITE FOR WARD LINKING)
CREATE TABLE IF NOT EXISTS public.parent_wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Prefer not to say')),
    grade_level TEXT NOT NULL,
    current_school TEXT,
    curriculum_interest TEXT[] DEFAULT '{"GES"}',
    special_needs_notes TEXT,
    status TEXT NOT NULL DEFAULT 'Registered' CHECK (status IN ('Registered', 'Enrolled', 'Archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parent_wards_parent_id ON public.parent_wards(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_wards_grade ON public.parent_wards(grade_level);

-- 1. TUTORING BOOKINGS TABLE (8-STATE BOOKING MACHINE DEC-010 & GATE G4 SAFEGUARDING)
CREATE TABLE IF NOT EXISTS public.tutoring_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT NOT NULL UNIQUE, -- e.g. TUT-2026-XXXXXX
    parent_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT,
    ward_id UUID REFERENCES public.parent_wards(id) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    student_grade TEXT NOT NULL,
    professional_id TEXT NOT NULL, -- references professional_profiles.id or teachers.id
    teacher_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    curriculum TEXT NOT NULL DEFAULT 'GES',
    session_type TEXT NOT NULL DEFAULT 'in_person' CHECK (session_type IN ('in_person', 'online', 'hybrid')),
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 80.00,
    sessions_count INT NOT NULL DEFAULT 1,
    total_amount_ghs NUMERIC(10, 2) NOT NULL DEFAULT 80.00,
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'consultation_requested' CHECK (
        status IN (
            'consultation_requested',
            'consultation_scheduled',
            'lesson_agreement_drafted',
            'escrow_funded',
            'session_confirmed',
            'session_conducted',
            'parent_signoff',
            'disbursed',
            'disputed',
            'cancelled'
        )
    ),
    escrow_status TEXT NOT NULL DEFAULT 'unfunded' CHECK (
        escrow_status IN ('unfunded', 'funded', 'held_in_escrow', 'disbursed', 'refunded', 'disputed')
    ),
    guardian_consent_verified BOOLEAN NOT NULL DEFAULT TRUE,
    safeguarding_notice TEXT NOT NULL DEFAULT 'All educational sessions operate under Gate G4 Safeguarding: Adult-to-Adult contracting between Guardian and Educator. Direct minor booking is prohibited.',
    meeting_link TEXT,
    meeting_location TEXT,
    completion_notes TEXT,
    parent_rating INT CHECK (parent_rating BETWEEN 1 AND 5),
    parent_feedback TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tutoring_bookings_parent ON public.tutoring_bookings(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_tutoring_bookings_prof ON public.tutoring_bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_tutoring_bookings_status ON public.tutoring_bookings(status);
CREATE INDEX IF NOT EXISTS idx_tutoring_bookings_ref ON public.tutoring_bookings(booking_reference);

-- 2. ENSURE PROFESSIONAL AVAILABILITY TABLE EXISTS (M09, AVA-01 to AVA-04)
CREATE TABLE IF NOT EXISTS public.professional_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id TEXT NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_format TEXT NOT NULL DEFAULT 'both' CHECK (session_format IN ('in_person', 'online', 'both')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prof_availability_prof ON public.professional_availability(professional_id);
CREATE INDEX IF NOT EXISTS idx_prof_availability_day ON public.professional_availability(day_of_week);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.tutoring_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Parents manage own tutoring bookings" ON public.tutoring_bookings;
    DROP POLICY IF EXISTS "Educators manage assigned tutoring bookings" ON public.tutoring_bookings;
    DROP POLICY IF EXISTS "Public can view active educator availability" ON public.professional_availability;
    DROP POLICY IF EXISTS "Educators manage own availability slots" ON public.professional_availability;
END $$;

-- Parents view and manage their own tutoring bookings
CREATE POLICY "Parents manage own tutoring bookings" ON public.tutoring_bookings
    FOR ALL USING (
        auth.uid() = parent_user_id
    );

-- Educators view and manage bookings assigned to them
CREATE POLICY "Educators manage assigned tutoring bookings" ON public.tutoring_bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.professional_profiles pp
            WHERE (pp.id::text = tutoring_bookings.professional_id::text OR pp.user_id::text = tutoring_bookings.professional_id::text)
              AND pp.user_id = auth.uid()
        )
    );

-- Public can view active educator availability
CREATE POLICY "Public can view active educator availability" ON public.professional_availability
    FOR SELECT USING (is_active = true);

-- Educators can manage their own availability
CREATE POLICY "Educators manage own availability slots" ON public.professional_availability
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.professional_profiles pp
            WHERE pp.id::text = professional_availability.professional_id::text
              AND pp.user_id = auth.uid()
        )
    );

