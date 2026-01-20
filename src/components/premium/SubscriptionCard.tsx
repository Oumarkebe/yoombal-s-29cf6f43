import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface SubscriptionCardProps {
  name: string;
  description: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  badge?: string;
  onSubscribe: () => void;
  isLoading?: boolean;
  buttonText?: string;
}

export function SubscriptionCard({
  name,
  description,
  price,
  period,
  features,
  isPopular,
  badge,
  onSubscribe,
  isLoading,
  buttonText = 'Souscrire',
}: SubscriptionCardProps) {
  return (
    <Card
      className={`relative flex flex-col h-full ${isPopular ? 'border-primary shadow-lg scale-105' : ''}`}
    >
      {badge && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground">
          {badge}
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          {name}
          {isPopular && <Sparkles className="h-5 w-5 text-amber-500" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-4xl font-bold">{price.toLocaleString()}</span>
          <span className="text-muted-foreground ml-2">
            FCFA / {period === 'monthly' ? 'mois' : 'an'}
          </span>
        </div>

        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isPopular ? 'default' : 'outline'}
          onClick={onSubscribe}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
