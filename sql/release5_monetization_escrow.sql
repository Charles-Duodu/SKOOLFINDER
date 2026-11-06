-- ============================================================================
-- SKOOLFINDER GHANA — RELEASE 5 SCHEMA MIGRATION
-- MONETIZATION, MOMO ESCROW & QUOTA LEDGERS (MILESTONES M10 & M11)
-- Blueprint Reference: v2.0 §14, §15, §16, §24, §26; DEC-002, DEC-011, DEC-024
-- ============================================================================

-- 1. ESCROW LEDGER TABLE (LESSON ESCROW LIFECYCLE DEC-011)
CREATE TABLE IF NOT EXISTS public.escrow_ledgers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL, -- references tutoring_bookings.id
    booking_reference TEXT NOT NULL,
    payment_reference TEXT NOT NULL UNIQUE,
    amount_ghs NUMERIC(10, 2) NOT NULL,
    escrow_fee_ghs NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    net_disbursement_ghs NUMERIC(10, 2) NOT NULL,
    payer_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    payer_name TEXT NOT NULL,
    payer_phone TEXT NOT NULL,
    payee_professional_id TEXT NOT NULL,
    payee_name TEXT NOT NULL,
    payee_momo_network TEXT, -- MTN MoMo, Telecel Cash, AT Money
    payee_momo_number TEXT,
    payee_momo_name TEXT,
    status TEXT NOT NULL DEFAULT 'held_in_escrow' CHECK (
        status IN ('held_in_escrow', 'disbursed', 'refunded', 'disputed')
    ),
    funded_at TIMESTAMPTZ DEFAULT NOW(),
    disbursed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    disbursed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    disbursement_notes TEXT,
    refund_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escrow_ledgers_booking ON public.escrow_ledgers(booking_id);
CREATE INDEX IF NOT EXISTS idx_escrow_ledgers_status ON public.escrow_ledgers(status);
CREATE INDEX IF NOT EXISTS idx_escrow_ledgers_payee ON public.escrow_ledgers(payee_professional_id);
CREATE INDEX IF NOT EXISTS idx_escrow_ledgers_payer ON public.escrow_ledgers(payer_user_id);

-- 2. PROFESSIONAL SUBSCRIPTIONS TABLE (DEC-002, DEC-024)
CREATE TABLE IF NOT EXISTS public.professional_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'plus', 'business')),
    amount_ghs NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'annual')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
    payment_reference TEXT,
    payment_channel TEXT DEFAULT 'Mobile Money (MTN MoMo)',
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prof_subscriptions_user ON public.professional_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_prof_subscriptions_prof ON public.professional_subscriptions(professional_id);
CREATE INDEX IF NOT EXISTS idx_prof_subscriptions_tier ON public.professional_subscriptions(tier);

-- 3. ENSURE PROFESSIONAL PAYOUT METHODS TABLE EXISTS
CREATE TABLE IF NOT EXISTS public.professional_payout_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id TEXT NOT NULL,
    network TEXT NOT NULL CHECK (network IN ('MTN MoMo', 'Telecel Cash', 'AT Money')),
    account_number TEXT NOT NULL,
    account_name TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prof_payout_methods_prof ON public.professional_payout_methods(professional_id);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.escrow_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_payout_methods ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Payer views their escrow records" ON public.escrow_ledgers;
    DROP POLICY IF EXISTS "Payee views their escrow records" ON public.escrow_ledgers;
    DROP POLICY IF EXISTS "Super admins manage all escrow records" ON public.escrow_ledgers;
    DROP POLICY IF EXISTS "Professionals view own subscriptions" ON public.professional_subscriptions;
    DROP POLICY IF EXISTS "Professionals manage own payout methods" ON public.professional_payout_methods;
END $$;

-- Payer views their escrow records
CREATE POLICY "Payer views their escrow records" ON public.escrow_ledgers
    FOR SELECT USING (auth.uid() = payer_user_id);

-- Payee views their escrow records
CREATE POLICY "Payee views their escrow records" ON public.escrow_ledgers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.professional_profiles pp
            WHERE (pp.id::text = escrow_ledgers.payee_professional_id::text OR pp.user_id::text = escrow_ledgers.payee_professional_id::text)
              AND pp.user_id = auth.uid()
        )
    );

-- Super admin manages all escrow records
CREATE POLICY "Super admins manage all escrow records" ON public.escrow_ledgers
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'super_admin'
        )
    );

-- Professionals view their own subscriptions
CREATE POLICY "Professionals view own subscriptions" ON public.professional_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Professionals manage their own payout methods
CREATE POLICY "Professionals manage own payout methods" ON public.professional_payout_methods
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.professional_profiles pp
            WHERE (pp.id::text = professional_payout_methods.professional_id::text OR pp.user_id::text = professional_payout_methods.professional_id::text)
              AND pp.user_id = auth.uid()
        )
        OR auth.role() = 'service_role'
    );

