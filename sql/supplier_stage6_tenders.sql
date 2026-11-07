-- ============================================================================
-- SKOOLFINDER GHANA: SUPPLIERS PORTAL STAGE 6 — MANAGED TENDERS & SEALED BIDS
-- Baseline: Master Blueprint v2.0 (SUP-06-01 through SUP-06-08)
-- 100% Idempotent: Safe to execute on existing Supabase instances
-- ============================================================================

-- 1. INSTITUTIONAL MANAGED TENDERS TABLE (SUP-06-01, SUP-06-06)
CREATE TABLE IF NOT EXISTS public.institutional_tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_number VARCHAR(60) NOT NULL UNIQUE,
    school_id TEXT NOT NULL,
    school_name TEXT NOT NULL,
    title TEXT NOT NULL,
    category_id TEXT NOT NULL,
    procurement_type TEXT NOT NULL DEFAULT 'high_value_tender' CHECK (procurement_type IN ('high_value_tender', 'framework_agreement', 'national_competitive_tender')),
    estimated_value_ghs NUMERIC(12,2) NOT NULL,
    is_framework_agreement BOOLEAN NOT NULL DEFAULT false,
    framework_duration_months INT DEFAULT 12,
    clarification_deadline TIMESTAMPTZ NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL,
    opening_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'clarification', 'closed_sealed', 'opened', 'evaluating', 'awarded', 'canceled')),
    technical_weight_percent INT NOT NULL DEFAULT 60,
    commercial_weight_percent INT NOT NULL DEFAULT 40,
    tender_security_required BOOLEAN NOT NULL DEFAULT false,
    tender_security_amount_ghs NUMERIC(10,2) DEFAULT 0.00,
    specifications_doc_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inst_tenders_school ON public.institutional_tenders(school_id);
CREATE INDEX IF NOT EXISTS idx_inst_tenders_status ON public.institutional_tenders(status);
CREATE INDEX IF NOT EXISTS idx_inst_tenders_deadline ON public.institutional_tenders(submission_deadline);

-- 2. TENDER SEALED BID VAULT TABLE (SUP-06-02, SUP-06-07)
CREATE TABLE IF NOT EXISTS public.tender_sealed_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bid_number VARCHAR(60) NOT NULL UNIQUE,
    tender_id UUID NOT NULL REFERENCES public.institutional_tenders(id) ON DELETE CASCADE,
    supplier_id VARCHAR(80) NOT NULL,
    supplier_name TEXT NOT NULL,
    bid_amount_ghs NUMERIC(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GHS',
    technical_proposal_url TEXT,
    commercial_proposal_url TEXT,
    tender_security_ref TEXT,
    delivery_schedule_days INT NOT NULL DEFAULT 30,
    warranty_months INT NOT NULL DEFAULT 12,
    non_collusion_attestation BOOLEAN NOT NULL DEFAULT true, -- Mandatory (SUP-06-07)
    conflict_of_interest_declaration TEXT DEFAULT 'None declared',
    is_sealed BOOLEAN NOT NULL DEFAULT true, -- Unsealing before deadline is strictly forbidden (SUP-06-02)
    unsealed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'unsealed', 'shortlisted', 'awarded', 'unsuccessful', 'disqualified')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sealed_bids_tender ON public.tender_sealed_bids(tender_id);
CREATE INDEX IF NOT EXISTS idx_sealed_bids_supplier ON public.tender_sealed_bids(supplier_id);
CREATE INDEX IF NOT EXISTS idx_sealed_bids_vault ON public.tender_sealed_bids(is_sealed);

-- 3. TENDER CLARIFICATIONS & PUBLIC ADDENDA (SUP-06-03)
CREATE TABLE IF NOT EXISTS public.tender_clarifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL REFERENCES public.institutional_tenders(id) ON DELETE CASCADE,
    supplier_id VARCHAR(80) NOT NULL,
    question_text TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'published_addendum')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tender_clarif_tender ON public.tender_clarifications(tender_id);

