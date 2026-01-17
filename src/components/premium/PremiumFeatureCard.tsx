import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PremiumFeature } from '@/hooks/useSubscription';

interface PremiumFeatureCardProps {
    feature: PremiumFeature;
    isActive: boolean;
    isLoading: boolean;
    onActivate: () => void;
    onDeactivate: () => void;
}

export function PremiumFeatureCard({
    feature,
    isActive,
    isLoading,
    onActivate,
    onDeactivate
}: PremiumFeatureCardProps) {
    return (
        <Card className={cn(
            "relative overflow-hidden border-white/20 backdrop-blur-sm transition-all duration-300 hover:shadow-xl",
            isActive ? "bg-primary/5 border-primary/30" : "bg-card/50"
        )}>
            {isActive && (
                <div className="absolute top-0 right-0 p-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 animate-pulse">
                        <Check className="h-3 w-3 mr-1" /> Actif
                    </Badge>
                </div>
            )}

            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            {feature.name}
                            {!isActive && feature.is_free && (
                                <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20 uppercase">
                                    Essai
                                </Badge>
                            )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {feature.description}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="text-2xl font-black text-primary">
                            {feature.price_monthly.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">FCFA/mois</span>
                        </div>
                        {feature.trial_days && feature.trial_days > 0 && !isActive && (
                            <div className="flex items-center text-[10px] text-orange-600 font-semibold gap-1">
                                <Clock className="h-3 w-3" />
                                {feature.trial_days} jours d'essai gratuit
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-muted-foreground">
                            {isActive ? "Désactiver" : "Activer"}
                        </span>
                        <Switch
                            checked={isActive}
                            onCheckedChange={(checked) => checked ? onActivate() : onDeactivate()}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {!isActive && (
                    <Button
                        onClick={onActivate}
                        className="w-full group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg transition-all duration-300"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            "Traitement..."
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                                Débloquer cette fonction
                            </>
                        )}
                    </Button>
                )}
            </CardContent>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50" />
        </Card>
    );
}
