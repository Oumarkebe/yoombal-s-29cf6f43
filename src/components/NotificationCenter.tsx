
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, CreditCard, Star, Gift, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'payment' | 'review' | 'promo';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Commande expédiée',
      message: 'Votre commande #1234 a été expédiée et sera livrée demain.',
      time: '2h',
      read: false
    },
    {
      id: '2',
      type: 'payment',
      title: 'Paiement BNPL dû',
      message: 'Votre échéance de 15 000 XOF est due dans 3 jours.',
      time: '5h',
      read: false
    },
    {
      id: '3',
      type: 'review',
      title: 'Évaluez votre achat',
      message: 'Comment était votre Samsung Galaxy A54 ? Laissez un avis.',
      time: '1j',
      read: true
    },
    {
      id: '4',
      type: 'promo',
      title: 'Offre spéciale',
      message: '20% de réduction sur tous les smartphones ce weekend !',
      time: '2j',
      read: true
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="h-5 w-5 text-blue-600" />;
      case 'payment': return <CreditCard className="h-5 w-5 text-orange-600" />;
      case 'review': return <Star className="h-5 w-5 text-green-600" />;
      case 'promo': return <Gift className="h-5 w-5 text-purple-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-80 max-h-96 overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune notification
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Il y a {notification.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs"
                          >
                            Marquer lu
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          >
            Tout marquer comme lu
          </Button>
        </div>
      )}
    </Card>
  );
};

export default NotificationCenter;
