
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type Message = {
    id: string;
    application_id: string;
    sender_id: string;
    content: string;
    message_type: 'text' | 'image' | 'document' | 'system';
    is_system_message: boolean;
    attachment_url?: string;
    is_read: boolean;
    read_at?: string;
    created_at: string;
};

export function useApplicationMessages(applicationId: string) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Fetch
    const fetchMessages = useCallback(async () => {
        if (!applicationId || !user) return;

        setIsLoading(true);
        const { data, error } = await supabase
            .from('application_messages' as any)
            .select('*')
            .eq('application_id', applicationId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error);
        } else {
            setMessages((data as unknown as Message[]) || []);
            // Mark my unread messages as read
            markAsRead(data as unknown as Message[]);
        }
        setIsLoading(false);
    }, [applicationId, user]);

    // Realtime Subscription
    useEffect(() => {
        if (!applicationId || !user) return;

        fetchMessages();

        const channelName = `messages:${applicationId}:${user.id}`; // Unique name per user session
        const channel = supabase
            .channel(channelName)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'application_messages',
                filter: `application_id=eq.${applicationId}`
            }, (payload) => {
                const newMessage = payload.new as Message;

                // Avoid duplication if pessimistic update already added it (rare but possible)
                setMessages(prev => {
                    if (prev.some(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage];
                });

                // If message is from others, mark as read immediately if chat is open
                if (newMessage.sender_id !== user.id) {
                    markSingleAsRead(newMessage.id);
                }
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'application_messages',
                filter: `application_id=eq.${applicationId}`
            }, (payload) => {
                const updatedMessage = payload.new as Message;
                setMessages(prev => prev.map(m => m.id === updatedMessage.id ? updatedMessage : m));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [applicationId, user]); // Removed fetchMessages from deps to avoid loop if it changes

    const sendMessage = async (content: string, type: 'text' | 'image' = 'text', attachmentUrl?: string) => {
        if (!user) return;

        // Optimistic Update (Optional, skipping for robustness first)

        const { error } = await supabase
            .from('application_messages' as any)
            .insert({
                application_id: applicationId,
                sender_id: user.id,
                content,
                message_type: type,
                attachment_url: attachmentUrl,
                is_read: false
            });

        if (error) {
            console.error("Error sending message:", error);
            toast({
                title: "Erreur",
                description: "Message non envoyé",
                variant: "destructive"
            });
            return false;
        }

        // Trigger Notification for the OTHER party is handled by a separate Logic or SQL Trigger
        // For now, we will handle it in the hook manually to be safe if no Edge Function
        // But we need the recipient ID. 
        // Optimization: The trigger should be on DB or generic notification logic.
        // We'll leave the notification part to the caller or DB trigger for V2 robustness.

        return true;
    };

    const markSingleAsRead = async (messageId: string) => {
        await supabase
            .from('application_messages' as any)
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('id', messageId);
    };

    const markAsRead = async (msgs: Message[]) => {
        if (!user) return;
        const unreadIds = msgs
            .filter(m => !m.is_read && m.sender_id !== user.id)
            .map(m => m.id);

        if (unreadIds.length > 0) {
            await supabase
                .from('application_messages' as any)
                .update({ is_read: true, read_at: new Date().toISOString() })
                .in('id', unreadIds);

            setMessages(prev => prev.map(m => unreadIds.includes(m.id) ? { ...m, is_read: true } : m));
        }
    };

    return {
        messages,
        isLoading,
        sendMessage,
        refetch: fetchMessages
    };
}
