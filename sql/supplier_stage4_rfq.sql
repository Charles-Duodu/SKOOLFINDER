-- ============================================================================
-- SKOOLFINDER GHANA: SUPPLIERS PORTAL STAGE 4 — RFQ PROCUREMENT & QUOTING
-- Baseline: Master Blueprint v2.0 (SUP-02-05, SUP-03-06, SUP-04-01, SUP-04-02, SUP-04-03)
-- 100% Idempotent: Safe to execute on existing Supabase instances
-- ============================================================================

-- 1. ADDITIVE COLUMNS ON rfq_quotes (SUP-04-01, SUP-04-03)
ALTER TABLE public.rfq_quotes ADD COLUMN IF NOT EXISTS revision_count INT DEFAULT 0;
ALTER TABLE public.rfq_quotes ADD COLUMN IF NOT EXISTS is_direct_invitation BOOLEAN DEFAULT false;
ALTER TABLE public.rfq_quotes ADD COLUMN IF NOT EXISTS delivery_days INT DEFAULT 5;
ALTER TABLE public.rfq_quotes ADD COLUMN IF NOT EXISTS warranty_terms TEXT DEFAULT 'Standard 6 Months';
ALTER TABLE public.rfq_quotes ADD COLUMN IF NOT EXISTS payment_terms TEXT DEFAULT 'Direct Settlement on Delivery';

-- 2. TARGETED MULTI-SUPPLIER RFQ INVITATIONS TABLE (SUP-02-05, SUP-04-03)
CREATE TABLE IF NOT EXISTS public.rfq_targeted_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id VARCHAR(80) NOT NULL,
    school_id TEXT,
    supplier_id VARCHAR(80) NOT NULL,
    invitation_notes TEXT,
    status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'quoted')),
    is_direct_invitation BOOLEAN NOT NULL DEFAULT true, -- Directly invited responses bypass open-market quotas
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rfq_invitations_rfq ON public.rfq_targeted_invitations(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rfq_invitations_supplier ON public.rfq_targeted_invitations(supplier_id);
CREATE INDEX IF NOT EXISTS idx_rfq_invitations_school ON public.rfq_targeted_invitations(school_id);

-- 3. IMMUTABLE QUOTE REVISIONS HISTORY (SUP-04-01)
CREATE TABLE IF NOT EXISTS public.rfq_quote_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id VARCHAR(80) NOT NULL,
    rfq_id VARCHAR(80) NOT NULL,
    supplier_id VARCHAR(80) NOT NULL,
    revision_number INT NOT NULL DEFAULT 1,
    previous_amount NUMERIC(12, 2) DEFAULT 0.00,
    revised_amount NUMERIC(12, 2) NOT NULL,
    revision_reason TEXT NOT NULL,
    delivery_days INT DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rfq_revisions_quote ON public.rfq_quote_revisions(quote_id);
CREATE INDEX IF NOT EXISTS idx_rfq_revisions_rfq ON public.rfq_quote_revisions(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rfq_revisions_supplier ON public.rfq_quote_revisions(supplier_id);

-- 4. SCHOOL PROCUREMENT BOARD EVALUATIONS & AWARDS TABLE (SUP-04-02)
CREATE TABLE IF NOT EXISTS public.rfq_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id VARCHAR(80) NOT NULL,
    quote_id VARCHAR(80) NOT NULL,
    evaluator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    technical_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    commercial_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    total_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    decision TEXT NOT NULL DEFAULT 'under_review' CHECK (decision IN ('under_review', 'shortlisted', 'awarded', 'rejected')),
    evaluation_notes TEXT,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rfq_evaluations_rfq ON public.rfq_evaluations(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rfq_evaluations_quote ON public.rfq_evaluations(quote_id);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.rfq_targeted_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_quote_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_evaluations ENABLE ROW LEVEL SECURITY;

-- Invitations RLS: Invited supplier, school author, or super admin can access
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rfq_targeted_invitations' AND policyname = 'parties_read_rfq_invitations') THEN
        CREATE POLICY "parties_read_rfq_invitations" ON public.rfq_targeted_invitations
            FOR ALL USING (
                auth.uid()::text = supplier_id
                OR auth.role() = 'authenticated'
                OR auth.jwt() ->> 'role' = 'super_admin'
            );
    END IF;
END $$;

-- Quote Revisions RLS: Author supplier or school board can access
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rfq_quote_revisions' AND policyname = 'parties_read_rfq_revisions') THEN
        CREATE POLICY "parties_read_rfq_revisions" ON public.rfq_quote_revisions
            FOR ALL USING (
                auth.uid()::text = supplier_id
                OR auth.role() = 'authenticated'
                OR auth.jwt() ->> 'role' = 'super_admin'
            );
    END IF;
END $$;

-- Evaluations RLS: Internal to school committee and super admin
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rfq_evaluations' AND policyname = 'school_manage_evaluations') THEN
        CREATE POLICY "school_manage_evaluations" ON public.rfq_evaluations
            FOR ALL USING (
                auth.role() = 'authenticated'
                OR auth.jwt() ->> 'role' = 'super_admin'
            );
    END IF;
END $$;

SELECT 'SkoolFinder Ghana Suppliers Portal Stage 4 Migration Applied' AS migration_status;
