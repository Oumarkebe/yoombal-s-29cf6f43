-- 1. Create a non-recursive function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update RLS Policies for Profiles to avoid recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (true);

-- 3. Update RLS Policies for Orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

-- 4. Re-create the Admin Orders View with more robust naming
DROP VIEW IF EXISTS public.admin_orders_view;
CREATE VIEW public.admin_orders_view AS
SELECT 
    o.id,
    o.created_at,
    o.status,
    o.total_amount,
    o.payment_method,
    o.payment_status,
    o.client_id,
    o.merchant_id,
    o.delivery_address,
    COALESCE(c.first_name, '') as client_first_name,
    COALESCE(c.last_name, '') as client_last_name,
    c.email as client_email,
    c.phone as client_phone,
    COALESCE(m.business_name, m.first_name || ' ' || m.last_name, 'Vendeur Inconnu') as merchant_business_name,
    m.email as merchant_email
FROM public.orders o
LEFT JOIN public.profiles c ON o.client_id = c.id
LEFT JOIN public.profiles m ON o.merchant_id = m.id;

-- Grant access to the view
GRANT SELECT ON public.admin_orders_view TO authenticated;
GRANT SELECT ON public.admin_orders_view TO service_role;
