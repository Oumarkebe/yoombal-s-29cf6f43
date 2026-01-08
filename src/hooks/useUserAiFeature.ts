
import { useAuth } from '@/contexts/AuthContext';
import { useAiModuleSettings } from './useAiModuleSettings';
import { useUserAiSettings, AiFeatureKey } from './useUserAiSettings';

export function useUserAiFeature(featureKey: AiFeatureKey) {
  const { user } = useAuth();
  const { settings: moduleSettings, isLoading: isLoadingModuleSettings } = useAiModuleSettings();
  const { settings: userSettings, isLoading: isLoadingUserSettings } = useUserAiSettings({ userId: user?.id });

  const isLoading = isLoadingModuleSettings || isLoadingUserSettings;

  const isEnabled = () => {
    if (!user) return false;

    const userSetting = userSettings.find(s => s.feature_key === featureKey);
    // User-specific setting takes precedence
    if (userSetting !== undefined) {
      return userSetting.is_enabled;
    }

    // Fallback to platform-wide module setting
    const moduleSetting = moduleSettings.find(m => m.key === featureKey);
    return moduleSetting?.is_enabled ?? false;
  };
  
  return { isEnabled: isEnabled(), isLoading };
}
