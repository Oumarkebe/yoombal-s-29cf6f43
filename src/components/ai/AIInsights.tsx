
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    AlertTriangle,
    Zap,
    Sparkles,
    BrainCircuit,
    ArrowUpRight,
    Search,
    ShoppingBag,
    Loader2
} from "lucide-react";
import { useUserAiFeature } from '@/hooks/useUserAiFeature';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AIInsights() {
    const { isEnabled: isAnalyticsEnabled, isLoading } = useUserAiFeature('predictions');
    const [isGenerating, setIsGenerating] = useState(false);
    const [insights, setInsights] = useState({
        pricing: { suggested: "15,000 CFA", logic: "Forte demande détectée", gain: "+15,000 CFA/mois" },
        marketing: { slogan: "Yoombal : La qualité qui vous simplifie la vie, livrée directement chez vous." },
        prediction: { value: "+24%", confidence: "92%" }
    });
    const [config, setConfig] = useState<any>({ prediction_horizon_days: 7 });

    useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase
                .from('premium_features')
                .select('configuration')
                .eq('feature_key', 'predictions')
                .maybeSingle();

            if (data?.configuration) {
                setConfig(data.configuration);
            }
        };

        if (isAnalyticsEnabled) {
            fetchConfig();
        }
    }, [isAnalyticsEnabled]);

    const refreshInsights = async () => {
        setIsGenerating(true);
        try {
            // Simulate fetching merchant data or use real data if available
            const demoProduct = { name: "Sac VIP", current_price: 14000, category: "Maroquinerie" };

            const { data: pricingData, error: pricingError } = await supabase.functions.invoke('ai-pricing', {
                body: { productData: demoProduct }
            });

            if (pricingError) throw pricingError;

            setInsights(prev => ({
                ...prev,
                pricing: {
                    suggested: `${pricingData.suggested_price} CFA`,
                    logic: pricingData.logic,
                    gain: pricingData.margin_impact
                }
            }));

            toast.success("Analyses mises à jour avec l'IA !");
        } catch (error) {
            console.error('Error refreshing insights:', error);
            toast.error("Erreur lors de la mise à jour des analyses.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Chargement des insights IA...</div>;

    if (!isAnalyticsEnabled) {
        return (
            <Card className="border-dashed border-2 bg-slate-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-amber-100 p-4 rounded-full mb-4">
                        <BrainCircuit className="h-10 w-10 text-amber-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">Insights IA Premium</CardTitle>
                    <p className="text-gray-500 max-w-md mb-6">
                        Activez les analyses prédictives pour anticiper vos ventes, optimiser vos stocks et doubler votre efficacité.
                    </p>
                    <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                        En savoir plus sur l'offre Premium
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-amber-500" />
                        IA Insights Pro
                    </h2>
                    <p className="text-gray-500">Analyses prédictives en temps réel.</p>
                </div>
                <Button
                    onClick={refreshInsights}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg hover:shadow-amber-200/50 transition-all active:scale-95"
                >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                    Recalculer les prévisions
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sales Prediction Card */}
                <Card className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="h-16 w-16" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500">Prévision Ventes (${config.prediction_horizon_days}j)</CardTitle>
                        <div className="text-2xl font-bold flex items-baseline gap-2">
                            +24%
                            <span className="text-xs font-normal text-green-500 flex items-center">
                                <ArrowUpRight className="h-3 w-3" /> Confiance 92%
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            L'IA prévoit une hausse du volume de commandes sur vos produits "Électronique" le weekend prochain.
                        </p>
                    </CardContent>
                </Card>

                {/* Inventory Alert Card */}
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Alerte Stock Prédictive
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-2">
                            <span className="font-bold text-gray-800">Savon de Marseille (Lot 5)</span>
                            <div className="text-xs text-gray-500">Rupture estimée : sous 48h</div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full text-xs h-7">
                            Réapprovisionner maintenant
                        </Button>
                    </CardContent>
                </Card>

                {/* Dynamic Pricing Card */}
                <Card className="bg-slate-900 text-white border-none shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-400">Opportunité de Prix</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-1 text-amber-400">{insights.pricing.suggested}</div>
                        <p className="text-xs text-slate-300 mb-4">
                            {insights.pricing.logic}
                        </p>
                        <div className="mt-auto flex items-center gap-2 text-[10px] font-bold text-green-400 bg-green-400/10 p-2 rounded w-fit">
                            <Zap className="h-3 w-3" /> Gain estimé : {insights.pricing.gain}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Marketing Suggestion */}
            <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-indigo-600" />
                        Générateur de Campagne IA
                    </CardTitle>
                    <CardDescription>L'IA a créé un slogan pour votre prochaine promo :</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-6 bg-white border border-indigo-200 rounded-xl italic text-gray-700 relative group">
                        "{insights.marketing.slogan}"
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600"
                            onClick={() => {
                                navigator.clipboard.writeText(insights.marketing.slogan);
                                toast.success("Copié dans le presse-papier !");
                            }}
                        >
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
