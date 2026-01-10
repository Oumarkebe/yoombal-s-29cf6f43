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
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Calendar } from 'lucide-react';

interface UserFeaturesModalProps {
    user: any;
    onClose: () => void;
    onUpdate?: () => void;
}

const FEATURES: { key: string; label: string; description: string }[] = [
    // Core App Features
    { key: 'export_data', label: 'Export Excel (Données)', description: 'Autoriser l\'export des données.' },
    { key: 'premium_support', label: 'Support Premium', description: 'Accès prioritaire au support.' },
    { key: 'bulk_actions', label: 'Actions en masse', description: 'Suppression et modification groupée.' },

    // AI Features (Intelligence Artificielle)
    { key: 'ai_assistant', label: 'Assistant IA (Yoombal Bot)', description: 'Accès au chatbot intelligent pour les clients.' },
    { key: 'content_generation', label: 'Génération de Contenu IA', description: 'Générer des descriptions de produits automatiquement.' },
    { key: 'ai_smart_search', label: 'Recherche Intelligente', description: 'Recherche sémantique et vocale avancée.' },
    { key: 'ai_vision', label: 'Vision IA', description: 'Analyse d\'images et recherche visuelle.' },
    { key: 'pricing', label: 'Pricing Dynamique', description: 'Optimisation automatique des prix via IA.' },

    // Analytics & BI
    { key: 'predictions', label: 'Analyses Prédictives', description: 'Prévision des ventes et tendances IA.' },
    { key: 'advanced_stats', label: 'Statistiques Avancées', description: 'Accès aux graphiques détaillés.' },

    // Automatisation
    { key: 'fraud_detection', label: 'Détection de Fraude', description: 'Analyse automatique des risques sur les commandes.' },
    { key: 'stock_prediction', label: 'Gestion des Stocks IA', description: 'Alertes de réapprovisionnement prédictives.' },

    // Marketing & Fidélisation
    { key: 'product_recommendations', label: 'Recommandations', description: 'Moteur de recommandation personnalisé.' },
    { key: 'marketing_automation', label: 'Marketing Auto', description: 'Campagnes SMS/Email automatiques.' },
    { key: 'referral_system', label: 'Parrainage', description: 'Gestion des bonus de parrainage.' },
    { key: 'vip_program', label: 'Programme VIP', description: 'Avantages exclusifs et paliers de fidélité.' },
    { key: 'gamification', label: 'Gamification', description: 'Système de points et badges.' },
];


export function UserFeaturesModal({ user, onClose, onUpdate }: UserFeaturesModalProps) {
    const [permissions, setPermissions] = useState<Record<string, any>>(user.permissions || {});
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Helper to get permission state
    const getPerm = (key: string) => {
        return permissions[key] || { active: false, expires_at: null };
    };

    const handleToggle = (key: string, checked: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                active: checked,
                // Set default expiry to 1 year if enabling and no date set
                expires_at: checked && !prev[key]?.expires_at
                    ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
                    : prev[key]?.expires_at
            }
        }));
        setHasChanges(true);
    };

    const handleDateChange = (key: string, date: string) => {
        setPermissions(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                expires_at: date || null
            }
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Update Profile
            const { error } = await supabase
                .from('profiles')
                .update({ permissions })
                .eq('id', user.id);

            if (error) throw error;

            // 2. Log Action
            await supabase.from('admin_logs').insert({
                actor_id: (await supabase.auth.getUser()).data.user?.id,
                action: 'UPDATE_USER_PERMISSIONS',
                target_id: user.id,
                details: { permissions }
            });

            toast.success(`Fonctionnalités mises à jour pour ${user.user_metadata?.first_name || user.email}`);
            onUpdate?.();
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(`Erreur: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gérer les fonctionnalités</DialogTitle>
                    <DialogDescription>
                        Configurez les accès et abonnements pour {user.email}.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {FEATURES.map((feature) => {
                        const state = getPerm(feature.key);
                        return (
                            <div key={feature.key} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 border rounded-lg bg-gray-50/50">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor={`switch-${feature.key}`} className="text-base font-medium">
                                            {feature.label}
                                        </Label>
                                        {state.active && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                Actif
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{feature.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {state.active && (
                                        <div className="flex flex-col gap-1 w-40">
                                            <Label className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Expire le
                                            </Label>
                                            <Input
                                                type="date"
                                                value={state.expires_at?.split('T')[0] || ''}
                                                onChange={(e) => handleDateChange(feature.key, e.target.value)}
                                                className="h-8 text-xs bg-white"
                                            />
                                        </div>
                                    )}
                                    <Switch
                                        id={`switch-${feature.key}`}
                                        checked={state.active}
                                        onCheckedChange={(c) => handleToggle(feature.key, c)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Annuler</Button>
                    <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enregistrer les modifications
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
