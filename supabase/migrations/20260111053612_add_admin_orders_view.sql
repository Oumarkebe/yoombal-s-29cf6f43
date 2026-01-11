-- Create admin_orders_view for admin dashboard
CREATE OR REPLACE VIEW admin_orders_view AS
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

-- Grant access to authenticated users
GRANT SELECT ON admin_orders_view TO authenticated;
GRANT SELECT ON admin_orders_view TO anon;
GRANT SELECT ON admin_orders_view TO service_role;
