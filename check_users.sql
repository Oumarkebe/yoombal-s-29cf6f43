
-- Ce script va lister TOUS vos utilisateurs enregistrés (Email et ID)
-- Cela nous permettra de voir si "yombal28@gmail.com" est bien là ou s'il y a une faute de frappe.

SELECT id, email, created_at FROM auth.users;
