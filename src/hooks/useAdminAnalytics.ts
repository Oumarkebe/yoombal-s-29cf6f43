import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type DailyMetric = {
  date: string;
  orders: number;
  revenue: number;
};

async function fetchAdminAnalytics(): Promise<DailyMetric[]> {
  const { data, error } = await supabase.rpc('get_admin_analytics');

  if (error) {
    console.error('Error fetching admin analytics:', error);
    throw error;
  }

  return (data || []) as DailyMetric[];
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: fetchAdminAnalytics,
    staleTime: 5 * 60 * 1000,
  });
}
