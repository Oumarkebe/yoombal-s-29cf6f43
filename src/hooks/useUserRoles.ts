
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

async function fetchUserRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

async function addUserRole({ userId, role }: { userId: string; role: string }) {
  // Prevent adding duplicate roles
  const { data: existing, error: selectError } = await supabase.from('user_roles').select('id').eq('user_id', userId).eq('role', role).maybeSingle();
  if (selectError) {
      throw new Error(selectError.message);
  }
  if (existing) {
      console.warn(`Le rôle '${role}' existe déjà pour l'utilisateur '${userId}'.`);
      return null;
  }

  const { data, error } = await supabase.from('user_roles').insert({ user_id: userId, role }).select();
  if (error) throw new Error(error.message);
  return data;
}

async function removeUserRole({ userId, role }: { userId: string; role: string }) {
    const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

    if (error) throw new Error(error.message);
    return true;
}

const ROLE_PRIORITY = ["admin", "marchand", "livreur", "client"];

const ROLE_TRANSLATION: { [key: string]: string } = {
  admin: "admin",
  marchand: "merchant",
  livreur: "driver",
  client: "client",
};

async function syncProfileRole(userId: string, queryClient: any) {
  console.log(`[syncProfileRole] Starting for userId: ${userId}`);
  // Get all current roles for the user from user_roles table
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (rolesError) {
    console.error("[syncProfileRole] Failed to fetch roles for profile sync:", rolesError);
    return;
  }
  console.log(`[syncProfileRole] Found roles (French):`, userRoles);

  const roleNames = userRoles.map(r => r.role);
  const newPrimaryFrenchRole = ROLE_PRIORITY.find(p => roleNames.includes(p)) || 'client';
  const newPrimaryRole = ROLE_TRANSLATION[newPrimaryFrenchRole] || 'client';
  console.log(`[syncProfileRole] New primary role determined (French): ${newPrimaryFrenchRole} -> (English): ${newPrimaryRole}`);

  // Get current primary role from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    console.error("[syncProfileRole] Failed to fetch profile for role sync:", profileError);
    return;
  }
  console.log(`[syncProfileRole] Current profile role (English): ${profile?.role}`);


  // Update profile if the primary role has changed
  if (profile && profile.role !== newPrimaryRole) {
    console.log(`[syncProfileRole] Role change detected. Updating profile from '${profile.role}' to '${newPrimaryRole}'.`);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newPrimaryRole })
      .eq('id', userId);

    if (updateError) {
      toast.error(`La mise à jour du rôle principal a échoué: ${updateError.message}`);
      console.error("[syncProfileRole] Profile update failed:", updateError);
    } else {
      toast.info(`Rôle principal de l'utilisateur mis à jour en '${newPrimaryRole}'.`);
      console.log(`[syncProfileRole] Profile update successful.`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  } else {
    console.log(`[syncProfileRole] No role change needed. Current role: '${profile?.role}', New primary role: '${newPrimaryRole}'.`);
  }
}

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

    const addRoleMutation = useMutation<any, Error, string>({
        mutationFn: (role: string) => {
            if (!realUserId) throw new Error("Utilisateur non trouvé");
            return addUserRole({ userId: realUserId, role });
        },
        onSuccess: (data, role) => {
            queryClient.invalidateQueries({ queryKey: ['roles', realUserId] });
            if (data) {
                toast.success(`Le rôle '${role}' a été ajouté avec succès.`);
                if (realUserId) {
                  syncProfileRole(realUserId, queryClient);
                }
            }
        },
        onError: (error, role) => {
            toast.error(`Erreur lors de l'ajout du rôle '${role}': ${error.message}`);
        },
    });

    const removeRoleMutation = useMutation<any, Error, string>({
        mutationFn: (role: string) => {
            if (!realUserId) throw new Error("Utilisateur non trouvé");
            return removeUserRole({ userId: realUserId, role });
        },
        onSuccess: (data, role) => {
            queryClient.invalidateQueries({ queryKey: ['roles', realUserId] });
            toast.success(`Le rôle '${role}' a été retiré avec succès.`);
            if (realUserId) {
              syncProfileRole(realUserId, queryClient);
            }
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
