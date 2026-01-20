CREATE OR REPLACE FUNCTION public.get_admin_analytics()
RETURNS TABLE (
    date text,
    orders bigint,
    revenue numeric
) AS $$
BEGIN
    RETURN QUERY
    WITH date_series AS (
        SELECT generate_series(
            CURRENT_DATE - interval '6 days',
            CURRENT_DATE,
            interval '1 day'
        )::date AS d
    )
    SELECT 
        to_char(ds.d, 'Dy') as date,
        COUNT(o.id) as orders,
        COALESCE(SUM(o.total_amount), 0) as revenue
    FROM date_series ds
    LEFT JOIN public.orders o ON o.created_at::date = ds.d AND o.status = 'completed'
    GROUP BY ds.d
    ORDER BY ds.d;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
