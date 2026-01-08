
import React from "react";
import { useMerchantOrders } from "@/hooks/useMerchantOrders";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-500", icon: Clock },
  confirmed: { label: "Confirmée", color: "bg-blue-500", icon: Package },
  preparing: { label: "En préparation", color: "bg-orange-500", icon: Package },
  ready: { label: "Prête", color: "bg-green-500", icon: CheckCircle },
  delivered: { label: "Livrée", color: "bg-green-600", icon: CheckCircle },
  cancelled: { label: "Annulée", color: "bg-red-500", icon: XCircle },
};

const MerchantOrdersManager: React.FC = () => {
  const { user } = useAuth();
  const { orders, isLoading, updateOrderStatus, isUpdatingStatus } = useMerchantOrders(user?.id);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus({ orderId, status: newStatus });
  };

  if (!user || user.role !== 'merchant') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Alert>
        <Package className="h-4 w-4" />
        <AlertDescription>
          Aucune commande pour le moment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
        
        return (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Commande #{order.id.slice(0, 8)}
                </CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                </Badge>
              </div>
              <CardDescription>
                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Montant total:</span>
                  <span className="text-lg font-bold">{order.total_amount} F CFA</span>
                </div>
                
                {order.delivery_address && (
                  <div>
                    <span className="font-medium">Adresse de livraison:</span>
                    <p className="text-sm text-gray-600">{order.delivery_address}</p>
                  </div>
                )}
                
                {order.delivery_phone && (
                  <div>
                    <span className="font-medium">Téléphone:</span>
                    <span className="ml-2">{order.delivery_phone}</span>
                  </div>
                )}

                {order.order_items && order.order_items.length > 0 && (
                  <div>
                    <span className="font-medium">Articles:</span>
                    <div className="mt-2 space-y-1">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>Produit {item.product_id.slice(0, 8)} x{item.quantity}</span>
                          <span>{item.price * item.quantity} F CFA</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="font-medium">Changer le statut:</span>
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="preparing">En préparation</SelectItem>
                      <SelectItem value="ready">Prête</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MerchantOrdersManager;
