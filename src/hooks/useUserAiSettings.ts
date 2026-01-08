import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AiFeatureKey = 'content_generation' | 'pricing' | 'predictions';

export interface UserAiFeatureSetting {
  id: string;
  user_id: string;
  feature_key: AiFeatureKey;
  is_enabled: boolean;
}

// Fetch settings for a user
async function fetchUserAiSettings(userId: string): Promise<UserAiFeatureSetting[]> {
  const { data, error } = await supabase
    .from('user_ai_feature_settings')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw new Error(error.message);
  // We cast the result because Supabase types 'feature_key' as string, 
  // but we use a more specific union type (AiFeatureKey) in our code.
  return (data as UserAiFeatureSetting[]) || [];
}

// Upsert a setting for a user
async function upsertUserAiSetting({ userId, featureKey, isEnabled }: { userId: string, featureKey: AiFeatureKey, isEnabled: boolean }) {
  const { data, error } = await supabase
    .from('user_ai_feature_settings')
    .upsert({ user_id: userId, feature_key: featureKey, is_enabled: isEnabled }, { onConflict: 'user_id, feature_key' })
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export function useUserAiSettings({ userId }: { userId?: string }) {
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading, error } = useQuery({
    queryKey: ['userAiSettings', userId],
    queryFn: () => {
        if (!userId) return Promise.resolve([]);
        return fetchUserAiSettings(userId)
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
