import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { type Database } from '@/integrations/supabase/types';

export type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items?: Array<Database['public']['Tables']['order_items']['Row'] & {
    products?: { name: string; is_digital: boolean };
  }>;
  profiles?: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
  };
};

export type OrderItemCreation = {
  product_id: string;
  quantity: number;
  price: number;
  merchant_id: string;
}

export const useOrders = (options?: { role?: string; merchantId?: string; driverId?: string }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items:order_items(*, products(name, is_digital))
        `)
        .order('created_at', { ascending: false });

      if (options?.role === 'merchant' && options.merchantId) {
        query = query.eq('merchant_id', options.merchantId);
      } else if (options?.role === 'admin') {
        // Pas de filtre côté client pour l'admin, RLS s'en occupe
      } else {
        query = query.eq('client_id', user.id);
      }
      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      setOrders((data || []) as unknown as Order[]);
    } catch (err: any) {
      setError('Impossible de charger les commandes');
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de charger les commandes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, options?.role, options?.merchantId, toast]);

  const deleteOrder = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchOrders();
      toast({
        title: 'Succès',
        description: 'Commande supprimée avec succès',
      });
      return { success: true };
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la commande',
        variant: 'destructive',
      });
      return { error: (err as Error).message };
    }
  };

  const createOrder = async (items: OrderItemCreation[], deliveryDetails: { address: string; phone: string; notes?: string }, paymentMethod: string) => {
    if (!user) return { error: 'User not authenticated' };
    if (!items || items.length === 0) return { error: 'Cart is empty' };

    const merchantId = items[0].merchant_id;
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          client_id: user.id,
          merchant_id: merchantId,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: paymentMethod,
          payment_status: 'pending',
          delivery_address: deliveryDetails.address,
          delivery_phone: deliveryDetails.phone,
          delivery_notes: deliveryDetails.notes || undefined,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsData = items.map(item => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) {
        await supabase.from('orders').delete().eq('id', newOrder.id); // Tentative de rollback
        throw itemsError;
      }

      await fetchOrders();
      toast({
        title: 'Succès',
        description: 'Commande créée avec succès',
      });
      return { data: newOrder };

    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de créer la commande',
        variant: 'destructive',
      });
      return { error: (err as Error).message };
    }
  };

  const updateOrder = async (id: string, orderData: Database['public']['Tables']['orders']['Update']) => {
    if (!user) return { error: 'User not authenticated' };
    try {
      const { error } = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', id);
      if (error) throw error;
      await fetchOrders();
      toast({
        title: 'Succès',
        description: 'Commande mise à jour avec succès',
      });
      return { success: true };
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la commande',
        variant: 'destructive',
      });
      return { error: (err as Error).message };
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    deleteOrder,
    createOrder,
    updateOrder,
  };
};
