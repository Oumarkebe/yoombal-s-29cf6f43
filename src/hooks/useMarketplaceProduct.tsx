import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceProduct } from './useMarketplaceProducts';

export const useMarketplaceProduct = (productId: string | undefined) => {
    const [product, setProduct] = useState<MarketplaceProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select(`
            *,
            categories (
              name
            )
          `)
                    .eq('id', productId)
                    .single();

                if (productError) throw productError;

                if (productData) {
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('id, business_name, first_name, last_name')
                        .eq('id', productData.merchant_id)
                        .single();

                    if (profileError) {
                        console.error('Error fetching merchant profile:', profileError);
                    }

                    const p = productData as any;
                    setProduct({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        stock: p.stock,
                        image_url: p.image_url,
                        status: p.status as any,
                        created_at: p.created_at,
                        merchant_id: p.merchant_id,
                        category_id: p.category_id,
                        bnpl_enabled: p.bnpl_enabled,
                        categories: p.categories,
                        profiles: profileData || null,
                        features: p.features || [],
                        specs: p.specs || {}
                    });
                }
            } catch (err: any) {
                console.error('Error in useMarketplaceProduct:', err);
                setError(err);
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return { product, isLoading, error };
};
