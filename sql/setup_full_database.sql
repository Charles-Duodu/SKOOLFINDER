-- ====================================================================
-- SKOOLFINDER SAAS COMPLETE DATABASE SETUP
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Paste & Run
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. DROP TABLES IF NEEDED FOR CLEAN REBUILD (Optional safety)
-- DROP TABLE IF EXISTS public.audit_logs CASCADE;
-- DROP TABLE IF EXISTS public.reviews CASCADE;
-- DROP TABLE IF EXISTS public.enquiry_messages CASCADE;
-- DROP TABLE IF EXISTS public.enquiries CASCADE;
-- DROP TABLE IF EXISTS public.bookmarks CASCADE;
-- DROP TABLE IF EXISTS public.supplier_products CASCADE;
-- DROP TABLE IF EXISTS public.suppliers CASCADE;
-- DROP TABLE IF EXISTS public.teachers CASCADE;
-- DROP TABLE IF EXISTS public.school_claims CASCADE;
-- DROP TABLE IF EXISTS public.schools CASCADE;
-- DROP TABLE IF EXISTS public.organisation_memberships CASCADE;
-- DROP TABLE IF EXISTS public.organisations CASCADE;
-- DROP TABLE IF EXISTS public.portal_enrolments CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('parent', 'teacher', 'supplier', 'school_admin', 'super_admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PORTAL ENROLMENTS
CREATE TABLE IF NOT EXISTS public.portal_enrolments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    portal_type TEXT NOT NULL CHECK (portal_type IN ('parent', 'teacher', 'supplier', 'school_admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, portal_type)
);

-- 5. ORGANISATIONS (Schools and Suppliers)
CREATE TABLE IF NOT EXISTS public.organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('school', 'supplier')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORGANISATION MEMBERSHIPS
CREATE TABLE IF NOT EXISTS public.organisation_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'manager', 'editor', 'billing')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organisation_id, user_id)
);

-- 7. SCHOOLS
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    organisation_id UUID REFERENCES public.organisations(id) ON DELETE SET NULL,
    ownership_type TEXT DEFAULT 'Private' CHECK (ownership_type IN ('Private', 'Public', 'Mission/Faith-based')),
    education_level TEXT[] DEFAULT '{"Primary"}',
    curriculum TEXT[] DEFAULT '{"GES"}',
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

-- 8. SCHOOL CLAIMS
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

-- 9. TEACHERS
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

-- 10. SUPPLIERS
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

-- 11. SUPPLIER PRODUCTS
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

-- 12. RFQS (Procurement Requests for Quotation)
CREATE TABLE IF NOT EXISTS public.rfqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    school_name TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    budget NUMERIC(12, 2),
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Awarded', 'Closed')),
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. RFQ QUOTES (Supplier bids)
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

-- 14. BOOKMARKS
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_type TEXT NOT NULL CHECK (listing_type IN ('school', 'teacher', 'supplier')),
    listing_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_type, listing_id)
);

-- 15. ENQUIRIES & MESSAGING
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

-- 16. REVIEWS
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

-- 17. AUDIT LOGS
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

-- 18. INDEXES
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

