
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type BNPLApplication = {
  id: string;
  user_id: string;
  product_id: string;
  merchant_id: string;
  applicant_phone?: string;
  applicant_id_number?: string;
  id_card_url?: string;
  photo_url?: string;
  contract_signed_at?: string;
  requested_amount: number;
  plan_duration: number;
  monthly_payment: number;
  fees_amount: number;
  first_payment_amount: number;
  application_status: string;
  merchant_decision: string | null;
  merchant_decision_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useBNPLApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<BNPLApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await (supabase.from('bnpl_applications' as any) as any)
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications((data || []) as BNPLApplication[]);
    } catch (err) {
      setError("Erreur lors de la récupération des demandes BNPL");
      console.error("Error fetching BNPL applications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createApplication = async (applicationData: {
    product_id: string;
    merchant_id: string;
    requested_amount: number;
    plan_duration: number;
    monthly_payment: number;
    fees_amount: number;
    first_payment_amount: number;
    applicant_phone?: string;
    applicant_id_number?: string;
    id_card_url?: string;
    photo_url?: string;
    contract_signed_at?: string;
  }) => {
    try {
      const { data, error } = await (supabase.from('bnpl_applications' as any) as any)
        .insert({
          ...applicationData,
          user_id: user!.id,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchApplications();
      return { success: true, data };
    } catch (err) {
      console.error("Error creating BNPL application:", err);
      return { success: false, error: "Erreur lors de la création de la demande" };
    }
  };

  return {
    applications,
    isLoading,
    error,
    createApplication,
    refetch: fetchApplications
  };
}
