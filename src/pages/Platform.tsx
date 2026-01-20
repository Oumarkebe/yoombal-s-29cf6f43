import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Store, Truck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { usePublicStats } from '@/hooks/usePublicStats';
import PublicStatsDisplay from '@/components/PublicStats';
import T from '@/components/T';

const PlatformPage = () => {
  const { settings, isLoading: isLoadingSettings } = usePlatformSettings();
  const { data: stats, isLoading: isLoadingStats } = usePublicStats();
  const userBenefits = [
    {
      icon: ShoppingBag,
      role: 'Pour les Clients',
      title: 'Achetez simplement, payez sereinement',
      benefits: [
        'Payez en plusieurs fois (BNPL) sur des milliers de produits.',
        'Un large choix de produits auprès de vendeurs locaux de confiance.',
        'Livraison rapide et fiable partout au Sénégal.',
        'Interface simple et accessible, même sans connexion internet.',
      ],
      cta: 'Explorer la marketplace',
      link: '/marketplace',
    },
    {
      icon: Store,
      role: 'Pour les Marchands',
      title: 'Vendez plus, gérez mieux',
      benefits: [
        'Créez votre boutique en ligne en quelques clics.',
        'Touchez plus de clients grâce au paiement échelonné.',
        'Acceptez les paiements mobiles locaux (Wave, Orange Money).',
        'Gérez vos ventes et votre stock depuis un tableau de bord intuitif.',
      ],
      cta: 'Devenir marchand',
      link: '/register?role=merchant',
    },
    {
      icon: Truck,
      role: 'Pour les Livreurs',
      title: 'Devenez votre propre patron',
      benefits: [
        'Générez des revenus en livrant des colis.',
        'Travaillez selon votre propre emploi du temps.',
        'Recevez des paiements rapides et sécurisés.',
        'Rejoignez un réseau de livraison en pleine croissance.',
      ],
      cta: 'Devenir livreur',
      link: '/register?role=delivery',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-900 to-blue-900/80 text-white py-20 md:py-28 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight animate-fade-in-up">
              <T>Une plateforme, des possibilités infinies</T>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              <T>
                Yoombal connecte clients, marchands et livreurs pour créer un écosystème de commerce
                inclusif et puissant, adapté aux réalités du Sénégal.
              </T>
            </p>
          </div>
        </div>

        {settings?.publicStats?.showPublicStats && (
          <PublicStatsDisplay
            stats={stats}
            settings={settings.publicStats}
            isLoading={isLoadingSettings || isLoadingStats}
          />
        )}

        {/* Benefits Section */}
        <div className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {userBenefits.map((item, index) => (
                <Card
                  key={index}
                  className="flex flex-col border-gray-200 dark:border-gray-800 dark:bg-gray-900/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
                      <item.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      <T>{item.role}</T>
                    </p>
                    <CardTitle className="text-2xl">
                      <T>{item.title}</T>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <ul className="space-y-3 mb-8 text-gray-600 dark:text-gray-300 flex-grow">
                      {item.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-1 shrink-0" />
                          <span>
                            <T>{benefit}</T>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      size="lg"
                      className="w-full mt-auto bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
                    >
                      <Link to={item.link}>
                        <T>{item.cta}</T>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-100 dark:bg-gray-900 py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              <T>Prêt à nous rejoindre ?</T>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              <T>
                Créez votre compte en quelques minutes et commencez votre aventure avec Yoombal dès
                aujourd'hui.
              </T>
            </p>
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/register">
                <T>Commencer gratuitement</T>
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlatformPage;
