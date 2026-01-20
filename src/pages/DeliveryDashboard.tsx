import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useDeliveries } from '@/hooks/useDeliveries';
import { DeliveryMap } from '@/components/delivery/DeliveryMap';
import DriverDashboard from '@/components/DriverDashboard';
import { mockZones } from '@/data/mockDeliveryData';
import { Package, Truck, MapPin, Navigation, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DeliveryDashboard = () => {
  const { deliveries, isLoading } = useDeliveries();
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);

  // Transform deliveries for the map
  const mapDeliveries = deliveries
    .filter(d => ['assigned', 'picked_up', 'in_transit'].includes(d.status))
    .map(d => ({
      id: d.id,
      driverName: d.driver_profile ? `${d.driver_profile.first_name} ${d.driver_profile.last_name}` : 'Livreur assigné',
      lat: d.last_location?.lat || (mockZones[0].coordinates[0][0] + (Math.random() * 0.01)),
      lng: d.last_location?.lng || (mockZones[0].coordinates[0][1] + (Math.random() * 0.01)),
      status: d.status === 'picked_up' ? 'picking_up' : d.status === 'in_transit' ? 'delivering' : 'idle',
      vehicleType: 'car' as const, // We could store this in driver profile later
      bearing: d.last_location?.heading || 0,
      speed: d.last_location?.speed || 0, // Pass speed to map for popup
    }));

  const activeDeliveries = deliveries.filter(d => ['pending', 'assigned', 'picked_up', 'in_transit'].includes(d.status));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Logistique</h1>
            <p className="text-gray-500">Suivi des livraisons en temps réel</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-white">
              {activeDeliveries.length} En cours
            </Badge>
            <Badge variant="outline" className="px-3 py-1 bg-white text-green-600 border-green-200">
              {deliveries.filter(d => d.status === 'delivered').length} Livrés 24h
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="manager" className="space-y-6">
          <TabsList>
            <TabsTrigger value="manager">Vue Manager</TabsTrigger>
            <TabsTrigger value="driver">Vue Livreur (Simulateur)</TabsTrigger>
          </TabsList>

          <TabsContent value="manager" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
              {/* Left Column: Map */}
              <Card className="lg:col-span-2 h-full flex flex-col overflow-hidden">
                <CardHeader className="py-4 px-6 border-b bg-white z-10">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Carte Live
                  </CardTitle>
                </CardHeader>
                <div className="flex-grow relative bg-slate-100">
                  {/* We pass the calculated mapDeliveries */}
                  {/* Note: DeliveryMap has fixed height in its implementation, we might want to ensure it fills */}
                  <div className="absolute inset-0">
                    <DeliveryMap zones={mockZones} deliveries={mapDeliveries as any} />
                  </div>
                </div>
              </Card>

              {/* Right Column: List */}
              <Card className="h-full flex flex-col">
                <CardHeader className="py-4 px-6 border-b">
                  <CardTitle className="text-lg">File d'attente</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-grow p-4">
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8 text-gray-500">Chargement...</div>
                    ) : activeDeliveries.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Aucune livraison en cours</div>
                    ) : (
                      activeDeliveries.map((delivery) => (
                        <div
                          key={delivery.id}
                          className={`p-4 rounded-lg border transition-colors cursor-pointer hover:border-blue-400 ${selectedDeliveryId === delivery.id ? 'border-blue-600 bg-blue-50' : 'bg-white border-gray-100 shadow-sm'}`}
                          onClick={() => setSelectedDeliveryId(delivery.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={`
                               ${delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                               ${delivery.status === 'assigned' ? 'bg-orange-100 text-orange-800' : ''}
                               ${delivery.status === 'in_transit' ? 'bg-purple-100 text-purple-800' : ''}
                               ${delivery.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                             `}>
                              {delivery.status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {format(new Date(delivery.created_at), 'HH:mm', { locale: fr })}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-800 mb-1">{delivery.customer_name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{delivery.delivery_address}</span>
                          </div>
                          {delivery.driver_profile && (
                            <div className="flex items-center gap-2 text-xs bg-slate-100 p-2 rounded mt-2">
                              <Truck className="h-3 w-3 text-slate-500" />
                              <span>{delivery.driver_profile.first_name} {delivery.driver_profile.last_name}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="driver">
            <DriverDashboard />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryDashboard;
