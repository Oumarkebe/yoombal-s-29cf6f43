import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ProductBNPLToggle from './ProductBNPLToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ProductFormUltimate } from './admin/ProductFormUltimate';
import { ProductFormData } from '@/types/product';
import { useProducts, Product, Category } from '@/hooks/useProducts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ProductManagement = () => {
  const {
    products,
    categories,
    isLoading,
    deleteProduct,
    createProduct,
    updateProduct,
    refreshProducts,
  } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { user } = useAuth();

  const toggleExpanded = (productId: string) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleCreateClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleFormSubmit = async (productData: ProductFormData) => {
    try {
      if (selectedProduct) {
        // En mode modification
        // Filtrage des champs non-Product
        const { new_tags, gallery_files, ...dbData } = productData as any;
        await updateProduct(selectedProduct.id, dbData);
        toast({
          title: 'Succès',
          description: 'Le produit a été mis à jour avec succès',
        });
      } else {
        // En mode création
        if (!user) throw new Error('Utilisateur non connecté');

        const { new_tags, gallery_files, ...dbData } = productData as any;
        await createProduct({
          ...dbData,
          merchant_id: user.id,
        });
        toast({
          title: 'Succès',
          description: 'Le produit a été créé avec succès',
        });
      }
      setIsFormOpen(false);
      refreshProducts(); // Rafraîchir la liste
    } catch (error: any) {
      console.error('Error submitting product:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gérer les produits</h2>
        <div className="flex flex-col items-end gap-2">
          <Button
            onClick={handleCreateClick}
            disabled={user?.kyc_status !== 'verified'}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
          {user?.kyc_status !== 'verified' && (
            <p className="text-xs text-amber-600 flex items-center gap-1 font-medium bg-amber-50 px-2 py-1 rounded border border-amber-100">
              <AlertTriangle className="h-3 w-3" />
              KYC Vérifié requis pour vendre
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <Card className="p-12 text-center text-gray-500">
            <p>Aucun produit trouvé. Commencez par en ajouter un !</p>
          </Card>
        ) : (
          products.map((product, index) => {
            const isExpanded = expandedProducts.has(product.id);
            const gradients = [
              'from-blue-500 to-indigo-600',
              'from-purple-500 to-pink-600',
              'from-green-500 to-teal-600',
              'from-orange-500 to-red-600',
              'from-cyan-500 to-blue-600',
            ];
            const gradient = gradients[index % gradients.length];

            return (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200"
              >
                {/* Header - Always Visible */}
                <div
                  className={`bg-gradient-to-r ${gradient} p-4 cursor-pointer`}
                  onClick={() => toggleExpanded(product.id)}
                >
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={product.image_url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{product.name}</h3>
                        <p className="text-sm opacity-90">
                          {new Intl.NumberFormat('fr-SN', {
                            style: 'currency',
                            currency: 'XOF',
                          }).format(product.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Stock: {product.stock}</p>
                        <p className="text-xs opacity-90 capitalize">{product.status}</p>
                      </div>
                      <div
                        className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="bg-white p-6 border-t-4 border-gray-100 animate-in slide-in-from-top duration-300">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Image & Description */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                          <p className="text-gray-600">
                            {product.description || 'Aucune description disponible.'}
                          </p>
                        </div>

                        {product.features && product.features.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Avantages</h4>
                            <div className="flex flex-wrap gap-2">
                              {product.features.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className={`text-xs bg-gradient-to-r ${gradient} text-white px-3 py-1 rounded-full shadow-sm`}
                                >
                                  ✓ {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {product.specs && Object.keys(product.specs).length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Spécifications
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                  <span className="font-medium text-gray-700">{key}:</span>{' '}
                                  <span className="text-gray-600">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions & Info */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Informations</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Prix:</span>
                              <span className="font-bold text-green-600">
                                {new Intl.NumberFormat('fr-SN', {
                                  style: 'currency',
                                  currency: 'XOF',
                                }).format(product.price)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Stock:</span>
                              <span
                                className={`font-medium ${product.stock < 10 ? 'text-orange-600' : 'text-green-600'}`}
                              >
                                {product.stock} unités
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">ID:</span>
                              <span className="font-mono text-xs text-gray-500">
                                {product.id.substring(0, 8)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <ProductBNPLToggle
                          productId={product.id}
                          productName={product.name}
                          currentBNPLStatus={(product as any).bnpl_enabled || false}
                          onStatusChange={(newStatus) => {
                            console.log(
                              `BNPL ${newStatus ? 'enabled' : 'disabled'} for ${product.name}`
                            );
                          }}
                        />

                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEditClick(product)}
                            className="w-full border-2 hover:border-blue-500 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteClick(product.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-full sm:max-w-4xl overflow-y-auto p-0" side="right">
          <div className="h-full flex flex-col">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle>
                {selectedProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </SheetTitle>
              <SheetDescription>
                {selectedProduct
                  ? 'Modifiez les informations ci-dessous.'
                  : 'Remplissez le formulaire pour créer un nouveau produit.'}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <ProductFormUltimate
                initialData={selectedProduct || undefined}
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible et
              retirera le produit de votre boutique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManagement;
