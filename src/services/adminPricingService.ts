import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminPremiumPlan {
  id?: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly?: number;
  slug: string;
  features: string[];
  is_active: boolean;
  display_order: number;
  cta?: string; // Optional in DB, used in UI
  ctaLink?: string; // Optional in DB, used in UI
  highlight?: boolean; // UI only usually, but we can store in metadata if needed
}

export const adminPricingService = {
  /**
   * Fetch all plans including inactive ones for admin management
   */
  async getAllPlans(): Promise<AdminPremiumPlan[]> {
    const { data, error } = await supabase
      .from('premium_plans' as any)
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }

    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price_monthly: p.price_monthly,
      price_yearly: p.price_yearly,
      slug: p.slug,
      features: p.features || [],
      is_active: p.is_active,
      display_order: p.display_order,
      // Map UI fields if they exist in DB or fallback
      cta: p.cta || "S'abonner",
      ctaLink: p.cta_link || '/premium/subscribe',
      highlight: p.is_highlighted || false,
    }));
  },

  /**
   * Upsert (Create or Update) a plan
   */
  async upsertPlan(plan: AdminPremiumPlan) {
    // Transform formatting for DB
    const dbPayload = {
      name: plan.name,
      description: plan.description,
      price_monthly: plan.price_monthly,
      price_yearly: plan.price_yearly || plan.price_monthly * 10, // Default logic
      slug: plan.slug || plan.name.toLowerCase().replace(/\s+/g, '-'),
      features: plan.features,
      is_active: plan.is_active,
      display_order: plan.display_order,
      // If we added these columns to the DB, good. If not, this might error if strict.
      // Assuming we rely on the schema implicit in useSubscription, we might need to add cta/link columns if missing.
      // For now, let's keep it safe and assuming basic columns exist.
    };

    if (plan.id && !plan.id.startsWith('temp-')) {
      // Update
      const { data, error } = await supabase
        .from('premium_plans' as any)
        .update(dbPayload)
        .eq('id', plan.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create
      const { data, error } = await supabase
        .from('premium_plans' as any)
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  /**
   * Delete a plan
   */
  async deletePlan(id: string) {
    const { error } = await supabase
      .from('premium_plans' as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
