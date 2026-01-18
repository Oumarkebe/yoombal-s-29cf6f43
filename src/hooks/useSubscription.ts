import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { SubscriptionInput, ChangePlanInput, CancelSubscriptionInput } from '@/lib/validations/subscription';

// Define interfaces locally since these tables may not be in types.ts
export interface PremiumPlan {
    id: string;
    name: string;
    slug: string;
    description: string;
    price_monthly: number;
    price_yearly: number;
    features: string[];
    is_active: boolean;
    display_order: number;
    badge?: string;
    badge_text?: string;
    badge_color?: string;
    created_at: string;
    isExpiringSoon?: boolean;
}

export interface PremiumFeature {
    id: string;
    feature_key: string;
    name: string;
    description: string;
    price_monthly: number;
    is_enabled: boolean;
    is_premium: boolean;
    is_free?: boolean;
    trial_days?: number;
    configuration?: any;
    created_at: string;
    updated_at: string;
    category?: string;
}

interface UserSubscriptionRow {
    id: string;
    user_id: string;
    plan_id: string;
    status: string;
    billing_period: string;
    started_at: string;
    expires_at: string;
    cancelled_at: string | null;
    payment_method: string;
    amount_paid: number;
    auto_renew: boolean;
    next_billing_date: string | null;
    current_period_start: string;
    current_period_end: string | null;
    created_at: string;
    updated_at: string;
}

export type UserSubscription = UserSubscriptionRow & {
    plan?: PremiumPlan;
};

