import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { translateFeature } from '@/lib/subscription-features';
import type { PremiumPlan } from '@/hooks/useSubscription';

interface PlanCardProps {
  plan: PremiumPlan & { isExpiringSoon?: boolean };
  billingPeriod: 'monthly' | 'yearly';
  currentPlanId?: string;
  onSubscribe: (plan: PremiumPlan) => void;
  isLoading?: boolean;
}

export function PlanCard({
  plan,
  billingPeriod,
  currentPlanId,
  onSubscribe,
  isLoading,
}: PlanCardProps) {
  const isCurrent = plan.id === currentPlanId;
  const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;
  const isFree = price === 0;

  return (
    <Card
      className={cn(
        'relative flex flex-col h-full transition-all duration-200 hover:shadow-lg border-2',
        isCurrent ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-200',
        plan.slug === 'enterprise' && 'bg-slate-50'
      )}
    >
      {plan.badge_text && (
        <Badge
          className="absolute -top-3 right-4 px-3 py-1"
          style={{ backgroundColor: plan.badge_color || '#3b82f6' }}
        >
          {plan.badge_text}
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-4xl font-bold">
            {isFree
              ? 'Gratuit'
              : new Intl.NumberFormat('fr-SN', {
                  style: 'currency',
                  currency: 'XOF',
                  maximumFractionDigits: 0,
                }).format(price || 0)}
          </span>
          {!isFree && (
            <span className="text-gray-500 ml-2">
              / {billingPeriod === 'monthly' ? 'mois' : 'an'}
            </span>
          )}
          {billingPeriod === 'yearly' && !isFree && (
            <p className="text-sm text-green-600 font-medium mt-1">Économisez 20% avec l'annuel</p>
          )}
        </div>

        <div className="space-y-3">
          {plan.features?.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 shrink-0" />
              <span className="text-sm text-gray-600">{translateFeature(feature)}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrent ? 'outline' : plan.slug === 'enterprise' ? 'default' : 'default'}
          onClick={() => onSubscribe(plan)}
          disabled={isLoading || (isCurrent && !plan.isExpiringSoon)}
        >
          {isCurrent
            ? plan.isExpiringSoon
              ? 'Renouveler'
              : 'Plan Actif'
            : isFree
              ? 'Commencer'
              : 'Choisir ce plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}
