-- ====================================================================
-- SKOOLFINDER GHANA — PHASE 2B SCHEMA MIGRATION
-- INSTITUTIONAL MARKETPLACE: VACANCIES, TENDERS & MOMO ESCROW
-- Blueprint Reference: v2.0 Sections 6, 12, 13, 23, 25, 26.4
-- Packages: VAC-001 through VAC-006, TEN-001 through TEN-006, ESC-001 through ESC-004
-- ====================================================================

-- 1. SCHOOL VACANCIES & TEACHER RECRUITING (VAC-001, VAC-003, VAC-006)
CREATE TABLE IF NOT EXISTS public.school_vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    department TEXT NOT NULL DEFAULT 'Academics', -- e.g. Mathematics, Science, Languages, Early Years
    level TEXT NOT NULL DEFAULT 'Primary', -- e.g. Nursery/KG, Primary, JHS, SHS, Cambridge
    job_type TEXT NOT NULL DEFAULT 'full_time' CHECK (job_type IN ('full_time', 'part_time', 'contract', 'substitute')),
    curriculum TEXT NOT NULL DEFAULT 'GES / NaCCA', -- e.g. 'GES / NaCCA', 'British Cambridge', 'IB', 'Dual'
    min_qualification TEXT NOT NULL DEFAULT 'B.Ed', -- e.g. Diploma, B.Ed, PGDE, M.Ed
    min_experience_years INT NOT NULL DEFAULT 1,
    salary_range TEXT DEFAULT 'GH₵ 2,500 - 4,000 / month',
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    location TEXT DEFAULT 'Greater Accra',
    ntc_required BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'closed', 'expired')),
    application_deadline DATE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    is_addon_slot BOOLEAN NOT NULL DEFAULT FALSE,
    addon_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vacancies_school_id ON public.school_vacancies(school_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_status ON public.school_vacancies(status);
CREATE INDEX IF NOT EXISTS idx_vacancies_published_at ON public.school_vacancies(published_at DESC);

-- 2. VACANCY CANDIDATE APPLICATIONS (VAC-004, VAC-005)
CREATE TABLE IF NOT EXISTS public.vacancy_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vacancy_id UUID NOT NULL REFERENCES public.school_vacancies(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    ntc_number TEXT, -- National Teaching Council Teacher Licence / Registration Number
    ntc_verified BOOLEAN NOT NULL DEFAULT FALSE,
    qualification TEXT NOT NULL,
    years_experience INT NOT NULL DEFAULT 0,
    current_school TEXT,
    cv_url TEXT,
    cover_letter TEXT,
    expected_salary TEXT,
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'interview_scheduled', 'offered', 'rejected')),
    interview_date TIMESTAMPTZ,
    interview_mode TEXT DEFAULT 'in_person' CHECK (interview_mode IN ('in_person', 'google_meet', 'phone')),
    interview_notes TEXT,
    review_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vacancy_apps_vacancy ON public.vacancy_applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_vacancy_apps_school ON public.vacancy_applications(school_id);
CREATE INDEX IF NOT EXISTS idx_vacancy_apps_status ON public.vacancy_applications(status);

