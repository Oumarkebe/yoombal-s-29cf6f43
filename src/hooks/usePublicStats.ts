
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type PublicStats = {
  clientCount: number;
  merchantCount: number;
  deliveryCount: number;
};

async function fetchPublicStats(): Promise<PublicStats> {
  // Count users by checking user_roles table instead of profiles.role
  const { count: totalProfiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (profilesError) throw new Error(profilesError.message);

  const { count: merchantCount, error: merchantError } = await supabase
    .from('user_roles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'merchant');
  
  if (merchantError) throw new Error(merchantError.message);

  const { count: driverCount, error: driverError } = await supabase
    .from('user_roles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'driver');
  
  if (driverError) throw new Error(driverError.message);

  // Calculate client count as total minus merchants and drivers
  const clientCount = Math.max(0, (totalProfiles ?? 0) - (merchantCount ?? 0) - (driverCount ?? 0));

  return {
    clientCount,
    merchantCount: merchantCount ?? 0,
    deliveryCount: driverCount ?? 0,
  };
}

export function usePublicStats() {
  return useQuery({
    queryKey: ['publicStats'],
    queryFn: fetchPublicStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
