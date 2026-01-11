
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MerchantOrder {
  id: string;
  client_id: string;
  total_amount: number;
  status: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
  delivery_address?: string;
  delivery_phone?: string;
  delivery_notes?: string;
  order_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

const fetchMerchantOrders = async (merchantId: string): Promise<MerchantOrder[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching merchant orders:', error);
    throw error;
  }

  return data || [];
};

const updateOrderStatus = async (orderId: string, status: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }

  return data;
};

const updateProductStock = async (productId: string, newStock: number) => {
  const { data, error } = await supabase
    .from('products')
    .update({ 
      stock: newStock,
      updated_at: new Date().toISOString()
    })
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }

  return data;
};

export const useMerchantOrders = (merchantId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const ordersQuery = useQuery({
    queryKey: ['merchantOrders', merchantId],
    queryFn: () => fetchMerchantOrders(merchantId!),
    enabled: !!merchantId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => 
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantOrders', merchantId] });
      toast({
        title: "Succès",
        description: "Statut de la commande mis à jour",
      });
    },
    onError: (error: any) => {
      console.error('Error updating order status:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      });
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ productId, newStock }: { productId: string; newStock: number }) => 
      updateProductStock(productId, newStock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Succès",
        description: "Stock mis à jour",
      });
    },
    onError: (error: any) => {
      console.error('Error updating stock:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du stock",
        variant: "destructive",
      });
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    updateOrderStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    updateStock: updateStockMutation.mutate,
    isUpdatingStock: updateStockMutation.isPending,
  };
};
