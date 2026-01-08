
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  city?: string;
  postalCode?: string;
  address?: string;
  businessAddress?: string;
  businessCity?: string;
  businessPostalCode?: string;
  businessTaxId?: string;
  role?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  city?: string;
  postalCode?: string;
  address?: string;
  businessAddress?: string;
  businessCity?: string;
  businessPostalCode?: string;
  businessTaxId?: string;
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
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    businessName: data.business_name,
    businessType: data.business_type,
    city: data.city,
    postalCode: data.postal_code,
    address: data.address,
    businessAddress: data.business_address,
    businessCity: data.business_city,
    businessPostalCode: data.business_postal_code,
    businessTaxId: data.business_tax_id,
    role: data.role,
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
      city: profileData.city,
      postal_code: profileData.postalCode,
      address: profileData.address,
      business_address: profileData.businessAddress,
      business_city: profileData.businessCity,
      business_postal_code: profileData.businessPostalCode,
      business_tax_id: profileData.businessTaxId,
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
    onError: (error: any) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du profil",
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
