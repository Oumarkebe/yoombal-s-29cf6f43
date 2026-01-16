
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
}

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
      supabase
        .from("bnpl_plans")
        .select("*, products(name, image_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) setError("Erreur lors de la récupération des plans BNPL");
          else setPlans((data || []) as BNPLPlan[]);
          setIsLoading(false);
        });
    };

    fetchPlans();

    // Realtime subscription with unique channel name to prevent conflicts
    const channelName = `bnpl_plans:${user.id}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bnpl_plans',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        // Refresh full list
        fetchPlans();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // console.log(`Subscribed to ${channelName}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { plans, isLoading, error };
}
