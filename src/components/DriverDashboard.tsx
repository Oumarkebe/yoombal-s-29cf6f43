
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Navigation, CheckCircle, Loader2, Clock, MapPin, Phone, Package, Download, ChevronDown, ChevronUp } from "lucide-react";
import * as XLSX from 'xlsx';
import { useDeliveries, Delivery } from "@/hooks/useDeliveries";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PremiumFeaturesDisplay } from '@/components/premium/PremiumFeaturesDisplay';

// Leaflet icon fix
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "assigned":
      return <Badge className="bg-orange-100 text-orange-800">Assignée</Badge>;
    case "picked_up":
      return <Badge className="bg-blue-100 text-blue-800">Récupérée</Badge>;
    case "in_transit":
      return <Badge className="bg-purple-100 text-purple-800">En transit</Badge>;
    case "delivered":
      return <Badge className="bg-green-100 text-green-800">Livrée</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
};

const getStatusNextAction = (status: Delivery["status"]) => {
  switch (status) {
    case "assigned":
      return { label: "Marquer comme récupérée", newStatus: "picked_up" };
    case "picked_up":
      return { label: "En transit", newStatus: "in_transit" };
    case "in_transit":
      return { label: "Marquer comme livrée", newStatus: "delivered" };
    default:
      return null;
  }
};

