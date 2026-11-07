-- ============================================================================
-- SKOOLFINDER GHANA: SUPPLIERS PORTAL STAGE 5 — PAID OPERATIONS & BILLING
-- Baseline: Master Blueprint v2.0 (SUP-05-01 through SUP-05-08, SUP-04-03)
-- 100% Idempotent: Safe to execute on existing Supabase instances
-- ============================================================================

-- 1. ADDITIVE COLUMNS ON public.suppliers (SUP-05-01)
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS current_plan_tier TEXT DEFAULT 'free';
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT;

-- 2. SUPPLIER SUBSCRIPTIONS TABLE (SUP-05-01, SUP-05-06, SUP-05-07)
CREATE TABLE IF NOT EXISTS public.supplier_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id VARCHAR(80) NOT NULL,
    plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'growth', 'professional', 'enterprise')),
    billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'annual')),
    amount_ghs NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'grace_period', 'past_due', 'canceled', 'expired')),
    paystack_subscription_code TEXT,
    paystack_customer_code TEXT,
    paystack_plan_code TEXT,
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    grace_period_ends_at TIMESTAMPTZ, -- 7-day payment grace period (SUP-05-06)
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sup_sub_supplier ON public.supplier_subscriptions(supplier_id);
CREATE INDEX IF NOT EXISTS idx_sup_sub_status ON public.supplier_subscriptions(status);

-- 3. IMMUTABLE SUPPLIER INVOICES TABLE (SUP-05-04, SUP-05-05)
CREATE TABLE IF NOT EXISTS public.supplier_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(60) NOT NULL UNIQUE,
    supplier_id VARCHAR(80) NOT NULL,
    plan_tier TEXT NOT NULL,
    billing_interval TEXT NOT NULL,
    amount_ghs NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GHS',
    paystack_reference TEXT NOT NULL UNIQUE, -- Idempotency key preventing duplicate payment processing
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    receipt_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sup_inv_supplier ON public.supplier_invoices(supplier_id);
CREATE INDEX IF NOT EXISTS idx_sup_inv_ref ON public.supplier_invoices(paystack_reference);

-- 4. SUPPLIER QUOTAS AND USAGE CAPS (SUP-05-02, SUP-05-03, SUP-04-03)
CREATE TABLE IF NOT EXISTS public.supplier_quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id VARCHAR(80) NOT NULL UNIQUE,
    catalogue_items_used INT NOT NULL DEFAULT 0,
    catalogue_items_limit INT NOT NULL DEFAULT 5, -- Free: 5, Growth: 25, Pro: 100, Enterprise: -1 (Unlimited)
    rfq_quotes_used_current_month INT NOT NULL DEFAULT 0,
    rfq_quotes_limit_monthly INT NOT NULL DEFAULT 2, -- Free: 2, Growth: 10, Pro: 35, Enterprise: -1 (Unlimited)
    direct_invitations_used INT NOT NULL DEFAULT 0, -- Direct invitations never capped (SUP-04-03)
    quota_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    quota_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sup_quotas_supplier ON public.supplier_quotas(supplier_id);