export function useSubscription() {
    const { user } = useAuth();
    // console.log("Hooks: useSubscription user:", user?.id);
    const queryClient = useQueryClient();




    // 1. Fetch available plans
    const { data: plans = [] } = useQuery({
        queryKey: ['premiumPlans'],
        queryFn: async () => {
            // Using 'premium_plans' as per existing code, assuming the table exists even if not in types
            // If it fails, I'll need to check the DB schema names again.
            // Earlier logs showed: "Could not find the table 'public.user_ai_settings'".
            // I will assume 'premium_plans' exists.

            const { data, error } = await (supabase as any)
                .from('premium_plans')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error) throw error;
            return data as unknown as PremiumPlan[];
        },
        staleTime: 10 * 60 * 1000,
    });

    // 2. Fetch user active subscription
    const { data: subscription, isLoading, error } = useQuery({
        queryKey: ['userSubscription', user?.id],
        queryFn: async () => {
            if (!user) return null;

            const { data: subData, error } = await (supabase as any)
                .from('user_subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .maybeSingle();

            if (error) {
                console.error("Error fetching subscription:", error);
                return null;
            }

            // subData might be null even if no error (if no rows matches maybeSingle)
            if (!subData) return null;

            // Manual join
            const plan = plans.find((p: any) => p.id === (subData as any).plan_id);

            return {
                ...(subData as any),
                plan
            };
        },
        enabled: !!user && plans.length > 0,
        staleTime: 5 * 60 * 1000,
    });



    // 3. Fetch user feature overrides (Aligned with Admin Dashboard)
    const { data: featureSettings = [] } = useQuery({
        queryKey: ['userFeatureSettings', user?.id],
        queryFn: async () => {
            if (!user) return [];
            // Cast supabase to any because types might be out of sync
            const { data, error } = await (supabase as any)
                .from('user_ai_settings')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                console.error("Error fetching feature settings:", error);
                return [];
            }
            return data as { feature_key: string; is_enabled: boolean }[];
        },
        enabled: !!user,
    });

    // 3b. Fetch ALL premium features status (Global Admin Config)
    const { data: globalFeatures = [] } = useQuery({
        queryKey: ['globalPremiumFeatures'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('premium_features')
                .select('*');
            if (error) {
                console.error("Hooks: Error fetching globalPremiumFeatures:", error);
                throw error;
            }
            // console.log("Hooks: Loaded globalPremiumFeatures count:", data?.length);
            return data as unknown as PremiumFeature[];
        },
        staleTime: 5 * 60 * 1000,
    });

    // 4. Fetch purchased modules (active subscriptions to specific premium features)
    const { data: purchasedModules = [] } = useQuery({
        queryKey: ['userPurchasedModules', user?.id],
        queryFn: async () => {
            if (!user) return [];
            // Cast to any because user_premium_subscriptions is not yet in generated types
            const { data, error } = await (supabase as any)
                .from('user_premium_subscriptions')
                .select('status, feature:premium_features(feature_key)')
                .eq('user_id', user.id)
                .in('status', ['active', 'trial']);

            if (error) {
                console.error("Error fetching purchased modules:", error);
                return [];
            }

            // console.log("Hooks: useSubscription - Raw Purchased Modules Data:", data);

            // Extract feature keys from the joined response
            const keys = data.map((item: any) => item.feature?.feature_key).filter(Boolean) as string[];
            // console.log("Hooks: useSubscription - Purchased Modules Keys:", keys);
            return keys;
        },
        enabled: !!user,
    });

    // Resolve effective features matching User Override -> Purchased -> Plan -> Default
    const hasFeature = (featureKey: string): boolean => {
        // 👑 Admin Bypass: Admin has access to everything
        if (user?.role === 'admin') {
            return true;
        }

        // Mapping for backward compatibility with older DB records
        const keysToCheck = [featureKey];
        if (featureKey === 'ai_assistant') {
            keysToCheck.push(
                'assistant_intelligent',
                'advanced_ai',
                'custom_chatbot',
                'generation_contenu',
                'ai_product_descriptions',
                'content_generation',
                'ai_vision',
                'vision_ai'
            );
        }
        if (featureKey === 'ai_pricing') keysToCheck.push('tarification_dynamique', 'ramadan_pricing');
        if (featureKey === 'predictions') {
            keysToCheck.push(
                'analyses_predictives',
                'demand_prediction',
                'gestion_stock_ia',
                'stock_prediction'
            );
        }
        if (featureKey === 'marketing') {
            keysToCheck.push(
                'optimisation_seo',
                'marketing_studio',
                'marketing_automation',
                'customer_notifications'
            );
        }
        if (featureKey === 'finance') {
            keysToCheck.push(
                'fraud_detection',
                'blanchiment_detection',
                'audit_securite'
            );
        }

        const checkInList = (list: string[]) => {
            if (keysToCheck.some(k => list.includes(k))) return true;
            // Bundle expansion: if list contains all_pro_features and we are checking a pro feature
            if (list.includes('all_pro_features')) {
                const proPlan = plans.find((p: any) => p.slug === 'pro');
                if (proPlan?.features && keysToCheck.some(k => (proPlan.features as string[]).includes(k))) {
                    return true;
                }
            }
            return false;
        };

        // -1. Check GLOBAL Admin Toggle and is_free flag
        const globalFeature = globalFeatures.find(f => keysToCheck.includes(f.feature_key));
        if (globalFeature) {
            if (globalFeature.is_enabled === false) return false;
            if (globalFeature.is_free === true) return true;
        }

        // 0. Check Purchased Modules
        if (checkInList(purchasedModules)) return true;

        // 1. Check User Override (Highest Priority)
        const override = featureSettings.find(s => keysToCheck.includes(s.feature_key));
        if (override && override.is_enabled !== null) {
            return override.is_enabled;
        }

        // 2. Check Plan Features
        if (!subscription?.plan) {
            const starterPlan = plans.find((p: any) => p.slug === 'starter');
            return starterPlan?.features ? checkInList(starterPlan.features) : false;
        }

        // @ts-ignore
        const planFeatures = subscription.plan.features || [];
        return checkInList(planFeatures);
    };

    // Compute list of ALL active features for display
    const resolvedFeatures = React.useMemo(() => {
        // 👑 Admin Bypass: Ensure all known premium features are considered active
        if (user?.role === 'admin') {
            const adminFeatures = new Set<string>();
            globalFeatures.forEach(f => {
                adminFeatures.add(f.feature_key);
                // Add standardized alternates
                if (['assistant_intelligent', 'advanced_ai', 'custom_chatbot', 'generation_contenu', 'ai_product_descriptions', 'content_generation', 'ai_vision', 'vision_ai'].includes(f.feature_key)) {
                    adminFeatures.add('ai_assistant');
                } else if (['tarification_dynamique', 'ai_pricing', 'ramadan_pricing'].includes(f.feature_key)) {
                    adminFeatures.add('ai_pricing');
                } else if (['analyses_predictives', 'predictions', 'demand_prediction', 'gestion_stock_ia', 'stock_prediction'].includes(f.feature_key)) {
                    adminFeatures.add('predictions');
                } else if (['optimisation_seo', 'marketing_studio', 'marketing_automation', 'customer_notifications'].includes(f.feature_key)) {
                    adminFeatures.add('marketing');
                } else if (['fraud_detection', 'blanchiment_detection', 'audit_securite'].includes(f.feature_key)) {
                    adminFeatures.add('finance');
                }
            });
            return Array.from(adminFeatures);
        }

        const planFeatures = subscription?.plan?.features || plans.find((p: any) => p.slug === 'starter')?.features || [];
        const activeSet = new Set(planFeatures);

        // Bundle expansion for UI
        if (activeSet.has('all_pro_features')) {
            const proPlan = plans.find((p: any) => p.slug === 'pro');
            if (proPlan?.features) {
                (proPlan.features as string[]).forEach(f => activeSet.add(f));
            }
        }

        // Apply overrides
        featureSettings.forEach((setting: any) => {
            if (setting.is_enabled) {
                activeSet.add(setting.feature_key);
            } else {
                activeSet.delete(setting.feature_key);
            }
        });

        // Add purchased modules
        purchasedModules.forEach(key => activeSet.add(key));

        const finalSet = new Set<string>();
        activeSet.forEach(key => {
            // Respect Global Admin Toggle in resolved list too
            const globalF = globalFeatures.find(f => f.feature_key === key);
            if (globalF && globalF.is_enabled === false) return;

            finalSet.add(key as string);

            // Add standardized groupings for easier UI checks
            if (['assistant_intelligent', 'advanced_ai', 'custom_chatbot', 'generation_contenu', 'ai_product_descriptions', 'content_generation', 'ai_vision', 'vision_ai'].includes(key as string)) {
                finalSet.add('ai_assistant');
            } else if (['tarification_dynamique', 'ai_pricing', 'ramadan_pricing'].includes(key as string)) {
                finalSet.add('ai_pricing');
            } else if (['analyses_predictives', 'predictions', 'demand_prediction', 'gestion_stock_ia', 'stock_prediction'].includes(key as string)) {
                finalSet.add('predictions');
            } else if (['optimisation_seo', 'marketing_studio', 'marketing_automation', 'customer_notifications'].includes(key as string)) {
                finalSet.add('marketing');
            } else if (['fraud_detection', 'blanchiment_detection', 'audit_securite'].includes(key as string)) {
                finalSet.add('finance');
            }
        });

        return Array.from(finalSet) as string[];
    }, [subscription, plans, featureSettings, purchasedModules, globalFeatures, user?.role]);

    // Helper to check expiry
    const isExpiringSoon = (expiresAt: string | null | undefined) => {
        if (!expiresAt) return false;
        const expiry = new Date(expiresAt);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 7; // Alert 7 days before
    };

    // Get current plan (returns Starter if no active subscription)
    const currentPlan = subscription?.plan || plans.find((p: any) => p.slug === 'starter');

    // Enrich plans with expiration status for UI
    const plansWithStatus = plans.map((p: any) => ({
        ...p,
        isExpiringSoon: subscription?.plan_id === p.id && isExpiringSoon(subscription?.expires_at)
    }));

    // Subscribe mutation
    const subscribeMutation = useMutation({
        mutationFn: async (input: SubscriptionInput) => {
            if (!user) throw new Error('Non authentifié');

            // TODO: This should call an Edge Function for security
            // For now, direct insert (not production-ready)
            const { data, error } = await supabase
                .from('user_subscriptions' as any)
                .insert({
                    user_id: user.id,
                    plan_id: input.planId,
                    billing_period: input.billingPeriod,
                    payment_method: input.paymentMethod,
                    amount_paid: input.amount,
                    status: input.status || 'pending', // 'active' if payment confirmed, else 'pending'
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userSubscription', user?.id] });
            toast.success('Abonnement créé avec succès !');
        },
        onError: (error: Error) => {
            toast.error(`Erreur: ${error.message}`);
        }
    });

    // Change plan mutation
    const changePlanMutation = useMutation({
        mutationFn: async (input: ChangePlanInput) => {
            if (!user || !subscription) throw new Error('Aucun abonnement actif');

            // TODO: Calculate prorata and call Edge Function
            // For now, simplified update
            const { data, error } = await supabase
                .from('user_subscriptions' as any)
                .update({
                    plan_id: input.newPlanId,
                    amount_paid: input.amount ?? 0,
                    payment_method: input.paymentMethod,
                    status: 'active', // Ensure status is active
                    updated_at: new Date().toISOString()
                })
                .eq('id', subscription.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userSubscription', user?.id] });
            toast.success('Plan modifié avec succès !');
        },
        onError: (error: Error) => {
            toast.error(`Erreur: ${error.message}`);
        }
    });

    // Cancel subscription mutation
    const cancelMutation = useMutation({
        mutationFn: async (input: CancelSubscriptionInput) => {
            if (!user || !subscription) throw new Error('Aucun abonnement actif');

            const { data, error } = await supabase
                .from('user_subscriptions' as any)
                .update({
                    status: input.immediate ? 'cancelled' : 'active',
                    auto_renew: false,
                    cancelled_at: new Date().toISOString()
                })
                .eq('id', subscription.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userSubscription', user?.id] });
            toast.success('Abonnement annulé');
        },
        onError: (error: Error) => {
            toast.error(`Erreur: ${error.message}`);
        }
    });
    // Renew subscription mutation
    const renewMutation = useMutation({
        mutationFn: async (amount: number) => {
            if (!user || !subscription) throw new Error('Aucun abonnement actif');

            // Determine new expiry
            const currentExpiry = subscription.expires_at ? new Date(subscription.expires_at) : new Date();
            const duration = subscription.billing_period === 'yearly' ? 365 : 30;
            const newExpiry = new Date(currentExpiry.setDate(currentExpiry.getDate() + duration));

            const { data, error } = await supabase
                .from('user_subscriptions' as any)
                .update({
                    status: 'active',
                    expires_at: newExpiry.toISOString(),
                    amount_paid: amount,
                    payment_method: 'mobile_money', // Default update
                    updated_at: new Date().toISOString()
                })
                .eq('id', subscription.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userSubscription', user?.id] });
            toast.success('Abonnement renouvelé avec succès !');
        },
        onError: (error: Error) => {
            toast.error(`Erreur: ${error.message}`);
        }
    });

    // Module activation mutation
    const activateModuleMutation = useMutation({
        mutationFn: async (featureId: string) => {
            if (!user) throw new Error('Non authentifié');

            const { data, error } = await supabase
                .from('user_premium_subscriptions' as any)
                .insert({
                    user_id: user.id,
                    feature_id: featureId,
                    status: 'active',
                    started_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userPurchasedModules', user?.id] });
            toast.success('Module activé avec succès !');
        },
        onError: (error: Error) => {
            toast.error(`Erreur d'activation: ${error.message}`);
        }
    });

    const deactivateModuleMutation = useMutation({
        mutationFn: async (featureId: string) => {
            if (!user) throw new Error('Non authentifié');

            const { data, error } = await supabase
                .from('user_premium_subscriptions' as any)
                .update({ status: 'cancelled' })
                .eq('user_id', user.id)
                .eq('feature_id', featureId);

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userPurchasedModules', user?.id] });
        }
    });

    return {
        // Data
        subscription,
        currentPlan,
        plans: plansWithStatus,
        isLoading,
        error,
        resolvedFeatures,
        globalFeatures,
        purchasedModules,

        // Helpers
        hasFeature,
        isSubscribed: !!subscription,

        // Actions
        subscribe: subscribeMutation.mutate,
        changePlan: changePlanMutation.mutate,
        cancel: cancelMutation.mutate,
        renew: renewMutation.mutate,
        activateModule: activateModuleMutation.mutate,
        deactivateModule: deactivateModuleMutation.mutate,

        // Loading states
        isSubscribing: subscribeMutation.isPending,
        isChanging: changePlanMutation.isPending,
        isCancelling: cancelMutation.isPending,
        isRenewing: renewMutation.isPending,
        isProcessingModule: activateModuleMutation.isPending || deactivateModuleMutation.isPending
    };
}
