
CREATE TABLE IF NOT EXISTS public.application_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.bnpl_applications(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'image', 'document', 'system'
  is_system_message BOOLEAN DEFAULT false,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;

-- SELECT: Les participants voient les messages
DROP POLICY IF EXISTS "Participants can view messages" ON public.application_messages;
DROP POLICY IF EXISTS "Les participants peuvent voir les messages" ON public.application_messages;
CREATE POLICY "Les participants peuvent voir les messages" ON public.application_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bnpl_applications 
      WHERE id = application_id 
      AND (user_id = auth.uid() OR merchant_id = auth.uid())
    )
  );

-- INSERT: Les participants insèrent des messages
DROP POLICY IF EXISTS "Participants can insert messages" ON public.application_messages;
DROP POLICY IF EXISTS "Les participants peuvent insérer des messages" ON public.application_messages;
CREATE POLICY "Les participants peuvent insérer des messages" ON public.application_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bnpl_applications 
      WHERE id = application_id 
      AND (user_id = auth.uid() OR merchant_id = auth.uid())
    )
  );

-- UPDATE: Les participants mettent à jour (marquer comme lu)
DROP POLICY IF EXISTS "Participants can update messages" ON public.application_messages;
DROP POLICY IF EXISTS "Les participants peuvent mettre à jour les messages" ON public.application_messages;
CREATE POLICY "Les participants peuvent mettre à jour les messages" ON public.application_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bnpl_applications 
      WHERE id = application_id 
      AND (user_id = auth.uid() OR merchant_id = auth.uid())
    )
  );
