import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, AppRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  roles?: AppRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles: requiredRoles }) => {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the page the user wanted to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check user status - block suspended/blocked users
  if (user?.status && ['suspended', 'blocked'].includes(user.status)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Compte {user.status === 'suspended' ? 'suspendu' : 'bloqué'}
          </h1>
          <p className="text-gray-600">Veuillez contacter le support pour plus d'informations.</p>
        </div>
      </div>
    );
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasAccess = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
