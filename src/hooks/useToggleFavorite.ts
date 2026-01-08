
// src/hooks/useToggleFavorite.ts
import { supabase } from '@/integrations/supabase/client';

export async function toggleFavorite(userId: string, productId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;

  if (data.length > 0) {
    // Supprimer des favoris
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (deleteError) throw deleteError;
    return 'removed';
  } else {
    // Ajouter aux favoris
    const { error: insertError } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, product_id: productId }]);
    if (insertError) throw insertError;
    return 'added';
  }
}
