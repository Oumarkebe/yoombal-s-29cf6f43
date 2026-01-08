
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PredictionTargetSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id: string;
}

export const PredictionTargetSelect: React.FC<PredictionTargetSelectProps> = ({
  value,
  onChange,
  disabled,
  id,
}) => (
  <div>
    <Label htmlFor={id}>Cible de prédiction</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Choisir une cible" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ventes_futures">Ventes futures</SelectItem>
        <SelectItem value="demande_produit">Demande par produit</SelectItem>
        <SelectItem value="risque_de_churn">Risque de désabonnement client</SelectItem>
      </SelectContent>
    </Select>
    <p className="text-xs text-gray-500 mt-1">Définit ce que le module doit essayer de prédire.</p>
  </div>
);

