import React from 'react';
import {
    Check,
    X,
    Minus,
    Info
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const COMPARISON_FEATURES = [
    {
        category: "Ventes & Catalogue",
        items: [
            { key: 'unlimited_products', label: 'Nombre de produits', starter: '10', pro: 'Illimité', enterprise: 'Illimité', description: 'Nombre maximum de produits actifs dans votre catalogue.' },
            { key: 'digital_products', label: 'Produits digitaux', starter: false, pro: true, enterprise: true, description: 'Vente de fichiers, licences et services.' },
            { key: 'custom_store', label: 'Boutique personnalisée', starter: false, pro: true, enterprise: true, description: 'Couleurs et design adaptés à votre marque.' },
            { key: 'bulk_actions', label: 'Actions en masse', starter: false, pro: true, enterprise: true, description: 'Modifier ou supprimer plusieurs produits d\'un coup.' },
            { key: 'export_data', label: 'Export Données (Excel)', starter: false, pro: true, enterprise: true, description: 'Exporter vos ventes et inventaire au format Excel/CSV.' },
        ]
    },
    {
        category: "Intelligence Artificielle",
        items: [
            {
                key: 'ai_assistant',
                label: 'Assistant IA Teranga',
                starter: 'L1 (Griot Conseil)',
                pro: 'L2 (Agent Assisté)',
                enterprise: 'L3 (Agent Autonome)',
                description: 'Niveau d\'autorité IA ajustable : L1 (Conseil), L2 (Supervision), L3 (Autonomie totale Zero-Touch).'
            },
            { key: 'content_generation', label: 'Génération de Contenu IA', starter: false, pro: 'Assistée', enterprise: 'Automatisée', description: 'Génération automatique de descriptions, posts réseaux sociaux et mails via IA.' },
            { key: 'ai_smart_search', label: 'Recherche Visuelle/Vocale', starter: false, pro: true, enterprise: true, description: 'Recherche ultra-rapide par la voix ou en téléchargeant une photo d\'un produit.' },
            { key: 'ai_vision', label: 'Vision IA (Analyse Images)', starter: false, pro: false, enterprise: true, description: 'L\'IA analyse vos photos de stock pour identifier automatiquement les produits.' },
            { key: 'ai_pricing', label: 'Pricing Dynamique', starter: false, pro: false, enterprise: true, description: 'Ajustement automatique des prix selon la demande du marché sénégalais et vos stocks.' },
            { key: 'predictions', label: 'Analyses Prédictives', starter: false, pro: false, enterprise: true, description: 'Anticipez vos revenus futurs grâce aux modèles prédictifs de l\'Assistant Yoombal.' },
            { key: 'stock_prediction', label: 'Prédiction de Stocks', starter: false, pro: false, enterprise: true, description: 'Alertes intelligentes pour éviter les ruptures de stock avant qu\'elles n\'arrivent.' },
            { key: 'product_recommendations', label: 'Recommandations Smart', starter: false, pro: true, enterprise: true, description: 'L\'IA suggère les bons produits à vos clients pour augmenter le panier moyen.' },
        ]
    },
    {
        category: "Livraison & Logistique",
        items: [
            { key: 'delivery_dashboard', label: 'Dashboard Livreur', starter: 'Standard', pro: 'Avancé', enterprise: 'Temps Réel', description: 'Interface dédiée pour les livreurs avec suivi GPS et gestion des statuts de course.' },
            { key: 'route_optimization', label: 'Optimisation Itinéraires', starter: false, pro: true, enterprise: true, description: 'Calcul automatique du trajet le plus rapide pour livrer plusieurs clients.' },
            { key: 'multi_deliveries', label: 'Livraisons Groupées', starter: false, pro: true, enterprise: true, description: 'Possibilité pour un livreur de gérer plusieurs commandes simultanément.' },
        ]
    },
    {
        category: "Marketing & Fidélité",
        items: [
            { key: 'marketing_automation', label: 'Marketing Automatisé', starter: false, pro: true, enterprise: true, description: 'Envoi automatique de SMS/Emails pour relancer les paniers abandonnés.' },
            { key: 'vip_program', label: 'Programme VIP / Fidélité', starter: false, pro: true, enterprise: true, description: 'Système de fidélité avancé pour récompenser vos meilleurs clients.' },
            { key: 'gamification', label: 'Gamification (Points)', starter: false, pro: false, enterprise: true, description: 'Défis et points pour engager vos clients et livreurs via des récompenses.' },
        ]
    },
    {
        category: "Gestion & Support",
        items: [
            { key: 'analytics', label: 'Analytics', starter: 'Basique', pro: 'Avancé', enterprise: 'Complet', description: 'Tableaux de bord détaillés sur vos ventes et vos performances logistiques.' },
            { key: 'support', label: 'Support', starter: 'Email', pro: 'Prioritaire', enterprise: 'Dédié 24/7', description: 'Assistance technique spécialisée pour vous aider à utiliser Yoombal.' },
            { key: 'api', label: 'Accès API', starter: false, pro: false, enterprise: true, description: 'Connectez vos propres outils externes directement au système Yoombal.' },
        ]
    }
];

export const PlanComparator: React.FC = () => {
    const renderValue = (val: any) => {
        if (val === true) return <Check className="h-5 w-5 text-green-500 mx-auto" />;
        if (val === false) return <X className="h-5 w-5 text-gray-300 mx-auto" />;
        return <span className="font-medium text-gray-700">{val}</span>;
    };

    return (
        <div className="mt-20 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
            <div className="bg-gray-50/50 p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Comparatif des fonctionnalités</h2>
                    <p className="text-muted-foreground text-sm">Trouvez le plan qui correspond à la taille de votre business.</p>
                </div>
                <Badge variant="outline" className="bg-white">Version 2.0</Badge>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white hover:bg-white border-b-2">
                            <TableHead className="w-[300px] font-bold text-gray-900 py-6 px-8">Fonctionnalité</TableHead>
                            <TableHead className="text-center font-bold text-gray-900 py-6">Starter</TableHead>
                            <TableHead className="text-center font-bold text-primary py-6 bg-primary/5">Pro</TableHead>
                            <TableHead className="text-center font-bold text-gray-900 py-6">Enterprise</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {COMPARISON_FEATURES.map((group, idx) => [
                            <TableRow key={`group-${idx}`} className="bg-gray-50/30">
                                <TableCell colSpan={4} className="py-2 px-8 font-black text-xs uppercase tracking-widest text-gray-400">
                                    {group.category}
                                </TableCell>
                            </TableRow>,
                            ...group.items.map((item) => (
                                <TableRow key={item.key} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="py-4 px-8 font-medium text-gray-600">
                                        <div className="flex items-center gap-2">
                                            {item.label}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="h-3 w-3 text-gray-400" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="text-xs max-w-[200px]">
                                                            {(item as any).description || `Détails sur ${item.label}`}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center py-4">{renderValue(item.starter)}</TableCell>
                                    <TableCell className="text-center py-4 bg-primary/[0.02]">{renderValue(item.pro)}</TableCell>
                                    <TableCell className="text-center py-4">{renderValue(item.enterprise)}</TableCell>
                                </TableRow>
                            ))
                        ])}
                    </TableBody>
                </Table>
            </div>

            <div className="p-8 bg-gray-50/50 text-center border-t border-gray-100">
                <p className="text-xs text-muted-foreground italic">
                    * Les prix affichés sont assujettis aux taxes locales en vigueur au Sénégal.
                </p>
            </div>
        </div>
    );
};
