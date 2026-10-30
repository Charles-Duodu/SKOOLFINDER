-- ========================================================
-- SKOOLFINDER GHANA - PHASE 3 SCHEMA EXTENSION
-- Email Deliveries, Inquiry Threads, Notifications & Tutor Bookings
-- ========================================================

-- 1. EMAIL LOGS / DELIVERIES (Audit Trail of all transactional emails sent)
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    portal VARCHAR(50) NOT NULL, -- 'parents', 'schools', 'teachers', 'suppliers'
    subject VARCHAR(255) NOT NULL,
    template_type VARCHAR(100) NOT NULL, -- 'admission_inquiry', 'campus_tour', 'school_claim', 'tutor_booking', 'quote_submitted', 'rfq_alert'
    reference_code VARCHAR(100),
    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'delivered', 'simulated', 'failed'
    provider VARCHAR(50) DEFAULT 'resend',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER NOTIFICATIONS (In-App notifications for all 4 portals)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    portal VARCHAR(50) NOT NULL, -- 'parents', 'schools', 'teachers', 'suppliers'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reference_code VARCHAR(100),
    action_url VARCHAR(255),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENQUIRY MESSAGES (Threaded dialogue between Parents & Schools)
CREATE TABLE IF NOT EXISTS public.enquiry_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL, -- 'parent', 'school'
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(100),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TUTOR BOOKINGS (Teachers Portal consultations from Parents)
CREATE TABLE IF NOT EXISTS public.tutor_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255),
    parent_phone VARCHAR(50) NOT NULL,
    student_name VARCHAR(255),
    grade_level VARCHAR(100),
    subject VARCHAR(100),
    session_type VARCHAR(50) DEFAULT 'In-Person (Home)', -- 'In-Person (Home)', 'Online (Zoom)'
    preferred_days VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
    reference_code VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_bookings ENABLE ROW LEVEL SECURITY;

-- Re-runnable Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public read email logs" ON public.email_logs;
    DROP POLICY IF EXISTS "Public read notifications" ON public.notifications;
    DROP POLICY IF EXISTS "Public read enquiry messages" ON public.enquiry_messages;
    DROP POLICY IF EXISTS "Public read tutor bookings" ON public.tutor_bookings;
END $$;

CREATE POLICY "Public read email logs" ON public.email_logs FOR SELECT USING (true);
CREATE POLICY "Public read notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public read enquiry messages" ON public.enquiry_messages FOR SELECT USING (true);
CREATE POLICY "Public read tutor bookings" ON public.tutor_bookings FOR SELECT USING (true);

-- Helpful Indexing
CREATE INDEX IF NOT EXISTS idx_email_logs_portal ON public.email_logs(portal);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_enquiry_messages_enquiry_id ON public.enquiry_messages(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_tutor_bookings_teacher ON public.tutor_bookings(teacher_id);

