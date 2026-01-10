import React from 'react';
import { useUserAiSettings, AiFeatureKey } from '@/hooks/useUserAiSettings';
import { useAiModuleSettings } from '@/hooks/useAiModuleSettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface UserAiSettingsManagerProps {
  userId: string;
}

const AI_FEATURES_CONFIG: { key: AiFeatureKey; label: string; description: string }[] = [
  { key: 'content_generation', label: 'Génération de Contenu', description: "Autoriser la génération de descriptions de produits par l'IA." },
  { key: 'pricing', label: 'Pricing Dynamique', description: "Activer les suggestions de prix basées sur l'IA." },
  { key: 'predictions', label: 'Analyses Prédictives', description: "Fournir des prédictions de ventes et de tendances." },
  { key: 'ai_assistant', label: 'Assistant IA', description: "Activer le chatbot d'assistance intelligent pour le marchand." },
  { key: 'ai_vision', label: 'Vision IA', description: "Activer le contrôle qualité des images et l'analyse visuelle." },
  { key: 'ai_smart_search', label: 'Recherche Intelligente', description: "Activer la recherche vocale et visuelle pour les clients." },
];

export function UserAiSettingsManager({ userId }: UserAiSettingsManagerProps) {
  const { settings: userSettings, isLoading: isLoadingUserSettings, updateSetting, isUpdating } = useUserAiSettings({ userId });
  const { settings: moduleSettings, isLoading: isLoadingModuleSettings } = useAiModuleSettings();

  const handleToggle = (featureKey: AiFeatureKey, checked: boolean) => {
    updateSetting({ userId, featureKey, isEnabled: checked });
  };

  const getEffectiveStatus = (featureKey: AiFeatureKey) => {
    const userSetting = userSettings.find(s => s.feature_key === featureKey);
    if (userSetting !== undefined) {
      return userSetting.is_enabled; // User override takes precedence
    }
    // Default to platform setting from modules
    const moduleSetting = moduleSettings.find(m => m.key === featureKey);
    return moduleSetting?.is_enabled ?? false;
  };

  if (isLoadingUserSettings || isLoadingModuleSettings) {
    return <div className="flex items-center justify-center p-4"><Loader2 className="w-4 h-4 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-2 text-xs font-semibold text-gray-600">Fonctionnalités IA :</div>
      {AI_FEATURES_CONFIG.map(({ key, label, description }) => {
        const isChecked = getEffectiveStatus(key);
        const userOverride = userSettings.find(s => s.feature_key === key);

        return (
          <div key={key} className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <Label htmlFor={`ai-${key}`} className="font-medium">{label}</Label>
              <p className="text-xs text-gray-500">{description}</p>
              {userOverride === undefined && (
                <p className="text-xs text-blue-500 italic mt-1">Utilise le paramètre global (actuellement {isChecked ? "activé" : "désactivé"})</p>
              )}
              {userOverride !== undefined && (
                <p className="text-xs text-purple-600 italic mt-1">Paramètre spécifique appliqué.</p>
              )}
            </div>
            <Switch
              id={`ai-${key}`}
              checked={isChecked}
              onCheckedChange={(checked) => handleToggle(key, checked)}
              disabled={isUpdating}
            />
          </div>
        );
      })}
    </div>
  );
}
