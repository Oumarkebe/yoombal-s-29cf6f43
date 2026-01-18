
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StatCard } from "@/components/admin/StatCard";
import { Users, Package, ShoppingCart, DollarSign, BarChart, Loader2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data, isLoading: isStatsLoading, error: statsError } = useAdminDashboardStats();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useAdminAnalytics();

  const isLoading = isStatsLoading || isAnalyticsLoading;
  const error = statsError;

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
    { title: "KYC en attente", value: data?.pendingKycCount || 0, icon: <Shield className="h-5 w-5 text-red-500" />, description: "Demandes à valider" },
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

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Volume des Commandes (7j)</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrders)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Revenus (7j)</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} CFA`} />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* User Management Section */}
          <UserManagementTable />
        </div>
      </main>
      <Footer />
    </div>
  );
}
