import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MerchantStats {
  totalSales: number;
  totalRevenue: number;
  newOrders: number;
  revenueGrowth: number;
  ordersGrowth: number;
  recentActivity: { date: string; revenue: number; orders: number }[];
  topProducts: { id: string; name: string; sales: number; revenue: number }[];
}

export const useMerchantStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['merchantStats', user?.id],
    queryFn: async (): Promise<MerchantStats> => {
      if (!user?.id) throw new Error('Unauthorized');

      // 1. Fetch Orders
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

      // Current period orders (last 30d)
      const { data: currentOrders, error: currentError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          created_at,
          status,
          order_items (
            quantity,
            price,
            product_id,
            products (name)
          )
        `)
        .eq('merchant_id', user.id)
        .gte('created_at', thirtyDaysAgo);

      if (currentError) throw currentError;

      // Previous period orders (30d-60d ago) for growth calc
      const { data: previousOrders, error: previousError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('merchant_id', user.id)
        .gte('created_at', sixtyDaysAgo)
        .lt('created_at', thirtyDaysAgo);

      if (previousError) throw previousError;

      const totalRevenue = currentOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
      const prevRevenue = previousOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
      const totalSales = currentOrders?.length || 0;
      const prevSales = previousOrders?.length || 0;

      const revenueGrowth =
        prevRevenue === 0 ? (totalRevenue > 0 ? 100 : 0) : Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100);
      const ordersGrowth =
        prevSales === 0 ? (totalSales > 0 ? 100 : 0) : Math.round(((totalSales - prevSales) / prevSales) * 100);

      // Fetch pending orders count
      const { count: newOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('merchant_id', user.id)
        .eq('status', 'pending');

      // Calculate recent activity (Daily stats)
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });

      const recentActivity = last7Days.map((date) => {
        const dayOrders = currentOrders?.filter((o) => o.created_at.startsWith(date)) || [];
        return {
          date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
          revenue: dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
          orders: dayOrders.length,
        };
      });

      // Calculate Top Products
      const productMap = new Map<string, { name: string; sales: number; revenue: number }>();

      currentOrders?.forEach(order => {
        order.order_items.forEach((item: any) => {
          if (!item.products) return;
          const pid = item.product_id;
          const current = productMap.get(pid) || { name: item.products.name, sales: 0, revenue: 0 };

          productMap.set(pid, {
            name: current.name,
            sales: current.sales + item.quantity,
            revenue: current.revenue + (item.price * item.quantity)
          });
        });
      });

      const topProducts = Array.from(productMap.entries())
        .map(([id, stats]) => ({ id, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      return {
        totalSales,
        totalRevenue,
        newOrders: newOrders || 0,
        revenueGrowth,
        ordersGrowth,
        recentActivity,
        topProducts
      };
    },
    enabled: !!user?.id,
  });
};
