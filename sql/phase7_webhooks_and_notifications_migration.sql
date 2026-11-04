-- ============================================================================
-- SKOOLFINDER GHANA: PHASE 7 PRODUCTION WEBHOOKS & NOTIFICATIONS MIGRATION
-- Baseline: Master Blueprint v2.0 §12, Module 15, and Production Runbook
-- Includes Phase 3: Outbound Dispatcher Engine, Delivery Queue & Retries
-- ============================================================================

-- 1. School Webhook Subscriptions Table
CREATE TABLE IF NOT EXISTS public.school_webhook_subscriptions (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL,
    name TEXT NOT NULL DEFAULT 'n8n / CRM Webhook',
    target_url TEXT NOT NULL,
    secret_key_encrypted TEXT NOT NULL,
    secret_key_preview VARCHAR(16) NOT NULL,
    subscribed_events TEXT[] NOT NULL DEFAULT '{"ParentEnquirySubmitted","AdmissionOfferIssued"}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    failure_count INTEGER NOT NULL DEFAULT 0,
    disabled_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wh_subs_school ON public.school_webhook_subscriptions(school_id);
CREATE INDEX IF NOT EXISTS idx_wh_subs_active ON public.school_webhook_subscriptions(is_active);

-- 2. Outbound Webhook Deliveries & Audit Logs Table (With Exponential Backoff Queue)
CREATE TABLE IF NOT EXISTS public.school_webhook_deliveries (
    id VARCHAR(100) PRIMARY KEY,
    subscription_id VARCHAR(100) NOT NULL,
    school_id VARCHAR(100) NOT NULL,
    event_type TEXT NOT NULL,
    target_url TEXT NOT NULL,
    request_headers JSONB NOT NULL DEFAULT '{}'::jsonb,
    request_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    signature TEXT NOT NULL,
    response_http_status INTEGER,
    response_body TEXT,
    delivery_status TEXT NOT NULL DEFAULT 'delivered' CHECK (delivery_status IN ('delivered', 'failed', 'retrying')),
    attempts INTEGER NOT NULL DEFAULT 1,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    next_retry_at TIMESTAMPTZ,
    execution_time_ms INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wh_deliveries_school ON public.school_webhook_deliveries(school_id);
CREATE INDEX IF NOT EXISTS idx_wh_deliveries_sub ON public.school_webhook_deliveries(subscription_id);
CREATE INDEX IF NOT EXISTS idx_wh_deliveries_dispatched ON public.school_webhook_deliveries(dispatched_at DESC);
CREATE INDEX IF NOT EXISTS idx_wh_deliveries_retry ON public.school_webhook_deliveries(delivery_status, next_retry_at);

-- 3. School Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.school_notification_preferences (
    school_id VARCHAR(100) PRIMARY KEY,
    whatsapp_enabled BOOLEAN NOT NULL DEFAULT true,
    whatsapp_phone_number VARCHAR(30),
    sms_enabled BOOLEAN NOT NULL DEFAULT true,
    sms_alert_phone VARCHAR(30),
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    email_alert_address TEXT,
    webhook_enabled BOOLEAN NOT NULL DEFAULT true,
    channel_event_matrix JSONB NOT NULL DEFAULT '{
        "ParentEnquirySubmitted": {"whatsapp": true, "sms": true, "email": true, "webhook": true},
        "AdmissionOfferIssued": {"whatsapp": true, "sms": true, "email": true, "webhook": true},
        "AdmissionOfferAccepted": {"whatsapp": false, "sms": true, "email": true, "webhook": true},
        "PaymentVerified": {"whatsapp": false, "sms": true, "email": true, "webhook": true},
        "TenderPublished": {"whatsapp": false, "sms": false, "email": true, "webhook": true}
    }'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. WhatsApp Cloud API Dispatch Logs Table
CREATE TABLE IF NOT EXISTS public.whatsapp_dispatch_logs (
    id VARCHAR(100) PRIMARY KEY,
    school_id VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(30) NOT NULL,
    template_name TEXT NOT NULL,
    wamid TEXT,
    delivery_status TEXT NOT NULL DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'read', 'failed')),
    message_content TEXT NOT NULL,
    error_message TEXT,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wa_dispatch_school ON public.whatsapp_dispatch_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_wa_dispatch_phone ON public.whatsapp_dispatch_logs(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_wa_dispatch_dispatched ON public.whatsapp_dispatch_logs(dispatched_at DESC);

-- 5. Enable Row Level Security (RLS) on all 4 tables
ALTER TABLE public.school_webhook_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_dispatch_logs ENABLE ROW LEVEL SECURITY;

-- 6. Access Control Policies
CREATE POLICY "Allow authenticated access to webhook subscriptions"
    ON public.school_webhook_subscriptions FOR ALL USING (true);

CREATE POLICY "Allow authenticated access to webhook deliveries"
    ON public.school_webhook_deliveries FOR ALL USING (true);

CREATE POLICY "Allow authenticated access to notification preferences"
    ON public.school_notification_preferences FOR ALL USING (true);

CREATE POLICY "Allow authenticated access to whatsapp dispatch logs"
    ON public.whatsapp_dispatch_logs FOR ALL USING (true);

-- 7. Ensure additive columns exist on existing databases (Phase 3 Idempotency)
ALTER TABLE public.school_webhook_subscriptions ADD COLUMN IF NOT EXISTS disabled_reason TEXT;
ALTER TABLE public.school_webhook_deliveries ADD COLUMN IF NOT EXISTS max_attempts INTEGER NOT NULL DEFAULT 3;
ALTER TABLE public.school_webhook_deliveries ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ;

-- 8. Seed Initial Default Preferences for Pilot School
INSERT INTO public.school_notification_preferences (
    school_id, whatsapp_enabled, whatsapp_phone_number, sms_enabled, sms_alert_phone, email_enabled, email_alert_address, webhook_enabled
) VALUES (
    'ab5af86d-c902-4853-9528-d6200104b5f6', true, '+233 24 111 2222', true, '+233 24 555 1212', true, 'admin@gis.edu.gh', true
) ON CONFLICT (school_id) DO NOTHING;
