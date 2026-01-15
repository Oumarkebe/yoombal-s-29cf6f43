import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, BrainCircuit, TrendingUp, Save, Coins, MessageSquare, Sparkles, Package, ShoppingCart, Users, BarChart, Zap, Target, Globe, CreditCard, Shield, Edit2, Check, X, Smartphone, Mic, Truck, DollarSign, UsersRound, Heart, Settings, Calendar, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, differenceInDays, addDays, addMonths, addYears, isPast } from "date-fns";
import { fr } from "date-fns/locale";

type PremiumFeature = {
    id: string;
    feature_key: string;
    name: string;
    description: string;
    category: string;
    is_premium: boolean;
    price_monthly: number;
    is_enabled: boolean;
    is_free: boolean;
    configuration: any;
    activated_at?: string;
    expires_at?: string;
    trial_days?: number;
    status?: 'active' | 'trial' | 'expired' | 'disabled';
};

const FEATURE_ICONS: Record<string, any> = {
    'analytics': BarChart,
    'content': Sparkles,
    'commerce': ShoppingCart,
    'support': MessageSquare,
    'marketing': Target,
    'security': Shield,
    'africa': Globe,
    'vertical': Package,
    'logistics': Truck,
    'finance': DollarSign,
    'social': UsersRound,
    'personalization': Heart
};

const STATUS_BADGES = {
    'active': { label: 'Actif', variant: 'default' as const, color: 'text-green-600' },
    'trial': { label: 'Essai', variant: 'secondary' as const, color: 'text-blue-600' },
    'expired': { label: 'Expiré', variant: 'destructive' as const, color: 'text-red-600' },
    'disabled': { label: 'Désactivé', variant: 'outline' as const, color: 'text-gray-500' }
};

