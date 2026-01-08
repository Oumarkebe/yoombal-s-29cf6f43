
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScoringCriteriaSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id: string;
}

export const ScoringCriteriaSelect: React.FC<ScoringCriteriaSelectProps> = ({
  value,
  onChange,
  disabled,
  id,
}) => (
  <div>
    <Label htmlFor={id}>Critères de notation</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Choisir les critères" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="complet">Approche complète</SelectItem>
        <SelectItem value="avis_clients">Avis clients</SelectItem>
        <SelectItem value="delai_livraison">Délai de livraison</SelectItem>
        <SelectItem value="qualite_produits">Qualité des produits</SelectItem>
      </SelectContent>
    </Select>
    <p className="text-xs text-gray-500 mt-1">Définit les facteurs pour évaluer les vendeurs.</p>
  </div>
);

