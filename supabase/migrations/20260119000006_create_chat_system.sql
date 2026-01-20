-- =============================================
-- Migration: Create P2P Chat System
-- Description: Conversations, Messages, and Auto-Notifications
-- =============================================

-- 1. Table: chat_conversations
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    participant_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    last_message_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_participants UNIQUE (participant_1, participant_2)
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- 2. Table: chat_messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_chat_conversations_p1 ON public.chat_conversations(participant_1);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_p2 ON public.chat_conversations(participant_2);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON public.chat_messages(sender_id);

-- 4. RLS Policies
-- Conversations: View if you are participant 1 or 2
DROP POLICY IF EXISTS "Users view their conversations" ON public.chat_conversations;
CREATE POLICY "Users view their conversations"
ON public.chat_conversations FOR SELECT
USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Messages: View if you are a participant in the conversation
DROP POLICY IF EXISTS "Users view conversation messages" ON public.chat_messages;
CREATE POLICY "Users view conversation messages"
ON public.chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations c
    WHERE c.id = conversation_id
    AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
  )
);

-- Messages: Insert if you are a participant
DROP POLICY IF EXISTS "Users send messages" ON public.chat_messages;
CREATE POLICY "Users send messages"
ON public.chat_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.chat_conversations c
    WHERE c.id = conversation_id
    AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
  )
);

-- 5. Trigger: Update last_message_at
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_conversations
    SET last_message_at = NEW.created_at, updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_chat_update_timestamp
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_timestamp();

-- 6. Trigger: Auto-Notify Recipient
CREATE OR REPLACE FUNCTION public.notify_chat_recipient()
RETURNS TRIGGER AS $$
DECLARE
    recipient_id UUID;
    sender_name TEXT;
BEGIN
    -- Find recipient (the other participant)
    SELECT 
        CASE 
            WHEN participant_1 = NEW.sender_id THEN participant_2
            ELSE participant_1
        END INTO recipient_id
    FROM public.chat_conversations
    WHERE id = NEW.conversation_id;

    -- Optional: Get sender name from profiles if available, else 'Nouveau Message'
    -- For now simpler: generic title or fetch. Let's assume generic.
    
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (
        recipient_id, 
        'system', -- or 'chat' if we add enum
        'Nouveau Message', 
        LEFT(NEW.content, 50) || '...',
        jsonb_build_object('conversation_id', NEW.conversation_id, 'action_url', '/chat')
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_chat_notify
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_chat_recipient();
