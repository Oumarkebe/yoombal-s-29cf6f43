import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { translateFeature, FEATURE_CATEGORIES } from '@/lib/subscription-features';
import {
    Store,
    BarChart3,
    Truck,
    Sparkles,
    MessageCircle,
    Megaphone,
    Map
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
    'route_optimization': Map
};

const FEATURE_LINKS: Record<string, string> = {
    'custom_store': '/merchant?tab=store',
    'sales_analytics': '/merchant?tab=stats',
    'delivery_dashboard': '/delivery',
    'ai_product_descriptions': '/merchant?tab=ai',
    'ai_pricing': '/merchant?tab=ai',
    'ai_assistant': '#chat-trigger',
    'predictions': '/merchant?tab=ai',
    'customer_notifications': '/merchant?tab=settings',
    'priority_support': '/contact',
    'route_optimization': '/delivery'
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

        if (filterRole && FEATURE_CATEGORIES[filterRole]) {
            return FEATURE_CATEGORIES[filterRole].includes(f);
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
                                className="h-auto py-4 justify-start bg-white hover:bg-amber-100 hover:text-amber-900 border-amber-200"
                                onClick={() => link && navigate(link)}
                            >
                                <Icon className="h-5 w-5 mr-3 text-amber-600 shrink-0" />
                                <div className="text-left">
                                    <div className="font-semibold text-sm">
                                        {translateFeature(featureKey)}
                                    </div>
                                    <div className="text-xs text-slate-500 font-normal">
                                        Accéder au module
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
