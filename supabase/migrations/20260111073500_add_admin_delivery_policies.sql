-- Add Admin access to deliveries
CREATE POLICY "Admins can view all deliveries" ON "public"."deliveries"
FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can manage all deliveries" ON "public"."deliveries"
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Add Admin access to delivery_tracking
CREATE POLICY "Admins can view all delivery tracking" ON "public"."delivery_tracking"
FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can manage all delivery tracking" ON "public"."delivery_tracking"
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
