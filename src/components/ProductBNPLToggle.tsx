
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Info } from 'lucide-react';

interface ProductBNPLToggleProps {
  productId: string;
  productName: string;
  currentBNPLStatus: boolean;
  onStatusChange?: (newStatus: boolean) => void;
}

const ProductBNPLToggle: React.FC<ProductBNPLToggleProps> = ({
  productId,
  productName,
  currentBNPLStatus,
  onStatusChange
}) => {
  const [isEnabled, setIsEnabled] = useState(currentBNPLStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleToggle = async (enabled: boolean) => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ bnpl_enabled: enabled })
        .eq('id', productId);

      if (error) throw error;

      setIsEnabled(enabled);
      onStatusChange?.(enabled);
      
      toast({
        title: enabled ? "BNPL activé" : "BNPL désactivé",
        description: `Le paiement échelonné a été ${enabled ? 'activé' : 'désactivé'} pour ${productName}`,
      });
    } catch (error) {
      console.error('Error updating BNPL status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut BNPL",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Paiement Échelonné (BNPL)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor={`bnpl-${productId}`} className="text-base font-medium">
              Autoriser le paiement échelonné
            </Label>
            <p className="text-sm text-gray-600">
              Les clients pourront demander un paiement en plusieurs fois pour ce produit
            </p>
          </div>
          
          <Switch
            id={`bnpl-${productId}`}
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-900">Comment ça marche :</p>
              <ul className="text-blue-800 space-y-1 list-disc list-inside ml-2">
                <li>Les clients peuvent demander un paiement en 3, 6 ou 12 mois</li>
                <li>Vous recevez les demandes et pouvez les approuver ou refuser</li>
                <li>Des frais de 5% sont automatiquement calculés</li>
                <li>Le client paie 20% d'acompte puis des mensualités</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductBNPLToggle;
