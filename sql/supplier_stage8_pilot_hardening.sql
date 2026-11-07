-- ====================================================================
-- SkoolFinder Ghana — Suppliers Portal Stage 8: Production Hardening,
-- Controlled Greater Accra Pilot & Operational Handover (SUP-08-01 to SUP-08-08)
-- ====================================================================

-- 1. Pilot Cohort Registry (SUP-08-07)
CREATE TABLE IF NOT EXISTS public.pilot_cohorts (
    id TEXT PRIMARY KEY DEFAULT ('cohort-' || substr(md5(random()::text), 1, 12)),
    name TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'Greater Accra',
    target_schools INT NOT NULL DEFAULT 20,
    target_suppliers INT NOT NULL DEFAULT 40,
    target_individuals INT NOT NULL DEFAULT 10,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Pilot Participants (Schools, Suppliers & Individuals)
CREATE TABLE IF NOT EXISTS public.pilot_participants (
    id TEXT PRIMARY KEY DEFAULT ('part-' || substr(md5(random()::text), 1, 12)),
    cohort_id TEXT REFERENCES public.pilot_cohorts(id) ON DELETE CASCADE,
    participant_type TEXT NOT NULL CHECK (participant_type IN ('school', 'supplier', 'qualified_individual')),
    participant_id TEXT NOT NULL,
    organization_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    onboarding_status TEXT NOT NULL DEFAULT 'active' CHECK (onboarding_status IN ('invited', 'active', 'graduated', 'withdrawn')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Pilot Feedback & Quality Audits
CREATE TABLE IF NOT EXISTS public.pilot_feedback (
    id TEXT PRIMARY KEY DEFAULT ('fb-' || substr(md5(random()::text), 1, 12)),
    cohort_id TEXT REFERENCES public.pilot_cohorts(id) ON DELETE CASCADE,
    participant_id TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('usability', 'speed', 'compliance', 'pricing', 'support', 'other')),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT NOT NULL,
    nps_score INT CHECK (nps_score >= 0 AND nps_score <= 10),
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Operational Incidents & Disaster Recovery Runbook Log (SUP-08-08)
CREATE TABLE IF NOT EXISTS public.sla_incident_runbooks (
    id TEXT PRIMARY KEY DEFAULT ('inc-' || substr(md5(random()::text), 1, 12)),
    severity TEXT NOT NULL CHECK (severity IN ('P1-CRITICAL', 'P2-MAJOR', 'P3-MINOR', 'P4-COSMETIC')),
    component TEXT NOT NULL,
    summary TEXT NOT NULL,
    rto_target_minutes INT NOT NULL DEFAULT 240, -- 4 hours (Master Blueprint §15)
    rpo_target_minutes INT NOT NULL DEFAULT 60,  -- 1 hour
    recovery_procedure TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'resolved' CHECK (status IN ('open', 'mitigated', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE public.pilot_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_incident_runbooks ENABLE ROW LEVEL SECURITY;

-- Super Admin Policies
CREATE POLICY "Super Admins manage pilot cohorts" ON public.pilot_cohorts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "Super Admins manage pilot participants" ON public.pilot_participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
        )
    );

CREATE POLICY "Super Admins view runbooks" ON public.sla_incident_runbooks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
        )
    );

SELECT 'SkoolFinder Ghana Suppliers Portal Stage 8 Migration Applied' AS migration_status;
