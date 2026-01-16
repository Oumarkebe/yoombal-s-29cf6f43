-- Migration pour créer une vue user_ai_settings basée sur user_ai_feature_settings
-- Cela résout l'incohérence entre le schéma local et le code TypeScript

-- Option 1: Créer une vue (lecture seule)
-- DROP VIEW IF EXISTS public.user_ai_settings CASCADE;
-- CREATE VIEW public.user_ai_settings AS SELECT * FROM public.user_ai_feature_settings;

-- Option 2 (préférée): Renommer la table directement
-- Cette approche permet les INSERT/UPDATE/DELETE
DO $$
BEGIN
    -- Vérifier si user_ai_feature_settings existe et user_ai_settings n'existe pas
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_ai_feature_settings'
    ) AND NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_ai_settings'
    ) THEN
        -- Renommer la table
        ALTER TABLE public.user_ai_feature_settings RENAME TO user_ai_settings;
        
        -- Renommer les contraintes
        ALTER TABLE public.user_ai_settings 
            RENAME CONSTRAINT user_ai_feature_settings_pkey TO user_ai_settings_pkey;
        
        ALTER TABLE public.user_ai_settings 
            RENAME CONSTRAINT user_ai_feature_settings_user_id_feature_key_key TO user_ai_settings_user_id_feature_key_key;
        
        -- Note: Les index et triggers seront automatiquement renommés
        RAISE NOTICE 'Table user_ai_feature_settings renommée en user_ai_settings';
    ELSIF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_ai_settings'
    ) THEN
        RAISE NOTICE 'Table user_ai_settings existe déjà, aucune action nécessaire';
    ELSE
        -- Si aucune des deux n'existe, créer user_ai_settings
        CREATE TABLE IF NOT EXISTS public.user_ai_settings (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            feature_key TEXT NOT NULL,
            is_enabled BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
            updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
            UNIQUE(user_id, feature_key)
        );
        
        -- Ajouter les politiques RLS
        ALTER TABLE public.user_ai_settings ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can read their own AI settings" 
            ON public.user_ai_settings 
            FOR SELECT 
            USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own AI settings" 
            ON public.user_ai_settings 
            FOR INSERT 
            WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own AI settings" 
            ON public.user_ai_settings 
            FOR UPDATE 
            USING (auth.uid() = user_id);
        
        CREATE POLICY "Admins can manage all AI settings" 
            ON public.user_ai_settings 
            USING (public.is_admin()) 
            WITH CHECK (public.is_admin());
        
        -- Ajouter le trigger pour updated_at
        CREATE TRIGGER handle_user_ai_settings_updated_at 
            BEFORE UPDATE ON public.user_ai_settings 
            FOR EACH ROW 
            EXECUTE FUNCTION public.update_updated_at_column();
        
        RAISE NOTICE 'Table user_ai_settings créée avec succès';
    END IF;
END $$;

-- Accorder les permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_ai_settings TO authenticated;
GRANT ALL ON public.user_ai_settings TO service_role;
