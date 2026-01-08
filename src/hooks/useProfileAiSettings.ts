
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ProfileType = 'client' | 'marchand' | 'livreur' | 'admin' | 'pro';
export type AiFeatureKey = 'content_generation' | 'pricing' | 'predictions';

export interface ProfileAiFeatureSetting {
  id: string;
  profile_type: ProfileType;
  feature_key: AiFeatureKey;
  is_enabled: boolean;
}

async function fetchProfileAiSettings(): Promise<ProfileAiFeatureSetting[]> {
  const { data, error } = await supabase
    .from('ai_feature_profile_settings')
    .select('*');
  if (error) throw new Error(error.message);
  return (data as ProfileAiFeatureSetting[]) || [];
}

async function upsertProfileAiSetting({
  profile_type,
  feature_key,
  is_enabled,
}: {
  profile_type: ProfileType;
  feature_key: AiFeatureKey;
  is_enabled: boolean;
}) {
  const { data, error } = await supabase
    .from('ai_feature_profile_settings')
    .upsert(
      {
        profile_type,
        feature_key,
        is_enabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'profile_type,feature_key' }
    )
    .select();
  if (error) throw new Error(error.message);
  return data;
}

export function useProfileAiSettings() {
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading, error } = useQuery({
    queryKey: ['profileAiSettings'],
    queryFn: fetchProfileAiSettings,
  });

  const mutation = useMutation({
    mutationFn: upsertProfileAiSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileAiSettings'] });
      toast.success('Paramètre AI de profil mis à jour !');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erreur update AI setting admin');
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
