
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Navigation,
  Truck,
  Phone,
  Clock,
  RefreshCw,
  Loader2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useDeliveries, Delivery } from '@/hooks/useDeliveries';
import { supabase } from '@/integrations/supabase/client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Correction pour l'icône de marqueur par défaut de Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DeliveryLocation {
  delivery_id: string;
  latitude: number;
  longitude: number;
}

const ChangeView = ({ center, zoom }: { center: L.LatLngExpression, zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

interface DeliveryMapProps {
  selectedDeliveryId: string | null;
  onSelectDelivery: (id: string | null) => void;
}

const DeliveryMap = ({ selectedDeliveryId, onSelectDelivery }: DeliveryMapProps) => {
  const { deliveries, isLoading: isLoadingDeliveries } = useDeliveries();
  const [locations, setLocations] = useState<DeliveryLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  const activeDeliveries = deliveries.filter(d =>
    ['assigned', 'picked_up', 'in_transit'].includes(d.status)
  );

  const fetchLocations = async () => {
    if (activeDeliveries.length === 0) {
      setLocations([]);
      setIsLoadingLocations(false);
      return;
    }

    setIsLoadingLocations(true);
    const deliveryIds = activeDeliveries.map(d => d.id);
    const { data, error } = await supabase.rpc('get_latest_delivery_locations' as any, {
      p_delivery_ids: deliveryIds
    });

    if (error) {
      console.error('Error fetching delivery locations:', error);
      setLocations([]);
    } else if (data) {
      const typedData = data as unknown as DeliveryLocation[];
      setLocations(typedData.filter(d => d.latitude && d.longitude));
    }
    setIsLoadingLocations(false);
  };

  useEffect(() => {
    fetchLocations();

    // Setup realtime subscription for tracking updates
    const channel = supabase
      .channel('public:delivery_tracking')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'delivery_tracking' },
        (payload) => {
          const newLoc = payload.new as DeliveryLocation;
          setLocations(prev => {
            // Update only if this is a newer position for an existing delivery or a new one
            const filtered = prev.filter(l => l.delivery_id !== newLoc.delivery_id);
            return [...filtered, newLoc];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [JSON.stringify(activeDeliveries.map(d => d.id))]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_transit': return 'En transit';
      case 'assigned': return 'Assignée';
      case 'picked_up': return 'Récupérée';
      case 'delayed': return 'En retard';
      default: return 'Inconnu';
    }
  };

  const getStatusBadgeVariant = (status: string): "secondary" | "default" | "destructive" | "outline" | null | undefined => {
    switch (status) {
      case 'in_transit': return "default";
      case 'assigned': return "secondary";
      case 'picked_up': return "default";
      case 'delivered': return "default";
      case 'cancelled': return "destructive";
      default: return "outline";
    }
  }

  const selectedDelivery = activeDeliveries.find(d => d.id === selectedDeliveryId);
  const selectedLocation = locations.find(l => l.delivery_id === selectedDeliveryId);
  const mapCenter: L.LatLngExpression = [14.7167, -17.4677]; // Dakar

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Map Container */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Carte des livraisons
            </h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={fetchLocations} disabled={isLoadingLocations}>
                {isLoadingLocations ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg h-96 relative">
            <MapContainer center={mapCenter} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
              {selectedLocation && <ChangeView center={[selectedLocation.latitude, selectedLocation.longitude]} zoom={14} />}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locations.map((loc) => {
                const delivery = activeDeliveries.find(d => d.id === loc.delivery_id);
                if (!delivery) return null;

                return (
                  <Marker
                    key={loc.delivery_id}
                    position={[loc.latitude, loc.longitude]}
                    ref={(ref) => {
                      if (ref && selectedDeliveryId === loc.delivery_id) {
                        ref.openPopup();
                      }
                    }}
                  >
                    <Popup>
                      <div className="p-1 space-y-2 min-w-[150px]">
                        <div className="font-bold border-b pb-1 text-sm">Mission #{delivery.id.slice(0, 8)}</div>
                        <div className="text-xs space-y-1">
                          <p><strong>Livreur:</strong> {delivery.driver_profile ? `${delivery.driver_profile.first_name} ${delivery.driver_profile.last_name}` : 'N/A'}</p>
                          <p><strong>Client:</strong> {delivery.customer_name}</p>
                          <p><strong>Statut:</strong> {getStatusText(delivery.status)}</p>
                        </div>
                        <div className="flex gap-2 pt-2 border-t">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild title="Appeler Client">
                            <a href={`tel:${delivery.customer_phone}`}>
                              <Phone className="h-3.5 w-3.5 text-green-600" />
                            </a>
                          </Button>
                          {delivery.driver_profile?.phone && (
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild title="Appeler Livreur">
                              <a href={`tel:${delivery.driver_profile.phone}`}>
                                <Truck className="h-3.5 w-3.5 text-blue-600" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </Card>
      </div>

      {/* Delivery List */}
      <div className="space-y-4">
        <Card className="p-4 max-h-[40rem] overflow-y-auto">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-600" />
            Livraisons actives ({activeDeliveries.length})
          </h3>

          {isLoadingDeliveries ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="space-y-3">
              {activeDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedDeliveryId === delivery.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => onSelectDelivery(delivery.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{delivery.id.slice(0, 8)}</span>
                    <Badge variant={getStatusBadgeVariant(delivery.status)}>
                      {getStatusText(delivery.status)}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <p><strong>Livreur:</strong> {delivery.driver_profile ? `${delivery.driver_profile.first_name} ${delivery.driver_profile.last_name}` : 'Non assigné'}</p>
                    <p><strong>Client:</strong> {delivery.customer_name}</p>
                    {delivery.estimated_delivery_time && (
                      <p className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ETA: {new Date(delivery.estimated_delivery_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => onSelectDelivery(delivery.id)}>
                      <Navigation className="h-3 w-3 mr-1" />
                      Localiser
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild title="Appeler Client">
                      <a href={`tel:${delivery.customer_phone}`}>
                        <Phone className="h-3.5 w-3.5 text-green-600" />
                      </a>
                    </Button>
                    {delivery.driver_profile?.phone && (
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild title="Appeler Livreur">
                        <a href={`tel:${delivery.driver_profile.phone}`}>
                          <Truck className="h-3.5 w-3.5 text-blue-600" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DeliveryMap;
