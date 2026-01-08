
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserAiSettings, AiFeatureKey } from "@/hooks/useUserAiSettings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const AI_FEATURES_CONFIG: { key: AiFeatureKey; label: string; description: string }[] = [
  { key: "content_generation", label: "Génération de Contenu", description: "Permet à l'IA de générer des descriptions de produit pour vous." },
  { key: "pricing", label: "Pricing Dynamique", description: "Suggestions de prix IA (si activé par la plateforme)." },
  { key: "predictions", label: "Analyses Prédictives", description: "Accès aux statistiques avancées IA (si activé par la plateforme)." },
];

export function MyAiSettingsManager() {
  const { user } = useAuth();
  const { settings: userSettings, isLoading, updateSetting, isUpdating } = useUserAiSettings({ userId: user?.id });

  const handleToggle = (featureKey: AiFeatureKey, checked: boolean) => {
    if (user?.id) {
      updateSetting({ userId: user.id, featureKey, isEnabled: checked });
    }
  };

  if (!user) return null;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 border rounded-md bg-slate-50 mt-6">
      <h3 className="text-lg font-semibold text-amber-700 mb-2">Mes outils IA</h3>
      {AI_FEATURES_CONFIG.map(({ key, label, description }) => {
        const userSetting = userSettings.find(s => s.feature_key === key);
        const isChecked = userSetting?.is_enabled ?? false;

        return (
          <div key={key} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
            <div className="flex-1 pr-6">
              <Label htmlFor={`ai-pro-${key}`} className="font-medium">{label}</Label>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <Switch
              id={`ai-pro-${key}`}
              checked={isChecked}
              onCheckedChange={checked => handleToggle(key, checked)}
              disabled={isUpdating}
            />
          </div>
        );
      })}
    </div>
  );
}

export default MyAiSettingsManager;
