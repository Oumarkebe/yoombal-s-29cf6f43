import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import T from '@/components/T';

const HelpPage = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
    <Navbar />
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-amber-700 mb-4">
            <T>Centre d'aide Yoombal</T>
          </h1>
          <p className="mb-6 text-gray-700">
            <T>
              Retrouvez ici les réponses aux questions fréquentes et des ressources pour vous
              accompagner.
            </T>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            <li>
              <T>Comment créer un compte marchand ou client ?</T>
            </li>
            <li>
              <T>Comment activer le paiement BNPL sur mes produits ?</T>
            </li>
            <li>
              <T>Comment suivre mes commandes et livraisons ?</T>
            </li>
            <li>
              <T>Comment contacter le support ?</T>
            </li>
            <li>
              <T>...et bien plus à venir.</T>
            </li>
          </ul>
        </Card>
      </div>
    </div>
    <Footer />
  </div>
);

export default HelpPage;
