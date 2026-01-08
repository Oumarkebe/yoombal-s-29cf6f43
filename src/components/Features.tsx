
import React from 'react';
import { Card } from '@/components/ui/card';

const Features = () => {
  const features = [
    {
      icon: '🌍',
      title: 'Fonctionne hors ligne',
      description: 'Continuez à utiliser l\'application même sans connexion internet. Les données se synchronisent automatiquement.'
    },
    {
      icon: '💳',
      title: 'Paiement échelonné',
      description: 'Achetez maintenant et payez en plusieurs fois. Évaluation de crédit instantanée et sécurisée.'
    },
    {
      icon: '📱',
      title: 'SMS & USSD',
      description: 'Interface de secours via SMS et USSD pour les zones à faible connectivité.'
    },
    {
      icon: '🚚',
      title: 'Livraison partout',
      description: 'Réseau de livraison couvrant tout le Sénégal, des villes aux zones rurales.'
    },
    {
      icon: '🔒',
      title: 'Sécurisé & conforme',
      description: 'Respect des normes BCEAO, GDPR et PCI-DSS. Vos données sont protégées.'
    },
    {
      icon: '🗣️',
      title: 'Multilingue',
      description: 'Interface en français et wolof avec commandes vocales pour une accessibilité maximale.'
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Yoombal ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme conçue spécifiquement pour les réalités du marché sénégalais
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-violet-200">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
