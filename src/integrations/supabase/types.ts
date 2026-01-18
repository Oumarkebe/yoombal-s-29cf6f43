export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            ai_module_settings: {
                Row: {
                    configuration: Json | null
                    created_at: string | null
                    id: string
                    is_enabled: boolean | null
                    key: string
                    updated_at: string | null
                }
                Insert: {
                    configuration?: Json | null
                    created_at?: string | null
                    id?: string
                    is_enabled?: boolean | null
                    key: string
                    updated_at?: string | null
                }
                Update: {
                    configuration?: Json | null
                    created_at?: string | null
                    id?: string
                    is_enabled?: boolean | null
                    key?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            bnpl_plans: {
                Row: {
                    created_at: string | null
                    duration_months: number
                    id: string
                    monthly_payment: number
                    next_payment_date: string
                    product_id: string
                    remaining_months: number
                    status: string | null
                    total_amount: number
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    duration_months: number
                    id?: string
                    monthly_payment: number
                    next_payment_date: string
                    product_id: string
                    remaining_months: number
                    status?: string | null
                    total_amount: number
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    duration_months?: number
                    id?: string
                    monthly_payment?: number
                    next_payment_date?: string
                    product_id?: string
                    remaining_months?: number
                    status?: string | null
                    total_amount?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "bnpl_plans_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            categories: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    name: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            deliveries: {
                Row: {
                    actual_delivery_time: string | null
                    created_at: string | null
                    customer_id: string
                    customer_name: string
                    customer_phone: string
                    date: string | null
                    delivery_address: string
                    delivery_fee: number | null
                    distance_km: number | null
                    driver_id: string | null
                    estimated_delivery_time: string | null
                    id: string
                    merchant_id: string
                    notes: string | null
                    order_id: string
                    pickup_address: string
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    actual_delivery_time?: string | null
                    created_at?: string | null
                    customer_id: string
                    customer_name: string
                    customer_phone: string
                    date?: string | null
                    delivery_address: string
                    delivery_fee?: number | null
                    distance_km?: number | null
                    driver_id?: string | null
                    estimated_delivery_time?: string | null
                    id?: string
                    merchant_id: string
                    notes?: string | null
                    order_id: string
                    pickup_address: string
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    actual_delivery_time?: string | null
                    created_at?: string | null
                    customer_id?: string
                    customer_name?: string
                    customer_phone?: string
                    date?: string | null
                    delivery_address?: string
                    delivery_fee?: number | null
                    distance_km?: number | null
                    driver_id?: string | null
                    estimated_delivery_time?: string | null
                    id?: string
                    merchant_id?: string
                    notes?: string | null
                    order_id?: string
                    pickup_address?: string
                    status?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "deliveries_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            delivery_tracking: {
                Row: {
                    created_at: string | null
                    delivery_id: string
                    id: string
                    latitude: number | null
                    longitude: number | null
                    notes: string | null
                    status_update: string | null
                }
                Insert: {
                    created_at?: string | null
                    delivery_id: string
                    id?: string
                    latitude?: number | null
                    longitude?: number | null
                    notes?: string | null
                    status_update?: string | null
                }
                Update: {
                    created_at?: string | null
                    delivery_id?: string
                    id?: string
                    latitude?: number | null
                    longitude?: number | null
                    notes?: string | null
                    status_update?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "delivery_tracking_delivery_id_fkey"
                        columns: ["delivery_id"]
                        isOneToOne: false
                        referencedRelation: "deliveries"
                        referencedColumns: ["id"]
                    },
                ]
            }
            delivery_zones: {
                Row: {
                    areas: string[] | null
                    base_fee: number | null
                    created_at: string | null
                    id: string
                    is_active: boolean | null
                    max_delivery_time_minutes: number | null
                    name: string
                    price_per_km: number | null
                    updated_at: string | null
                }
                Insert: {
                    areas?: string[] | null
                    base_fee?: number | null
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    max_delivery_time_minutes?: number | null
                    name: string
                    price_per_km?: number | null
                    updated_at?: string | null
                }
                Update: {
                    areas?: string[] | null
                    base_fee?: number | null
                    created_at?: string | null
                    id?: string
                    is_active?: boolean | null
                    max_delivery_time_minutes?: number | null
                    name?: string
                    price_per_km?: number | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            favorites: {
                Row: {
                    created_at: string | null
                    id: string
                    product_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    product_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    product_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "favorites_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            order_items: {
                Row: {
                    created_at: string | null
                    id: string
                    order_id: string
                    price: number
                    product_id: string
                    quantity: number
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    order_id: string
                    price?: number
                    product_id: string
                    quantity?: number
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    order_id?: string
                    price?: number
                    product_id?: string
                    quantity?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            orders: {
                Row: {
                    client_id: string
                    created_at: string | null
                    delivery_address: string | null
                    delivery_notes: string | null
                    id: string
                    merchant_id: string
                    status: string | null
                    total_amount: number
                    updated_at: string | null
                }
                Insert: {
                    client_id: string
                    created_at?: string | null
                    delivery_address?: string | null
                    delivery_notes?: string | null
                    id?: string
                    merchant_id: string
                    status?: string | null
                    total_amount?: number
                    updated_at?: string | null
                }
                Update: {
                    client_id?: string
                    created_at?: string | null
                    delivery_address?: string | null
                    delivery_notes?: string | null
                    id?: string
                    merchant_id?: string
                    status?: string | null
                    total_amount?: number
                    updated_at?: string | null
                }
                Relationships: []
            }
            premium_features: {
                Row: {
                    category: string
                    configuration: Json | null
                    created_at: string | null
                    description: string | null
                    feature_key: string
                    id: string
                    is_enabled: boolean | null
                    is_premium: boolean | null
                    name: string
                    price_monthly: number | null
                    updated_at: string | null
                    is_free: boolean | null
                    trial_days: number | null
                }
                Insert: {
                    category?: string
                    configuration?: Json | null
                    created_at?: string | null
                    description?: string | null
                    feature_key: string
                    id?: string
                    is_enabled?: boolean | null
                    is_premium?: boolean | null
                    name: string
                    price_monthly?: number | null
                    updated_at?: string | null
                    is_free?: boolean | null
                    trial_days?: number | null
                }
                Update: {
                    category?: string
                    configuration?: Json | null
                    created_at?: string | null
                    description?: string | null
                    feature_key?: string
                    id?: string
                    is_enabled?: boolean | null
                    is_premium?: boolean | null
                    name?: string
                    price_monthly?: number | null
                    updated_at?: string | null
                    is_free?: boolean | null
                    trial_days?: number | null
                }
                Relationships: []
            }
            products: {
                Row: {
                    bnpl_enabled: boolean | null
                    category_id: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    image_url: string | null
                    merchant_id: string
                    name: string
                    price: number
                    status: string | null
                    stock: number
                    updated_at: string | null
                    is_sponsored: boolean | null
                    is_active: boolean | null
                    tags: string[] | null
                    specs: Json | null
                    is_digital: boolean | null
                    ad_priority: number | null
                }
                Insert: {
                    bnpl_enabled?: boolean | null
                    category_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    merchant_id: string
                    name: string
                    price?: number
                    status?: string | null
                    stock?: number
                    updated_at?: string | null
                    is_sponsored?: boolean | null
                    is_active?: boolean | null
                    tags?: string[] | null
                    specs?: Json | null
                    is_digital?: boolean | null
                    ad_priority?: number | null
                }
                Update: {
                    bnpl_enabled?: boolean | null
                    category_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    merchant_id?: string
                    name?: string
                    price?: number
                    status?: string | null
                    stock?: number
                    updated_at?: string | null
                    is_sponsored?: boolean | null
                    is_active?: boolean | null
                    tags?: string[] | null
                    specs?: Json | null
                    is_digital?: boolean | null
                    ad_priority?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    business_name: string | null
                    business_type: string | null
                    created_at: string | null
                    first_name: string | null
                    id: string
                    last_name: string | null
                    phone: string | null
                    status: string | null
                    updated_at: string | null
                    vehicle_type: string | null
                    zone: string | null
                    role: string | null
                    merchant_name: string | null
                    delivery_name: string | null
                    client_name: string | null
                    kyc_status: string | null
                    kyc_type: string | null
                    kyc_document_url: string | null
                    kyc_rejection_reason: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    business_name?: string | null
                    business_type?: string | null
                    created_at?: string | null
                    first_name?: string | null
                    id: string
                    last_name?: string | null
                    phone?: string | null
                    status?: string | null
                    updated_at?: string | null
                    vehicle_type?: string | null
                    zone?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    business_name?: string | null
                    business_type?: string | null
                    created_at?: string | null
                    first_name?: string | null
                    id?: string
                    last_name?: string | null
                    phone?: string | null
                    status?: string | null
                    updated_at?: string | null
                    vehicle_type?: string | null
                    zone?: string | null
                }
                Relationships: []
            }
            reviews: {
                Row: {
                    comment: string | null
                    created_at: string | null
                    id: string
                    product_id: string
                    rating: number
                    user_id: string
                }
                Insert: {
                    comment?: string | null
                    created_at?: string | null
                    id?: string
                    product_id: string
                    rating: number
                    user_id: string
                }
                Update: {
                    comment?: string | null
                    created_at?: string | null
                    id?: string
                    product_id?: string
                    rating?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reviews_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_ai_settings: {
                Row: {
                    created_at: string | null
                    feature_key: string
                    id: string
                    is_enabled: boolean | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    feature_key: string
                    id?: string
                    is_enabled?: boolean | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    feature_key?: string
                    id?: string
                    is_enabled?: boolean | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: []
            }
            user_roles: {
                Row: {
                    created_at: string | null
                    id: string
                    role: Database["public"]["Enums"]["app_role"]
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    role: Database["public"]["Enums"]["app_role"]
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    role?: Database["public"]["Enums"]["app_role"]
                    user_id?: string
                }
                Relationships: []
            }
        }
        premium_plans: {
            Row: {
                id: string
                name: string
                slug: string | null
                description: string | null
                price_monthly: number | null
                price_yearly: number | null
                features: string[] | null
                is_active: boolean | null
                display_order: number | null
                badge: string | null
                created_at: string | null
            }
            Insert: {
                id?: string
                name: string
                slug?: string | null
                description?: string | null
                price_monthly?: number | null
                price_yearly?: number | null
                features?: string[] | null
                is_active?: boolean | null
                display_order?: number | null
                badge?: string | null
                created_at?: string | null
            }
            Update: {
                id?: string
                name?: string
                slug?: string | null
                description?: string | null
                price_monthly?: number | null
                price_yearly?: number | null
                features?: string[] | null
                is_active?: boolean | null
                display_order?: number | null
                badge?: string | null
                created_at?: string | null
            }
            Relationships: []
        }
        user_subscriptions: {
            Row: {
                id: string
                user_id: string
                plan_id: string | null
                status: string | null
                billing_period: string | null
                started_at: string | null
                expires_at: string | null
                cancelled_at: string | null
                payment_method: string | null
                amount_paid: number | null
                auto_renew: boolean | null
                next_billing_date: string | null
                current_period_start: string | null
                current_period_end: string | null
                created_at: string | null
                updated_at: string | null
            }
            Insert: {
                id?: string
                user_id: string
                plan_id?: string | null
                status?: string | null
                billing_period?: string | null
                started_at?: string | null
                expires_at?: string | null
                cancelled_at?: string | null
                payment_method?: string | null
                amount_paid?: number | null
                auto_renew?: boolean | null
                next_billing_date?: string | null
                current_period_start?: string | null
                current_period_end?: string | null
                created_at?: string | null
                updated_at?: string | null
            }
            Update: {
                id?: string
                user_id?: string
                plan_id?: string | null
                status?: string | null
                billing_period?: string | null
                started_at?: string | null
                expires_at?: string | null
                cancelled_at?: string | null
                payment_method?: string | null
                amount_paid?: number | null
                auto_renew?: boolean | null
                next_billing_date?: string | null
                current_period_start?: string | null
                current_period_end?: string | null
                created_at?: string | null
                updated_at?: string | null
            }
            Relationships: [
                {
                    foreignKeyName: "user_subscriptions_plan_id_fkey"
                    columns: ["plan_id"]
                    isOneToOne: false
                    referencedRelation: "premium_plans"
                    referencedColumns: ["id"]
                }
            ]
        }
        user_premium_subscriptions: {
            Row: {
                id: string
                user_id: string
                feature_id: string
                status: string
                started_at: string
                expires_at: string | null
                created_at: string
            }
            Insert: {
                id?: string
                user_id: string
                feature_id: string
                status: string
                started_at: string
                expires_at?: string | null
                created_at?: string
            }
            Update: {
                id?: string
                user_id?: string
                feature_id?: string
                status?: string
                started_at?: string
                expires_at?: string | null
                created_at?: string
            }
            Relationships: [
                {
                    foreignKeyName: "user_premium_subscriptions_feature_id_fkey"
                    columns: ["feature_id"]
                    isOneToOne: false
                    referencedRelation: "premium_features"
                    referencedColumns: ["id"]
                }
            ]
        }
        ai_chat_sessions: {
            Row: {
                id: string
                user_id: string
                messages: Json
                created_at: string
                updated_at: string
            }
            Insert: {
                id?: string
                user_id: string
                messages: Json
                created_at?: string
                updated_at?: string
            }
            Update: {
                id?: string
                user_id?: string
                messages?: Json
                created_at?: string
                updated_at?: string
            }
            Relationships: []
        }
        ai_chat_logs: {
            Row: {
                id: string
                user_id: string | null
                message_content: string
                intention: string | null
                action_detected: string | null
                commercial_success: boolean | null
                raw_response: Json | null
                created_at: string
            }
            Insert: {
                id?: string
                user_id?: string | null
                message_content: string
                intention?: string | null
                action_detected?: string | null
                commercial_success?: boolean | null
                raw_response?: Json | null
                created_at?: string
            }
            Update: {
                id?: string
                user_id?: string | null
                message_content?: string
                intention?: string | null
                action_detected?: string | null
                commercial_success?: boolean | null
                raw_response?: Json | null
                created_at?: string
            }
            Relationships: []
        }
        ads_campaigns: {
            Row: {
                id: string
                merchant_id: string
                product_id: string | null
                name: string
                daily_budget: number
                current_spend: number
                status: string
                start_date: string | null
                end_date: string | null
                created_at: string
            }
            Insert: {
                id?: string
                merchant_id: string
                product_id?: string | null
                name: string
                daily_budget?: number
                current_spend?: number
                status?: string
                start_date?: string | null
                end_date?: string | null
                created_at?: string
            }
            Update: {
                id?: string
                merchant_id?: string
                product_id?: string | null
                name?: string
                daily_budget?: number
                current_spend?: number
                status?: string
                start_date?: string | null
                end_date?: string | null
                created_at?: string
            }
            Relationships: []
        }
        ads_analytics: {
            Row: {
                id: string
                campaign_id: string
                event_type: string | null
                user_id: string | null
                impressions: number | null
                clicks: number | null
                conversions: number | null
                date: string | null
                created_at: string
            }
            Insert: {
                id?: string
                campaign_id: string
                event_type?: string | null
                user_id?: string | null
                impressions?: number | null
                clicks?: number | null
                conversions?: number | null
                date?: string | null
                created_at?: string
            }
            Update: {
                id?: string
                campaign_id?: string
                event_type?: string | null
                user_id?: string | null
                impressions?: number | null
                clicks?: number | null
                conversions?: number | null
                date?: string | null
                created_at?: string
            }
            Relationships: [
                {
                    foreignKeyName: "ads_analytics_campaign_id_fkey"
                    columns: ["campaign_id"]
                    isOneToOne: false
                    referencedRelation: "ads_campaigns"
                    referencedColumns: ["id"]
                }
            ]
        }
        warehouses: {
            Row: {
                id: string
                name: string
                location: string | null
                capacity: number | null
                manager_id: string | null
                is_active: boolean | null
                created_at: string
            }
            Insert: {
                id?: string
                name: string
                location?: string | null
                capacity?: number | null
                manager_id?: string | null
                is_active?: boolean | null
                created_at?: string
            }
            Update: {
                id?: string
                name?: string
                location?: string | null
                capacity?: number | null
                manager_id?: string | null
                is_active?: boolean | null
                created_at?: string
            }
            Relationships: []
        }
        warehouse_inventory: {
            Row: {
                id: string
                warehouse_id: string
                product_id: string
                quantity: number
                min_threshold: number
                zone_id: string | null
                created_at: string
                updated_at: string
            }
            Insert: {
                id?: string
                warehouse_id: string
                product_id: string
                quantity?: number
                min_threshold?: number
                zone_id?: string | null
                created_at?: string
                updated_at?: string
            }
            Update: {
                id?: string
                warehouse_id?: string
                product_id?: string
                quantity?: number
                min_threshold?: number
                zone_id?: string | null
                created_at?: string
                updated_at?: string
            }
            Relationships: [
                {
                    foreignKeyName: "warehouse_inventory_warehouse_id_fkey"
                    columns: ["warehouse_id"]
                    isOneToOne: false
                    referencedRelation: "warehouses"
                    referencedColumns: ["id"]
                },
                {
                    foreignKeyName: "warehouse_inventory_product_id_fkey"
                    columns: ["product_id"]
                    isOneToOne: false
                    referencedRelation: "products"
                    referencedColumns: ["id"]
                }
            ]
        }
        warehouse_movements: {
            Row: {
                id: string
                type: string
                quantity: number
                item_id: string
                from_warehouse_id: string | null
                to_warehouse_id: string | null
                performed_by: string | null
                notes: string | null
                created_at: string
            }
            Insert: {
                id?: string
                type: string
                quantity: number
                item_id: string
                from_warehouse_id?: string | null
                to_warehouse_id?: string | null
                performed_by?: string | null
                notes?: string | null
                created_at?: string
            }
            Update: {
                id?: string
                type?: string
                quantity?: number
                item_id?: string
                from_warehouse_id?: string | null
                to_warehouse_id?: string | null
                performed_by?: string | null
                notes?: string | null
                created_at?: string
            }
            Relationships: [
                {
                    foreignKeyName: "warehouse_movements_item_id_fkey"
                    columns: ["item_id"]
                    isOneToOne: false
                    referencedRelation: "products"
                    referencedColumns: ["id"]
                }
            ]
        }
        notifications: {
            Row: {
                id: string
                user_id: string
                type: string | null
                title: string
                message: string
                data: Json | null
                is_read: boolean
                created_at: string
            }
            Insert: {
                id?: string
                user_id: string
                type?: string | null
                title: string
                message: string
                data?: Json | null
                is_read?: boolean
                created_at?: string
            }
            Update: {
                id?: string
                user_id?: string
                type?: string | null
                title?: string
                message?: string
                data?: Json | null
                is_read?: boolean
                created_at?: string
            }
            Relationships: []
        }
    }
    Views: {
        [_ in never]: never
    }
    Functions: {
        has_role: {
            Args: {
                _role: Database["public"]["Enums"]["app_role"]
                _user_id: string
            }
            Returns: boolean
        }
    }
    Enums: {
        app_role: "admin" | "moderator" | "user" | "merchant" | "driver"
    }
    CompositeTypes: {
        [_ in never]: never
    }
}
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {
            app_role: ["admin", "moderator", "user", "merchant", "driver"],
        },
    },
} as const
