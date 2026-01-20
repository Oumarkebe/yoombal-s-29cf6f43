import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Course {
  id: string;
  delivery_id: string;
  service_id?: string | null;
  driver_id?: string | null;
  status: string;
  started_at?: string | null;
  ended_at?: string | null;
  created_at: string;
  updated_at: string;
}

export const useCourses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all visible courses for user
  const {
    data: courses = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['courses', user?.id],
    queryFn: async (): Promise<Course[]> => {
      if (!user) return [];
      const { data, error } = await (supabase.from('courses' as any) as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Course[];
    },
    enabled: !!user,
  });

  // Create a course (admin or assignation)
  const addCourse = useMutation({
    mutationFn: async (course: Partial<Course>) => {
      const { data, error } = await (supabase.from('courses' as any) as any)
        .insert([course])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  // Update
  const updateCourse = useMutation({
    mutationFn: async ({ id, ...update }: Partial<Course>) => {
      const { data, error } = await (supabase.from('courses' as any) as any)
        .update(update)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  // Delete
  const deleteCourse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from('courses' as any) as any).delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return {
    courses,
    isLoading,
    refetch,
    addCourse,
    updateCourse,
    deleteCourse,
  };
};
