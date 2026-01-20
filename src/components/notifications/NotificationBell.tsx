import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationsContext';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="mb-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle>Notifications</SheetTitle>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={() => markAllAsRead()}>
                                Tout lire
                            </Button>
                        )}
                    </div>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)] pr-4">
                    <div className="flex flex-col gap-4">
                        {notifications.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                Aucune notification
                            </p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex flex-col gap-1 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50 ${!notification.is_read ? 'bg-muted/30 border-l-4 border-l-primary' : ''
                                        }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-center justify-between font-medium">
                                        <span>{notification.title}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.created_at), {
                                                addSuffix: true,
                                                locale: fr,
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground">{notification.message}</p>
                                    {notification.data?.action_url && (
                                        <Button variant="link" className="px-0 h-auto self-start mt-1">
                                            Voir détails
                                        </Button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};
