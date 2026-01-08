
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export function useProductReviews(productId: string | undefined) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [myReview, setMyReview] = useState<Review | null>(null);

  // Récupérer tous les avis du produit
  const fetchReviews = useCallback(async () => {
    if (!productId) return [];
    setIsLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      setError("Erreur lors de la récupération des avis.");
      setReviews([]);
    } else {
      setError(null);
      setReviews(data || []);
      if (user) {
        const mine = (data || []).find(r => r.user_id === user.id) || null;
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
    async (rating: number, comment: string) => {
      if (!user || !productId) return { error: "Vous devez être connecté." };

      // Upsert = ajoute ou modifie si existe 
      const { error } = await supabase.from("product_reviews").upsert({
        user_id: user.id,
        product_id: productId,
        rating,
        comment,
      });
      await fetchReviews();
      if (error) return { error: error.message };
      return { success: true };
    },
    [user, productId, fetchReviews]
  );

  return { reviews, myReview, submitReview, isLoading, error, user };
}
