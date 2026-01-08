
import React from 'react';
import { Card } from '@/components/ui/card';

const PaymentMethods = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Méthodes de paiement
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Intégration native avec les solutions de paiement les plus populaires au Sénégal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 bg-white border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-white font-bold text-xl">OM</span>
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900">Orange Money</h3>
            <p className="text-sm text-gray-600 text-center mt-2">Paiement mobile sécurisé</p>
          </Card>

          <Card className="p-6 bg-white border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900">Wave</h3>
            <p className="text-sm text-gray-600 text-center mt-2">Transferts instantanés</p>
          </Card>

          <Card className="p-6 bg-white border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-white font-bold text-sm">BNPL</span>
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900">Paiement échelonné</h3>
            <p className="text-sm text-gray-600 text-center mt-2">Achetez maintenant, payez plus tard</p>
          </Card>

          <Card className="p-6 bg-white border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-white font-bold text-sm">SMS</span>
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900">SMS/USSD</h3>
            <p className="text-sm text-gray-600 text-center mt-2">Sans connexion internet</p>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Paiement échelonné intelligent
            </h3>
            <p className="text-gray-600 mb-6">
              Notre système d'évaluation de crédit fonctionne même hors ligne grâce à l'intelligence artificielle embarquée.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2 min</div>
                <div className="text-sm text-gray-600">Évaluation de crédit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 mb-2">3-12</div>
                <div className="text-sm text-gray-600">Mois de paiement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">0%</div>
                <div className="text-sm text-gray-600">Frais cachés</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
