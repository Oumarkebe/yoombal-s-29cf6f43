import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProviderSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id: string;
}

export const ProviderSelect: React.FC<ProviderSelectProps> = ({
  value,
  onChange,
  disabled,
  id,
}) => (
  <div>
    <Label htmlFor={id}>Fournisseur IA</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Choisir un fournisseur" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="openai">OpenAI (gpt-4o-mini)</SelectItem>
        <SelectItem value="groq">Groq (Llama 3 8B)</SelectItem>
        <SelectItem value="perplexity">Perplexity (Sonar Small)</SelectItem>
        <SelectItem value="mistral">Mistral (Open Mistral 7B)</SelectItem>
        <SelectItem value="together">Together.ai (Llama 3 8B)</SelectItem>
      </SelectContent>
    </Select>
    <p className="text-xs text-gray-500 mt-1">Modifie le moteur utilisé par ce module.</p>
  </div>
);
