-- ============================================================================
-- SKOOLFINDER GHANA: SUPPLIERS PORTAL STAGE 3 — ENGAGEMENT & PRIVATE INQUIRIES
-- Baseline: Master Blueprint v2.0 (SUP-02-04, SUP-03-08, SUP-06-03)
-- 100% Idempotent: Safe to execute on existing Supabase instances
-- ============================================================================

-- 1. GUEST & AUTHENTICATED SHORTLISTS TABLE (SUP-03-08)
CREATE TABLE IF NOT EXISTS public.supplier_shortlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT, -- For guest shortlists before login
    supplier_id VARCHAR(80) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplier_shortlists_user ON public.supplier_shortlists(user_id);
CREATE INDEX IF NOT EXISTS idx_supplier_shortlists_session ON public.supplier_shortlists(session_id);
CREATE INDEX IF NOT EXISTS idx_supplier_shortlists_supplier ON public.supplier_shortlists(supplier_id);

-- 2. STRUCTURED PRIVATE INQUIRIES & DIRECT INVITATIONS (SUP-02-04, SUP-06-03)
CREATE TABLE IF NOT EXISTS public.supplier_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_number TEXT UNIQUE NOT NULL, -- e.g. INQ-2026-10492
    sender_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_phone TEXT,
    school_id TEXT, -- Affiliated school ID if sent on behalf of a school
    school_name TEXT,
    supplier_id VARCHAR(80) NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    category_id VARCHAR(80),
    target_timeline TEXT, -- e.g. 'Within 2 weeks', 'Next academic term'
    estimated_volume TEXT, -- e.g. '500 sets', 'Whole school campus'
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'quoted', 'declined', 'closed')),
    direct_invitation BOOLEAN NOT NULL DEFAULT false, -- SUP-02-04: Directly invited responses bypass open-market quotas
    is_confidential BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplier_inquiries_sender ON public.supplier_inquiries(sender_user_id);
CREATE INDEX IF NOT EXISTS idx_supplier_inquiries_supplier ON public.supplier_inquiries(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_inquiries_school ON public.supplier_inquiries(school_id);
CREATE INDEX IF NOT EXISTS idx_supplier_inquiries_status ON public.supplier_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_supplier_inquiries_inq_no ON public.supplier_inquiries(inquiry_number);

-- 3. STRUCTURED INQUIRY MESSAGES THREAD (SUP-06-03)
CREATE TABLE IF NOT EXISTS public.supplier_inquiry_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID NOT NULL REFERENCES public.supplier_inquiries(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('school', 'supplier', 'admin')),
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplier_inquiry_messages_inq ON public.supplier_inquiry_messages(inquiry_id);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.supplier_shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_inquiry_messages ENABLE ROW LEVEL SECURITY;

-- Shortlists RLS: Users can view and manage their own shortlists (or session guest records)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_shortlists' AND policyname = 'user_manage_shortlists') THEN
        CREATE POLICY "user_manage_shortlists" ON public.supplier_shortlists
            FOR ALL USING (
                auth.uid() = user_id
                OR user_id IS NULL
                OR auth.jwt() ->> 'role' = 'super_admin'
            );
    END IF;
END $$;

-- Inquiries RLS: Sender, Recipient Supplier, or Super Admin can access the inquiry
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_inquiries' AND policyname = 'parties_read_inquiries') THEN
        CREATE POLICY "parties_read_inquiries" ON public.supplier_inquiries
            FOR SELECT USING (
                auth.uid() = sender_user_id
                OR auth.uid()::text = supplier_id
                OR auth.jwt() ->> 'role' = 'super_admin'
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_inquiries' AND policyname = 'authenticated_insert_inquiries') THEN
        CREATE POLICY "authenticated_insert_inquiries" ON public.supplier_inquiries
            FOR INSERT WITH CHECK (
                auth.role() = 'authenticated'
                OR auth.jwt() ->> 'role' = 'super_admin'
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_inquiries' AND policyname = 'parties_update_inquiries') THEN
        CREATE POLICY "parties_update_inquiries" ON public.supplier_inquiries
            FOR UPDATE USING (
                auth.uid() = sender_user_id
                OR auth.uid()::text = supplier_id
                OR auth.jwt() ->> 'role' = 'super_admin'
            );
    END IF;
END $$;

-- Inquiry Messages RLS: Thread participants can view and append messages
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_inquiry_messages' AND policyname = 'thread_participants_messages') THEN
        CREATE POLICY "thread_participants_messages" ON public.supplier_inquiry_messages
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.supplier_inquiries i
                    WHERE i.id = supplier_inquiry_messages.inquiry_id
                    AND (i.sender_user_id = auth.uid() OR i.supplier_id = auth.uid()::text OR auth.jwt() ->> 'role' = 'super_admin')
                )
            );
    END IF;
END $$;

SELECT 'SkoolFinder Ghana Suppliers Portal Stage 3 Migration Applied' AS migration_status;

