
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DeliveryManagement from '@/components/DeliveryManagement';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function AdminDeliveries() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center gap-3">
            <Link to="/admin" className="text-amber-600 hover:underline">← Retour Admin</Link>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
                <Truck className="h-8 w-8 text-green-600" />
                Gestion des Livreurs et Zones
            </h1>
            <p className="text-gray-600 mt-2">Gérez vos livreurs et vos zones de livraison.</p>
          </div>
          <DeliveryManagement />
        </div>
      </main>
      <Footer />
    </div>
  );
}
