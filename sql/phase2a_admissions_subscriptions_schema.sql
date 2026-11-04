-- ====================================================================
-- SKOOLFINDER GHANA — PHASE 2A SCHEMA MIGRATION
-- ENQUIRY CRM, ADMISSIONS LIFECYCLE & COMMERCIAL SUBSCRIPTIONS
-- Blueprint Reference: v2.0 Section 26.3 & Sections 6, 10, 11, 23, 25
-- ====================================================================

-- 1. SCHOOL INTAKES & CAPACITY MANAGEMENT (ADM-001, ADM-002)
CREATE TABLE IF NOT EXISTS public.school_intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. "2026/2027 Main Academic Intake"
    academic_year TEXT NOT NULL, -- e.g. "2026/2027"
    term TEXT NOT NULL DEFAULT 'Term 1 (September)',
    open_date DATE NOT NULL,
    close_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'closed')),
    grades_config JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { grade, capacity, advertised_seats, offers_count, enrolled_count }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_intakes_school_id ON public.school_intakes(school_id);
CREATE INDEX IF NOT EXISTS idx_school_intakes_status ON public.school_intakes(status);

-- 2. ADMISSION FORM DEFINITIONS & VERSIONING (ADM-003)
CREATE TABLE IF NOT EXISTS public.admission_form_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    intake_id UUID REFERENCES public.school_intakes(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    title TEXT NOT NULL DEFAULT 'Standard Admission Dossier',
    fields_config JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { id, label, type, required, options }
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_defs_school_intake ON public.admission_form_definitions(school_id, intake_id);

-- 3. SCHOOL ENQUIRY CRM & LEADS (ENQ-001, ENQ-002, ENQ-003, ENQ-006)
CREATE TABLE IF NOT EXISTS public.school_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    source TEXT NOT NULL DEFAULT 'directory' CHECK (source IN ('directory', 'matchmaker', 'compare', 'profile_direct', 'external')),
    parent_name TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    child_name TEXT,
    child_grade TEXT,
    preferred_entry_year TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'tour_scheduled', 'converted', 'closed')),
    assigned_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_staff_name TEXT,
    follow_up_date TIMESTAMPTZ,
    closure_reason TEXT, -- e.g. 'enrolled_elsewhere', 'uninterested', 'duplicate', 'no_response'
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_enquiries_school_id ON public.school_enquiries(school_id);
CREATE INDEX IF NOT EXISTS idx_school_enquiries_status ON public.school_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_school_enquiries_parent_email ON public.school_enquiries(parent_email);

-- 4. ENQUIRY CONVERSATION THREAD & INTERNAL NOTES (ENQ-004)
CREATE TABLE IF NOT EXISTS public.school_enquiry_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES public.school_enquiries(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('school_staff', 'parent', 'system')),
    sender_name TEXT NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_internal_note BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiry_messages_enquiry_id ON public.school_enquiry_messages(enquiry_id);

-- 5. CAMPUS WALKTHROUGH & ASSESSMENT TOUR SLOTS (ADM-008)
CREATE TABLE IF NOT EXISTS public.campus_tour_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- e.g. "Weekly Guided Campus Walkthrough"
    type TEXT NOT NULL DEFAULT 'tour' CHECK (type IN ('tour', 'assessment', 'interview')),
    slot_date DATE NOT NULL,
    slot_time TEXT NOT NULL, -- e.g. "10:00 AM"
    venue TEXT NOT NULL DEFAULT 'Main Administration Block',
    capacity INT NOT NULL DEFAULT 15,
    booked_count INT NOT NULL DEFAULT 0,
    attendees JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { parentName, parentPhone, parentEmail, childGrade, inquiryId, status }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campus_tours_school_id ON public.campus_tour_slots(school_id);

-- 6. COMMERCIAL SUBSCRIPTIONS & ENTITLEMENTS (SUB-001, SUB-002, SUB-005, SUB-008)
CREATE TABLE IF NOT EXISTS public.platform_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL UNIQUE REFERENCES public.schools(id) ON DELETE CASCADE,
    tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'growth', 'professional', 'enterprise')),
    billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'annual')),
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'GHS',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'grace', 'expired', 'cancelled_at_period_end')),
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    grace_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '37 days'),
    paystack_customer_code TEXT,
    paystack_subscription_code TEXT,
    payment_method TEXT DEFAULT 'mobile_money',
    momo_network TEXT, -- 'mtn', 'telecel', 'at'
    momo_number TEXT,
    last_payment_date TIMESTAMPTZ,
    next_billing_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_school_id ON public.platform_subscriptions(school_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON public.platform_subscriptions(tier);

-- 7. SUBSCRIPTION BILLING INVOICES & RECEIPTS (SUB-009)
CREATE TABLE IF NOT EXISTS public.subscription_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE, -- e.g. "INV-SF-2026-0001"
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.platform_subscriptions(id) ON DELETE SET NULL,
    tier TEXT NOT NULL,
    billing_interval TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GHS',
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
    paystack_reference TEXT NOT NULL,
    channel TEXT DEFAULT 'mobile_money',
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_invoices_school ON public.subscription_invoices(school_id);
CREATE INDEX IF NOT EXISTS idx_subscription_invoices_num ON public.subscription_invoices(invoice_number);

-- 8. ROW LEVEL SECURITY POLICIES
ALTER TABLE public.school_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_enquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_tour_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;

-- Intakes: Public read open intakes, school staff write
CREATE POLICY "Public read open intakes" ON public.school_intakes FOR SELECT USING (status = 'open' OR auth.role() = 'service_role');
-- Enquiries: Anyone can insert guest enquiry (ENQ-001), school staff read their own
CREATE POLICY "Public guest insert enquiry" ON public.school_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "School staff read enquiries" ON public.school_enquiries FOR SELECT USING (
    school_id IN (SELECT school_id FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);
-- Subscriptions: School staff read own subscription
CREATE POLICY "School staff read subscription" ON public.platform_subscriptions FOR SELECT USING (
    school_id IN (SELECT school_id FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);
CREATE POLICY "School staff read invoices" ON public.subscription_invoices FOR SELECT USING (
    school_id IN (SELECT school_id FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);
