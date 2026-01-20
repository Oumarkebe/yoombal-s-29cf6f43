import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 👑 Admin Bypass: Admin can access any role-protected route
  if (user.role === 'admin' || user.roles.includes('admin')) {
    return <>{children || <Outlet />}</>;
  }

  if (!allowedRoles.includes(user.role || '')) {
    // Redirect to their specific dashboard based on their actual role
    if (user.role === 'merchant') return <Navigate to="/merchant" replace />;
    if (user.role === 'driver') return <Navigate to="/delivery" replace />;

    // Default fallback
    return <Navigate to="/" replace />;
  }

  return <>{children || <Outlet />}</>;
};
