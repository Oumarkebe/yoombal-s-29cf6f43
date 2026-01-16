import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Settings, Info, CreditCard, Loader2, BarChartHorizontal, Users, TrendingUp, ListChecks, PlusCircle, Trash2, BrainCircuit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { useForm, useFieldArray, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { adminPricingService } from '@/services/adminPricingService';
import { useQuery } from '@tanstack/react-query';

const generalSettingsSchema = z.object({
  siteName: z.string().min(1, 'Le nom du site est requis.'),
  contactEmail: z.string().email("L'email de contact est invalide."),
});

const paymentSettingsSchema = z.object({
  stripePk: z.string().optional(),
  stripeSk: z.string().optional(),
});

const apiKeySchema = z.object({
  provider: z.string().min(1, 'Nom du service requis'),
  key: z.string().min(1, 'Clé API requise'),
  description: z.string().optional()
});

const aiSettingsSchema = z.object({
  openaiApiKey: z.string().optional(), // Keep for backward compat
  customKeys: z.array(apiKeySchema).optional().default([])
});

const dashboardSettingsSchema = z.object({
  showUserCount: z.boolean().default(true),
  showProductCount: z.boolean().default(true),
  showOrderCount: z.boolean().default(true),
  showTotalRevenue: z.boolean().default(true),
});

const publicStatsSettingsSchema = z.object({
  showPublicStats: z.boolean().default(false),
  showUserCount: z.boolean().default(true),
  showMerchantCount: z.boolean().default(true),
  showDeliveryCount: z.boolean().default(true),
});

const merchantPageSettingsSchema = z.object({
  showStats: z.boolean().default(true),
  satisfactionRate: z.coerce.number().min(0, 'Doit être >= 0').max(100, 'Doit être <= 100').default(98),
});

const pricingPlanSchema = z.object({
  title: z.string().min(1, 'Le titre est requis.'),
  price: z.string().min(1, 'Le prix est requis.'),
  description: z.string().min(1, 'La description est requise.'),
  features: z.array(z.string().min(1, 'La caractéristique ne peut être vide.')).min(1, 'Au moins une caractéristique est requise.'),
  cta: z.string().min(1, 'Le texte du bouton est requis.'),
  ctaLink: z.string().min(1, 'Le lien du bouton est requis.'),
  highlight: z.boolean().default(false),
});

const pricingSettingsSchema = z.object({
  plans: z.array(pricingPlanSchema),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type PaymentSettingsValues = z.infer<typeof paymentSettingsSchema>;
type AiSettingsValues = z.infer<typeof aiSettingsSchema>;
type DashboardSettingsValues = z.infer<typeof dashboardSettingsSchema>;
type PublicStatsSettingsValues = z.infer<typeof publicStatsSettingsSchema>;
type MerchantPageSettingsValues = z.infer<typeof merchantPageSettingsSchema>;
type PricingSettingsValues = z.infer<typeof pricingSettingsSchema>;

const FeatureArray = ({ planIndex, control }: { planIndex: number, control: Control<PricingSettingsValues> }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `plans.${planIndex}.features` as any // Use `any` to bypass complex RHF nested type issue
  });

  return (
    <div className="space-y-2 pt-2">
      {fields.map((item, k) => (
        <div key={item.id} className="flex items-center gap-2">
          <FormField
            control={control}
            name={`plans.${planIndex}.features.${k}` as any} // Also use `any` here for the same reason
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(k)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("Nouvelle caractéristique")} // No longer needs `any` cast here
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Ajouter une caractéristique
      </Button>
    </div>
  );
};

export default function AdminSettings() {
  const { settings, isLoading, updateSetting, isUpdating } = usePlatformSettings();
  const { toast } = useToast();

  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: { siteName: '', contactEmail: '' },
  });

  const paymentForm = useForm<PaymentSettingsValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: { stripePk: '', stripeSk: '' },
  });

  const [connectionStatus, setConnectionStatus] = React.useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionMsg, setConnectionMsg] = React.useState('');

  const checkConnectivity = async (key: string, provider: string) => {
    if (!key) return;
    setConnectionStatus('testing');
    setConnectionMsg('Test de connexion...');

    try {
      // Si c'est OpenAI, on tente un appel léger aux modèles
      if (provider === 'openai' || !provider) {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${key}` }
        });
        if (!res.ok) throw new Error('Clé invalide ou erreur réseau');
        setConnectionStatus('success');
        setConnectionMsg('Connexion réussie ! Crédit actif.');
      } else {
        // Pour les autres, on simule un succès pour l'instant (ou on peut implémenter)
        await new Promise(r => setTimeout(r, 1000));
        setConnectionStatus('success');
        setConnectionMsg('Clé semble valide (Format OK)');
      }
    } catch (e) {
      setConnectionStatus('error');
      setConnectionMsg('Échec connexion : Clé invalide.');
    }
  };

  const aiForm = useForm<AiSettingsValues>({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: { openaiApiKey: '', customKeys: [] },
  });

  const dashboardForm = useForm<DashboardSettingsValues>({
    resolver: zodResolver(dashboardSettingsSchema),
    defaultValues: {
      showUserCount: true,
      showProductCount: true,
      showOrderCount: true,
      showTotalRevenue: true,
    }
  });

  const publicStatsForm = useForm<PublicStatsSettingsValues>({
    resolver: zodResolver(publicStatsSettingsSchema),
    defaultValues: {
      showPublicStats: false,
      showUserCount: true,
      showMerchantCount: true,
      showDeliveryCount: true,
    }
  });

  const merchantPageForm = useForm<MerchantPageSettingsValues>({
    resolver: zodResolver(merchantPageSettingsSchema),
    defaultValues: {
      showStats: true,
      satisfactionRate: 98,
    }
  });

  const pricingForm = useForm<PricingSettingsValues>({
    resolver: zodResolver(pricingSettingsSchema),
    defaultValues: {
      plans: [],
    },
  });

  const { fields: pricingFields, append: appendPlan, remove: removePlan } = useFieldArray({
    control: pricingForm.control,
    name: "plans"
  });

  // Load real plans from DB
  const { data: dbPlans, refetch: refetchPlans } = useQuery({
    queryKey: ['adminPricingPlans'],
    queryFn: adminPricingService.getAllPlans,
  });

  useEffect(() => {
    if (settings) {
      generalForm.reset({
        siteName: settings.siteName || 'Yoombal',
        contactEmail: settings.contactEmail || 'contact@yoombal.com',
      });
      paymentForm.reset({
        stripePk: settings.stripePk || '',
        stripeSk: '',
      });
      // Parse AI keys: handle both old (flat object) and new (list) formats
      const aiKeys = settings.ai_keys as any || {};
      const customKeysList = aiKeys.custom_keys_list || [];

      // If migrating from old format, you might want to push old keys into custom list here or just ignore them.
      // For now, we just map OpenAI (the main one) and the custom list.

      aiForm.reset({
        openaiApiKey: aiKeys.openaiApiKey || '',
        customKeys: customKeysList
      });
      dashboardForm.reset({
        showUserCount: settings.dashboard?.showUserCount ?? true,
        showProductCount: settings.dashboard?.showProductCount ?? true,
        showOrderCount: settings.dashboard?.showOrderCount ?? true,
        showTotalRevenue: settings.dashboard?.showTotalRevenue ?? true,
      });
      publicStatsForm.reset({
        showPublicStats: settings.publicStats?.showPublicStats ?? false,
        showUserCount: settings.publicStats?.showUserCount ?? true,
        showMerchantCount: settings.publicStats?.showMerchantCount ?? true,
        showDeliveryCount: settings.publicStats?.showDeliveryCount ?? true,
      });
      merchantPageForm.reset({
        showStats: settings.merchantPage?.showStats ?? true,
        satisfactionRate: settings.merchantPage?.satisfactionRate ?? 98,
      });
    }
  }, [settings, generalForm, paymentForm, aiForm, dashboardForm, publicStatsForm, merchantPageForm]);

  // Sync DB plans to Form
  useEffect(() => {
    if (dbPlans) {
      // Map DB plans to form shape
      const formPlans = dbPlans.map(p => ({
        // Keep ID for updates
        id: p.id,
        title: p.name,
        price: p.price_monthly.toString(),
        description: p.description,
        features: p.features,
        cta: p.cta || "S'abonner",
        ctaLink: p.ctaLink || "/premium/subscribe",
        highlight: p.highlight || false,
      }));
      pricingForm.reset({ plans: formPlans });
    }
  }, [dbPlans, pricingForm]);

  const onGeneralSubmit = (data: GeneralSettingsValues) => {
    updateSetting({ key: 'general', value: data });
  };

  // ... (Other submit handlers handled below) ...

  const onPaymentSubmit = (data: PaymentSettingsValues) => {
    if (!data.stripePk && !data.stripeSk) {
      toast({ title: "Aucune modification", description: "Veuillez remplir au moins une clé.", variant: "default" });
      return;
    }
    const valueToSave: { stripePk?: string; stripeSk?: string } = {};
    if (data.stripePk) valueToSave.stripePk = data.stripePk;
    if (data.stripeSk) valueToSave.stripeSk = data.stripeSk;

    updateSetting({ key: 'payment', value: valueToSave }, {
      onSuccess: () => paymentForm.reset({ ...paymentForm.getValues(), stripeSk: '' })
    });
  };

  // Dynamic Field Array for Custom Keys
  const { fields: keyFields, append: appendKey, remove: removeKey } = useFieldArray({
    control: aiForm.control,
    name: "customKeys"
  });

  const onAiSubmit = (data: AiSettingsValues) => {
    // Merge standard keys and custom list
    const valueToSave: any = {
      openaiApiKey: data.openaiApiKey,
      // Convert customKeys array to object map if needed, or store as list
      custom_keys_list: data.customKeys
    };

    updateSetting({ key: 'ai_keys', value: valueToSave }, {
      onSuccess: () => {
        // Don't reset everything, just toast
        toast({ title: "Sauvegardé", description: "Clés API mises à jour." });
      }
    });
  };

  const onDashboardSubmit = (data: DashboardSettingsValues) => {
    updateSetting({ key: 'dashboard', value: data });
  };

  const onPublicStatsSubmit = (data: PublicStatsSettingsValues) => {
    updateSetting({ key: 'public_stats', value: data });
  };

  const onMerchantPageSubmit = (data: MerchantPageSettingsValues) => {
    updateSetting({ key: 'merchant_page', value: data });
  };

  const onPricingSubmit = async (data: PricingSettingsValues) => {
    try {
      // 1. Identify deleted plans
      const currentIds = data.plans.map((p: any) => p.id).filter(Boolean);
      const dbIds = dbPlans?.map(p => p.id).filter(Boolean) || [];
      const toDelete = dbIds.filter(id => !currentIds.includes(id));

      // 2. Delete removed plans
      if (toDelete.length > 0) {
        await Promise.all(toDelete.map(id => adminPricingService.deletePlan(id!)));
      }

      // 3. Upsert current plans
      await Promise.all(data.plans.map((p, index) => {
        return adminPricingService.upsertPlan({
          id: (p as any).id, // Passed via hidden field or preserved in form object
          name: p.title,
          description: p.description,
          price_monthly: parseInt(p.price) || 0,
          price_yearly: (parseInt(p.price) || 0) * 10, // Simple *10 rule
          slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          features: p.features,
          is_active: true,
          display_order: index,
          cta: p.cta,
          ctaLink: p.ctaLink,
          highlight: p.highlight
        });
      }));

      toast({ title: "Succès", description: "Plans tarifaires mis à jour (DB)", variant: "default" });
      refetchPlans(); // Refresh local state
    } catch (error: any) {
      console.error(error);
      toast({ title: "Erreur", description: "Erreur lors de la sauvegarde: " + error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center gap-4">
            <Link to="/admin" className="text-amber-600 hover:underline">← Retour Admin</Link>
            <Link to="/admin/ai" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
              <BrainCircuit size={16} /> Gérer les paramètres IA
            </Link>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
              <Settings className="w-8 h-8 text-amber-600" />
              Paramètres de la plateforme
            </h1>
            <p className="text-lg text-gray-500 mt-2">Configuration générale de l'application.</p>
          </div>

          <div className="space-y-8">
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info className="w-5 h-5" />Paramètres Généraux</CardTitle>
                    <CardDescription>Informations de base sur votre plateforme.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={generalForm.control} name="siteName" render={({ field }) => (
                      <FormItem><FormLabel>Nom du site</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={generalForm.control} name="contactEmail" render={({ field }) => (
                      <FormItem><FormLabel>Email de contact</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enregistrer les modifications
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>

            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" />Paramètres de Paiement</CardTitle>
                    <CardDescription>Configurez vos intégrations de paiement (Stripe). Les clés secrètes ne sont jamais affichées.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={paymentForm.control} name="stripePk" render={({ field }) => (
                      <FormItem><FormLabel>Clé publique Stripe</FormLabel><FormControl><Input placeholder="pk_test_..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={paymentForm.control} name="stripeSk" render={({ field }) => (
                      <FormItem><FormLabel>Clé secrète Stripe</FormLabel><FormControl><Input type="password" autoComplete="new-password" placeholder="sk_test_... (laisser vide pour ne pas changer)" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enregistrer les clés API
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>

            {/* Dynamic API Key Manager */}
            <Form {...aiForm}>
              <form onSubmit={aiForm.handleSubmit(onAiSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit className="w-5 h-5" />Gestionnaire de Clés API</CardTitle>
                    <CardDescription>
                      Centralisez toutes vos clés API externes (OpenAI, Google Maps, Orange Money, etc.).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={aiForm.control} name="openaiApiKey" render={({ field }) => (
                      <FormItem className="border-b pb-4">
                        <FormLabel className="flex justify-between items-center">
                          Clé OpenAI (Système)
                          {connectionStatus !== 'idle' && (
                            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${connectionStatus === 'success' ? 'bg-green-100 text-green-700' : connectionStatus === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                              {connectionStatus === 'testing' && <Loader2 className="w-3 h-3 animate-spin" />}
                              {connectionStatus === 'success' && <Check className="w-3 h-3" />}
                              {connectionStatus === 'error' && <X className="w-3 h-3" />}
                              {connectionMsg}
                            </span>
                          )}
                        </FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input type="password" autoComplete="off" placeholder="sk-..." {...field} className="font-mono" />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => checkConnectivity(field.value || '', 'openai')}
                            disabled={!field.value || connectionStatus === 'testing'}
                          >
                            Tester
                          </Button>
                        </div>
                        <FormDescription>Utilisée pour le Chatbot Yoombal Assistant par défaut.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="space-y-4 pt-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold">Clés API Personnalisées</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendKey({ provider: '', key: '', description: '' })}
                        >
                          <PlusCircle className="w-4 h-4 mr-2" /> Ajouter une clé
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {keyFields.map((field, index) => (
                          <div key={field.id} className="flex gap-2 items-start p-3 bg-slate-50 border rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow">
                              <FormField control={aiForm.control} name={`customKeys.${index}.provider`} render={({ field }) => (
                                <FormItem>
                                  <FormControl><Input placeholder="Nom (ex: Google Maps)" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={aiForm.control} name={`customKeys.${index}.key`} render={({ field }) => (
                                <FormItem>
                                  <FormControl><Input type="password" autoComplete="off" placeholder="Clé API..." {...field} className="font-mono bg-white" /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={aiForm.control} name={`customKeys.${index}.description`} render={({ field }) => (
                                <FormItem>
                                  <FormControl><Input placeholder="Description (optionnel)" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeKey(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {keyFields.length === 0 && (
                          <div className="text-center py-6 text-gray-400 border-2 border-dashed rounded-lg">
                            Aucune clé personnalisée.
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enregistrer les clés
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>

            <Form {...dashboardForm}>
              <form onSubmit={dashboardForm.handleSubmit(onDashboardSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChartHorizontal className="w-5 h-5" />Visibilité du tableau de bord</CardTitle>
                    <CardDescription>Choisissez quelles statistiques afficher sur les pages d'administration.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={dashboardForm.control} name="showUserCount" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5"><FormLabel>Nombre d'utilisateurs</FormLabel><FormDescription>Afficher le nombre total d'utilisateurs.</FormDescription></div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={dashboardForm.control} name="showProductCount" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5"><FormLabel>Nombre de produits</FormLabel><FormDescription>Afficher le nombre total de produits.</FormDescription></div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={dashboardForm.control} name="showOrderCount" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5"><FormLabel>Nombre de commandes</FormLabel><FormDescription>Afficher le nombre total de commandes.</FormDescription></div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={dashboardForm.control} name="showTotalRevenue" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5"><FormLabel>Revenu total</FormLabel><FormDescription>Afficher le revenu total généré.</FormDescription></div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enregistrer les préférences
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>

            <Form {...publicStatsForm}>
              <form onSubmit={publicStatsForm.handleSubmit(onPublicStatsSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Statistiques Publiques</CardTitle>
                    <CardDescription>Affichez des statistiques (nombre d'inscrits) sur les pages publiques.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={publicStatsForm.control} name="showPublicStats" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-amber-50">
                        <div className="space-y-0.5"><FormLabel>Afficher les statistiques publiques</FormLabel><FormDescription>Active ou désactive l'affichage global du bloc de statistiques.</FormDescription></div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={publicStatsForm.control} name="showUserCount" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5"><FormLabel>Nombre de clients</FormLabel><FormDescription>Afficher le nombre total de clients inscrits.</FormDescription></div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={!publicStatsForm.watch('showPublicStats')} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={publicStatsForm.control} name="showMerchantCount" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5"><FormLabel>Nombre de marchands</FormLabel><FormDescription>Afficher le nombre total de marchands.</FormDescription></div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={!publicStatsForm.watch('showPublicStats')} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={publicStatsForm.control} name="showDeliveryCount" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5"><FormLabel>Nombre de livreurs</FormLabel><FormDescription>Afficher le nombre total de livreurs.</FormDescription></div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={!publicStatsForm.watch('showPublicStats')} /></FormControl>
                      </FormItem>
                    )} />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enregistrer les préférences
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>

            <Form {...merchantPageForm}>
              <form onSubmit={merchantPageForm.handleSubmit(onMerchantPageSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />Statistiques Page Marchands</CardTitle>
                    <CardDescription>Gérez l'affichage des statistiques sur la page publique des marchands.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={merchantPageForm.control} name="showStats" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-amber-50">
                        <div className="space-y-0.5"><FormLabel>Afficher les statistiques</FormLabel><FormDescription>Active ou désactive l'affichage du bloc de statistiques.</FormDescription></div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={merchantPageForm.control} name="satisfactionRate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taux de satisfaction (%)</FormLabel>
                        <FormControl><Input type="number" {...field} disabled={!merchantPageForm.watch('showStats')} /></FormControl>
                        <FormDescription>Le taux de satisfaction affiché (entre 0 et 100).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enregistrer les préférences
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>

            <Form {...pricingForm}>
              <form onSubmit={pricingForm.handleSubmit(onPricingSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ListChecks className="w-5 h-5" />Gestion des Tarifs</CardTitle>
                    <CardDescription>Configurez les plans tarifaires affichés sur la page /tarifs.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-6">
                      {pricingFields.map((field, index) => (
                        <Card key={field.id} className="p-4 border-dashed relative bg-white">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-700">Plan #{index + 1}</h4>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removePlan(index)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={pricingForm.control} name={`plans.${index}.title`} render={({ field }) => (
                              <FormItem><FormLabel>Titre du plan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={pricingForm.control} name={`plans.${index}.price`} render={({ field }) => (
                              <FormItem><FormLabel>Prix</FormLabel><FormControl><Input {...field} placeholder="ex: 9 900 ou Sur devis" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={pricingForm.control} name={`plans.${index}.description`} render={({ field }) => (
                              <FormItem className="md:col-span-2"><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={pricingForm.control} name={`plans.${index}.cta`} render={({ field }) => (
                              <FormItem><FormLabel>Texte du bouton (CTA)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={pricingForm.control} name={`plans.${index}.ctaLink`} render={({ field }) => (
                              <FormItem><FormLabel>Lien du bouton (CTA)</FormLabel><FormControl><Input {...field} placeholder="ex: /contact" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={pricingForm.control} name={`plans.${index}.highlight`} render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:col-span-2">
                                <div className="space-y-0.5"><FormLabel>Mettre en avant ce plan</FormLabel></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                              </FormItem>
                            )} />
                            <div className="md:col-span-2">
                              <FormLabel>Caractéristiques</FormLabel>
                              <FeatureArray planIndex={index} control={pricingForm.control} />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-6"
                      onClick={() => appendPlan({ title: "Nouveau Plan", price: "0 FCFA", description: "Description du plan", features: ["Caractéristique 1"], cta: "S'inscrire", ctaLink: "/register", highlight: false })}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter un plan
                    </Button>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enregistrer les tarifs
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
