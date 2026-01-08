
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProductDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Détails du Produit</h1>
          <p className="text-gray-600">ID du produit: {id}</p>
          <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">Page en cours de développement...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
