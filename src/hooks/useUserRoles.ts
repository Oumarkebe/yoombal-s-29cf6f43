
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

async function fetchUserRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as UserRole[];
}

async function addUserRole({ userId, role }: { userId: string; role: AppRole }) {
  // Prevent adding duplicate roles
  const { data: existing, error: selectError } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', userId)
    .eq('role', role)
    .maybeSingle();
    
  if (selectError) {
      throw new Error(selectError.message);
  }
  if (existing) {
      console.warn(`Le rôle '${role}' existe déjà pour l'utilisateur '${userId}'.`);
      return null;
  }

  const { data, error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role })
    .select();
    
  if (error) throw new Error(error.message);
  return data;
}

async function removeUserRole({ userId, role }: { userId: string; role: AppRole }) {
    const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

    if (error) throw new Error(error.message);
    return true;
}

const ROLE_PRIORITY: AppRole[] = ["admin", "merchant", "driver", "moderator", "user"];

export function useUserRoles({ userId }: { userId?: string } = {}) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const realUserId = userId || user?.id;

    const { data: roles = [], isLoading, error } = useQuery<UserRole[], Error>({
        queryKey: ['roles', realUserId],
        queryFn: () => {
            if (!realUserId) return Promise.resolve([]);
            return fetchUserRoles(realUserId);
        },
        enabled: !!realUserId,
    });

    const addRoleMutation = useMutation<unknown, Error, AppRole>({
        mutationFn: (role: AppRole) => {
            if (!realUserId) throw new Error("Utilisateur non trouvé");
            return addUserRole({ userId: realUserId, role });
        },
        onSuccess: (data, role) => {
            queryClient.invalidateQueries({ queryKey: ['roles', realUserId] });
            if (data) {
                toast.success(`Le rôle '${role}' a été ajouté avec succès.`);
            }
        },
        onError: (error, role) => {
            toast.error(`Erreur lors de l'ajout du rôle '${role}': ${error.message}`);
        },
    });

    const removeRoleMutation = useMutation<unknown, Error, AppRole>({
        mutationFn: (role: AppRole) => {
            if (!realUserId) throw new Error("Utilisateur non trouvé");
            return removeUserRole({ userId: realUserId, role });
        },
        onSuccess: (data, role) => {
            queryClient.invalidateQueries({ queryKey: ['roles', realUserId] });
            toast.success(`Le rôle '${role}' a été retiré avec succès.`);
        },
        onError: (error, role) => {
            toast.error(`Erreur lors de la suppression du rôle '${role}': ${error.message}`);
        },
    });

    return {
        roles,
        isLoading,
        error: error,
        addRole: addRoleMutation.mutateAsync,
        removeRole: removeRoleMutation.mutateAsync,
        isPending: addRoleMutation.isPending || removeRoleMutation.isPending,
    };
}
