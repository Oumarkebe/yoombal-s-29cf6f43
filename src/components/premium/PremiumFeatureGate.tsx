import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2, Lock, Sparkles } from 'lucide-react';
import { UpgradePrompt } from './UpgradePrompt';
import { cn } from '@/lib/utils';

interface PremiumFeatureGateProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoading?: boolean;
  className?: string;
}

export function PremiumFeatureGate({
  featureKey,
  children,
  fallback,
  showLoading = true,
  className,
}: PremiumFeatureGateProps) {
  const { hasFeature, isLoading } = useSubscription();

  if (isLoading && showLoading) {
    return (
      <div className={cn('relative overflow-hidden rounded-lg bg-muted/20 p-8', className)}>
        <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
          <div className="h-10 w-10 rounded-full bg-muted shadow-inner" />
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-24 rounded bg-muted/60" />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>
    );
  }

  const hasAccess = hasFeature(featureKey);

  if (!hasAccess) {
    return (
      fallback || (
        <div className={cn('group relative', className)}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
          <UpgradePrompt featureKey={featureKey} />
        </div>
      )
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div className="absolute -top-3 -right-3 z-10">
        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-[10px] font-bold text-white px-2 py-0.5 rounded-full shadow-lg border border-white/20 animate-bounce-subtle">
          <Sparkles className="h-2.5 w-2.5" />
          PREMIUM
        </div>
      </div>
      {children}
    </div>
  );
}
