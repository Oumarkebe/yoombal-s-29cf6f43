
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { AdminProductList } from '@/components/admin/AdminProductList';

export default function AdminProducts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-amber-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Package className="w-8 h-8 text-green-600" />
            Gestion des Produits
          </h1>
          <p className="text-gray-500">
            Consultez et recherchez parmi tous les produits de la plateforme.
          </p>
        </div>
        <AdminProductList />
      </div>
    </div>
  );
}
