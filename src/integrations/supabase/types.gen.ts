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
      _migrations_log: {
        Row: {
          applied_at: string | null
          filename: string
        }
        Insert: {
          applied_at?: string | null
          filename: string
        }
        Update: {
          applied_at?: string | null
          filename?: string
        }
        Relationships: []
      }
      admin_orders_view: {
        Row: {
          client_email: string | null
          client_first_name: string | null
          client_id: string | null
          client_last_name: string | null
          client_phone: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_notes: string | null
          delivery_phone: string | null
          id: string | null
          items_count: number | null
          merchant_business_name: string | null
          merchant_email: string | null
          merchant_first_name: string | null
          merchant_id: string | null
          merchant_last_name: string | null
          payment_method: string | null
          payment_status: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          client_email?: string | null
          client_first_name?: string | null
          client_id?: string | null
          client_last_name?: string | null
          client_phone?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_notes?: string | null
          delivery_phone?: string | null
          id?: string | null
          items_count?: number | null
          merchant_business_name?: string | null
          merchant_email?: string | null
          merchant_first_name?: string | null
          merchant_id?: string | null
          merchant_last_name?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          client_email?: string | null
          client_first_name?: string | null
          client_id?: string | null
          client_last_name?: string | null
          client_phone?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_notes?: string | null
          delivery_phone?: string | null
          id?: string | null
          items_count?: number | null
          merchant_business_name?: string | null
          merchant_email?: string | null
          merchant_first_name?: string | null
          merchant_id?: string | null
          merchant_last_name?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ads_analytics: {
        Row: {
          campaign_id: string | null
          count: number | null
          created_at: string | null
          event_date: string | null
          event_type: string
          id: string
        }
        Insert: {
          campaign_id?: string | null
          count?: number | null
          created_at?: string | null
          event_date?: string | null
          event_type: string
          id?: string
        }
        Update: {
          campaign_id?: string | null
          count?: number | null
          created_at?: string | null
          event_date?: string | null
          event_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ads_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "ads_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      ads_campaigns: {
        Row: {
          budget: number | null
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          merchant_id: string
          product_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          merchant_id: string
          product_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          merchant_id?: string
          product_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_campaigns_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_logs: {
        Row: {
          action_detected: string | null
          commercial_success: boolean | null
          created_at: string
          id: string
          intention: string | null
          message_content: string
          raw_response: Json | null
          session_id: string | null
          tone_consistency: string | null
          tone_used: string | null
          user_id: string | null
        }
        Insert: {
          action_detected?: string | null
          commercial_success?: boolean | null
          created_at?: string
          id?: string
          intention?: string | null
          message_content: string
          raw_response?: Json | null
          session_id?: string | null
          tone_consistency?: string | null
          tone_used?: string | null
          user_id?: string | null
        }
        Update: {
          action_detected?: string | null
          commercial_success?: boolean | null
          created_at?: string
          id?: string
          intention?: string | null
          message_content?: string
          raw_response?: Json | null
          session_id?: string | null
          tone_consistency?: string | null
          tone_used?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          messages: Json | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          messages?: Json | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          messages?: Json | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_feature_profile_settings: {
        Row: {
          created_at: string
          feature_key: string
          id: string
          is_enabled: boolean
          profile_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_key: string
          id?: string
          is_enabled?: boolean
          profile_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_key?: string
          id?: string
          is_enabled?: boolean
          profile_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_module_settings: {
        Row: {
          configuration: Json | null
          created_at: string
          id: string
          is_enabled: boolean
          key: string
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          key: string
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      application_messages: {
        Row: {
          application_id: string | null
          attachment_url: string | null
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          is_system_message: boolean | null
          message_type: string | null
          read_at: string | null
          sender_id: string | null
        }
        Insert: {
          application_id?: string | null
          attachment_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          is_system_message?: boolean | null
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
        }
        Update: {
          application_id?: string | null
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          is_system_message?: boolean | null
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "bnpl_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      bnpl_applications: {
        Row: {
          applicant_id_number: string | null
          applicant_phone: string | null
          application_status: string
          contract_signed_at: string | null
          created_at: string
          fees_amount: number
          first_payment_amount: number
          id: string
          id_card_url: string | null
          merchant_decision: string | null
          merchant_decision_date: string | null
          merchant_id: string
          monthly_payment: number
          order_id: string | null
          photo_url: string | null
          plan_duration: number
          product_id: string
          requested_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          applicant_id_number?: string | null
          applicant_phone?: string | null
          application_status?: string
          contract_signed_at?: string | null
          created_at?: string
          fees_amount?: number
          first_payment_amount: number
          id?: string
          id_card_url?: string | null
          merchant_decision?: string | null
          merchant_decision_date?: string | null
          merchant_id: string
          monthly_payment: number
          order_id?: string | null
          photo_url?: string | null
          plan_duration: number
          product_id: string
          requested_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          applicant_id_number?: string | null
          applicant_phone?: string | null
          application_status?: string
          contract_signed_at?: string | null
          created_at?: string
          fees_amount?: number
          first_payment_amount?: number
          id?: string
          id_card_url?: string | null
          merchant_decision?: string | null
          merchant_decision_date?: string | null
          merchant_id?: string
          monthly_payment?: number
          order_id?: string | null
          photo_url?: string | null
          plan_duration?: number
          product_id?: string
          requested_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bnpl_applications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bnpl_applications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bnpl_plans: {
        Row: {
          application_status: string | null
          created_at: string
          fees_amount: number | null
          first_payment_amount: number | null
          id: string
          installments: Json | null
          merchant_id: string | null
          monthly_payment: number
          next_payment_date: string | null
          order_id: string
          plan_duration: number | null
          product_id: string | null
          remaining_months: number
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          application_status?: string | null
          created_at?: string
          fees_amount?: number | null
          first_payment_amount?: number | null
          id?: string
          installments?: Json | null
          merchant_id?: string | null
          monthly_payment: number
          next_payment_date?: string | null
          order_id: string
          plan_duration?: number | null
          product_id?: string | null
          remaining_months: number
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          application_status?: string | null
          created_at?: string
          fees_amount?: number | null
          first_payment_amount?: number | null
          id?: string
          installments?: Json | null
          merchant_id?: string | null
          monthly_payment?: number
          next_payment_date?: string | null
          order_id?: string
          plan_duration?: number | null
          product_id?: string | null
          remaining_months?: number
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bnpl_plans_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bnpl_plans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_features: {
        Row: {
          bundle_id: string
          feature_id: string
        }
        Insert: {
          bundle_id: string
          feature_id: string
        }
        Update: {
          bundle_id?: string
          feature_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_features_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "premium_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "premium_features"
            referencedColumns: ["id"]
          },
        ]
      }
      cart: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
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
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          delivery_id: string
          driver_id: string | null
          ended_at: string | null
          id: string
          service_id: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_id: string
          driver_id?: string | null
          ended_at?: string | null
          id?: string
          service_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_id?: string
          driver_id?: string | null
          ended_at?: string | null
          id?: string
          service_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          actual_delivery_time: string | null
          client: string | null
          created_at: string
          customer_id: string
          customer_name: string
          customer_phone: string
          date: string | null
          delivery_address: string
          delivery_fee: number
          distance_km: number | null
          driver_id: string | null
          estimated_delivery_time: string | null
          id: string
          merchant_id: string
          notes: string | null
          order_id: string
          pickup_address: string
          ref: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_delivery_time?: string | null
          client?: string | null
          created_at?: string
          customer_id: string
          customer_name: string
          customer_phone: string
          date?: string | null
          delivery_address: string
          delivery_fee?: number
          distance_km?: number | null
          driver_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          merchant_id: string
          notes?: string | null
          order_id: string
          pickup_address: string
          ref?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_delivery_time?: string | null
          client?: string | null
          created_at?: string
          customer_id?: string
          customer_name?: string
          customer_phone?: string
          date?: string | null
          delivery_address?: string
          delivery_fee?: number
          distance_km?: number | null
          driver_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          merchant_id?: string
          notes?: string | null
          order_id?: string
          pickup_address?: string
          ref?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_tracking: {
        Row: {
          created_at: string
          delivery_id: string
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          status_update: string | null
        }
        Insert: {
          created_at?: string
          delivery_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          status_update?: string | null
        }
        Update: {
          created_at?: string
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
          areas: string[]
          base_fee: number
          created_at: string
          id: string
          is_active: boolean
          max_delivery_time_minutes: number
          name: string
          price_per_km: number
          updated_at: string
        }
        Insert: {
          areas: string[]
          base_fee?: number
          created_at?: string
          id?: string
          is_active?: boolean
          max_delivery_time_minutes?: number
          name: string
          price_per_km?: number
          updated_at?: string
        }
        Update: {
          areas?: string[]
          base_fee?: number
          created_at?: string
          id?: string
          is_active?: boolean
          max_delivery_time_minutes?: number
          name?: string
          price_per_km?: number
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
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
      feature_usage_quotas: {
        Row: {
          created_at: string | null
          id: string
          quota_limit: number
          quota_type: string
          quota_used: number | null
          reset_at: string | null
          reset_period: string | null
          subscription_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          quota_limit: number
          quota_type: string
          quota_used?: number | null
          reset_at?: string | null
          reset_period?: string | null
          subscription_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          quota_limit?: number
          quota_type?: string
          quota_used?: number | null
          reset_at?: string | null
          reset_period?: string | null
          subscription_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_usage_quotas_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_premium_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity?: number
        }
        Update: {
          created_at?: string
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
          created_at: string
          delivery_address: string | null
          delivery_notes: string | null
          delivery_phone: string | null
          id: string
          merchant_id: string
          payment_method: string | null
          payment_status: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          delivery_address?: string | null
          delivery_notes?: string | null
          delivery_phone?: string | null
          id?: string
          merchant_id: string
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          delivery_address?: string | null
          delivery_notes?: string | null
          delivery_phone?: string | null
          id?: string
          merchant_id?: string
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      payment_reconciliation: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          order_id: string | null
          payment_method: string | null
          reconciled_at: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_method?: string | null
          reconciled_at?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_method?: string | null
          reconciled_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_reconciliation_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      premium_bundles: {
        Row: {
          badge_text: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number
          price_yearly: number | null
          trial_days: number | null
          updated_at: string | null
        }
        Insert: {
          badge_text?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Update: {
          badge_text?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      premium_features: {
        Row: {
          activated_at: string | null
          category: string
          configuration: Json | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          feature_key: string
          id: string
          is_enabled: boolean | null
          is_free: boolean | null
          is_premium: boolean | null
          name: string
          price_monthly: number | null
          status: string | null
          trial_days: number | null
          updated_at: string | null
        }
        Insert: {
          activated_at?: string | null
          category: string
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          feature_key: string
          id?: string
          is_enabled?: boolean | null
          is_free?: boolean | null
          is_premium?: boolean | null
          name: string
          price_monthly?: number | null
          status?: string | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Update: {
          activated_at?: string | null
          category?: string
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          feature_key?: string
          id?: string
          is_enabled?: boolean | null
          is_free?: boolean | null
          is_premium?: boolean | null
          name?: string
          price_monthly?: number | null
          status?: string | null
          trial_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      premium_plans: {
        Row: {
          badge_color: string | null
          badge_text: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
          slug: string
          target_roles: string[] | null
          updated_at: string | null
        }
        Insert: {
          badge_color?: string | null
          badge_text?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          slug: string
          target_roles?: string[] | null
          updated_at?: string | null
        }
        Update: {
          badge_color?: string | null
          badge_text?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          slug?: string
          target_roles?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          ai_description: boolean | null
          ai_pricing_strategy: string | null
          barcode: string | null
          bnpl_enabled: boolean | null
          brand: string | null
          category: string | null
          category_id: string | null
          compare_at_price: number | null
          condition: string | null
          cost_price: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          dimensions: string | null
          download_url: string | null
          features: string[] | null
          gallery: string[] | null
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean | null
          is_digital: boolean | null
          merchant_id: string
          min_order_quantity: number | null
          min_stock: number | null
          name: string
          price: number
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          sku: string | null
          slug: string | null
          specs: Json | null
          status: string
          stock: number
          tags: string[] | null
          unit: string | null
          updated_at: string | null
          video_url: string | null
          weight: number | null
          wholesale_price: number | null
        }
        Insert: {
          ai_description?: boolean | null
          ai_pricing_strategy?: string | null
          barcode?: string | null
          bnpl_enabled?: boolean | null
          brand?: string | null
          category?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          condition?: string | null
          cost_price?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          dimensions?: string | null
          download_url?: string | null
          features?: string[] | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_digital?: boolean | null
          merchant_id: string
          min_order_quantity?: number | null
          min_stock?: number | null
          name: string
          price: number
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          sku?: string | null
          slug?: string | null
          specs?: Json | null
          status?: string
          stock?: number
          tags?: string[] | null
          unit?: string | null
          updated_at?: string | null
          video_url?: string | null
          weight?: number | null
          wholesale_price?: number | null
        }
        Update: {
          ai_description?: boolean | null
          ai_pricing_strategy?: string | null
          barcode?: string | null
          bnpl_enabled?: boolean | null
          brand?: string | null
          category?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          condition?: string | null
          cost_price?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          dimensions?: string | null
          download_url?: string | null
          features?: string[] | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_digital?: boolean | null
          merchant_id?: string
          min_order_quantity?: number | null
          min_stock?: number | null
          name?: string
          price?: number
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          sku?: string | null
          slug?: string | null
          specs?: Json | null
          status?: string
          stock?: number
          tags?: string[] | null
          unit?: string | null
          updated_at?: string | null
          video_url?: string | null
          weight?: number | null
          wholesale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          birth_date: string | null
          business_address: string | null
          business_city: string | null
          business_name: string | null
          business_postal_code: string | null
          business_tax_id: string | null
          business_type: string | null
          city: string | null
          created_at: string | null
          credit_limit: number | null
          current_debt: number | null
          email: string | null
          first_name: string | null
          id: string
          kyc_contract_signed_at: string | null
          kyc_document_url: string | null
          kyc_id_card_url: string | null
          kyc_selfie_url: string | null
          kyc_status: string | null
          last_name: string | null
          permissions: Json | null
          phone: string | null
          postal_code: string | null
          role: string | null
          status: string | null
          updated_at: string | null
          vehicle_type: string | null
          zone: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          business_address?: string | null
          business_city?: string | null
          business_name?: string | null
          business_postal_code?: string | null
          business_tax_id?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string | null
          credit_limit?: number | null
          current_debt?: number | null
          email?: string | null
          first_name?: string | null
          id: string
          kyc_contract_signed_at?: string | null
          kyc_document_url?: string | null
          kyc_id_card_url?: string | null
          kyc_selfie_url?: string | null
          kyc_status?: string | null
          last_name?: string | null
          permissions?: Json | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
          zone?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          business_address?: string | null
          business_city?: string | null
          business_name?: string | null
          business_postal_code?: string | null
          business_tax_id?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string | null
          credit_limit?: number | null
          current_debt?: number | null
          email?: string | null
          first_name?: string | null
          id?: string
          kyc_contract_signed_at?: string | null
          kyc_document_url?: string | null
          kyc_id_card_url?: string | null
          kyc_selfie_url?: string | null
          kyc_status?: string | null
          last_name?: string | null
          permissions?: Json | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
          reward_type: string | null
          reward_value: number | null
          rewarded_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
          reward_type?: string | null
          reward_value?: number | null
          rewarded_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
          reward_type?: string | null
          reward_value?: number | null
          rewarded_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string
          rating: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id: string
          rating: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string | null
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
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_audit_log: {
        Row: {
          action: string
          amount: number | null
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          new_plan_id: string | null
          old_plan_id: string | null
          payment_method: string | null
          subscription_id: string | null
          transaction_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          amount?: number | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_plan_id?: string | null
          old_plan_id?: string | null
          payment_method?: string | null
          subscription_id?: string | null
          transaction_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          amount?: number | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_plan_id?: string | null
          old_plan_id?: string | null
          payment_method?: string | null
          subscription_id?: string | null
          transaction_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_audit_log_new_plan_id_fkey"
            columns: ["new_plan_id"]
            isOneToOne: false
            referencedRelation: "premium_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_audit_log_old_plan_id_fkey"
            columns: ["old_plan_id"]
            isOneToOne: false
            referencedRelation: "premium_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_audit_log_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ai_settings: {
        Row: {
          created_at: string
          feature_key: string
          id: string
          is_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_key: string
          id?: string
          is_enabled: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_key?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ai_feature_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_premium_subscriptions: {
        Row: {
          activated_at: string | null
          amount_paid: number | null
          auto_renew: boolean | null
          billing_period: string | null
          cancelled_at: string | null
          created_at: string | null
          expires_at: string | null
          feature_id: string
          id: string
          is_trial: boolean | null
          metadata: Json | null
          next_billing_date: string | null
          payment_method: string | null
          payment_status: string | null
          status: string
          subscribed_at: string | null
          transaction_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          amount_paid?: number | null
          auto_renew?: boolean | null
          billing_period?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          feature_id: string
          id?: string
          is_trial?: boolean | null
          metadata?: Json | null
          next_billing_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          subscribed_at?: string | null
          transaction_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string | null
          amount_paid?: number | null
          auto_renew?: boolean | null
          billing_period?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          feature_id?: string
          id?: string
          is_trial?: boolean | null
          metadata?: Json | null
          next_billing_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          subscribed_at?: string | null
          transaction_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_premium_subscriptions_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "premium_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_premium_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          amount_paid: number | null
          auto_renew: boolean | null
          billing_period: string
          cancelled_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          next_billing_date: string | null
          payment_method: string | null
          plan_id: string
          started_at: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          auto_renew?: boolean | null
          billing_period?: string
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          next_billing_date?: string | null
          payment_method?: string | null
          plan_id: string
          started_at?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          auto_renew?: boolean | null
          billing_period?: string
          cancelled_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          next_billing_date?: string | null
          payment_method?: string | null
          plan_id?: string
          started_at?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "premium_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_inventory: {
        Row: {
          created_at: string | null
          id: string
          max_stock: number | null
          min_stock: number | null
          product_id: string | null
          quantity: number | null
          updated_at: string | null
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_stock?: number | null
          min_stock?: number | null
          product_id?: string | null
          quantity?: number | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_stock?: number | null
          min_stock?: number | null
          product_id?: string | null
          quantity?: number | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_movements: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          movement_type: string
          notes: string | null
          product_id: string | null
          quantity: number
          reference: string | null
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type: string
          notes?: string | null
          product_id?: string | null
          quantity: number
          reference?: string | null
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type?: string
          notes?: string | null
          product_id?: string | null
          quantity?: number
          reference?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_movements_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_credits: {
        Args: {
          p_amount: number
          p_description: string
          p_reference_id?: string
          p_type: string
          p_user_id: string
        }
        Returns: boolean
      }
      check_email_exists: { Args: { email_to_check: string }; Returns: boolean }
      deduct_user_credits: {
        Args: {
          p_amount: number
          p_description: string
          p_reference_id?: string
          p_user_id: string
        }
        Returns: boolean
      }
      exec_sql: { Args: { sql_query: string }; Returns: undefined }
      get_id_by_email: { Args: { p_email: string }; Returns: string }
      get_latest_delivery_locations: {
        Args: { p_delivery_ids: string[] }
        Returns: {
          created_at: string
          delivery_id: string
          latitude: number
          longitude: number
        }[]
      }
      get_user_credit_balance: { Args: { p_user_id: string }; Returns: number }
      is_admin: { Args: never; Returns: boolean }
      log_subscription_action: {
        Args: {
          p_action: string
          p_amount?: number
          p_metadata?: Json
          p_new_plan_id?: string
          p_old_plan_id?: string
          p_payment_method?: string
          p_subscription_id: string
          p_user_id: string
        }
        Returns: string
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      user_has_feature_access: {
        Args: { p_feature_key: string; p_user_id: string }
        Returns: boolean
      }
      user_has_premium_access: {
        Args: { p_feature_key: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
