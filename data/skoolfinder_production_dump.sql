-- ==============================================================================
-- SkoolFinder Ghana - Complete Relational Database Dump
-- Generated: 2026-10-29T22:35:23.747Z
-- Compatible with PostgreSQL 14, 15, 16
-- ==============================================================================

-- ==============================================================================
-- SkoolFinder Ghana - Production PostgreSQL Relational Schema
-- Enterprise Architecture: 33 Relational Collections with Indexed Lookups
-- Compatible with PostgreSQL 14, 15, 16 (Neon, Supabase, AWS RDS, Docker)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Schools Directory & Accreditation
CREATE TABLE IF NOT EXISTS schools (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    motto VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    region VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    suburb VARCHAR(100) NOT NULL,
    address TEXT,
    map_location TEXT,
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    tuition_base NUMERIC(12, 2) DEFAULT 0,
    bus_fee NUMERIC(12, 2) DEFAULT 0,
    lunch_fee NUMERIC(12, 2) DEFAULT 0,
    boarding_fee NUMERIC(12, 2) DEFAULT 0,
    levels JSONB DEFAULT '[]'::jsonb,
    curriculum JSONB DEFAULT '[]'::jsonb,
    boarding_type VARCHAR(50) DEFAULT 'Day Only',
    gender VARCHAR(50) DEFAULT 'Co-educational',
    fee_band VARCHAR(100),
    established INT,
    student_teacher_ratio VARCHAR(20),
    verified BOOLEAN DEFAULT false,
    claimed BOOLEAN DEFAULT false,
    package_tier VARCHAR(50) DEFAULT 'Standard',
    admissions_status VARCHAR(100) DEFAULT 'Admissions Open',
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(150),
    website VARCHAR(255),
    cover_image TEXT,
    banner_type VARCHAR(50),
    facilities JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    head_of_school VARCHAR(150),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_schools_region ON schools(region);
CREATE INDEX IF NOT EXISTS idx_schools_suburb ON schools(suburb);
CREATE INDEX IF NOT EXISTS idx_schools_featured ON schools(featured);

-- 2. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50),
    name VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'parent', 'school_admin', 'teacher', 'super_admin'
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE SET NULL,
    avatar VARCHAR(100),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Sessions & Tokens
