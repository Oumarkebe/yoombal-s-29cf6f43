
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StatCard } from "@/components/admin/StatCard";
import { Users, Package, ShoppingCart, DollarSign, BarChart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";

export default function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboardStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Erreur lors du chargement des statistiques
      </div>
    );
  }

  const stats = [
    { title: "Utilisateurs", value: data?.usersCount || 0, icon: <Users className="h-5 w-5 text-blue-500" />, description: "Total inscrits" },
    { title: "Produits", value: data?.productsCount || 0, icon: <Package className="h-5 w-5 text-green-500" />, description: "Produits affichés" },
    { title: "Commandes", value: data?.ordersCount || 0, icon: <ShoppingCart className="h-5 w-5 text-orange-500" />, description: "Commandes totales" },
    {
      title: "Revenu Total",
      value: `${(data?.totalRevenue || 0).toLocaleString('fr-FR')} CFA`,
      icon: <DollarSign className="h-5 w-5 text-purple-500" />,
      description: "Commandes terminées"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800 flex items-center gap-2">
              <BarChart className="h-8 w-8 text-blue-500" />
              Dashboard Administrateur
            </h1>
            <Link
              to="/admin"
              className="text-amber-600 bg-white hover:bg-amber-50 border rounded px-4 py-2 font-semibold shadow-sm flex items-center gap-1 transition"
            >← Retour à l’espace admin</Link>
          </div>

          {/* KPIs */}
          <div className="mb-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <StatCard
                key={s.title}
                title={s.title}
                value={s.value}
                icon={s.icon}
                description={s.description}
              />
            ))}
          </div>

          {/* Placeholder chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Évolution des commandes</h2>
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=80"
              alt="Graphique placeholder"
              className="w-full max-w-lg h-64 object-cover rounded"
            />
            <p className="text-gray-500 text-sm mt-2">(Graphique exemple – connecter vos vraies données)</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
