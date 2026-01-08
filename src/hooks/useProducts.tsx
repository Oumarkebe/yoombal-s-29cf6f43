
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: string | null;
  image_url: string | null;
  status: 'active' | 'draft' | 'out_of_stock';
  created_at: string;
  updated_at: string;
  merchant_id: string;
  categories?: {
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('merchant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion pour assurer la compatibilité avec notre interface Product
      const typedProducts = (data || []).map(product => ({
        ...product,
        status: product.status as 'active' | 'draft' | 'out_of_stock'
      }));
      
      setProducts(typedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'merchant_id'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          merchant_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Succès",
        description: "Produit créé avec succès",
      });

      return { data };
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le produit",
        variant: "destructive",
      });
      return { error: error.message };
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id);

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Succès",
        description: "Produit mis à jour avec succès",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
        variant: "destructive",
      });
      return { error: error.message };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Succès",
        description: "Produit supprimé avec succès",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
      return { error: error.message };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setIsLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    products,
    categories,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts
  };
};
