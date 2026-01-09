
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
          products (name, price, image_url)
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
        // Generate a real UUID for order_id if no real order exists yet, 
        // OR better: make order_id nullable in schema if allowed, but schema usually requires it.
        // Since we don't have a real order here (BNPL standalone request), and order_id expects UUID,
        // we should probably generate a new UUID or link to a real order.
        // For now, let's generate a UUID to satisfy the constraint.
        order_id: crypto.randomUUID(),

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

  const deleteApplication = async (applicationId: string) => {
    try {
      // 1. Fetch file paths before deleting the record
      const { data: appData } = await supabase
        .from("bnpl_applications")
        .select("id_card_url, photo_url")
        .eq("id", applicationId)
        .single();

      // 2. Delete files from storage if they exist
      if (appData) {
        const filesToRemove: string[] = [];
        if (appData.id_card_url) filesToRemove.push(appData.id_card_url);
        if (appData.photo_url) filesToRemove.push(appData.photo_url);

        if (filesToRemove.length > 0) {
          await supabase.storage
            .from('bnpl-documents')
            .remove(filesToRemove);
        }
      }

      // 3. Delete the database record
      const { error } = await supabase
        .from("bnpl_applications")
        .delete()
        .eq("id", applicationId);

      if (error) throw error;

      // Optimistic update: remove from local state immediately
      setApplications(prev => prev.filter(app => app.id !== applicationId));

      // fetching again is fine to ensure sync, but the local update handles the UI 
      await fetchMerchantApplications();
      return { success: true };
    } catch (err) {
      console.error("Error deleting application:", err);
      return { success: false, error: "Erreur lors de la suppression" };
    }
  };

  return {
    applications,
    isLoading,
    error,
    updateApplicationStatus,
    deleteApplication,
    refetch: fetchMerchantApplications
  };
}
