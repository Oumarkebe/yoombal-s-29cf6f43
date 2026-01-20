import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  photos?: string[];
  helpful_count?: number;
  is_verified_purchase?: boolean;
}

export function useProductReviews(productId: string | undefined) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [myReview, setMyReview] = useState<Review | null>(null);

  // Récupérer tous les avis du produit - using 'reviews' table from schema
  const fetchReviews = useCallback(async () => {
    if (!productId) return [];
    setIsLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      setError('Erreur lors de la récupération des avis.');
      setReviews([]);
    } else {
      setError(null);
      const typedData = (data || []) as Review[];
      setReviews(typedData);
      if (user) {
        const mine = typedData.find((r) => r.user_id === user.id) || null;
        setMyReview(mine);
      }
    }
    setIsLoading(false);
  }, [productId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Ajouter ou éditer un avis pour ce produit
  const submitReview = useCallback(
    async (rating: number, comment: string, photos: string[] = []) => {
      if (!user || !productId) return { error: 'Vous devez être connecté.' };

      // Upsert = ajoute ou modifie si existe
      const { error } = await supabase.from('reviews' as any).upsert({
        user_id: user.id,
        product_id: productId,
        rating,
        comment,
        photos,
      });
      await fetchReviews();
      if (error) return { error: error.message };
      return { success: true };
    },
    [user, productId, fetchReviews]
  );

  return { reviews, myReview, submitReview, isLoading, error, user };
}
