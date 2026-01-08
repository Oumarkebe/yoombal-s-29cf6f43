
-- 1. Met à jour les valeurs de role invalides/NULL dans public.profiles
UPDATE public.profiles
SET role = 'client'
WHERE role NOT IN ('client','livreur','admin') OR role IS NULL;

-- 2. Ajoute la contrainte CHECK
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('client','livreur','admin'));
