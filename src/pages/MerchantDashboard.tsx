import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  BarChart3,
  ListChecks,
  Store,
  TrendingUp,
} from "lucide-react";
import ProductManagement from "@/components/ProductManagement";
import OrderManagement from "@/components/OrderManagement";
import StockManagement from "@/components/StockManagement";
import MerchantBNPLManager from "@/components/MerchantBNPLManager";
import { AIInsights } from "@/components/ai/AIInsights";
import { Sparkles } from "lucide-react";
import { PremiumFeaturesDisplay } from '@/components/premium/PremiumFeaturesDisplay';
import StoreConfiguration from "@/components/StoreConfiguration";

const MerchantDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'products';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Marchand</h1>
          <p className="text-gray-600">Suivez l'activité de votre boutique en ligne.</p>
        </header>

        <div className="mb-8">
          <PremiumFeaturesDisplay filterRole="merchant" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">452</div>
              <p className="text-sm text-gray-500">Depuis le mois dernier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenu</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,250,000 CFA</div>
              <p className="text-sm text-gray-500">+19% par rapport au mois dernier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouvelles Commandes</CardTitle>
              <ListChecks className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">201</div>
              <p className="text-sm text-gray-500">+7% par rapport à hier</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 border-b rounded-none w-full justify-start mb-4">
            <TabsTrigger value="products" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">Produits</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">Commandes</TabsTrigger>
            <TabsTrigger value="bnpl" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">BNPL</TabsTrigger>
            <TabsTrigger value="stock" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">Stock</TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">Statistiques</TabsTrigger>
            <TabsTrigger value="store" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">Ma Boutique</TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
              <Sparkles className="h-4 w-4 text-amber-500" />
              IA Insights
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="bnpl">
            <MerchantBNPLManager />
          </TabsContent>

          <TabsContent value="stock">
            <StockManagement />
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Ici, vous pourrez suivre les statistiques de votre boutique.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <AIInsights />
          </TabsContent>

          <TabsContent value="store">
            <StoreConfiguration />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres & Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">Gérez vos notifications clients (SMS/Email) et préférences de boutique.</p>
                <Button variant="outline">Gérer les notifications</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default MerchantDashboard;
