
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">À propos de Yoombal</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-6">
              Yoombal est une plateforme de commerce électronique innovante qui connecte les commerçants locaux avec leurs clients, 
              offrant des solutions de paiement flexibles et des services de livraison efficaces.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Notre Mission</h2>
            <p className="text-gray-700 mb-6">
              Démocratiser le commerce électronique en Afrique en offrant aux petites et moyennes entreprises 
              les outils nécessaires pour prospérer dans l'économie numérique.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Nos Services</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Marketplace pour les commerçants locaux</li>
              <li>Solutions de paiement BNPL (Buy Now, Pay Later)</li>
              <li>Services de livraison rapide</li>
              <li>Programme de fidélité</li>
              <li>Assurance livraison</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
