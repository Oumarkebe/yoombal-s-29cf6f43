import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  Menu,
  ShoppingCart,
  LogOut,
  Settings,
  BarChart3,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();

  const isAdmin = user?.role === 'admin';
  const isMerchant = user?.role === 'merchant';
  const isClient = user?.role === 'client';

  const totalItems = getTotalItems();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminMenuItems = [
    { to: "/admin", label: "Administration", icon: <Settings className="w-4 h-4" /> },
    { to: "/admin/statistics", label: "Statistiques", icon: <BarChart3 className="w-4 h-4" /> },
    { to: "/economic-model", label: "Modèle Économique", icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-amber-600">
                Yoombal
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Accueil
              </Link>
              <Link to="/marketplace" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Marketplace
              </Link>
              <Link to="/tarifs" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Tarifs
              </Link>
              <Link to="/merchants" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Marchands
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Admin
                </Link>
              )}
              {isMerchant && (
                <Link to="/merchant" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Tableau de bord
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && (
              <div className="hidden md:flex items-center space-x-4">
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-2 text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            {user ? (
              <>
                {location.pathname !== '/cart' && (
                  <Link to="/cart" className="flex items-center text-gray-700 hover:text-amber-600">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <span className="ml-1 text-sm font-semibold text-amber-600">{totalItems}</span>
                    )}
                  </Link>
                )}
                <div className="relative inline-block text-left">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 cursor-pointer">
                        <User className="w-5 h-5" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white">
                      <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-700 transition-colors">
                  Inscription
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isOpen ? 'block' : 'none'} bg-white shadow-md`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="text-gray-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeMenu}
          >
            Accueil
          </Link>
          <Link
            to="/marketplace"
            className="text-gray-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeMenu}
          >
            Marketplace
          </Link>
          <Link
            to="/tarifs"
            className="text-gray-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeMenu}
          >
            Tarifs
          </Link>
          <Link
            to="/merchants"
            className="text-gray-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeMenu}
          >
            Marchands
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeMenu}
          >
            Contact
          </Link>
          {isMerchant && (
            <Link
              to="/merchant"
              className="text-gray-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Tableau de bord
            </Link>
          )}
        </div>
        {isAdmin && (
          <div className="space-y-1 px-2">
            {adminMenuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 text-gray-700 hover:text-amber-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        )}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="mt-3 space-y-1">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600"
                  onClick={closeMenu}
                >
                  Profil
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600"
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600"
                  onClick={closeMenu}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600"
                  onClick={closeMenu}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


