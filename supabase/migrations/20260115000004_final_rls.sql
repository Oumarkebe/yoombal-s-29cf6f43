
-- ============================================================================
-- YOOMBAL FINAL RLS POLICIES CLEANUP
-- Fixes missing policies for user_subscriptions and ai_feature_profile_settings
-- ============================================================================

BEGIN;

-- 1. FIX: user_subscriptions (Missing policies)
-- This table is critical for the new subscription system.
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_view_own_subscription" ON public.user_subscriptions;
CREATE POLICY "user_view_own_subscription" 
    ON public.user_subscriptions FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_view_all_subscriptions" ON public.user_subscriptions;
CREATE POLICY "admin_view_all_subscriptions" 
    ON public.user_subscriptions FOR SELECT 
    TO authenticated 
    USING (public.is_admin());

DROP POLICY IF EXISTS "admin_manage_subscriptions" ON public.user_subscriptions;
CREATE POLICY "admin_manage_subscriptions" 
    ON public.user_subscriptions FOR ALL 
    TO authenticated 
    USING (public.is_admin());


-- 2. FIX: ai_feature_profile_settings (Missing policies)
ALTER TABLE public.ai_feature_profile_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for ai_settings" ON public.ai_feature_profile_settings;
CREATE POLICY "Public read access for ai_settings" 
    ON public.ai_feature_profile_settings FOR SELECT 
    TO authenticated 
    USING (true);

DROP POLICY IF EXISTS "Admin manage access for ai_settings" ON public.ai_feature_profile_settings;
CREATE POLICY "Admin manage access for ai_settings" 
    ON public.ai_feature_profile_settings FOR ALL 
    TO authenticated 
    USING (public.is_admin());


-- 3. Cleanup: profiles (Removing redundant/conflicting policies)
-- The list shows many policies for profiles. Let's consolidate.
-- We keep only the essential ones to avoid confusion.

-- We assume public.is_admin() is the standard helper.
-- Keeping: view own, update own, admin all.

-- Clear others if they exist (based on the names in the list)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Re-apply clean ones
DROP POLICY IF EXISTS "user_view_self" ON public.profiles;
CREATE POLICY "user_view_self" ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "user_update_self" ON public.profiles;
CREATE POLICY "user_update_self" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "admin_all" ON public.profiles;
CREATE POLICY "admin_all" ON public.profiles
    FOR ALL TO authenticated USING (public.is_admin());


COMMIT;

SELECT 'Nettoyage final RLS terminé avec succès !' as status;
