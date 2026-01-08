
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Renvoie un rôle normalisé anglais
function normalizeRole(role: string): "admin" | "merchant" | "delivery" | "client" | "" {
  if (!role) return "";
  let base = String(role).toLowerCase().trim();
  base = base.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // retire accents
  if (["admin"].includes(base)) return "admin";
  if (["marchand", "merchant"].includes(base)) return "merchant";
  if (["livreur", "delivery"].includes(base)) return "delivery";
  if (["client"].includes(base)) return "client";
  return "";
}

// Configuration for role-based redirection
const ROLE_REDIRECT_CONFIG: Record<string, string> = {
  admin: "/admin",
  merchant: "/merchant-dashboard",
  delivery: "/profile",
  client: "/profile",
};

const ROLE_PRIORITY = ["admin", "merchant", "delivery", "client"];

export function useLoginRedirect({
  isAuthLoading,
  isAuthenticated,
  user
}: {
  isAuthLoading: boolean,
  isAuthenticated: boolean,
  user: any // User from useAuth now contains the roles
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectCalledRef = useRef(false);

  useEffect(() => {
    if (isAuthLoading) return;
    if (redirectCalledRef.current) return;

    if (isAuthenticated && user && user.roles) {
      // 1. Collecter et normaliser tous les rôles de l'utilisateur
      const rolesNames = [...new Set(user.roles.map(normalizeRole).filter(Boolean))];

      // 2. Déterminer le rôle prioritaire
      const highestPriorityRole = ROLE_PRIORITY.find(role => rolesNames.includes(role));
      
      // 3. Déterminer le chemin de redirection
      const redirectPath = highestPriorityRole ? ROLE_REDIRECT_CONFIG[highestPriorityRole] : "/";

      // 4. Rediriger si on n'est pas déjà sur la bonne page
      if (redirectPath && location.pathname !== redirectPath) {
        console.log(`[Login Redirect -- ACTION] Redirecting from ${location.pathname} to ${redirectPath} for role: ${highestPriorityRole || 'default'}`);
        redirectCalledRef.current = true;
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, isAuthLoading, navigate, location]);
}
