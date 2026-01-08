
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PricingStrategySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id: string;
}

export const PricingStrategySelect: React.FC<PricingStrategySelectProps> = ({
  value,
  onChange,
  disabled,
  id,
}) => (
  <div>
    <Label htmlFor={id}>Stratégie de tarification</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Choisir une stratégie" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="concurrentiel">Concurrentiel</SelectItem>
        <SelectItem value="agressif">Agressif</SelectItem>
        <SelectItem value="conservateur">Conservateur</SelectItem>
      </SelectContent>
    </Select>
    <p className="text-xs text-gray-500 mt-1">Définit comment les prix sont ajustés dynamiquement.</p>
  </div>
);

