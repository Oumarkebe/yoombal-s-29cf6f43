import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Delivery {
  id: string;
  order_id: string;
  customer_id: string;
  merchant_id: string;
  driver_id?: string;
  pickup_address: string;
  delivery_address: string;
  customer_phone: string;
  customer_name: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  delivery_fee: number;
  distance_km?: number;
  notes?: string;
  signature_url?: string;
  proof_photo_url?: string;
  created_at: string;
  updated_at: string;
  driver_profile?: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  };
  last_location?: {
    lat: number;
    lng: number;
    speed?: number;
    heading?: number;
    updated_at: string;
  };
}

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDeliveries = async () => {
    try {
      setIsLoading(true);

      let query = supabase.from('deliveries').select(`*`).order('created_at', { ascending: false });

      const { data: deliveriesData, error: deliveriesError } = await query;

      if (deliveriesError) {
        console.error('Error fetching deliveries:', deliveriesError);
        throw deliveriesError;
      }

      // Get driver profiles for deliveries with drivers
      const driverIds = deliveriesData?.filter((d) => d.driver_id).map((d) => d.driver_id) || [];

      let driverProfiles = [];
      if (driverIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, phone')
          .in('id', driverIds);

        if (profilesError) {
          console.error('Error fetching driver profiles:', profilesError);
        } else {
          driverProfiles = profilesData || [];
        }
      }

      // Get latest tracking info for active deliveries
      const activeDeliveryIds = deliveriesData
        ?.filter((d) => ['in_transit', 'picked_up'].includes(d.status))
        .map((d) => d.id) || [];

      let trackingMap = new Map();
      if (activeDeliveryIds.length > 0) {
        // We fetch the latest tracking point for each active delivery
        // This is a simplified approach; proper approach might use a materialized view or custom RPC
        const { data: trackingData, error: trackingError } = await (supabase as any)
          .from('delivery_tracking')
          .select('delivery_id, latitude, longitude, status_update, notes, created_at')
          .in('delivery_id', activeDeliveryIds)
          .order('created_at', { ascending: false });

        if (!trackingError && trackingData) {
          // Keep only the latest per delivery (trackingData is ordered desc)
          trackingData.forEach((t: any) => {
            if (!trackingMap.has(t.delivery_id)) {
              trackingMap.set(t.delivery_id, {
                lat: t.latitude,
                lng: t.longitude,
                speed: 0, // Not available in schema
                heading: 0, // Not available in schema
                updated_at: t.created_at
              });
            }
          });
        }
      }

      // Create a map of driver profiles
      const driverProfilesMap = new Map();
      driverProfiles.forEach((profile) => {
        driverProfilesMap.set(profile.id, profile);
      });

      // Transform deliveries data with proper type casting
      const transformedDeliveries: Delivery[] = (deliveriesData || []).map((delivery) => ({
        ...delivery,
        status: delivery.status as Delivery['status'],
        driver_profile: delivery.driver_id ? driverProfilesMap.get(delivery.driver_id) : undefined,
        last_location: trackingMap.get(delivery.id)
      }));

      setDeliveries(transformedDeliveries);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les livraisons',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDelivery = async (
    deliveryData: Omit<Delivery, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .insert([deliveryData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Livraison créée avec succès',
      });

      await fetchDeliveries();
      return data;
    } catch (error) {
      console.error('Error creating delivery:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la livraison',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateDeliveryStatus = async (
    deliveryId: string,
    status: Delivery['status'],
    notes?: string,
    signatureUrl?: string,
    proofPhotoUrl?: string
  ) => {
    try {
      const updateData: any = { status };

      if (status === 'delivered') {
        updateData.actual_delivery_time = new Date().toISOString();
      }

      if (notes) updateData.notes = notes;
      if (signatureUrl) updateData.signature_url = signatureUrl;
      if (proofPhotoUrl) updateData.proof_photo_url = proofPhotoUrl;

      const { error } = await supabase.from('deliveries').update(updateData).eq('id', deliveryId);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Statut de livraison mis à jour',
      });

      await fetchDeliveries();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    }
  };

  const assignDriver = async (deliveryId: string, driverId: string) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({
          driver_id: driverId,
          status: 'assigned',
          estimated_delivery_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        })
        .eq('id', deliveryId);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Livreur assigné avec succès',
      });

      await fetchDeliveries();
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'assigner le livreur",
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchDeliveries();

      // Setup realtime subscription
      const channel = supabase
        .channel('public:deliveries')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'deliveries' }, () => {
          fetchDeliveries();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    deliveries,
    isLoading,
    fetchDeliveries,
    createDelivery,
    updateDeliveryStatus,
    assignDriver,
  };
};
