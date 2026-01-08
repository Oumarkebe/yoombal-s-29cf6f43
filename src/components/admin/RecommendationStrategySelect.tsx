
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RecommendationStrategySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id: string;
}

export const RecommendationStrategySelect: React.FC<RecommendationStrategySelectProps> = ({
  value,
  onChange,
  disabled,
  id,
}) => (
  <div>
    <Label htmlFor={id}>Stratégie de recommandation</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Choisir une stratégie" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="popular_products">Produits populaires</SelectItem>
        <SelectItem value="recent_purchases">Achats récents</SelectItem>
        <SelectItem value="similar_products">Produits similaires</SelectItem>
      </SelectContent>
    </Select>
    <p className="text-xs text-gray-500 mt-1">Définit comment les produits sont suggérés aux clients.</p>
  </div>
);

