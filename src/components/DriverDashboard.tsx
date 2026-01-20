import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Truck,
  Navigation,
  CheckCircle,
  Loader2,
  Clock,
  MapPin,
  Phone,
  Package,
  Download,
  ChevronDown,
  ChevronUp,
  Camera,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useDeliveries, Delivery } from '@/hooks/useDeliveries';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DeliveryMap } from '@/components/delivery/DeliveryMap';
import { mockZones, mockDeliveries } from '@/data/mockDeliveryData';

const getStatusBadge = (status: string) => {
  switch (status) {
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
      return <Badge variant="outline">Inconnu</Badge>;
  }
};

const getStatusNextAction = (status: Delivery['status']) => {
  switch (status) {
    case 'assigned':
      return { label: 'Marquer comme récupérée', newStatus: 'picked_up' };
    case 'picked_up':
      return { label: 'En transit', newStatus: 'in_transit' };
    case 'in_transit':
      return { label: 'Marquer comme livrée', newStatus: 'delivered' };
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
  const [podModalOpen, setPodModalOpen] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [podStep, setPodStep] = useState<'signature' | 'photo' | 'confirm'>('signature');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmittingPOD, setIsSubmittingPOD] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Import SignaturePad locally if needed or at top level
  const DeliverySignaturePad = React.lazy(
    () => import('@/components/delivery/DeliverySignaturePad')
  );

  // ... (filters)
  const myDeliveries = deliveries.filter(
    (d) => d.driver_id === user?.id && ['assigned', 'picked_up', 'in_transit'].includes(d.status)
  );

  const doneDeliveries = deliveries.filter(
    (d) => d.driver_id === user?.id && ['delivered', 'cancelled'].includes(d.status)
  );

  // ... (tracking logic)
  const sendTracking = async (deliveryId: string) => {
    if (!navigator.geolocation) {
      toast({ title: 'Géolocalisation non supportée', variant: 'destructive' });
      return;
    }

    // Explicitly cast to any to avoid TS error with distanceFilter if types aren't up to date
    const options: any = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
      distanceFilter: 10
    };

    setLoadingTracking(deliveryId);
    toast({ title: 'Suivi GPS activé', description: 'Votre position est envoyée en temps réel.' });

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, speed, heading } = position.coords;
        setCurrentPos([latitude, longitude]);

        console.log('Tracking update:', { latitude, longitude, speed, heading });

        const { error } = await supabase.from('delivery_tracking').insert([
          {
            delivery_id: deliveryId,
            latitude,
            longitude,
            speed: speed ? speed * 3.6 : 0, // km/h
            heading: heading || 0,
            status_update: 'driver',
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) {
          console.error("Tracking error:", error);
        }

        setLoadingTracking(null);
      },
      (err) => {
        console.error('GPS Error', err);
        toast({ title: 'Position introuvable', description: err.message, variant: 'destructive' });
        setLoadingTracking(null);
      },
      options
    );

    // In a real app, we would store watchId to clear it later (e.g. on unmount or stop button)
  };

  const handleActionClick = (deliveryId: string, action: { newStatus: string }) => {
    if (action.newStatus === 'delivered') {
      setSelectedDeliveryId(deliveryId);
      setPodModalOpen(true);
      setPodStep('signature');
      setSignatureData(null);
      setPhotoFile(null);
    } else {
      updateDeliveryStatus(deliveryId, action.newStatus as any);
    }
  };

  const handleSignatureSave = (data: string) => {
    setSignatureData(data);
    setPodStep('photo');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPodStep('confirm');
    }
  };

  const submitPOD = async () => {
    if (!selectedDeliveryId || !signatureData) return;
    setIsSubmittingPOD(true);

    try {
      let signatureUrl = null;
      let proofPhotoUrl = null;

      // Upload Signature
      const sigBlob = await (await fetch(signatureData)).blob();
      const sigPath = `signatures/${selectedDeliveryId}_${Date.now()}.png`;
      const { error: sigError } = await supabase.storage
        .from('delivery-proofs')
        .upload(sigPath, sigBlob);
      if (sigError) throw sigError;
      const { data: sigPublic } = supabase.storage.from('delivery-proofs').getPublicUrl(sigPath);
      signatureUrl = sigPublic.publicUrl;

      // Upload Photo
      if (photoFile) {
        const photoPath = `photos/${selectedDeliveryId}_${Date.now()}_${photoFile.name}`;
        const { error: photoError } = await supabase.storage
          .from('delivery-proofs')
          .upload(photoPath, photoFile);
        if (photoError) throw photoError;
        const { data: photoPublic } = supabase.storage
          .from('delivery-proofs')
          .getPublicUrl(photoPath);
        proofPhotoUrl = photoPublic.publicUrl;
      }

      await updateDeliveryStatus(
        selectedDeliveryId,
        'delivered',
        undefined,
        signatureUrl,
        proofPhotoUrl || undefined
      );

      setPodModalOpen(false);
      toast({ title: 'Livraison terminée !', description: 'Preuves enregistrées avec succès.' });
    } catch (error) {
      console.error('POD Error:', error);
      toast({
        title: 'Erreur',
        description: "Échec de l'envoi des preuves.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingPOD(false);
    }
  };

  // ... (exportToExcel and useEffect logic)
  const exportToExcel = () => {
    // ... (keep existing logic)
    const data = doneDeliveries.map((d) => ({
      ID: d.id,
      Client: d.customer_name,
      Statut: d.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historique');
    XLSX.writeFile(wb, 'historique.xlsx');
  };

  useEffect(() => {
    const interval = setInterval(fetchDeliveries, 30000);
    return () => clearInterval(interval);
  }, [fetchDeliveries]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-gray-50 min-h-screen">
      {/* ... (Header) */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
          <div className="p-2 bg-green-600 rounded-xl">
            <Truck className="h-7 w-7 text-white" />
          </div>
          {user?.delivery_name || 'Dashboard Livreur'}
        </h1>
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
          En ligne
        </Badge>
      </div>

      <div className="mb-8">
        <DeliveryMap zones={mockZones} deliveries={mockDeliveries} />
      </div>

      {/* ... (Active Deliveries) */}
      <Card className="mb-8 p-6 shadow-sm border-slate-200">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-600" />
          Livraisons actives ({myDeliveries.length})
        </h2>
        {/* ... (List implementation similar to before but using handleActionClick) */}
        <div className="space-y-6">
          {myDeliveries.map((delivery) => {
            const nextAction = getStatusNextAction(delivery.status);
            return (
              <div
                key={delivery.id}
                className="group transition-all p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                        #{delivery.id.slice(0, 8)}
                      </span>
                      {getStatusBadge(delivery.status)}
                    </div>
                    <h3 className="font-bold text-lg mt-2">{delivery.customer_name}</h3>
                    <p className="text-slate-500 text-sm">{delivery.delivery_address}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${delivery.customer_phone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="flex gap-3 mt-4">
                  {nextAction && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 font-bold"
                      onClick={() => handleActionClick(delivery.id, nextAction)}
                    >
                      {nextAction.label}
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => sendTracking(delivery.id)}
                    disabled={loadingTracking === delivery.id}
                  >
                    {loadingTracking === delivery.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Navigation className="mr-2 h-4 w-4" />
                    )}
                    GPS
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* POD Modal Overlay */}
      {podModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-center">Preuve de Livraison</h2>
              <div className="flex justify-center gap-2 mt-2">
                <div
                  className={`h-1 w-8 rounded-full ${podStep === 'signature' ? 'bg-green-600' : 'bg-slate-200'}`}
                />
                <div
                  className={`h-1 w-8 rounded-full ${podStep === 'photo' ? 'bg-green-600' : 'bg-slate-200'}`}
                />
                <div
                  className={`h-1 w-8 rounded-full ${podStep === 'confirm' ? 'bg-green-600' : 'bg-slate-200'}`}
                />
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {podStep === 'signature' && (
                <React.Suspense
                  fallback={
                    <div className="h-64 flex items-center justify-center">Chargement...</div>
                  }
                >
                  <DeliverySignaturePad
                    onSave={handleSignatureSave}
                    onCancel={() => setPodModalOpen(false)}
                  />
                </React.Suspense>
              )}

              {podStep === 'photo' && (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Photo du colis</h3>
                    <p className="text-slate-500 text-sm mb-6">
                      Prenez une photo du colis déposé devant la porte ou remis au client.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Prendre une photo
                    </Button>
                    <Button variant="ghost" className="mt-4" onClick={() => setPodStep('confirm')}>
                      Ignorer cette étape
                    </Button>
                  </div>
                </div>
              )}

              {podStep === 'confirm' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-sm mb-3">Récapitulatif</h4>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm">Signature enregistrée</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${photoFile ? 'bg-green-100' : 'bg-amber-100'}`}
                      >
                        <Camera
                          className={`h-4 w-4 ${photoFile ? 'text-green-600' : 'text-amber-600'}`}
                        />
                      </div>
                      <span className="text-sm">
                        {photoFile ? 'Photo ajoutée' : 'Pas de photo'}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-bold shadow-lg shadow-green-200"
                    onClick={submitPOD}
                    disabled={isSubmittingPOD}
                  >
                    {isSubmittingPOD ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="mr-2" />
                    )}
                    Confirmer la livraison
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setPodStep('photo')}
                    disabled={isSubmittingPOD}
                  >
                    Retour
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ... (History Section) */}
      <Card className="p-6">
        <div
          onClick={() => setHistoryOpen(!historyOpen)}
          className="flex justify-between items-center cursor-pointer"
        >
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5" /> Historique
          </h2>
          <ChevronDown className={`transition-transform ${historyOpen ? 'rotate-180' : ''}`} />
        </div>
        {historyOpen && (
          <div className="mt-4 space-y-3">
            {doneDeliveries.map((d) => (
              <div key={d.id} className="flex justify-between p-3 bg-white border rounded-lg">
                <div>
                  <div className="font-bold text-sm">#{d.id.slice(0, 8)}</div>
                  <div className="text-xs text-slate-500">{d.customer_name}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    {d.status === 'delivered' ? 'Livré' : 'Annulé'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(d.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" onClick={exportToExcel}>
              <Download className="mr-2 h-4 w-4" /> Excel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DriverDashboard;
