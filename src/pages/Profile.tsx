import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Loader2, User, Phone, Building, MapPin, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MyAiSettingsManager from "@/components/profile/MyAiSettingsManager";
import { supabase } from "@/integrations/supabase/client";
import OrdersList from "@/components/OrdersList";

const profileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  address: z.string().optional(),
  businessAddress: z.string().optional(),
  businessCity: z.string().optional(),
  businessPostalCode: z.string().optional(),
  businessTaxId: z.string().optional(),
});

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { profile, isLoading: profileLoading, updateProfile, isUpdating } = useProfile(user?.id);
  const isPro = user?.role === "client" && !!user?.businessName;

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      businessName: "",
      businessType: "",
      city: "",
      postalCode: "",
      address: "",
      businessAddress: "",
      businessCity: "",
      businessPostalCode: "",
      businessTaxId: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        businessName: profile.businessName || "",
        businessType: profile.businessType || "",
        city: profile.city || "",
        postalCode: profile.postalCode || "",
        address: profile.address || "",
        businessAddress: profile.businessAddress || "",
        businessCity: profile.businessCity || "",
        businessPostalCode: profile.businessPostalCode || "",
        businessTaxId: profile.businessTaxId || "",
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

  const onSubmit = async (values: any) => {
    if (!user?.id) return;
    
    updateProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      businessName: values.businessName,
      businessType: values.businessType,
      city: values.city,
      postalCode: values.postalCode,
      address: values.address,
      businessAddress: values.businessAddress,
      businessCity: values.businessCity,
      businessPostalCode: values.businessPostalCode,
      businessTaxId: values.businessTaxId,
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const displayProfile = profile || user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={""} alt={displayProfile.firstName} />
                    <AvatarFallback className="text-2xl">
                      {displayProfile.firstName?.[0]}{displayProfile.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-center mt-4">
                  {displayProfile.firstName} {displayProfile.lastName}
                </CardTitle>
                <CardDescription className="text-center">{displayProfile.email}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-center space-x-2 mb-4">
                  {displayProfile.role && (
                    <Badge variant="outline" className="capitalize">
                      {displayProfile.role}
                    </Badge>
                  )}
                  {displayProfile.businessName && (
                    <Badge variant="secondary">PRO</Badge>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  {displayProfile.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 opacity-70" />
                      <span>{displayProfile.phone}</span>
                    </div>
                  )}
                  {displayProfile.businessName && (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 opacity-70" />
                      <span>{displayProfile.businessName}</span>
                    </div>
                  )}
                  {profile?.city && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 opacity-70" />
                      <span>{profile.city}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Se déconnecter
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Mon Profil</TabsTrigger>
                <TabsTrigger value="orders">Mes Commandes</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informations Personnelles
                    </CardTitle>
                    <CardDescription>
                      Mettez à jour vos informations personnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                  <Input placeholder="Prénom" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nom" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Email" {...field} disabled />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Téléphone</FormLabel>
                                <FormControl>
                                  <Input placeholder="Téléphone" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ville</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ville" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Code Postal</FormLabel>
                                <FormControl>
                                  <Input placeholder="Code Postal" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse</FormLabel>
                              <FormControl>
                                <Input placeholder="Adresse complète" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {(displayProfile.role === "merchant" || displayProfile.businessName) && (
                          <div className="space-y-4">
                            <Separator />
                            <h3 className="text-lg font-medium">Informations Professionnelles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="businessName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nom de l'entreprise</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Nom de l'entreprise" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="businessType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Type d'entreprise</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Type d'entreprise" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="businessCity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ville (entreprise)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Ville de l'entreprise" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="businessPostalCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Code Postal (entreprise)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Code postal entreprise" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name="businessAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Adresse (entreprise)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Adresse complète de l'entreprise" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="businessTaxId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Numéro fiscal</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Numéro d'identification fiscale" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        <Button type="submit" disabled={isUpdating} className="w-full">
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Mise à jour...
                            </>
                          ) : (
                            <>
                              <Pencil className="mr-2 h-4 w-4" />
                              Mettre à jour le profil
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                {isPro && (
                  <MyAiSettingsManager />
                )}
              </TabsContent>
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes Commandes</CardTitle>
                    <CardDescription>
                      Historique de vos commandes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : orders.length > 0 ? (
                      <OrdersList orders={orders} />
                    ) : (
                      <Alert>
                        <AlertDescription>
                          Vous n'avez pas encore passé de commande.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
