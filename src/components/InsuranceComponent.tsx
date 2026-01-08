
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, X, AlertTriangle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InsuranceOption {
  id: string;
  name: string;
  description: string;
  coverage: string[];
  price: number;
  maxCoverage: number;
}

const insuranceOptions: InsuranceOption[] = [
  {
    id: 'basic',
    name: 'Protection Basique',
    description: 'Couverture contre les pertes et dommages lors de la livraison',
    coverage: ['Perte du colis', 'Dommages physiques', 'Vol pendant transport'],
    price: 200, // CFA
    maxCoverage: 50000 // CFA
  },
  {
    id: 'premium',
    name: 'Protection Premium',
    description: 'Couverture étendue avec remplacement express',
    coverage: ['Toutes protections basiques', 'Remplacement express', 'Remboursement intégral', 'Support prioritaire'],
    price: 500, // CFA
    maxCoverage: 200000 // CFA
  }
];

interface InsuranceComponentProps {
  orderValue: number;
  onInsuranceSelect?: (option: InsuranceOption | null) => void;
}

export const InsuranceComponent: React.FC<InsuranceComponentProps> = ({ 
  orderValue, 
  onInsuranceSelect 
}) => {
  const [selectedInsurance, setSelectedInsurance] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInsuranceSelect = (option: InsuranceOption | null) => {
    setSelectedInsurance(option?.id || null);
    onInsuranceSelect?.(option);
    
    if (option) {
      toast({
        title: "Assurance ajoutée",
        description: `${option.name} ajoutée à votre commande`,
      });
    }
  };

  const getRecommendedInsurance = () => {
    if (orderValue > 100000) return insuranceOptions[1];
    if (orderValue > 25000) return insuranceOptions[0];
    return null;
  };

  const recommended = getRecommendedInsurance();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Assurance Livraison
        </CardTitle>
        <p className="text-sm text-gray-600">
          Protégez votre commande contre les pertes et dommages
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800">Valeur de votre commande</h4>
              <p className="text-2xl font-bold text-blue-900">
                {orderValue.toLocaleString()} CFA
              </p>
              {recommended && (
                <p className="text-sm text-blue-600 mt-1">
                  Nous recommandons la {recommended.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
               onClick={() => handleInsuranceSelect(null)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedInsurance === null ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                }`} />
                <div>
                  <h4 className="font-medium">Pas d'assurance</h4>
                  <p className="text-sm text-gray-600">Commande sans protection</p>
                </div>
              </div>
              <span className="font-bold text-green-600">Gratuit</span>
            </div>
          </div>

          {insuranceOptions.map((option) => (
            <div 
              key={option.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedInsurance === option.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              } ${recommended?.id === option.id ? 'ring-2 ring-blue-200' : ''}`}
              onClick={() => handleInsuranceSelect(option)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedInsurance === option.id ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{option.name}</h4>
                      {recommended?.id === option.id && (
                        <Badge variant="secondary" className="text-xs">Recommandé</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600">+{option.price} CFA</span>
                  <p className="text-xs text-gray-500">
                    Jusqu'à {option.maxCoverage.toLocaleString()} CFA
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                {option.coverage.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {orderValue > 200000 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Commande de valeur élevée</p>
                <p className="text-amber-700">
                  Pour les commandes supérieures à 200,000 CFA, nous recommandons fortement une assurance.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsuranceComponent;