export default function AdminAICenter() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [features, setFeatures] = useState<PremiumFeature[]>([]);
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
    const [editingPriceValue, setEditingPriceValue] = useState('');
    const [configDialogFeature, setConfigDialogFeature] = useState<PremiumFeature | null>(null);
    const [tempTrialDays, setTempTrialDays] = useState(0);
    const [tempExpiresAt, setTempExpiresAt] = useState('');
    const [tempIsFree, setTempIsFree] = useState(false);

    // Chatbot settings
    const [botSettings, setBotSettings] = useState({
        systemPrompt: "Tu es un assistant utile pour Yoombal, une plateforme e-commerce sénégalaise.",
        tone: "professionnel et chaleureux (Teranga)"
    });
    const [aiKeys, setAiKeys] = useState({
        openaiApiKey: ""
    });

    // KPIs
    const kpis = [
        { label: "Économies Générées", value: "1.2M FCFA", icon: Coins, color: "text-amber-600" },
        { label: "Taux d'Adoption", value: "85%", icon: TrendingUp, color: "text-green-600" },
        { label: "Interactions Total", value: "1,240", icon: MessageSquare, color: "text-blue-600" }
    ];

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        try {
            const { data, error } = await supabase
                .from('premium_features')
                .select('*')
                .order('category', { ascending: true })
                .order('name', { ascending: true });

            if (error) throw error;

            if (data && data.length > 0) {
                setFeatures(data as any);
            } else {
                await initializeDefaultFeatures();
            }

            // AI keys are stored elsewhere - skip for now
            // This would require a platform_settings table migration
        } catch (error) {
            console.error("Error fetching features:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les fonctionnalités",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const initializeDefaultFeatures = async () => {
        const defaultFeatures = [
            // ANALYTICS (4)
            { feature_key: 'predictions', name: 'Analyses Prédictives', description: 'Prévisions de ventes et tendances du marché', category: 'analytics', price_monthly: 4900, trial_days: 14 },
            { feature_key: 'tableau_bord_avance', name: 'Tableau de Bord Avancé', description: 'Métriques temps réel et KPI personnalisés', category: 'analytics', price_monthly: 2900, trial_days: 7 },
            { feature_key: 'rapports_personnalises', name: 'Rapports Personnalisés', description: 'Génération automatique de rapports sur mesure', category: 'analytics', price_monthly: 1900, trial_days: 7 },
            { feature_key: 'analyse_comportement', name: 'Analyse Comportementale', description: 'Tracking utilisateur et parcours client détaillé', category: 'analytics', price_monthly: 3900, trial_days: 14 },

            // CONTENT (4)
            { feature_key: 'generation_contenu', name: 'Génération de Contenu IA', description: 'Descriptions produits automatiques optimisées', category: 'content', price_monthly: 5900, trial_days: 14 },
            { feature_key: 'optimisation_seo', name: 'Optimisation SEO', description: 'Amélioration automatique du référencement Google', category: 'content', price_monthly: 3900, trial_days: 7 },
            { feature_key: 'traduction_auto', name: 'Traduction Automatique', description: 'Multilingue avec IA (Français, English, Wolof)', category: 'content', price_monthly: 2900, trial_days: 7 },
            { feature_key: 'suggestions_images', name: 'Suggestions d\'Images IA', description: 'Recommandations visuelles intelligentes', category: 'content', price_monthly: 1900, trial_days: 7 },

            // COMMERCE (5)
            { feature_key: 'ai_pricing', name: 'Tarification Dynamique', description: 'Prix adaptatifs selon demande et concurrence', category: 'commerce', price_monthly: 7900, trial_days: 30 },
            { feature_key: 'recommandations_produits', name: 'Recommandations Produits', description: 'Suggestions personnalisées par IA', category: 'commerce', price_monthly: 4900, trial_days: 14 },
            { feature_key: 'gestion_stock_ia', name: 'Gestion Stock Intelligente', description: 'Prévisions et alertes automatiques de rupture', category: 'commerce', price_monthly: 5900, trial_days: 14 },
            { feature_key: 'detection_fraude', name: 'Détection de Fraude', description: 'Protection transactions avec machine learning', category: 'commerce', price_monthly: 6900, trial_days: 30 },
            { feature_key: 'panier_abandonne', name: 'Récupération Panier', description: 'Relances automatisées intelligentes', category: 'commerce', price_monthly: 3900, trial_days: 14 },

            // SUPPORT (4)
            { feature_key: 'ai_assistant', name: 'Yoombal Bot (Chatbot IA)', description: 'Support client 24/7 automatisé et intelligent', category: 'support', price_monthly: 8900, trial_days: 30 },
            { feature_key: 'faq_auto', name: 'FAQ Automatique', description: 'Réponses générées et mises à jour par IA', category: 'support', price_monthly: 2900, trial_days: 7 },
            { feature_key: 'tickets_priorite', name: 'Priorisation Tickets', description: 'Tri automatique par urgence et type', category: 'support', price_monthly: 3900, trial_days: 14 },
            { feature_key: 'sentiment_analysis', name: 'Analyse de Sentiment', description: 'Détection satisfaction client en temps réel', category: 'support', price_monthly: 4900, trial_days: 14 },

            // MARKETING (4)
            { feature_key: 'campagnes_auto', name: 'Campagnes Automatisées', description: 'Email et SMS marketing intelligents', category: 'marketing', price_monthly: 5900, trial_days: 14 },
            { feature_key: 'segmentation_client', name: 'Segmentation Avancée', description: 'Groupes clients optimisés par IA', category: 'marketing', price_monthly: 4900, trial_days: 14 },
            { feature_key: 'ab_testing_auto', name: 'A/B Testing Automatique', description: 'Optimisation continue des conversions', category: 'marketing', price_monthly: 3900, trial_days: 14 },
            { feature_key: 'prediction_churn', name: 'Prédiction de Churn', description: 'Identification clients à risque de départ', category: 'marketing', price_monthly: 6900, trial_days: 14 },

            // SECURITY (2)
            { feature_key: 'audit_securite', name: 'Audit Sécurité IA', description: 'Scan automatique des vulnérabilités', category: 'security', price_monthly: 7900, trial_days: 30 },
            { feature_key: 'monitoring_temps_reel', name: 'Monitoring Temps Réel', description: 'Alertes anomalies système instantanées', category: 'security', price_monthly: 5900, trial_days: 14 },

            // AFRICA SPECIFIC (5)
            { feature_key: 'mobile_money_ia', name: 'Mobile Money Intelligent', description: 'OM/Wave avec détection fraude avancée', category: 'africa', price_monthly: 6900, trial_days: 30 },
            { feature_key: 'wolof_pulaar_nlp', name: 'NLP Wolof/Pulaar', description: 'Compréhension langues locales pour chatbot', category: 'africa', price_monthly: 8900, trial_days: 30 },
            { feature_key: 'livraison_zone_rurale', name: 'Livraison Zone Rurale', description: 'Optimisation routes zones difficiles', category: 'africa', price_monthly: 4900, trial_days: 14 },
            { feature_key: 'paiement_tontine', name: 'Tontines Digitales', description: 'Paiement différé communautaire et groupes', category: 'africa', price_monthly: 5900, trial_days: 14 },
            { feature_key: 'adaptation_ramadan', name: 'Adaptation Ramadan/Tabaski', description: 'Prix et stock dynamiques périodes religieuses', category: 'africa', price_monthly: 3900, trial_days: 7 },

            // VERTICAL METIERS (4)
            { feature_key: 'mode_textile_ia', name: 'IA Mode & Textile', description: 'Reconnaissance tissus, conseils tailles/morpho', category: 'vertical', price_monthly: 4900, trial_days: 14 },
            { feature_key: 'alimentaire_frais', name: 'Alimentaire Frais', description: 'Gestion péremption et rotation FIFO', category: 'vertical', price_monthly: 3900, trial_days: 14 },
            { feature_key: 'cosmetiques_naturels', name: 'Cosmétiques Naturels', description: 'Recommandations type peau/cheveux afro', category: 'vertical', price_monthly: 4900, trial_days: 14 },
            { feature_key: 'electronique_tech', name: 'Électronique & Tech', description: 'Détection compatibilité et comparaisons specs', category: 'vertical', price_monthly: 3900, trial_days: 7 },

            // LOGISTICS (3)
            { feature_key: 'optimisation_tournees', name: 'Optimisation Tournées Multi-Points', description: 'Algorithmes avancés pour livreurs', category: 'logistics', price_monthly: 5900, trial_days: 14 },
            { feature_key: 'prevision_trafic', name: 'Prévision Trafic Dakar', description: 'Estimations temps réel embouteillages', category: 'logistics', price_monthly: 3900, trial_days: 14 },
            { feature_key: 'gestion_entrepots', name: 'Gestion Entrepôts Multi-Zones', description: 'IA placement optimal produits', category: 'logistics', price_monthly: 4900, trial_days: 14 },

            // FINANCE (3)
            { feature_key: 'credit_scoring', name: 'Credit Scoring IA', description: 'Évaluation solvabilité BNPL sans banque', category: 'finance', price_monthly: 7900, trial_days: 30 },
            { feature_key: 'detection_blanchiment', name: 'Détection Blanchiment', description: 'Conformité BCEAO et réglementations', category: 'finance', price_monthly: 6900, trial_days: 30 },
            { feature_key: 'facturation_electronique', name: 'Facturation Électronique', description: 'Conformité fiscale automatique Sénégal', category: 'finance', price_monthly: 3900, trial_days: 14 },

            // SOCIAL (3)
            { feature_key: 'influence_locale', name: 'Micro-Influenceurs Locaux', description: 'Identification ambassadeurs quartiers', category: 'social', price_monthly: 4900, trial_days: 14 },
            { feature_key: 'groupes_achat', name: 'Groupes d\'Achat Intelligents', description: 'Organisation achats groupés optimisés', category: 'social', price_monthly: 3900, trial_days: 14 },
            { feature_key: 'fidelite_gamifie', name: 'Programme Fidélité Gamifié', description: 'Points, badges, défis communautaires', category: 'social', price_monthly: 5900, trial_days: 14 },

            // PERSONALIZATION (2)
            { feature_key: 'assistant_vocal_teranga', name: 'Assistant Vocal Teranga', description: 'Voix sénégalaises et accents locaux', category: 'personalization', price_monthly: 7900, trial_days: 30 },
            { feature_key: 'reco_evenements', name: 'Recommandations Événements', description: 'Tabaski, mariages, baptêmes, cérémonies', category: 'personalization', price_monthly: 3900, trial_days: 7 },
        ];

        try {
            for (const feature of defaultFeatures) {
                await supabase.from('premium_features').insert({
                    ...feature,
                    is_premium: true,
                    is_enabled: false,
                    status: 'disabled',
                    configuration: {}
                });
            }
            await fetchFeatures();
        } catch (error) {
            console.error("Error initializing features:", error);
        }
    };

    const handleToggle = async (featureId: string, currentState: boolean) => {
        try {
            const { error } = await supabase
                .from('premium_features')
                .update({ is_enabled: !currentState })
                .eq('id', featureId);

            if (error) throw error;

            await fetchFeatures(); // Refresh to get updated status

            toast({
                title: "Succès",
                description: currentState ? "Module désactivé" : "Module activé",
            });
        } catch (error) {
            console.error("Error toggling feature:", error);
            toast({
                title: "Erreur",
                description: "Échec de la mise à jour",
                variant: "destructive"
            });
        }
    };

    const startEditingPrice = (featureId: string, currentPrice: number) => {
        setEditingPriceId(featureId);
        setEditingPriceValue(currentPrice.toString());
    };

    const savePrice = async (featureId: string) => {
        const newPrice = parseFloat(editingPriceValue);
        if (isNaN(newPrice) || newPrice < 0) {
            toast({
                title: "Erreur",
                description: "Prix invalide",
                variant: "destructive"
            });
            return;
        }

        try {
            const { error } = await supabase
                .from('premium_features')
                .update({ price_monthly: newPrice })
                .eq('id', featureId);

            if (error) throw error;

            setFeatures(prev =>
                prev.map(f => f.id === featureId ? { ...f, price_monthly: newPrice } : f)
            );

            setEditingPriceId(null);
            toast({
                title: "Succès",
                description: "Prix mis à jour",
            });
        } catch (error) {
            console.error("Error updating price:", error);
            toast({
                title: "Erreur",
                description: "Échec de la mise à jour du prix",
                variant: "destructive"
            });
        }
    };

    const openConfigDialog = (feature: PremiumFeature) => {
        setConfigDialogFeature(feature);
        setTempTrialDays(feature.trial_days || 0);
        setTempExpiresAt(feature.expires_at ? format(new Date(feature.expires_at), 'yyyy-MM-dd') : '');
        setTempIsFree(feature.is_free || false);
    };

    const saveDurationConfig = async () => {
        if (!configDialogFeature) return;

        try {
            const updates: any = {
                trial_days: tempTrialDays,
                is_free: tempIsFree
            };

            if (tempExpiresAt) {
                updates.expires_at = new Date(tempExpiresAt).toISOString();
            }

            const { error } = await supabase
                .from('premium_features')
                .update(updates)
                .eq('id', configDialogFeature.id);

            if (error) throw error;

            await fetchFeatures();
            setConfigDialogFeature(null);

            toast({
                title: "Succès",
                description: "Configuration enregistrée",
            });
        } catch (error) {
            console.error("Error saving duration:", error);
            toast({
                title: "Erreur",
                description: "Échec de la sauvegarde",
                variant: "destructive"
            });
        }
    };

    const cancelEditingPrice = () => {
        setEditingPriceId(null);
        setEditingPriceValue('');
    };

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            const assistantFeature = features.find(f => f.feature_key === 'ai_assistant');
            if (assistantFeature) {
                const { error } = await supabase
                    .from('premium_features')
                    .update({
                        configuration: {
                            system_prompt: botSettings.systemPrompt,
                            tone: botSettings.tone
                        }
                    })
                    .eq('id', assistantFeature.id);

                if (error) throw error;
            }

            // Save AI Keys
            await supabase
                .from('platform_settings' as any)
                .upsert({
                    key: 'ai_keys',
                    value: aiKeys,
                    updated_at: new Date().toISOString()
                });

            toast({
                title: "Succès",
                description: "Configuration sauvegardée",
            });
        } catch (error) {
            console.error("Error saving:", error);
            toast({
                title: "Erreur",
                description: "Échec de la sauvegarde",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getDaysRemaining = (expiresAt?: string) => {
        if (!expiresAt) return null;
        return differenceInDays(new Date(expiresAt), new Date());
    };

    const getActiveCount = () => features.filter(f => f.is_enabled).length;
    const getTotalMonthlyCost = () => features.filter(f => f.is_enabled).reduce((sum, f) => sum + (f.price_monthly || 0), 0);
    const getTotalYearlyCost = () => getTotalMonthlyCost() * 10;

    const formatPrice = (monthly: number) => {
        if (billingPeriod === 'yearly') {
            return `${(monthly * 10).toLocaleString()} FCFA/an`;
        }
        return `${monthly.toLocaleString()} FCFA/mois`;
    };

    const groupedFeatures = features.reduce((acc, feature) => {
        if (!acc[feature.category]) acc[feature.category] = [];
        acc[feature.category].push(feature);
        return acc;
    }, {} as Record<string, PremiumFeature[]>);

    const categoryNames: Record<string, string> = {
        'analytics': 'Analyses & Insights',
        'content': 'Contenu & SEO',
        'commerce': 'Commerce & Ventes',
        'support': 'Support Client',
        'marketing': 'Marketing & CRM',
        'security': 'Sécurité & Monitoring',
        'africa': '🌍 Spécifique Afrique',
        'vertical': 'Verticaux Métiers',
        'logistics': 'Logistique Avancée',
        'finance': 'Finance & Conformité',
        'social': 'Social & Communauté',
        'personalization': 'Hyper-Personnalisation'
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Centre Intelligence Artificielle</h1>
                    <p className="text-muted-foreground">Gérez {features.length} modules cognitifs premium avec suivi de durée.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                        <Label className="text-sm">Facturation:</Label>
                        <Button
                            variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setBillingPeriod('monthly')}
                        >
                            Mensuelle
                        </Button>
                        <Button
                            variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setBillingPeriod('yearly')}
                        >
                            Annuelle
                            <Badge variant="secondary" className="ml-2">-20%</Badge>
                        </Button>
                    </div>
                    <Button onClick={saveSettings} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                    </Button>
                </div>
            </div>

            {/* KPI Section */}
            <div className="grid gap-4 md:grid-cols-4">
                {kpis.map((kpi, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Modules Actifs</CardTitle>
                        <Zap className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{getActiveCount()} / {features.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {billingPeriod === 'yearly'
                                ? `${getTotalYearlyCost().toLocaleString()} FCFA/an`
                                : `${getTotalMonthlyCost().toLocaleString()} FCFA/mois`
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="modules" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="modules">Modules & Durées</TabsTrigger>
                    <TabsTrigger value="chatbot">Configuration Chatbot</TabsTrigger>
                </TabsList>

                <TabsContent value="modules" className="space-y-4">
                    {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => {
                        const Icon = FEATURE_ICONS[category] || Sparkles;
                        return (
                            <Card key={category}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Icon className="h-5 w-5" />
                                        {categoryNames[category] || category}
                                    </CardTitle>
                                    <CardDescription>
                                        {categoryFeatures.length} fonctionnalités • {categoryFeatures.filter(f => f.is_enabled).length} actives
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {categoryFeatures.map(feature => {
                                        const daysLeft = getDaysRemaining(feature.expires_at);
                                        const statusInfo = STATUS_BADGES[feature.status || 'disabled'];

                                        return (
                                            <div key={feature.id} className="flex items-start justify-between space-x-2 p-3 rounded-lg hover:bg-accent/50 transition-colors border">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={feature.id} className="text-base font-semibold cursor-pointer">
                                                            {feature.name}
                                                        </Label>
                                                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                                                        {feature.is_free && (
                                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex items-center gap-1">
                                                                <Sparkles className="w-3 h-3" />
                                                                Gratuit
                                                            </Badge>
                                                        )}
                                                        {feature.trial_days && feature.trial_days > 0 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <Sparkles className="w-3 h-3 mr-1" />
                                                                {feature.trial_days}j d'essai
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{feature.description}</p>

                                                    {/* Duration Info */}
                                                    {feature.status !== 'disabled' && (
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                                            {feature.activated_at && (
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    Activé le {format(new Date(feature.activated_at), 'dd MMM yyyy', { locale: fr })}
                                                                </span>
                                                            )}
                                                            {feature.expires_at && daysLeft !== null && (
                                                                <span className={`flex items-center gap-1 ${daysLeft < 7 ? 'text-red-600 font-medium' : ''}`}>
                                                                    <Clock className="w-3 h-3" />
                                                                    {daysLeft > 0 ? `Expire dans ${daysLeft}j` : 'Expiré'}
                                                                    {daysLeft < 7 && daysLeft > 0 && <AlertCircle className="w-3 h-3" />}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Price */}
                                                    {feature.price_monthly > 0 && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {editingPriceId === feature.id ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        type="number"
                                                                        value={editingPriceValue}
                                                                        onChange={(e) => setEditingPriceValue(e.target.value)}
                                                                        className="w-32 h-8"
                                                                        autoFocus
                                                                    />
                                                                    <Button size="sm" variant="ghost" onClick={() => savePrice(feature.id)}>
                                                                        <Check className="h-4 w-4 text-green-600" />
                                                                    </Button>
                                                                    <Button size="sm" variant="ghost" onClick={cancelEditingPrice}>
                                                                        <X className="h-4 w-4 text-red-600" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <p className="text-xs text-amber-600 font-medium">
                                                                        {formatPrice(feature.price_monthly)}
                                                                    </p>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="h-6 w-6 p-0"
                                                                        onClick={() => startEditingPrice(feature.id, feature.price_monthly)}
                                                                    >
                                                                        <Edit2 className="h-3 w-3" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => openConfigDialog(feature)}
                                                            >
                                                                <Settings className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Configuration: {configDialogFeature?.name}</DialogTitle>
                                                                <DialogDescription>
                                                                    Gérez la durée d'activation et les périodes d'essai
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="trial">Période d'essai gratuite (jours)</Label>
                                                                    <Input
                                                                        id="trial"
                                                                        type="number"
                                                                        min="0"
                                                                        value={tempTrialDays}
                                                                        onChange={(e) => setTempTrialDays(parseInt(e.target.value) || 0)}
                                                                    />
                                                                    <p className="text-xs text-muted-foreground">
                                                                        0 = Pas d'essai gratuit
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="expires">Date d'expiration (optionnel)</Label>
                                                                    <Input
                                                                        id="expires"
                                                                        type="date"
                                                                        value={tempExpiresAt}
                                                                        onChange={(e) => setTempExpiresAt(e.target.value)}
                                                                    />
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Laisser vide pour abonnement illimité
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed border-amber-300">
                                                                    <div className="space-y-0.5">
                                                                        <Label htmlFor="free-mode" className="text-amber-700 font-bold flex items-center gap-2">
                                                                            <Sparkles className="h-4 w-4" />
                                                                            Mode Gratuit
                                                                        </Label>
                                                                        <p className="text-xs text-amber-600">
                                                                            Rendre ce module accessible sans crédit.
                                                                        </p>
                                                                    </div>
                                                                    <Switch
                                                                        id="free-mode"
                                                                        checked={tempIsFree}
                                                                        onCheckedChange={setTempIsFree}
                                                                    />
                                                                </div>
                                                                <Button onClick={saveDurationConfig} className="w-full">
                                                                    Enregistrer la configuration
                                                                </Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Switch
                                                        id={feature.id}
                                                        checked={feature.is_enabled}
                                                        onCheckedChange={() => handleToggle(feature.id, feature.is_enabled)}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                <TabsContent value="chatbot" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personnalisation Yoombal Bot</CardTitle>
                            <CardDescription>Définissez la personnalité de votre assistant IA.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="system-prompt">Prompt Système</Label>
                                <Textarea
                                    id="system-prompt"
                                    className="min-h-[150px]"
                                    placeholder="Définissez le comportement de base..."
                                    value={botSettings.systemPrompt}
                                    onChange={(e) => setBotSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
                                />
                                <p className="text-xs text-muted-foreground">Instruction qui guide toutes les réponses du bot.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tone">Ton de voix</Label>
                                <Input
                                    id="tone"
                                    placeholder="ex: Amical, Professionnel, Teranga"
                                    value={botSettings.tone}
                                    onChange={(e) => setBotSettings(prev => ({ ...prev, tone: e.target.value }))}
                                />
                            </div>
                            <div className="pt-4 border-t border-dashed">
                                <Label htmlFor="openai-key" className="text-amber-700 font-medium flex items-center gap-2 mb-2">
                                    <Shield className="h-4 w-4" />
                                    Clé API OpenAI
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="openai-key"
                                        type="password"
                                        placeholder="sk-..."
                                        value={aiKeys.openaiApiKey}
                                        onChange={(e) => setAiKeys(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                                        className="font-mono text-xs"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2">
                                    Nécessaire pour faire fonctionner le chatbot. La clé est stockée de manière sécurisée.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
