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
import { Loader2 } from 'lucide-react';
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
        try {
            await updateSetting({
                userId: user.id,
                featureKey: key as any,
                isEnabled: checked
            });
            // Toast handled in hook
        } catch (error) {
            // Error handled in hook
        }
    };

    const getStatus = (key: string) => {
        const setting = settings.find(s => s.feature_key === key);
        return setting?.is_enabled ?? false; // Default false if not set (no override)
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
                        const isEnabled = getStatus(feature.key);
                        return (
                            <div key={feature.key} className="flex flex-row items-center justify-between p-4 border rounded-lg bg-gray-50/50">
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
