
-- 1. Met à jour les rôles invalides/NULL ou erronés dans public.profiles
UPDATE public.profiles
SET role = 'client'
WHERE role NOT IN ('client','livreur','admin','marchand') OR role IS NULL;

-- 2. Ajoute la contrainte CHECK incluant 'marchand'
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('client','livreur','admin','marchand'));
