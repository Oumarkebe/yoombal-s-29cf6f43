
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, DollarSign, Loader2 } from 'lucide-react';
import { PremiumFeature } from '@/hooks/usePremiumFeatures';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PremiumFeatureCardProps {
  feature: PremiumFeature;
  onUpdate: (params: { feature_key: string; is_enabled?: boolean; configuration?: any }) => void;
  isUpdating: boolean;
}

export function PremiumFeatureCard({ feature, onUpdate, isUpdating }: PremiumFeatureCardProps) {
  const [configData, setConfigData] = useState(JSON.stringify(feature.configuration || {}, null, 2));
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleToggle = (enabled: boolean) => {
    onUpdate({ feature_key: feature.feature_key, is_enabled: enabled });
  };

  const handleConfigSave = () => {
    try {
      const parsedConfig = JSON.parse(configData);
      onUpdate({ feature_key: feature.feature_key, configuration: parsedConfig });
      setIsConfigOpen(false);
    } catch (error) {
      // Toast d'erreur géré par le hook
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className={`transition-all ${feature.is_enabled ? 'ring-2 ring-green-200 bg-green-50' : 'bg-white'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {feature.name}
              {feature.is_premium && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Premium
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            {feature.is_premium && (
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">{formatPrice(feature.price_monthly)}/mois</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Configuration - {feature.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="config">Configuration JSON</Label>
                    <textarea
                      id="config"
                      value={configData}
                      onChange={(e) => setConfigData(e.target.value)}
                      className="w-full h-64 p-3 border rounded-md font-mono text-sm"
                      placeholder="Configuration JSON..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleConfigSave} disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Switch
              checked={feature.is_enabled}
              onCheckedChange={handleToggle}
              disabled={isUpdating}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
