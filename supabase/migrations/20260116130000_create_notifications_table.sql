
-- Migration: Create Notifications Table
-- Description: Table persistante pour suivre les alertes BNPL, commandes et système.

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'system', -- 'bnpl', 'order', 'system', 'payment'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Activation de la RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "System/Merchant can insert notifications" ON public.notifications;
CREATE POLICY "System/Merchant can insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true); -- On permet l'insertion car un marchand doit pouvoir notifier un client

-- Index pour la performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Commentaire descriptif
COMMENT ON TABLE public.notifications IS 'Table des notifications persistantes pour les utilisateurs et marchands.';
