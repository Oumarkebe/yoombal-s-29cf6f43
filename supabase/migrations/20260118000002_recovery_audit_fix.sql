-- Phase 7: Emergency Recovery Migration (Lovable Audit Fix)

-- 1. Premium Plans Table
CREATE TABLE IF NOT EXISTS public.premium_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  price_monthly NUMERIC DEFAULT 0,
  price_yearly NUMERIC DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.premium_plans ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'premium_plans' AND policyname = 'Anyone can view active plans') THEN
        CREATE POLICY "Anyone can view active plans" ON public.premium_plans FOR SELECT USING (is_active = true);
    END IF;
END $$;

-- 2. User Subscriptions Table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.premium_plans(id),
  status TEXT DEFAULT 'pending',
  billing_period TEXT DEFAULT 'monthly',
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  payment_method TEXT,
  amount_paid NUMERIC DEFAULT 0,
  auto_renew BOOLEAN DEFAULT true,
  next_billing_date TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_subscriptions' AND policyname = 'Users can view own subscriptions') THEN
        CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT USING (user_id = auth.uid());
    END IF;
END $$;

-- 3. Ads Tables
CREATE TABLE IF NOT EXISTS public.ads_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL REFERENCES auth.users(id),
  product_id UUID REFERENCES public.products(id),
  name TEXT NOT NULL,
  budget NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'draft',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ads_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.ads_campaigns(id),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE
);

-- 4. Premium Features Columns Fix
ALTER TABLE public.premium_features 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS trial_days INTEGER DEFAULT 0;

-- 5. Products Columns Fix
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_digital BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ad_priority INTEGER DEFAULT 0;

-- 6. Initial Seed for Plans
INSERT INTO public.premium_plans (name, slug, description, price_monthly, price_yearly, features, display_order, badge) 
VALUES
('Starter', 'starter', 'Gratuit pour démarrer', 0, 0, ARRAY['basic_store', 'limited_products'], 1, NULL),
('Pro', 'pro', 'Pour les commerçants actifs', 9900, 99000, ARRAY['unlimited_products', 'ai_assistant', 'sales_analytics'], 2, 'Populaire'),
('Enterprise', 'enterprise', 'Solutions sur mesure', 29900, 299000, ARRAY['all_pro_features', 'api_access', 'white_label'], 3, 'Best Value')
ON CONFLICT (slug) DO NOTHING;

-- 7. Update Premium Features
UPDATE public.premium_features SET is_free = false, trial_days = 7 WHERE feature_key IN ('ai_assistant', 'assistant_intelligent');
UPDATE public.premium_features SET is_free = false, trial_days = 3 WHERE feature_key = 'ai_pricing';
