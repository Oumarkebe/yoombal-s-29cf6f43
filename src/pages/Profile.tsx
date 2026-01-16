
import React, { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Phone, MapPin, Briefcase, Car, ArrowLeft, Download, ExternalLink, Trash2, Clock, CreditCard, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ApplicationChat from "@/components/ApplicationChat";
import { Badge } from "@/components/ui/badge";
import { PremiumFeaturesDisplay } from '@/components/premium/PremiumFeaturesDisplay';
import { useSubscription } from "@/hooks/useSubscription";
import { useProfile } from "@/hooks/useProfile";
import { useBNPLPlans } from "@/hooks/useBNPLPlans";

const formatDownloadUrl = (url: string) => {
  if (!url) return '';
  // Remove extra quotes if present
  let cleaned = url.replace(/^"|"$/g, '').trim();
  // If it's a local Windows path, ensure it doesn't become a relative URL
  if (cleaned.match(/^[a-zA-Z]:[\\\/]/)) {
    return `file:///${cleaned.replace(/\\/g, '/')}`;
  }
  return cleaned;
};

// Schema based on actual profiles table columns
const profileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  vehicleType: z.string().optional(),
  zone: z.string().optional(),
  merchantName: z.string().optional(),
  deliveryName: z.string().optional(),
  clientName: z.string().optional(),
});

