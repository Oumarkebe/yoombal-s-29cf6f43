
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tarifs = () => {
  const plans = [
    {
      name: "Client",
      price: "Gratuit",
      icon: <Star className="h-8 w-8 text-blue-600" />,
      description: "Pour les acheteurs particuliers",
      features: [
        "Accès à la marketplace",
        "Paiement échelonné BNPL",
        "Livraison standard gratuite",
        "Support client de base",
        "Programme de fidélité",
        "Assurance livraison basique"
      ],
      cta: "Commencer gratuitement",
      popular: false,
      link: "/register?role=client"
    },
    {
      name: "Marchand",
      price: "2,5%",
      period: "par transaction",
      icon: <Zap className="h-8 w-8 text-amber-600" />,
      description: "Pour les vendeurs professionnels",
      features: [
        "Boutique en ligne personnalisée",
        "Gestion des commandes",
        "Intégration BNPL pour vos produits",
        "Tableau de bord analytics",
        "Support prioritaire",
        "Outils marketing avancés",
        "API d'intégration"
      ],
      cta: "Devenir marchand",
      popular: true,
      link: "/register?role=merchant"
    },
    {
      name: "Livreur",
      price: "15%",
      period: "de commission",
      icon: <Crown className="h-8 w-8 text-green-600" />,
      description: "Pour les partenaires de livraison",
      features: [
        "Application mobile dédiée",
        "Planification des tournées",
        "Paiements automatiques",
        "Assurance livraison incluse",
        "Formation et support",
        "Bonus de performance",
        "Flexibilité d'horaires"
      ],
      cta: "Devenir livreur",
      popular: false,
      link: "/register?role=delivery"
    }
  ];

  const additionalServices = [
    {
      name: "Assurance Premium",
      price: "1000 CFA/mois",
      description: "Protection complète pour vos achats et livraisons"
    },
    {
      name: "Support Prioritaire",
      price: "500 CFA/mois",
      description: "Assistance dédiée 24/7 avec temps de réponse garanti"
    },
    {
      name: "Analytics Avancées",
      price: "2000 CFA/mois",
      description: "Rapports détaillés et insights business pour marchands"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tarifs transparents pour tous
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Pas de frais cachés, pas d'engagement.
            </p>
          </div>

          {/* Plans principaux */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative shadow-lg hover:shadow-xl transition-shadow ${plan.popular ? 'ring-2 ring-amber-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Populaire
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className={`w-full ${plan.popular ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                  >
                    <Link to={plan.link}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Services additionnels */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Services additionnels</h2>
              <p className="text-lg text-gray-600">
                Améliorez votre expérience avec nos services premium
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {additionalServices.map((service, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <div className="text-2xl font-bold text-amber-600">{service.price}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Questions fréquentes sur les tarifs
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Y a-t-il des frais cachés ?</h3>
                  <p className="text-gray-600">Non, tous nos tarifs sont transparents. Les clients ne paient rien, les marchands paient uniquement une commission sur les ventes.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Comment fonctionne la commission marchand ?</h3>
                  <p className="text-gray-600">La commission de 2,5% est prélevée uniquement sur les ventes réussites, incluant le traitement des paiements et l'accès à la plateforme.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Puis-je changer de plan ?</h3>
                  <p className="text-gray-600">Oui, vous pouvez changer de rôle ou ajouter des services à tout moment depuis votre profil.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Comment sont calculés les frais de livraison ?</h3>
                  <p className="text-gray-600">Les frais sont calculés en fonction de la distance et du type de livraison. Les livreurs reçoivent 85% des frais de livraison.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Le BNPL a-t-il des frais ?</h3>
                  <p className="text-gray-600">Le paiement échelonné est gratuit pour les clients. Les marchands bénéficient d'un taux de conversion plus élevé.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Support client inclus ?</h3>
                  <p className="text-gray-600">Oui, le support de base est inclus pour tous. Le support prioritaire est disponible en option.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Rejoignez des milliers d'utilisateurs qui font confiance à Yoombal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                <Link to="/register">S'inscrire maintenant</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tarifs;
