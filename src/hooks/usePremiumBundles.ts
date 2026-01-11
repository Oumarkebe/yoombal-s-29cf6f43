
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PremiumBundle {
    id: string;
    name: string;
    description: string;
    discount_percentage: number;
    price_monthly: number;
    price_yearly: number;
    is_active: boolean;
    trial_days: number;
    badge_text: string;
    features: Array<{
        feature_key: string;
        name: string;
    }>;
}

export function usePremiumBundles() {
    const { data: bundles = [], isLoading, error } = useQuery({
        queryKey: ['premiumBundles'],
        queryFn: async () => {
            const { data, error } = await (supabase
                .from('premium_bundles' as any)
                .select(`
          *,
          features:bundle_features(
            feature:premium_features(feature_key, name)
          )
        `)
                .eq('is_active', true) as any);

            if (error) throw error;

            // Transform nested structure for easier use
            return data.map((bundle: any) => ({
                ...bundle,
                features: bundle.features.map((f: any) => f.feature)
            })) as PremiumBundle[];
        },
    });

    return {
        bundles,
        isLoading,
        error,
    };
}
