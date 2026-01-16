
import { supabase } from '@/integrations/supabase/client';

export interface PremiumFeature {
    id: string;
    feature_key: string;
    name: string;
    description: string;
    category: string;
    is_premium: boolean;
    is_enabled: boolean; // Global admin toggle
}

export interface UserFeatureOverride {
    feature_key: string;
    is_enabled: boolean | null; // null means "inherit from plan/default"
}

export interface EffectiveFeatureState {
    feature: PremiumFeature;
    isInherited: boolean; // True if determined by plan/default, False if overridden
    isEnabled: boolean; // The final computed state
    overrideValue: boolean | null; // The explicit override if any
    source: 'plan' | 'global_off' | 'override_on' | 'override_off' | 'default';
}

export const adminFeatureService = {
    /**
     * Fetch all system features, grouped by category if needed by caller.
     */
    async getAllFeatures(): Promise<PremiumFeature[]> {
        const { data, error } = await supabase
            .from('premium_features')
            .select('*')
            .order('category')
            .order('name');

        if (error) throw error;

        return (data || []).map((f: any) => ({
            id: f.id,
            feature_key: f.feature_key,
            name: f.name || f.feature_key,
            description: f.description,
            category: f.category || 'General',
            is_premium: f.is_premium,
            is_enabled: f.is_enabled !== false // Default to true if null
        }));
    },

    /**
     * Fetch a user's specific overrides.
     */
    async getUserOverrides(userId: string): Promise<UserFeatureOverride[]> {
        // Using 'user_ai_settings' which is the actual table name in the local schema
        const { data, error } = await supabase
            .from('user_ai_settings' as any)
            .select('feature_key, is_enabled')
            .eq('user_id', userId);

        if (error) throw error;

        return (data || []).map((o: any) => ({
            feature_key: o.feature_key,
            is_enabled: o.is_enabled
        }));
    },

    /**
     * Calculate effective state for all features for a user.
     * This logic mimics useSubscription.ts to ensure Admin sees exactly what User gets.
     */
    async getUserEffectiveFeatures(userId: string, userPlanFeatures: string[] = []): Promise<EffectiveFeatureState[]> {
        const [allFeatures, overrides] = await Promise.all([
            this.getAllFeatures(),
            this.getUserOverrides(userId)
        ]);

        return allFeatures.map(feat => {
            const override = overrides.find(o => o.feature_key === feat.feature_key);
            const overrideVal = override ? override.is_enabled : null;

            // 1. Global Kill Switch
            if (!feat.is_enabled) {
                return {
                    feature: feat,
                    isInherited: true, // It is inherited from global config
                    isEnabled: false,
                    overrideValue: overrideVal,
                    source: 'global_off'
                };
            }

            // 2. User Specific Override
            if (overrideVal !== null) {
                return {
                    feature: feat,
                    isInherited: false,
                    isEnabled: overrideVal,
                    overrideValue: overrideVal,
                    source: overrideVal ? 'override_on' : 'override_off'
                };
            }

            // 3. Plan feature
            // Logic from useSubscription: checks if key is in plan.features array
            // We handle the "grouped keys" logic (e.g. ai_assistant implying others) in the UI or simple list checking.
            // To be robust: If the DB features list is granular, we assume plan features are also granular OR we map them.
            // For this generic service, we check direct membership.
            // FUTURE-PROOFING: The plan might contain 'all_ai' which enables multiple keys. 
            // For now, we stick to direct inclusion for simplicity, unless we duplicate the complex mapping from useSubscription.

            const isInPlan = userPlanFeatures.includes(feat.feature_key);

            return {
                feature: feat,
                isInherited: true,
                isEnabled: isInPlan,
                overrideValue: null,
                source: 'plan'
            };
        });
    },

    /**
     * Set a specific feature override for a user.
     * value: true (Force ON), false (Force OFF), or null (Reset to Default/Plan)
     */
    async toggleUserFeature(userId: string, featureKey: string, value: boolean | null) {
        if (value === null) {
            // Remove override
            const { error } = await supabase
                .from('user_ai_feature_settings' as any)
                .delete()
                .eq('user_id', userId)
                .eq('feature_key', featureKey);
            if (error) throw error;
        } else {
            // Upsert override
            const { error } = await supabase
                .from('user_ai_feature_settings' as any)
                .upsert({
                    user_id: userId,
                    feature_key: featureKey,
                    is_enabled: value,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id, feature_key' }); // Assuming composite uniqueness
            if (error) throw error;
        }
    }
};
