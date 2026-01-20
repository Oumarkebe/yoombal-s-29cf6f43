import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LogisticsStrategySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id: string;
}

export const LogisticsStrategySelect: React.FC<LogisticsStrategySelectProps> = ({
  value,
  onChange,
  disabled,
  id,
}) => (
  <div>
    <Label htmlFor={id}>Stratégie d'optimisation</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Choisir une stratégie" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="itineraire_rapide">Itinéraire le plus rapide</SelectItem>
        <SelectItem value="cout_reduit">Coût le plus réduit</SelectItem>
        <SelectItem value="equilibre">Équilibré (temps/coût)</SelectItem>
      </SelectContent>
    </Select>
    <p className="text-xs text-gray-500 mt-1">
      Définit la priorité pour l'optimisation des livraisons.
    </p>
  </div>
);
