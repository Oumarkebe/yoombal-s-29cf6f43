
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Navigation, CheckCircle, Loader2, Clock } from "lucide-react";
import { useDeliveries, Delivery } from "@/hooks/useDeliveries";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
            title: "Position envoyée",
            description: "Votre position a été envoyée.",
          });
        }
        setLoadingTracking(null);
      },
      (err) => {
        toast({
          title: "Impossible de récupérer la position",
          description: err.message || "Erreur inconnue",
          variant: "destructive",
        });
        setLoadingTracking(null);
      }
    );
  };

  useEffect(() => {
    // Facultatif : auto-refresh des livraisons toutes les 30s
    const interval = setInterval(fetchDeliveries, 30000);
    return () => clearInterval(interval);
  }, [fetchDeliveries]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Truck className="h-6 w-6 text-green-600" />
        Tableau de bord Livreur
      </h1>

      <Card className="mb-8 p-6">
        <h2 className="text-lg font-semibold mb-3">Mes livraisons en cours</h2>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" /> Chargement…
          </div>
        ) : myDeliveries.length === 0 ? (
          <div className="text-gray-500">Aucune livraison en cours</div>
        ) : (
          <div className="space-y-4">
            {myDeliveries.map((delivery) => {
              const nextAction = getStatusNextAction(delivery.status);
              return (
                <Card key={delivery.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-md">{delivery.id.slice(0, 8)}</span>
                    {getStatusBadge(delivery.status)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Client :</strong> {delivery.customer_name} <br />
                    <strong>Tél :</strong> {delivery.customer_phone} <br />
                    <strong>Adresse livraison :</strong> {delivery.delivery_address} <br />
                    <strong>Adresse récupération :</strong> {delivery.pickup_address} <br />
                    <strong>Frais :</strong> {delivery.delivery_fee} CFA
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendTracking(delivery.id)}
                      disabled={loadingTracking === delivery.id}
                    >
                      {loadingTracking === delivery.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Navigation className="h-4 w-4 mr-1" />
                      )}
                      Envoyer ma position
                    </Button>
                    {nextAction && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                          updateDeliveryStatus(
                            delivery.id,
                            nextAction.newStatus as Delivery["status"] // Cast for TypeScript
                          )
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {nextAction.label}
                      </Button>
                    )}
                  </div>
                  {delivery.estimated_delivery_time && (
                    <div className="flex gap-2 items-center mt-2 text-xs text-gray-400">
                      <Clock className="h-4 w-4" />
                      ETA: {new Date(delivery.estimated_delivery_time).toLocaleTimeString()}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="mb-8 p-6">
        <h2 className="text-lg font-semibold mb-3">Historique de mes livraisons</h2>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" /> Chargement…
          </div>
        ) : doneDeliveries.length === 0 ? (
          <div className="text-gray-500">Aucun historique</div>
        ) : (
          <div className="space-y-3">
            {doneDeliveries.map((delivery) => (
              <Card key={delivery.id} className="p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{delivery.id.slice(0, 8)}</span>
                  {getStatusBadge(delivery.status)}
                </div>
                <div className="text-xs text-gray-600">
                  <strong>Client :</strong> {delivery.customer_name}
                </div>
                {delivery.actual_delivery_time && (
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Livrée le {new Date(delivery.actual_delivery_time).toLocaleString()}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DriverDashboard;
