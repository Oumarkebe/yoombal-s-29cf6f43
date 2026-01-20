import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceProduct } from './useMarketplaceProducts';

export const useSponsoredProducts = () => {
  const [sponsoredProducts, setSponsoredProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSponsored = async () => {
    try {
      // Fetch active campaigns
      // Note: RLS allows public to view active campaigns
      const { data, error } = await (supabase as any)
        .from('ads_campaigns')
        .select(
          `
                    id,
                    product:products (
                        id,
                        name,
                        description,
                        price,
                        stock,
                        image_url,
                        status,
                        created_at,
                        merchant_id,
                        category_id,
                        bnpl_enabled
                    )
                `
        )
        .eq('status', 'active')
        .gt('end_date', new Date().toISOString()) // Not expired
        .lte('start_date', new Date().toISOString()) // Started
        .limit(4); // Limit to 4 for the "Featured" row

      if (error) throw error;

      if (data && data.length > 0) {
        // Need to fetch profile info for these merchants to be consistent with MarketplaceProduct type
        // Or we can just map what we have.
        // Let's assume we map what we have and maybe fetch profiles if needed,
        // but for "Featured" we might just show product info first.

        // However, we need to map the nested product to the flat structure or keep it nested.
        // The Marketplace expects MarketplaceProduct.

        const products = data.map((camp: any) => camp.product);

        // Fetch merchant profiles for these products
        const merchantIds = [...new Set(products.map((p: any) => p.merchant_id))] as string[];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, business_name')
          .in('id', merchantIds);

        const profilesMap = new Map();
        profiles?.forEach((p) => profilesMap.set(p.id, p));

        const mapped = products.map((p: any) => ({
          ...p,
          profiles: profilesMap.get(p.merchant_id) || null,
          // Ad specific tracking ID (Campaign ID) could be useful
          campaign_id: data.find((c: any) => c.product.id === p.id)?.id,
        }));

        setSponsoredProducts(mapped);
      } else {
        setSponsoredProducts([]);
      }
    } catch (e) {
      console.error('Error fetching sponsored', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsored();
  }, []);

  return { sponsoredProducts, loading };
};
