
import React, { useState } from 'react';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import { usePremiumBundles } from '@/hooks/usePremiumBundles';
import { useUserPremiumSubscriptions } from '@/hooks/useUserPremiumSubscriptions';
import { useUserCredits } from '@/hooks/useUserCredits';
import { SubscriptionCard } from '@/components/premium/SubscriptionCard';
import { CreditBalance } from '@/components/premium/CreditBalance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Sparkles, Globe, Package } from 'lucide-react';

export default function SubscriptionShop() {
    const { featuresByCategory, isLoading: isLoadingFeatures } = usePremiumFeatures();
    const { bundles, isLoading: isLoadingBundles } = usePremiumBundles();
    const { subscribe, isSubscribing, checkAccess } = useUserPremiumSubscriptions();
    const { balance } = useUserCredits();
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    const handleSubscribe = (featureId: string, price: number) => {
        if (balance < price) {
            // Logic for insufficient credits (redirect to recharge)
            window.location.href = '/premium/credits';
            return;
        }
        subscribe({ featureId, billingPeriod });
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Yoombal Premium</h1>
                    <p className="text-muted-foreground">Boostez votre business avec nos outils intelligents.</p>
                </div>
                <CreditBalance />
            </div>

            <div className="flex justify-center mb-8">
                <div className="bg-muted p-1 rounded-lg flex items-center">
                    <button
                        className={`px-4 py-2 rounded-md text-sm transition-all ${billingPeriod === 'monthly' ? 'bg-background shadow-sm' : ''}`}
                        onClick={() => setBillingPeriod('monthly')}
                    >
                        Mensuel
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${billingPeriod === 'yearly' ? 'bg-background shadow-sm' : ''}`}
                        onClick={() => setBillingPeriod('yearly')}
                    >
                        Annuel
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">-20%</Badge>
                    </button>
                </div>
            </div>

            <Tabs defaultValue="bundles" className="space-y-8">
                <div className="flex justify-center">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="bundles">Packs (Offres)</TabsTrigger>
                        <TabsTrigger value="modules">Modules Individuels</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="bundles" className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        {bundles.map(bundle => (
                            <SubscriptionCard
                                key={bundle.id}
                                name={bundle.name}
                                description={bundle.description}
                                price={billingPeriod === 'monthly' ? bundle.price_monthly : bundle.price_yearly || (bundle.price_monthly * 10)}
                                period={billingPeriod}
                                features={bundle.features.map(f => f.name)}
                                badge={bundle.badge_text}
                                isPopular={bundle.badge_text === 'Populaire'}
                                onSubscribe={() => handleSubscribe(bundle.id, bundle.price_monthly)} // Simplification: assume bundle is in premium_features table too or handle differently
                                isLoading={isSubscribing}
                            />
                        ))}

                        {/* Fallback if no bundles are created yet */}
                        {bundles.length === 0 && (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                Aucun pack disponible pour le moment.
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="modules" className="space-y-12">
                    {Object.entries(featuresByCategory).map(([category, features]) => (
                        <div key={category} className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                                {category === 'africa' && <Globe className="h-5 w-5 text-blue-500" />}
                                {category === 'analytics' && <Zap className="h-5 w-5 text-amber-500" />}
                                {category === 'support' && <Sparkles className="h-5 w-5 text-purple-500" />}
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </h2>
                            <div className="grid gap-6 md:grid-cols-4">
                                {features.map(feature => {
                                    const hasAccess = checkAccess(feature.feature_key);
                                    return (
                                        <SubscriptionCard
                                            key={feature.id}
                                            name={feature.name}
                                            description={feature.description}
                                            price={billingPeriod === 'monthly' ? feature.price_monthly : feature.price_monthly * 10}
                                            period={billingPeriod}
                                            features={[feature.description]}
                                            buttonText={hasAccess ? "Déjà Actif" : "S'abonner"}
                                            onSubscribe={() => !hasAccess && handleSubscribe(feature.id, feature.price_monthly)}
                                            isLoading={isSubscribing}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
