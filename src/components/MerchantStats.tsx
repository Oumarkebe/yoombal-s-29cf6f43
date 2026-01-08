import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, CreditCard } from 'lucide-react';

// Ajout de l'import du hook et des props
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';

const MerchantStats = ({ orders: propOrders, enrichedOrders: propEnrichedOrders }: any) => {
  // Utilisation des commandes enrichies passées en props ou du hook
  const { orders } = useOrders();
  const [enrichedOrders, setEnrichedOrders] = React.useState<any[]>(propEnrichedOrders || []);

  React.useEffect(() => {
    // Si on reçoit les commandes enrichies en props, on les utilise
    if (propEnrichedOrders) {
      setEnrichedOrders(propEnrichedOrders);
      return;
    }
    // Sinon, enrichir les commandes du hook (fallback)
    const enrichOrders = async () => {
      const enriched = await Promise.all((propOrders || orders).map(async (order: any) => {
        let items = [];
        try {
          const { data: orderItems } = await supabase
            .from('order_items')
            .select('product_id, quantity, price, products(name)')
            .eq('order_id', order.id);
          items = (orderItems || []).map(i => ({
            name: i.products?.name || i.product_id,
            quantity: i.quantity,
            price: i.price
          }));
        } catch {}
        return {
          ...order,
          items,
          total: items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
          date: order.created_at,
          status: order.status
        };
      }));
      setEnrichedOrders(enriched);
    };
    if ((propOrders || orders).length > 0) enrichOrders();
    else setEnrichedOrders([]);
  }, [propOrders, propEnrichedOrders, orders]);

  // Génération des datasets dynamiques pour les graphiques
  const now = new Date();
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const salesData = Array.from({ length: 6 }, (_, i) => {
    const month = (now.getMonth() - 5 + i + 12) % 12;
    const year = now.getFullYear() - (now.getMonth() - 5 + i < 0 ? 1 : 0);
    const monthOrders = enrichedOrders.filter(o => {
      const d = new Date(o.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    return {
      name: months[month],
      ventes: monthOrders.reduce((sum, o) => sum + o.total, 0),
      commandes: monthOrders.length
    };
  });

  // Top produits dynamiques
  const productMap: Record<string, { name: string; sales: number; revenue: number }> = {};
  enrichedOrders.forEach(order => {
    (order.items || []).forEach((item: any) => {
      if (!productMap[item.name]) productMap[item.name] = { name: item.name, sales: 0, revenue: 0 };
      productMap[item.name].sales += item.quantity;
      productMap[item.name].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 4);

  // Commandes récentes dynamiques
  const recentOrders = enrichedOrders.slice(0, 4).map(order => ({
    id: order.id,
    customer: order.customer || order.user_id,
    amount: order.total,
    status: order.status,
    date: new Date(order.date).toLocaleDateString('fr-FR')
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">En attente</span>;
      case 'processing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">En cours</span>;
      case 'completed':
      case 'delivered':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Terminée</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Inconnu</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ventes ce mois</p>
              <p className="text-2xl font-bold">{formatCurrency(salesData[5]?.ventes || 0)}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">{salesData[4]?.ventes ? `${Math.round(((salesData[5]?.ventes - salesData[4]?.ventes) / (salesData[4]?.ventes || 1)) * 100)}% vs mois dernier` : ''}</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commandes ce mois</p>
              <p className="text-2xl font-bold">{salesData[5]?.commandes || 0}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">{salesData[4]?.commandes ? `${Math.round(((salesData[5]?.commandes - salesData[4]?.commandes) / (salesData[4]?.commandes || 1)) * 100)}% vs mois dernier` : ''}</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Panier moyen</p>
              <p className="text-2xl font-bold">{salesData[5]?.commandes ? formatCurrency((salesData[5]?.ventes || 0) / (salesData[5]?.commandes || 1)) : 'N/A'}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{salesData[4]?.commandes ? `${Math.round((((salesData[5]?.ventes || 0) / (salesData[5]?.commandes || 1)) - ((salesData[4]?.ventes || 0) / (salesData[4]?.commandes || 1))) / (((salesData[4]?.ventes || 0) / (salesData[4]?.commandes || 1)) || 1) * 100)}% vs mois dernier` : ''}</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Évolution des ventes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="ventes" stroke="#059669" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Nombre de commandes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="commandes" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      {/* Top Products and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Produits les plus vendus</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} ventes</p>
                </div>
                <p className="font-semibold">{formatCurrency(product.revenue)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Commandes récentes</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(order.amount)}</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MerchantStats;
