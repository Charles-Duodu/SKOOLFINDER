-- ====================================================================
-- SkoolFinder Ghana — Suppliers & Service Providers Portal Master DDL
-- Consolidated All-Stages Master Migration (Stages 1 through 8)
-- Baseline: Master Blueprint v2.0 (SUP-01-01 to SUP-08-08)
-- Region: Greater Accra Pilot & Nationwide Ghana
-- ====================================================================

-- --------------------------------------------------------------------
-- STAGE 1: FOUNDATION & PRIVATE EVIDENCE STORAGE
-- --------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('private_evidence', 'private_evidence', false)
ON CONFLICT (id) DO UPDATE SET public = false;

CREATE TABLE IF NOT EXISTS public.supplier_organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    registration_number TEXT,
    tax_identification_number TEXT,
    account_type TEXT NOT NULL DEFAULT 'business' CHECK (account_type IN ('business', 'qualified_individual')),
    verification_level TEXT NOT NULL DEFAULT 'V0' CHECK (verification_level IN ('V0', 'V1', 'V2', 'V3', 'V4')),
    trading_status TEXT NOT NULL DEFAULT 'pending' CHECK (trading_status IN ('pending', 'approved', 'rejected', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.suppliers 
    ADD COLUMN IF NOT EXISTS organisation_id UUID REFERENCES public.supplier_organisations(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'business',
    ADD COLUMN IF NOT EXISTS verification_level TEXT DEFAULT 'V0',
    ADD COLUMN IF NOT EXISTS evidence_documents JSONB DEFAULT '[]'::jsonb;

-- --------------------------------------------------------------------
-- STAGE 2: CATEGORY TAXONOMY, PRODUCTS & SERVICES
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.supplier_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    risk_level TEXT NOT NULL DEFAULT 'standard' CHECK (risk_level IN ('standard', 'medium', 'high')),
    icon TEXT NOT NULL,
    description TEXT NOT NULL,
    required_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.supplier_categories (id, name, slug, risk_level, icon, description, required_evidence, display_order)
VALUES 
    ('cat-books', 'Books, Curricula & Stationery', 'books-stationery', 'standard', '📚', 'Textbooks (BECE/WASSCE/Cambridge), exercise books, stationery', '["Business Registration", "Publisher Distributorship Agreement"]', 1),
    ('cat-stem', 'Science, STEM & Lab Equipment', 'stem-lab-equipment', 'medium', '🔬', 'WAEC science reagents, optical microscopes, robotics kits', '["Business Registration", "Apparatus Safety Attestation"]', 2),
    ('cat-furniture', 'Classroom & Office Furniture', 'classroom-furniture', 'standard', '🪑', 'Dual desks, ergonomic student chairs, whiteboards, lockers', '["Business Registration", "Workshop Inspection"]', 3),
    ('cat-it', 'IT, Computers & EdTech Hardware', 'it-edtech-hardware', 'standard', '💻', 'Laptops, smartboards, school servers, networking', '["Business Registration", "Warranty Partner Certificate"]', 4),
    ('cat-uniforms', 'School Uniforms & Sportswear', 'uniforms-sportswear', 'standard', '👕', 'Crested uniform fabrics, school blazers, PE kits, socks', '["Business Registration", "Fabric Specification"]', 5),
    ('cat-food', 'Food, Groceries & Canteen Supplies', 'food-canteen', 'high', '🍲', 'Bulk rice, maize, cooking oil, canned goods, kitchen equipment', '["Business Registration", "FDA Ghana Food Safety Certificate", "Handlers Medical Clearance"]', 6),
    ('cat-transport', 'Student Transport & Logistics', 'transport-logistics', 'high', '🚌', 'School buses, GPS fleet telematics, bus maintenance', '["Business Registration", "DVLA Commercial Fleet Roadworthiness", "Driver Licensure & Vetting"]', 7),
    ('cat-facilities', 'Facilities, Cleaning & Maintenance', 'facilities-maintenance', 'medium', '🧹', 'Sanitation supplies, solar inverters, backup generators', '["Business Registration", "Pesticide EPA Permit (fumigation)"]', 8)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    risk_level = EXCLUDED.risk_level,
    icon = EXCLUDED.icon,
    description = EXCLUDED.description,
    required_evidence = EXCLUDED.required_evidence,
    display_order = EXCLUDED.display_order;

CREATE TABLE IF NOT EXISTS public.supplier_catalogue_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('product', 'service')),
    title TEXT NOT NULL,
    category_id TEXT REFERENCES public.supplier_categories(id) ON DELETE RESTRICT,
    pricing_mode TEXT NOT NULL CHECK (pricing_mode IN ('fixed', 'indicative', 'quote_only')),
    price_ghs NUMERIC(12, 2),
    moq INT DEFAULT 1,
    lead_time_days INT,
    safeguarding_cleared BOOLEAN DEFAULT false,
    service_deliverables TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- STAGE 3: SHORTLISTS & DIRECT INQUIRIES
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.school_supplier_shortlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    session_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_school_supplier_shortlist UNIQUE (school_id, supplier_id)
);

CREATE TABLE IF NOT EXISTS public.supplier_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_number TEXT UNIQUE NOT NULL,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    initiated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    category TEXT,
    estimated_budget NUMERIC(12, 2),
    timeline TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'responded', 'quoted', 'declined', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.supplier_inquiry_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID REFERENCES public.supplier_inquiries(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('school_admin', 'supplier', 'super_admin')),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- STAGE 4: RFQS & MULTI-SUPPLIER QUOTATIONS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.rfq_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id UUID REFERENCES public.rfqs(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'quoted')),
    invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_rfq_supplier_invitation UNIQUE (rfq_id, supplier_id)
);

