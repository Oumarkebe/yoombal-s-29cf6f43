
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type PublicStats = {
  clientCount: number;
  merchantCount: number;
  deliveryCount: number;
};

async function fetchPublicStats(): Promise<PublicStats> {
  const { count: clientCount, error: clientError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client');

  if (clientError) throw new Error(clientError.message);

  const { count: merchantCount, error: merchantError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'merchant');
  
  if (merchantError) throw new Error(merchantError.message);

  const { count: deliveryCount, error: deliveryError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'delivery');
  
  if (deliveryError) throw new Error(deliveryError.message);

  return {
    clientCount: clientCount ?? 0,
    merchantCount: merchantCount ?? 0,
    deliveryCount: deliveryCount ?? 0,
  };
}

export function usePublicStats() {
  return useQuery({
    queryKey: ['publicStats'],
    queryFn: fetchPublicStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
