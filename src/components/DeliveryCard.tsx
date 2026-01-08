
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Package } from 'lucide-react';
import DeliveryStatusBadge from './DeliveryStatusBadge';
import { Delivery } from '@/hooks/useDeliveries';

interface DeliveryCardProps {
  delivery: Delivery;
  onStatusUpdate?: (deliveryId: string, status: string) => void;
  onAssignDriver?: (deliveryId: string) => void;
  showActions?: boolean;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  onStatusUpdate,
  onAssignDriver,
  showActions = false
}) => {
  const canUpdateStatus = delivery.status !== 'delivered' && delivery.status !== 'cancelled';

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            #{delivery.id.slice(0, 8)}
          </CardTitle>
          <DeliveryStatusBadge status={delivery.status} />
        </div>
        <div className="text-sm text-gray-600">
          {new Date(delivery.created_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 mt-1 text-blue-500" />
              <div>
                <div className="font-medium text-sm">Récupération</div>
                <div className="text-sm text-gray-600">{delivery.pickup_address}</div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 text-green-500" />
              <div>
                <div className="font-medium text-sm">Livraison</div>
                <div className="text-sm text-gray-600">{delivery.delivery_address}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{delivery.customer_name}</span>
            <span className="text-sm text-gray-500">({delivery.customer_phone})</span>
          </div>
          
          {delivery.estimated_delivery_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Estimée: {new Date(delivery.estimated_delivery_time).toLocaleString('fr-FR')}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {delivery.delivery_fee} F CFA
          </Badge>
          {delivery.distance_km && (
            <span className="text-sm text-gray-500">
              {delivery.distance_km} km
            </span>
          )}
        </div>

        {delivery.driver_profile && (
          <div className="p-2 bg-gray-50 rounded">
            <div className="text-sm font-medium">Livreur assigné:</div>
            <div className="text-sm">
              {delivery.driver_profile.first_name} {delivery.driver_profile.last_name}
            </div>
            {delivery.driver_profile.phone && (
              <div className="text-sm text-gray-600">{delivery.driver_profile.phone}</div>
            )}
          </div>
        )}

        {delivery.notes && (
          <div className="p-2 bg-blue-50 rounded">
            <div className="text-sm font-medium">Notes:</div>
            <div className="text-sm">{delivery.notes}</div>
          </div>
        )}

        {showActions && canUpdateStatus && (
          <div className="flex gap-2 pt-2">
            {!delivery.driver_id && onAssignDriver && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAssignDriver(delivery.id)}
              >
                Assigner livreur
              </Button>
            )}
            {onStatusUpdate && (
              <Button
                size="sm"
                onClick={() => {
                  const nextStatus = delivery.status === 'pending' ? 'assigned' :
                                   delivery.status === 'assigned' ? 'picked_up' :
                                   delivery.status === 'picked_up' ? 'in_transit' :
                                   'delivered';
                  onStatusUpdate(delivery.id, nextStatus);
                }}
              >
                Avancer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryCard;
