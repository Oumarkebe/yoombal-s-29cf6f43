import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import {
  UserProfile,
  AppRole,
  UserStatus,
  KycStatus,
  getHighestRole,
  ROLE_PRIORITY,
} from '@/types/auth';

// Re-export types for backward compatibility
export type { UserProfile, AppRole, UserStatus, KycStatus };

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (userData: RegisterData) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: AppRole;
  businessName?: string;
  businessType?: string;
  vehicleType?: string;
  zone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Validate that a string is a valid AppRole
const isValidRole = (role: string): role is AppRole => {
  return ROLE_PRIORITY.includes(role as AppRole);
};

// Validate that a string is a valid UserStatus
const isValidStatus = (status: string): status is UserStatus => {
  return ['active', 'inactive', 'pending', 'suspended', 'blocked'].includes(status);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);

        if (session?.user) {
          // Use setTimeout to avoid potential recursive issues and correctly handle loading state
          setTimeout(async () => {
            if (mounted) {
              await fetchUserProfile(session.user);
              setIsLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (mounted) {
          setSession(session);
          if (session?.user) {
            await fetchUserProfile(session.user);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      console.log('Fetching profile and roles for user:', authUser.id);

      const [profileRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle(),
        supabase.from('user_roles').select('role').eq('user_id', authUser.id)
      ]);

      const { data: profile, error: profileError } = profileRes;
      const { data: userRolesData, error: rolesError } = rolesRes;

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // If profile doesn't exist, we still set basic user info
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          firstName: authUser.user_metadata?.first_name || '',
          lastName: authUser.user_metadata?.last_name || '',
          phone: authUser.user_metadata?.phone || '',
          role: 'user',
          roles: ['user'],
          status: 'active',
        });
        return;
      }

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
      }

      if (profile) {
        const profileData = profile as any;

        // Get all roles from the user_roles table
        const allRolesFromDB: AppRole[] = (userRolesData?.map(r => r.role) || []).filter(isValidRole);

        // Determine primary role (highest privilege)
        const primaryRole = allRolesFromDB.length > 0
          ? getHighestRole(allRolesFromDB)
          : 'user';

        // Combine all roles (ensure at least 'user' role)
        const allRoles: AppRole[] = allRolesFromDB.length > 0
          ? [...new Set(allRolesFromDB)]
          : ['user'];

        // Parse status with validation
        const userStatus: UserStatus = profileData.status && isValidStatus(profileData.status)
          ? profileData.status
          : 'active';

        // Parse KYC status
        const kycStatus: KycStatus = profileData.kyc_status || 'none';

        setUser({
          id: profileData.id,
          email: authUser.email || '',
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          phone: profileData.phone || '',
          role: primaryRole,
          roles: allRoles,
          status: userStatus,
          businessName: profileData.business_name,
          businessType: profileData.business_type,
          vehicleType: profileData.vehicle_type,
          zone: profileData.zone,
          merchant_name: profileData.merchant_name,
          delivery_name: profileData.delivery_name,
          client_name: profileData.client_name,
          kyc_status: kycStatus,
          kyc_id_card_url: profileData.kyc_id_card_url,
          kyc_selfie_url: profileData.kyc_selfie_url,
          credit_limit: profileData.credit_limit || 0,
          current_debt: profileData.current_debt || 0,
          avatar_url: profileData.avatar_url,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at,
        });
        console.log('Profile and roles loaded:', {
          roles: allRoles,
          primaryRole,
          status: userStatus,
          email: authUser.email
        });
      } else {
        console.warn('Profile not found for user:', authUser.id);
        // Fallback: Set basic user state so the app doesn't hang
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          firstName: authUser.user_metadata?.first_name || '',
          lastName: authUser.user_metadata?.last_name || '',
          phone: authUser.user_metadata?.phone || '',
          role: 'user',
          roles: ['user'],
          status: 'pending',
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const refreshProfile = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      console.log('Login successful for:', email);
      return {};
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { error: 'Une erreur est survenue lors de la connexion' };
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      console.log('Registering user:', userData.email, 'with redirect:', redirectUrl);

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role,
            business_name: userData.businessName,
            business_type: userData.businessType,
            vehicle_type: userData.vehicleType,
            zone: userData.zone
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        setIsLoading(false);
        return { error: error.message };
      }

      // Automatically create a profile if it doesn't exist (useful for local dev without triggers)
      if (data.user) {
        console.log('Creating profile for new user:', data.user.id);
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            business_name: userData.businessName,
            business_type: userData.businessType,
            vehicle_type: userData.vehicleType,
            zone: userData.zone,
            status: 'active',
          }
        ]);

        if (profileError) {
          console.warn('Manual profile creation error (might already exist):', profileError);
        } else {
          console.log('Profile created successfully');
        }

        // Also add the role to user_roles
        const { error: roleError } = await supabase.from('user_roles').insert([
          { user_id: data.user.id, role: userData.role }
        ]);

        if (roleError) {
          console.warn('User role insertion error:', roleError);
        }
      }

      console.log('Registration successful for:', userData.email);
      return {};
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return { error: 'Une erreur est survenue lors de l\'inscription' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    profile: user, // Alias for backward compatibility
    session,
    login,
    register,
    logout,
    isAuthenticated: !!session,
    isLoading,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============ Utility Hooks ============

/**
 * Hook to check if the current user has one of the required roles
 */
export function useRole(requiredRoles: AppRole | AppRole[]) {
  const { user, isLoading } = useAuth();

  if (isLoading) return false;
  if (!user) return false;

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return user.roles.some(role => roles.includes(role));
}

/**
 * Hook to check if the current user has a specific permission
 */
export function useHasPermission(resource: string, action: 'create' | 'read' | 'update' | 'delete' | 'manage') {
  const { user, isLoading } = useAuth();

  if (isLoading) return false;
  if (!user) return false;

  // Admin has all permissions
  if (user.roles.includes('admin')) return true;

  // Import and check ROLE_PERMISSIONS dynamically to avoid circular deps
  const { ROLE_PERMISSIONS } = require('@/types/auth');

  return user.roles.some(role => {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.some((p: any) =>
      (p.resource === '*' || p.resource === resource) &&
      (p.action === 'manage' || p.action === action)
    );
  });
}

/**
 * Hook to check if user account is in a valid status
 */
export function useIsActiveUser() {
  const { user, isLoading } = useAuth();

  if (isLoading) return false;
  if (!user) return false;

  return user.status === 'active';
}
