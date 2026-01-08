
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TablesInsert } from "@/integrations/supabase/types";

// Service interface
export interface Service {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useServices = () => {
  const queryClient = useQueryClient();

  // Fetch all services (public: everyone can read, including non-auth)
  const {
    data: services = [],
    isLoading,
    refetch,
  } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Mutation: add new service (admin only)
  const addService = useMutation({
    mutationFn: async (service: TablesInsert<"services">) => {
      const { data, error } = await supabase
        .from("services")
        .insert([service])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["services"]});
    },
  });

  // Mutation: update service (admin only)
  const updateService = useMutation({
    mutationFn: async ({ id, ...update }: Partial<Service>) => {
      const { data, error } = await supabase
        .from("services")
        .update(update)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["services"]});
    },
  });

  // Mutation: delete service (admin only)
  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["services"]});
    },
  });

  return {
    services,
    isLoading,
    refetch,
    addService,
    updateService,
    deleteService,
  };
};
