import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit' | 'refund' | 'bonus' | 'referral_reward';
  description: string;
  created_at: string;
}

export function useUserCredits() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch current user's credit balance
  const { data: balance = 0, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['userBalance', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data, error } = await (supabase.rpc('get_user_credit_balance' as any, {
        p_user_id: user.id,
      }) as any);
      if (error) throw error;
      return data || 0;
    },
    enabled: !!user,
  });

  // Fetch credit transactions for the current user
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['userCreditTransactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await (supabase
        .from('credit_transactions' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) as any);

      if (error) throw error;
      return data as CreditTransaction[];
    },
    enabled: !!user,
  });

  // Mutation to add credits (mocking payment for now)
  const addCreditsMutation = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description: string }) => {
      if (!user) throw new Error('Veuillez vous connecter.');

      const { data, error } = await (supabase.rpc('add_user_credits' as any, {
        p_user_id: user.id,
        p_amount: amount,
        p_type: 'credit',
        p_description: description,
      }) as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBalance', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['userCreditTransactions', user?.id] });
      toast.success('Compte rechargé avec succès.');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const refetchCredits = () => {
    queryClient.invalidateQueries({ queryKey: ['userBalance', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['userCreditTransactions', user?.id] });
  };

  return {
    balance,
    transactions,
    isLoading: isLoadingBalance || isLoadingTransactions,
    addCredits: addCreditsMutation.mutate,
    isAddingCredits: addCreditsMutation.isPending,
    refetchCredits,
  };
}
