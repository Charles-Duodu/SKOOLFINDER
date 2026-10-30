-- ====================================================================
-- SKOOLFINDER PHASE 2 TABLES: CLAIMS, REVIEWS & RFQ TENDERS
-- Run in Supabase SQL Editor: New Query -> Paste & Run
-- ====================================================================

-- 1. SCHOOL CLAIMS (Official ownership claims)
CREATE TABLE IF NOT EXISTS public.school_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    claimant_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    official_role TEXT NOT NULL,
    official_email TEXT NOT NULL,
    official_phone TEXT NOT NULL,
    evidence_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_role TEXT DEFAULT 'Parent / Guardian',
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    helpful_count INT DEFAULT 0,
    status TEXT DEFAULT 'published' CHECK (status IN ('pending', 'published', 'flagged')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RFQS (Procurement Requests for Quotation)
CREATE TABLE IF NOT EXISTS public.rfqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    school_name TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    budget NUMERIC(12, 2),
    budget_range TEXT,
    quantity TEXT,
    region TEXT DEFAULT 'Greater Accra',
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Awarded', 'Closed')),
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RFQ QUOTES (Supplier bids)
CREATE TABLE IF NOT EXISTS public.rfq_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    supplier_name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Accepted', 'Rejected', 'Awarded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.school_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_quotes ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Public read published reviews" ON public.reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Public read rfqs" ON public.rfqs FOR SELECT USING (true);
CREATE POLICY "Public read quotes" ON public.rfq_quotes FOR SELECT USING (true);
CREATE POLICY "Insert claims" ON public.school_claims FOR INSERT WITH CHECK (true);
