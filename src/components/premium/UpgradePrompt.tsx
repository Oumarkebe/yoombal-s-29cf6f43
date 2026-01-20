import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  featureKey: string;
  title?: string;
  description?: string;
}

const FEATURE_NAMES: Record<string, string> = {
  ai_assistant: 'Assistant IA Yoombal',
  ai_pricing: 'Tarification Dynamique',
  predictions: 'Analyses Prédictives',
  // ... more can be added
};

export function UpgradePrompt({ featureKey, title, description }: UpgradePromptProps) {
  const navigate = useNavigate();
  const featureName = title || FEATURE_NAMES[featureKey] || 'Fonctionnalité Premium';

  return (
    <Card className="border-dashed border-2 bg-muted/30">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          {featureName}
          <Sparkles className="h-4 w-4 text-amber-500" />
        </CardTitle>
        <CardDescription>
          {description || 'Cette fonctionnalité est reservée aux membres Premium.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <p className="text-sm text-center text-muted-foreground max-w-xs">
          Boostez votre business avec l'IA et les outils avancés de Yoombal.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/premium/subscriptions')}>
            Voir les tarifs
          </Button>
          <Button onClick={() => navigate(`/premium/subscriptions?feature=${featureKey}`)}>
            Démarrer un essai gratuit
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
