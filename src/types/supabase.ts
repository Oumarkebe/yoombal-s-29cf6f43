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
      bnpl_applications: {
        Row: {
          application_status: string
          created_at: string
          fees_amount: number
          first_payment_amount: number
          id: string
          merchant_decision: string | null
          merchant_decision_date: string | null
          merchant_id: string
          monthly_payment: number
          plan_duration: number
          product_id: string
          requested_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          application_status?: string
          created_at?: string
          fees_amount?: number
          first_payment_amount: number
          id?: string
          merchant_decision?: string | null
          merchant_decision_date?: string | null
          merchant_id: string
          monthly_payment: number
          plan_duration: number
          product_id: string
          requested_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          application_status?: string
          created_at?: string
          fees_amount?: number
          first_payment_amount?: number
          id?: string
          merchant_decision?: string | null
          merchant_decision_date?: string | null
          merchant_id?: string
          monthly_payment?: number
          plan_duration?: number
          product_id?: string
          requested_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
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
          monthly_payment: number
          next_payment_date: string | null
          order_id: string
          plan_duration: number | null
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
          monthly_payment: number
          next_payment_date?: string | null
          order_id: string
          plan_duration?: number | null
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
          monthly_payment?: number
          next_payment_date?: string | null
          order_id?: string
          plan_duration?: number | null
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
        }
        Insert: {
          category: string
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
          bnpl_enabled: boolean | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          merchant_id: string
          name: string
          price: number
          status: string
          stock: number
          updated_at: string | null
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
          price: number
          status?: string
          stock?: number
          updated_at?: string | null
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
          status?: string
          stock?: number
          updated_at?: string | null
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
          address: string | null
          birth_date: string | null
          business_address: string | null
          business_city: string | null
          business_name: string | null
          business_postal_code: string | null
          business_tax_id: string | null
          business_type: string | null
          city: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          permissions: Json | null
          phone: string | null
          postal_code: string | null
          role: string | null
          updated_at: string | null
          vehicle_type: string | null
          zone: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          business_address?: string | null
          business_city?: string | null
          business_name?: string | null
          business_postal_code?: string | null
          business_tax_id?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          permissions?: Json | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
          zone?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          business_address?: string | null
          business_city?: string | null
          business_name?: string | null
          business_postal_code?: string | null
          business_tax_id?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          permissions?: Json | null
          phone?: string | null
          postal_code?: string | null
          role?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
          zone?: string | null
        }
        Relationships: []
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
      user_ai_feature_settings: {
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_latest_delivery_locations: {
        Args: { p_delivery_ids: string[] }
        Returns: {
          created_at: string
          delivery_id: string
          latitude: number
          longitude: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
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
