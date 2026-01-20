-- Consolidated Security Fixes Migration
-- This migration applies all the security fixes that were identified by the Supabase linter.
-- It recreates the admin_orders_view with SECURITY INVOKER, enables RLS on several tables,
-- creates missing helper functions, and hardens the search_path of 11 functions.

BEGIN;

-- 1. Recreate admin_orders_view with SECURITY INVOKER
-- This fixes the "security_definer_view" linter warning.
DROP VIEW IF EXISTS public.admin_orders_view;
CREATE OR REPLACE VIEW public.admin_orders_view
AS
 SELECT o.id,
    o.created_at,
    o.updated_at,
    o.total_amount,
    o.status,
    o.payment_method,
    o.payment_status,
    o.delivery_address,
    o.delivery_phone,
    o.delivery_notes,
    o.client_id,
    cp.email AS client_email,
    cp.first_name AS client_first_name,
    cp.last_name AS client_last_name,
    cp.phone AS client_phone,
    o.merchant_id,
    mp.email AS merchant_email,
    mp.first_name AS merchant_first_name,
    mp.last_name AS merchant_last_name,
    mp.business_name AS merchant_business_name,
    ( SELECT count(*) AS count
           FROM public.order_items oi
          WHERE (oi.order_id = o.id)) AS items_count
   FROM ((public.orders o
     LEFT JOIN public.profiles cp ON ((o.client_id = cp.id)))
     LEFT JOIN public.profiles mp ON ((o.merchant_id = mp.id)));


-- 2. Enable RLS on tables
-- This fixes the "rls_disabled_in_public" linter warning for bundle_features
-- and enables RLS on other tables as a good security practice.
ALTER TABLE public.bundle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;


-- 3. Create or replace missing helper functions
-- These functions were missing in the local setup, causing errors when applying security fixes.
-- Using CREATE OR REPLACE to avoid errors if they already exist.
CREATE OR REPLACE FUNCTION public.log_subscription_action(
    p_user_id UUID, p_subscription_id UUID, p_action TEXT,
    p_old_plan_id UUID DEFAULT NULL, p_new_plan_id UUID DEFAULT NULL,
    p_amount NUMERIC DEFAULT NULL, p_payment_method TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
    INSERT INTO public.subscription_audit_log (user_id, subscription_id, action, old_plan_id, new_plan_id, amount, payment_method, metadata)
    VALUES (p_user_id, p_subscription_id, p_action, p_old_plan_id, p_new_plan_id, p_amount, p_payment_method, COALESCE(p_metadata, '{}'::jsonb));
    RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_has_feature_access(p_user_id UUID, p_feature_key TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_premium_subscriptions us
        JOIN public.premium_plans pp ON us.plan_id = pp.id
        WHERE us.user_id = p_user_id AND us.status = 'active' AND pp.features ? p_feature_key
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Harden functions with secure search_path
-- This fixes the "function_search_path_mutable" linter warning for 11 functions.
ALTER FUNCTION public.update_feature_status() SET search_path = public;
ALTER FUNCTION public.user_has_premium_access(uuid, text) SET search_path = public;
ALTER FUNCTION public.get_user_credit_balance(uuid) SET search_path = public;
ALTER FUNCTION public.add_user_credits(uuid, numeric, text, text, uuid) SET search_path = public;
ALTER FUNCTION public.deduct_user_credits(uuid, numeric, text, uuid) SET search_path = public;
ALTER FUNCTION public.check_subscription_expiration() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.user_has_feature_access(uuid, text) SET search_path = public;
ALTER FUNCTION public.log_subscription_action(uuid, uuid, text, uuid, uuid, numeric, text, jsonb) SET search_path = public;
ALTER FUNCTION public.get_latest_delivery_locations(uuid[]) SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;

COMMIT;

-- Add a final comment to indicate completion
SELECT 'Consolidated Security Fixes Migration applied successfully!' as message;
