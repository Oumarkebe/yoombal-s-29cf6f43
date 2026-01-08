
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  Phone,
  User,
  CheckCircle,
  AlertCircle,
  Navigation,
  Loader2
} from 'lucide-react';
import { useDeliveries, Delivery } from '@/hooks/useDeliveries';

const DeliveryTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { deliveries, isLoading, updateDeliveryStatus } = useDeliveries();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">En attente</Badge>;
      case 'assigned':
        return <Badge className="bg-orange-100 text-orange-800">Assignée</Badge>;
      case 'picked_up':
        return <Badge className="bg-blue-100 text-blue-800">Récupérée</Badge>;
      case 'in_transit':
        return <Badge className="bg-purple-100 text-purple-800">En transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Livrée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="h-4 w-4 text-gray-600" />;
      case 'assigned':
        return <User className="h-4 w-4 text-orange-600" />;
      case 'picked_up':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'in_transit':
        return <Navigation className="h-4 w-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => 
    delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = async (deliveryId: string, newStatus: Delivery['status']) => {
    await updateDeliveryStatus(deliveryId, newStatus);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Chargement des livraisons...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="delivery-search"
              name="delivery-search"
              placeholder="Rechercher par ID, commande ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <MapPin className="mr-2 h-4 w-4" />
            Voir sur la carte
          </Button>
        </div>
      </Card>

      {/* Deliveries List */}
      <div className="grid gap-6">
        {filteredDeliveries.map((delivery) => (
          <Card key={delivery.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Delivery Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(delivery.status)}
                      <h3 className="text-lg font-semibold">{delivery.id.slice(0, 8)}</h3>
                      {getStatusBadge(delivery.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Commande: {delivery.order_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Frais</p>
                    <p className="font-semibold">{delivery.delivery_fee.toLocaleString()} CFA</p>
                  </div>
                </div>

                {/* Customer and Driver Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Client
                    </h4>
                    <p className="text-sm">{delivery.customer_name}</p>
                    <p className="text-sm text-gray-600">{delivery.customer_phone}</p>
                    <p className="text-sm text-gray-600 flex items-start gap-1 mt-1">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      {delivery.delivery_address}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Livreur
                    </h4>
                    {delivery.driver_profile ? (
                      <>
                        <p className="text-sm">
                          {delivery.driver_profile.first_name} {delivery.driver_profile.last_name}
                        </p>
                        <p className="text-sm text-gray-600">{delivery.driver_profile.phone}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Non assigné</p>
                    )}
                    {delivery.estimated_delivery_time && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Clock className="h-4 w-4" />
                        ETA: {new Date(delivery.estimated_delivery_time).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Addresses */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Adresses</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Récupération:</p>
                      <p className="text-gray-600">{delivery.pickup_address}</p>
                    </div>
                    <div>
                      <p className="font-medium">Livraison:</p>
                      <p className="text-gray-600">{delivery.delivery_address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 min-w-[200px]">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <MapPin className="h-4 w-4 mr-1" />
                  Localiser
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-1" />
                  Appeler client
                </Button>
                {delivery.driver_profile && (
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-1" />
                    Appeler livreur
                  </Button>
                )}
                
                {/* Status Update Actions */}
                {delivery.status === 'assigned' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusUpdate(delivery.id, 'picked_up')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Marquer comme récupérée
                  </Button>
                )}
                {delivery.status === 'picked_up' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusUpdate(delivery.id, 'in_transit')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    En transit
                  </Button>
                )}
                {delivery.status === 'in_transit' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusUpdate(delivery.id, 'delivered')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Marquer comme livrée
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <Card className="p-12 text-center">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune livraison trouvée
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Aucune livraison ne correspond à vos critères de recherche' 
              : 'Aucune livraison en cours pour le moment'}
          </p>
        </Card>
      )}
    </div>
  );
};

export default DeliveryTracking;
