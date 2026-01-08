import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

// Nouveaux imports sous-composants refactorisés
import { ProviderSelect } from './ProviderSelect';
import { ToneSelect } from './ToneSelect';
import { RecommendationStrategySelect } from './RecommendationStrategySelect';
import { ModerationSensitivitySelect } from './ModerationSensitivitySelect';
import { PricingStrategySelect } from './PricingStrategySelect';
import { PredictionTargetSelect } from './PredictionTargetSelect';
import { ScoringCriteriaSelect } from './ScoringCriteriaSelect';
import { LogisticsStrategySelect } from './LogisticsStrategySelect';

interface AIModuleCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    moduleKey: string;
    isEnabled: boolean;
    configuration: Json;
    onToggle: (key: string, enabled: boolean) => void;
    onConfigurationChange: (key: string, configUpdate: Record<string, string>) => void;
    isUpdating: boolean;
    onTest?: (key: string) => void;
}

export const AIModuleCard = ({
  title,
  description,
  icon: Icon,
  moduleKey,
  isEnabled,
  configuration,
  onToggle,
  onConfigurationChange,
  isUpdating,
  onTest
}: AIModuleCardProps) => {
    let provider = 'openai';
    if (configuration && typeof configuration === 'object' && !Array.isArray(configuration) && 'provider' in configuration) {
        const configProvider = (configuration as Record<string, unknown>).provider;
        if (typeof configProvider === 'string' && configProvider) {
            provider = configProvider;
        }
    }

    let tone = 'professionnel';
    if (configuration && typeof configuration === 'object' && !Array.isArray(configuration) && 'tone' in configuration) {
        const configTone = (configuration as Record<string, unknown>).tone;
        if (typeof configTone === 'string' && configTone) {
            tone = configTone;
        }
    }

    let strategy = 'popular_products';
    if (configuration && typeof configuration === 'object' && !Array.isArray(configuration) && 'strategy' in configuration) {
        const configStrategy = (configuration as Record<string, unknown>).strategy;
        if (typeof configStrategy === 'string' && configStrategy) {
            strategy = configStrategy;
        }
    }

    let sensitivity = 'moyen';
    if (configuration && typeof configuration === 'object' && !Array.isArray(configuration) && 'sensitivity' in configuration) {
        const configSensitivity = (configuration as Record<string, unknown>).sensitivity;
        if (typeof configSensitivity === 'string' && configSensitivity) {
            sensitivity = configSensitivity;
        }
    }

    let pricing_strategy = 'concurrentiel';
    if (configuration && typeof configuration === 'object' && !Array.isArray(configuration) && 'pricing_strategy' in configuration) {
        const configPricingStrategy = (configuration as Record<string, unknown>).pricing_strategy;
        if (typeof configPricingStrategy === 'string' && configPricingStrategy) {
            pricing_strategy = configPricingStrategy;
        }
    }

    let prediction_target = 'ventes_futures';
    if (configuration && typeof configuration === 'object' && !Array.isArray(configuration) && 'prediction_target' in configuration) {
        const configPredictionTarget = (configuration as Record<string, unknown>).prediction_target;
        if (typeof configPredictionTarget === 'string' && configPredictionTarget) {
            prediction_target = configPredictionTarget;
        }
    }

    let scoring_criteria = 'complet';
    if (configuration && typeof configuration === 'object' && !Array.isArray(configuration) && 'scoring_criteria' in configuration) {
        const configScoringCriteria = (configuration as Record<string, unknown>).scoring_criteria;
        if (typeof configScoringCriteria === 'string' && configScoringCriteria) {
            scoring_criteria = configScoringCriteria;
        }
    }

    let logistics_strategy = 'itineraire_rapide';
    if (configuration && typeof configuration === 'object' && !Array.isArray(configuration) && 'logistics_strategy' in configuration) {
        const configLogisticsStrategy = (configuration as Record<string, unknown>).logistics_strategy;
        if (typeof configLogisticsStrategy === 'string' && configLogisticsStrategy) {
            logistics_strategy = configLogisticsStrategy;
        }
    }

    const hasConfiguration = ['chatbot', 'translation', 'content_generation', 'recommendations', 'moderation', 'pricing', 'predictions', 'scoring', 'logistics'].includes(moduleKey);

    return (
        <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-100 rounded-full">
                        <div className="p-2 bg-amber-100 rounded-full">
                            <Icon className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <CardTitle>{title}</CardTitle>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {hasConfiguration && (
                    <div className="space-y-4">
                        {(moduleKey === 'chatbot' || moduleKey === 'translation' || moduleKey === 'content_generation') && (
                          <ProviderSelect
                              value={provider}
                              onChange={(value) => onConfigurationChange(moduleKey, { provider: value })}
                              disabled={isUpdating}
                              id={`provider-${moduleKey}`}
                          />
                        )}

                        {moduleKey === 'content_generation' && (
                          <ToneSelect
                            value={tone}
                            onChange={(value) => onConfigurationChange(moduleKey, { tone: value })}
                            disabled={isUpdating}
                            id={`tone-${moduleKey}`}
                          />
                        )}

                        {moduleKey === 'recommendations' && (
                            <RecommendationStrategySelect
                              value={strategy}
                              onChange={(value) => onConfigurationChange(moduleKey, { strategy: value })}
                              disabled={isUpdating}
                              id={`strategy-${moduleKey}`}
                            />
                        )}

                        {moduleKey === 'moderation' && (
                            <ModerationSensitivitySelect
                              value={sensitivity}
                              onChange={(value) => onConfigurationChange(moduleKey, { sensitivity: value })}
                              disabled={isUpdating}
                              id={`sensitivity-${moduleKey}`}
                            />
                        )}

                        {moduleKey === 'pricing' && (
                            <PricingStrategySelect
                              value={pricing_strategy}
                              onChange={(value) => onConfigurationChange(moduleKey, { pricing_strategy: value })}
                              disabled={isUpdating}
                              id={`pricing-strategy-${moduleKey}`}
                            />
                        )}

                        {moduleKey === 'predictions' && (
                            <PredictionTargetSelect
                              value={prediction_target}
                              onChange={(value) => onConfigurationChange(moduleKey, { prediction_target: value })}
                              disabled={isUpdating}
                              id={`prediction-target-${moduleKey}`}
                            />
                        )}

                        {moduleKey === 'scoring' && (
                            <ScoringCriteriaSelect
                              value={scoring_criteria}
                              onChange={(value) => onConfigurationChange(moduleKey, { scoring_criteria: value })}
                              disabled={isUpdating}
                              id={`scoring-criteria-${moduleKey}`}
                            />
                        )}

                        {moduleKey === 'logistics' && (
                            <LogisticsStrategySelect
                              value={logistics_strategy}
                              onChange={(value) => onConfigurationChange(moduleKey, { logistics_strategy: value })}
                              disabled={isUpdating}
                              id={`logistics-strategy-${moduleKey}`}
                            />
                        )}

                        {moduleKey === 'content_generation' && onTest && (
                            <div className="pt-2">
                                <Button variant="outline" size="sm" onClick={() => onTest(moduleKey)} disabled={isUpdating || !isEnabled}>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Tester
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="mt-auto bg-gray-50 p-4 flex items-center justify-between border-t">
                <Label htmlFor={`switch-${moduleKey}`} className="text-sm font-medium text-gray-600">Activer le module</Label>
                <Switch
                    id={`switch-${moduleKey}`}
                    checked={isEnabled}
                    onCheckedChange={(checked) => onToggle(moduleKey, checked)}
                    disabled={isUpdating}
                />
            </CardFooter>
        </Card>
    );
};
