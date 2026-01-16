
import React, { useEffect, useState } from 'react';
import { Bell, Package, Truck, ShoppingCart, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  data?: any;
}

const NotificationManager: React.FC = () => {
  const { notifications, isLoading, markAsRead } = useNotifications();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // markAsRead is now provided by useNotifications hook

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-4 w-4" />;
      case 'delivery': return <Truck className="h-4 w-4" />;
      case 'stock': return <Package className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Notifications</h2>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="rounded-full px-2 py-1">
            {unreadCount}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`${notification.is_read ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  {!notification.is_read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(notification.id)}
                      className="mt-2"
                    >
                      Marquer comme lu
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotificationManager;
