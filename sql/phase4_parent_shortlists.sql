-- ====================================================================
-- SKOOLFINDER GHANA - BLUEPRINT v4.2 PHASE 4
-- PARENT PRODUCTIVITY: 5-STATE DECISION BOARD & PRIVATE SHORTLIST NOTES
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.parent_shortlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    stage TEXT NOT NULL DEFAULT 'considering' CHECK (stage IN ('considering', 'interested', 'preferred', 'visit_planned', 'not_suitable')),
    priority BOOLEAN DEFAULT false,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, school_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_shortlists_user ON public.parent_shortlists(user_id);
CREATE INDEX IF NOT EXISTS idx_parent_shortlists_stage ON public.parent_shortlists(user_id, stage);

-- Enable RLS
ALTER TABLE public.parent_shortlists ENABLE ROW LEVEL SECURITY;

-- Parent RLS Policy: Parents can only access and modify their own shortlists
DROP POLICY IF EXISTS "Parents manage own shortlists" ON public.parent_shortlists;
CREATE POLICY "Parents manage own shortlists" ON public.parent_shortlists FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = parent_shortlists.user_id AND auth_user_id = auth.uid())
);
