
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Truck, 
  Plus, 
  Edit, 
  MapPin, 
  Phone,
  Star,
  Clock,
  Package,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useDrivers } from '@/hooks/useDrivers';
import { useDeliveryZones, DeliveryZone } from '@/hooks/useDeliveryZones';
import { useDeliveries } from '@/hooks/useDeliveries';
import { AddDriverModal } from './admin/AddDriverModal';
import { ZoneModal } from './admin/ZoneModal';
import { useQueryClient } from '@tanstack/react-query';

const DeliveryManagement = () => {
  const [activeDriverTab, setActiveDriverTab] = useState('all');
  const { drivers, isLoading: driversLoading, getDriverName } = useDrivers();
  const { zones, isLoading: zonesLoading } = useDeliveryZones();
  const { deliveries } = useDeliveries();
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | undefined>(undefined);
  const queryClient = useQueryClient();

  const handleOpenZoneModal = (zone?: DeliveryZone) => {
    setSelectedZone(zone);
    setIsZoneModalOpen(true);
  };

  const handleDriverAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['drivers'] });
    setIsAddDriverModalOpen(false);
  };
  
  const handleZoneSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['delivery_zones'] });
    handleCloseZoneModal();
  };

  const handleCloseZoneModal = () => {
    setIsZoneModalOpen(false);
    setSelectedZone(undefined);
  };

  // Calculate driver stats
  const getDriverStats = (driverId: string) => {
    const driverDeliveries = deliveries.filter(d => d.driver_id === driverId);
    const completedDeliveries = driverDeliveries.filter(d => d.status === 'delivered');
    const activeDeliveries = driverDeliveries.filter(d => 
      ['assigned', 'picked_up', 'in_transit'].includes(d.status)
    );

    return {
      total: completedDeliveries.length,
      active: activeDeliveries.length,
      rating: 4.5 + Math.random() * 0.5, // Simulated rating
      status: activeDeliveries.length > 0 ? 'busy' : 'available'
    };
  };

  const getDriverStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'busy':
        return <Badge className="bg-blue-100 text-blue-800">Occupé</Badge>;
      case 'offline':
        return <Badge className="bg-gray-100 text-gray-800">Hors ligne</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getDriverStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'busy':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    if (activeDriverTab === 'all') return true;
    const stats = getDriverStats(driver.id);
    return stats.status === activeDriverTab;
  });

  if (driversLoading || zonesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Tabs defaultValue="drivers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="drivers">Livreurs</TabsTrigger>
            <TabsTrigger value="zones">Zones de livraison</TabsTrigger>
          </TabsList>

          <TabsContent value="drivers" className="space-y-6">
            {/* Driver Management Header */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Gestion des livreurs
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {drivers.length} livreurs enregistrés
                  </p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsAddDriverModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un livreur
                </Button>
              </div>

              {/* Driver Status Filter */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={activeDriverTab === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveDriverTab('all')}
                >
                  Tous ({drivers.length})
                </Button>
                <Button
                  size="sm"
                  variant={activeDriverTab === 'available' ? 'default' : 'outline'}
                  onClick={() => setActiveDriverTab('available')}
                >
                  Disponibles ({drivers.filter(d => getDriverStats(d.id).status === 'available').length})
                </Button>
                <Button
                  size="sm"
                  variant={activeDriverTab === 'busy' ? 'default' : 'outline'}
                  onClick={() => setActiveDriverTab('busy')}
                >
                  Occupés ({drivers.filter(d => getDriverStats(d.id).status === 'busy').length})
                </Button>
              </div>
            </Card>

            {/* Drivers List */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredDrivers.map((driver) => {
                const stats = getDriverStats(driver.id);
                return (
                  <Card key={driver.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getDriverStatusIcon(stats.status)}
                        <div>
                          <h4 className="font-semibold">{getDriverName(driver)}</h4>
                          <p className="text-sm text-gray-600">{driver.id.slice(0, 8)}</p>
                        </div>
                      </div>
                      {getDriverStatusBadge(stats.status)}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{driver.phone || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span>{driver.vehicle_type || 'Non renseigné'}</span>
                      </div>
                      {driver.zone && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{driver.zone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{stats.rating.toFixed(1)}/5 ({stats.total} livraisons)</span>
                      </div>
                      {stats.active > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-blue-500" />
                          <span>{stats.active} livraison(s) en cours</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Appeler
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-1" />
                        Localiser
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="zones" className="space-y-6">
            {/* Zones Header */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Zones de livraison
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Gestion des zones et temps de livraison
                  </p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleOpenZoneModal()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle zone
                </Button>
              </div>
            </Card>

            {/* Zones List */}
            <div className="grid md:grid-cols-2 gap-6">
              {zones.map((zone) => {
                const zoneDrivers = drivers.filter(d => d.zone === zone.name);
                return (
                  <Card key={zone.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold">{zone.name}</h4>
                        <p className="text-sm text-gray-600">{zone.id.slice(0, 8)}</p>
                      </div>
                      <Badge className={zone.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {zone.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Quartiers couverts:</p>
                        <p className="text-sm text-gray-600">{zone.areas.join(', ')}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{zoneDrivers.length} livreurs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{zone.max_delivery_time_minutes} min max</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Frais de base: </span>
                          <span className="font-medium">{zone.base_fee.toLocaleString()} CFA</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Prix/km: </span>
                          <span className="font-medium">{zone.price_per_km.toLocaleString()} CFA</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleOpenZoneModal(zone)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-1" />
                        Voir carte
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <AddDriverModal 
        isOpen={isAddDriverModalOpen} 
        onClose={() => setIsAddDriverModalOpen(false)} 
        onSuccess={handleDriverAdded}
      />
      <ZoneModal 
        isOpen={isZoneModalOpen} 
        onClose={handleCloseZoneModal}
        onSuccess={handleZoneSaved}
        zone={selectedZone}
      />
    </>
  );
};

export default DeliveryManagement;
