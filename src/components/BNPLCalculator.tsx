import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, Calendar, CreditCard, AlertCircle } from 'lucide-react';

interface PaymentPlan {
  duration: number;
  monthlyPayment: number;
  totalAmount: number;
  fees: number;
}

interface BNPLCalculatorProps {
  initialAmount?: number;
  onApply?: () => void;
}

const BNPLCalculator: React.FC<BNPLCalculatorProps> = ({ initialAmount, onApply }) => {
  const [amount, setAmount] = useState<string>(initialAmount ? initialAmount.toString() : '');
  const [duration, setDuration] = useState<string>('3');
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const calculatePlans = (baseAmount: number) => {
    const plans = [
      { duration: 3, feeRate: 0.05 },
      { duration: 6, feeRate: 0.08 },
      { duration: 12, feeRate: 0.12 },
      { duration: 24, feeRate: 0.18 },
    ];

    return plans.map((plan) => {
      const fees = baseAmount * plan.feeRate;
      const totalAmount = baseAmount + fees;
      const monthlyPayment = totalAmount / plan.duration;

      return {
        duration: plan.duration,
        monthlyPayment,
        totalAmount,
        fees,
      };
    });
  };

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      const plans = calculatePlans(parseFloat(amount));
      setPaymentPlans(plans);
    } else {
      setPaymentPlans([]);
    }
  }, [amount]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const isEligible = (amount: number) => {
    return amount >= 5000 && amount <= 500000;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold">Calculateur BNPL</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Montant de l'achat (XOF)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Ex: 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="5000"
              max="500000"
            />
            {amount && !isEligible(parseFloat(amount)) && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Montant doit être entre 5 000 et 500 000 XOF</span>
              </div>
            )}
          </div>

          {paymentPlans.length > 0 && isEligible(parseFloat(amount)) && (
            <div className="space-y-4">
              <h4 className="font-medium">Plans de paiement disponibles :</h4>
              <div className="grid gap-4">
                {paymentPlans.map((plan, index) => (
                  <Card
                    key={plan.duration}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedPlan === index
                        ? 'border-amber-500 bg-amber-50'
                        : 'hover:border-amber-300'
                    }`}
                    onClick={() => setSelectedPlan(index)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-amber-600" />
                          <span className="font-medium">{plan.duration} mois</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(plan.monthlyPayment)}/mois
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-medium">{formatCurrency(plan.totalAmount)}</p>
                        <p className="text-sm text-gray-600">Frais: {formatCurrency(plan.fees)}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {selectedPlan !== null && (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <h5 className="font-medium mb-2">Récapitulatif du plan sélectionné :</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Montant initial :</span>
                      <span>{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durée :</span>
                      <span>{paymentPlans[selectedPlan].duration} mois</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paiement mensuel :</span>
                      <span className="font-medium">
                        {formatCurrency(paymentPlans[selectedPlan].monthlyPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de service :</span>
                      <span>{formatCurrency(paymentPlans[selectedPlan].fees)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total à payer :</span>
                      <span>{formatCurrency(paymentPlans[selectedPlan].totalAmount)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-600"
                    onClick={() => {
                      if (onApply) {
                        onApply();
                      } else {
                        window.location.href = '/marketplace';
                      }
                    }}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Demander ce plan BNPL
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Comment ça marche ?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Choisissez votre plan de paiement</li>
          <li>• Payez seulement le premier versement</li>
          <li>• Recevez vos produits immédiatement</li>
          <li>• Payez le reste en mensualités</li>
        </ul>
      </Card>
    </div>
  );
};

export default BNPLCalculator;
