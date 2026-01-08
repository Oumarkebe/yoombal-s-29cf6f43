
import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from 'lucide-react';

export const FloatingLanguageSelector = () => {
  const { targetLanguage, setTargetLanguage, availableLanguages } = useLanguage();

  const handleValueChange = (value: string) => {
      setTargetLanguage(value === 'original' ? null : value as Language);
  };

  return (
    <div className="fixed bottom-5 right-20 z-50">
        <Select onValueChange={handleValueChange} value={targetLanguage === null ? 'original' : targetLanguage}>
          <SelectTrigger className="w-auto h-10 bg-background border shadow-lg rounded-full px-4 text-sm">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <span>{availableLanguages.find(l => l.code === targetLanguage)?.name.split(" ")[0] || "Langue"}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang.name} value={lang.code || 'original'}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
    </div>
  );
};
