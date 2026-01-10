import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Product, Category } from '@/hooks/useProducts';
import ContentGenerationModal from './ContentGenerationModal';
import { Sparkles, Loader2 } from 'lucide-react';
import { useUserAiFeature } from '@/hooks/useUserAiFeature';
import { ImageQC } from './ai/ImageQC';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: any) => Promise<any>;
  categories: Category[];
  product?: Product | null;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  product,
  isLoading = false
}) => {
  const { isEnabled: isContentGenerationEnabled, isLoading: isLoadingFeatureSettings } = useUserAiFeature('content_generation');
  const { isEnabled: isPricingEnabled } = useUserAiFeature('pricing');
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: '',
    image_url: '',
    status: 'active',
    features: [] as string[],
    specs: {} as Record<string, any>
  });
  const [featuresInput, setFeaturesInput] = useState('');
  const [specsInput, setSpecsInput] = useState<Array<{ key: string, value: string }>>([]);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  useEffect(() => {
    if (product) {
      const features = product.features || [];
      const specs = product.specs || {};
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category_id: product.category_id || '',
        image_url: product.image_url || '',
        status: product.status || 'active',
        features,
        specs
      });
      setFeaturesInput(features.join(', '));
      setSpecsInput(Object.entries(specs).map(([key, value]) => ({ key, value: String(value) })));
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: '',
        image_url: '',
        status: 'active',
        features: [],
        specs: {}
      });
      setFeaturesInput('');
      setSpecsInput([]);
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert features input to array
    const features = featuresInput.split(',').map(f => f.trim()).filter(f => f.length > 0);

    // Convert specs input to object
    const specs = specsInput.reduce((acc, { key, value }) => {
      if (key.trim()) {
        acc[key.trim()] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const result = await onSubmit({
      ...formData,
      price: parseFloat(formData.price.toString()),
      stock: parseInt(formData.stock.toString()),
      features,
      specs
    });

    if (result && !result.error) {
      onClose();
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: '',
        image_url: '',
        status: 'active',
        features: [],
        specs: {}
      });
      setFeaturesInput('');
      setSpecsInput([]);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAiPricing = async () => {
    if (!isPricingEnabled) {
      toast.info("Le pricing dynamique est une fonctionnalité Premium !");
      return;
    }

    if (!formData.name) {
      toast.error("Veuillez d'abord saisir le nom du produit.");
      return;
    }

    setIsPricingLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-pricing', {
        body: { productData: formData }
      });

      if (error) throw error;

      if (data?.suggested_price) {
        handleChange('price', data.suggested_price);
        toast.success(`Prix optimisé par l'IA : ${data.suggested_price} CFA`);
        if (data.logic) toast.info(data.logic, { icon: '💡' });
      }
    } catch (error) {
      console.error('AI Pricing error:', error);
      toast.error("Erreur lors du calcul du prix IA.");
    } finally {
      setIsPricingLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {product ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="description">Description</Label>
                {!isLoadingFeatureSettings && isContentGenerationEnabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsGeneratorOpen(true)}
                    className="flex items-center gap-1 text-primary hover:text-primary"
                  >
                    <Sparkles className="h-4 w-4" />
                    Générer avec l'IA
                  </Button>
                )}
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="price">Prix (XOF)</Label>
                  {isPricingEnabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAiPricing}
                      disabled={isPricingLoading}
                      className="h-6 text-[10px] text-amber-600 hover:text-amber-700 p-0 px-1"
                    >
                      {isPricingLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
                      Optimiser IA
                    </Button>
                  )}
                </div>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                value={formData.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="image_url">URL de l'image (ou lien de test)</Label>
              <div className="flex gap-2">
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
              </div>
              {formData.image_url && (
                <ImageQC
                  imageUrl={formData.image_url}
                />
              )}
            </div>

            <div>
              <Label htmlFor="features">Avantages du produit</Label>
              <Input
                id="features"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="Livraison gratuite, Garantie 2 ans, Échange 30 jours (séparés par des virgules)"
              />
              <p className="text-xs text-gray-500 mt-1">Séparez chaque avantage par une virgule</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Caractéristiques techniques</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSpecsInput([...specsInput, { key: '', value: '' }])}
                >
                  + Ajouter
                </Button>
              </div>
              {specsInput.map((spec, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                  <Input
                    placeholder="Nom (ex: Marque)"
                    value={spec.key}
                    onChange={(e) => {
                      const newSpecs = [...specsInput];
                      newSpecs[index].key = e.target.value;
                      setSpecsInput(newSpecs);
                    }}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Valeur (ex: Samsung)"
                      value={spec.value}
                      onChange={(e) => {
                        const newSpecs = [...specsInput];
                        newSpecs[index].value = e.target.value;
                        setSpecsInput(newSpecs);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSpecsInput(specsInput.filter((_, i) => i !== index))}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="active">Actif</option>
                <option value="draft">Brouillon</option>
                <option value="out_of_stock">Rupture de stock</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
              >
                {isLoading ? 'En cours...' : (product ? 'Modifier' : 'Créer')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ContentGenerationModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onInsert={(text) => handleChange('description', text)}
      />
    </>
  );
};

export default ProductForm;
