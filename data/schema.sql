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
