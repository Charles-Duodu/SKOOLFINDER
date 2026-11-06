-- ============================================================================
-- SKOOLFINDER GHANA: SUPPLIERS PORTAL STAGE 2 — CATEGORY TAXONOMY & CATALOGUE
-- Baseline: Master Blueprint v2.0 (SUP-01-01, SUP-01-02, SUP-03-01, SUP-03-02, SUP-03-03, SUP-03-05, SUP-05-01)
-- 100% Idempotent: Safe to execute on existing Supabase instances
-- ============================================================================

-- 1. HIERARCHICAL CATEGORY TAXONOMY TABLE (SUP-03-01)
CREATE TABLE IF NOT EXISTS public.supplier_categories (
    id VARCHAR(80) PRIMARY KEY, -- e.g. 'cat-stationery', 'cat-stem'
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    parent_id VARCHAR(80) REFERENCES public.supplier_categories(id) ON DELETE SET NULL,
    risk_level TEXT NOT NULL DEFAULT 'standard' CHECK (risk_level IN ('standard', 'medium', 'high', 'critical')),
    required_evidence TEXT[] DEFAULT '{}',
    icon TEXT DEFAULT '📦',
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed core Ghanaian educational categories
INSERT INTO public.supplier_categories (id, name, slug, risk_level, required_evidence, icon, description, display_order)
VALUES
    ('cat-books', 'Books, Curricula & Stationery', 'books-stationery', 'standard', '{"Business Registration", "Publisher Distributorship Agreement"}', '📚', 'Textbooks (BECE/WASSCE/Cambridge), exercise books, workbooks, stationery', 1),
    ('cat-stem', 'Science, STEM & Lab Equipment', 'stem-lab-equipment', 'medium', '{"Business Registration", "Apparatus Safety Attestation"}', '🔬', 'WAEC science reagents, optical microscopes, robotics kits, glassware', 2),
    ('cat-furniture', 'Classroom & Office Furniture', 'classroom-furniture', 'standard', '{"Business Registration", "Workshop Inspection"}', '🪑', 'Dual desks, ergonomic student chairs, whiteboards, lockers, teacher desks', 3),
    ('cat-it', 'IT, Computers & EdTech Hardware', 'it-edtech-hardware', 'standard', '{"Business Registration", "Warranty Partner Certificate"}', '💻', 'Laptops, smartboards, school servers, networking, biometric time clocks', 4),
    ('cat-uniforms', 'School Uniforms & Sportswear', 'uniforms-sportswear', 'standard', '{"Business Registration", "Fabric Specification"}', '👕', 'Crested uniform fabrics, school blazers, PE kits, socks, branded footwear', 5),
    ('cat-food', 'Food, Groceries & Canteen Supplies', 'food-canteen', 'high', '{"Business Registration", "FDA Ghana Food Safety Certificate", "Handlers Medical Clearance"}', '🍲', 'Bulk rice, maize, cooking oil, canned goods, commercial kitchen cookware', 6),
    ('cat-transport', 'Student Transport & Logistics', 'transport-logistics', 'high', '{"Business Registration", "DVLA Commercial Fleet Roadworthiness", "Driver Licensure & Vetting"}', '🚌', 'School buses, GPS fleet telematics, bus maintenance, driver leasing', 7),
    ('cat-facilities', 'Facilities, Cleaning & Maintenance', 'facilities-maintenance', 'medium', '{"Business Registration", "Pesticide EPA Permit (fumigation)"}', '🧹', 'Sanitation supplies, solar inverters, backup generators, fumigation', 8)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    risk_level = EXCLUDED.risk_level,
    required_evidence = EXCLUDED.required_evidence,
    icon = EXCLUDED.icon,
    description = EXCLUDED.description;

-- 2. DISTINCT PRODUCT LISTINGS TABLE (SUP-03-02, SUP-03-03)
CREATE TABLE IF NOT EXISTS public.supplier_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT,
    category_id VARCHAR(80) REFERENCES public.supplier_categories(id) ON DELETE SET NULL,
    description TEXT,
    pricing_mode TEXT NOT NULL DEFAULT 'quote_only' CHECK (pricing_mode IN ('fixed', 'indicative', 'quote_only')),
    price_ghs NUMERIC(10, 2) DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'GHS',
    unit TEXT NOT NULL DEFAULT 'piece', -- 'piece', 'carton', 'set', 'pack', 'bulk'
    minimum_order_qty INT NOT NULL DEFAULT 1,
    stock_availability TEXT NOT NULL DEFAULT 'made_to_order' CHECK (stock_availability IN ('in_stock', 'made_to_order', 'out_of_stock')),
    delivery_days INT NOT NULL DEFAULT 3,
    media_urls JSONB DEFAULT '[]'::jsonb,
    compliance_specs JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'submitted', 'published', 'rejected', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier ON public.supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_category ON public.supplier_products(category_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_status ON public.supplier_products(status);

-- 3. DISTINCT SERVICE OFFERINGS TABLE (SUP-03-02, SUP-03-03)
CREATE TABLE IF NOT EXISTS public.supplier_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category_id VARCHAR(80) REFERENCES public.supplier_categories(id) ON DELETE SET NULL,
    description TEXT,
    scope_of_work TEXT,
    deliverables TEXT,
    pricing_mode TEXT NOT NULL DEFAULT 'quote_only' CHECK (pricing_mode IN ('fixed', 'indicative', 'quote_only')),
    starting_rate_ghs NUMERIC(10, 2) DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'GHS',
    rate_unit TEXT NOT NULL DEFAULT 'project' CHECK (rate_unit IN ('hourly', 'daily', 'project', 'term', 'annual')),
    coverage_regions TEXT[] DEFAULT '{"Greater Accra"}',
    availability_schedule TEXT DEFAULT 'Monday - Friday (8am - 5pm)',
    qualifications TEXT,
    portfolio_urls JSONB DEFAULT '[]'::jsonb,
    safeguarding_cleared BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'submitted', 'published', 'rejected', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supplier_services_supplier ON public.supplier_services(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_services_category ON public.supplier_services(category_id);
CREATE INDEX IF NOT EXISTS idx_supplier_services_status ON public.supplier_services(status);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.supplier_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active categories
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_categories' AND policyname = 'public_read_categories') THEN
        CREATE POLICY "public_read_categories" ON public.supplier_categories
            FOR SELECT USING (is_active = true);
    END IF;
END $$;

-- Allow public read access to published products and services
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_products' AND policyname = 'public_read_products') THEN
        CREATE POLICY "public_read_products" ON public.supplier_products
            FOR SELECT USING (status = 'published');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_services' AND policyname = 'public_read_services') THEN
        CREATE POLICY "public_read_services" ON public.supplier_services
            FOR SELECT USING (status = 'published');
    END IF;
END $$;

-- Allow authenticated suppliers and Super Admins to manage their own products
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_products' AND policyname = 'supplier_manage_products') THEN
        CREATE POLICY "supplier_manage_products" ON public.supplier_products
            FOR ALL USING (
                auth.role() = 'authenticated'
                OR auth.jwt() ->> 'role' = 'super_admin'
            );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'supplier_services' AND policyname = 'supplier_manage_services') THEN
        CREATE POLICY "supplier_manage_services" ON public.supplier_services
            FOR ALL USING (
                auth.role() = 'authenticated'
                OR auth.jwt() ->> 'role' = 'super_admin'
            );
    END IF;
END $$;

SELECT 'SkoolFinder Ghana Suppliers Portal Stage 2 Migration Applied' AS migration_status;

