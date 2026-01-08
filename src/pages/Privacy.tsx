
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import T from "@/components/T";

const PrivacyPage = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <Navbar />
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6 text-gray-900"><T>Politique de confidentialité</T></h1>
      <div className="space-y-4 text-gray-700">
        <p>
          <T>Nous attachons une grande importance à la protection de vos données personnelles.</T>
        </p>
        <p>
          <strong><T>1. Collecte des données</T></strong><br />
          <T>Nous collectons uniquement les informations nécessaires à la fourniture de nos services.</T>
        </p>
        <p>
          <strong><T>2. Utilisation</T></strong><br />
          <T>Vos données sont utilisées pour améliorer votre expérience et ne sont jamais revendues.</T>
        </p>
        <p>
          <strong><T>3. Sécurité</T></strong><br />
          <T>Nous mettons en œuvre des mesures de sécurité conformes aux normes BCEAO et GDPR.</T>
        </p>
        <p>
          <strong><T>4. Vos droits</T></strong><br />
          <T>Vous pouvez accéder, corriger ou supprimer vos données à tout moment.</T>
        </p>
      </div>
    </div>
    <Footer />
  </div>
);

export default PrivacyPage;
