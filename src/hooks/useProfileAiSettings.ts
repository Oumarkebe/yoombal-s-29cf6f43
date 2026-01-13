
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

// This hook manages AI settings per profile type
// Note: The ai_feature_profile_settings table would need to be created via migration
// For now, we use a mock implementation that stores settings in memory

const mockSettings: ProfileAiFeatureSetting[] = [];

async function fetchProfileAiSettings(): Promise<ProfileAiFeatureSetting[]> {
  // Try to fetch from ai_module_settings as a fallback
  // In production, create ai_feature_profile_settings table
  try {
    const { data, error } = await supabase
      .from('ai_module_settings')
      .select('*');
    
    if (error) {
      console.warn('ai_feature_profile_settings table not found, using mock data');
      return mockSettings;
    }
    
    // Map ai_module_settings to profile settings format
    return (data || []).map((item, index) => ({
      id: item.id,
      profile_type: 'admin' as ProfileType,
      feature_key: item.key as AiFeatureKey,
      is_enabled: item.is_enabled || false,
    }));
  } catch {
    return mockSettings;
  }
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
  // Update in ai_module_settings as fallback
  const { data, error } = await supabase
    .from('ai_module_settings')
    .upsert(
      {
        key: feature_key,
        is_enabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
    .select();
  
  if (error) {
    console.warn('Error updating AI setting:', error);
    // Update mock data
    const existingIndex = mockSettings.findIndex(
      s => s.profile_type === profile_type && s.feature_key === feature_key
    );
    if (existingIndex >= 0) {
      mockSettings[existingIndex].is_enabled = is_enabled;
    } else {
      mockSettings.push({
        id: `${profile_type}-${feature_key}`,
        profile_type,
        feature_key,
        is_enabled,
      });
    }
    return mockSettings;
  }
  
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
      toast.success('Paramètre AI de profil mis à jour !');
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : 'Erreur update AI setting admin';
      toast.error(errorMessage);
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
