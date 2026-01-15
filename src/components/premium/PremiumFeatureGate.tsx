
import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2 } from 'lucide-react';
import { UpgradePrompt } from './UpgradePrompt';

interface PremiumFeatureGateProps {
    featureKey: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    showLoading?: boolean;
}

export function PremiumFeatureGate({
    featureKey,
    children,
    fallback,
    showLoading = true
}: PremiumFeatureGateProps) {
    const { hasFeature, isLoading } = useSubscription();

    if (isLoading && showLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    const hasAccess = hasFeature(featureKey);

    if (!hasAccess) {
        return fallback || <UpgradePrompt featureKey={featureKey} />;
    }

    return <>{children}</>;
}
