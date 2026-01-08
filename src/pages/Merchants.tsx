
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Truck, 
  BarChart3,
  Shield,
  Smartphone,
  Globe,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Merchants = () => {
  const benefits = [
    {
      icon: <Store className="h-8 w-8 text-blue-600" />,
      title: "Boutique en ligne complète",
      description: "Créez votre boutique personnalisée avec gestion des produits, stocks et commandes."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      title: "Paiement échelonné BNPL",
      description: "Augmentez vos ventes de 40% en moyenne grâce au paiement en plusieurs fois."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Croissance garantie",
      description: "Accédez à une base de clients en constante croissance et boostez votre chiffre d'affaires."
    },
    {
      icon: <Truck className="h-8 w-8 text-orange-600" />,
      title: "Livraison intégrée",
      description: "Réseau de livreurs partenaires pour une livraison rapide et fiable."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-red-600" />,
      title: "Analytics avancées",
      description: "Tableau de bord complet avec statistiques de ventes et insights clients."
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Paiements sécurisés",
      description: "Intégration avec Wave, Orange Money et autres solutions de paiement locales."
    }
  ];

  const features = [
    "Commission compétitive de seulement 2,5%",
    "Pas de frais d'inscription",
    "Support client dédié",
    "Formation gratuite",
    "API d'intégration",
    "Outils marketing inclus",
    "Gestion multi-canaux",
    "Rapports en temps réel"
  ];

  const testimonials = [
    {
      name: "Aminata Diallo",
      business: "Mode & Accessoires",
      image: "/placeholder.svg",
      rating: 5,
      comment: "Grâce à Yoombal, j'ai pu doubler mes ventes en 6 mois. Le système BNPL attire beaucoup plus de clients."
    },
    {
      name: "Moussa Ba",
      business: "Électronique",
      image: "/placeholder.svg",
      rating: 5,
      comment: "La plateforme est facile à utiliser et le support client est excellent. Je recommande vivement."
    },
    {
      name: "Fatou Seck",
      business: "Artisanat local",
      image: "/placeholder.svg",
      rating: 5,
      comment: "Yoombal m'a permis de vendre mes produits dans tout le Sénégal. C'est révolutionnaire !"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Inscription",
      description: "Créez votre compte marchand en quelques minutes"
    },
    {
      number: "2",
      title: "Configuration",
      description: "Ajoutez vos produits, configurez vos tarifs et modes de livraison"
    },
    {
      number: "3",
      title: "Validation",
      description: "Notre équipe valide votre boutique sous 24h"
    },
    {
      number: "4",
      title: "Vente",
      description: "Commencez à vendre et recevez vos paiements automatiquement"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Développez votre business avec Yoombal
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Rejoignez la première plateforme e-commerce du Sénégal et vendez en ligne avec le paiement échelonné
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                  <Link to="/register?role=merchant">Devenir marchand</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-white hover:bg-white hover:text-gray-900">
                  <Link to="/contact">Nous contacter</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <p className="text-gray-600">Marchands actifs</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
                <p className="text-gray-600">Produits en ligne</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">40%</div>
                <p className="text-gray-600">Augmentation moyenne des ventes</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">24h</div>
                <p className="text-gray-600">Temps de validation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir Yoombal ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une plateforme complète conçue pour maximiser vos ventes et simplifier votre gestion
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      {benefit.icon}
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Tout ce dont vous avez besoin pour réussir
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                    <Link to="/register?role=merchant">Commencer maintenant</Link>
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <span>Application mobile</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Gérez votre boutique depuis votre smartphone avec notre app dédiée.</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-green-600" />
                      <span>Portée nationale</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Vendez dans tout le Sénégal grâce à notre réseau de livraison étendu.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-xl text-gray-600">
                Démarrez votre boutique en ligne en 4 étapes simples
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ce que disent nos marchands
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez les témoignages de nos partenaires qui réussissent
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.business}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à booster vos ventes ?
            </h2>
            <p className="text-xl mb-8">
              Rejoignez Yoombal dès aujourd'hui et profitez de tous nos avantages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
                <Link to="/register?role=merchant">Créer ma boutique</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
                <Link to="/tarifs">Voir les tarifs</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Merchants;