-- 19. SEED DEFAULT ADMIN PROFILE
INSERT INTO public.profiles (id, email, full_name, phone, role, status)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'admin@skoolfinder.com.gh', 'System Administrator', '+233244000111', 'super_admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- 20. SEED SCHOOLS
INSERT INTO public.schools (
    slug, name, ownership_type, education_level, curriculum, 
    region, district, locality, address, phone, email, website, 
    logo_url, banner_url, description, facilities, gender_type, 
    boarding_type, tuition_min, tuition_max, currency, is_verified, is_featured, rating, review_count
) VALUES
(
    'ghana-international-school',
    'Ghana International School (GIS)',
    'Private',
    ARRAY['Nursery', 'Kindergarten', 'Primary', 'JHS', 'SHS'],
    ARRAY['Cambridge', 'British National'],
    'Greater Accra',
    'Accra Metropolitan',
    'Cantonments',
    '2nd Circular Road, Cantonments, Accra',
    '+233 30 277 7163',
    'principal@gis.edu.gh',
    'https://gis.edu.gh',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200',
    'Ghana International School is a prestigious non-profit, co-educational day school in Cantonments, Accra, providing world-class Cambridge International education from nursery through A-Levels.',
    ARRAY['Science Laboratories', 'Olympic Swimming Pool', 'Robotics & STEM Centre', 'Modern ICT Suites', 'Auditorium', 'Sports Pavilion', 'Library & Media Resource Centre'],
    'Mixed',
    'Day',
    15000.00,
    35000.00,
    'GHS',
    TRUE,
    TRUE,
    4.9,
    142
),
(
    'achimota-school',
    'Achimota School',
    'Public',
    ARRAY['SHS'],
    ARRAY['GES', 'WASSCE'],
    'Greater Accra',
    'Okaikwei North',
    'Achimota',
    'Achimota, Accra, Ghana',
    '+233 30 240 0115',
    'info@achimota.edu.gh',
    'https://achimotaschool.edu.gh',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300',
    'https://images.unsplash.com/photo-1562774053-701939374585?w=1200',
    'Achimota School, nicknamed Motown, is Ghana''s historic co-educational senior high school founded in 1927. Known for academic excellence, holistic education, and producing African leaders.',
    ARRAY['Extensive Library', 'Science Complex', 'Cadet Corps Grounds', 'Boarding Houses', 'Athletics Oval', 'Music School', 'Botanical Gardens'],
    'Mixed',
    'Boarding',
    1800.00,
    3200.00,
    'GHS',
    TRUE,
    TRUE,
    4.8,
    210
),
(
    'sos-hermann-gmeiner-international-college',
    'SOS-Hermann Gmeiner International College (HGIC)',
    'Private',
    ARRAY['SHS'],
    ARRAY['IB', 'Cambridge'],
    'Greater Accra',
    'Tema Metropolitan',
    'Tema Community 6',
    'Tema Community 6, Greater Accra',
    '+233 30 320 2907',
    'admissions@soshgic.edu.gh',
    'https://soshgic.edu.gh',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
    'SOS-HGIC is an elite selective preparatory college in Tema offering the International Baccalaureate (IB) Diploma and IGCSE programs for Pan-African academic scholars.',
    ARRAY['IB Science Labs', 'Performing Arts Theatre', 'Digital Learning Hub', 'Hostels', 'Tennis Courts', 'Cafeteria'],
    'Mixed',
    'Boarding',
    25000.00,
    60000.00,
    'GHS',
    TRUE,
    TRUE,
    4.9,
    98
),
(
    'presbyterian-boys-secondary-school',
    'Presbyterian Boys'' Secondary School (PRESEC Legon)',
    'Public',
    ARRAY['SHS'],
    ARRAY['GES', 'WASSCE'],
    'Greater Accra',
    'La Nkwantanang Madina',
    'Legon',
    'Legon, Accra, Ghana',
    '+233 30 250 0844',
    'contact@preseclegon.edu.gh',
    'https://preseclegon.edu.gh',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200',
    'PRESEC Legon is Ghana''s premier boys secondary school, famous for having won the National Science and Maths Quiz (NSMQ) a record 8 times.',
    ARRAY['NSMQ Training Centre', 'Robotics Innovation Lab', 'Physics & Chemistry Labs', 'Boarding Houses', 'Football Stadium', 'Chapel'],
    'Boys',
    'Day & Boarding',
    1500.00,
    2900.00,
    'GHS',
    TRUE,
    TRUE,
    4.9,
    315
),
(
    'the-roman-ridge-school',
    'The Roman Ridge School',
    'Private',
    ARRAY['Nursery', 'Kindergarten', 'Primary', 'JHS', 'SHS'],
    ARRAY['Cambridge', 'British National'],
    'Greater Accra',
    'Ayawaso West',
    'Roman Ridge',
    'Roman Ridge, Accra',
    '+233 30 277 8264',
    'admin@theromanridgeschool.com',
    'https://theromanridgeschool.com',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300',
    'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200',
    'The Roman Ridge School is a private co-educational day school providing British education up to Cambridge A-Levels with exceptional pastoral care and leadership training.',
    ARRAY['Modern Classrooms', 'STEM Labs', 'Art & Design Studios', 'Sports Arena', 'Computer Lab', 'Canteen'],
    'Mixed',
    'Day',
    12000.00,
    28000.00,
    'GHS',
    TRUE,
    FALSE,
    4.7,
    76
),
(
    'morning-star-school',
    'Morning Star School',
    'Private',
    ARRAY['Nursery', 'Kindergarten', 'Primary', 'JHS'],
    ARRAY['GES', 'Montessori'],
    'Greater Accra',
    'Accra Metropolitan',
    'Cantonments',
    'Cantonments, Accra',
    '+233 30 277 3488',
    'info@morningstarschool.edu.gh',
    'https://morningstarschool.edu.gh',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    'Morning Star School is one of Accra''s most distinguished private basic schools, celebrating over 50 years of academic excellence and Christian values.',
    ARRAY['Early Childhood Wing', 'Computer Lab', 'Science Lab', 'Library', 'Playgrounds', 'Music Room'],
    'Mixed',
    'Day',
    4500.00,
    9500.00,
    'GHS',
    TRUE,
    FALSE,
    4.8,
    114
)
ON CONFLICT (slug) DO NOTHING;

