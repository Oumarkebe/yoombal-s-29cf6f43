import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export type AiModuleSetting = {
  key: string;
  is_enabled: boolean;
  configuration: Json;
  id: string;
  created_at: string;
  updated_at: string;
};

async function fetchAiModuleSettings(): Promise<AiModuleSetting[]> {
    const { data, error } = await supabase.from('ai_module_settings').select('*');
    if (error) {
        console.error("Error fetching AI settings:", error);
        throw new Error('Impossible de charger les paramètres des modules IA.');
    }
    return data || [];
}

async function updateAiModuleSetting({ key, is_enabled, configuration }: { key: string, is_enabled?: boolean, configuration?: any }) {
    const updatePayload: { is_enabled?: boolean, configuration?: any, updated_at: string } = {
        updated_at: new Date().toISOString()
    };
    if (is_enabled !== undefined) {
        updatePayload.is_enabled = is_enabled;
    }
    if (configuration) {
        updatePayload.configuration = configuration;
    }

    const { data, error } = await supabase
        .from('ai_module_settings')
        .update(updatePayload)
        .eq('key', key)
        .select()
        .single();
    if (error) {
        console.error("Error updating AI setting:", error);
        throw new Error('Impossible de mettre à jour le module IA.');
    }
    return data;
}

export function useAiModuleSettings() {
    const queryClient = useQueryClient();

    const { data: settings = [], isLoading, error } = useQuery({
        queryKey: ['aiModuleSettings'],
        queryFn: fetchAiModuleSettings
    });

    const mutation = useMutation({
        mutationFn: updateAiModuleSetting,
        onSuccess: (updatedData, variables) => {
            queryClient.invalidateQueries({ queryKey: ['aiModuleSettings'] });
            // This is for the chatbot status hook, good to keep for consistency
            queryClient.invalidateQueries({ queryKey: ['chatbotStatus'] });
            
            if (variables.configuration) {
                toast.success(`La configuration du module '${variables.key}' a été mise à jour.`);
            } else {
                const status = updatedData.is_enabled ? 'activé' : 'désactivé';
                toast.success(`Le module '${variables.key}' a été ${status}.`);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
            queryClient.invalidateQueries({ queryKey: ['aiModuleSettings'] });
        },
    });

    return {
        settings,
        isLoading,
        error,
        updateSetting: mutation.mutate,
        isUpdating: mutation.isPending,
        mutationVariables: mutation.variables,
    };
}
