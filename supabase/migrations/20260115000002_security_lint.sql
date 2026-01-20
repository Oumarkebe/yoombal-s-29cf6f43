
-- ============================================================================
-- YOOMBAL SECURITY HARDENING - LINTER FIXES
-- fixes SECURITY DEFINER views and missing RLS on public tables
-- ============================================================================

BEGIN;

-- 1. FIX: admin_orders_view (SECURITY DEFINER -> SECURITY INVOKER)
-- We drop and recreate it. By default, views are SECURITY INVOKER.
-- Explicitly setting security_invoker=true if supported (PG 15+)
DROP VIEW IF EXISTS public.admin_orders_view;

CREATE OR REPLACE VIEW public.admin_orders_view 
WITH (security_invoker = true)
AS
SELECT 
    o.id,
    o.created_at,
    o.updated_at,
    o.total_amount,
    o.status,
    o.payment_method,
    o.payment_status,
    o.delivery_address,
    o.delivery_phone,
    o.delivery_notes,
    -- Client information
    o.client_id,
    cp.email as client_email,
    cp.first_name as client_first_name,
    cp.last_name as client_last_name,
    cp.phone as client_phone,
    -- Merchant information
    o.merchant_id,
    mp.email as merchant_email,
    mp.first_name as merchant_first_name,
    mp.last_name as merchant_last_name,
    mp.business_name as merchant_business_name,
    -- Order items count
    (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as items_count
FROM orders o
LEFT JOIN profiles cp ON o.client_id = cp.id
LEFT JOIN profiles mp ON o.merchant_id = mp.id;

-- Restore grants
GRANT SELECT ON public.admin_orders_view TO authenticated;
GRANT SELECT ON public.admin_orders_view TO service_role;


-- 2. FIX: missing RLS on bundle_features
ALTER TABLE public.bundle_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for bundle_features" ON public.bundle_features;
CREATE POLICY "Public read access for bundle_features" 
    ON public.bundle_features FOR SELECT 
    TO authenticated 
    USING (true);

-- Ensure admins can manage it
DROP POLICY IF EXISTS "Admin manage access for bundle_features" ON public.bundle_features;
CREATE POLICY "Admin manage access for bundle_features" 
    ON public.bundle_features FOR ALL 
    TO authenticated 
    USING (public.is_admin());

-- 3. Additional Audit: Ensure premium_plans and premium_features (from my recent sync) also have RLS
-- (They were already covered in full_local_subscription_sync.sql but good to double check)
ALTER TABLE public.premium_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;

COMMIT;

SELECT 'Hardi-sécurisation terminée avec succès !' as status;
