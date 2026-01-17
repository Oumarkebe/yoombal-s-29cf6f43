import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FEATURE_TRANSLATIONS } from '@/lib/subscription-features';
import { useUserAiSettings } from '@/hooks/useUserAiSettings';

interface UserFeaturesModalProps {
    user: any;
    onClose: () => void;
    onUpdate?: () => void;
}

export function UserFeaturesModal({ user, onClose, onUpdate }: UserFeaturesModalProps) {
    const { settings, updateSetting, isUpdating } = useUserAiSettings({ userId: user.id });

    // Convert translation map to array for display
    const allFeatures = Object.entries(FEATURE_TRANSLATIONS).map(([key, label]) => ({
        key,
        label
    }));

    const handleToggle = async (key: string, checked: boolean) => {
        const currentSetting = settings.find(s => s.feature_key === key);
        try {
            await updateSetting({
                userId: user.id,
                featureKey: key as any,
                isEnabled: checked,
                configuration: currentSetting?.configuration || {}
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfigChange = async (key: string, configKey: string, value: any) => {
        const currentSetting = settings.find(s => s.feature_key === key);
        try {
            await updateSetting({
                userId: user.id,
                featureKey: key as any,
                isEnabled: currentSetting?.is_enabled ?? false,
                configuration: {
                    ...(currentSetting?.configuration || {}),
                    [configKey]: value
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const getSetting = (key: string) => {
        return settings.find(s => s.feature_key === key);
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gérer les fonctionnalités ciblées</DialogTitle>
                    <DialogDescription>
                        Activez ou désactivez des outils spécifiques pour {user.email}.
                        Ces réglages surchargent le plan d'abonnement.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {allFeatures.map((feature) => {
                        const setting = getSetting(feature.key);
                        const isEnabled = setting?.is_enabled ?? false;

                        return (
                            <div key={feature.key} className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="space-y-1 flex-1">
                                        <Label htmlFor={`switch-${feature.key}`} className="text-base font-medium cursor-pointer">
                                            {feature.label}
                                        </Label>
                                        <p className="text-xs text-gray-500 font-mono">{feature.key}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isEnabled && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mr-2">
                                                Activé
                                            </span>
                                        )}
                                        <Switch
                                            id={`switch-${feature.key}`}
                                            checked={isEnabled}
                                            onCheckedChange={(c) => handleToggle(feature.key, c)}
                                            disabled={isUpdating}
                                        />
                                    </div>
                                </div>

                                {isEnabled && feature.key === 'ai_assistant' && (
                                    <div className="pt-2 border-t mt-2">
                                        <Label className="text-sm font-semibold mb-2 block">Niveau d'autorité (AI Policy)</Label>
                                        <Select
                                            value={setting?.configuration?.authority_level || 'L1'}
                                            onValueChange={(v) => handleConfigChange(feature.key, 'authority_level', v)}
                                            disabled={isUpdating}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Choisir un niveau" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="L1">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="w-4 h-4 text-blue-500" />
                                                        <span>L1 - Griot (Conseil uniquement)</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="L2">
                                                    <div className="flex items-center gap-2">
                                                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                                                        <span>L2 - Agent (Confirmation requise)</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="L3">
                                                    <div className="flex items-center gap-2">
                                                        <ShieldAlert className="w-4 h-4 text-red-500" />
                                                        <span>L3 - Autonome (Zero-Touch Voice)</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[10px] text-gray-400 mt-2">
                                            * L3 permet l'envoi automatique via commandes vocales explicites.
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
