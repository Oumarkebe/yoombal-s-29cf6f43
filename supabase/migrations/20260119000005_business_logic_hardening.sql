-- =============================================
-- Migration: Business Logic Hardening
-- Description: Triggers for status sync, role validation, and integrity
-- =============================================

-- 1. TRIGGER: Synchronize Delivery Status -> Order Status
CREATE OR REPLACE FUNCTION public.sync_delivery_to_order_status()
RETURNS TRIGGER AS $$
BEGIN
    -- MAPPING: Delivery Status -> Order Status
    IF NEW.status = 'assigned' AND OLD.status != 'assigned' THEN
        UPDATE public.orders 
        SET status = 'processing', updated_at = NOW() 
        WHERE id = NEW.order_id AND status != 'processing';
        
    ELSIF NEW.status = 'picked_up' AND OLD.status != 'picked_up' THEN
        UPDATE public.orders 
        SET status = 'shipped', updated_at = NOW() 
        WHERE id = NEW.order_id AND status != 'shipped';
        
    ELSIF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE public.orders 
        SET status = 'completed', payment_status = 'paid', updated_at = NOW() 
        WHERE id = NEW.order_id AND status != 'completed';
        
    ELSIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE public.orders 
        SET status = 'cancelled', updated_at = NOW() 
        WHERE id = NEW.order_id AND status != 'cancelled';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_delivery_order ON public.deliveries;
CREATE TRIGGER tr_sync_delivery_order
AFTER UPDATE OF status ON public.deliveries
FOR EACH ROW
EXECUTE FUNCTION public.sync_delivery_to_order_status();


-- 2. TRIGGER: Validate Delivery Role on Assignment
CREATE OR REPLACE FUNCTION public.validate_driver_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- Only check if driver_id is being set or changed and is not null
    IF NEW.driver_id IS NOT NULL AND (OLD.driver_id IS NULL OR NEW.driver_id != OLD.driver_id) THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = NEW.driver_id AND role = 'livreur'
        ) THEN
            RAISE EXCEPTION 'Assigned user % must have the "livreur" role.', NEW.driver_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_check_driver_role ON public.deliveries;
CREATE TRIGGER tr_check_driver_role
BEFORE INSERT OR UPDATE OF driver_id ON public.deliveries
FOR EACH ROW
EXECUTE FUNCTION public.validate_driver_role_assignment();


-- 3. TRIGGER: Prevent Status Revert (Integrity)
CREATE OR REPLACE FUNCTION public.prevent_delivery_status_revert()
RETURNS TRIGGER AS $$
BEGIN
    -- Once 'delivered', cannot go back to 'pending', 'assigned', 'picked_up', 'in_transit'
    IF OLD.status = 'delivered' AND NEW.status IN ('pending', 'assigned', 'picked_up', 'in_transit') THEN
         RAISE EXCEPTION 'Cannot revert status from "delivered" to "%".', NEW.status;
    END IF;
    
    -- Once 'cancelled', cannot go back to active statuses
    IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
         RAISE EXCEPTION 'Cannot revert status from "cancelled" to "%".', NEW.status;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_protect_delivery_status ON public.deliveries;
CREATE TRIGGER tr_protect_delivery_status
BEFORE UPDATE OF status ON public.deliveries
FOR EACH ROW
EXECUTE FUNCTION public.prevent_delivery_status_revert();

-- 4. RLS Policy Review (Ensure explicit policies exist)
-- Ensure Managers/Admins can see everything
DROP POLICY IF EXISTS "Admins and Managers view all deliveries" ON public.deliveries;
CREATE POLICY "Admins and Managers view all deliveries"
ON public.deliveries FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Ensure Merchants only see their deliveries
DROP POLICY IF EXISTS "Merchants view own deliveries" ON public.deliveries;
CREATE POLICY "Merchants view own deliveries"
ON public.deliveries FOR SELECT
USING (
  merchant_id = auth.uid()
);

-- Ensure Delivery only see assigned deliveries
DROP POLICY IF EXISTS "Delivery view assigned deliveries" ON public.deliveries;
CREATE POLICY "Delivery view assigned deliveries"
ON public.deliveries FOR SELECT
USING (
  driver_id = auth.uid()
);

-- Delivery can update status of their assigned deliveries
DROP POLICY IF EXISTS "Delivery update assigned deliveries" ON public.deliveries;
CREATE POLICY "Delivery update assigned deliveries"
ON public.deliveries FOR UPDATE
USING (
  driver_id = auth.uid()
)
WITH CHECK (
  driver_id = auth.uid() 
  -- Optionally restrict which columns can be updated here via trigger or separation
);
