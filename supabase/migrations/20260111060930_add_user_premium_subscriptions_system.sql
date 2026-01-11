-- ============================================================================
-- USER PREMIUM SUBSCRIPTIONS SYSTEM
-- Complete schema for per-user premium feature subscriptions with bonuses
-- ============================================================================

-- ============================================================================
-- 1. USER PREMIUM SUBSCRIPTIONS
-- Core table for individual user subscriptions to premium features
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_premium_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES public.premium_features(id) ON DELETE CASCADE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending_payment' 
        CHECK (status IN ('active', 'trial', 'expired', 'cancelled', 'pending_payment')),
    
    -- Dates
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activated_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Trial
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    is_trial BOOLEAN DEFAULT false,
    
    -- Payment
    payment_status TEXT DEFAULT 'pending' 
        CHECK (payment_status IN ('paid', 'pending', 'failed', 'refunded')),
    payment_method TEXT, -- 'mobile_money', 'card', 'credits', 'bundle'
    transaction_id TEXT,
    amount_paid NUMERIC DEFAULT 0,
    
    -- Renewal
    auto_renew BOOLEAN DEFAULT true,
    billing_period TEXT DEFAULT 'monthly' 
        CHECK (billing_period IN ('monthly', 'yearly')),
    next_billing_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, feature_id)
);

CREATE INDEX idx_user_subscriptions_user ON public.user_premium_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_premium_subscriptions(status);
CREATE INDEX idx_user_subscriptions_expires ON public.user_premium_subscriptions(expires_at);

