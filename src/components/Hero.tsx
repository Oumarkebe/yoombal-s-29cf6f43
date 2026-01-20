import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ShoppingBag, User, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-blue-400"></div>
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-violet-400"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-indigo-400"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Commerce inclusif
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              pour le Sénégal
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plateforme e-commerce hors ligne avec paiement échelonné. Accessible partout, même sans
            connexion internet.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-blue-100">
              <span className="text-sm font-medium text-gray-700">🌍 Hors ligne</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-blue-100">
              <span className="text-sm font-medium text-gray-700">💳 Orange Money & Wave</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-blue-100">
              <span className="text-sm font-medium text-gray-700">📱 SMS/USSD</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-blue-100">
              <span className="text-sm font-medium text-gray-700">🗣️ Wolof & Français</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-lg px-8"
              asChild
            >
              <Link to="/register">Commencer gratuitement</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-blue-300 hover:bg-blue-50"
              asChild
            >
              <Link to="/demo">Voir la démo</Link>
            </Button>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <User className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Client</h3>
              <p className="text-gray-600 mb-4">
                Achetez maintenant, payez plus tard. Livraison partout au Sénégal.
              </p>
              <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50" asChild>
                <Link to="/register?role=client">Devenir client</Link>
              </Button>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Marchand</h3>
              <p className="text-gray-600 mb-4">
                Vendez vos produits en ligne et hors ligne. Gestion simple et efficace.
              </p>
              <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50" asChild>
                <Link to="/register?role=merchant">Devenir marchand</Link>
              </Button>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Truck className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Livreur</h3>
              <p className="text-gray-600 mb-4">
                Rejoignez notre réseau de livraison. Travaillez de manière flexible.
              </p>
              <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50" asChild>
                <Link to="/register?role=delivery">Devenir livreur</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="text-blue-600" size={24} />
      </div>
    </div>
  );
};

export default Hero;
