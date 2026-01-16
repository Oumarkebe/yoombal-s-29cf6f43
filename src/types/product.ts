import { z } from 'zod';

export interface ProductDimensions {
    length: number;
    width: number;
    height: number;
}

export type PricingStrategy = 'aggressive' | 'balanced' | 'premium';
export type ProductUnit = 'pièce' | 'kg' | 'g' | 'L' | 'ml' | 'm' | 'm²' | 'lot' | string;

export interface Product {
    // Base
    id: string;
    name: string;
    description: string | null;
    category_id?: string | null;

    // Identification & Logistique
    sku: string | null;
    barcode?: string | null;
    min_stock: number;
    weight?: number | null;
    dimensions?: ProductDimensions | null;

    // Pricing
    unit: ProductUnit;
    cost_price: number;
    price: number;
    compare_at_price?: number | null;
    currency: string;

    // Stock
    stock: number;
    stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
    status?: 'active' | 'draft' | 'out_of_stock'; // Aligned with DB enum

    // Caractéristiques
    specs: Record<string, any>;
    tags: string[];

    // Media
    image_url?: string | null;
    gallery: string[];
    video_url?: string | null;

    // SEO & IA
    ai_description: boolean;
    ai_pricing_strategy?: PricingStrategy | null;
    seo_title?: string | null;
    seo_description?: string | null;
    slug: string | null;

    // Digital & B2B
    is_digital: boolean;
    download_url?: string | null;
    wholesale_price?: number | null;
    min_order_quantity: number;

    // Timestamps
    published_at: string | null;
    created_at?: string;
    updated_at?: string;

    // Relations
    category?: {
        id: string;
        name: string;
    } | null;
}

// Types pour le formulaire
// On exclut les champs gérés par Supabase ou non pertinents pour l'input direct
export interface ProductFormData extends Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category' | 'stock_status'> {
    // category_id est déjà dans Product (optionnel), mais ici on veut forcer string pour le formulaire parfois
    new_tags?: string[];
    gallery_files?: File[];
}

export const productSchema = z.object({
    name: z.string().min(3, 'Nom trop court').max(200, 'Nom trop long'),
    sku: z.string().min(3, 'SKU trop court').max(50, 'SKU trop long').optional().or(z.literal('')),
    price: z.number().positive('Le prix doit être positif'),
    cost_price: z.number().min(0, 'Prix de revient invalide').optional(),
    stock: z.number().int().min(0, 'Stock invalide'),
    min_stock: z.number().int().min(0, 'Seuil minimum invalide').optional(),
    unit: z.string().default('pièce'),
    currency: z.string().length(3, 'Code devise invalide').default('XOF'),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide').optional().or(z.literal('')),
    published_at: z.string().datetime().optional().nullable(),
    min_order_quantity: z.number().int().min(1, 'Minimum 1').default(1),
});
