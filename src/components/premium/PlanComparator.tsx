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
            { key: 'products', label: 'Nombre de produits', starter: '10', pro: 'Illimité', enterprise: 'Illimité' },
            { key: 'digital', label: 'Produits digitaux', starter: false, pro: true, enterprise: true },
            { key: 'custom_store', label: 'Boutique personnalisée', starter: false, pro: true, enterprise: true },
        ]
    },
    {
        category: "Intelligence Artificielle",
        items: [
            { key: 'ai_assistant', label: 'Assistant IA Teranga', starter: false, pro: true, enterprise: true },
            { key: 'ai_pricing', label: 'Pricing Dynamique', starter: false, pro: false, enterprise: true },
            { key: 'predictions', label: 'Analyses Prédictives', starter: false, pro: false, enterprise: true },
        ]
    },
    {
        category: "Gestion & Support",
        items: [
            { key: 'analytics', label: 'Analytics', starter: 'Basique', pro: 'Avancé', enterprise: 'Complet' },
            { key: 'support', label: 'Support', starter: 'Email', pro: 'Prioritaire', enterprise: 'Dédié 24/7' },
            { key: 'api', label: 'Accès API', starter: false, pro: false, enterprise: true },
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
                        {COMPARISON_FEATURES.map((group, idx) => (
                            <React.Fragment key={idx}>
                                <TableRow className="bg-gray-50/30">
                                    <TableCell colSpan={4} className="py-2 px-8 font-black text-xs uppercase tracking-widest text-gray-400">
                                        {group.category}
                                    </TableCell>
                                </TableRow>
                                {group.items.map((item) => (
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
                                                            <p className="text-xs">Détails sur {item.label}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center py-4">{renderValue(item.starter)}</TableCell>
                                        <TableCell className="text-center py-4 bg-primary/[0.02]">{renderValue(item.pro)}</TableCell>
                                        <TableCell className="text-center py-4">{renderValue(item.enterprise)}</TableCell>
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
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
