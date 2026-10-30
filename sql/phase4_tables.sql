-- ========================================================
-- SKOOLFINDER GHANA - PHASE 4 SCHEMA EXTENSION
-- Paystack Payments, Subscriptions & Tier Entitlements (GHS)
-- ========================================================

-- 1. SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    portal VARCHAR(50) NOT NULL, -- 'schools', 'teachers', 'suppliers'
    price_ghs NUMERIC(10, 2) NOT NULL,
    billing_interval VARCHAR(50) DEFAULT 'annual', -- 'monthly', 'annual', 'one_time'
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PAYMENT ORDERS (All MoMo & Card transactions initialized or confirmed)
CREATE TABLE IF NOT EXISTS public.payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    payer_name VARCHAR(255),
    payer_email VARCHAR(255),
    payer_phone VARCHAR(50),
    amount_ghs NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'GHS',
    purpose VARCHAR(100) NOT NULL, -- 'school_subscription', 'teacher_subscription', 'fee_payment'
    target_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'success', 'failed'
    channel VARCHAR(100), -- 'Mobile Money (MTN MoMo)', 'Telecel Cash', 'Card'
    paid_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACTIVE SUBSCRIPTIONS & ENTITLEMENTS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    plan_name VARCHAR(100) NOT NULL,
    portal VARCHAR(50) NOT NULL, -- 'schools', 'teachers', 'suppliers'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'canceled'
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year'),
    paystack_reference VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Re-runnable Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public read plans" ON public.plans;
    DROP POLICY IF EXISTS "Public read payment orders" ON public.payment_orders;
    DROP POLICY IF EXISTS "Public read subscriptions" ON public.subscriptions;
END $$;

CREATE POLICY "Public read plans" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Public read payment orders" ON public.payment_orders FOR SELECT USING (true);
CREATE POLICY "Public read subscriptions" ON public.subscriptions FOR SELECT USING (true);

-- Helpful Indexing
CREATE INDEX IF NOT EXISTS idx_payment_orders_ref ON public.payment_orders(reference);
CREATE INDEX IF NOT EXISTS idx_subscriptions_school ON public.subscriptions(school_id);

-- SEED PRODUCTION SUBSCRIPTION PLANS
INSERT INTO public.plans (name, slug, portal, price_ghs, billing_interval, features)
VALUES 
    (
        'Verified Campus Partner', 
        'school-verified', 
        'schools', 
        1200.00, 
        'annual', 
        '["Verified Accreditation Badge", "Direct WhatsApp Lead Inquiries", "Admission Tour Queuing System", "Custom Cover Banner"]'::jsonb
    ),
    (
        'Featured Leader Spotlight', 
        'school-featured', 
        'schools', 
        2500.00, 
        'annual', 
        '["All Verified Partner Features", "Top 3 Homepage Directory Placement", "Priority Inbound Admissions Leads", "Procurement RFQ Posting Board", "Dedicated Account Manager"]'::jsonb
    ),
    (
        'Pro Educator Membership', 
        'teacher-pro', 
        'teachers', 
        350.00, 
        'annual', 
        '["Verified Teacher Badge", "Direct Parent Consultation Inquiries", "Subject & Regional Directory Priority", "Unlimited Lesson Booking Requests"]'::jsonb
    ),
    (
        'Verified Wholesale Supplier', 
        'supplier-verified', 
        'suppliers', 
        600.00, 
        'annual', 
        '["Verified Ghana B2B Supplier Badge", "Unlimited RFQ Bidding Access", "School Board Direct RFQ Alerts", "Product Catalog Listing"]'::jsonb
    )
ON CONFLICT (slug) DO NOTHING;
