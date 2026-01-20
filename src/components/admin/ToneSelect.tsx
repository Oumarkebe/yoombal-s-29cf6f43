import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ToneSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id: string;
}

export const ToneSelect: React.FC<ToneSelectProps> = ({ value, onChange, disabled, id }) => (
  <div>
    <Label htmlFor={id}>Ton</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Choisir un ton" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="professionnel">Professionnel</SelectItem>
        <SelectItem value="amical">Amical</SelectItem>
        <SelectItem value="creatif">Créatif</SelectItem>
      </SelectContent>
    </Select>
    <p className="text-xs text-gray-500 mt-1">
      Définit le style d'écriture pour la génération de contenu.
    </p>
  </div>
);
