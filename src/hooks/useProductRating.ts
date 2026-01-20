import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useProductRating(productId: string) {
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);

    // Use the 'reviews' table which exists in the schema
    supabase
      .from('reviews')
      .select('rating', { count: 'exact', head: false })
      .eq('product_id', productId)
      .then(({ data, count, error }) => {
        if (error) {
          console.error('Error fetching product ratings:', error);
          setAverage(null);
          setCount(0);
        } else {
          setCount(count || 0);
          if (data && data.length) {
            const avg =
              data.reduce((s: number, r: { rating: number }) => s + (r.rating || 0), 0) /
              data.length;
            setAverage(Math.round(avg * 2) / 2);
          } else {
            setAverage(null);
          }
        }
        setLoading(false);
      });
  }, [productId]);

  return { average, count, loading };
}
