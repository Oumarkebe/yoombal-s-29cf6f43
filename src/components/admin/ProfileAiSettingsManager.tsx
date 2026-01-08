
import React from 'react';
import { useProfileAiSettings, ProfileType, AiFeatureKey } from '@/hooks/useProfileAiSettings';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Les features AI configurables
const AI_FEATURES: { key: AiFeatureKey; label: string; description: string }[] = [
  { key: "content_generation", label: "Génération de Contenu", description: "Générer des descriptions automatiques, titres, etc." },
  { key: "pricing", label: "Pricing IA", description: "Propositions de prix dynamiques via IA." },
  { key: "predictions", label: "Analyses Prédictives", description: "Statistiques ou prévisions alimentées par l’IA." },
];

const PROFILE_TYPES: { key: ProfileType; label: string }[] = [
  { key: "client", label: "Client" },
  { key: "pro", label: "Client Pro" },
  { key: "marchand", label: "Marchand" },
  { key: "livreur", label: "Livreur" },
  { key: "admin", label: "Admin" },
];

export function ProfileAiSettingsManager() {
  const { settings, isLoading, updateSetting, isUpdating } = useProfileAiSettings();

  if (isLoading) return <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-4 h-4 animate-spin"/> Chargement réglages IA…</div>;

  return (
    <Card className="mt-4">
      <CardHeader>
        <span className="font-bold text-amber-700 text-lg">Outils IA par type de compte</span>
        <p className="text-xs text-gray-500">Activez ou désactivez chaque outil IA pour chaque type de compte.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {PROFILE_TYPES.map(profile => (
          <div key={profile.key}>
            <div className="font-medium text-sm mb-2 mt-2">{profile.label}</div>
            <div className="flex flex-wrap gap-4">
              {AI_FEATURES.map(({ key, label, description }) => {
                const setting = settings.find(
                  s => s.profile_type === profile.key && s.feature_key === key
                );
                const checked = setting?.is_enabled ?? false;
                return (
                  <div
                    key={key}
                    className="border px-4 py-2 rounded flex items-center gap-2 bg-slate-50 min-w-[210px]"
                  >
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-sm">{label}</span>
                      <span className="text-xs text-gray-500">{description}</span>
                    </div>
                    <Switch
                      checked={checked}
                      disabled={isUpdating}
                      onCheckedChange={v =>
                        updateSetting({ profile_type: profile.key, feature_key: key, is_enabled: v })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default ProfileAiSettingsManager;
