
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Loader2, BrainCircuit, BarChart, Zap, CreditCard, Globe, Target, ArrowLeft } from 'lucide-react';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import { PremiumFeatureCard } from '@/components/admin/PremiumFeatureCard';
import { Badge } from '@/components/ui/badge';

const CATEGORY_CONFIG = {
  intelligence_artificielle: {
    name: 'Intelligence Artificielle',
    icon: BrainCircuit,
    color: 'bg-purple-100 text-purple-800',
    description: 'Fonctionnalités d\'IA avancées pour automatiser et optimiser votre plateforme'
  },
  analytics: {
    name: 'Analytics & BI',
    icon: BarChart,
    color: 'bg-blue-100 text-blue-800',
    description: 'Outils d\'analyse et de business intelligence pour prendre de meilleures décisions'
  },
  automatisation: {
    name: 'Automatisation',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Automatisez vos processus métier pour gagner en efficacité'
  },
  services_financiers: {
    name: 'Services Financiers',
    icon: CreditCard,
    color: 'bg-green-100 text-green-800',
    description: 'Services financiers avancés pour vos utilisateurs et marchands'
  },
  expansion: {
    name: 'Expansion',
    icon: Globe,
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Outils pour étendre votre activité géographiquement et techniquement'
  },
  marketing: {
    name: 'Marketing',
    icon: Target,
    color: 'bg-pink-100 text-pink-800',
    description: 'Stratégies marketing et fidélisation client avancées'
  }
};

export default function AdminAiCenter() {
  const { featuresByCategory, isLoading, updateFeature, isUpdating } = usePremiumFeatures();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
      </div>
    );
  }

  const getTotalFeatures = () => {
    return Object.values(featuresByCategory).reduce((total, features) => total + features.length, 0);
  };

  const getActiveFeatures = () => {
    return Object.values(featuresByCategory).reduce(
      (total, features) => total + features.filter(f => f.is_enabled).length, 
      0
    );
  };

  const getTotalMonthlyCost = () => {
    return Object.values(featuresByCategory).reduce((total, features) => {
      return total + features.reduce((categoryTotal, feature) => {
        return categoryTotal + (feature.is_enabled ? feature.price_monthly : 0);
      }, 0);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/admin" className="inline-flex items-center text-amber-600 hover:underline mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-800 flex items-center gap-3">
                  <BrainCircuit className="w-10 h-10 text-purple-600" />
                  Centre de Gestion Premium
                </h1>
                <p className="text-lg text-gray-500 mt-2">
                  Activez et configurez les fonctionnalités premium de votre plateforme
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fonctionnalités Total</CardTitle>
                <BrainCircuit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalFeatures()}</div>
                <p className="text-xs text-muted-foreground">
                  Disponibles sur la plateforme
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fonctionnalités Actives</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{getActiveFeatures()}</div>
                <p className="text-xs text-muted-foreground">
                  Actuellement activées
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coût Mensuel</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{formatPrice(getTotalMonthlyCost())}</div>
                <p className="text-xs text-muted-foreground">
                  Fonctionnalités actives
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Fonctionnalités par catégorie */}
          <div className="space-y-8">
            {Object.entries(featuresByCategory).map(([categoryKey, features]) => {
              const config = CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG];
              if (!config) return null;

              const Icon = config.icon;
              const activeCount = features.filter(f => f.is_enabled).length;
              const categoryMonthlyCost = features.reduce((total, feature) => {
                return total + (feature.is_enabled ? feature.price_monthly : 0);
              }, 0);

              return (
                <Card key={categoryKey} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white shadow-sm">
                          <Icon className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            {config.name}
                            <Badge className={config.color}>
                              {activeCount}/{features.length} actives
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                        </div>
                      </div>
                      {categoryMonthlyCost > 0 && (
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Coût mensuel</div>
                          <div className="text-lg font-bold text-amber-600">
                            {formatPrice(categoryMonthlyCost)}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {features.map((feature) => (
                        <PremiumFeatureCard
                          key={feature.id}
                          feature={feature}
                          onUpdate={updateFeature}
                          isUpdating={isUpdating}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {Object.keys(featuresByCategory).length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BrainCircuit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Aucune fonctionnalité premium trouvée
                </h3>
                <p className="text-gray-500">
                  Les fonctionnalités premium seront bientôt disponibles.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