-- 3. B2B PROCUREMENT RFQS & TENDERS (TEN-001, TEN-003, TEN-004)
CREATE TABLE IF NOT EXISTS public.school_tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    reference_code TEXT NOT NULL UNIQUE, -- e.g. TND-2026-XXXXX
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. 'IT & Computers', 'Textbooks & Stationery', 'Food & Catering', 'Uniforms & Apparel', 'Science & Lab', 'Facility & Security'
    description TEXT NOT NULL,
    specifications TEXT,
    quantity TEXT NOT NULL,
    budget_currency TEXT NOT NULL DEFAULT 'GHS',
    budget_min NUMERIC(12, 2) DEFAULT 0,
    budget_max NUMERIC(12, 2) DEFAULT 0,
    delivery_deadline DATE NOT NULL,
    submission_deadline DATE NOT NULL,
    delivery_location TEXT DEFAULT 'Main Campus Gate',
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'reviewing', 'awarded', 'closed', 'cancelled')),
    awarded_bid_id UUID,
    awarded_supplier_name TEXT,
    awarded_amount NUMERIC(12, 2),
    escrow_status TEXT NOT NULL DEFAULT 'none' CHECK (escrow_status IN ('none', 'deposit_funded', 'goods_delivered', 'fully_disbursed', 'disputed')),
    credit_source TEXT NOT NULL DEFAULT 'monthly_quota' CHECK (credit_source IN ('monthly_quota', 'purchased_credit')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenders_school_id ON public.school_tenders(school_id);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON public.school_tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_submission_deadline ON public.school_tenders(submission_deadline);

-- 4. SUPPLIER TENDER BIDS (TEN-005, TEN-006)
CREATE TABLE IF NOT EXISTS public.tender_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL REFERENCES public.school_tenders(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    supplier_name TEXT NOT NULL,
    supplier_email TEXT NOT NULL,
    supplier_phone TEXT NOT NULL,
    supplier_rating NUMERIC(3, 1) NOT NULL DEFAULT 4.8,
    quote_amount NUMERIC(12, 2) NOT NULL,
    itemized_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    delivery_days_sla INT NOT NULL DEFAULT 7,
    warranty_terms TEXT DEFAULT '6 Months Manufacturer Guarantee',
    payment_terms TEXT DEFAULT '50% Mobilization / 50% upon Physical Inspection',
    proposal_notes TEXT,
    document_url TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'awarded', 'rejected')),
    awarded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tender_bids_tender ON public.tender_bids(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_bids_school ON public.tender_bids(school_id);
CREATE INDEX IF NOT EXISTS idx_tender_bids_status ON public.tender_bids(status);

-- 5. MARKETPLACE CREDITS LEDGER (VAC-002, TEN-002)
-- Tracks approved add-on purchases: Vacancy slot GH₵25/30d; Tender 1 credit GH₵45; 3 credits GH₵120
CREATE TABLE IF NOT EXISTS public.marketplace_credits_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('vacancy_slot', 'tender_credit')),
    quantity INT NOT NULL DEFAULT 1,
    amount_paid_ghs NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'momo' CHECK (payment_method IN ('momo', 'card', 'bank_transfer', 'admin_comp')),
    paystack_reference TEXT,
    credits_remaining INT NOT NULL DEFAULT 1,
    expires_at TIMESTAMPTZ, -- 30 days for vacancy slots; NULL for tender credits
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'exhausted', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credits_ledger_school ON public.marketplace_credits_ledger(school_id);
CREATE INDEX IF NOT EXISTS idx_credits_ledger_type_status ON public.marketplace_credits_ledger(item_type, status);

-- 6. TENDER 50/50 MOMO MILESTONE ESCROW (ESC-001, ESC-002, ESC-003)
CREATE TABLE IF NOT EXISTS public.tender_escrow_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL REFERENCES public.school_tenders(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    bid_id UUID NOT NULL REFERENCES public.tender_bids(id) ON DELETE CASCADE,
    milestone_index INT NOT NULL CHECK (milestone_index IN (1, 2)),
    milestone_name TEXT NOT NULL, -- Milestone 1: '50% Mobilization Deposit', Milestone 2: '50% Delivery Sign-off Balance'
    amount NUMERIC(12, 2) NOT NULL,
    percentage INT NOT NULL DEFAULT 50,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'funded_in_escrow', 'disbursed', 'disputed', 'refunded')),
    funded_at TIMESTAMPTZ,
    disbursed_at TIMESTAMPTZ,
    disbursement_reference TEXT,
    inspection_notes TEXT,
    signed_off_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    dispute_reason TEXT,
    disputed_at TIMESTAMPTZ,
    dispute_resolved_at TIMESTAMPTZ,
    dispute_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escrow_tender ON public.tender_escrow_milestones(tender_id);
CREATE INDEX IF NOT EXISTS idx_escrow_school ON public.tender_escrow_milestones(school_id);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON public.tender_escrow_milestones(status);