CREATE TABLE IF NOT EXISTS sessions (
    token VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Digital Student Admissions & Applications
CREATE TABLE IF NOT EXISTS admission_applications (
    id VARCHAR(100) PRIMARY KEY,
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    student_first_name VARCHAR(100) NOT NULL,
    student_last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    grade_applying VARCHAR(50) NOT NULL,
    academic_year VARCHAR(50) DEFAULT '2026/2027',
    parent_name VARCHAR(150) NOT NULL,
    parent_email VARCHAR(150) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    offer_letter_issued BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admissions_school ON admission_applications(school_id);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admission_applications(status);

-- 5. Student Fee Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(100) PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    student_id VARCHAR(100),
    grade_level VARCHAR(50),
    term VARCHAR(50) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    parent_name VARCHAR(150),
    parent_email VARCHAR(150),
    parent_phone VARCHAR(50),
    tuition_amount NUMERIC(12, 2) DEFAULT 0,
    bus_amount NUMERIC(12, 2) DEFAULT 0,
    lunch_amount NUMERIC(12, 2) DEFAULT 0,
    pta_amount NUMERIC(12, 2) DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    amount_paid NUMERIC(12, 2) DEFAULT 0,
    balance NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'unpaid',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_school ON invoices(school_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- 6. Financial Transactions & MoMo Settlements
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(100) PRIMARY KEY,
    reference VARCHAR(150) UNIQUE NOT NULL,
    invoice_id VARCHAR(100) REFERENCES invoices(id) ON DELETE SET NULL,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE SET NULL,
    payer_name VARCHAR(150),
    payer_phone VARCHAR(50),
    payer_email VARCHAR(150),
    amount_ghs NUMERIC(12, 2) NOT NULL,
    gateway VARCHAR(50) DEFAULT 'paystack',
    channel VARCHAR(50),
    network VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    gateway_reference VARCHAR(150),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_ref ON transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_invoice ON transactions(invoice_id);

-- 7. Verified Parent Reviews & Ratings
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    author_name VARCHAR(150) NOT NULL,
    author_email VARCHAR(150),
    parent_child_grade VARCHAR(50),
    verified_parent BOOLEAN DEFAULT false,
    rating_overall NUMERIC(2, 1) NOT NULL,
    rating_academics NUMERIC(2, 1),
    rating_facilities NUMERIC(2, 1),
    rating_discipline NUMERIC(2, 1),
    rating_fees_value NUMERIC(2, 1),
    title VARCHAR(255),
    content TEXT NOT NULL,
    helpful_count INT DEFAULT 0,
    headteacher_reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_school ON reviews(school_id);

-- 8. Direct Admissions Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(100) PRIMARY KEY,
    inquiry_number VARCHAR(100) UNIQUE NOT NULL,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    parent_name VARCHAR(150) NOT NULL,
    parent_email VARCHAR(150),
    parent_phone VARCHAR(50) NOT NULL,
    child_grade_applying VARCHAR(50),
    category VARCHAR(100) DEFAULT 'Admissions Inquiry',
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    replies JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_school ON inquiries(school_id);

-- 9. Educational Suppliers Directory
CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(100) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    contact_person VARCHAR(150),
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),
    email VARCHAR(150),
    website VARCHAR(255),
    location VARCHAR(150) NOT NULL,
    region VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100),
    verified BOOLEAN DEFAULT false,
    products_catalog JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. School Requests for Quotation (RFQs / Tenders)
CREATE TABLE IF NOT EXISTS rfqs (
    id VARCHAR(100) PRIMARY KEY,
    rfq_number VARCHAR(100) UNIQUE NOT NULL,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    unit_description VARCHAR(100),
    delivery_deadline DATE,
    budget_range_ghs VARCHAR(100),
    specifications TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Supplier Quotations / Commercial Bids
CREATE TABLE IF NOT EXISTS quotes (
    id VARCHAR(100) PRIMARY KEY,
    rfq_id VARCHAR(100) REFERENCES rfqs(id) ON DELETE CASCADE,
    supplier_id VARCHAR(100) REFERENCES suppliers(id) ON DELETE CASCADE,
    vendor_name VARCHAR(150) NOT NULL,
    vendor_phone VARCHAR(50) NOT NULL,
    unit_price_ghs NUMERIC(12, 2) NOT NULL,
    total_price_ghs NUMERIC(12, 2) NOT NULL,
    delivery_timeframe_days INT,
    warranty_terms VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Teaching Vacancies & Jobs
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    level VARCHAR(100) NOT NULL,
    curriculum VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    salary_range_ghs VARCHAR(100),
    qualification_required VARCHAR(255),
    experience_years INT DEFAULT 1,
    description TEXT NOT NULL,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
    id VARCHAR(100) PRIMARY KEY,
    job_id VARCHAR(100) REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    qualification VARCHAR(255),
    ntc_license_number VARCHAR(100),
    years_experience INT,
    notes TEXT,
    resume_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Private Tutors & Teachers Directory
CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    subjects JSONB DEFAULT '[]'::jsonb,
    curriculum JSONB DEFAULT '[]'::jsonb,
    levels JSONB DEFAULT '[]'::jsonb,
    teaching_mode VARCHAR(150) DEFAULT 'Hybrid',
    hourly_rate_ghs NUMERIC(10, 2) NOT NULL,
    region VARCHAR(100) NOT NULL,
    suburb VARCHAR(100),
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),
    email VARCHAR(150),
    ntc_licensed BOOLEAN DEFAULT true,
    qualification VARCHAR(255),
    bio TEXT,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. CSSPS Senior High Placement Data
CREATE TABLE IF NOT EXISTS cssps_schools (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ges_code VARCHAR(50) UNIQUE,
    category VARCHAR(20) NOT NULL,
    region VARCHAR(100) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    boarding_status VARCHAR(50) NOT NULL,
    programs JSONB DEFAULT '[]'::jsonb,
    cutoff_aggregates JSONB DEFAULT '{}'::jsonb,
    competition_rating VARCHAR(50) DEFAULT 'Very High'
);

-- 16. Academic Resources & Past Questions
CREATE TABLE IF NOT EXISTS academic_resources (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    paper_number VARCHAR(50),
    file_type VARCHAR(20) DEFAULT 'PDF',
    file_size VARCHAR(50),
    download_url TEXT,
    has_solutions BOOLEAN DEFAULT true,
    has_chief_examiner_report BOOLEAN DEFAULT false,
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Hubtel SMS Logs & Credit Telemetry
CREATE TABLE IF NOT EXISTS sms_logs (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE SET NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    message_text TEXT NOT NULL,
    channel VARCHAR(50) DEFAULT 'Hubtel SMS',
    sender_id VARCHAR(50) DEFAULT 'SkoolFinder',
    hubtel_message_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'delivered',
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sms_credits (
    school_id VARCHAR(100) PRIMARY KEY REFERENCES schools(id) ON DELETE CASCADE,
    balance INT DEFAULT 500,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Terminal Report Cards & Continuous Assessment
CREATE TABLE IF NOT EXISTS report_cards (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    student_id VARCHAR(100),
    grade_level VARCHAR(50) NOT NULL,
    term VARCHAR(50) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    parent_email VARCHAR(150),
    grades JSONB DEFAULT '[]'::jsonb,
    gpa NUMERIC(3, 2),
    class_rank VARCHAR(20),
    attendance_rate VARCHAR(20),
    conduct VARCHAR(100),
    teacher_remarks TEXT,
    headteacher_remarks TEXT,
    status VARCHAR(50) DEFAULT 'published',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Transport Routes & Bus Tracking
CREATE TABLE IF NOT EXISTS transport_routes (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    route_name VARCHAR(150) NOT NULL,
    bus_number VARCHAR(50) NOT NULL,
    driver_name VARCHAR(150) NOT NULL,
    driver_phone VARCHAR(50) NOT NULL,
    current_status VARCHAR(50) DEFAULT 'on_time',
    delay_minutes INT DEFAULT 0,
    stops JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_bus_passes (
    id VARCHAR(100) PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    parent_email VARCHAR(150) NOT NULL,
    route_id VARCHAR(100) REFERENCES transport_routes(id) ON DELETE CASCADE,
    pickup_stop VARCHAR(150) NOT NULL,
    dropoff_stop VARCHAR(150) NOT NULL,
    pass_status VARCHAR(50) DEFAULT 'active',
    qr_token VARCHAR(255) UNIQUE NOT NULL,
    valid_until DATE
);

-- 20. Medical Sickbay & Health Clinic
CREATE TABLE IF NOT EXISTS medical_records (
    student_id VARCHAR(100) PRIMARY KEY,
    student_name VARCHAR(150) NOT NULL,
    blood_group VARCHAR(10),
    genotype VARCHAR(10),
    allergies JSONB DEFAULT '[]'::jsonb,
    chronic_conditions JSONB DEFAULT '[]'::jsonb,
    emergency_contact_name VARCHAR(150) NOT NULL,
    emergency_contact_phone VARCHAR(50) NOT NULL,
    dietary_requirements TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sickbay_logs (
    id VARCHAR(100) PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    symptoms TEXT NOT NULL,
    temperature_celsius NUMERIC(4, 1),
    diagnosis TEXT,
    treatment_given TEXT,
    admitted_to_bed BOOLEAN DEFAULT false,
    nurse_name VARCHAR(150) NOT NULL,
    parent_alerted BOOLEAN DEFAULT false
);

-- 21. Library Catalog & Textbook Lending
CREATE TABLE IF NOT EXISTS library_books (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50),
    category VARCHAR(100),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    shelf_location VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS library_loans (
    id VARCHAR(100) PRIMARY KEY,
    book_id VARCHAR(100) REFERENCES library_books(id) ON DELETE CASCADE,
    book_title VARCHAR(255) NOT NULL,
    student_id VARCHAR(100) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    borrowed_date DATE NOT NULL,
    due_date DATE NOT NULL,
    returned_date DATE,
    status VARCHAR(50) DEFAULT 'borrowed',
    fine_amount_ghs NUMERIC(10, 2) DEFAULT 0
);

-- 22. Digital Student & Staff IDs with QR Verification
CREATE TABLE IF NOT EXISTS student_digital_ids (
    id VARCHAR(100) PRIMARY KEY,
    index_number VARCHAR(100) UNIQUE NOT NULL,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    house VARCHAR(100),
    photo_url TEXT,
    blood_group VARCHAR(10),
    genotype VARCHAR(10),
    medical_alert VARCHAR(255),
    bus_pass_route VARCHAR(150),
    bus_pass_status VARCHAR(50),
    qr_verification_code VARCHAR(255) UNIQUE NOT NULL,
    signature_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    issued_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_digital_id_index ON student_digital_ids(index_number);
CREATE INDEX IF NOT EXISTS idx_digital_id_qr ON student_digital_ids(qr_verification_code);

-- 23. Leads & Conversion Telemetry
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100),
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 24. Claims for Verification
CREATE TABLE IF NOT EXISTS claims (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    claimant_name VARCHAR(150) NOT NULL,
    claimant_role VARCHAR(100) NOT NULL,
    official_phone VARCHAR(50) NOT NULL,
    official_email VARCHAR(150),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending_verification',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 25. Institutional Verification Vault
CREATE TABLE IF NOT EXISTS verification_docs (
    id VARCHAR(100) PRIMARY KEY,
    entity_id VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) DEFAULT 'school',
    doc_type VARCHAR(100) NOT NULL,
    doc_name VARCHAR(255) NOT NULL,
    doc_number VARCHAR(100),
    file_url TEXT,
    status VARCHAR(50) DEFAULT 'verified',
    notes TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 26. Parent School Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
    school_id VARCHAR(100) REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, school_id)
);


-- Schools Data (16 records)
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-gis-accra', 'Ghana International School (GIS)', 'Understanding of Each Other', 'ghana-international-school', 'Greater Accra', 'Cantonments', 12500, 1953, '+233 30 277 7163', '+233 24 431 8900', 'admissions@gis.edu.gh', 'https://gis.edu.gh', 'Ghana International School provides an internationally recognized education for students aged 3 to 18. Consistently ranked among the top Cambridge examination centers in West Africa, GIS fosters critical thinking, cultural empathy, and academic excellence in prime Cantonments.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-sos-tema', 'SOS-Hermann Gmeiner International College', 'Knowledge in the Service of Africa', 'sos-hermann-gmeiner-college', 'Greater Accra', 'Tema', 7800, 1990, '+233 30 320 2907', '+233 50 128 4401', 'admissions@soshgic.edu.gh', 'https://soshgic.edu.gh', 'A prestigious pan-African secondary boarding institution dedicated to developing leaders of tomorrow through rigorous IB Diploma standards, pan-African cultural enrichment, and community service programs.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-roman-ridge-accra', 'The Roman Ridge School', 'Carpe Diem (Seize the Day)', 'the-roman-ridge-school', 'Greater Accra', 'Airport Residential', 6500, 2002, '+233 30 277 9345', '+233 26 554 2210', 'info@romanridgeschool.com', 'https://romanridgeschool.com', 'The Roman Ridge School offers the highest standard of British and international education in Accra. Located conveniently near Airport Residential and Dzorwulu, it features serene, secure learning environments with individualized teacher attention.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-morning-star-cantonments', 'Morning Star School', 'Let Your Light Shine', 'morning-star-school', 'Greater Accra', 'Cantonments', 3200, 1965, '+233 30 277 6492', '+233 24 887 1992', 'admissions@morningstarschool.edu.gh', 'https://morningstarschool.edu.gh', 'One of the most decorated and celebrated GES basic schools in Ghana. Morning Star has graduated generations of leaders with an exemplary track record of 100% BECE pass rate with distinction.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-east-legon-montessori', 'East Legon Montessori Academy', 'Nurturing Little Minds', 'east-legon-montessori-academy', 'Greater Accra', 'East Legon', 2900, 2012, '+233 30 254 3901', '+233 54 991 2284', 'contact@eastlegonmontessori.com', 'https://eastlegonmontessori.com', 'Providing authentic child-centric Montessori and early childhood foundation education in the heart of East Legon. Ideal for working parents needing holistic care from infancy through primary.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-ridge-school-kumasi', 'The Ridge School, Kumasi', 'Excellence in Truth', 'the-ridge-school-kumasi', 'Ashanti', 'Ridge', 3100, 1960, '+233 32 202 2490', '+233 24 330 9011', 'info@ridgeschoolkumasi.edu.gh', 'https://ridgeschoolkumasi.edu.gh', 'The premier private basic school in Kumasi, respected for decades for unmatched academic rigor, disciplined upbringing, and top BECE placements across Ashanti Region.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-nhyiaeso-academy-kumasi', 'Heritage Academy Kumasi', 'Character, Wisdom, Service', 'heritage-academy-kumasi', 'Ashanti', 'Nhyiaeso', 2600, 2008, '+233 32 203 1184', '+233 55 401 7733', 'admissions@heritageacademygh.com', 'https://heritageacademygh.com', 'Located in the tranquil residential district of Nhyiaeso/Ahodwo, Heritage Academy combines modern British international curriculum benchmarks with Ghanaian cultural values.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-galaxy-international-accra', 'Galaxy International School', 'Excellence in Diversity', 'galaxy-international-school', 'Greater Accra', 'Adenta', 11000, 2001, '+233 30 293 8450', '+233 50 156 7889', 'info@galaxyschool.net', 'https://galaxyschool.net', 'Renowned across Africa for dominating international science, mathematics, and robotics olympiads. Galaxy offers world-class boarding and day options with state-of-the-art facilities in Adenta.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-spintex-prep-accra', 'Spintex Royal Preparatory School', 'Building Firm Foundations', 'spintex-royal-preparatory', 'Greater Accra', 'Spintex', 1350, 2015, '+233 24 102 3345', '+233 20 811 4455', 'spintexroyal@gmail.com', '', 'A community-focused, affordable preparatory school on Spintex Road providing disciplined basic education and strong BECE foundation for families in Tema and East Accra.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-knust-basic-kumasi', 'KNUST Basic School', 'Nyansapo (Wisdom Knot)', 'knust-basic-school', 'Ashanti', 'KNUST Enclave', 2400, 1958, '+233 32 206 0021', '+233 24 456 7890', 'knustbasic@knust.edu.gh', 'https://basic.knust.edu.gh', 'Nestled within the lush KNUST university campus, this iconic basic school has produced some of Ghana''s finest scholars, doctors, and engineers with an elite BECE track record.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-achimota-preparatory-junior-high-1793171959920', 'Achimota Preparatory & Junior High', NULL, 'achimota-preparatory-junior-high', 'Greater Accra', 'Achimota', 3500, NULL, '0554129988', '0554129988', 'admin@achimotaprep.edu.gh', NULL, 'Achimota Preparatory & Junior High is an accredited educational institution in Achimota, Greater Accra.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-legacy-girls-college-akuse-1793174006653', 'Legacy Girls'' College, Akuse', NULL, 'legacy-girls-college-akuse', 'Eastern', 'Akuse', 3500, NULL, '0244123456', '0244123456', 'admissions@legacygirls.edu.gh', NULL, 'Legacy Girls'' College, Akuse is an accredited educational institution in Akuse, Eastern.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-achimota-preparatory-junior-high-1793228032103', 'Achimota Preparatory & Junior High', NULL, 'achimota-preparatory-junior-high', 'Greater Accra', 'Achimota', 3500, NULL, '0554129988', '0554129988', 'admin@achimotaprep.edu.gh', NULL, 'Achimota Preparatory & Junior High is an accredited educational institution in Achimota, Greater Accra.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-achimota-preparatory-junior-high-1793228088665', 'Achimota Preparatory & Junior High', NULL, 'achimota-preparatory-junior-high', 'Greater Accra', 'Achimota', 3500, NULL, '0554129988', '0554129988', 'admin@achimotaprep.edu.gh', NULL, 'Achimota Preparatory & Junior High is an accredited educational institution in Achimota, Greater Accra.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-ridge-church-international-school-1793229256678', 'Ridge Church International School', NULL, 'ridge-church-international-school', 'Greater Accra', 'Ridge', 3500, NULL, '0244112233', '0244112233', 'billing@ridgechurchschool.edu.gh', NULL, 'Ridge Church International School is an accredited educational institution in Ridge, Greater Accra.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO schools (id, name, motto, slug, region, suburb, tuition_base, established, phone, whatsapp, email, website, description, verified) VALUES ('sch-achimota-preparatory-junior-high-1793233948085', 'Achimota Preparatory & Junior High', NULL, 'achimota-preparatory-junior-high', 'Greater Accra', 'Achimota', 3500, NULL, '0554129988', '0554129988', 'admin@achimotaprep.edu.gh', NULL, 'Achimota Preparatory & Junior High is an accredited educational institution in Achimota, Greater Accra.', true) ON CONFLICT (id) DO NOTHING;

-- Users Data (11 records)
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-admin-gis', 'admin@gis.edu.gh', '+233244318900', 'Dr. Mary Ashun', 'AdminPass2026!', 'school_admin', 'sch-gis-accra') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-admin-sos', 'head@sos-hgic.edu.gh', '+233243128844', 'Mr. Israel Titi-Ofei', 'AdminPass2026!', 'school_admin', 'sch-sos-tema') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-admin-morningstar', 'admin@morningstar.edu.gh', '+233244112233', 'Mrs. Elizabeth Baidoo', 'AdminPass2026!', 'school_admin', 'sch-morning-star-cantonments') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-parent-nana-aba', 'parent@gmail.com', '+233244987654', 'Mrs. Nana Aba Mensah', 'ParentPass2026!', 'parent', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-teacher-emmanuel', 'tutor@skoolfinder.com', '+233244556677', 'Mr. Emmanuel Addo', 'TeacherPass2026!', 'teacher', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-super-admin', 'superadmin@skoolfinder.gh', '+233501234567', 'SkoolFinder Systems Lead', 'SuperSecure2026!', 'super_admin', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-supplier-akiola', 'supplier@akiola.com.gh', '+233244889900', 'Mr. Kwabena Adjei', 'SupplierPass2026!', 'supplier', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-parent-1793171959906', '233244318900@parent.skoolfinder.gh', '233244318900', 'Parent (+244318900)', 'demo123', 'parent', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-1793228983639', 'omotade.duodu@gmail.com', '+447572000174', 'Charles Duodu', 'Omotade.kofi7', 'school_admin', 'sch-morning-star-cantonments') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-parent-1793231211667', '233244129845@parent.skoolfinder.gh', '233244129845', 'Parent (+244129845)', 'demo123', 'parent', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, phone, name, password_hash, role, school_id) VALUES ('usr-parent-1793312334033', '233244123456@parent.skoolfinder.gh', '233244123456', 'Parent (+244123456)', 'demo123', 'parent', NULL) ON CONFLICT (id) DO NOTHING;

