import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Package,
  Truck,
  Check,
  X,
  Eye,
  Calendar,
  User,
  CreditCard,
  Download,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useOrders } from '@/hooks/useOrders';

interface Order {
  id: string;
  user_id?: string;
  created_at?: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: { name: string; quantity: number; price: number }[];
}

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { orders, isLoading, error, updateOrder, deleteOrder } = useOrders();
  const [enrichedOrders, setEnrichedOrders] = useState<any[]>([]);

  // Enrichir les commandes avec infos client et items
  useEffect(() => {
    const enrichOrders = async () => {
      // Pour chaque commande, récupérer les items et infos utilisateur
      const enriched = await Promise.all(
        orders.map(async (order: any) => {
          // Récupérer les items de la commande
          let items = [];
          try {
            const { data: orderItems } = await supabase
              .from('order_items')
              .select('product_id, quantity, price, products(name, is_digital)')
              .eq('order_id', order.id);

            items = (orderItems || []).map((i: any) => ({
              name: i.products?.name || i.product_id,
              quantity: i.quantity,
              price: i.price,
              is_digital: i.products?.is_digital || false,
            }));
          } catch (e) {
            console.error('Error fetching order items:', e);
          }
          // Récupérer l'utilisateur
          let user = null;
          let userId = order.user_id || order.client_id || order.customer_id || null;
          try {
            if (userId) {
              const { data } = await supabase
                .from('profiles')
                .select('email, phone, first_name, last_name')
                .eq('id', userId)
                .single();
              user = data;
            }
          } catch {}
          return {
            ...order,
            user_id: userId,
            items,
            customer: user
              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
              : userId || order.id,
            email: user?.email || '',
            phone: user?.phone || '',
            total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
            date: order.created_at || '',
            is_digital_only: items.length > 0 && items.every((i) => i.is_digital),
          };
        })
      );
      setEnrichedOrders(enriched);
    };
    if (orders.length > 0) enrichOrders();
    else setEnrichedOrders([]);
  }, [orders]);

  const statusOptions = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">En traitement</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-100 text-purple-800">Expédié</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Livré</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrder(orderId, { status: newStatus });
  };

  const handleDelete = async (orderId: string) => {
    await deleteOrder(orderId);
  };

  const filteredOrders = enrichedOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer && order.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return <div className="py-12 text-center text-gray-500">Chargement des commandes...</div>;
  }
  if (error) {
    return <div className="py-12 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Gestion des commandes
            </h2>
            <p className="text-gray-600 text-sm mt-1">{enrichedOrders.length} commandes au total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par ID ou nom client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'all'
                  ? 'Tous les statuts'
                  : status === 'pending'
                    ? 'En attente'
                    : status === 'processing'
                      ? 'En traitement'
                      : status === 'shipped'
                        ? 'Expédié'
                        : status === 'delivered'
                          ? 'Livré'
                          : status === 'cancelled'
                            ? 'Annulé'
                            : status}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Orders List */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{order.id}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {order.customer}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {order.date ? new Date(order.date).toLocaleDateString('fr-FR') : ''}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatCurrency(order.total)}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items &&
                    order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          {item.is_digital && (
                            <span className="text-blue-600" title="Produit numérique">
                              <Download className="h-3 w-3" />
                            </span>
                          )}
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {item.quantity}x {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Customer Info */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p>
                    <strong>Téléphone:</strong> {order.phone}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Détails
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 font-bold shadow-sm"
                  onClick={() =>
                    handleStatusChange(order.id, order.is_digital_only ? 'delivered' : 'processing')
                  }
                >
                  <Check className="h-4 w-4 mr-1" />
                  {order.is_digital_only ? 'Accepter & Livrer' : 'Accepter'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleStatusChange(order.id, 'cancelled')}
                >
                  <X className="h-4 w-4 mr-1" />
                  Refuser
                </Button>

                {!order.is_digital_only && (
                  <>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleStatusChange(order.id, 'shipped')}
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      Expédier
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(order.id, 'delivered')}
                    >
                      <Package className="h-4 w-4 mr-1" />
                      Marquer livré
                    </Button>
                  </>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-500 hover:text-red-600"
                  onClick={() => handleDelete(order.id)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
          <p className="text-gray-600">Aucune commande ne correspond à vos critères de recherche</p>
        </Card>
      )}
    </div>
  );
};

export default OrderManagement;
