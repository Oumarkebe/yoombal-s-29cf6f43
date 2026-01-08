import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useBNPLApplications } from '@/hooks/useBNPLApplications';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CreditCard, Calendar, Calculator, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BNPLApplicationFormProps {
  product: {
    id: string;
    name: string;
    price: number;
    merchant_id: string;
  };
  onSuccess?: () => void;
}

const BNPLApplicationForm: React.FC<BNPLApplicationFormProps> = ({ 
  product, 
  onSuccess 
}) => {
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createApplication } = useBNPLApplications();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Si l'utilisateur n'est pas authentifié, afficher un message d'invitation à s'inscrire
  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiement échelonné BNPL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="flex justify-center mb-4">
            <UserPlus className="h-16 w-16 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Créez un compte pour accéder au BNPL
          </h3>
          <p className="text-gray-600 mb-6">
            Le paiement échelonné est réservé aux membres inscrits. 
            Créez votre compte gratuitement pour profiter de cette fonctionnalité !
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/register">
                Créer un compte gratuitement
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/login">
                J'ai déjà un compte
              </Link>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Vous pouvez continuer vos achats sans compte, 
            mais le BNPL nécessite une inscription.
          </p>
        </CardContent>
      </Card>
    );
  }

  const calculatePayment = (duration: number) => {
    const principal = product.price;
    const feeRate = 0.05; // 5% de frais
    const totalFees = principal * feeRate;
    const totalAmount = principal + totalFees;
    const monthlyPayment = totalAmount / duration;
    const firstPayment = monthlyPayment * 0.2; // 20% d'acompte

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalFees: Math.round(totalFees),
      firstPayment: Math.round(firstPayment),
      totalAmount: Math.round(totalAmount)
    };
  };

  const durations = [
    { value: '3', label: '3 mois' },
    { value: '6', label: '6 mois' },
    { value: '12', label: '12 mois' }
  ];

  const selectedCalc = selectedDuration ? calculatePayment(parseInt(selectedDuration)) : null;

  const handleSubmit = async () => {
    if (!selectedDuration) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une durée de paiement",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const calc = calculatePayment(parseInt(selectedDuration));
    
    const result = await createApplication({
      product_id: product.id,
      merchant_id: product.merchant_id,
      requested_amount: product.price,
      plan_duration: parseInt(selectedDuration),
      monthly_payment: calc.monthlyPayment,
      fees_amount: calc.totalFees,
      first_payment_amount: calc.firstPayment
    });

    if (result.success) {
      toast({
        title: "Demande envoyée !",
        description: "Votre demande BNPL a été envoyée au marchand pour approbation.",
      });
      onSuccess?.();
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Erreur lors de l'envoi de la demande",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Demande de paiement BNPL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Produit : {product.name}</h4>
          <p className="text-2xl font-bold text-blue-600">
            {product.price.toLocaleString()} CFA
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Durée de paiement
          </label>
          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir la durée" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCalc && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Récapitulatif
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Prix du produit :</span>
                  <span>{product.price.toLocaleString()} CFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais BNPL (5%) :</span>
                  <span>{selectedCalc.totalFees.toLocaleString()} CFA</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Total à payer :</span>
                  <span>{selectedCalc.totalAmount.toLocaleString()} CFA</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Premier paiement :</span>
                  <span>{selectedCalc.firstPayment.toLocaleString()} CFA</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Paiement mensuel :</span>
                  <span>{selectedCalc.monthlyPayment.toLocaleString()} CFA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          onClick={handleSubmit} 
          disabled={!selectedDuration || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Demander ce plan BNPL'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BNPLApplicationForm;
