import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription, PremiumPlan } from '@/hooks/useSubscription';
import { PlanCard } from '@/components/subscription/PlanCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, ShieldCheck, Sparkles, Check, Globe, Zap, MessageSquare, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentDialog } from '@/components/PaymentDialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AnnualSavings, PlanComparator } from '@/components/premium';

export default function Subscriptions() {
    const navigate = useNavigate();
    const {
        plans,
        subscription,
        subscribe,
        isSubscribing,
        changePlan,
        isChanging,
        renew,
        isRenewing,
        globalFeatures,
        resolvedFeatures
    } = useSubscription();

    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PremiumPlan | null>(null);
    const [actionType, setActionType] = useState<'subscribe' | 'renew' | 'change' | 'module_purchase'>('subscribe');

    const handleSubscribe = async (plan: PremiumPlan & { isExpiringSoon?: boolean }) => {
        if (subscription?.plan_id === plan.id && plan.isExpiringSoon) {
            setSelectedPlan(plan);
            setActionType('renew');
            setPaymentOpen(true);
            return;
        }

        if (subscription && subscription.plan_id !== plan.id) {
            const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;
            if (price === 0) {
                if (window.confirm(`Confirmez-vous le passage au plan ${plan.name} ?`)) {
                    changePlan({ newPlanId: plan.id, applyProrata: true });
                }
                return;
            }
            setSelectedPlan(plan);
            setActionType('change');
            setPaymentOpen(true);
            return;
        }

        if (subscription && subscription.plan_id === plan.id) {
            toast.info("Votre abonnement est déjà actif");
            return;
        }

        const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;
        if (price === 0) {
            subscribe({ planId: plan.id, billingPeriod, paymentMethod: 'wallet', amount: 0, status: 'active' });
            return;
        }

        setSelectedPlan(plan);
        setActionType('subscribe');
        setPaymentOpen(true);
    };

    const handlePaymentSuccess = (method: 'orange_money' | 'wave', phoneNumber: string) => {
        if (!selectedPlan) return;
        const price = billingPeriod === 'monthly' ? selectedPlan.price_monthly : selectedPlan.price_yearly;
        const paymentMethodEnum = method === 'orange_money' ? 'mobile_money' : 'wallet';

        if (actionType === 'renew') {
            renew(price);
        } else if (actionType === 'change') {
            changePlan({ newPlanId: selectedPlan.id, applyProrata: true, paymentMethod: paymentMethodEnum, amount: price });
        } else if (actionType === 'module_purchase') {
            // Already handled in PaymentDialog onSuccess usually, 
            // but let's ensure consistency if we use a central handler
            toast.success("Module activé !");
        } else {
            subscribe({ planId: selectedPlan.id, billingPeriod, paymentMethod: paymentMethodEnum, amount: price, status: 'active' });
        }
        setPaymentOpen(false);
        setSelectedPlan(null);
    };

    const isLoading = isSubscribing || isChanging || isRenewing;

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-4 hover:bg-muted self-start">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                    </Button>

                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 py-1 animate-pulse">
                        <Sparkles className="h-3 w-3 mr-2 text-primary" />
                        OFFRES LIMITÉES
                    </Badge>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 max-w-4xl">
                        Équipez votre business de <span className="text-primary italic">super-pouvoirs</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Des outils de pointe basés sur l'IA pour automatiser vos ventes,
                        prédire vos stocks et fidéliser vos clients.
                    </p>

                    <div className="flex flex-col items-center pt-8 gap-4">
                        <Tabs
                            defaultValue="monthly"
                            className="bg-muted/50 p-1 rounded-full border border-muted"
                            onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'yearly')}
                        >
                            <TabsList className="bg-transparent h-12">
                                <TabsTrigger value="monthly" className="rounded-full px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">Mensuel</TabsTrigger>
                                <TabsTrigger value="yearly" className="rounded-full px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    Annuel <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">-20%</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                            Paiement sécurisé par Orange Money et Wave
                        </p>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {plans.map((plan) => (
                        <div key={plan.id} className="flex flex-col gap-4">
                            <PlanCard
                                plan={plan}
                                billingPeriod={billingPeriod}
                                isCurrent={subscription?.plan_id === plan.id}
                                onSubscribe={() => handleSubscribe(plan)}
                                isLoading={isLoading}
                            />
                            {billingPeriod === 'yearly' && <AnnualSavings plan={plan} />}
                        </div>
                    ))}
                </div>

                {/* Comparateur Section */}
                <PlanComparator />

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto border-t pt-16 mt-20">
                    <div className="text-center mb-10 space-y-2">
                        <div className="flex justify-center">
                            <HelpCircle className="h-8 w-8 text-primary/50" />
                        </div>
                        <h2 className="text-3xl font-black">Questions Fréquentes</h2>
                        <p className="text-muted-foreground">Tout ce que vous devez savoir sur nos offres.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-b-muted">
                            <AccordionTrigger className="hover:no-underline font-bold text-left">Quels sont les modes de paiement acceptés ?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Nous acceptons les paiements via Orange Money et Wave. C'est simple, rapide et sécurisé.
                                Vous recevrez une notification sur votre téléphone pour valider la transaction.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-b-muted">
                            <AccordionTrigger className="hover:no-underline font-bold text-left">Puis-je changer de plan en cours de mois ?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Oui ! Vous pouvez passer à un plan supérieur à tout moment. La différence de prix sera
                                calculée au prorata pour la période restante.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            {selectedPlan && (
                <PaymentDialog
                    open={paymentOpen}
                    onOpenChange={setPaymentOpen}
                    amount={billingPeriod === 'monthly' ? selectedPlan.price_monthly : selectedPlan.price_yearly}
                    onSuccess={handlePaymentSuccess}
                    title={actionType === 'renew' ? "Renouvellement" : "Finalisez votre abonnement"}
                />
            )}

            {isLoading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border flex items-center gap-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="font-bold">Traitement en cours...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
