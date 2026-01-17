import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, CreditCard, RotateCw, Shield, AlertTriangle, CheckCircle2, Sparkles, Layers, History, ArrowUpRight } from 'lucide-react';
import DebtRepaymentDashboard from '@/components/premium/DebtRepaymentDashboard';
import { translateFeature } from '@/lib/subscription-features';
import { PremiumFeatureCard } from '@/components/premium';
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MySubscriptions() {
    const {
        subscription,
        currentPlan,
        isLoading,
        cancel,
        isCancelling,
        globalFeatures,
        purchasedModules,
        activateModule,
        deactivateModule,
        isProcessingModule
    } = useSubscription();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="container p-8 flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground animate-pulse">Chargement de votre univers Premium...</p>
            </div>
        );
    }

    const isPaidPlan = subscription && subscription.status === 'active';
    const planName = currentPlan?.name || 'Starter (Gratuit)';

    // Calculate days remaining
    const daysRemaining = subscription?.expires_at
        ? differenceInDays(new Date(subscription.expires_at), new Date())
        : null;

    // Filter features for individual display
    const individualFeatures = globalFeatures.filter(f => f.is_premium);

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <DebtRepaymentDashboard />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Mon Espace Premium
                    </h1>
                    <p className="text-muted-foreground">Pilotez vos outils de croissance Yoombal.</p>
                </div>
                <Button
                    onClick={() => navigate('/premium/subscriptions')}
                    className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                    variant="outline"
                >
                    <Layers className="h-4 w-4 mr-2" /> Explorer tous les plans
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    {/* 1. Main Plan Overview */}
                    <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/5">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <Sparkles className="h-48 w-48" />
                        </div>

                        <CardHeader className="pb-6 border-b bg-muted/30">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-black flex items-center gap-2">
                                        <Shield className={isPaidPlan ? "text-primary h-6 w-6" : "text-muted-foreground h-6 w-6"} />
                                        Plan {planName}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <CardDescription>
                                            {isPaidPlan ? "Votre moteur est à pleine puissance." : "Activez la vitesse supérieure."}
                                        </CardDescription>
                                        {daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0 && (
                                            <Badge variant="destructive" className="animate-pulse text-[10px] py-0 h-5">
                                                Expire dans {daysRemaining} jours
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Badge
                                    variant={isPaidPlan ? 'default' : 'secondary'}
                                    className={isPaidPlan ? "bg-gradient-to-r from-primary to-accent px-4 py-1 text-sm font-bold shadow-lg" : "px-4 py-1"}
                                >
                                    {isPaidPlan ? 'MODE PREMIUM' : 'VERSION GRATUITE'}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-8 grid gap-10 md:grid-cols-2">
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary" /> Détails de facturation
                                </h3>

                                {isPaidPlan ? (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-muted/50 border space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Cycle</span>
                                                <span className="font-bold uppercase tracking-wider text-xs">
                                                    {subscription?.billing_period === 'yearly' ? 'Annuel' : 'Mensuel'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground text-sm">Investissement</span>
                                                <span className="text-xl font-black text-primary">
                                                    {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(subscription?.amount_paid || 0)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-muted/30 border text-center space-y-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Échéance</p>
                                                <p className="font-bold text-sm">
                                                    {subscription?.expires_at ? format(new Date(subscription.expires_at), 'dd MMM yyyy', { locale: fr }) : '-'}
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-muted/30 border text-center space-y-1">
                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Renouvellement</p>
                                                <p className={subscription?.auto_renew ? "text-green-600 font-bold text-sm" : "text-orange-600 font-bold text-sm"}>
                                                    {subscription?.auto_renew ? 'AUTO' : 'MANUEL'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                                            <Layers className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold">Aucun abonnement actif</p>
                                            <p className="text-sm text-muted-foreground">Boostez votre business avec nos outils IA.</p>
                                        </div>
                                        <Button onClick={() => navigate('/premium/subscriptions')} size="sm">
                                            Voir les plans
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" /> Vos super-pouvoirs
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {currentPlan?.features?.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-green-50/50 border border-green-100 text-sm">
                                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                            <span className="font-medium">{translateFeature(feature)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20 border-t p-6">
                            {isPaidPlan ? (
                                <>
                                    <p className="text-xs text-muted-foreground">
                                        Vous pouvez gérer vos modes de paiement et annuler à tout moment sans frais.
                                    </p>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                            onClick={() => {
                                                if (window.confirm('Voulez-vous désactiver le renouvellement automatique ?')) {
                                                    cancel({ reason: 'User choice' });
                                                }
                                            }}
                                            disabled={isCancelling}
                                        >
                                            Désactiver le renouvellement
                                        </Button>
                                        <Button onClick={() => navigate('/premium/subscriptions')}>
                                            Changer de plan
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-100">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-amber-500 hover:bg-amber-600">OFFRE</Badge>
                                        <p className="text-sm font-medium text-amber-900">-20% sur l'abonnement annuel cette semaine !</p>
                                    </div>
                                    <Button size="sm" onClick={() => navigate('/premium/subscriptions')} className="bg-amber-600 hover:bg-amber-700">
                                        En profiter
                                    </Button>
                                </div>
                            )}
                        </CardFooter>
                    </Card>

                    {/* 2. Individual Modules Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black flex items-center gap-2">
                                    <Sparkles className="h-6 w-6 text-amber-500" /> Modules Individuels
                                </h2>
                                <p className="text-sm text-muted-foreground">Activez seulement les outils dont vous avez besoin.</p>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            {individualFeatures.map((feature) => (
                                <PremiumFeatureCard
                                    key={feature.id}
                                    feature={feature}
                                    isActive={purchasedModules.includes(feature.feature_key)}
                                    isLoading={isProcessingModule}
                                    onActivate={() => activateModule(feature.id)}
                                    onDeactivate={() => deactivateModule(feature.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Transaction History sidebar */}
                <div className="space-y-6">
                    <Card className="h-full border-none bg-muted/20">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                Historique
                            </CardTitle>
                            <CardDescription>Vos dernières activités premium.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[600px] pr-4">
                                <div className="space-y-6">
                                    {/* Mock History Items - In production fetch from subscription_audit_log */}
                                    {[
                                        { title: "Plan Pro Activé", date: new Date(), type: 'subscription', amount: 9900 },
                                        { title: "Module IA Assistant", date: new Date(Date.now() - 86400000), type: 'module', amount: 4900 },
                                        { title: "Paiement Annuel Wave", date: new Date(Date.now() - 172800000), type: 'payment', amount: 99000 },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3 relative pb-6 group">
                                            {i !== 2 && <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-muted group-last:hidden" />}
                                            <div className="mt-1 h-[24px] w-[24px] rounded-full bg-white border-2 border-primary flex items-center justify-center shrink-0 z-10 shadow-sm">
                                                <ArrowUpRight className="h-3 w-3 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold leading-none">{item.title}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                    {format(item.date, 'dd MMMM yyyy', { locale: fr })}
                                                </p>
                                                <p className="text-xs font-black text-primary">
                                                    +{item.amount.toLocaleString()} FCFA
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Total investi</p>
                                        <p className="text-xl font-black text-primary">113 800 FCFA</p>
                                    </div>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


