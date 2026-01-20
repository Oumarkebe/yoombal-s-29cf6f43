import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  Shield,
  CreditCard,
  Sparkles,
  AlertTriangle,
  Save,
  CheckCircle,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { adminFeatureService, EffectiveFeatureState } from '@/services/adminFeatureService';
import { adminPricingService } from '@/services/adminPricingService';

interface UserDetailModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailModal({ userId, isOpen, onClose }: UserDetailModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');

  // 1. Fetch Basic Profile & Role
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['adminUserProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (profileError) throw profileError;

      // Fetch role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle as role might be missing for some old users

      // Fetch email (safe way via RPC or simpler if using auth.users which is not accessible directly via client usually)
      // We will skip email for now if RLS prevents it, or assume it's passed from the table row.
      // Ideally we would have passed the full user object, but fetching ensures freshness.

      return { ...profileData, role: roleData?.role || 'user' };
    },
    enabled: !!userId && isOpen,
  });

  // 2. Fetch Active Subscription
  const { data: subscription, isLoading: isSubLoading } = useQuery({
    queryKey: ['adminUserSubscription', userId],
    queryFn: async () => {
      if (!userId) return null;
      // Fetch Active Subscription
      const { data, error } = await supabase
        .from('user_subscriptions' as any)
        .select('*, plan:premium_plans(*)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.warn('Sub fetch error', error);
        return null;
      }

      // Explicitly Type Cast the join result
      type JoinedSub = {
        id: string;
        plan_id: string;
        plan?: { name: string; features: string[] };
      };

      return data as unknown as JoinedSub;
    },
    enabled: !!userId && isOpen,
  });

  // 3. Fetch All Plans (for dropdown)
  const { data: allPlans } = useQuery({
    queryKey: ['adminAllPlans'],
    queryFn: adminPricingService.getAllPlans,
    enabled: isOpen,
  });

  // 4. Fetch Effective Features
  const {
    data: featureStates,
    isLoading: isFeaturesLoading,
    refetch: refetchFeatures,
  } = useQuery({
    queryKey: ['adminUserFeatures', userId],
    queryFn: async () => {
      if (!userId) return [];
      // We need the plan features to calculate inheritance
      // If subscription is not loaded yet, this might run with empty plan features, so we depend on sub.
      // However, we can also fetch it validly if no sub exists.
      const currentPlanFeatures = subscription?.plan?.features || [];
      return adminFeatureService.getUserEffectiveFeatures(userId, currentPlanFeatures);
    },
    enabled: !!userId && isOpen && !isSubLoading, // Wait for sub to load to get accurate defaults
  });

  // --- Mutations ---

  const updateRoleMutation = useMutation({
    mutationFn: async (newRole: string) => {
      if (!userId) return;

      // Since we are setting a primary role via this modal, and 'user_roles' allows multiple,
      // we first remove all existing roles for this user to ensure we "set" the selected one.
      // This matches the single-select UI behavior. For granular control, use RolesModal.
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole as any });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Rôle mis à jour');
      queryClient.invalidateQueries({ queryKey: ['adminUserProfile', userId] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] }); // Refresh main table
    },
    onError: (e) => toast.error('Erreur mise à jour rôle: ' + e.message),
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!userId) return;

      if (subscription?.id) {
        // Update existing
        const { error } = await supabase
          .from('user_subscriptions' as any)
          .update({ plan_id: planId, updated_at: new Date().toISOString() })
          .eq('id', subscription.id);
        if (error) throw error;
      } else {
        // Create new (Force admin add)
        const { error } = await supabase.from('user_subscriptions' as any).insert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          billing_period: 'monthly',
          amount_paid: 0,
          payment_method: 'admin_override', // Explicit tracking
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Plan mis à jour');
      queryClient.invalidateQueries({ queryKey: ['adminUserSubscription', userId] });
      queryClient.invalidateQueries({ queryKey: ['adminUserFeatures', userId] }); // Features depend on plan
    },
    onError: (e) => toast.error('Erreur plan: ' + e.message),
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: boolean | null }) => {
      if (!userId) return;
      await adminFeatureService.toggleUserFeature(userId, key, value);
    },
    onSuccess: () => {
      toast.success('Permission mise à jour');
      refetchFeatures();
      queryClient.invalidateQueries({ queryKey: ['userFeatureSettings', userId] }); // Refresh for the user themselves if they are logged in (unlikely but good practice)
    },
    onError: (e) => toast.error('Erreur permission: ' + e.message),
  });

  // --- Render Helpers ---

  const renderFeatureRow = (state: EffectiveFeatureState) => {
    return (
      <div
        key={state.feature.feature_key}
        className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm text-gray-900">{state.feature.name}</p>
            {state.feature.is_premium && (
              <Badge variant="secondary" className="text-[10px] h-5">
                Premium
              </Badge>
            )}
            {!state.feature.is_enabled && (
              <Badge variant="destructive" className="text-[10px] h-5">
                Désactivé Globalement
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 line-clamp-1">{state.feature.description}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Source:</span>
            {state.source === 'plan' && (
              <span className="text-blue-600 font-medium">Inclus dans le plan</span>
            )}
            {state.source === 'global_off' && (
              <span className="text-red-500 font-medium">Global Admin OFF</span>
            )}
            {state.source === 'override_on' && (
              <span className="text-green-600 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Forcé ON
              </span>
            )}
            {state.source === 'override_off' && (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Forcé OFF
              </span>
            )}
            {state.source === 'default' && <span className="text-gray-500">Défaut</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
          <Button
            size="sm"
            variant={state.overrideValue === true ? 'default' : 'ghost'}
            className={`h-7 px-2 text-xs ${state.overrideValue === true ? 'bg-green-600 hover:bg-green-700' : ''}`}
            onClick={() =>
              toggleFeatureMutation.mutate({ key: state.feature.feature_key, value: true })
            }
            title="Forcer l'activation"
          >
            ON
          </Button>
          <Button
            size="sm"
            variant={state.overrideValue === null ? 'outline' : 'ghost'}
            className="h-7 px-2 text-xs bg-white shadow-sm"
            onClick={() =>
              toggleFeatureMutation.mutate({ key: state.feature.feature_key, value: null })
            }
            title="Utiliser la valeur par défaut du plan"
          >
            Auto
          </Button>
          <Button
            size="sm"
            variant={state.overrideValue === false ? 'destructive' : 'ghost'}
            className="h-7 px-2 text-xs"
            onClick={() =>
              toggleFeatureMutation.mutate({ key: state.feature.feature_key, value: false })
            }
            title="Forcer la désactivation"
          >
            OFF
          </Button>
        </div>
      </div>
    );
  };

  const groupedFeatures = React.useMemo(() => {
    if (!featureStates) return {};
    const groups: Record<string, EffectiveFeatureState[]> = {};
    featureStates.forEach((s) => {
      const cat = s.feature.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });
    return groups;
  }, [featureStates]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            Console de Gestion Utilisateur
          </DialogTitle>
          <DialogDescription>
            {isProfileLoading
              ? 'Chargement...'
              : `${profile?.first_name || 'Utilisateur'} ${profile?.last_name || ''}`}
            <span className="mx-2">•</span>
            <span className="font-mono text-xs text-gray-400">{userId}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            defaultValue="profile"
            className="flex-1 flex flex-col"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="px-6 pt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profil & Rôle</TabsTrigger>
                <TabsTrigger value="subscription">Abonnement</TabsTrigger>
                <TabsTrigger value="features">Features & AI</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden bg-slate-50/50 p-6">
              <TabsContent value="profile" className="h-full m-0 space-y-6">
                {isProfileLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Statut du compte</Label>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={profile?.status === 'active' ? 'default' : 'destructive'}
                            className="uppercase"
                          >
                            {profile?.status || 'Inconnu'}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Rôle Système</Label>
                        <div className="flex gap-2">
                          <Select
                            defaultValue={profile?.role}
                            onValueChange={(val) => updateRoleMutation.mutate(val)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Utilisateur (Client)</SelectItem>
                              <SelectItem value="merchant">Marchand</SelectItem>
                              <SelectItem value="driver">Livreur</SelectItem>
                              <SelectItem value="admin">Administrateur</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Attention: donner le rôle Admin donne accès complet.
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Métadonnées</Label>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-white rounded border">
                          <span className="text-gray-500 block text-xs">Business Name</span>
                          {profile?.business_name || '-'}
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <span className="text-gray-500 block text-xs">Téléphone</span>
                          {profile?.phone || '-'}
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <span className="text-gray-500 block text-xs">Zone</span>
                          {profile?.zone || '-'}
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <span className="text-gray-500 block text-xs">Type Véhicule</span>
                          {profile?.vehicle_type || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="subscription" className="h-full m-0">
                <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        Plan Actuel
                      </h3>
                      <p className="text-sm text-gray-500">Gérez l'abonnement de l'utilisateur</p>
                    </div>
                    {subscription ? (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-base px-3 py-1">
                        {subscription.plan?.name || 'Plan Inconnu'}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Aucun abonnement (Gratuit)
                      </Badge>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Forcer un changement de plan</Label>
                    <div className="flex gap-3">
                      <Select onValueChange={(val) => updatePlanMutation.mutate(val)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un plan..." />
                        </SelectTrigger>
                        <SelectContent>
                          {allPlans?.map((p) => (
                            <SelectItem key={p.id} value={p.id!}>
                              {p.name} - {p.price_monthly} FCFA/mois
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      Cette action bypass le paiement. L'utilisateur aura accès immédiatement.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="h-full m-0 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Matrice de Fonctionnalités
                  </h3>
                  <p className="text-sm text-gray-500">
                    Surchargez les permissions individuellement. <br />
                    <span className="font-semibold text-green-600">ON</span> = Force Active,
                    <span className="font-semibold text-red-500 ml-1">OFF</span> = Force Inactive,
                    <span className="font-semibold text-gray-600 ml-1">Auto</span> = Suit le plan.
                  </p>
                </div>

                <ScrollArea className="flex-1 -mx-2 px-2">
                  {isFeaturesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6 pb-6">
                      {Object.entries(groupedFeatures).map(([category, items]) => (
                        <div key={category}>
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
                            {category}
                          </h4>
                          <div className="space-y-2">{items.map(renderFeatureRow)}</div>
                        </div>
                      ))}
                      {Object.keys(groupedFeatures).length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                          Aucune fonctionnalité trouvée dans premium_features.
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
