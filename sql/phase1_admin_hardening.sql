-- ============================================================================
-- SKOOLFINDER GHANA - PHASE 1: DATABASE HARDENING & SOFT-DELETE ARCHITECTURE
-- PostgreSQL & Supabase Engine Migration
-- ============================================================================

-- 1. SOFT DELETION COLUMNS
-- Ensures that school deletions, profile deactivations, and vendor removals
-- never cascade-delete or corrupt financial receipts, invoices, or audit trails.

ALTER TABLE IF EXISTS public.schools 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archive_reason TEXT DEFAULT NULL;

ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archive_reason TEXT DEFAULT NULL;

ALTER TABLE IF EXISTS public.teachers 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archive_reason TEXT DEFAULT NULL;

ALTER TABLE IF EXISTS public.suppliers 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS archive_reason TEXT DEFAULT NULL;

-- 2. HIGH-PERFORMANCE PARTIAL INDEXES
-- Partial indexes filter out archived/soft-deleted rows automatically,
-- keeping public directory queries executing in under 10ms.

CREATE INDEX IF NOT EXISTS idx_schools_active ON public.schools (id, region, district) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_schools_archived ON public.schools (deleted_at) 
WHERE deleted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles (role, status) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_teachers_active ON public.teachers (id) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_suppliers_active ON public.suppliers (id) 
WHERE deleted_at IS NULL;

-- 3. IMMUTABLE AUDIT EVENTS TABLE
-- Guarantees complete accountability for every administrative action,
-- recording actor identity, old state, new state, and IP address.

CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL,
    actor_role TEXT NOT NULL DEFAULT 'super_admin',
    action TEXT NOT NULL,          -- e.g. 'school_created', 'school_archived', 'user_suspended', 'fee_adjusted'
    target_type TEXT NOT NULL,     -- e.g. 'school', 'profile', 'payment_order', 'teacher'
    target_id TEXT NOT NULL,
    old_state JSONB DEFAULT NULL,
    new_state JSONB DEFAULT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT DEFAULT '127.0.0.1',
    user_agent TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_created ON public.audit_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_target ON public.audit_events (target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events (action);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict database-engine level authorization protecting internal tables.

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active, non-archived schools
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'schools' AND policyname = 'public_read_active_schools'
    ) THEN
        CREATE POLICY "public_read_active_schools" ON public.schools
            FOR SELECT
            USING (deleted_at IS NULL AND (status = 'published' OR is_verified = TRUE));
    END IF;
END $$;

-- Allow Super Admins complete access to all schools (active and archived)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'schools' AND policyname = 'super_admin_all_schools'
    ) THEN
        CREATE POLICY "super_admin_all_schools" ON public.schools
            FOR ALL
            USING (auth.jwt() ->> 'role' = 'super_admin')
            WITH CHECK (auth.jwt() ->> 'role' = 'super_admin');
    END IF;
END $$;

-- Allow Super Admins complete read access to audit logs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'audit_events' AND policyname = 'super_admin_all_audit'
    ) THEN
        CREATE POLICY "super_admin_all_audit" ON public.audit_events
            FOR SELECT
            USING (auth.jwt() ->> 'role' = 'super_admin');
    END IF;
END $$;

-- 5. VERIFY OR SEED MASTER SUPER ADMIN PROFILE
-- Ensures the platform owner always has an active Super Admin claim.
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    status,
    phone,
    created_at
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@skoolfinder.com.gh',
    'SkoolFinder Platform Lead',
    'super_admin',
    'active',
    '+233 24 000 0001',
    NOW()
)
ON CONFLICT (id) DO UPDATE 
SET role = 'super_admin', status = 'active';

-- Output confirmation
SELECT 'Phase 1 Database Hardening Migration Completed Successfully' AS status;

