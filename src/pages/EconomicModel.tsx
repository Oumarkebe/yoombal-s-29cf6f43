import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RevenueDashboard from '@/components/RevenueDashboard';
import LoyaltyProgram from '@/components/LoyaltyProgram';
import InsuranceComponent from '@/components/InsuranceComponent';
import {
  TrendingUp,
  Users,
  Store,
  Truck,
  CreditCard,
  Shield,
  Target,
  BarChart3,
  Globe,
  Zap,
  CheckCircle,
  Clock,
  Star,
  Gift,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EconomicModel = () => {
  const currentFeatures = [
    {
      category: 'Marketplace',
      icon: <Store className="h-6 w-6 text-blue-600" />,
      features: [
        'Catalogue produits multi-marchands',
        'Système de recherche et filtrage avancé',
        'Gestion des commandes en temps réel',
        'Interface responsive et accessible',
        'Support multi-langues (FR/WO)',
      ],
      status: 'Opérationnel',
    },
    {
      category: 'Paiement BNPL',
      icon: <CreditCard className="h-6 w-6 text-green-600" />,
      features: [
        'Paiement échelonné sans frais pour clients',
        'Évaluation automatique de solvabilité',
        'Gestion des échéances',
        'Intégration Wave/Orange Money',
        'Tableau de bord BNPL pour marchands',
      ],
      status: 'Opérationnel',
    },
    {
      category: 'Livraison',
      icon: <Truck className="h-6 w-6 text-orange-600" />,
      features: [
        'Réseau de livreurs partenaires',
        'Suivi GPS en temps réel',
        'Zones de livraison configurables',
        'Calcul automatique des frais',
        'Application mobile livreurs',
      ],
      status: 'En développement',
    },
    {
      category: 'Gestion',
      icon: <Settings className="h-6 w-6 text-purple-600" />,
      features: [
        'Tableau de bord admin complet',
        'Gestion des utilisateurs et rôles',
        'Analytics et statistiques',
        'Système de notifications',
        'Configuration plateforme',
      ],
      status: 'Opérationnel',
    },
  ];

  const revenueStreams = [
    {
      source: 'Commission Marchands',
      percentage: '2.5%',
      description: 'Sur chaque transaction réussie',
      potential: '80% du CA',
      icon: <Store className="h-8 w-8 text-blue-600" />,
    },
    {
      source: 'Commission Livraison',
      percentage: '15%',
      description: 'Sur les frais de livraison',
      potential: '15% du CA',
      icon: <Truck className="h-8 w-8 text-orange-600" />,
    },
    {
      source: 'Services Premium',
      percentage: 'Fixe',
      description: 'Assurance, support, analytics',
      potential: '3% du CA',
      icon: <Star className="h-8 w-8 text-yellow-600" />,
    },
    {
      source: 'Programme Fidélité',
      percentage: 'Variable',
      description: 'Partenariats et cashback',
      potential: '2% du CA',
      icon: <Gift className="h-8 w-8 text-green-600" />,
    },
  ];

  const roadmapQ1 = [
    {
      title: 'IA et Personnalisation',
      items: [
        'Recommandations produits intelligentes',
        'Chatbot IA multilingue',
        'Scoring BNPL automatisé',
        'Détection fraude avancée',
      ],
      priority: 'Haute',
      impact: 'Engagement +35%',
    },
    {
      title: 'Expansion Services',
      items: [
        'Assurance premium étendue',
        'Programme fidélité gamifié',
        'Marketplace B2B',
        'Services financiers micro-crédit',
      ],
      priority: 'Haute',
      impact: 'Revenus +25%',
    },
  ];

  const roadmapQ2Q3 = [
    {
      title: 'Expansion Géographique',
      items: [
        'Mali et Burkina Faso',
        "Côte d'Ivoire",
        'Adaptation réglementaire locale',
        'Partenariats bancaires régionaux',
      ],
      priority: 'Moyenne',
      impact: 'Marché x3',
    },
    {
      title: 'Nouvelles Verticales',
      items: [
        'Yoombal Food (livraison repas)',
        'Yoombal Services (artisans)',
        'Yoombal Auto (pièces détachées)',
        'Yoombal Éducation (cours en ligne)',
      ],
      priority: 'Moyenne',
      impact: 'Diversification',
    },
  ];

  const actionPlan = [
    {
      phase: 'Immédiat (0-3 mois)',
      actions: [
        'Finaliser système de livraison',
        'Lancer programme fidélité',
        'Implémenter assurance basique',
        'Optimiser conversion BNPL',
        'Campagne acquisition marchands',
      ],
      budget: '500K CFA',
      kpis: ['100 nouveaux marchands', '1000 commandes/mois', 'Taux conversion +20%'],
    },
    {
      phase: 'Court terme (3-6 mois)',
      actions: [
        'Déployer IA recommandations',
        'Lancer chatbot multilingue',
        'Extension zones livraison',
        'Services premium complets',
        'Partenariats stratégiques',
      ],
      budget: '1.5M CFA',
      kpis: ['500 marchands actifs', '5000 utilisateurs', 'CA mensuel 10M CFA'],
    },
    {
      phase: 'Moyen terme (6-12 mois)',
      actions: [
        'Expansion Mali/Burkina',
        'Marketplace B2B',
        'Services micro-crédit',
        'Application mobile native',
        'Levée de fonds Série A',
      ],
      budget: '5M CFA',
      kpis: ['Présence 3 pays', '1000 marchands', 'CA mensuel 50M CFA'],
    },
  ];

  const metrics = [
    { label: 'Marchands actifs', value: '127', trend: '+23%' },
    { label: 'Utilisateurs', value: '2,847', trend: '+45%' },
    { label: 'CA mensuel', value: '3.2M CFA', trend: '+67%' },
    { label: 'Taux conversion BNPL', value: '12.5%', trend: '+8%' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Modèle Économique Yoombal
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Écosystème e-commerce inclusif pour l'Afrique de l'Ouest avec paiement échelonné et
              livraison intégrée
            </p>
            <div className="flex justify-center mt-6">
              <Badge variant="secondary" className="text-lg px-6 py-2">
                Version 2.0 - Décembre 2024
              </Badge>
            </div>
          </div>

          {/* Métriques actuelles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <Card key={index} className="text-center shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                  <Badge variant="outline" className="text-green-600">
                    {metric.trend}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dashboard revenus */}
          <div className="mb-12">
            <RevenueDashboard />
          </div>

          {/* État actuel des fonctionnalités */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              État Actuel de la Plateforme
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {currentFeatures.map((category, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {category.icon}
                        <CardTitle className="text-xl">{category.category}</CardTitle>
                      </div>
                      <Badge
                        variant={category.status === 'Opérationnel' ? 'default' : 'secondary'}
                        className={
                          category.status === 'Opérationnel' ? 'bg-green-600' : 'bg-orange-600'
                        }
                      >
                        {category.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sources de revenus */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Sources de Revenus
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {revenueStreams.map((stream, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">{stream.icon}</div>
                    <CardTitle className="text-lg">{stream.source}</CardTitle>
                    <div className="text-2xl font-bold text-blue-600">{stream.percentage}</div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-2">{stream.description}</p>
                    <Badge variant="outline" className="text-green-600">
                      {stream.potential}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Nouveaux programmes */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Programme de Fidélité</h3>
              <LoyaltyProgram />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Assurance Livraison</h3>
              <InsuranceComponent orderValue={75000} />
            </div>
          </div>

          {/* Roadmap */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Roadmap de Développement
            </h2>

            {/* Q1 2025 */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Clock className="h-6 w-6 text-blue-600 mr-2" />
                Q1 2025 - Priorités Immédiates
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {roadmapQ1.map((item, index) => (
                  <Card key={index} className="shadow-lg border-l-4 border-blue-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          {item.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {item.items.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2">
                            <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Badge variant="outline" className="text-green-600">
                        Impact: {item.impact}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Q2-Q3 2025 */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Globe className="h-6 w-6 text-green-600 mr-2" />
                Q2-Q3 2025 - Expansion
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {roadmapQ2Q3.map((item, index) => (
                  <Card key={index} className="shadow-lg border-l-4 border-green-600">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {item.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {item.items.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2">
                            <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Badge variant="outline" className="text-purple-600">
                        Impact: {item.impact}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Plan d'action détaillé */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Plan d'Action Détaillé
            </h2>
            <div className="space-y-8">
              {actionPlan.map((phase, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                      <Target className="h-6 w-6 text-purple-600 mr-3" />
                      {phase.phase}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold text-gray-900 mb-3">Actions prioritaires:</h4>
                        <ul className="space-y-2">
                          {phase.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start space-x-2">
                              <Zap className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Budget estimé:</h4>
                          <div className="text-2xl font-bold text-blue-600">{phase.budget}</div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">KPIs cibles:</h4>
                          <ul className="space-y-1">
                            {phase.kpis.map((kpi, kpiIndex) => (
                              <li key={kpiIndex} className="text-sm text-gray-600">
                                • {kpi}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Résumé exécutif */}
          <Card className="shadow-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-3xl text-center flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                Résumé Exécutif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Vision 2025</h3>
                  <p className="text-gray-700 mb-4">
                    Yoombal ambitionne de devenir la référence e-commerce en Afrique de l'Ouest avec
                    :
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>1000+ marchands actifs</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>50K+ utilisateurs réguliers</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Présence dans 5 pays</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>CA annuel 1 milliard CFA</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Avantages Concurrentiels
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">BNPL sans frais</h4>
                        <p className="text-sm text-gray-600">Premier au Sénégal avec scoring IA</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Écosystème complet</h4>
                        <p className="text-sm text-gray-600">
                          Clients, marchands, livreurs unifiés
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Adaptation locale</h4>
                        <p className="text-sm text-gray-600">Interface wolof, paiements locaux</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 text-center">
                <p className="text-lg text-gray-700 mb-6">
                  <strong>Objectif 2025:</strong> Devenir la super-app e-commerce de référence en
                  Afrique de l'Ouest avec un écosystème intégré de commerce, paiement et livraison.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/admin/statistics">Voir les statistiques</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/marketplace">Explorer la marketplace</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EconomicModel;
