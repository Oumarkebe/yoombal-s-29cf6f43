import React, { useState } from 'react';
import { useDeliveries } from '@/hooks/useDeliveries';
import { useDrivers } from '@/hooks/useDrivers';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Assuming Button component exists
import { Truck, CheckCircle, AlertCircle, Clock, MapPin, Package } from 'lucide-react';

const DeliveryPage = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | undefined>();
  const { deliveries } = useDeliveries();
  const { drivers } = useDrivers();

  // Calculate real stats from data
  const activeDeliveries = deliveries.filter((d) =>
    ['assigned', 'picked_up', 'in_transit'].includes(d.status)
  );

  const deliveredToday = deliveries.filter((d) => {
    if (d.status !== 'delivered' || !d.actual_delivery_time) return false;
    const today = new Date().toDateString();
    const deliveryDate = new Date(d.actual_delivery_time).toDateString();
    return today === deliveryDate;
  });

  const delayedDeliveries = deliveries.filter((d) => {
    if (!d.estimated_delivery_time || d.status === 'delivered') return false;
    return new Date(d.estimated_delivery_time) < new Date();
  });

  const avgDeliveryTime =
    deliveredToday.length > 0
      ? deliveredToday.reduce((acc, d) => {
          if (!d.estimated_delivery_time || !d.actual_delivery_time) return acc;
          const estimated = new Date(d.estimated_delivery_time);
          const actual = new Date(d.actual_delivery_time);
          return acc + (actual.getTime() - estimated.getTime());
        }, 0) /
        deliveredToday.length /
        (1000 * 60) // Convert to minutes
      : 0;

  const deliveryStats = [
    {
      title: 'En cours',
      value: activeDeliveries.length,
      icon: Truck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: "Livrées aujourd'hui",
      value: deliveredToday.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'En retard',
      value: delayedDeliveries.length,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Temps moyen',
      value: avgDeliveryTime > 0 ? `${Math.round(avgDeliveryTime)}min` : 'N/A',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  const handleViewOnMap = (id?: string) => {
    setSelectedDeliveryId(id);
    setActiveTab('map');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            Module de Livraison
          </h1>
          <p className="text-gray-500">Gestion et suivi des livraisons en temps réel</p>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle livraison
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {deliveryStats.map((stat, index) => (
          <Card key={index} className="p-4 border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Available Drivers Info */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">{drivers.length} livreurs disponibles</h3>
            <p className="text-sm text-blue-700">
              Prêts à effectuer des livraisons dans toute la région de Dakar
            </p>
          </div>
        </div>
      </Card>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex gap-4 border-b mb-4">
          <button
            className={`pb-2 px-4 ${activeTab === 'tracking' ? 'border-b-2 border-blue-600 font-medium text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('tracking')}
          >
            Suivi
          </button>
          <button
            className={`pb-2 px-4 ${activeTab === 'map' ? 'border-b-2 border-blue-600 font-medium text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('map')}
          >
            Carte
          </button>
          <button
            className={`pb-2 px-4 ${activeTab === 'management' ? 'border-b-2 border-blue-600 font-medium text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('management')}
          >
            Gestion
          </button>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'tracking' && (
            <div className="text-center py-10 text-gray-500">
              Composant de suivi des livraisons (À implémenter)
            </div>
          )}

          {activeTab === 'map' && (
            <div className="text-center py-10 text-gray-500">
              Carte interactive des livraisons (À implémenter)
            </div>
          )}

          {activeTab === 'management' && (
            <div className="text-center py-10 text-gray-500">
              Tableau de gestion des livraisons (À implémenter)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Start of Selection
import { Plus } from 'lucide-react'; // Import missing Plus icon

export default DeliveryPage;