CREATE TABLE IF NOT EXISTS public.tender_addenda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    addendum_number VARCHAR(40) NOT NULL UNIQUE,
    tender_id UUID NOT NULL REFERENCES public.institutional_tenders(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    clarification_summary TEXT NOT NULL,
    response_details TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tender_addenda_tender ON public.tender_addenda(tender_id);

-- 4. COMMITTEE EVALUATION SCORING (SUP-06-04)
CREATE TABLE IF NOT EXISTS public.tender_committee_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL REFERENCES public.institutional_tenders(id) ON DELETE CASCADE,
    bid_id UUID NOT NULL REFERENCES public.tender_sealed_bids(id) ON DELETE CASCADE,
    evaluator_user_id TEXT NOT NULL,
    evaluator_name TEXT NOT NULL,
    evaluator_role TEXT NOT NULL,
    technical_score NUMERIC(5,2) NOT NULL CHECK (technical_score >= 0 AND technical_score <= 100),
    commercial_score NUMERIC(5,2) NOT NULL CHECK (commercial_score >= 0 AND commercial_score <= 100),
    weighted_total_score NUMERIC(5,2) NOT NULL,
    compliance_notes TEXT,
    recommendation TEXT NOT NULL CHECK (recommendation IN ('award', 'shortlist', 'reject')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tender_eval_bid ON public.tender_committee_evaluations(bid_id);
CREATE INDEX IF NOT EXISTS idx_tender_eval_tender ON public.tender_committee_evaluations(tender_id);

-- 5. NOTICE OF AWARD (DEC-015 HUMAN CONFIRMATION) (SUP-06-05)
CREATE TABLE IF NOT EXISTS public.tender_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    award_notice_number VARCHAR(60) NOT NULL UNIQUE,
    tender_id UUID NOT NULL REFERENCES public.institutional_tenders(id) ON DELETE CASCADE,
    winning_bid_id UUID NOT NULL REFERENCES public.tender_sealed_bids(id),
    winning_supplier_id VARCHAR(80) NOT NULL,
    awarded_amount_ghs NUMERIC(12,2) NOT NULL,
    approved_by_user_id TEXT NOT NULL, -- DEC-015 Human confirmation required
    approved_by_name TEXT NOT NULL,
    approved_by_title TEXT NOT NULL,
    award_rationale TEXT NOT NULL,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tender_awards_tender ON public.tender_awards(tender_id);

-- 6. MULTI-YEAR FRAMEWORK AGREEMENT CONTRACTS (SUP-06-06)
CREATE TABLE IF NOT EXISTS public.tender_framework_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(60) NOT NULL UNIQUE,
    tender_id UUID NOT NULL REFERENCES public.institutional_tenders(id),
    supplier_id VARCHAR(80) NOT NULL,
    school_id TEXT NOT NULL,
    term_months INT NOT NULL DEFAULT 12,
    ceiling_value_ghs NUMERIC(12,2) NOT NULL,
    drawdowns_total_ghs NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired', 'completed')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '365 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_framework_contracts_supplier ON public.tender_framework_contracts(supplier_id);
CREATE INDEX IF NOT EXISTS idx_framework_contracts_school ON public.tender_framework_contracts(school_id);

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.institutional_tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_sealed_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_clarifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_addenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_committee_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_framework_contracts ENABLE ROW LEVEL SECURITY;

-- Public can view active published tenders
DROP POLICY IF EXISTS "Public view published tenders" ON public.institutional_tenders;
CREATE POLICY "Public view published tenders" ON public.institutional_tenders
    FOR SELECT TO anon, authenticated
    USING (status != 'draft');

-- Suppliers can view own sealed bids
DROP POLICY IF EXISTS "Suppliers view own sealed bids" ON public.tender_sealed_bids;
CREATE POLICY "Suppliers view own sealed bids" ON public.tender_sealed_bids
    FOR SELECT TO authenticated
    USING (
        supplier_id IN (SELECT id::text FROM public.suppliers WHERE user_id = auth.uid() OR auth_user_id = auth.uid())
        OR auth.jwt()->>'role' = 'super_admin'
    );

-- School procurement committee can view unsealed bids only after opening
DROP POLICY IF EXISTS "Schools view unsealed bids" ON public.tender_sealed_bids;
CREATE POLICY "Schools view unsealed bids" ON public.tender_sealed_bids
    FOR SELECT TO authenticated
    USING (
        is_sealed = false
        OR auth.jwt()->>'role' = 'super_admin'
    );

SELECT 'SkoolFinder Ghana Suppliers Portal Stage 6 Migration Applied' AS migration_status;

