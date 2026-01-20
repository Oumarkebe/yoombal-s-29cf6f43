import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

async function translateText(text: string, targetLanguage: string) {
  console.log(`[translateText] Tentative de traduction de "${text}" vers ${targetLanguage}`);
  if (!text || !targetLanguage) {
    console.log('[translateText] Texte ou langue cible manquant. Annulation.');
    return text;
  }

  try {
    const { data, error } = await supabase.functions.invoke('translation', {
      body: { text, target_language: targetLanguage, source_language: 'fr' },
    });

    if (error) {
      console.error("Erreur d'invocation de la traduction:", error);
      toast.error("Erreur d'invocation de la traduction", {
        description: error.message,
        duration: 10000,
      });
      return text; // Retourne le texte original en cas d'erreur
    }

    if (data.error) {
      console.error("Erreur de l'API de traduction (fonction):", data.error);
      toast.error("Erreur de l'API de traduction", { description: data.error, duration: 10000 });
      return text; // Retourne le texte original en cas d'erreur de l'API
    }

    console.log(`[translateText] Traduction réussie de "${text}" en "${data.translated_text}"`);
    return data.translated_text;
  } catch (e: any) {
    console.error('Erreur critique dans translateText:', e);
    toast.error('Erreur critique de traduction', { description: e.message, duration: 10000 });
    return text;
  }
}

export const useTranslation = (text: string) => {
  const { targetLanguage } = useLanguage();

  const { data: translatedText, isLoading } = useQuery({
    queryKey: ['translation', text, targetLanguage],
    queryFn: () => translateText(text, targetLanguage!),
    enabled: !!targetLanguage && !!text,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    translatedText: translatedText || text,
    isLoading: !!targetLanguage && isLoading,
  };
};
