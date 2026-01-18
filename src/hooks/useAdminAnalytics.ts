
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type DailyMetric = {
    date: string;
    orders: number;
    revenue: number;
};

async function fetchAdminAnalytics(): Promise<DailyMetric[]> {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const dailyData = await Promise.all(last7Days.map(async (date) => {
        const { count: ordersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', `${date}T00:00:00`)
            .lte('created_at', `${date}T23:59:59`);

        const { data: ordersData } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('status', 'completed')
            .gte('created_at', `${date}T00:00:00`)
            .lte('created_at', `${date}T23:59:59`);

        const revenue = ordersData?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

        return {
            date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
            orders: ordersCount || 0,
            revenue: revenue
        };
    }));

    return dailyData;
}

export function useAdminAnalytics() {
    return useQuery({
        queryKey: ['adminAnalytics'],
        queryFn: fetchAdminAnalytics,
        staleTime: 5 * 60 * 1000,
    });
}
