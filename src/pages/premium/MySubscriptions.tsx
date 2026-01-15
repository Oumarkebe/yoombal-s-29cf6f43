import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, CreditCard, RotateCw, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import DebtRepaymentDashboard from '@/components/premium/DebtRepaymentDashboard';
import { translateFeature } from '@/lib/subscription-features';

export default function MySubscriptions() {
    const { subscription, currentPlan, isLoading, cancel, isCancelling } = useSubscription();
    const navigate = useNavigate();

    if (isLoading) {
        return <div className="container p-8 text-center text-muted-foreground">Chargement...</div>;
    }

    const isPaidPlan = subscription && subscription.status === 'active';
    const planName = currentPlan?.name || 'Starter (Gratuit)';

    return (
        <div className="container mx-auto p-6 space-y-8">
            <DebtRepaymentDashboard />

            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mon Abonnement</h1>
                <p className="text-muted-foreground">Gérez votre formule et votre facturation.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Current Plan Card */}
                <Card className="md:col-span-2">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">Plan Actuel</CardTitle>
                                <CardDescription>Vous êtes actuellement abonné à</CardDescription>
                            </div>
                            <Badge variant={isPaidPlan ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                                {isPaidPlan ? 'PREMIUM' : 'GRATUIT'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isPaidPlan ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                    <Shield className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{planName}</h3>
                                    {isPaidPlan ? (
                                        <p className="text-sm text-muted-foreground">
                                            {subscription?.billing_period === 'yearly' ? 'Facturation annuelle' : 'Facturation mensuelle'}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Accès limité aux fonctionnalités de base</p>
                                    )}
                                </div>
                            </div>

                            {isPaidPlan && (
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-sm py-2 border-b">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" /> Montant
                                        </span>
                                        <span className="font-medium">
                                            {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(subscription?.amount_paid || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2 border-b">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Prochaine échéance
                                        </span>
                                        <span className="font-medium">
                                            {subscription?.expires_at ? format(new Date(subscription.expires_at), 'dd MMMM yyyy', { locale: fr }) : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <RotateCw className="h-4 w-4" /> Renouvellement auto
                                        </span>
                                        <Badge variant={subscription?.auto_renew ? "outline" : "destructive"}>
                                            {subscription?.auto_renew ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                            <h4 className="font-semibold text-sm uppercase text-muted-foreground">Fonctionnalités incluses</h4>
                            <ul className="space-y-2">
                                {currentPlan?.features?.slice(0, 5).map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                        <span>{translateFeature(feature)}</span>
                                    </li>
                                ))}
                                {(currentPlan?.features?.length || 0) > 5 && (
                                    <li className="text-sm text-muted-foreground pl-6">
                                        + {(currentPlan?.features?.length || 0) - 5} autres avantages
                                    </li>
                                )}
                            </ul>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-6">
                        {isPaidPlan ? (
                            <>
                                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                        if (window.confirm('Voulez-vous vraiment annuler le renouvellement ?')) {
                                            cancel({ reason: 'User choice' });
                                        }
                                    }}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? 'Annulation...' : 'Annuler l\'abonnement'}
                                </Button>
                                <Button onClick={() => navigate('/premium/subscriptions')}>
                                    Changer de plan
                                </Button>
                            </>
                        ) : (
                            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    Passez Pro pour débloquer plus de puissance
                                </p>
                                <Button onClick={() => navigate('/premium/subscriptions')} className="w-full sm:w-auto">
                                    Voir les offres Premium
                                </Button>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
