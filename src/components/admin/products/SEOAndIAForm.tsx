import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Search, TrendingUp, Info, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SEOAndIAFormProps {
  formData: any;
  onChange: (data: any) => void;
}

export function SEOAndIAForm({ formData, onChange }: SEOAndIAFormProps) {
  const [seoScore, setSeoScore] = useState(0);
  const [generating, setGenerating] = useState(false);

  // Calculer le score SEO (Client-side logic)
  useEffect(() => {
    let score = 0;

    // Titre
    if (formData.seo_title) {
      if (formData.seo_title.length >= 30 && formData.seo_title.length <= 60) score += 30;
      else if (formData.seo_title.length > 5) score += 10;
    }

    // Description
    if (formData.seo_description) {
      if (formData.seo_description.length >= 120 && formData.seo_description.length <= 160)
        score += 30;
      else if (formData.seo_description.length > 20) score += 10;
    }

    // Tags
    if (formData.tags && formData.tags.length >= 3) score += 20;

    // Slug
    if (formData.slug && formData.slug.length > 3) score += 20;

    setSeoScore(score);
  }, [formData]);

  const generateSEOTitle = async () => {
    setGenerating(true);
    try {
      if (!formData.name) {
        toast.error("Veuillez d'abord saisir un nom de produit.");
        setGenerating(false);
        return;
      }

      const prompt = `Génère un titre SEO (max 60 caractères) et une meta-description (max 160 caractères) optimisés pour la vente pour ce produit : ${formData.name}. 
        Format attendu JSON : { "seo_title": "...", "seo_description": "..." }`;

      const { data, error } = await supabase.functions.invoke('content-generation', {
        body: { prompt },
      });

      if (error) throw error;

      // Parsing manuel si la fonction retourne du texte brut au lieu de JSON (dépend de l'implémentation de la fonction)
      let result = data;
      if (data.generated_text) {
        try {
          // Tentative d'extraction du JSON si l'IA a été verbeuse
          const jsonMatch = data.generated_text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.warn('Parsing JSON failed, using raw text fallback');
        }
      }

      const providerName = data.provider || 'IA';
      if (result.seo_title || result.seo_description) {
        onChange({
          ...formData,
          seo_title: result.seo_title || formData.seo_title,
          seo_description: result.seo_description || formData.seo_description,
        });
        toast.success(`SEO généré par ${providerName.toUpperCase()} !`);
      } else {
        // Fallback si l'IA n'a pas retourné le bon format
        onChange({
          ...formData,
          seo_description: data.generated_text || formData.seo_description,
        });
        toast.success(`Description générée par ${providerName.toUpperCase()} (Format libre)`);
      }
    } catch (error: any) {
      console.error('Erreur génération SEO:', error);
      toast.error(`Erreur: ${error.message || 'Échec génération'}`);
    } finally {
      setGenerating(false);
    }
  };

  const generateSlug = () => {
    if (!formData.name) return;
    const slug = formData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    onChange({ ...formData, slug });
  };

  const getSeoScoreColor = () => {
    if (seoScore >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (seoScore >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Score SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Optimisation Moteur de Recherche (SEO)
            </span>
            <Badge
              variant="outline"
              className={`px-3 py-1 text-sm font-semibold border ${getSeoScoreColor()}`}
            >
              Score: {seoScore}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="seo-title">Titre Meta (Google)</Label>
              <span
                className={`text-xs ${formData.seo_title?.length > 60 ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                {formData.seo_title?.length || 0}/60 caractères
              </span>
            </div>
            <Input
              id="seo-title"
              value={formData.seo_title || ''}
              onChange={(e) => onChange({ ...formData, seo_title: e.target.value })}
              placeholder="Titre qui apparaîtra sur Google"
            />
            <p className="text-xs text-muted-foreground flex gap-1 items-center">
              <Info className="h-3 w-3" /> Idéal entre 50 et 60 caractères.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="seo-description">Meta Description</Label>
              <span
                className={`text-xs ${formData.seo_description?.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                {formData.seo_description?.length || 0}/160 caractères
              </span>
            </div>
            <Textarea
              id="seo-description"
              value={formData.seo_description || ''}
              onChange={(e) => onChange({ ...formData, seo_description: e.target.value })}
              placeholder="Résumé attractif pour inciter au clic..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center px-3 border rounded-md bg-muted text-muted-foreground overflow-hidden whitespace-nowrap">
                <span className="text-xs">yoombal.com/produit/</span>
                <input
                  className="bg-transparent border-none outline-none text-foreground flex-1 ml-1"
                  value={formData.slug || ''}
                  onChange={(e) => onChange({ ...formData, slug: e.target.value })}
                  placeholder="mon-produit"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateSlug}
                title="Générer depuis le nom"
              >
                Auto
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={generateSEOTitle}
            disabled={generating || !formData.name}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {generating ? 'Optimisation en cours...' : "Optimiser le SEO avec l'IA"}
          </Button>
        </CardContent>
      </Card>

      {/* Intelligence Artificielle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Paramètres I.A. Yoombal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Optimisation automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Laissez l'IA mettre à jour la description périodiquement pour améliorer la
                  conversion.
                </p>
              </div>
              <Switch
                checked={formData.ai_description}
                onCheckedChange={(checked) => onChange({ ...formData, ai_description: checked })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Stratégie de Prix Dynamique (IA)</Label>
            <Select
              value={formData.ai_pricing_strategy || 'balanced'}
              onValueChange={(value: any) => onChange({ ...formData, ai_pricing_strategy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aggressive">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 transform rotate-180" />
                    {/* Rotate to show down? Or up for sales? Let's assume Aggressive means low price, high volume */}
                    <div>
                      <span className="font-semibold text-green-700">Agressive</span>
                      <span className="ml-2 text-xs text-gray-500">
                        - Maximiser le volume (Marge faible)
                      </span>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="balanced">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div>
                      <span className="font-semibold text-blue-700">Équilibrée</span>
                      <span className="ml-2 text-xs text-gray-500">- Compromis volume/marge</span>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="premium">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-purple-500" />
                    <div>
                      <span className="font-semibold text-purple-700">Premium</span>
                      <span className="ml-2 text-xs text-gray-500">
                        - Maximiser la marge (Luxe/Rare)
                      </span>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              L'IA ajustera le prix suggéré dans une fourchette de +/- 10% selon la demande.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
