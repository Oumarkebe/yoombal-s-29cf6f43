
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModerationSensitivitySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id: string;
}

export const ModerationSensitivitySelect: React.FC<ModerationSensitivitySelectProps> = ({
  value,
  onChange,
  disabled,
  id,
}) => (
  <div>
    <Label htmlFor={id}>Niveau de sensibilité</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Choisir un niveau" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="faible">Faible</SelectItem>
        <SelectItem value="moyen">Moyen</SelectItem>
        <SelectItem value="eleve">Élevé</SelectItem>
      </SelectContent>
    </Select>
    <p className="text-xs text-gray-500 mt-1">Définit la sévérité du filtre de contenu.</p>
  </div>
);

