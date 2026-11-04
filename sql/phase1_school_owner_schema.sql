-- ============================================================================
-- SkoolFinder Ghana - School Owner & Proprietor Portal Phase 1 Schema
-- Master Blueprint v2.0 Specification (§7, §8, §9, §17, §18)
-- ============================================================================

-- 1. School Memberships (Unified Identity, Scoped Roles & Seat Quotas)
CREATE TABLE IF NOT EXISTS public.school_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id VARCHAR(100) NOT NULL,
  user_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'school_admin',
  seat_allocated BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'revoked')),
  invite_token VARCHAR(100),
  invite_email VARCHAR(255),
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_school_user UNIQUE(school_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_school_memberships_school ON public.school_memberships(school_id);
CREATE INDEX IF NOT EXISTS idx_school_memberships_user ON public.school_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_school_memberships_token ON public.school_memberships(invite_token) WHERE invite_token IS NOT NULL;

-- DEC-01: Exactly ONE active primary proprietor per school
CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_primary_proprietor_per_school 
ON public.school_memberships(school_id) 
WHERE role = 'primary_proprietor' AND status = 'active';

-- DEC-01: Exactly ONE primary school per proprietor account at launch
CREATE UNIQUE INDEX IF NOT EXISTS idx_uq_proprietor_single_primary_school 
ON public.school_memberships(user_id) 
WHERE role = 'primary_proprietor' AND status = 'active';


-- 2. Verification Cases (Super Admin Multi-Document Institutional Vetting)
CREATE TABLE IF NOT EXISTS public.verification_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id VARCHAR(100) NOT NULL,
  submitted_by UUID,
  authority_status VARCHAR(30) DEFAULT 'submitted' CHECK (authority_status IN ('draft', 'submitted', 'under_review', 'information_required', 'approved_owner', 'rejected', 'suspended')),
  reviewer_id UUID,
  reviewer_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_cases_school ON public.verification_cases(school_id);
CREATE INDEX IF NOT EXISTS idx_verification_cases_status ON public.verification_cases(authority_status);


-- 3. Evidence Documents (NaSIA License, GES Cert, Registrar General)
CREATE TABLE IF NOT EXISTS public.evidence_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_case_id UUID REFERENCES public.verification_cases(id) ON DELETE CASCADE,
  school_id VARCHAR(100) NOT NULL,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('nasia_license', 'ges_cert', 'registrar_general', 'proprietor_id', 'tax_clearance', 'other')),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  document_number VARCHAR(100),
  issue_date DATE,
  expiry_date DATE,
  review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'verified', 'rejected')),
  reviewer_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_docs_case ON public.evidence_documents(verification_case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_docs_school ON public.evidence_documents(school_id);


-- 4. School Profile Revisions (Draft vs. Approved Published Separation - §8.1)
CREATE TABLE IF NOT EXISTS public.school_profile_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id VARCHAR(100) NOT NULL,
  version_number INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'archived')),
  profile_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_by UUID,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_revisions_school_status ON public.school_profile_revisions(school_id, status);


-- 5. Safe Extensions to Schools Table (Non-destructive)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'authority_status') THEN
    ALTER TABLE public.schools ADD COLUMN authority_status VARCHAR(30) DEFAULT 'draft';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'accreditation_status') THEN
    ALTER TABLE public.schools ADD COLUMN accreditation_status VARCHAR(30) DEFAULT 'unverified';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'active_tier') THEN
    ALTER TABLE public.schools ADD COLUMN active_tier VARCHAR(20) DEFAULT 'free';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = 'profile_completeness_pct') THEN
    ALTER TABLE public.schools ADD COLUMN profile_completeness_pct INT DEFAULT 45;
  END IF;
END $$;

