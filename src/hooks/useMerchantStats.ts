
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MerchantStats {
    totalSales: number;
    totalRevenue: number;
    newOrders: number;
    revenueGrowth: number;
    ordersGrowth: number;
    recentActivity: { date: string, revenue: number, orders: number }[];
}

export const useMerchantStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['merchantStats', user?.id],
        queryFn: async (): Promise<MerchantStats> => {
            if (!user?.id) throw new Error("Unauthorized");

            // 1. Fetch Orders within last 30 days vs previous 30 days for growth
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString();
            const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)).toISOString();

            const { data: currentOrders, error: currentError } = await supabase
                .from('orders')
                .select('total_amount, created_at, status')
                .eq('merchant_id', user.id)
                .gte('created_at', thirtyDaysAgo);

            const { data: previousOrders, error: previousError } = await supabase
                .from('orders')
                .select('total_amount')
                .eq('merchant_id', user.id)
                .gte('created_at', sixtyDaysAgo)
                .lt('created_at', thirtyDaysAgo);

            if (currentError || previousError) throw currentError || previousError;

            const totalRevenue = currentOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
            const prevRevenue = previousOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
            const totalSales = currentOrders?.length || 0;
            const prevSales = previousOrders?.length || 0;

            const revenueGrowth = prevRevenue === 0 ? 100 : Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100);
            const ordersGrowth = prevSales === 0 ? 100 : Math.round(((totalSales - prevSales) / prevSales) * 100);

            // Fetch new orders (pending)
            const { count: newOrders } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('merchant_id', user.id)
                .eq('status', 'pending');

            // Generate daily activity for the last 7 days for the chart
            const last7Days = Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toISOString().split('T')[0];
            });

            const recentActivity = last7Days.map(date => {
                const dayOrders = currentOrders?.filter(o => o.created_at.startsWith(date)) || [];
                return {
                    date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
                    revenue: dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
                    orders: dayOrders.length
                };
            });

            return {
                totalSales,
                totalRevenue,
                newOrders: newOrders || 0,
                revenueGrowth,
                ordersGrowth,
                recentActivity
            };
        },
        enabled: !!user?.id,
    });
};
