
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Driver {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  vehicle_type: string | null;
  zone: string | null;
  business_name: string | null;
  created_at: string;
}

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDrivers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'delivery')
        .order('created_at');

      if (error) {
        console.error('Error fetching drivers:', error);
        throw error;
      }

      setDrivers(data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les livreurs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDriverName = (driver: Driver) => {
    if (driver.business_name) {
      return driver.business_name;
    }
    if (driver.first_name && driver.last_name) {
      return `${driver.first_name} ${driver.last_name}`;
    }
    return 'Livreur Yoombal';
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    drivers,
    isLoading,
    fetchDrivers,
    getDriverName
  };
};
