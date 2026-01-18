
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PremiumFeature {
  id: string;
  feature_key: string;
  name: string;
  description: string;
  category: string;
  is_premium: boolean;
  price_monthly: number;
  is_enabled: boolean;
  is_free: boolean;
  configuration: any;
  created_at: string;
  updated_at: string;
}

async function fetchPremiumFeatures(): Promise<PremiumFeature[]> {
  const { data, error } = await supabase
    .from('premium_features')
    .select('*')
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching premium features:', error);
    throw new Error('Impossible de charger les fonctionnalités premium.');
  }

  return data || [];
}

async function updatePremiumFeature({
  feature_key,
  is_enabled,
  is_free,
  configuration
}: {
  feature_key: string;
  is_enabled?: boolean;
  is_free?: boolean;
  configuration?: any;
}) {
  const updatePayload: any = {
    updated_at: new Date().toISOString()
  };

  if (is_enabled !== undefined) {
    updatePayload.is_enabled = is_enabled;
  }

  if (is_free !== undefined) {
    updatePayload.is_free = is_free;
  }

  if (configuration) {
    updatePayload.configuration = configuration;
  }

  const { data, error } = await supabase
    .from('premium_features')
    .update(updatePayload)
    .eq('feature_key', feature_key)
    .select()
    .single();

  if (error) {
    console.error('Error updating premium feature:', error);
    throw new Error('Impossible de mettre à jour la fonctionnalité premium.');
  }

  return data;
}

export function usePremiumFeatures() {
  const queryClient = useQueryClient();

  const { data: features = [], isLoading, error } = useQuery({
    queryKey: ['premiumFeatures'],
    queryFn: fetchPremiumFeatures,
  });

  const mutation = useMutation({
    mutationFn: updatePremiumFeature,
    onSuccess: (updatedData, variables) => {
      queryClient.invalidateQueries({ queryKey: ['premiumFeatures'] });
      queryClient.invalidateQueries({ queryKey: ['aiModuleSettings'] });

      if (variables.configuration) {
        toast.success(`Configuration de '${variables.feature_key}' mise à jour.`);
      } else {
        const status = updatedData.is_enabled ? 'activée' : 'désactivée';
        toast.success(`Fonctionnalité '${updatedData.name}' ${status}.`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
      queryClient.invalidateQueries({ queryKey: ['premiumFeatures'] });
    },
  });

  // Grouper les fonctionnalités par catégorie
  const featuresByCategory = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, PremiumFeature[]>);

  return {
    features,
    featuresByCategory,
    isLoading,
    error,
    updateFeature: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
