import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'en' | 'wo';

interface LanguageContextType {
  targetLanguage: Language | null;
  setTargetLanguage: (language: Language | null) => void;
  availableLanguages: { code: Language | null; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLanguages: { code: Language | null; name: string }[] = [
  { code: null, name: 'Français (Original)' },
  { code: 'en', name: 'English' },
  { code: 'wo', name: 'Wolof' },
];

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);

  const value = {
    targetLanguage,
    setTargetLanguage,
    availableLanguages,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
