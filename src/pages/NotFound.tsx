import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import T from '@/components/T';

const NotFound = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-gray-100">
    <Navbar />
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        <T>Page non trouvée</T>
      </h2>
      <p className="text-gray-600 mb-6">
        <T>Oups, la page que vous cherchez n'existe pas ou a été déplacée.</T>
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        <T>Retour à l'accueil</T>
      </Link>
    </main>
    <Footer />
  </div>
);

export default NotFound;
