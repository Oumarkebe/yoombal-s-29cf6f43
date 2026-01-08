
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useMerchantBNPLApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchMerchantApplications();
  }, [user]);

  const fetchMerchantApplications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("bnpl_applications")
        .select(`
          *,
          products (name, price, image_url),
          profiles!bnpl_applications_user_id_fkey (first_name, last_name, email)
        `)
        .eq("merchant_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setError("Erreur lors de la récupération des demandes");
      console.error("Error fetching merchant BNPL applications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: string, 
    decision: 'approved' | 'rejected',
    notes?: string
  ) => {
    try {
      const { error } = await supabase
        .from("bnpl_applications")
        .update({
          merchant_decision: decision,
          merchant_decision_date: new Date().toISOString(),
          application_status: decision === 'approved' ? 'approved' : 'rejected'
        })
        .eq("id", applicationId);

      if (error) throw error;

      // Si approuvé, créer le plan BNPL
      if (decision === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          await createBNPLPlan(application);
        }
      }

      await fetchMerchantApplications();
      return { success: true };
    } catch (err) {
      console.error("Error updating application status:", err);
      return { success: false, error: "Erreur lors de la mise à jour" };
    }
  };

  const createBNPLPlan = async (application: any) => {
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    const { error } = await supabase
      .from("bnpl_plans")
      .insert({
        user_id: application.user_id,
        order_id: `order-${application.id}`, // Temporaire, à remplacer par vraie commande
        total_amount: application.requested_amount,
        monthly_payment: application.monthly_payment,
        remaining_months: application.plan_duration,
        next_payment_date: nextPaymentDate.toISOString().split('T')[0],
        status: 'active',
        plan_duration: application.plan_duration,
        fees_amount: application.fees_amount,
        first_payment_amount: application.first_payment_amount
      });

    if (error) throw error;
  };

  return {
    applications,
    isLoading,
    error,
    updateApplicationStatus,
    refetch: fetchMerchantApplications
  };
}
