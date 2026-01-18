
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type AdminStats = {
    usersCount: number;
    productsCount: number;
    ordersCount: number;
    totalRevenue: number;
    pendingKycCount: number;
};

async function fetchAdminStats(): Promise<AdminStats> {
    const [
        { count: usersCount, error: usersError },
        { count: productsCount, error: productsError },
        { count: ordersCount, error: ordersError },
        { data: revenueData, error: revenueError },
        { count: pendingKycCount, error: kycError }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount').eq('status', 'completed'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('kyc_status', 'pending')
    ]);

    if (usersError) throw usersError;
    if (productsError) throw productsError;
    if (ordersError) throw ordersError;
    if (revenueError) throw revenueError;
    if (kycError) throw kycError;

    // Fallback to all orders if 'completed' status doesn't exist or we want all
    let totalRevenue = revenueData?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;

    return {
        usersCount: usersCount || 0,
        productsCount: productsCount || 0,
        ordersCount: ordersCount || 0,
        totalRevenue: totalRevenue,
        pendingKycCount: pendingKycCount || 0,
    };
}

export function useAdminDashboardStats() {
    return useQuery({
        queryKey: ['adminDashboardStats'],
        queryFn: fetchAdminStats,
        refetchOnWindowFocus: false
    });
}
