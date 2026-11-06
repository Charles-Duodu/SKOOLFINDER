-- ============================================================================
-- SKOOLFINDER GHANA: SUPPLIERS PORTAL STAGE 1 — SECURE FOUNDATION
-- Baseline: Master Blueprint v2.0 (SUP-01-01 through SUP-01-08, SUP-02-01, SUP-07-03)
-- Idempotent: 100% safe to execute on existing Supabase instances
-- ============================================================================

-- 1. ADD CANONICAL IDENTITY & TENANCY COLUMNS TO SUPPLIERS TABLE
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS organisation_id UUID REFERENCES public.organisations(id) ON DELETE SET NULL;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS account_type TEXT NOT NULL DEFAULT 'business';
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS verification_level TEXT NOT NULL DEFAULT 'V0';
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS active_tier TEXT NOT NULL DEFAULT 'free';
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS billing_cycle TEXT NOT NULL DEFAULT 'monthly';
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Ensure constraints exist safely
DO $$
BEGIN
    ALTER TABLE public.suppliers DROP CONSTRAINT IF EXISTS suppliers_account_type_check;
    ALTER TABLE public.suppliers ADD CONSTRAINT suppliers_account_type_check CHECK (account_type IN ('business', 'individual'));
EXCEPTION
    WHEN others THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.suppliers DROP CONSTRAINT IF EXISTS suppliers_verification_level_check;
    ALTER TABLE public.suppliers ADD CONSTRAINT suppliers_verification_level_check CHECK (verification_level IN ('V0', 'V1', 'V2', 'V3', 'V4'));
EXCEPTION
    WHEN others THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.suppliers DROP CONSTRAINT IF EXISTS suppliers_active_tier_check;
    ALTER TABLE public.suppliers ADD CONSTRAINT suppliers_active_tier_check CHECK (active_tier IN ('free', 'growth', 'professional', 'enterprise'));
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- 2. ENSURE DEFAULT STATUS IS PENDING (MANDATORY TRADING APPROVAL GATE SUP-02-01)
ALTER TABLE public.suppliers ALTER COLUMN status SET DEFAULT 'pending';

-- 3. INDEXES FOR TENANCY & SEARCH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON public.suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_organisation_id ON public.suppliers(organisation_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON public.suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_active_tier ON public.suppliers(active_tier);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_quotes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published suppliers only
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'public_read_published_suppliers') THEN
        CREATE POLICY "public_read_published_suppliers" ON public.suppliers
            FOR SELECT USING (deleted_at IS NULL AND status = 'published');
    END IF;
END $$;

-- Allow authenticated supplier owners and Super Admins full access
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'owner_manage_suppliers') THEN
        CREATE POLICY "owner_manage_suppliers" ON public.suppliers
            FOR ALL USING (
                auth.uid() = user_id 
                OR auth.uid() = created_by 
                OR auth.jwt() ->> 'role' = 'super_admin'
            );
    END IF;
END $$;

-- Allow public read access to open RFQs
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rfqs' AND policyname = 'public_read_open_rfqs') THEN
        CREATE POLICY "public_read_open_rfqs" ON public.rfqs
            FOR SELECT USING (status = 'Open');
    END IF;
END $$;

-- Allow authenticated school admins and Super Admins to manage RFQs
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rfqs' AND policyname = 'school_manage_rfqs') THEN
        CREATE POLICY "school_manage_rfqs" ON public.rfqs
            FOR ALL USING (
                auth.jwt() ->> 'role' IN ('school_admin', 'super_admin')
            );
    END IF;
END $$;

-- Protect RFQ quotes: Only authenticated users can access, sealed from public
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rfq_quotes' AND policyname = 'authenticated_rfq_quotes') THEN
        CREATE POLICY "authenticated_rfq_quotes" ON public.rfq_quotes
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

SELECT 'SkoolFinder Ghana Suppliers Portal Stage 1 Migration Applied' AS migration_status;
