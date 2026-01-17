-- Migration SQL: Phase Finale Premium UI (20260117_premium_final_phase.sql)

-- 1. Create premium_plans table
CREATE TABLE IF NOT EXISTS public.premium_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly NUMERIC DEFAULT 0,
  price_yearly NUMERIC DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  badge TEXT, -- "Popular", "Best Value", etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Initial Data for Plans
INSERT INTO premium_plans (name, slug, description, price_monthly, price_yearly, features, display_order, badge) VALUES
('Starter', 'starter', 'Idéal pour démarrer', 0, 0, ARRAY['basic_store', 'limited_products'], 1, NULL),
('Pro', 'pro', 'Pour les commerçants actifs', 9900, 99000, ARRAY['unlimited_products', 'ai_assistant', 'sales_analytics', 'priority_support'], 2, 'Populaire'),
('Enterprise', 'enterprise', 'Solutions sur mesure', 29900, 299000, ARRAY['all_pro_features', 'api_access', 'dedicated_support', 'white_label'], 3, 'Meilleure Valeur')
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  display_order = EXCLUDED.display_order,
  badge = EXCLUDED.badge;

-- 2. Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES premium_plans(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'expired', 'cancelled', 'pending', 'trial')),
  billing_period TEXT DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'yearly')),
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  payment_method TEXT,
  amount_paid NUMERIC DEFAULT 0,
  auto_renew BOOLEAN DEFAULT true,
  next_billing_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- 3. Create user_premium_subscriptions table (individual modules)
CREATE TABLE IF NOT EXISTS public.user_premium_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES premium_features(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'expired', 'cancelled', 'pending', 'trial')),
  billing_period TEXT DEFAULT 'monthly',
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, feature_id)
);

CREATE INDEX IF NOT EXISTS idx_user_premium_subs_user ON user_premium_subscriptions(user_id);

-- 4. Extend premium_features table
ALTER TABLE premium_features 
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS trial_days INTEGER DEFAULT 0;

-- Initial Data for Features
INSERT INTO premium_features (feature_key, name, description, category, is_premium, price_monthly, is_enabled, is_free, trial_days) VALUES
('ai_assistant', 'Assistant IA Yoombal', 'Chatbot intelligent multilingue avec support Wolof', 'ai', true, 4900, true, false, 7),
('ai_pricing', 'Pricing Dynamique IA', 'Optimisation automatique des prix basée sur la demande', 'ai', true, 9900, true, false, 3),
('predictions', 'Analyses Prédictives', 'Prévision des ventes et tendances du marché', 'ai', true, 14900, true, false, 3),
('content_generation', 'Génération de Contenu', 'Descriptions produits et marketing automatisés', 'ai', true, 7900, true, false, 5),
('stock_prediction', 'Prédiction de Stocks', 'Alertes de réapprovisionnement intelligent', 'ai', true, 6900, true, false, 3)
ON CONFLICT (feature_key) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  is_free = EXCLUDED.is_free,
  trial_days = EXCLUDED.trial_days;

-- 5. RLS Policies
ALTER TABLE premium_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_premium_subscriptions ENABLE ROW LEVEL SECURITY;

-- premium_plans
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view active plans') THEN
        CREATE POLICY "Anyone can view active plans" ON premium_plans FOR SELECT USING (is_active = true);
    END IF;
END $$;

-- user_subscriptions
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their subscription') THEN
        CREATE POLICY "Users can view their subscription" ON user_subscriptions FOR SELECT USING (user_id = auth.uid());
    END IF;
END $$;

-- user_premium_subscriptions
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their module subscriptions') THEN
        CREATE POLICY "Users can view their module subscriptions" ON user_premium_subscriptions FOR SELECT USING (user_id = auth.uid());
    END IF;
END $$;

-- Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE user_premium_subscriptions;
