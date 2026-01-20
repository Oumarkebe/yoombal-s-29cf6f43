import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Award, Package, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdminActions() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Gestion</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button asChild variant="outline" size="lg" className="justify-start text-left h-20">
            <Link to="/admin/roles">
              <User className="mr-4 text-blue-500" size={24} />
              <div>
                <p className="font-semibold">Utilisateurs & Rôles</p>
                <p className="text-xs text-gray-500">Gérer les accès et les utilisateurs</p>
              </div>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="justify-start text-left h-20">
            <Link to="/admin/statistics">
              <Award className="mr-4 text-green-500" size={24} />
              <div>
                <p className="font-semibold">Statistiques</p>
                <p className="text-xs text-gray-500">Visualiser les données de la plateforme</p>
              </div>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="justify-start text-left h-20">
            <Link to="/admin/products">
              <Package className="mr-4 text-orange-500" size={24} />
              <div>
                <p className="font-semibold">Produits</p>
                <p className="text-xs text-gray-500">Gérer tous les produits</p>
              </div>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="justify-start text-left h-20 opacity-50 cursor-not-allowed"
          >
            <div className="flex items-center">
              <ShoppingCart className="mr-4 text-purple-500" size={24} />
              <div>
                <p className="font-semibold">Commandes</p>
                <p className="text-xs text-gray-500">Bientôt disponible</p>
              </div>
            </div>
          </Button>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Compte</h2>
        <Button variant="destructive" size="lg" onClick={handleLogout} className="w-full sm:w-auto">
          <LogOut className="mr-2" /> Déconnexion
        </Button>
      </div>
    </div>
  );
}