CREATE TABLE IF NOT EXISTS public.supplier_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id UUID REFERENCES public.rfqs(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GHS',
    revision_number INT NOT NULL DEFAULT 0,
    valid_until TIMESTAMPTZ NOT NULL,
    delivery_lead_time_days INT NOT NULL,
    payment_terms TEXT NOT NULL,
    warranty_months INT DEFAULT 0,
    technical_specification TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'awarded', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_rfq_supplier_quote UNIQUE (rfq_id, supplier_id)
);

CREATE TABLE IF NOT EXISTS public.supplier_quote_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES public.supplier_quotes(id) ON DELETE CASCADE,
    revision_number INT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    reason_for_revision TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- STAGE 5: PAID OPERATIONS & PAYSTACK BILLING
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.supplier_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    plan TEXT NOT NULL CHECK (plan IN ('free', 'growth', 'professional', 'enterprise')),
    billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    price_ghs NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'grace_period', 'cancelled', 'expired')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    grace_period_end TIMESTAMPTZ,
    paystack_customer_code TEXT,
    paystack_subscription_code TEXT,
    paystack_email_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.supplier_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    amount_ghs NUMERIC(10, 2) NOT NULL,
    paystack_reference TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('paid', 'failed', 'refunded')),
    paid_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- STAGE 6: MANAGED TENDERS & CRYPTOGRAPHIC SEALED BIDS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tender_sealed_bids (
    id TEXT PRIMARY KEY DEFAULT ('bid-' || substr(md5(random()::text), 1, 12)),
    tender_id TEXT NOT NULL,
    supplier_id TEXT NOT NULL,
    supplier_name TEXT NOT NULL,
    total_amount_ghs NUMERIC(12, 2) NOT NULL,
    delivery_timeline_days INT NOT NULL,
    is_vault_sealed BOOLEAN NOT NULL DEFAULT true,
    bid_hash TEXT NOT NULL,
    non_collusion_accepted BOOLEAN NOT NULL DEFAULT false,
    statutory_attestation_accepted BOOLEAN NOT NULL DEFAULT false,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tender_clarifications (
    id TEXT PRIMARY KEY DEFAULT ('clr-' || substr(md5(random()::text), 1, 12)),
    tender_id TEXT NOT NULL,
    supplier_id TEXT NOT NULL,
    query_text TEXT NOT NULL,
    school_response TEXT,
    is_public_addendum BOOLEAN NOT NULL DEFAULT false,
    addendum_ref TEXT,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tender_framework_contracts (
    id TEXT PRIMARY KEY DEFAULT ('fwc-' || substr(md5(random()::text), 1, 12)),
    contract_ref TEXT UNIQUE NOT NULL,
    tender_id TEXT NOT NULL,
    school_id TEXT NOT NULL,
    supplier_id TEXT NOT NULL,
    term_months INT NOT NULL DEFAULT 12,
    ceiling_amount_ghs NUMERIC(12, 2) NOT NULL,
    effective_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- STAGE 7: AI PROCUREMENT TELEMETRY & N8N DISPATCH LOGS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.procurement_ai_telemetry (
    id TEXT PRIMARY KEY DEFAULT ('ai-tel-' || substr(md5(random()::text), 1, 12)),
    query_type TEXT NOT NULL CHECK (query_type IN ('semantic_ranking', 'copilot_drafting', 'rag_scoped_query', 'compliance_audit')),
    user_id TEXT NOT NULL,
    user_role TEXT NOT NULL,
    risk_tier INT NOT NULL CHECK (risk_tier IN (1, 2, 3)),
    tokens_consumed INT NOT NULL DEFAULT 0,
    cost_ghs NUMERIC(8, 4) NOT NULL DEFAULT 0.0000,
    prompt_injection_detected BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.n8n_procurement_dispatches (
    id TEXT PRIMARY KEY DEFAULT ('n8n-dsp-' || substr(md5(random()::text), 1, 12)),
    workflow_id TEXT NOT NULL,
    workflow_name TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'dispatched' CHECK (status IN ('dispatched', 'delivered', 'failed')),
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- STAGE 8: PILOT COHORT & SLA RUNBOOKS
-- --------------------------------------------------------------------

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

CREATE TABLE IF NOT EXISTS public.sla_incident_runbooks (
    id TEXT PRIMARY KEY DEFAULT ('inc-' || substr(md5(random()::text), 1, 12)),
    severity TEXT NOT NULL CHECK (severity IN ('P1-CRITICAL', 'P2-MAJOR', 'P3-MINOR', 'P4-COSMETIC')),
    component TEXT NOT NULL,
    summary TEXT NOT NULL,
    rto_target_minutes INT NOT NULL DEFAULT 240,
    rpo_target_minutes INT NOT NULL DEFAULT 60,
    recovery_procedure TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'resolved' CHECK (status IN ('open', 'mitigated', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS across tables
ALTER TABLE public.supplier_organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_catalogue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_inquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_sealed_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_cohorts ENABLE ROW LEVEL SECURITY;

SELECT 'SkoolFinder Ghana Suppliers Portal Master Consolidated Migration Applied Successfully' AS master_status;
