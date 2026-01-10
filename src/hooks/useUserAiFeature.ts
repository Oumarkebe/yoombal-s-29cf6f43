
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

    // 1. Check user-specific permissions from profiles (Monetization System)
    // The permission object structure is { active: boolean, expires_at: string | null }
    const userPermissions = (user as any).permissions || {};
    const specificPerm = userPermissions[featureKey];

    if (specificPerm && specificPerm.active) {
      // Check for expiration
      if (!specificPerm.expires_at) return true;
      const expiryDate = new Date(specificPerm.expires_at);
      if (expiryDate > new Date()) return true;
      // If expired, we don't return false yet, we might fall back to global settings
    }

    // 2. Check user-specific legacy settings (if any)
    const userSetting = userSettings.find(s => s.feature_key === featureKey);
    if (userSetting !== undefined) {
      return userSetting.is_enabled;
    }

    // 3. Fallback to platform-wide module setting (Free or Controlled by Admin)
    const moduleSetting = moduleSettings.find(m => m.key === featureKey);
    return moduleSetting?.is_enabled ?? false;
  };

  return { isEnabled: isEnabled(), isLoading };
}
