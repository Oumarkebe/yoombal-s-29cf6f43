import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type BNPLPlan = {
  id: string;
  user_id: string;
  product_id?: string;
  merchant_id?: string;
  order_id?: string;
  total_amount: number;
  monthly_payment: number;
  duration_months?: number;
  remaining_months: number;
  next_payment_date: string | null;
  status: string;
  created_at: string;
  installments?: any[];
  products?: {
    name: string;
    image_url: string;
  };
};

export function useBNPLPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<BNPLPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    const fetchPlans = () => {
      setIsLoading(true);
      (supabase as any)
        .from('bnpl_plans')
        .select('*, products(name, image_url)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }: any) => {
          if (error) setError('Erreur lors de la récupération des plans BNPL');
          else setPlans((data || []) as BNPLPlan[]);
          setIsLoading(false);
        });
    };

    fetchPlans();

    // Realtime subscription with unique channel name to prevent conflicts
    // Debounce subscription to avoid rapid connect/disconnect on mounting
    const channelName = `bnpl_plans:${user.id}`;
    let channel: any = null;

    const timeoutId = setTimeout(() => {
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bnpl_plans',
            filter: `client_id=eq.${user.id}`,
          },
          (payload) => {
            // Refresh full list
            fetchPlans();
          }
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.warn(
              `Realtime connection failed for ${channelName}. Server might be unreachable.`
            );
          }
        });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (channel) {
        supabase
          .removeChannel(channel)
          .catch((err) => console.debug('Error cleaning up channel:', err));
      }
    };
  }, [user]);

  const processPayment = async (planId: string, amount: number) => {
    try {
      const { data, error } = await supabase.rpc('process_bnpl_payment', {
        p_plan_id: planId,
        p_amount: amount,
        p_payment_method: 'wallet',
      });

      if (error) throw error;

      const result = data as any;
      if (!result.success) throw new Error(result.error);

      return result;
    } catch (err: any) {
      console.error('BNPL Payment error:', err);
      throw err;
    }
  };

  return { plans, isLoading, error, processPayment };
}
