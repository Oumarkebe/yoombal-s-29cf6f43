import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { translateFeature, FEATURE_CATEGORIES } from '@/lib/subscription-features';
import { toast } from 'sonner';
import {
    Store,
    BarChart3,
    Truck,
    Sparkles,
    MessageCircle,
    Megaphone,
    Map,
    ShieldCheck,
    Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURE_ICONS: Record<string, any> = {
    'custom_store': Store,
    'sales_analytics': BarChart3,
    'delivery_dashboard': Truck,
    'ai_product_descriptions': Sparkles,
    'ai_pricing': Sparkles,
    'ai_assistant': Sparkles,
    'predictions': BarChart3,
    'customer_notifications': MessageCircle,
    'priority_support': Megaphone,
    'route_optimization': Map,
    'fraud_detection': ShieldCheck,
    'audit_securite': ShieldCheck,
    'wolof_pulaar_nlp': MessageCircle,
    'gestion_stock_ia': Package,
    'optimisation_seo': Sparkles,
    'generation_contenu': Sparkles,
    'ramadan_pricing': Sparkles,
    'blanchiment_detection': ShieldCheck,
    'vision_ai': Sparkles
};

// Map features to categories for role-based display if not defined in subscription-features.ts
const FEATURE_MAP_ROLE: Record<string, 'merchant' | 'delivery' | 'user'> = {
    'custom_store': 'merchant',
    'sales_analytics': 'merchant',
    'delivery_dashboard': 'delivery',
    'ai_product_descriptions': 'merchant',
    'ai_pricing': 'merchant',
    'ai_assistant': 'user',
    'predictions': 'merchant',
    'customer_notifications': 'merchant',
    'priority_support': 'user',
    'route_optimization': 'delivery',
    'fraud_detection': 'merchant',
    'audit_securite': 'merchant',
    'wolof_pulaar_nlp': 'user',
    'gestion_stock_ia': 'merchant',
    'optimisation_seo': 'merchant',
    'generation_contenu': 'merchant',
    'ramadan_pricing': 'merchant',
    'blanchiment_detection': 'merchant',
    'vision_ai': 'merchant'
};

const FEATURE_LINKS: Record<string, string> = {
    'custom_store': '/merchant?tab=store',
    'sales_analytics': '/merchant?tab=stats',
    'delivery_dashboard': '/delivery',
    'ai_product_descriptions': '/merchant?tab=ai',
    'ai_pricing': '/merchant?tab=ai',
    'ai_assistant': 'trigger-ai', // Special string to handle in onClick
    'predictions': '/merchant?tab=ai',
    'customer_notifications': '/merchant?tab=settings',
    'priority_support': '/contact',
    'route_optimization': '/delivery',
    'fraud_detection': '/merchant?tab=ai',
    'audit_securite': '/merchant?tab=settings',
    'wolof_pulaar_nlp': 'trigger-ai',
    'gestion_stock_ia': '/merchant?tab=stock',
    'optimisation_seo': '/merchant?tab=ai',
    'generation_contenu': '/merchant?tab=ai',
    'ramadan_pricing': '/merchant?tab=ai',
    'blanchiment_detection': '/merchant?tab=ai',
    'vision_ai': '/merchant?tab=ai'
};

interface PremiumFeaturesDisplayProps {
    filterRole?: 'merchant' | 'delivery' | 'user';
}

export const PremiumFeaturesDisplay = ({ filterRole }: PremiumFeaturesDisplayProps) => {
    const { subscription, currentPlan, resolvedFeatures } = useSubscription();
    const navigate = useNavigate();

    if (!subscription || !currentPlan) return null;

    // Use resolvedFeatures for the display list
    const availableFeatures = resolvedFeatures || [];

    // Filter features that have icons/links defined (user actionable ones)
    // AND filter by role if provided
    const actionableFeatures = availableFeatures.filter(f => {
        const hasMeta = FEATURE_ICONS[f] || FEATURE_LINKS[f];
        if (!hasMeta) return false;

        // Strict role filtering based on dashboard context
        if (filterRole) {
            const featureRole = FEATURE_MAP_ROLE[f];
            // 'user' features are visible to everyone
            if (featureRole === 'user') return true;
            return featureRole === filterRole;
        }

        return true;
    });

    console.log("PremiumFeaturesDisplay: Available Features:", availableFeatures);
    console.log("PremiumFeaturesDisplay: Actionable Features:", actionableFeatures);

    if (actionableFeatures.length === 0) {
        console.log("PremiumFeaturesDisplay: No actionable features found, returning null.");
        return null;
    }

    return (
        <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                    <Sparkles className="h-5 w-5 text-amber-600" />
                    Vos Outils Premium ({currentPlan.name})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {actionableFeatures.map(featureKey => {
                        const Icon = FEATURE_ICONS[featureKey] || Sparkles;
                        const link = FEATURE_LINKS[featureKey];

                        return (
                            <Button
                                key={featureKey}
                                variant="outline"
                                className="h-auto py-4 justify-start bg-white hover:bg-amber-100 hover:text-amber-900 border-amber-200 shadow-sm"
                                onClick={() => {
                                    if (link === 'trigger-ai') {
                                        // Find and click the AI trigger button if it exists
                                        const aiBtn = document.querySelector('[class*="bottom-6 right-6"] button') as HTMLButtonElement;
                                        if (aiBtn) aiBtn.click();
                                        else toast.info("Assistant IA prêt à l'emploi");
                                    } else if (link) {
                                        navigate(link);
                                    }
                                }}
                            >
                                <Icon className="h-5 w-5 mr-3 text-amber-600 shrink-0" />
                                <div className="text-left">
                                    <div className="font-semibold text-sm">
                                        {translateFeature(featureKey)}
                                    </div>
                                    <div className="text-xs text-slate-500 font-normal">
                                        {link === 'trigger-ai' ? "Ouvrir l'assistant" : "Accéder au module"}
                                    </div>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
