import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { Json } from '@/integrations/supabase/types';

export type DashboardSettings = {
  showUserCount: boolean;
  showProductCount: boolean;
  showOrderCount: boolean;
  showTotalRevenue: boolean;
};

export type PublicStatsSettings = {
  showPublicStats: boolean;
  showUserCount: boolean;
  showMerchantCount: boolean;
  showDeliveryCount: boolean;
};

export type MerchantPageSettings = {
  showStats: boolean;
  satisfactionRate: number;
};

export type PricingPlan = {
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  highlight: boolean;
};

export type SettingsData = {
  siteName?: string;
  contactEmail?: string;
  stripePk?: string;
  stripeSk?: string;
  dashboard?: DashboardSettings;
  publicStats?: PublicStatsSettings;
  merchantPage?: MerchantPageSettings;
  pricingPlans?: PricingPlan[];
  ai_keys?: any; // Added ai_keys
};

// Fetch all settings
async function fetchSettings(): Promise<SettingsData> {
  const { data, error } = await (supabase.from('platform_settings' as any) as any).select(
    'key, value'
  );
  if (error) throw new Error(error.message);

  const typedData = (data || []) as Array<{ key: string; value: any }>;

  const settings: SettingsData = {};

  const generalData = typedData.find((item) => item.key === 'general');
  if (
    generalData &&
    generalData.value &&
    typeof generalData.value === 'object' &&
    !Array.isArray(generalData.value)
  ) {
    const value = generalData.value as { siteName?: string; contactEmail?: string };
    settings.siteName = value.siteName;
    settings.contactEmail = value.contactEmail;
  }

  const paymentData = typedData.find((item) => item.key === 'payment');
  if (
    paymentData &&
    paymentData.value &&
    typeof paymentData.value === 'object' &&
    !Array.isArray(paymentData.value)
  ) {
    const value = paymentData.value as { stripePk?: string };
    settings.stripePk = value.stripePk;
  }

  // Fetch AI Keys
  const aiKeysData = typedData.find((item) => item.key === 'ai_keys');
  if (aiKeysData && aiKeysData.value) {
    settings.ai_keys = aiKeysData.value;
  }

  const dashboardData = typedData.find((item) => item.key === 'dashboard');
  let dashboardSettings: DashboardSettings | undefined;
  if (
    dashboardData &&
    dashboardData.value &&
    typeof dashboardData.value === 'object' &&
    !Array.isArray(dashboardData.value)
  ) {
    dashboardSettings = dashboardData.value as DashboardSettings;
  }

  settings.dashboard = {
    showUserCount: dashboardSettings?.showUserCount ?? true,
    showProductCount: dashboardSettings?.showProductCount ?? true,
    showOrderCount: dashboardSettings?.showOrderCount ?? true,
    showTotalRevenue: dashboardSettings?.showTotalRevenue ?? true,
  };

  const publicStatsData = typedData.find((item) => item.key === 'public_stats');
  let publicStatsSettings: PublicStatsSettings | undefined;
  if (
    publicStatsData &&
    publicStatsData.value &&
    typeof publicStatsData.value === 'object' &&
    !Array.isArray(publicStatsData.value)
  ) {
    publicStatsSettings = publicStatsData.value as PublicStatsSettings;
  }

  settings.publicStats = {
    showPublicStats: publicStatsSettings?.showPublicStats ?? false,
    showUserCount: publicStatsSettings?.showUserCount ?? true,
    showMerchantCount: publicStatsSettings?.showMerchantCount ?? true,
    showDeliveryCount: publicStatsSettings?.showDeliveryCount ?? true,
  };

  const merchantPageData = typedData.find((item) => item.key === 'merchant_page');
  let merchantPageSettings: MerchantPageSettings | undefined;
  if (
    merchantPageData &&
    merchantPageData.value &&
    typeof merchantPageData.value === 'object' &&
    !Array.isArray(merchantPageData.value)
  ) {
    merchantPageSettings = merchantPageData.value as MerchantPageSettings;
  }

  settings.merchantPage = {
    showStats: merchantPageSettings?.showStats ?? true,
    satisfactionRate: merchantPageSettings?.satisfactionRate ?? 98,
  };

  const pricingData = typedData.find((item) => item.key === 'pricing_plans');
  if (pricingData && pricingData.value && Array.isArray(pricingData.value)) {
    settings.pricingPlans = pricingData.value as PricingPlan[];
  } else {
    settings.pricingPlans = [
      {
        title: 'Starter',
        price: '0',
        description: 'Idéal pour débuter sans engagement',
        features: [
          'Boutique en ligne gratuite',
          'Paiement mobile & carte',
          'Support email',
          'Accès au BNPL (sur demande)',
        ],
        cta: 'Créer mon compte',
        ctaLink: '/register?role=merchant',
        highlight: false,
      },
      {
        title: 'Pro',
        price: '9 900',
        description: 'Pour les marchands en croissance',
        features: [
          'Toutes les fonctionnalités Starter',
          'Génération de description par IA',
          'Support prioritaire',
          'Statistiques avancées',
          'Activation BNPL prioritaire',
        ],
        cta: 'Essayer Pro',
        ctaLink: '/register?role=merchant',
        highlight: true,
      },
      {
        title: 'Entreprise',
        price: 'Sur devis',
        description: 'Pour les grandes entreprises et franchises',
        features: [
          'Fonctionnalités Pro +',
          'Gestion multi-boutiques',
          'Intégration API',
          'Accompagnement dédié',
        ],
        cta: 'Contactez-nous',
        ctaLink: '/contact',
        highlight: false,
      },
    ];
  }

  return settings;
}

// Update a setting
async function updateSetting({ key, value }: { key: string; value: any }) {
  const { data, error } = await (supabase.from('platform_settings' as any) as any)
    .upsert({ key, value }, { onConflict: 'key' })
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export function usePlatformSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['platformSettings'],
    queryFn: fetchSettings,
  });

  const mutation = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformSettings'] });
      toast({
        title: 'Succès',
        description: 'Paramètres mis à jour avec succès.',
      });
    },
    onError: (err: Error) => {
      toast({
        title: 'Erreur',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSetting: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
