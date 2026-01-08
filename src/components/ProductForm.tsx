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
import { Sparkles } from 'lucide-react';
import { useUserAiFeature } from '@/hooks/useUserAiFeature';

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: '',
    image_url: '',
    status: 'active'
  });
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category_id: product.category_id || '',
        image_url: product.image_url || '',
        status: product.status || 'active'
      });
    } else {
        setFormData({
            name: '',
            description: '',
            price: 0,
            stock: 0,
            category_id: '',
            image_url: '',
            status: 'active'
        });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await onSubmit({
      ...formData,
      price: parseFloat(formData.price.toString()),
      stock: parseInt(formData.stock.toString())
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
        status: 'active'
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
                { !isLoadingFeatureSettings && isContentGenerationEnabled && (
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
                <Label htmlFor="price">Prix (XOF)</Label>
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
              <Label htmlFor="image_url">URL de l'image</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://..."
              />
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
