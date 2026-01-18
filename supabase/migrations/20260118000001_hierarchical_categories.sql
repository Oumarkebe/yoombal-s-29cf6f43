
-- Migration: Hierarchical Categories (Univers -> Sub-categories)
-- Date: 2026-01-18

-- 1. Add parent_id for hierarchy
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='parent_id') THEN
        ALTER TABLE public.categories ADD COLUMN parent_id uuid REFERENCES public.categories(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2. Clear existing (to ensure clean slate with unique names)
-- TRUNCATE public.categories CASCADE;

-- 3. Seed Univers (Parents)
INSERT INTO public.categories (name, description)
VALUES 
    ('Courses & Quotidien', 'Tout pour manger, boire et se fournir au quotidien (Alimentation, Gaz, Eau, Boulangerie).'),
    ('Mode & Style', 'S''habiller, se valoriser et prendre soin de son apparence (Vêtements, Chaussures, Beauté).'),
    ('Maison & Espace', 'S''installer, aménager son intérieur et sécuriser son foyer (Mobilier, Électroménager, Énergie).'),
    ('High-Tech & Digital', 'Communiquer, travailler et créer avec les meilleures technologies (Smartphones, Informatique, Internet).'),
    ('BTP & Infrastructures', 'Matériel pro pour bâtir, énergiser et connecter (Construction, Solaire, Sécurité industrielle).'),
    ('Services & Artisans', 'Réparer, entretenir, nettoyer et assister par des professionnels qualifiés (Plomberie, Électricité).'),
    ('Auto & Mobilité', 'Circuler, livrer et voyager en toute liberté (Moto, Pièces détachées, Livraison, Location).'),
    ('Santé & Vitalité', 'Se soigner, se protéger et maintenir son bien-être (Pharmacie, Matériel médical, Assistance).'),
    ('Éducation & Business', 'Apprendre, entreprendre et investir dans son futur (Fournitures, Formations, Services administratifs).'),
    ('Loisirs & Évasion', 'Célébrer, se divertir et profiter de la vie sociale (Événementiel, Musique, Sport, Traiteur).'),
    ('Agri & Environnement', 'Cultiver, élever et transformer localement pour un futur durable (Agriculture, Transformation).'),
    ('Yoombal Finance', 'Financer ses projets, fractionner ses paiements et sécuriser son avenir (BNPL, Micro-finance, Assurance).')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- 4. Seed Sub-categories (Children)
-- Helper to get parent ID and insert child
DO $$
DECLARE
    p_id uuid;
BEGIN
    -- Courses & Quotidien
    SELECT id INTO p_id FROM public.categories WHERE name = 'Courses & Quotidien';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Alimentation', p_id), ('Supermarché', p_id), ('Eau & gaz', p_id), ('Produits locaux', p_id), ('Boulangerie', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- Mode & Style
    SELECT id INTO p_id FROM public.categories WHERE name = 'Mode & Style';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Vêtements', p_id), ('Chaussures', p_id), ('Accessoires', p_id), ('Beauté', p_id), ('Coiffure & esthétique', p_id), ('Parfums', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- Maison & Espace
    SELECT id INTO p_id FROM public.categories WHERE name = 'Maison & Espace';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Mobilier', p_id), ('Électroménager', p_id), ('Décoration', p_id), ('Sécurité domestique', p_id), ('Énergie domestique', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- High-Tech & Digital
    SELECT id INTO p_id FROM public.categories WHERE name = 'High-Tech & Digital';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Smartphones', p_id), ('Accessoires téléphone', p_id), ('Informatique', p_id), ('Internet & Wifi', p_id), ('Services IT', p_id), ('Réparations', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- BTP & Infrastructures
    SELECT id INTO p_id FROM public.categories WHERE name = 'BTP & Infrastructures';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Chantier & BTP', p_id), ('Énergie solaire', p_id), ('Eau & assainissement', p_id), ('Sécurité industrielle', p_id), ('Fournitures entreprises', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- Services & Artisans
    SELECT id INTO p_id FROM public.categories WHERE name = 'Services & Artisans';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Électricien', p_id), ('Plombier', p_id), ('Maçon', p_id), ('Peintre', p_id), ('Ménage', p_id), ('Maintenance', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- Auto & Mobilité
    SELECT id INTO p_id FROM public.categories WHERE name = 'Auto & Mobilité';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Moto / Vélo', p_id), ('Pièces détachées', p_id), ('Transport urbain', p_id), ('Location', p_id), ('Livraison & logistique', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- Santé & Vitalité
    SELECT id INTO p_id FROM public.categories WHERE name = 'Santé & Vitalité';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Pharmacie', p_id), ('Matériel médical', p_id), ('Soins à domicile', p_id), ('Assistance', p_id), ('Bien-être', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- Éducation & Business
    SELECT id INTO p_id FROM public.categories WHERE name = 'Éducation & Business';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Fournitures scolaires', p_id), ('Formations', p_id), ('Coaching', p_id), ('Services administratifs', p_id), ('Impression', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- Loisirs & Évasion
    SELECT id INTO p_id FROM public.categories WHERE name = 'Loisirs & Évasion';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Événementiel', p_id), ('Musique & son', p_id), ('Sport', p_id), ('Traiteur', p_id), ('Culture', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- Agri & Environnement
    SELECT id INTO p_id FROM public.categories WHERE name = 'Agri & Environnement';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Agriculture', p_id), ('Élevage', p_id), ('Transformation locale', p_id), ('Eau & irrigation', p_id), ('Recyclage', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

    -- Yoombal Finance
    SELECT id INTO p_id FROM public.categories WHERE name = 'Yoombal Finance';
    INSERT INTO public.categories (name, parent_id) VALUES 
        ('Paiement fractionné (BNPL)', p_id), ('Micro-finance', p_id), ('Assurance', p_id), ('Épargne', p_id), ('Scoring IA', p_id)
    ON CONFLICT (name) DO UPDATE SET parent_id = p_id;

END $$;
