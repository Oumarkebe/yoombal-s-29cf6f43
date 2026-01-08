
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { type Database } from '@/integrations/supabase/types';

export interface GuestOrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface GuestCartItem {
  product_id: string;
  quantity: number;
  price: number;
  merchant_id: string;
}

export const useGuestCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createGuestOrder = async (
    guestData: GuestOrderData,
    items: GuestCartItem[],
    paymentMethod: string
  ) => {
    if (!items || items.length === 0) {
      return { error: 'Le panier est vide' };
    }

    setIsLoading(true);
    
    try {
      const merchantId = items[0].merchant_id;
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Créer la commande sans user_id (commande invité)
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          client_id: '00000000-0000-0000-0000-000000000000', // ID par défaut pour les invités
          merchant_id: merchantId,
          total_amount: totalAmount,
          status: 'pending',
          payment_method: paymentMethod,
          payment_status: 'pending',
          delivery_address: `${guestData.address}, ${guestData.city} ${guestData.postalCode}`,
          delivery_phone: guestData.phone,
          delivery_notes: `Invité: ${guestData.firstName} ${guestData.lastName} - Email: ${guestData.email}${guestData.notes ? ` - Notes: ${guestData.notes}` : ''}`,
        })
        .select()
        .single();
      
      if (orderError) throw orderError;

      // Ajouter les items de la commande
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
        // Tentative de rollback
        await supabase.from('orders').delete().eq('id', newOrder.id);
        throw itemsError;
      }

      toast({
        title: 'Commande créée',
        description: 'Votre commande a été créée avec succès. Vous recevrez un email de confirmation.',
      });

      return { data: newOrder };

    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de créer la commande',
        variant: 'destructive',
      });
      return { error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createGuestOrder,
    isLoading,
  };
};
