
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  Phone,
  Navigation,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import DeliveryTracking from '@/components/DeliveryTracking';
import DeliveryMap from '@/components/DeliveryMap';
import DeliveryManagement from '@/components/DeliveryManagement';
import { useDeliveries } from '@/hooks/useDeliveries';
import { useDrivers } from '@/hooks/useDrivers';

const DeliveryPage = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const { deliveries } = useDeliveries();
  const { drivers } = useDrivers();

  // Calculate real stats from data
  const activeDeliveries = deliveries.filter(d => 
    ['assigned', 'picked_up', 'in_transit'].includes(d.status)
  );
  
  const deliveredToday = deliveries.filter(d => {
    if (d.status !== 'delivered' || !d.actual_delivery_time) return false;
    const today = new Date().toDateString();
    const deliveryDate = new Date(d.actual_delivery_time).toDateString();
    return today === deliveryDate;
  });

  const delayedDeliveries = deliveries.filter(d => {
    if (!d.estimated_delivery_time || d.status === 'delivered') return false;
    return new Date(d.estimated_delivery_time) < new Date();
  });

  const avgDeliveryTime = deliveredToday.length > 0 
    ? deliveredToday.reduce((acc, d) => {
        if (!d.estimated_delivery_time || !d.actual_delivery_time) return acc;
        const estimated = new Date(d.estimated_delivery_time);
        const actual = new Date(d.actual_delivery_time);
        return acc + (actual.getTime() - estimated.getTime());
      }, 0) / deliveredToday.length / (1000 * 60) // Convert to minutes
    : 0;

  const deliveryStats = [
    {
      title: "En cours",
      value: activeDeliveries.length,
      icon: Truck,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Livrées aujourd'hui",
      value: deliveredToday.length,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "En retard",
      value: delayedDeliveries.length,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      title: "Temps moyen",
      value: avgDeliveryTime > 0 ? `${Math.round(avgDeliveryTime)}min` : "N/A",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Truck className="h-8 w-8 text-green-600" />
                Module de Livraison
              </h1>
              <p className="text-gray-600 mt-2">Gestion et suivi des livraisons en temps réel</p>
            </div>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle livraison
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {deliveryStats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Available Drivers Info */}
        <Card className="p-4 mb-8 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Navigation className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                {drivers.length} livreurs disponibles
              </h3>
              <p className="text-blue-700 text-sm">
                Prêts à effectuer des livraisons dans toute la région de Dakar
              </p>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracking">Suivi</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
            <TabsTrigger value="management">Gestion</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="mt-6">
            <DeliveryTracking />
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <DeliveryMap />
          </TabsContent>

          <TabsContent value="management" className="mt-6">
            <DeliveryManagement />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default DeliveryPage;
