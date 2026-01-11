
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserSubscription {
    id: string;
    user_id: string;
    feature_id: string;
    status: 'active' | 'trial' | 'expired' | 'cancelled' | 'pending_payment';
    subscribed_at: string;
    activated_at: string | null;
    expires_at: string | null;
    trial_ends_at: string | null;
    is_trial: boolean;
    payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
    billing_period: 'monthly' | 'yearly';
    next_billing_date: string | null;
    created_at: string;
    feature?: {
        feature_key: string;
        name: string;
        description: string;
    };
}

export function useUserPremiumSubscriptions() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch all premium features once to have their global settings (like is_free)
    const { data: allFeatures = [] } = useQuery({
        queryKey: ['premiumFeaturesGlobal'],
        queryFn: async () => {
            const { data, error } = await (supabase
                .from('premium_features' as any)
                .select('*') as any);
            if (error) throw error;
            return data as any[];
        }
    });

    // Fetch all subscriptions for the current user
    const { data: subscriptions = [], isLoading, error } = useQuery({
        queryKey: ['userSubscriptions', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await (supabase
                .from('user_premium_subscriptions' as any)
                .select(`
          *,
          feature:premium_features(feature_key, name, description, is_free)
        `)
                .eq('user_id', user.id) as any);

            if (error) throw error;
            return data as UserSubscription[];
        },
        enabled: !!user,
    });

    // Simplified access check
    const checkAccess = (featureKey: string): boolean => {
        // 1. Check if feature is marked as free globally in premium_features table
        const globalFeature = allFeatures.find(f => f.feature_key === featureKey);
        if (globalFeature?.is_free) return true;

        if (!user) return false;

        // 2. Check if user has an active/trial subscription for this feature
        return subscriptions.some(sub =>
            sub.feature?.feature_key === featureKey &&
            (sub.status === 'active' || sub.status === 'trial') &&
            sub.payment_status === 'paid' &&
            (!sub.expires_at || new Date(sub.expires_at) > new Date())
        );
    };

    // Mutation to subscribe to a feature
    const subscribeMutation = useMutation({
        mutationFn: async ({
            featureId,
            billingPeriod = 'monthly',
            isTrial = false
        }: {
            featureId: string,
            billingPeriod?: 'monthly' | 'yearly',
            isTrial?: boolean
        }) => {
            if (!user) throw new Error('Veuillez vous connecter.');

            const { data, error } = await (supabase
                .from('user_premium_subscriptions' as any)
                .upsert({
                    user_id: user.id,
                    feature_id: featureId,
                    billing_period: billingPeriod,
                    is_trial: isTrial,
                    status: isTrial ? 'trial' : 'pending_payment',
                    payment_status: isTrial ? 'paid' : 'pending',
                    activated_at: isTrial ? new Date().toISOString() : null,
                })
                .select()
                .single() as any);

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userSubscriptions', user?.id] });
            toast.success('Demande de souscription enregistrée.');
        },
        onError: (error: Error) => {
            toast.error(`Erreur: ${error.message}`);
        }
    });

    return {
        subscriptions,
        isLoading,
        error,
        checkAccess,
        subscribe: subscribeMutation.mutate,
        isSubscribing: subscribeMutation.isPending,
    };
}
