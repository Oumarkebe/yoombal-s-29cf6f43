import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { soundService } from '@/services/SoundService';
import { toast } from 'sonner';

export type NotificationType = 'bnpl' | 'order' | 'system' | 'payment';

export interface NotificationItem {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data: any;
    is_read: boolean;
    created_at: string;
}

interface NotificationsContextType {
    notifications: NotificationItem[];
    unreadCount: number;
    isLoading: boolean;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    playTestSound: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('notifications' as any)
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            setNotifications((data as any) as NotificationItem[]);
            setUnreadCount((data as any).filter((n: NotificationItem) => !n.is_read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications' as any)
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;

            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('notifications' as any)
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;

            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const playTestSound = () => {
        soundService.play();
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();

            const channel = supabase
                .channel('public:notifications')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        const newNotification = payload.new as NotificationItem;
                        setNotifications((prev) => [newNotification, ...prev]);
                        setUnreadCount((prev) => prev + 1);

                        // Audio & Visual Feedback
                        soundService.play();
                        toast(newNotification.title, {
                            description: newNotification.message,
                            action: {
                                label: 'Voir',
                                onClick: () => console.log('View notification', newNotification.id),
                            },
                        });
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user]);

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                unreadCount,
                isLoading,
                markAsRead,
                markAllAsRead,
                playTestSound,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};
