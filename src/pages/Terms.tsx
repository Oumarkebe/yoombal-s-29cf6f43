
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import T from "@/components/T";

const TermsPage = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <Navbar />
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 text-gray-900"><T>Conditions d'utilisation</T></h1>
      <div className="space-y-4 text-gray-700">
        <p>
          <T>Bienvenue sur Yoombal. En utilisant notre plateforme, vous acceptez les présentes conditions générales d'utilisation.</T>
        </p>
        <p>
          <strong><T>1. Objet</T></strong><br />
          <T>Yoombal permet l'achat, la vente et la livraison de produits avec paiement échelonné.</T>
        </p>
        <p>
          <strong><T>2. Inscription</T></strong><br />
          <T>Vous devez fournir des informations exactes lors de la création de votre compte.</T>
        </p>
        <p>
          <strong><T>3. Paiement</T></strong><br />
          <T>Les paiements sont sécurisés et conformes aux normes BCEAO.</T>
        </p>
        <p>
          <strong><T>4. Responsabilités</T></strong><br />
          <T>Yoombal n'est pas responsable des litiges entre utilisateurs, sauf indication contraire.</T>
        </p>
        <p>
          <strong><T>5. Modification</T></strong><br />
          <T>Les conditions peuvent être modifiées à tout moment. Consultez cette page régulièrement.</T>
        </p>
      </div>
    </div>
    <Footer />
  </div>
);

export default TermsPage;
