
-- ============================================================================
-- YOOMBAL SECURITY HARDENING - SEARCH PATH FIXES
-- Resolves "Function Search Path Mutable" warnings by fixing the search_path
-- ============================================================================

BEGIN;

-- For each function identified by the linter, we set a secure search_path.
-- Using 'public' is acceptable and safer than leaving it mutable (default).

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

SELECT 'Hardi-sécurisation des Search Paths terminée !' as status;