-- ============================================================================
-- 2. PREMIUM BUNDLES
-- Packs of features at discounted prices
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.premium_bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    discount_percentage NUMERIC DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    price_monthly NUMERIC NOT NULL CHECK (price_monthly >= 0),
    price_yearly NUMERIC CHECK (price_yearly >= 0),
    is_active BOOLEAN DEFAULT true,
    trial_days INTEGER DEFAULT 0,
    badge_text TEXT, -- 'Populaire', 'Meilleure Valeur', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bundle_features (
    bundle_id UUID NOT NULL REFERENCES public.premium_bundles(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES public.premium_features(id) ON DELETE CASCADE,
    PRIMARY KEY (bundle_id, feature_id)
);

-- ============================================================================
-- 3. USER CREDITS SYSTEM
-- Wallet/credits for purchasing subscriptions
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance NUMERIC DEFAULT 0 CHECK (balance >= 0),
    currency TEXT DEFAULT 'FCFA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'refund', 'bonus', 'referral_reward')),
    description TEXT,
    reference_id UUID, -- Subscription ID, payment ID, etc.
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON public.credit_transactions(type);

-- ============================================================================
-- 4. USAGE QUOTAS
-- Track usage limits for metered features
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.feature_usage_quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.user_premium_subscriptions(id) ON DELETE CASCADE,
    quota_type TEXT NOT NULL, -- 'requests_per_day', 'tokens_per_month', 'items_per_month'
    quota_limit INTEGER NOT NULL CHECK (quota_limit > 0),
    quota_used INTEGER DEFAULT 0 CHECK (quota_used >= 0),
    reset_at TIMESTAMP WITH TIME ZONE,
    reset_period TEXT CHECK (reset_period IN ('daily', 'monthly', 'yearly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_usage_quotas_subscription ON public.feature_usage_quotas(subscription_id);

-- ============================================================================
-- 5. REFERRAL PROGRAM
-- Track referrals and rewards
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
    reward_type TEXT, -- 'credits', 'free_trial_extension', 'discount'
    reward_value NUMERIC,
    rewarded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(referrer_id, referred_id)
);

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON public.referrals(referred_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE public.user_premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY user_view_own_subscriptions ON public.user_premium_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_manage_own_subscriptions ON public.user_premium_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Users can view their own credits
CREATE POLICY user_view_own_credits ON public.user_credits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_view_own_transactions ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own quotas
CREATE POLICY user_view_own_quotas ON public.feature_usage_quotas
    FOR SELECT USING (
        subscription_id IN (
            SELECT id FROM public.user_premium_subscriptions 
            WHERE user_id = auth.uid()
        )
    );

-- Users can view their referrals
CREATE POLICY user_view_referrals ON public.referrals
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Admins can view all
CREATE POLICY admin_view_all_subscriptions ON public.user_premium_subscriptions
    FOR ALL USING (public.is_admin());

CREATE POLICY admin_view_all_credits ON public.user_credits
    FOR ALL USING (public.is_admin());

CREATE POLICY admin_view_all_transactions ON public.credit_transactions
    FOR ALL USING (public.is_admin());

-- Bundles are public
ALTER TABLE public.premium_bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY bundles_public_read ON public.premium_bundles
    FOR SELECT USING (is_active = true);

CREATE POLICY admin_manage_bundles ON public.premium_bundles
    FOR ALL USING (public.is_admin());

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check if user has access to a premium feature
CREATE OR REPLACE FUNCTION public.user_has_premium_access(p_user_id UUID, p_feature_key TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_premium_subscriptions ups
        JOIN public.premium_features pf ON ups.feature_id = pf.id
        WHERE ups.user_id = p_user_id
            AND pf.feature_key = p_feature_key
            AND ups.status IN ('active', 'trial')
            AND ups.payment_status = 'paid'
            AND (ups.expires_at IS NULL OR ups.expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's credit balance
CREATE OR REPLACE FUNCTION public.get_user_credit_balance(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    v_balance NUMERIC;
BEGIN
    SELECT COALESCE(balance, 0) INTO v_balance
    FROM public.user_credits
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(v_balance, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits to user account
CREATE OR REPLACE FUNCTION public.add_user_credits(
    p_user_id UUID,
    p_amount NUMERIC,
    p_type TEXT,
    p_description TEXT,
    p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Ensure user_credits record exists
    INSERT INTO public.user_credits (user_id, balance)
    VALUES (p_user_id, 0)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Update balance
    UPDATE public.user_credits
    SET balance = balance + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record transaction
    INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id)
    VALUES (p_user_id, p_amount, p_type, p_description, p_reference_id);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct credits
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
    p_user_id UUID,
    p_amount NUMERIC,
    p_description TEXT,
    p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_balance NUMERIC;
BEGIN
    -- Check balance
    SELECT balance INTO v_balance FROM public.user_credits WHERE user_id = p_user_id;
    
    IF v_balance IS NULL OR v_balance < p_amount THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct
    UPDATE public.user_credits
    SET balance = balance - p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record
    INSERT INTO public.credit_transactions (user_id, amount, type, description, reference_id)
    VALUES (p_user_id, -p_amount, 'debit', p_description, p_reference_id);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update timestamps
CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_premium_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bundles_updated_at
    BEFORE UPDATE ON public.premium_bundles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_credits_updated_at
    BEFORE UPDATE ON public.user_credits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-expire subscriptions
CREATE OR REPLACE FUNCTION public.check_subscription_expiration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expires_at IS NOT NULL AND NOW() > NEW.expires_at THEN
        NEW.status = 'expired';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_subscription_expiration
    BEFORE UPDATE ON public.user_premium_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.check_subscription_expiration();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.user_premium_subscriptions IS 'Individual user subscriptions to premium features';
COMMENT ON TABLE public.premium_bundles IS 'Bundles/packs of premium features at discounted prices';
COMMENT ON TABLE public.user_credits IS 'User wallet/credits for purchasing subscriptions';
COMMENT ON TABLE public.credit_transactions IS 'Transaction history for credits';
COMMENT ON TABLE public.feature_usage_quotas IS 'Usage limits and tracking for metered features';
COMMENT ON TABLE public.referrals IS 'Referral program tracking and rewards';

COMMENT ON FUNCTION public.user_has_premium_access IS 'Check if user has active access to a premium feature';
COMMENT ON FUNCTION public.get_user_credit_balance IS 'Get user credit wallet balance';
COMMENT ON FUNCTION public.add_user_credits IS 'Add credits to user account with transaction logging';
COMMENT ON FUNCTION public.deduct_user_credits IS 'Deduct credits from user account if sufficient balance';
