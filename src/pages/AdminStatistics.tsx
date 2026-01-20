import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import {
  Loader2,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/admin/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const fetchAdminStats = async () => {
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('total_amount, created_at');

  if (ordersError) throw new Error(ordersError.message);

  const orderCount = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  const salesByDay = orders.reduce(
    (acc, order) => {
      const date = format(new Date(order.created_at), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += order.total_amount || 0;
      return acc;
    },
    {} as Record<string, number>
  );

  const salesData = Object.keys(salesByDay)
    .map((date) => ({
      date: format(new Date(date), 'dd MMM'),
      revenue: salesByDay[date],
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return { userCount, productCount, orderCount, totalRevenue, salesData };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function AdminStatistics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
  });
  const { settings, isLoading: isLoadingSettings } = usePlatformSettings();

  const someStatIsVisible =
    settings?.dashboard?.showUserCount ||
    settings?.dashboard?.showProductCount ||
    settings?.dashboard?.showOrderCount ||
    settings?.dashboard?.showTotalRevenue;

  if (isLoading || isLoadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">Erreur lors du chargement des statistiques.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center text-amber-600 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Statistiques Générales</h1>
          <p className="text-gray-500">Vue d'ensemble de l'activité de la plateforme.</p>
        </div>

        {someStatIsVisible ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {settings?.dashboard?.showUserCount && (
              <StatCard
                title="Utilisateurs"
                value={data?.userCount ?? 0}
                icon={<Users className="h-5 w-5 text-blue-500" />}
              />
            )}
            {settings?.dashboard?.showProductCount && (
              <StatCard
                title="Produits"
                value={data?.productCount ?? 0}
                icon={<Package className="h-5 w-5 text-green-500" />}
              />
            )}
            {settings?.dashboard?.showOrderCount && (
              <StatCard
                title="Commandes"
                value={data?.orderCount ?? 0}
                icon={<ShoppingCart className="h-5 w-5 text-orange-500" />}
              />
            )}
            {settings?.dashboard?.showTotalRevenue && (
              <StatCard
                title="Revenu Total"
                value={formatCurrency(data?.totalRevenue ?? 0)}
                icon={<DollarSign className="h-5 w-5 text-purple-500" />}
              />
            )}
          </div>
        ) : (
          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Statistiques masquées</AlertTitle>
            <AlertDescription>
              Toutes les statistiques sont actuellement masquées. Vous pouvez les réactiver dans les{' '}
              <Link to="/admin/settings" className="font-semibold underline">
                paramètres
              </Link>
              .
            </AlertDescription>
          </Alert>
        )}

        {settings?.dashboard?.showTotalRevenue ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Évolution des revenus (derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenu" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg text-center p-8">
            <CardHeader>
              <CardTitle>Graphique des revenus masqué</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Le graphique des revenus est masqué. Vous pouvez le réactiver dans les{' '}
                <Link to="/admin/settings" className="font-semibold underline">
                  paramètres
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
