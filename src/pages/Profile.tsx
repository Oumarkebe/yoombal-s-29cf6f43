
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
import { Loader2, User, Phone, MapPin, Briefcase, Car, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PremiumFeaturesDisplay } from '@/components/premium/PremiumFeaturesDisplay';
import { useSubscription } from "@/hooks/useSubscription";
// Assurez-vous d'avoir ce hook ou une implémentation similaire
import { useProfile } from "@/hooks/useProfile";

// Schema based on actual profiles table columns
const profileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  vehicleType: z.string().optional(),
  zone: z.string().optional(),
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
        .select("*, order_items(*)")
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
              <PremiumFeaturesDisplay />
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
                  orders.map(order => (
                    <div key={order.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</span>
                        <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="font-bold">
                          {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(order.total_amount)}
                        </div>
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
      </div>
    </div>
  );
};

export default Profile;