-- 7. TAMPER-EVIDENT MARKETPLACE AUDIT LOG (ESC-004)
CREATE TABLE IF NOT EXISTS public.marketplace_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL DEFAULT 'System / Staff',
    event_type TEXT NOT NULL, -- e.g. 'VACANCY_PUBLISHED', 'TENDER_AWARDED', 'ESCROW_DEPOSIT_LOCKED', 'DELIVERY_INSPECTED_50_RELEASED'
    entity_type TEXT NOT NULL, -- 'vacancy', 'application', 'tender', 'bid', 'escrow'
    entity_id TEXT NOT NULL,
    reference_code TEXT,
    amount NUMERIC(12, 2),
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_audit_school ON public.marketplace_audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_market_audit_created ON public.marketplace_audit_logs(created_at DESC);

-- 8. ROW LEVEL SECURITY POLICIES
ALTER TABLE public.school_vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancy_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_credits_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_escrow_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public view published vacancies" ON public.school_vacancies;
    DROP POLICY IF EXISTS "School staff manage vacancies" ON public.school_vacancies;
    DROP POLICY IF EXISTS "Candidates submit vacancy applications" ON public.vacancy_applications;
    DROP POLICY IF EXISTS "School staff view applicants" ON public.vacancy_applications;
    DROP POLICY IF EXISTS "Public view open tenders" ON public.school_tenders;
    DROP POLICY IF EXISTS "School staff manage tenders" ON public.school_tenders;
    DROP POLICY IF EXISTS "Suppliers submit bids" ON public.tender_bids;
    DROP POLICY IF EXISTS "School staff view tender bids" ON public.tender_bids;
    DROP POLICY IF EXISTS "School staff read credits" ON public.marketplace_credits_ledger;
    DROP POLICY IF EXISTS "School staff view escrow" ON public.tender_escrow_milestones;
    DROP POLICY IF EXISTS "School staff view audit log" ON public.marketplace_audit_logs;
END $$;

-- Public can view active published vacancies
CREATE POLICY "Public view published vacancies" ON public.school_vacancies FOR SELECT USING (status = 'published');

-- School staff manage their vacancies
CREATE POLICY "School staff manage vacancies" ON public.school_vacancies FOR ALL USING (
    school_id IN (SELECT school_id FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);

-- Public can insert candidate applications
CREATE POLICY "Candidates submit vacancy applications" ON public.vacancy_applications FOR INSERT WITH CHECK (true);

-- School staff view candidate dossiers for their school
CREATE POLICY "School staff view applicants" ON public.vacancy_applications FOR ALL USING (
    school_id IN (SELECT school_id FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);

-- Public can view open tenders
CREATE POLICY "Public view open tenders" ON public.school_tenders FOR SELECT USING (status IN ('open', 'reviewing'));

-- School staff manage tenders
CREATE POLICY "School staff manage tenders" ON public.school_tenders FOR ALL USING (
    school_id IN (SELECT school_id FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);

-- Verified suppliers or public can submit bids
CREATE POLICY "Suppliers submit bids" ON public.tender_bids FOR INSERT WITH CHECK (true);

-- School staff view bids for their tenders
CREATE POLICY "School staff view tender bids" ON public.tender_bids FOR ALL USING (
    school_id IN (SELECT school_id FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);

-- School staff read credit ledger
CREATE POLICY "School staff read credits" ON public.marketplace_credits_ledger FOR SELECT USING (
    school_id IN (SELECT school_id FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);

-- School staff view escrow milestones
CREATE POLICY "School staff view escrow" ON public.tender_escrow_milestones FOR ALL USING (
    school_id IN (SELECT school_id FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);

-- School staff view marketplace audit log
CREATE POLICY "School staff view audit log" ON public.marketplace_audit_logs FOR SELECT USING (
    school_id IN (SELECT school_id FROM public.school_memberships WHERE user_id = auth.uid() AND status = 'active')
    OR auth.role() = 'service_role'
);
