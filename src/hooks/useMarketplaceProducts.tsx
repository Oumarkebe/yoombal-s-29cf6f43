import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MarketplaceProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  status: 'active' | 'draft' | 'out_of_stock';
  created_at: string | null;
  merchant_id: string;
  category_id: string | null;
  bnpl_enabled: boolean | null;
  categories?: {
    name: string;
  } | null;
  profiles?: {
    business_name: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export type SortByOption = {
  field: 'created_at' | 'price';
  ascending: boolean;
};

const PRODUCTS_PER_PAGE = 8;

export const useMarketplaceProducts = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortByOption>({ field: 'created_at', ascending: false });
  const { toast } = useToast();

  const fetchProducts = async (loadMore = false) => {
    try {
      if (loadMore) {
        setIsFetchingMore(true);
      } else {
        setIsLoading(true);
        setPage(1); // Reset page on new filter/search
      }
      
      const from = loadMore ? page * PRODUCTS_PER_PAGE : 0;
      const to = from + PRODUCTS_PER_PAGE - 1;

      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `, { count: 'exact' })
        .eq('status', 'active')
        .gt('stock', 0)
        .order(sortBy.field, { ascending: sortBy.ascending })
        .range(from, to);

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data: productsData, error: productsError, count } = await query;

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      const merchantIds = productsData?.map(p => p.merchant_id) || [];
      let transformedProducts: MarketplaceProduct[] = [];

      if (merchantIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, business_name, first_name, last_name')
          .in('id', merchantIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        const profilesMap = new Map();
        profilesData?.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
        
        transformedProducts = (productsData || []).map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url,
          status: product.status as 'active' | 'draft' | 'out_of_stock',
          created_at: product.created_at,
          merchant_id: product.merchant_id,
          category_id: product.category_id,
          bnpl_enabled: product.bnpl_enabled,
          categories: product.categories,
          profiles: profilesMap.get(product.merchant_id) || null
        }));
      }
      
      setProducts(prev => loadMore ? [...prev, ...transformedProducts] : transformedProducts);
      setHasMore(count ? count > (loadMore ? products.length : 0) + transformedProducts.length : false);
      if(loadMore && transformedProducts.length > 0) {
        setPage(prev => prev + 1);
      }
      
    } catch (error) {
      console.error('Error fetching marketplace products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits du marketplace",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy]);

  const getMerchantName = (product: MarketplaceProduct) => {
    if (product.profiles?.business_name) {
      return product.profiles.business_name;
    }
    if (product.profiles?.first_name && product.profiles?.last_name) {
      return `${product.profiles.first_name} ${product.profiles.last_name}`;
    }
    return 'Marchand Yoombal';
  };

  const loadMoreProducts = () => {
    if (hasMore && !isFetchingMore && !isLoading) {
      fetchProducts(true);
    }
  };

  return {
    products,
    isLoading,
    isFetchingMore,
    hasMore,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    refreshProducts: () => fetchProducts(false),
    loadMoreProducts,
    getMerchantName
  };
};
