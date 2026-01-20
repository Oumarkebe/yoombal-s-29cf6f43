import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Package, BarChart3, ListChecks, Store, TrendingUp, Megaphone } from 'lucide-react';
import ProductManagement from '@/components/ProductManagement';
import OrderManagement from '@/components/OrderManagement';
import StockManagement from '@/components/StockManagement';
import MerchantBNPLManager from '@/components/MerchantBNPLManager';
import { AIInsights } from '@/components/ai/AIInsights';
import { Sparkles } from 'lucide-react';
import { PremiumFeaturesDisplay } from '@/components/premium/PremiumFeaturesDisplay';
import StoreConfiguration from '@/components/StoreConfiguration';
import { formatCurrency } from '@/utils/formatters';
import { useMerchantStats } from '@/hooks/useMerchantStats';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { TopProductsWidget } from '@/components/dashboard/TopProductsWidget';
import { StatCard } from '@/components/dashboard/StatCard';

const MerchantDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: stats, isLoading: statsLoading } = useMerchantStats();

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
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.merchant_name || 'Tableau de bord Marchand'}
          </h1>
          <p className="text-gray-600">Suivez l'activité de votre boutique en ligne.</p>
        </header>

        <div className="mb-8">
          <PremiumFeaturesDisplay filterRole="merchant" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Ventes Totales (30j)"
            value={stats?.totalSales || 0}
            icon={TrendingUp}
            growth={stats?.ordersGrowth}
          />
          <StatCard
            title="Revenu (30j)"
            value={stats?.totalRevenue || 0}
            icon={BarChart3}
            growth={stats?.revenueGrowth}
            isCurrency
          />
          <StatCard
            title="Commandes à traiter"
            value={stats?.newOrders || 0}
            icon={ListChecks}
            subtext='Statut "En attente"'
          />
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 border-b rounded-none w-full justify-start mb-4">
            <TabsTrigger
              value="products"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              Produits
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              Commandes
            </TabsTrigger>
            <TabsTrigger
              value="bnpl"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              BNPL
            </TabsTrigger>
            <TabsTrigger
              value="stock"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              Stock
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              Statistiques
            </TabsTrigger>
            <TabsTrigger
              value="store"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              Ma Boutique
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              IA Insights
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              Paramètres
            </TabsTrigger>
            <Link to="/merchant/ads">
              <Button
                variant="ghost"
                className="rounded-none border-b-2 border-transparent hover:border-purple-600 hover:text-purple-600 gap-2"
              >
                <Megaphone className="h-4 w-4" />
                Publicité
              </Button>
            </Link>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SalesChart data={stats?.recentActivity || []} loading={statsLoading} />
              <div className="col-span-1">
                <TopProductsWidget products={stats?.topProducts || []} loading={statsLoading} />
              </div>
            </div>
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
                <p className="text-gray-500 mb-4">
                  Gérez vos notifications clients (SMS/Email) et préférences de boutique.
                </p>
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
