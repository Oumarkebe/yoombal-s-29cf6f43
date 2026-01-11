import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, BrainCircuit, TrendingUp, Save, Coins, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminAICenter() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Feature flags
    const [features, setFeatures] = useState({
        pricing: false,
        assistant: false,
        predictions: false
    });

    // Chatbot settings
    const [botSettings, setBotSettings] = useState({
        systemPrompt: "Tu es un assistant utile pour Yoombal.",
        tone: "professionnel"
    });

    // KPIs (Mock data for UI)
    const kpis = [
        { label: "Économies Générées", value: "1.2M FCFA", icon: Coins, color: "text-amber-600" },
        { label: "Suggestions Acceptées", value: "85%", icon: TrendingUp, color: "text-green-600" },
        { label: "Interactions Assistant", value: "1,240", icon: MessageSquare, color: "text-blue-600" }
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            // Fetch feature toggles from global platform settings or ai_module_settings
            const { data: modules, error } = await supabase.from('ai_module_settings').select('*');

            if (error) throw error;

            if (modules) {
                setFeatures({
                    pricing: modules.find(m => m.key === 'tarification_dynamique')?.is_enabled || false,
                    assistant: modules.find(m => m.key === 'assistant_intelligent')?.is_enabled || false,
                    predictions: modules.find(m => m.key === 'analyses_predictives')?.is_enabled || false
                });

                // Load bot settings from the assistant module config
                const assistantModule = modules.find(m => m.key === 'assistant_intelligent');
                if (assistantModule?.configuration) {
                    const config = assistantModule.configuration as any;
                    setBotSettings({
                        systemPrompt: config.system_prompt || "Tu es un assistant utile pour Yoombal.",
                        tone: config.tone || "professionnel"
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching AI settings:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les paramètres IA",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFeatureToggle = (key: keyof typeof features) => {
        setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            // Update modules
            const updates = [
                { key: 'tarification_dynamique', is_enabled: features.pricing },
                { key: 'assistant_intelligent', is_enabled: features.assistant, configuration: { system_prompt: botSettings.systemPrompt, tone: botSettings.tone } },
                { key: 'analyses_predictives', is_enabled: features.predictions }
            ];

            for (const update of updates) {
                const { error } = await supabase
                    .from('ai_module_settings')
                    .upsert({
                        key: update.key,
                        is_enabled: update.is_enabled,
                        configuration: update.configuration ? update.configuration : undefined,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'key' });

                if (error) throw error;
            }

            toast({
                title: "Succès",
                description: "Les paramètres IA ont été mis à jour",
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            toast({
                title: "Erreur",
                description: "Échec de la sauvegarde",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Centre Intelligence Artificielle</h1>
                    <p className="text-muted-foreground">Gérez les modules cognitifs et analysez les performances de l'IA.</p>
                </div>
                <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                </Button>
            </div>

            {/* KPI Section */}
            <div className="grid gap-4 md:grid-cols-3">
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
            </div>

            <Tabs defaultValue="modules" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="modules">Modules & Activation</TabsTrigger>
                    <TabsTrigger value="chatbot">Configuration Chatbot</TabsTrigger>
                </TabsList>

                <TabsContent value="modules" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Modules Cognitifs</CardTitle>
                            <CardDescription>Activez ou désactivez les fonctionnalités IA pour toute la plateforme.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-1">
                                    <Label htmlFor="pricing" className="text-base font-semibold flex items-center gap-2">
                                        <Coins className="h-4 w-4 text-amber-500" /> Tarification Dynamique
                                    </Label>
                                    <p className="text-sm text-muted-foreground">Ajuste automatiquement les prix en fonction de la demande et du stock.</p>
                                </div>
                                <Switch
                                    id="pricing"
                                    checked={features.pricing}
                                    onCheckedChange={() => handleFeatureToggle('pricing')}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-1">
                                    <Label htmlFor="assistant" className="text-base font-semibold flex items-center gap-2">
                                        <Bot className="h-4 w-4 text-blue-500" /> Assistant Intelligent (Yoombal Bot)
                                    </Label>
                                    <p className="text-sm text-muted-foreground">Support client automatisé et aide à la navigation.</p>
                                </div>
                                <Switch
                                    id="assistant"
                                    checked={features.assistant}
                                    onCheckedChange={() => handleFeatureToggle('assistant')}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-1">
                                    <Label htmlFor="predictions" className="text-base font-semibold flex items-center gap-2">
                                        <BrainCircuit className="h-4 w-4 text-purple-500" /> Analyses Prédictives
                                    </Label>
                                    <p className="text-sm text-muted-foreground">Prévisions des ventes et recommandations de stock.</p>
                                </div>
                                <Switch
                                    id="predictions"
                                    checked={features.predictions}
                                    onCheckedChange={() => handleFeatureToggle('predictions')}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="chatbot" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personnalisation du Bot</CardTitle>
                            <CardDescription>Définissez comment l'IA interagit avec vos utilisateurs.</CardDescription>
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
                                <p className="text-xs text-muted-foreground">C'est l'instruction "secrète" qui guide toutes les réponses de l'IA.</p>
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
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