-- 5. COMMERCIAL ANALYTICS EVENTS (SUP-05-08)
CREATE TABLE IF NOT EXISTS public.supplier_analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id VARCHAR(80) NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('profile_view', 'catalogue_view', 'inquiry_received', 'rfq_view', 'quote_submitted', 'quote_awarded', 'contact_reveal')),
    actor_type TEXT NOT NULL DEFAULT 'anonymous' CHECK (actor_type IN ('anonymous', 'school', 'parent', 'teacher', 'admin')),
    actor_id TEXT,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sup_analytics_supplier ON public.supplier_analytics_events(supplier_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sup_analytics_event ON public.supplier_analytics_events(event_type);

-- 6. SEED / RECONCILE CANONICAL SUPPLIER PLANS IN plans TABLE (SUP-05-01)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plans') THEN
        -- Monthly Free Tier
        INSERT INTO public.plans (id, name, slug, portal, price_ghs, billing_interval, is_active, features)
        VALUES ('plan-sup-free', 'Free Supplier Tier', 'supplier-free', 'suppliers', 0.00, 'monthly', true, 
                ARRAY['Public Directory Listing upon Verification', 'Up to 5 Catalogue Items', '2 Open-Market RFQ Quotes / month', 'Unlimited Direct School Inquiries'])
        ON CONFLICT (id) DO UPDATE SET price_ghs = 0.00, portal = 'suppliers', is_active = true;

        -- Monthly Growth Tier (GH₵ 79)
        INSERT INTO public.plans (id, name, slug, portal, price_ghs, billing_interval, is_active, features)
        VALUES ('plan-sup-growth-m', 'Growth Supplier Tier', 'supplier-growth-monthly', 'suppliers', 79.00, 'monthly', true,
                ARRAY['Verified Supplier V1 Badge', 'Up to 25 Catalogue Items', '10 Open-Market RFQ Quotes / month', 'Unlimited Direct School Inquiries', 'Category Sponsorship Eligibility'])
        ON CONFLICT (id) DO UPDATE SET price_ghs = 79.00, portal = 'suppliers', is_active = true;

        -- Annual Growth Tier (GH₵ 790 - 10 months for 12 months)
        INSERT INTO public.plans (id, name, slug, portal, price_ghs, billing_interval, is_active, features)
        VALUES ('plan-sup-growth-a', 'Growth Supplier Tier (Annual)', 'supplier-growth-annual', 'suppliers', 790.00, 'annual', true,
                ARRAY['Verified Supplier V1 Badge', 'Up to 25 Catalogue Items', '10 Open-Market RFQ Quotes / month', '2 Months Free (Save GH₵ 158)', 'Unlimited Direct Inquiries'])
        ON CONFLICT (id) DO UPDATE SET price_ghs = 790.00, portal = 'suppliers', is_active = true;

        -- Monthly Professional Tier (GH₵ 199)
        INSERT INTO public.plans (id, name, slug, portal, price_ghs, billing_interval, is_active, features)
        VALUES ('plan-sup-pro-m', 'Professional Supplier Tier', 'supplier-pro-monthly', 'suppliers', 199.00, 'monthly', true,
                ARRAY['Verified Supplier V2/V3 Badge', 'Up to 100 Catalogue Items', '35 Open-Market RFQ Quotes / month', 'Priority Tender Visibility', 'Commercial Analytics Dashboard'])
        ON CONFLICT (id) DO UPDATE SET price_ghs = 199.00, portal = 'suppliers', is_active = true;

        -- Annual Professional Tier (GH₵ 1,990 - 10 months for 12 months)
        INSERT INTO public.plans (id, name, slug, portal, price_ghs, billing_interval, is_active, features)
        VALUES ('plan-sup-pro-a', 'Professional Supplier Tier (Annual)', 'supplier-pro-annual', 'suppliers', 1990.00, 'annual', true,
                ARRAY['Verified Supplier V2/V3 Badge', 'Up to 100 Catalogue Items', '35 Open-Market RFQ Quotes / month', '2 Months Free (Save GH₵ 398)', 'Commercial Analytics Dashboard'])
        ON CONFLICT (id) DO UPDATE SET price_ghs = 1990.00, portal = 'suppliers', is_active = true;

        -- Monthly Enterprise Tier (GH₵ 399)
        INSERT INTO public.plans (id, name, slug, portal, price_ghs, billing_interval, is_active, features)
        VALUES ('plan-sup-ent-m', 'Enterprise Institutional Supplier', 'supplier-ent-monthly', 'suppliers', 399.00, 'monthly', true,
                ARRAY['V4 Enterprise Vetting Badge', 'Unlimited Catalogue Items', 'Unlimited Open-Market RFQ Quotes', 'Dedicated Key Account Officer', 'Direct School ERP Integration API'])
        ON CONFLICT (id) DO UPDATE SET price_ghs = 399.00, portal = 'suppliers', is_active = true;

        -- Annual Enterprise Tier (GH₵ 3,990 - 10 months for 12 months)
        INSERT INTO public.plans (id, name, slug, portal, price_ghs, billing_interval, is_active, features)
        VALUES ('plan-sup-ent-a', 'Enterprise Institutional Supplier (Annual)', 'supplier-ent-annual', 'suppliers', 3990.00, 'annual', true,
                ARRAY['V4 Enterprise Vetting Badge', 'Unlimited Catalogue Items', 'Unlimited Open-Market RFQ Quotes', '2 Months Free (Save GH₵ 798)', 'Dedicated Key Account Officer'])
        ON CONFLICT (id) DO UPDATE SET price_ghs = 3990.00, portal = 'suppliers', is_active = true;
    END IF;
END $$;

-- 7. ENABLE RLS POLICIES (SUP-05-01, SUP-05-04)
ALTER TABLE public.supplier_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_analytics_events ENABLE ROW LEVEL SECURITY;

-- Subscriptions RLS
DROP POLICY IF EXISTS "Suppliers view own subscriptions" ON public.supplier_subscriptions;
CREATE POLICY "Suppliers view own subscriptions" ON public.supplier_subscriptions
    FOR SELECT TO authenticated
    USING (
        supplier_id IN (SELECT id::text FROM public.suppliers WHERE user_id = auth.uid() OR auth_user_id = auth.uid())
        OR auth.jwt()->>'role' = 'super_admin'
    );

-- Invoices RLS
DROP POLICY IF EXISTS "Suppliers view own invoices" ON public.supplier_invoices;
CREATE POLICY "Suppliers view own invoices" ON public.supplier_invoices
    FOR SELECT TO authenticated
    USING (
        supplier_id IN (SELECT id::text FROM public.suppliers WHERE user_id = auth.uid() OR auth_user_id = auth.uid())
        OR auth.jwt()->>'role' = 'super_admin'
    );

-- Quotas RLS
DROP POLICY IF EXISTS "Suppliers view own quotas" ON public.supplier_quotas;
CREATE POLICY "Suppliers view own quotas" ON public.supplier_quotas
    FOR SELECT TO authenticated
    USING (
        supplier_id IN (SELECT id::text FROM public.suppliers WHERE user_id = auth.uid() OR auth_user_id = auth.uid())
        OR auth.jwt()->>'role' = 'super_admin'
    );

-- Analytics RLS
DROP POLICY IF EXISTS "Suppliers view own analytics" ON public.supplier_analytics_events;
CREATE POLICY "Suppliers view own analytics" ON public.supplier_analytics_events
    FOR SELECT TO authenticated
    USING (
        supplier_id IN (SELECT id::text FROM public.suppliers WHERE user_id = auth.uid() OR auth_user_id = auth.uid())
        OR auth.jwt()->>'role' = 'super_admin'
    );

SELECT 'SkoolFinder Ghana Suppliers Portal Stage 5 Migration Applied' AS migration_status;
