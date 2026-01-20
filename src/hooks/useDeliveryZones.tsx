import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DeliveryZone {
  id: string;
  name: string;
  areas: string[];
  base_fee: number;
  price_per_km: number;
  max_delivery_time_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useDeliveryZones = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchZones = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching delivery zones:', error);
        throw error;
      }

      setZones(data || []);
    } catch (error) {
      console.error('Error fetching delivery zones:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les zones de livraison',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDeliveryFee = (zoneId: string, distance?: number) => {
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return 0;

    return zone.base_fee + (distance ? distance * zone.price_per_km : 0);
  };

  const getZoneByArea = (area: string) => {
    return zones.find((zone) =>
      zone.areas.some(
        (zoneArea) =>
          zoneArea.toLowerCase().includes(area.toLowerCase()) ||
          area.toLowerCase().includes(zoneArea.toLowerCase())
      )
    );
  };

  useEffect(() => {
    fetchZones();
  }, []);

  return {
    zones,
    isLoading,
    fetchZones,
    calculateDeliveryFee,
    getZoneByArea,
  };
};
