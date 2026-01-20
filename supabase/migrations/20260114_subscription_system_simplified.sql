-- ============================================================================
-- YOOMBAL SUBSCRIPTION SYSTEM - SIMPLIFIED
-- Migration pour remplacer l'ancien système complexe par 3 formules claires
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. PREMIUM PLANS (Remplace premium_bundles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.premium_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL, -- 'starter', 'pro', 'enterprise'
    name TEXT NOT NULL,
    description TEXT,
    
    -- Pricing
    price_monthly NUMERIC DEFAULT 0 CHECK (price_monthly >= 0),
    price_yearly NUMERIC DEFAULT 0 CHECK (price_yearly >= 0),
    
    -- Features
    features TEXT[] DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Badge for UI
    badge TEXT, -- "Popular", "Best Value", etc.
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. USER SUBSCRIPTIONS (Simplifiée - un seul abonnement actif par user)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.premium_plans(id) ON DELETE RESTRICT,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
    
    -- Billing
    billing_period TEXT NOT NULL DEFAULT 'monthly'
        CHECK (billing_period IN ('monthly', 'yearly')),
    
    -- Dates
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Payment
    payment_method TEXT, -- 'mobile_money', 'wallet', 'card'
    amount_paid NUMERIC DEFAULT 0,
    transaction_id TEXT,
    
    -- Renewal
    auto_renew BOOLEAN DEFAULT true,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_user_sub_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sub_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_sub_expires ON public.user_subscriptions(expires_at) WHERE status = 'active';

-- Contrainte: Un seul abonnement actif par utilisateur
-- Contrainte: Un seul abonnement actif par utilisateur
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_sub_per_user 
ON public.user_subscriptions(user_id) 
WHERE status = 'active';

-- ============================================================================
-- 3. SUBSCRIPTION AUDIT LOG
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscription_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    
    -- Action tracking
    action TEXT NOT NULL, -- 'created', 'upgraded', 'downgraded', 'cancelled', 'renewed', 'expired'
    
    -- Plan changes
    old_plan_id UUID REFERENCES public.premium_plans(id) ON DELETE SET NULL,
    new_plan_id UUID REFERENCES public.premium_plans(id) ON DELETE SET NULL,
    
    -- Financial
    amount NUMERIC,
    payment_method TEXT,
    transaction_id TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Security
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user_id ON public.subscription_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.subscription_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.subscription_audit_log(action);

-- ============================================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================================

-- Premium Plans - public read
ALTER TABLE public.premium_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS plans_public_read ON public.premium_plans;
CREATE POLICY plans_public_read ON public.premium_plans
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS admin_manage_plans ON public.premium_plans;
CREATE POLICY admin_manage_plans ON public.premium_plans
    FOR ALL USING (public.is_admin());

-- User Subscriptions - strict security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own subscription
DROP POLICY IF EXISTS user_view_own_subscription ON public.user_subscriptions;
CREATE POLICY user_view_own_subscription ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all
DROP POLICY IF EXISTS admin_view_all_subscriptions ON public.user_subscriptions;
CREATE POLICY admin_view_all_subscriptions ON public.user_subscriptions
    FOR SELECT USING (public.is_admin());

-- Only admins can modify (users go through Edge Functions)
DROP POLICY IF EXISTS admin_manage_subscriptions ON public.user_subscriptions;
CREATE POLICY admin_manage_subscriptions ON public.user_subscriptions
    FOR ALL USING (public.is_admin());

-- Audit Log - read-only for users
ALTER TABLE public.subscription_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_view_own_audit_log ON public.subscription_audit_log;
CREATE POLICY user_view_own_audit_log ON public.subscription_audit_log
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS admin_view_all_audit_logs ON public.subscription_audit_log;
CREATE POLICY admin_view_all_audit_logs ON public.subscription_audit_log
    FOR SELECT USING (public.is_admin());

-- ============================================================================
-- 5. INSERT DEFAULT PLANS
-- ============================================================================

-- Plan 1: Starter (Gratuit)
INSERT INTO public.premium_plans (slug, name, description, price_monthly, price_yearly, features, badge, display_order)
VALUES (
    'starter',
    'Yoombal Starter',
    'Formule gratuite pour découvrir Yoombal',
    0,
    0,
    ARRAY['marketplace_access', 'basic_order_tracking', 'one_delivery_address', '30_days_history'],
    'Gratuit',
    1
) ON CONFLICT (slug) DO NOTHING;

-- Plan 2: Pro (Pour Marchands & Livreurs)
INSERT INTO public.premium_plans (slug, name, description, price_monthly, price_yearly, features, badge, display_order)
VALUES (
    'pro',
    'Yoombal Pro',
    'Outils professionnels pour marchands et livreurs',
    15000,
    144000, -- -20%
    ARRAY['custom_store', 'unlimited_products', 'sales_analytics', 'customer_notifications', 'ai_product_descriptions', 'ai_pricing', 'delivery_dashboard', 'route_optimization', 'multi_deliveries', 'unlimited_history', 'priority_support', 'monthly_reports', 'api_access'],
    'Populaire',
    2
) ON CONFLICT (slug) DO NOTHING;

-- Plan 3: Enterprise (Pour Admins)
INSERT INTO public.premium_plans (slug, name, description, price_monthly, price_yearly, features, badge, display_order)
VALUES (
    'enterprise',
    'Yoombal Enterprise',
    'Solution complète pour entreprises',
    50000,
    480000, -- -20%
    ARRAY['all_pro_features', 'admin_dashboard', 'multi_user_management', 'advanced_ai', 'demand_prediction', 'fraud_detection', 'custom_chatbot', 'custom_reports', 'dedicated_support_24_7', 'team_training', 'white_label'],
    'Premium',
    3
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 6. FUNCTIONS
-- ============================================================================

-- Function to check if user has access to a feature
CREATE OR REPLACE FUNCTION public.user_has_feature_access(p_user_id UUID, p_feature_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_has_access BOOLEAN;
BEGIN
    -- Check if user has an active subscription with this feature
    SELECT EXISTS (
        SELECT 1
        FROM public.user_subscriptions us
        JOIN public.premium_plans pp ON us.plan_id = pp.id
        WHERE us.user_id = p_user_id
            AND us.status = 'active'
            AND (us.expires_at IS NULL OR us.expires_at > NOW())
            AND pp.features ? p_feature_key
    ) INTO v_has_access;
    
    RETURN v_has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log subscription actions
CREATE OR REPLACE FUNCTION public.log_subscription_action(
    p_user_id UUID,
    p_subscription_id UUID,
    p_action TEXT,
    p_old_plan_id UUID DEFAULT NULL,
    p_new_plan_id UUID DEFAULT NULL,
    p_amount NUMERIC DEFAULT NULL,
    p_payment_method TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.subscription_audit_log (
        user_id, subscription_id, action, old_plan_id, new_plan_id,
        amount, payment_method, metadata
    ) VALUES (
        p_user_id, p_subscription_id, p_action, p_old_plan_id, p_new_plan_id,
        p_amount, p_payment_method, COALESCE(p_metadata, '{}'::jsonb)
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Auto-update timestamps
DROP TRIGGER IF EXISTS update_premium_plans_updated_at ON public.premium_plans;
CREATE TRIGGER update_premium_plans_updated_at
    BEFORE UPDATE ON public.premium_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE public.premium_plans IS 'Les 3 formules d''abonnement Yoombal (Starter, Pro, Enterprise)';
COMMENT ON TABLE public.user_subscriptions IS 'Abonnements utilisateurs (un seul actif par user)';
COMMENT ON TABLE public.subscription_audit_log IS 'Historique de toutes les actions sur les abonnements';
COMMENT ON FUNCTION public.user_has_feature_access IS 'Vérifie si un utilisateur a accès à une feature spécifique';
COMMENT ON FUNCTION public.log_subscription_action IS 'Enregistre une action dans l''audit log';

SELECT 'Migration Subscription System: SUCCESS ✅' as status;
