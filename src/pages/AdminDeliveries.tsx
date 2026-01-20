import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DeliveryTracking from '@/components/DeliveryTracking';
import DeliveryMap from '@/components/DeliveryMap';
import DeliveryManagement from '@/components/DeliveryManagement';
import { Truck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDeliveries() {
  const [activeTab, setActiveTab] = React.useState('map');
  const [selectedDeliveryId, setSelectedDeliveryId] = React.useState<string | null>(null);

  const handleViewOnMap = (id?: string) => {
    if (id) setSelectedDeliveryId(id);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
            <Truck className="h-8 w-8 text-green-600" />
            Module de Livraison (Admin)
          </h1>
          <p className="text-gray-600 mt-2">Gestion et suivi en temps réel de tous les livreurs.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="map">Carte Live</TabsTrigger>
            <TabsTrigger value="tracking">Suivi Opérations</TabsTrigger>
            <TabsTrigger value="management">Configuration & Zones</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <DeliveryMap
              selectedDeliveryId={selectedDeliveryId}
              onSelectDelivery={setSelectedDeliveryId}
            />
          </TabsContent>

          <TabsContent value="tracking">
            <DeliveryTracking onViewOnMap={handleViewOnMap} />
          </TabsContent>

          <TabsContent value="management">
            <DeliveryManagement />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
