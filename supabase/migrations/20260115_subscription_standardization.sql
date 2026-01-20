-- Migration: Subscription System Standardization & RLS
-- Date: 2026-01-15
-- Author: Antigravity

-- 1. TABLES (Ensuring structure)
CREATE TABLE IF NOT EXISTS public.premium_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly NUMERIC DEFAULT 0,
    price_yearly NUMERIC DEFAULT 0,
    features TEXT[] DEFAULT '{}',
    target_roles TEXT[],
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    badge_text TEXT,
    badge_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.premium_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    is_premium BOOLEAN DEFAULT true,
    price_monthly NUMERIC DEFAULT 0,
    is_enabled BOOLEAN DEFAULT false,
    configuration JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. USER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.premium_plans(id),
    status TEXT DEFAULT 'active',
    billing_period TEXT DEFAULT 'monthly',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_premium_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES public.premium_features(id),
    status TEXT DEFAULT 'active',
    billing_period TEXT DEFAULT 'monthly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. DATA STANDARDIZATION (Keys & Plans)
-- Standardize existing feature keys
UPDATE public.premium_features SET feature_key = 'ai_assistant' WHERE feature_key = 'assistant_intelligent';
UPDATE public.premium_features SET feature_key = 'ai_pricing' WHERE feature_key = 'tarification_dynamique';
UPDATE public.premium_features SET feature_key = 'predictions' WHERE feature_key = 'analyses_predictives';

-- Insert/Update Default Plans
INSERT INTO public.premium_plans (slug, name, price_monthly, features, display_order)
VALUES 
('starter', 'Yoombal Starter', 0, ARRAY['marketplace_access'], 1)
ON CONFLICT (slug) DO UPDATE SET features = EXCLUDED.features;

INSERT INTO public.premium_plans (slug, name, price_monthly, features, display_order)
VALUES 
('pro', 'Yoombal Pro', 15000, ARRAY['ai_assistant', 'ai_pricing', 'livreur_dashboard'], 2)
ON CONFLICT (slug) DO UPDATE SET features = EXCLUDED.features;

INSERT INTO public.premium_plans (slug, name, price_monthly, features, display_order)
VALUES 
('enterprise', 'Yoombal Enterprise', 50000, ARRAY['ai_assistant', 'ai_pricing', 'predictions', 'admin_dashboard', 'livreur_dashboard', 'route_optimization', 'sales_analytics', 'custom_store'], 3)
ON CONFLICT (slug) DO UPDATE SET features = EXCLUDED.features;

-- 3. RLS POLICIES
ALTER TABLE public.premium_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Plans public reading" ON public.premium_plans;
CREATE POLICY "Plans public reading" ON public.premium_plans FOR SELECT TO authenticated USING (true);

ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Features public reading" ON public.premium_features;
CREATE POLICY "Features public reading" ON public.premium_features FOR SELECT TO authenticated USING (true);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own subscription" ON public.user_subscriptions;
CREATE POLICY "Users view own subscription" ON public.user_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.user_premium_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own modules" ON public.user_premium_subscriptions;
CREATE POLICY "Users view own modules" ON public.user_premium_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 4. PERMISSIONS
GRANT SELECT ON public.premium_plans TO authenticated;
GRANT SELECT ON public.premium_features TO authenticated;
GRANT SELECT ON public.user_subscriptions TO authenticated;
GRANT SELECT ON public.user_premium_subscriptions TO authenticated;
