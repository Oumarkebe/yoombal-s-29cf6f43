
import React from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats, formatCurrency } from "./AdminStatistics";
import { StatCard } from "@/components/admin/StatCard";
import { Loader2, Users, Package, ShoppingCart, DollarSign, AlertTriangle, BarChart, Truck, Settings, BrainCircuit, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from 'react-router-dom';
import { usePlatformSettings } from "@/hooks/usePlatformSettings";

const AdminActionCard = ({ name, href, icon: Icon, description, disabled }: { name: string; href: string; icon: React.ElementType; description: string; disabled?: boolean; }) => {
  const content = (
    <div className={`p-6 flex flex-col items-start gap-4 rounded-xl border bg-white shadow-sm transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-amber-200'}`}>
      <div className="p-3 rounded-full bg-amber-100">
        <Icon className="w-6 h-6 text-amber-600" />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );

  if (disabled) {
    return content;
  }

  return <Link to={href}>{content}</Link>;
};

export default function AdminPanel() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
  });
  const { settings, isLoading: isLoadingSettings } = usePlatformSettings();

  const someStatIsVisible = settings?.dashboard?.showUserCount || settings?.dashboard?.showProductCount || settings?.dashboard?.showOrderCount || settings?.dashboard?.showTotalRevenue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-800">Tableau de bord</h1>
            <p className="text-lg text-gray-500 mt-2">Bienvenue dans votre espace d'administration.</p>
            <div className="mt-4">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded border font-semibold shadow text-blue-700 bg-white hover:bg-blue-50 transition"
              >
                <BarChart className="h-5 w-5" />
                Aller au Dashboard avancé
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Vue d'ensemble</h2>
            {isLoading || isLoadingSettings ? (
              <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-sm border">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                <span className="ml-3 text-gray-600">Chargement des statistiques...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                  Impossible de charger la vue d'ensemble. Veuillez réessayer plus tard.
                </AlertDescription>
              </Alert>
            ) : someStatIsVisible ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {settings?.dashboard?.showUserCount && <StatCard title="Utilisateurs" value={data?.userCount ?? 0} icon={<Users className="h-5 w-5 text-blue-500" />} description="Total des utilisateurs inscrits" />}
                {settings?.dashboard?.showProductCount && <StatCard title="Produits" value={data?.productCount ?? 0} icon={<Package className="h-5 w-5 text-green-500" />} description="Total des produits sur la plateforme" />}
                {settings?.dashboard?.showOrderCount && <StatCard title="Commandes" value={data?.orderCount ?? 0} icon={<ShoppingCart className="h-5 w-5 text-orange-500" />} description="Total des commandes passées" />}
                {settings?.dashboard?.showTotalRevenue && <StatCard title="Revenu Total" value={formatCurrency(data?.totalRevenue ?? 0)} icon={<DollarSign className="h-5 w-5 text-purple-500" />} description="Revenu total généré" />}
              </div>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Statistiques masquées</AlertTitle>
                <AlertDescription>
                  Toutes les statistiques sont actuellement masquées. Vous pouvez les réactiver dans les <Link to="/admin/settings" className="font-semibold underline">paramètres</Link>.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Actions Rapides</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AdminActionCard name="Statistiques" href="/admin/statistics" icon={BarChart} description="Voir les statistiques de ventes." />
              <AdminActionCard name="Produits" href="/admin/products" icon={Package} description="Gérer tous les produits." />
              <AdminActionCard name="Commandes" href="/admin/orders" icon={ShoppingCart} description="Voir et gérer les commandes." />
              <AdminActionCard name="Utilisateurs" href="/admin/roles" icon={Users} description="Gérer les utilisateurs et leurs rôles." />
              <AdminActionCard name="Livreurs" href="/admin/deliveries" icon={Truck} description="Gérer les livreurs." />
              <AdminActionCard name="Demandes KYC" href="/admin/kyc" icon={ShieldCheck} description="Valider les identités pour BNPL." />
              <AdminActionCard name="Centre Premium" href="/admin/ai" icon={BrainCircuit} description="Gérer toutes les fonctionnalités premium et IA." />
              <AdminActionCard name="Paramètres" href="/admin/settings" icon={Settings} description="Configurer les paramètres de la plateforme." />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
