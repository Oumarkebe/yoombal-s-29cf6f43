
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert?: (text: string) => void;
}

const ContentGenerationModal: React.FC<ContentGenerationModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Veuillez entrer une description de base pour le produit.");
      return;
    }
    setIsLoading(true);
    setGeneratedText('');
    try {
      const { data, error } = await supabase.functions.invoke('content-generation', {
        body: { prompt },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedText(data.generated_text);
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de la génération de contenu", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    toast.success("Texte copié dans le presse-papiers !");
  };

  const handleInsert = () => {
    if (onInsert) {
      onInsert(generatedText);
      toast.success("Description insérée !");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Générateur de Description de Produit</DialogTitle>
          <DialogDescription>
            Décrivez brièvement votre produit (ex: "T-shirt rouge en coton pour homme"), et l'IA créera une description commerciale.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Description de base du produit</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: T-shirt rouge 100% coton, col rond, taille M"
              rows={3}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Générer la description
          </Button>
          {generatedText && (
            <div className="grid gap-2 pt-4">
                <Label htmlFor="result">Description générée</Label>
                <Textarea
                    id="result"
                    readOnly
                    value={generatedText}
                    rows={8}
                    className="bg-gray-100 dark:bg-gray-800"
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="w-fit">
                      Copier le texte
                  </Button>
                  {onInsert && (
                    <Button size="sm" onClick={handleInsert} className="w-fit">
                      Utiliser ce texte
                    </Button>
                  )}
                </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentGenerationModal;
