import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from 'sonner';

export interface ChatUser {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    role?: string;
}

export interface Conversation {
    id: string;
    participant_1: string;
    participant_2: string;
    last_message_at: string | null;
    other_user?: ChatUser;
    last_message?: string;
    unread_count?: number;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    is_read: boolean;
    attachment_url?: string;
}

export const useChat = () => {
    const { user } = useAuth();
    const { playTestSound } = useNotifications();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Fetch user conversations list
    const fetchConversations = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            // Fetch conversations where user is participant
            const { data, error } = await supabase
                .from('chat_conversations' as any)
                .select(`
          *,
          p1:profiles!participant_1(id, first_name, last_name, avatar_url),
          p2:profiles!participant_2(id, first_name, last_name, avatar_url)
        `)
                .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
                .order('last_message_at', { ascending: false });

            if (error) throw error;

            // Transform data to easy-to-use structure
            const formattedConversations = data.map((conv: any) => {
                const otherUser = conv.participant_1 === user.id ? conv.p2 : conv.p1;

                return {
                    id: conv.id,
                    participant_1: conv.participant_1,
                    participant_2: conv.participant_2,
                    last_message_at: conv.last_message_at,
                    other_user: otherUser,
                    // We could fetch last message content separately or via join if needed
                };
            });

            setConversations(formattedConversations);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast.error("Erreur lors du chargement des conversations");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch messages for a specific conversation
    const fetchMessages = async (conversationId: string) => {
        try {
            const { data, error } = await supabase
                .from('chat_messages' as any)
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true }); // Oldest first for chat history

            if (error) throw error;
            setMessages((data as any) as Message[]);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Send a message
    const sendMessage = async (content: string, attachmentUrl?: string) => {
        if (!user || !activeConversation || !content.trim()) return;

        try {
            setIsSending(true);
            const { error } = await supabase
                .from('chat_messages' as any)
                .insert({
                    conversation_id: activeConversation.id,
                    sender_id: user.id,
                    content: content.trim(),
                    attachment_url: attachmentUrl
                });

            if (error) throw error;

            // Auto-play sound for sender feedback (optional, maybe distinct 'sent' sound)

        } catch (error) {
            console.error('Error sending message:', error);
            toast.error("Echec de l'envoi du message");
        } finally {
            setIsSending(false);
        }
    };

    // Initialize or Get existing Conversation with a user
    const startConversation = async (otherUserId: string) => {
        if (!user) return;

        // Check if exists locally first
        const existing = conversations.find(
            c => (c.participant_1 === user.id && c.participant_2 === otherUserId) ||
                (c.participant_1 === otherUserId && c.participant_2 === user.id)
        );

        if (existing) {
            setActiveConversation(existing);
            fetchMessages(existing.id);
            return existing.id;
        }

        // Check DB
        const { data: dbExisting, error: fetchError } = await supabase
            .from('chat_conversations' as any)
            .select('id')
            .or(`and(participant_1.eq.${user.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user.id})`)
            .single();

        if (dbExisting) {
            // Just reload list to get full object
            await fetchConversations();
            const fullConv = conversations.find(c => c.id === (dbExisting as any).id);
            // For simplicity, we just trigger fetchConversations and let user select it or we optimize later
            return (dbExisting as any).id;
        }

        // Create new
        const { data: newConv, error: createError } = await supabase
            .from('chat_conversations' as any)
            .insert({
                participant_1: user.id,
                participant_2: otherUserId
            })
            .select()
            .single();

        if (createError) {
            console.error("Error creating conversation:", createError);
            return null;
        }

        await fetchConversations();
        return (newConv as any).id;
    };

    // Realtime subscription
    useEffect(() => {
        if (!user) return;

        // Subscribe to new messages for active conversation
        const messageChannel = supabase
            .channel('public:chat_messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    // Filter logic usually needed, but for simplicity we filter in callback
                },
                (payload) => {
                    const newMsg = payload.new as Message;

                    // If message belongs to active conversation, append it
                    if (activeConversation && newMsg.conversation_id === activeConversation.id) {
                        setMessages(prev => [...prev, newMsg]);
                        // If not sent by me, play sound
                        if (newMsg.sender_id !== user.id) {
                            playTestSound();
                        }
                    }

                    // Update conversation last_message_at list order (could optimize locally)
                    // For now, simple re-fetch or local robust update
                    if (newMsg.sender_id !== user.id && (!activeConversation || newMsg.conversation_id !== activeConversation.id)) {
                        // Notification / Sound for non-active conversation message
                        playTestSound();
                        toast.info("Nouveau message reçu"); // Simple toast, actual notif is handled by DB Notif system
                    }

                    // Refresh list to show updated timestamp/order
                    fetchConversations();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messageChannel);
        };
    }, [user, activeConversation]);

    // Initial load
    useEffect(() => {
        fetchConversations();
    }, [user]);

    // Load messages when active conversation changes
    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation.id);
        } else {
            setMessages([]);
        }
    }, [activeConversation]);

    return {
        conversations,
        activeConversation,
        setActiveConversation,
        messages,
        sendMessage,
        startConversation,
        isLoading,
        isSending
    };
};
