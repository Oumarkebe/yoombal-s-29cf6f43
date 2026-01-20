import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  CreditCard,
  Truck,
  Percent,
} from 'lucide-react';

interface RevenueMetric {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const revenueMetrics: RevenueMetric[] = [
  {
    title: 'Commission Marketplace',
    value: '1.2M CFA',
    change: '+15%',
    icon: <Percent className="w-5 h-5" />,
    color: 'text-green-600',
  },
  {
    title: 'Revenus BNPL',
    value: '850K CFA',
    change: '+45%',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'text-blue-600',
  },
  {
    title: 'Frais de livraison',
    value: '320K CFA',
    change: '+12%',
    icon: <Truck className="w-5 h-5" />,
    color: 'text-orange-600',
  },
  {
    title: 'Abonnements',
    value: '180K CFA',
    change: '+25%',
    icon: <Users className="w-5 h-5" />,
    color: 'text-purple-600',
  },
];

const upcomingRevenue = [
  {
    name: 'Programme de fidélité',
    description: 'Augmentation de la rétention client',
    estimatedIncrease: '+15% revenus totaux',
    timeline: 'Q1 2025',
  },
  {
    name: 'Assurance livraison',
    description: 'Protection des colis et revenus additionnels',
    estimatedIncrease: '+200K CFA/mois',
    timeline: 'Q1 2025',
  },
  {
    name: 'Marketplace B2B',
    description: 'Transactions inter-entreprises',
    estimatedIncrease: '+300% volume',
    timeline: 'Q2 2025',
  },
  {
    name: 'API monétisée',
    description: 'Revenus récurrents des intégrations',
    estimatedIncrease: '+150K CFA/mois',
    timeline: 'Q3 2025',
  },
];

export const RevenueDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <Badge variant="secondary" className={metric.color}>
                      {metric.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${metric.color}`}>{metric.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Opportunités de Croissance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingRevenue.map((opportunity, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{opportunity.name}</h4>
                    <p className="text-sm text-gray-600">{opportunity.description}</p>
                  </div>
                  <Badge variant="outline">{opportunity.timeline}</Badge>
                </div>
                <div className="text-sm font-medium text-green-600">
                  Impact estimé: {opportunity.estimatedIncrease}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analyse des Flux de Revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-green-800">Commission Marketplace</h4>
                <p className="text-sm text-green-600">Principal flux de revenus</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">45%</div>
                <div className="text-sm text-green-600">des revenus totaux</div>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-blue-800">BNPL & Fintech</h4>
                <p className="text-sm text-blue-600">Croissance la plus rapide</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-800">32%</div>
                <div className="text-sm text-blue-600">des revenus totaux</div>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-orange-800">Services & Logistique</h4>
                <p className="text-sm text-orange-600">Marge élevée</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-800">23%</div>
                <div className="text-sm text-orange-600">des revenus totaux</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueDashboard;