-- 21. SEED TEACHERS
INSERT INTO public.teachers (
    full_name, title, bio, subjects, levels, region, service_area, 
    teaching_format, hourly_rate, currency, is_verified, verification_status, status, rating, review_count
) VALUES
(
    'Emmanuel Kwame Boateng',
    'Senior Mathematics & Physics Specialist',
    'Experienced Cambridge IGCSE and WASSCE Elective Maths master with 12+ years preparing students for national awards and top university admissions.',
    ARRAY['Elective Mathematics', 'Core Mathematics', 'Physics', 'Robotics'],
    ARRAY['JHS', 'SHS', 'A-Levels'],
    'Greater Accra',
    'East Legon, Airport, Dzorwulu, Cantonments',
    'Both',
    120.00,
    'GHS',
    TRUE,
    'approved',
    'published',
    4.9,
    45
),
(
    'Dr. Araba Mensah',
    'Chemistry & Biology Educator',
    'PhD in Biochemistry, University of Ghana. Specialises in Cambridge AS/A-Level Biology and Chemistry with hands-on conceptual understanding.',
    ARRAY['Chemistry', 'Biology', 'Integrated Science'],
    ARRAY['SHS', 'IGCSE', 'A-Levels', 'IB'],
    'Greater Accra',
    'Cantonments, Labone, Osu, Ridge',
    'Both',
    150.00,
    'GHS',
    TRUE,
    'approved',
    'published',
    5.0,
    38
),
(
    'Kofi Addo-Mensah',
    'French & English Language Consultant',
    'Bilingual educator certified by DELF/DALF and Alliance Française. Expertise in BECE French preparation and Cambridge First Language English.',
    ARRAY['French', 'English Language', 'Literature-in-English'],
    ARRAY['Primary', 'JHS', 'SHS'],
    'Greater Accra',
    'Tema, Spintex, Sakumono',
    'In-Person',
    90.00,
    'GHS',
    TRUE,
    'approved',
    'published',
    4.8,
    29
)
ON CONFLICT DO NOTHING;

-- 22. SEED SUPPLIERS
INSERT INTO public.suppliers (
    company_name, category, description, region, service_area, 
    phone, email, website, is_verified, status, rating
) VALUES
(
    'Aki-Ola Publications Ghana',
    'Books & Stationery',
    'Ghana''s leading educational book publishers, providing comprehensive BECE and WASSCE textbooks, past question solutions, and study guides across all regions.',
    'Greater Accra',
    'Nationwide Delivery (Accra, Kumasi, Takoradi, Tamale)',
    '+233 30 222 1888',
    'sales@akiolapublications.com',
    'https://akiolapublications.com',
    TRUE,
    'published',
    4.9
),
(
    'AfriRobotics STEM Learning Kits',
    'IT & Robotics',
    'Suppliers of hands-on LEGO robotics, Arduino kits, 3D printers, and coding curriculum for primary and secondary schools in West Africa.',
    'Greater Accra',
    'Greater Accra, Central & Ashanti Regions',
    '+233 24 555 8921',
    'orders@afrirobotics.edu.gh',
    'https://afrirobotics.edu.gh',
    TRUE,
    'published',
    4.8
),
(
    'Heritage School Uniforms & Tailoring',
    'Uniforms & Clothing',
    'Custom school crest embroidery, durable blazer fabrics, PE kits, and graduation regalia serving over 80 private and international schools in Ghana.',
    'Greater Accra',
    'Accra & Tema Metropolitans',
    '+233 20 812 3456',
    'contact@heritageschoolwear.com',
    'https://heritageschoolwear.com',
    TRUE,
    'published',
    4.7
)
ON CONFLICT DO NOTHING;

-- 23. SEED SAMPLE RFQ
INSERT INTO public.rfqs (
    school_name, title, category, description, budget, status, deadline
) VALUES
(
    'Ghana International School (GIS)',
    'Supply of 150 Robotics & STEM Microcontroller Starter Kits',
    'IT & Robotics',
    'Seeking accredited suppliers for Arduino & ESP32 STEM kits with sensor modules for secondary robotics lab.',
    45000.00,
    'Open',
    NOW() + INTERVAL '30 days'
)
ON CONFLICT DO NOTHING;

