import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AiFeatureKey =
  | 'content_generation'
  | 'pricing'
  | 'predictions'
  | 'ai_assistant'
  | 'ai_vision'
  | 'ai_smart_search'
  | 'advanced_stats'
  | 'fraud_detection'
  | 'stock_prediction'
  | 'product_recommendations'
  | 'marketing_automation'
  | 'referral_system'
  | 'vip_program'
  | 'gamification';

export interface UserAiFeatureSetting {
  id: string;
  user_id: string;
  feature_key: AiFeatureKey;
  is_enabled: boolean;
}

// Fetch settings for a user using user_ai_settings table (correct table name)
async function fetchUserAiSettings(userId: string): Promise<UserAiFeatureSetting[]> {
  const { data, error } = await supabase
    .from('user_ai_settings')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user AI settings:', error);
    return [];
  }

  // Map from user_ai_settings to our interface
  return (data || []).map((item) => ({
    id: item.id,
    user_id: item.user_id,
    feature_key: item.feature_key as AiFeatureKey,
    is_enabled: item.is_enabled ?? false,
  }));
}

// Upsert a setting for a user
async function upsertUserAiSetting({ 
  userId, 
  featureKey, 
  isEnabled 
}: { 
  userId: string; 
  featureKey: AiFeatureKey; 
  isEnabled: boolean;
}) {
  // First check if record exists
  const { data: existing } = await supabase
    .from('user_ai_settings')
    .select('id')
    .eq('user_id', userId)
    .eq('feature_key', featureKey)
    .maybeSingle();

  if (existing) {
    // Update existing record
    const { data, error } = await supabase
      .from('user_ai_settings')
      .update({
        is_enabled: isEnabled,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from('user_ai_settings')
      .insert({
        user_id: userId,
        feature_key: featureKey,
        is_enabled: isEnabled
      })
      .select();

    if (error) throw new Error(error.message);
    return data;
  }
}

export function useUserAiSettings({ userId }: { userId?: string }) {
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading, error } = useQuery({
    queryKey: ['userAiSettings', userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchUserAiSettings(userId);
    },
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: upsertUserAiSetting,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userAiSettings', userId] });
      toast.success(`Réglage IA '${variables.featureKey}' mis à jour.`);
    },
    onError: (err: Error) => {
      toast.error(`Erreur: ${err.message}`);
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSetting: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
