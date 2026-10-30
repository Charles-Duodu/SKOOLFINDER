-- ====================================================================
-- SKOOLFINDER SAAS BACKEND - POSTGRESQL SCHEMA (SUPABASE)
-- Architecture: Supabase Auth + RLS + Enrolments + Multi-Portal Directory
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. PROFILES (Extends auth.users or standalone auth)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Links to Supabase auth.users.id if using Supabase Auth
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'teacher', 'supplier', 'school_admin', 'super_admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 2. PORTAL ENROLMENTS (Users can enrol in multiple portals)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.portal_enrolments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    portal_type TEXT NOT NULL CHECK (portal_type IN ('parent', 'teacher', 'supplier', 'school_admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, portal_type)
);

-- ====================================================================
-- 3. ORGANISATIONS (Schools and Suppliers)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('school', 'supplier')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 4. ORGANISATION MEMBERSHIPS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.organisation_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'manager', 'editor', 'billing')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organisation_id, user_id)
);

-- ====================================================================
-- 5. SCHOOLS DIRECTORY
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    organisation_id UUID REFERENCES public.organisations(id) ON DELETE SET NULL,
    ownership_type TEXT DEFAULT 'Private' CHECK (ownership_type IN ('Private', 'Public', 'Mission/Faith-based')),
    education_level TEXT[] DEFAULT '{"Primary"}', -- Nursery, Kindergarten, Primary, JHS, SHS
    curriculum TEXT[] DEFAULT '{"GES"}', -- GES, Cambridge, IB, Montessori, American
    region TEXT DEFAULT 'Greater Accra',
    district TEXT DEFAULT 'Accra Metropolitan',
    locality TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    description TEXT,
    facilities TEXT[] DEFAULT '{}',
    gender_type TEXT DEFAULT 'Mixed' CHECK (gender_type IN ('Boys', 'Girls', 'Mixed')),
    boarding_type TEXT DEFAULT 'Day' CHECK (boarding_type IN ('Day', 'Boarding', 'Day & Boarding')),
    tuition_min NUMERIC(12, 2),
    tuition_max NUMERIC(12, 2),
    currency TEXT DEFAULT 'GHS',
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'suspended')),
    rating NUMERIC(3, 2) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 6. SCHOOL CLAIMS (Claiming school ownership)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.school_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    claimant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- ====================================================================
-- 7. TEACHERS DIRECTORY
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    subjects TEXT[] DEFAULT '{}',
    levels TEXT[] DEFAULT '{}',
    region TEXT DEFAULT 'Greater Accra',
    service_area TEXT,
    teaching_format TEXT DEFAULT 'Both' CHECK (teaching_format IN ('In-Person', 'Online', 'Both')),
    hourly_rate NUMERIC(10, 2),
    currency TEXT DEFAULT 'GHS',
    avatar_url TEXT,
    phone TEXT,
    email TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    rating NUMERIC(3, 2) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 8. SUPPLIERS DIRECTORY
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID REFERENCES public.organisations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    region TEXT DEFAULT 'Greater Accra',
    service_area TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    rating NUMERIC(3, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 9. SUPPLIER PRODUCTS / SERVICES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.supplier_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2),
    currency TEXT DEFAULT 'GHS',
    image_url TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 10. BOOKMARKS (Saved schools, teachers, suppliers)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_type TEXT NOT NULL CHECK (listing_type IN ('school', 'teacher', 'supplier')),
    listing_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_type, listing_id)
);

-- ====================================================================
-- 11. ENQUIRIES & MESSAGING
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('school', 'teacher', 'supplier')),
    recipient_id UUID NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.enquiry_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 12. REVIEWS & RATINGS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('school', 'teacher', 'supplier')),
    target_id UUID NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('pending', 'published', 'flagged')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 13. AUDIT LOGS (Security & Compliance)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_schools_slug ON public.schools(slug);
CREATE INDEX IF NOT EXISTS idx_schools_region ON public.schools(region);
CREATE INDEX IF NOT EXISTS idx_schools_status ON public.schools(status);
CREATE INDEX IF NOT EXISTS idx_teachers_region ON public.teachers(region);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON public.teachers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_category ON public.suppliers(category);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON public.suppliers(status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_sender ON public.enquiries(sender_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_recipient ON public.enquiries(recipient_type, recipient_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users read and update their own, public can see basic creator info
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);

-- Schools: public can read published schools
CREATE POLICY "Public read published schools" ON public.schools FOR SELECT USING (status = 'published');
CREATE POLICY "Admin write schools" ON public.schools FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role IN ('super_admin', 'school_admin'))
);

-- Teachers: public can read published teachers
CREATE POLICY "Public read published teachers" ON public.teachers FOR SELECT USING (status = 'published');
CREATE POLICY "Teachers manage own profile" ON public.teachers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = teachers.user_id AND auth_user_id = auth.uid())
);

-- Suppliers: public can read published suppliers
CREATE POLICY "Public read published suppliers" ON public.suppliers FOR SELECT USING (status = 'published');
CREATE POLICY "Suppliers manage own profile" ON public.suppliers FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = suppliers.user_id AND auth_user_id = auth.uid())
);

-- Bookmarks: only the owner can read/write their own bookmarks
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = bookmarks.user_id AND auth_user_id = auth.uid())
);

-- Enquiries: sender and recipient can read their enquiries
CREATE POLICY "Users read own enquiries" ON public.enquiries FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = enquiries.sender_id AND auth_user_id = auth.uid())
);
CREATE POLICY "Users create enquiries" ON public.enquiries FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = enquiries.sender_id AND auth_user_id = auth.uid())
);

