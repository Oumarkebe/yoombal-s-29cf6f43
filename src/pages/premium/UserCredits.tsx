import React, { useState } from 'react';
import { useUserCredits } from '@/hooks/useUserCredits';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, History, Loader2, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PaymentDialog } from '@/components/PaymentDialog';

export default function UserCredits() {
  const { balance, transactions, isLoading, refetchCredits } = useUserCredits();
  const [rechargeAmount, setRechargeAmount] = useState<string>('5000');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleRechargeClick = () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) return;
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    refetchCredits();
  };

  const rechargePresets = ['1000', '2500', '5000', '10000', '25000', '50000'];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon Portefeuille</h1>
          <p className="text-muted-foreground">
            Rechargez vos crédits pour souscrire aux modules premium.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-primary/10 px-6 py-4 rounded-xl border border-primary/20">
          <Coins className="h-8 w-8 text-primary" />
          <div>
            <p className="text-xs font-bold uppercase text-primary/70">Solde Actuel</p>
            <p className="text-3xl font-black">{balance.toLocaleString()} FCFA</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Recharge Section */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Recharger
            </CardTitle>
            <CardDescription>Choisissez un montant pour recharger votre compte.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {rechargePresets.map((preset) => (
                <Button
                  key={preset}
                  variant={rechargeAmount === preset ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRechargeAmount(preset)}
                >
                  {parseInt(preset).toLocaleString()}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Montant personnalisé (FCFA)</Label>
              <Input
                id="amount"
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                placeholder="Ex: 5000"
              />
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex gap-3 text-xs text-amber-800">
              <Plus className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                <strong>Bonus Teranga:</strong> Obtenez +10% de crédits bonus pour toute recharge
                supérieure à 50,000 FCFA.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleRechargeClick}>
              Recharger via Orange Money / Wave
            </Button>
          </CardFooter>
        </Card>

        {/* Transactions Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historique des Transactions
            </CardTitle>
            <CardDescription>
              Suivez l'utilisation de vos crédits et vos rechargements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucune transaction pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {tx.amount > 0 ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {tx.amount > 0 ? '+' : ''}
                      {tx.amount.toLocaleString()} FCFA
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={parseFloat(rechargeAmount) || 0}
        description="Rechargement Portefeuille"
        type="credit_topup"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
