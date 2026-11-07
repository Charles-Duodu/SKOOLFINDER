-- ============================================================================
-- SKOOLFINDER GHANA: SUPPLIERS PORTAL STAGE 7 — AI, AUTOMATIONS & OBSERVABILITY
-- Baseline: Master Blueprint v2.0 (SUP-07-01 through SUP-07-08)
-- 100% Idempotent: Safe to execute on existing Supabase instances
-- ============================================================================

-- 1. SUPPLIER COMPLIANCE VERIFICATION AUDIT DESK (SUP-07-02, DEC-015)
CREATE TABLE IF NOT EXISTS public.supplier_verification_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id VARCHAR(80) NOT NULL,
    requested_level VARCHAR(10) NOT NULL DEFAULT 'V1',
    assigned_level VARCHAR(10) NOT NULL DEFAULT 'V1',
    decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'more_evidence_required')),
    compliance_officer_id TEXT NOT NULL,
    compliance_officer_name TEXT NOT NULL,
    audit_notes TEXT NOT NULL,
    tin_verified BOOLEAN DEFAULT false,
    gra_tax_clearance_verified BOOLEAN DEFAULT false,
    fda_permit_verified BOOLEAN DEFAULT false,
    safeguarding_cleared BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sup_verif_rev_supplier ON public.supplier_verification_reviews(supplier_id);
CREATE INDEX IF NOT EXISTS idx_sup_verif_rev_officer ON public.supplier_verification_reviews(compliance_officer_id);

-- 2. AI PROCUREMENT GATEWAY AUDIT & TELEMETRY LOGS (SUP-07-05, SUP-07-06)
CREATE TABLE IF NOT EXISTS public.ai_procurement_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    actor_user_id TEXT,
    actor_role TEXT NOT NULL DEFAULT 'anonymous',
    query_type TEXT NOT NULL CHECK (query_type IN ('statutory_rag', 'rfq_copilot', 'tender_drafter', 'verification_screening', 'semantic_ranking')),
    risk_tier INT NOT NULL DEFAULT 1 CHECK (risk_tier IN (1, 2, 3)), -- 1: Low, 2: Medium, 3: High
    tokens_consumed INT NOT NULL DEFAULT 0,
    cost_ghs NUMERIC(8,4) NOT NULL DEFAULT 0.0000,
    statutory_citations TEXT[] DEFAULT '{}',
    tenant_scope_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_proc_logs_actor ON public.ai_procurement_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_ai_proc_logs_type ON public.ai_procurement_logs(query_type);

-- 3. N8N ASYNCHRONOUS WORKFLOW DISPATCH LOGS (SUP-07-04)
CREATE TABLE IF NOT EXISTS public.n8n_procurement_dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id VARCHAR(50) NOT NULL,
    workflow_name TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'dispatched' CHECK (status IN ('dispatched', 'delivered', 'failed', 'retrying')),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_n8n_proc_disp_wf ON public.n8n_procurement_dispatches(workflow_id);

-- 4. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.supplier_verification_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_procurement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_procurement_dispatches ENABLE ROW LEVEL SECURITY;

-- Super Admin and Compliance Officers view all verification reviews
DROP POLICY IF EXISTS "Compliance view verification reviews" ON public.supplier_verification_reviews;
CREATE POLICY "Compliance view verification reviews" ON public.supplier_verification_reviews
    FOR ALL TO authenticated
    USING (
        auth.jwt()->>'role' IN ('super_admin', 'compliance_officer')
    );

-- Super Admin view all AI and n8n logs
DROP POLICY IF EXISTS "Admin view AI logs" ON public.ai_procurement_logs;
CREATE POLICY "Admin view AI logs" ON public.ai_procurement_logs
    FOR SELECT TO authenticated
    USING (
        auth.jwt()->>'role' = 'super_admin'
    );

DROP POLICY IF EXISTS "Admin view n8n logs" ON public.n8n_procurement_dispatches;
CREATE POLICY "Admin view n8n logs" ON public.n8n_procurement_dispatches
    FOR SELECT TO authenticated
    USING (
        auth.jwt()->>'role' = 'super_admin'
    );

SELECT 'SkoolFinder Ghana Suppliers Portal Stage 7 Migration Applied' AS migration_status;

