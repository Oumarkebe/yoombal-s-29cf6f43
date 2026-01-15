
-- Confirmer l'email de yoombal28@gmail.com manuellement
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'yoombal28@gmail.com';

-- Vérifier le résultat
SELECT email, email_confirmed_at, last_sign_in_at 
FROM auth.users 
WHERE email = 'yoombal28@gmail.com';
