
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { AdminOrderList } from '@/components/admin/AdminOrderList';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminOrders() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Link to="/admin" className="inline-flex items-center text-amber-600 hover:underline mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au tableau de bord
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <ShoppingCart className="w-8 h-8 text-orange-500" />
                Gestion des Commandes
              </h1>
              <p className="text-gray-500 mt-2">
                Consultez et gérez toutes les commandes de la plateforme.
              </p>
            </div>
            <AdminOrderList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
