
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  avatarUrl?: string;
  vehicleType?: string;
  zone?: string;
  role?: string;
  merchantName?: string;
  deliveryName?: string;
  clientName?: string;
  kycStatus?: string;
  rejectionReason?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  vehicleType?: string;
  zone?: string;
  avatarUrl?: string;
  merchantName?: string;
  deliveryName?: string;
  clientName?: string;
}

const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data ? {
    id: data.id,
    firstName: data.first_name || undefined,
    lastName: data.last_name || undefined,
    phone: data.phone || undefined,
    businessName: data.business_name || undefined,
    businessType: data.business_type || undefined,
    avatarUrl: data.avatar_url || undefined,
    vehicleType: data.vehicle_type || undefined,
    zone: data.zone || undefined,
    role: (data as any).role || undefined,
    merchantName: (data as any).merchant_name || undefined,
    deliveryName: (data as any).delivery_name || undefined,
    clientName: (data as any).client_name || undefined,
    kycStatus: data.kyc_status || undefined,
    rejectionReason: data.kyc_rejection_reason || undefined,
  } : null;
};

const updateUserProfile = async (userId: string, profileData: UpdateProfileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      phone: profileData.phone,
      business_name: profileData.businessName,
      business_type: profileData.businessType,
      vehicle_type: profileData.vehicleType,
      zone: profileData.zone,
      avatar_url: profileData.avatarUrl,
      merchant_name: profileData.merchantName,
      delivery_name: profileData.deliveryName,
      client_name: profileData.clientName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data;
};

export const useProfile = (userId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
  });

  const updateMutation = useMutation({
    mutationFn: (profileData: UpdateProfileData) => updateUserProfile(userId!, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du profil: " + errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
