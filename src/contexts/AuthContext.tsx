
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'client' | 'merchant' | 'delivery' | 'admin';
  roles: string[]; // All roles will be stored here
  businessName?: string;
  businessType?: string;
  vehicleType?: string;
  zone?: string;
  kyc_status?: 'none' | 'pending' | 'verified' | 'rejected';
  kyc_id_card_url?: string;
  kyc_selfie_url?: string;
  credit_limit?: number;
  current_debt?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (userData: RegisterData) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'client' | 'merchant' | 'delivery' | 'admin';
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

const isValidRole = (role: string): role is 'client' | 'merchant' | 'delivery' | 'admin' => {
  return ['client', 'merchant', 'delivery', 'admin'].includes(role);
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
          role: 'client',
          roles: ['client'],
        });
        return;
      }

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
      }

      if (profile) {
        const primaryRole = profile.role && isValidRole(profile.role) ? profile.role : 'client';
        const allRolesFromHook = userRolesData?.map(r => r.role) || [];
        const allRoles = [...new Set([primaryRole, ...allRolesFromHook])];

        setUser({
          id: profile.id,
          email: authUser.email || '',
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phone: profile.phone || '',
          role: primaryRole,
          roles: allRoles,
          businessName: profile.business_name,
          businessType: profile.business_type,
          vehicleType: profile.vehicle_type,
          zone: profile.zone,
          kyc_status: profile.kyc_status || 'none',
          kyc_id_card_url: profile.kyc_id_card_url,
          kyc_selfie_url: profile.kyc_selfie_url,
          credit_limit: profile.credit_limit || 0,
          current_debt: profile.current_debt || 0
        });
        console.log('Profile and roles loaded:', { roles: allRoles, email: authUser.email });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
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
    user: user, // Keep backward compatibility if needed, though user now contains profile data in our implementation
    profile: user, // Alias user as profile since we merged them
    session,
    login,
    register,
    logout,
    isAuthenticated: !!session,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook utilitaire pour vérifier le rôle de l'utilisateur
export function useRole(requiredRoles: string | string[]) {
  const { user, isLoading } = useAuth();
  if (isLoading) return false;
  if (!user) return false;
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }
  return user.role === requiredRoles;
}
