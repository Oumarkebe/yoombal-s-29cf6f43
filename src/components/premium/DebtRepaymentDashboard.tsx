
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { History, CreditCard, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';
import { PaymentDialog } from '@/components/PaymentDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function DebtRepaymentDashboard() {
    const { user } = useAuth();
    const { refetchCredits } = useUserCredits();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [amountToPay, setAmountToPay] = useState(0);

    // Simulated values - in production these would come from profile or dedicated table
    const creditLimit = 100000; // Default credit limit
    const currentDebt = 0; // Would come from a loans/debt table
    const availableCredit = Math.max(0, creditLimit - currentDebt);
    const progress = creditLimit > 0 ? (currentDebt / creditLimit) * 100 : 0;
    const kycStatus = 'pending'; // Would come from profile

    const handleRepayment = async (amount: number, method: 'orange_money' | 'wave') => {
        try {
            const { data, error } = await supabase.functions.invoke('create-payment-intent', {
                body: {
                    amount,
                    currency: 'FCFA',
                    provider: method,
                    phoneNumber: '770000000',
                    type: 'repayment',
                    metadata: {
                        userId: user?.id
                    }
                }
            });

            if (error) throw error;

            toast.success("Remboursement effectué avec succès !");
            refetchCredits();

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
            toast.error("Erreur de paiement: " + errorMessage);
        }
    };

    return (
        <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-purple-900 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        Mon Crédit BNPL
                    </CardTitle>
                    {kycStatus === 'verified' as string ? (
                        <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
                            Vérifié
                        </span>
                    ) : (
                        <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                            {kycStatus ? kycStatus.toUpperCase() : 'NON VERIFIÉ'}
                        </span>
                    )}
                </div>
                <CardDescription>Gérez votre ligne de crédit et vos remboursements.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Status & Limit */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">Dette utilisée</span>
                            <span className="font-semibold">{currentDebt.toLocaleString()} FCFA / {creditLimit.toLocaleString()} FCFA</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-slate-500">
                            Crédit disponible pour de nouveaux achats: <span className="font-bold text-slate-900">{availableCredit.toLocaleString()} FCFA</span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col justify-center space-y-3">
                        {currentDebt > 0 ? (
                            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => {
                                setAmountToPay(currentDebt);
                                setIsPaymentOpen(true);
                            }}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Rembourser ma dette
                            </Button>
                        ) : (
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Tout est en ordre</AlertTitle>
                                <AlertDescription className="text-green-700 text-xs">
                                    Vous n'avez aucune dette en cours. Profitez de votre shopping !
                                </AlertDescription>
                            </Alert>
                        )}
                        <Button variant="outline" className="w-full" onClick={() => toast.info('Historique détaillé bientôt disponible')}>
                            <History className="mr-2 h-4 w-4" />
                            Voir l'historique BNPL
                        </Button>
                    </div>
                </div>

                <PaymentDialog
                    isOpen={isPaymentOpen}
                    onClose={() => setIsPaymentOpen(false)}
                    amount={amountToPay}
                    description="Remboursement de dette BNPL"
                    type="credit_topup"
                    onSuccess={(method) => {
                        handleRepayment(amountToPay, method);
                        setIsPaymentOpen(false);
                    }}
                />
            </CardContent>
        </Card>
    );
}
