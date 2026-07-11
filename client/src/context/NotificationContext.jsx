import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { reportsAPI } from '../services/api';
import getSocket from '../services/socket';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await reportsAPI.getNotifications();
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.read).length);
    } catch {
      // API may be unavailable
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const socket = getSocket();

    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    return () => {
      socket.off('notification');
    };
  }, [fetchNotifications]);

  const markRead = async (id) => {
    await reportsAPI.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(c - 1, 0));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, fetchNotifications, markRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
