
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type BNPLPlan = {
  id: string;
  user_id: string;
  product_id?: string;
  order_id?: string;
  total_amount: number;
  monthly_payment: number;
  duration_months?: number;
  remaining_months: number;
  next_payment_date: string | null;
  status: string;
  created_at: string;
}

export function useBNPLPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<BNPLPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    supabase
      .from("bnpl_plans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError("Erreur lors de la récupération des plans BNPL");
        else setPlans((data || []) as BNPLPlan[]);
        setIsLoading(false);
      });
  }, [user]);

  return { plans, isLoading, error };
}
