
-- Migration to seed the final 12 Univers for Yoombal Marketplace
-- Focus: Human Usage, Scalability, and Professional Classification
-- Date: 2026-01-18

-- Ensure name is unique
ALTER TABLE IF EXISTS public.categories ADD CONSTRAINT categories_name_unique UNIQUE (name);

-- Insert the 12 Univers with rich descriptions for IA and SEO
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
