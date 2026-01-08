
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DeliveryDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de Bord Livraison</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Livraisons du jour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-sm text-gray-500">En cours</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Livraisons terminées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-sm text-gray-500">Cette semaine</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,200 CFA</div>
                <p className="text-sm text-gray-500">Cette semaine</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Suivi en temps réel des livraisons, optimisation des itinéraires, 
                et gestion des livreurs.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryDashboard;
