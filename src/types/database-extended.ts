// Extended database types for tables not yet in auto-generated types.ts
// These should be removed once types.ts is regenerated from Supabase

export interface AiChatSession {
  id: string;
  user_id: string;
  messages: any[];
  context?: any;
  created_at: string;
  updated_at: string;
}

export interface AdsCampaign {
  id: string;
  merchant_id: string;
  product_id: string;
  name?: string;
  daily_budget: number;
  current_spend: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'paused' | 'draft' | 'ended';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdsAnalytics {
  id: string;
  campaign_id: string;
  event_type: 'VIEW' | 'CLICK';
  user_id?: string;
  event_date?: string;
  count?: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location?: string;
  address?: string;
  capacity?: number;
  manager_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface WarehouseInventory {
  id: string;
  warehouse_id: string;
  product_id: string;
  quantity: number;
  min_threshold?: number;
  min_stock?: number;
  max_stock?: number;
  zone_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WarehouseMovement {
  id: string;
  warehouse_id?: string;
  type: 'IN' | 'OUT' | 'TRANSFER';
  movement_type?: string;
  quantity: number;
  item_id?: string;
  product_id?: string;
  from_warehouse_id?: string;
  to_warehouse_id?: string;
  performed_by?: string;
  created_by?: string;
  reference?: string;
  notes?: string;
  created_at: string;
}

export interface PaymentReconciliation {
  id: string;
  order_id: string;
  provider?: string;
  payment_method?: string;
  provider_tx_id?: string;
  order_amount?: number;
  amount: number;
  received_amount?: number;
  status: string;
  reconciled_at?: string;
  notes?: string;
  created_at: string;
}

export interface PremiumPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  features: any;
  badge_text?: string;
  badge_color?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'expired' | 'cancelled' | 'trialing';
  billing_cycle: 'monthly' | 'yearly';
  billing_period?: string;
  started_at?: string;
  expires_at?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancelled_at?: string;
  cancel_at_period_end?: boolean;
  payment_method?: string;
  amount_paid?: number;
  auto_renew?: boolean;
  next_billing_date?: string;
  created_at: string;
  updated_at: string;
}

// Extended profile fields
export interface ExtendedProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  business_name?: string;
  business_type?: string;
  vehicle_type?: string;
  zone?: string;
  status?: string;
  kyc_status?: 'pending' | 'approved' | 'rejected';
  kyc_document_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Extended category with parent
export interface ExtendedCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Extended premium_features
export interface ExtendedPremiumFeature {
  id: string;
  feature_key: string;
  name: string;
  description?: string;
  category: string;
  price_monthly?: number;
  is_enabled?: boolean;
  is_premium?: boolean;
  is_free?: boolean;
  trial_days?: number;
  configuration?: any;
  created_at?: string;
  updated_at?: string;
}

// Helper type for supabase queries on extended tables
export type ExtendedTables = {
  ai_chat_sessions: AiChatSession;
  ads_campaigns: AdsCampaign;
  ads_analytics: AdsAnalytics;
  notifications: Notification;
  warehouses: Warehouse;
  warehouse_inventory: WarehouseInventory;
  warehouse_movements: WarehouseMovement;
  payment_reconciliation: PaymentReconciliation;
  premium_plans: PremiumPlan;
  user_subscriptions: UserSubscription;
};
