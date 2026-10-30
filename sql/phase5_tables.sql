-- ========================================================
-- SKOOLFINDER GHANA - PHASE 5 SCHEMA EXTENSION
-- Platform Audit Logging & Regulatory Governance
-- ========================================================

-- 1. AUDIT EVENTS TABLE (Immutable record of administrative decisions)
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    action VARCHAR(100) NOT NULL, -- 'claim_approved', 'claim_rejected', 'school_verified', 'user_suspended', 'subscription_granted'
    target_type VARCHAR(50) NOT NULL, -- 'school', 'teacher', 'supplier', 'user', 'claim'
    target_id VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Re-runnable Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public read audit events" ON public.audit_events;
END $$;

CREATE POLICY "Public read audit events" ON public.audit_events FOR SELECT USING (true);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_target ON public.audit_events(target_type, target_id);
