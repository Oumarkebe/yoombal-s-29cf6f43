import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ProductBNPLToggle from "./ProductBNPLToggle";
import ProductForm from './ProductForm';
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
} from "@/components/ui/alert-dialog";

const ProductManagement = () => {
  const { products, categories, isLoading, fetchProducts, deleteProduct, createProduct, updateProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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

  const handleFormSubmit = async (productData: any) => {
    try {
      if (selectedProduct) {
        // En mode modification
        await updateProduct(selectedProduct.id, productData);
        toast({
          title: "Succès",
          description: "Le produit a été mis à jour avec succès",
        });
      } else {
        // En mode création
        // S'assurer que le merchant_id est bien défini
        if (!user) throw new Error("Utilisateur non connecté");

        await createProduct({
          ...productData,
          merchant_id: user.id
        });
        toast({
          title: "Succès",
          description: "Le produit a été créé avec succès",
        });
      }
      setIsFormOpen(false);
      fetchProducts(); // Rafraîchir la liste
      return { data: true, error: null };
    } catch (error: any) {
      console.error("Error submitting product:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
      return { data: null, error };
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
        <Button onClick={handleCreateClick} className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      <div className="grid gap-6">
        {products.length === 0 ? (
          <Card className="p-12 text-center text-gray-500">
            <p>Aucun produit trouvé. Commencez par en ajouter un !</p>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="grid md:grid-cols-3 gap-6 p-6">
                <div className="md:col-span-1">
                  <img
                    src={product.image_url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md bg-gray-100"
                  />
                </div>
                <div className="md:col-span-1 space-y-2">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">ID: {product.id.substring(0, 8)}</p>
                  <p className="text-gray-600 line-clamp-2">
                    {product.description || 'Aucune description disponible.'}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {product.features?.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat('fr-SN', {
                        style: 'currency',
                        currency: 'XOF',
                      }).format(product.price)}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Stock:</span>
                      <span className={`font-medium ${product.stock < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                        {product.stock} unités
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Statut:</span>
                      <span className={`font-medium capitalize ${product.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                        {product.status}
                      </span>
                    </div>
                  </div>

                  <ProductBNPLToggle
                    productId={product.id}
                    productName={product.name}
                    currentBNPLStatus={product.bnpl_enabled || false}
                    onStatusChange={(newStatus) => {
                      console.log(`BNPL ${newStatus ? 'enabled' : 'disabled'} for ${product.name}`);
                    }}
                  />

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(product)} className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(product.id)} className="flex-1">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        categories={categories}
        product={selectedProduct}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible et retirera le produit de votre boutique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManagement;