const DriverDashboard = () => {
  const { user } = useAuth();
  const { deliveries, isLoading, updateDeliveryStatus, fetchDeliveries } = useDeliveries();
  const { toast } = useToast();
  const [loadingTracking, setLoadingTracking] = useState<string | null>(null);
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Filtrer les livraisons du livreur uniquement
  const myDeliveries = deliveries.filter(
    (d) => d.driver_id === user?.id && ["assigned", "picked_up", "in_transit"].includes(d.status)
  );

  // Livraisons historiques (déjà livrés ou annulées)
  const doneDeliveries = deliveries.filter(
    (d) => d.driver_id === user?.id && ["delivered", "cancelled"].includes(d.status)
  );

  const sendTracking = async (deliveryId: string) => {
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive",
      });
      return;
    }
    setLoadingTracking(deliveryId);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPos([latitude, longitude]);
        const { error } = await supabase.from("delivery_tracking").insert([
          {
            delivery_id: deliveryId,
            latitude,
            longitude,
            status_update: "driver",
            created_at: new Date().toISOString(),
          },
        ]);
        if (error) {
          toast({
            title: "Erreur",
            description: "Impossible d'envoyer la position",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Position mise à jour 📍",
            description: "Votre position GPS est partagée avec le client.",
          });
        }
        setLoadingTracking(null);
      },
      (err) => {
        toast({
          title: "Position introuvable",
          description: "Activez votre GPS pour le suivi.",
          variant: "destructive",
        });
        setLoadingTracking(null);
      }
    );
  };

  const exportToExcel = () => {
    const dataToExport = doneDeliveries.map(d => ({
      ID: d.id.slice(0, 8),
      Client: d.customer_name,
      Telephone: d.customer_phone,
      'Depart (Marchand)': d.pickup_address,
      Destination: d.delivery_address,
      Statut: d.status === 'delivered' ? 'Livré' : 'Annulé',
      Date: d.actual_delivery_time ? new Date(d.actual_delivery_time).toLocaleString() : 'N/A',
      Frais: d.delivery_fee
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique Livraisons");
    XLSX.writeFile(workbook, `Historique_Livreur_${new Date().toLocaleDateString()}.xlsx`);

    toast({
      title: "Export réussi ✅",
      description: "Votre historique a été téléchargé en Excel.",
    });
  };

  useEffect(() => {
    // Tenter d'avoir la position au chargement
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCurrentPos([pos.coords.latitude, pos.coords.longitude]);
      });
    }

    const interval = setInterval(fetchDeliveries, 30000);
    return () => clearInterval(interval);
  }, [fetchDeliveries]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
          <div className="p-2 bg-green-600 rounded-xl">
            <Truck className="h-7 w-7 text-white" />
          </div>
          Dashboard Livreur
        </h1>
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
          En ligne
        </Badge>
      </div>

      <div className="mb-8">
        <PremiumFeaturesDisplay />
      </div>

      <Card className="mb-8 p-6 shadow-sm border-slate-200">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-600" />
          Livraisons actives ({myDeliveries.length})
        </h2>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="animate-spin h-10 w-10 mb-2" />
            <p>Chargement des missions...</p>
          </div>
        ) : myDeliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white rounded-xl border-2 border-dashed border-slate-100">
            <Package className="h-12 w-12 mb-2 opacity-20" />
            <p className="font-medium">Aucune mission en cours</p>
            <p className="text-sm">Vérifiez les nouvelles commandes</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myDeliveries.map((delivery, index) => {
              const nextAction = getStatusNextAction(delivery.status);
              const isFirst = index === 0;

              return (
                <div key={delivery.id} className="group transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Info Card */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-mono font-medium text-slate-600">
                          ID: #{delivery.id.slice(0, 8)}
                        </span>
                        {getStatusBadge(delivery.status)}
                      </div>

                      <div className="grid gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-1 bg-amber-100 rounded-md">
                            <MapPin className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Récupération</p>
                            <p className="text-sm font-medium text-slate-700">{delivery.pickup_address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-1 bg-green-100 rounded-md">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Destination (Client)</p>
                            <p className="text-sm font-bold text-slate-900">{delivery.customer_name}</p>
                            <p className="text-sm text-slate-600">{delivery.delivery_address}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Button variant="outline" size="sm" className="h-8 text-xs border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 gap-2 px-3 shadow-sm rounded-lg" asChild>
                                <a href={`tel:${delivery.customer_phone}`}>
                                  <Phone className="h-3.5 w-3.5" />
                                  Appeler client
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-3">
                        {nextAction && (
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white shadow-md flex-1 md:flex-none py-6 text-base font-bold"
                            onClick={() => updateDeliveryStatus(delivery.id, nextAction.newStatus as Delivery["status"])}
                          >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            {nextAction.label}
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 flex-1 md:flex-none py-6 font-semibold"
                          asChild
                        >
                          <a href={`tel:${delivery.customer_phone}`}>
                            <Phone className="h-5 w-5 mr-2" />
                            Appeler client
                          </a>
                        </Button>

                        <Button
                          variant="link"
                          className="text-slate-500 hover:text-blue-600 flex-1 md:flex-none h-auto py-2"
                          onClick={() => sendTracking(delivery.id)}
                          disabled={loadingTracking === delivery.id}
                        >
                          {loadingTracking === delivery.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Navigation className="h-4 w-4 mr-2" />
                          )}
                          Envoyer Position
                        </Button>
                      </div>
                    </div>

                    {/* Right: Small Map for the driver */}
                    {isFirst && (
                      <div className="md:w-80 h-64 md:h-auto rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-200 min-h-[250px] relative z-0">
                        {currentPos ? (
                          <MapContainer
                            center={currentPos}
                            zoom={14}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                          >
                            <TileLayer
                              attribution='&copy; OpenStreetMap'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={currentPos}>
                              <Popup>Vous êtes ici</Popup>
                            </Marker>
                          </MapContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            <p className="text-sm px-4 text-center">Activez le GPS pour voir la carte interactive</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-6 shadow-sm border-slate-200">
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setHistoryOpen(!historyOpen)}
        >
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-700">
            <Clock className="h-5 w-5 text-slate-500" />
            Historique des missions
          </h2>
          <div className="flex items-center gap-3">
            {doneDeliveries.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  exportToExcel();
                }}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter Excel</span>
              </Button>
            )}
            {historyOpen ? (
              <ChevronUp className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            )}
          </div>
        </div>

        {historyOpen && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
            {isLoading ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="animate-spin h-5 w-5 text-green-600" /> Chargement…
              </div>
            ) : doneDeliveries.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg">
                Aucun historique disponible
              </div>
            ) : (
              <div className="space-y-4">
                {doneDeliveries.map((delivery) => (
                  <div key={delivery.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between hover:bg-white hover:shadow-sm transition-all border-l-4 border-l-green-500">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-700">#{delivery.id.slice(0, 8)}</span>
                        {getStatusBadge(delivery.status)}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{delivery.customer_name}</p>
                    </div>
                    {delivery.actual_delivery_time && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Terminé le</p>
                        <p className="text-[11px] font-medium text-slate-600">
                          {new Date(delivery.actual_delivery_time).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] font-bold text-green-600">{delivery.delivery_fee} CFA</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DriverDashboard;
