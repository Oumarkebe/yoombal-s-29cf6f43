import React from 'react';
import { Badge } from "@/components/ui/badge";
import { PremiumPlan } from '@/hooks/useSubscription';

interface AnnualSavingsProps {
    plan: PremiumPlan;
}

export const AnnualSavings: React.FC<AnnualSavingsProps> = ({ plan }) => {
    const monthlyCost = plan.price_monthly * 12;
    const yearlyCost = plan.price_yearly;
    const savings = monthlyCost - yearlyCost;
    const percentage = Math.round((savings / monthlyCost) * 100);

    if (savings <= 0) return null;

    return (
        <div className="flex items-center gap-2 text-green-600 font-semibold animate-bounce-subtle">
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                -{percentage}%
            </Badge>
            <span className="text-xs">Économisez {savings.toLocaleString()} FCFA/an</span>
        </div>
    );
};