function getBackPath(role) {
  switch (role) {
    case "admin":
      return "/admin";
    case "merchant":
      return "/merchant";
    case "delivery":
      return "/delivery";
    default:
      return "/";
  }
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscription, isLoading: subLoading } = useSubscription();
  const { profile, isLoading: profileLoading, updateProfile, isUpdating } = useProfile(user?.id);
  const { plans: bnplPlans, isLoading: bnplLoading, refetch: refetchPlans } = useBNPLPlans() as any;

  const handleBack = () => {
    const path = getBackPath(profile?.role);
    navigate(path);
  };

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      businessName: "",
      businessType: "",
      vehicleType: "",
      zone: "",
      merchantName: "",
      deliveryName: "",
      clientName: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        businessName: profile.businessName || "",
        businessType: profile.businessType || "",
        vehicleType: profile.vehicleType || "",
        zone: profile.zone || "",
        merchantName: profile.merchantName || "",
        deliveryName: profile.deliveryName || "",
        clientName: profile.clientName || "",
      });
    }
  }, [profile, form]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des commandes",
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande de votre historique ? Cette action est irréversible.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Commande supprimée",
        description: "L'historique a été mis à jour.",
      });
      fetchOrders();
    } catch (error: any) {
      console.error("Error deleting order:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la commande : " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleFinalizeDeposit = async (planId: string) => {
    try {
      const plan = bnplPlans.find((p: any) => p.id === planId);
      if (!plan) return;

      const updatedInstallments = plan.installments.map((inst: any) =>
        inst.type === 'deposit' ? { ...inst, status: 'paid', paid_at: new Date().toISOString() } : inst
      );

      const { error } = await supabase
        .from("bnpl_plans")
        .update({
          status: 'active',
          installments: updatedInstallments
        })
        .eq("id", planId);

      if (error) throw error;

      // Notifier le marchand que l'apport a été payé
      if (plan.merchant_id) {
        await (supabase.from('notifications' as any) as any).insert({
          user_id: plan.merchant_id,
          type: 'bnpl',
          title: 'Apport BNPL payé ! 💰',
          message: `Le client a payé l'apport initial pour "${plan.products?.name}". Le plan est maintenant actif.`,
          data: { plan_id: planId }
        });
      }

      toast({
        title: "Paiement réussi ! 🎉",
        description: "Votre plan BNPL est désormais actif. Profitez de vos produits !",
      });

      // Recharger les plans
      if (refetchPlans) refetchPlans();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de valider le paiement : " + error.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user?.id) return;

    updateProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      businessName: values.businessName,
      businessType: values.businessType,
      vehicleType: values.vehicleType,
      zone: values.zone,
      merchantName: values.merchantName,
      deliveryName: values.deliveryName,
      clientName: values.clientName,
    });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  if (!user || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>

        {/* Header Profile Card */}
        <Card className="bg-white p-6 shadow-sm mb-6 border-none">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-gray-500">{user?.email}</p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                {profile?.businessName && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    PRO
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                  {profile?.role || 'Utilisateur'}
                </span>

                {profile?.phone && (
                  <div className="flex items-center text-sm text-gray-500 ml-2">
                    <Phone className="h-3 w-3 mr-1" />
                    {profile.phone}
                  </div>
                )}
                {profile?.businessName && (
                  <div className="flex items-center text-sm text-gray-500 ml-2">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {profile.businessName}
                  </div>
                )}
                {profile?.zone && (
                  <div className="flex items-center text-sm text-gray-500 ml-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {profile.zone}
                  </div>
                )}
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
              Se déconnecter
            </Button>
          </div>
        </Card>

        {/* Content Tabs/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Info Form */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold">Informations Personnelles</h2>
              </div>

              <p className="text-sm text-gray-500 mb-4">Mettez à jour vos informations personnelles</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone/Quartier</Label>
                  <Input
                    id="zone"
                    {...form.register("zone")}
                  />
                </div>
              </div>

              {/* Business Information Section */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-bold">Informations Professionnelles</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nom de l'entreprise</Label>
                    <Input
                      id="businessName"
                      {...form.register("businessName")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Type d'entreprise</Label>
                    <Input
                      id="businessType"
                      {...form.register("businessType")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Type de véhicule (livreurs)</Label>
                    <Input
                      id="vehicleType"
                      {...form.register("vehicleType")}
                    />
                  </div>
                </div>

                {/* Identity Personalization Section (v32) */}
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-bold">Identités Multi-Rôles</h2>
                  </div>
                  <p className="text-sm text-gray-500">Donnez un nom spécifique à chacun de vos profils</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Nom Public (Client)</Label>
                      <Input
                        id="clientName"
                        placeholder="Ex: Client VIP"
                        {...form.register("clientName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="merchantName">Nom de Boutique (Marchand)</Label>
                      <Input
                        id="merchantName"
                        placeholder="Ex: Ma Super Boutique"
                        {...form.register("merchantName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryName">Nom de Service (Livreur)</Label>
                      <Input
                        id="deliveryName"
                        placeholder="Ex: Livraison Rapide Dakar"
                        {...form.register("deliveryName")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isUpdating}
                  className="bg-blue-600"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </Button>
              </div>
            </Card>

            <div className="mb-6">
              <PremiumFeaturesDisplay filterRole={profile?.role as any} />
            </div>

            {/* Orders History */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Historique des Commandes</h2>
                <Button variant="outline" size="sm" onClick={fetchOrders}>Actualiser</Button>
              </div>

              <div className="space-y-4">
                {ordersLoading ? (
                  <div className="text-center py-8 text-gray-500">Chargement...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    Aucune commande pour le moment
                  </div>
                ) : (
                  orders.map(order => {
                    const digitalItems = order.order_items?.filter((item: any) => item.products?.is_digital) || [];

                    return (
                      <div key={order.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors relative group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                              {order.status}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-end mb-3">
                          <div className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                          <div className="font-bold">
                            {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(order.total_amount)}
                          </div>
                        </div>

                        {
                          digitalItems.length > 0 && ['paid', 'delivered', 'completed', 'shipped'].includes(order.status?.toLowerCase()) && (() => {
                            const orderDate = new Date(order.created_at);
                            const now = new Date();
                            const diffTime = Math.abs(now.getTime() - orderDate.getTime());
                            const diffHours = diffTime / (1000 * 60 * 60);
                            const isExpired = diffHours > 48;

                            if (isExpired) {
                              return (
                                <div className="mt-2 pt-2 border-t flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                  <Clock className="h-3 w-3" />
                                  Lien de téléchargement expiré (48h écoulées)
                                </div>
                              );
                            }

                            return (
                              <div className="mt-2 pt-2 border-t space-y-2">
                                <p className="text-xs font-semibold text-emerald-600">Produits numériques :</p>
                                {digitalItems.map((item: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between text-sm bg-emerald-50 p-2 rounded">
                                    <span className="truncate mr-2">{item.products.name}</span>
                                    <Button size="sm" variant="ghost" className="h-7 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 p-0 px-2" asChild>
                                      <a href={formatDownloadUrl(item.products.download_url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                        <Download className="h-3 w-3" /> Télécharger
                                      </a>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            );
                          })()
                        }
                      </div>
                    );
                  })
                )}
              </div>
            </Card>

            {/* BNPL Plans Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  <h2 className="text-lg font-bold">Mes Crédits (BNPL)</h2>
                </div>
              </div>

              <div className="space-y-6">
                {bnplLoading ? (
                  <div className="text-center py-8 text-gray-500">Chargement des plans...</div>
                ) : bnplPlans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-orange-50 rounded-lg border border-orange-100 italic">
                    Aucun plan de paiement échelonné actif.
                  </div>
                ) : (
                  bnplPlans.map((plan: any) => (
                    <div key={plan.id} className="p-5 border border-orange-200 rounded-xl bg-gradient-to-br from-white to-orange-50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          {plan.products?.image_url && (
                            <img src={plan.products.image_url} alt="" className="h-10 w-10 rounded object-cover border" />
                          )}
                          <div>
                            <h3 className="font-bold text-gray-900">{plan.products?.name || "Produit"}</h3>
                            <p className="text-xs text-mono text-gray-500">ID: {plan.id.slice(0, 8)}</p>
                          </div>
                        </div>
                        <Badge className={
                          plan.status === 'active' ? 'bg-green-100 text-green-700' :
                            plan.status === 'awaiting_deposit' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                        }>
                          {plan.status === 'active' ? 'Actif' : plan.status === 'awaiting_deposit' ? 'En attente d\'apport' : plan.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-2 rounded shadow-sm border border-orange-100">
                          <p className="text-[10px] text-gray-500 uppercase font-semibold">Total</p>
                          <p className="font-bold text-gray-900">{new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(plan.total_amount)}</p>
                        </div>
                        <div className="bg-white p-2 rounded shadow-sm border border-orange-100">
                          <p className="text-[10px] text-gray-500 uppercase font-semibold">Mensualité</p>
                          <p className="font-bold text-orange-600">{new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(plan.monthly_payment)}</p>
                        </div>
                        <div className="bg-white p-2 rounded shadow-sm border border-orange-100">
                          <p className="text-[10px] text-gray-500 uppercase font-semibold">Restant</p>
                          <p className="font-bold text-gray-900">{plan.remaining_months} mois</p>
                        </div>
                        <div className="bg-white p-2 rounded shadow-sm border border-orange-100">
                          <p className="text-[10px] text-gray-500 uppercase font-semibold">Échéance</p>
                          <p className="font-bold text-gray-700">{plan.next_payment_date ? new Date(plan.next_payment_date).toLocaleDateString() : '-'}</p>
                        </div>
                      </div>

                      {/* Installments Timeline */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Échéancier de paiement
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {plan.installments?.map((inst: any, idx: number) => (
                            <div key={idx} className={`flex items-center justify-between p-2 rounded-lg text-sm border ${inst.status === 'paid' ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-100'
                              }`}>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${inst.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                                <span className={inst.status === 'paid' ? 'text-emerald-700 line-through' : 'text-gray-700'}>
                                  {inst.label}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(inst.amount)}</p>
                                <p className="text-[10px] text-gray-400">{new Date(inst.due_date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {plan.status === 'awaiting_deposit' && (
                        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 text-center">
                          <p className="text-sm text-amber-800 mb-3 font-medium">
                            Votre demande a été approuvée ! Finalisez l'apport initial pour activer votre crédit.
                          </p>
                          <Button
                            className="bg-orange-600 hover:bg-orange-700 text-white w-full shadow-lg shadow-orange-200"
                            onClick={() => handleFinalizeDeposit(plan.id)}
                          >
                            Payer l'apport initial ({new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(plan.installments?.find((i: any) => i.type === 'deposit')?.amount || 0)})
                          </Button>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                              <MessageCircle className="h-4 w-4" /> Message au Marchand
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md p-0 overflow-hidden">
                            <ApplicationChat applicationId={plan.id} />
                          </DialogContent>
                        </Dialog>
                        <span className="text-xs text-gray-400">Besoin d'aide ?</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Paramètres IA</h3>
              <p className="text-sm text-gray-500 mb-4">Gérez vos préférences pour les fonctionnalités IA</p>
              <div className="space-y-3">
                {/* AI Settings placeholders */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Recommandations</span>
                  <div className="h-5 w-9 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="h-3 w-3 bg-white rounded-full absolute right-1 top-1"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Notifications analysées</span>
                  <div className="h-5 w-9 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="h-3 w-3 bg-white rounded-full absolute right-1 top-1"></div>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Mon Abonnement</h3>
              {subLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : subscription ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subscription.plan?.name}</span>
                    <Badge variant="secondary">{subscription.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Expire le {subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString() : 'Illimité'}
                  </p>
                  <Button onClick={() => navigate('/premium/subscriptions')} className="w-full">
                    Gérer mon abonnement
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Aucun abonnement actif</p>
                  <Button onClick={() => navigate('/premium/subscriptions')} className="w-full">
                    Découvrir les formules
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div >
    </div >
  );
};

export default Profile;
