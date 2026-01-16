import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription, PremiumPlan } from '@/hooks/useSubscription';
import { PlanCard } from '@/components/subscription/PlanCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { PaymentDialog } from '@/components/PaymentDialog';
import { supabase } from '@/integrations/supabase/client';

export default function Subscriptions() {
    const navigate = useNavigate();
    const { plans, subscription, subscribe, isSubscribing, changePlan, isChanging, renew, isRenewing } = useSubscription();
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PremiumPlan | null>(null);
    const [actionType, setActionType] = useState<'subscribe' | 'renew' | 'change' | 'module_purchase'>('subscribe');

    const handleSubscribe = async (plan: PremiumPlan & { isExpiringSoon?: boolean }) => {
        // Case 1: Renewal (Same plan + Expiring soon)
        if (subscription?.plan_id === plan.id && plan.isExpiringSoon) {
            setSelectedPlan(plan);
            setActionType('renew');
            setPaymentOpen(true);
            return;
        }

        // Case 2: Change Plan (Different plan)
        if (subscription && subscription.plan_id !== plan.id) {
            const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;

            // If switching to free plan -> Confirm and switch directly
            if (price === 0) {
                if (window.confirm(`Confirmez-vous le passage au plan ${plan.name} ?`)) {
                    changePlan({ newPlanId: plan.id, applyProrata: true });
                }
                return;
            }

            // If switching to paid plan -> Payment first
            setSelectedPlan(plan);
            setActionType('change');
            setPaymentOpen(true);
            return;
        }

        // Case 3: Already active (Not expiring)
        if (subscription && subscription.plan_id === plan.id) {
            toast.info("Votre abonnement est déjà actif");
            return;
        }

        // Case 4: New Subscription (No active sub)
        const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;

        if (price === 0) {
            subscribe({
                planId: plan.id,
                billingPeriod,
                paymentMethod: 'wallet',
                amount: 0,
                status: 'active'
            });
            return;
        }

        // Open payment dialog for paid plans
        setSelectedPlan(plan);
        setActionType('subscribe');
        setPaymentOpen(true);
    };

    const handlePaymentSuccess = (method: 'orange_money' | 'wave', phoneNumber: string) => {
        if (!selectedPlan) return;

        const price = billingPeriod === 'monthly' ? selectedPlan.price_monthly : selectedPlan.price_yearly;
        const paymentMethodEnum = method === 'orange_money' ? 'mobile_money' : 'wallet';

        if (actionType === 'renew') {
            renew(price);
        } else if (actionType === 'change') {
            changePlan({
                newPlanId: selectedPlan.id,
                applyProrata: true,
                paymentMethod: paymentMethodEnum,
                amount: price
            });
        } else {
            subscribe({
                planId: selectedPlan.id,
                billingPeriod,
                paymentMethod: paymentMethodEnum,
                amount: price,
                status: 'active'
            });
        }

        setPaymentOpen(false);
        setSelectedPlan(null);
    };

    const isLoading = isSubscribing || isChanging || isRenewing;
    const { globalFeatures, resolvedFeatures } = useSubscription();

    // Filter features that are premium, enabled by admin, and NOT already in user's active features
    // We only show modules that are not part of the current plan to stay clear.
    // List all premium modules available for purchase
    const individualModules = globalFeatures?.filter(f =>
        f.is_premium &&
        f.is_enabled &&
        f.price_monthly > 0
    ) || [];

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au profil
                    </Button>

                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Choisissez le plan adapté à vos besoins
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Débloquez tout le potentiel de Yoombal avec nos offres premium.
                            Passez à la vitesse supérieure dès aujourd'hui.
                        </p>

                        <Tabs
                            defaultValue="monthly"
                            className="w-[400px] mx-auto mb-10"
                            onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'yearly')}
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                                <TabsTrigger value="yearly">Annuel (-20%)</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            billingPeriod={billingPeriod}
                            currentPlanId={subscription?.plan_id}
                            onSubscribe={handleSubscribe}
                            isLoading={isLoading}
                        />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Paiement 100% sécurisé via Wave, Orange Money ou Carte Bancaire</span>
                    </div>
                </div>

                {/* Section Modules à la carte - DYNAMIC */}
                {individualModules.length > 0 && (
                    <div className="mt-16 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Modules IA & Boosters à la carte</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {individualModules.map((feature) => (
                                <div key={feature.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <ShieldCheck className="w-12 h-12 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{feature.description}</p>
                                    <div className="text-2xl font-bold text-primary mb-4">
                                        {feature.price_monthly.toLocaleString()} FCFA
                                        <span className="text-sm text-gray-500 font-normal"> / mois</span>
                                    </div>
                                    <ul className="text-sm space-y-2 mb-6">
                                        <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /> Activation immédiate</li>
                                        {feature.trial_days > 0 && (
                                            <li className="flex gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> {feature.trial_days} jours d'essai</li>
                                        )}
                                        <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /> Annulable à tout moment</li>
                                    </ul>
                                    <Button
                                        className="w-full"
                                        variant={resolvedFeatures.includes(feature.feature_key) ? "outline" : "default"}
                                        disabled={resolvedFeatures.includes(feature.feature_key)}
                                        onClick={() => {
                                            setSelectedPlan({
                                                id: feature.id,
                                                name: feature.name,
                                                price_monthly: feature.price_monthly,
                                                price_yearly: feature.price_monthly * 10, // Yearly approx
                                                slug: `module_${feature.feature_key}`,
                                                features: [feature.feature_key],
                                                limits: {}
                                            } as any);
                                            setActionType('module_purchase');
                                            setPaymentOpen(true);
                                        }}
                                    >
                                        {resolvedFeatures.includes(feature.feature_key) ? (
                                            <>
                                                <ShieldCheck className="w-4 h-4 mr-2" /> Module Actif
                                            </>
                                        ) : (
                                            'Activer le module'
                                        )}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedPlan && (
                    <PaymentDialog
                        isOpen={paymentOpen}
                        onClose={() => setPaymentOpen(false)}
                        amount={billingPeriod === 'monthly' ? selectedPlan.price_monthly : selectedPlan.price_yearly}
                        description={actionType === 'module_purchase' ? `Module: ${selectedPlan.name}` : `Abonnement ${selectedPlan.name} (${billingPeriod === 'monthly' ? 'Mensuel' : 'Annuel'})`}
                        type="subscription_purchase"
                        metadata={{
                            planId: selectedPlan.id,
                            planName: selectedPlan.name,
                            isModule: actionType === 'module_purchase',
                            featureKey: selectedPlan.features?.[0] || ''
                        }}
                        onSuccess={async (method, phoneNumber) => {
                            // Custom Module Logic
                            if (actionType === 'module_purchase') {
                                try {
                                    const { error } = await (supabase as any)
                                        .from('user_premium_subscriptions')
                                        .insert({
                                            user_id: (await supabase.auth.getUser()).data.user?.id,
                                            feature_id: selectedPlan.id,
                                            status: 'active',
                                            billing_period: 'monthly'
                                        });
                                    if (error) throw error;
                                    toast.success("Module activé avec succès !");
                                    window.location.reload();
                                } catch (e) {
                                    console.error("Error activating module", e);
                                    toast.error("Erreur lors de l'activation du module");
                                }
                                setPaymentOpen(false);
                                return;
                            }
                            handlePaymentSuccess(method, phoneNumber);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
