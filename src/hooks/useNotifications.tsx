
import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const notify = {
    success: (title: string, message: string, duration?: number) => 
      addNotification({ type: 'success', title, message, duration }),
    error: (title: string, message: string, duration?: number) => 
      addNotification({ type: 'error', title, message, duration }),
    info: (title: string, message: string, duration?: number) => 
      addNotification({ type: 'info', title, message, duration }),
    warning: (title: string, message: string, duration?: number) => 
      addNotification({ type: 'warning', title, message, duration }),
  };

  return {
    notifications,
    notify,
    removeNotification
  };
};
