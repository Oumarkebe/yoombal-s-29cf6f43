/**
 * Type definitions for authentication, roles and permissions
 * This file centralizes all auth-related types for the application
 */

import { Database } from '@/integrations/supabase/types';

// ============ Role Types ============
// Database app_role enum: 'admin' | 'moderator' | 'user' | 'merchant' | 'driver'
export type DatabaseAppRole = Database['public']['Enums']['app_role'];

// Frontend-friendly role names that map to database roles
// client -> user, delivery -> driver (for UI display)
export type AppRole = 'admin' | 'moderator' | 'user' | 'merchant' | 'driver';

// UI display roles (used in components for better UX)
export type DisplayRole = 'client' | 'merchant' | 'delivery' | 'admin';

// Mapping between UI roles and database roles
export const ROLE_MAPPING: Record<DisplayRole, AppRole> = {
  client: 'user',
  merchant: 'merchant',
  delivery: 'driver',
  admin: 'admin',
} as const;

// Reverse mapping from database roles to UI roles
export const ROLE_DISPLAY_MAPPING: Partial<Record<AppRole, DisplayRole>> = {
  user: 'client',
  merchant: 'merchant',
  driver: 'delivery',
  admin: 'admin',
} as const;

// ============ User State Types ============
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'blocked';

export type KycStatus = 'none' | 'pending' | 'verified' | 'rejected';

// ============ Permission Types ============
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

// Role-based permissions matrix
export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  admin: [
    { resource: '*', action: 'manage' },
  ],
  moderator: [
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'products', action: 'manage' },
    { resource: 'orders', action: 'manage' },
    { resource: 'reviews', action: 'manage' },
  ],
  merchant: [
    { resource: 'products', action: 'manage' },
    { resource: 'orders', action: 'read' },
    { resource: 'orders', action: 'update' },
    { resource: 'deliveries', action: 'create' },
    { resource: 'profile', action: 'manage' },
  ],
  driver: [
    { resource: 'deliveries', action: 'read' },
    { resource: 'deliveries', action: 'update' },
    { resource: 'profile', action: 'manage' },
  ],
  user: [
    { resource: 'products', action: 'read' },
    { resource: 'orders', action: 'create' },
    { resource: 'orders', action: 'read' },
    { resource: 'reviews', action: 'create' },
    { resource: 'profile', action: 'manage' },
  ],
} as const;

// ============ User Profile Types ============
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: AppRole;
  roles: AppRole[];
  status?: UserStatus;
  business_name?: string;
  business_type?: string;
  vehicle_type?: string;
  zone?: string;
  merchant_name?: string;
  delivery_name?: string;
  client_name?: string;
  kyc_status?: KycStatus;
  kyc_id_card_url?: string;
  kyc_selfie_url?: string;
  credit_limit?: number;
  current_debt?: number;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// ============ Auth Context Types ============
export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ============ Role Hierarchy ============
// Higher index = higher privilege
export const ROLE_PRIORITY: AppRole[] = ['user', 'driver', 'merchant', 'moderator', 'admin'];

// Helper to check if role A has higher privilege than role B
export function hasHigherPrivilege(roleA: AppRole, roleB: AppRole): boolean {
  return ROLE_PRIORITY.indexOf(roleA) > ROLE_PRIORITY.indexOf(roleB);
}

// Helper to get the highest role from a list
export function getHighestRole(roles: AppRole[]): AppRole {
  if (roles.length === 0) return 'user';
  return roles.reduce((highest, current) =>
    hasHigherPrivilege(current, highest) ? current : highest
  );
}

// ============ Display Helpers ============
export const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Administrateur',
  moderator: 'Modérateur',
  merchant: 'Marchand',
  driver: 'Livreur',
  user: 'Client',
} as const;

export const ROLE_COLORS: Record<AppRole, string> = {
  admin: 'bg-red-100 text-red-800',
  moderator: 'bg-purple-100 text-purple-800',
  merchant: 'bg-blue-100 text-blue-800',
  driver: 'bg-green-100 text-green-800',
  user: 'bg-gray-100 text-gray-800',
} as const;
