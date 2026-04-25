// MoveSmart — Notification Management Hook
import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'ms_notifications';

const SAMPLE_NOTIFICATIONS = [
  { id: 'n1', type: 'arrival', title: 'Bus Arrived', message: 'Bus R1 has arrived at SG Highway stop', read: false, time: Date.now() - 120000 },
  { id: 'n2', type: 'delay', title: 'Route Delayed', message: 'Ashram Road Line delayed by 8 minutes due to traffic', read: false, time: Date.now() - 900000 },
  { id: 'n3', type: 'safety', title: 'Night Mode Active', message: 'Enhanced safety monitoring has been activated', read: true, time: Date.now() - 3600000 },
  { id: 'n4', type: 'route', title: 'Route Optimized', message: 'Your SG Highway route was optimized. Saving 12 min.', read: true, time: Date.now() - 7200000 },
  { id: 'n5', type: 'system', title: 'Welcome!', message: 'Welcome to MoveSmart. Set up your routes to get started.', read: true, time: Date.now() - 86400000 },
];

const AUTO_NOTIFICATIONS = [
  { type: 'arrival', title: 'Vehicle Approaching', message: 'Auto R3 is 2 minutes away from your stop' },
  { type: 'delay', title: 'Minor Delay', message: 'Maninagar Express is running 5 minutes late' },
  { type: 'route', title: 'Faster Route Found', message: 'A 7 min faster route is available via CG Road' },
  { type: 'safety', title: 'Location Shared', message: 'Your live location has been shared with trusted contacts' },
  { type: 'arrival', title: 'Trip Complete', message: 'You have arrived at your destination safely' },
];

export default function useNotifications() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SAMPLE_NOTIFICATIONS;
    } catch {
      return SAMPLE_NOTIFICATIONS;
    }
  });

  const intervalRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Auto-generate notifications periodically
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const template = AUTO_NOTIFICATIONS[Math.floor(Math.random() * AUTO_NOTIFICATIONS.length)];
      const newNotif = {
        id: `n_${Date.now()}`,
        ...template,
        read: false,
        time: Date.now(),
      };

      setNotifications((prev) => [newNotif, ...prev].slice(0, 50));

      // Show toast with close button
      const icons = { arrival: '🚍', delay: '⏳', route: '🧭', safety: '🛡️', system: '⚙️' };
      toast((t) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
          <span style={{ flexShrink: 0 }}>{icons[newNotif.type] || '🔔'}</span>
          <span style={{ flex: 1 }}>{newNotif.message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'none', border: 'none', color: '#8B9DB5', cursor: 'pointer',
              padding: '2px 4px', fontSize: '16px', lineHeight: 1, flexShrink: 0,
            }}
            aria-label="Close"
          >✕</button>
        </div>
      ), {
        duration: 4000,
        style: {
          background: '#162231',
          color: '#E8EDF2',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          fontSize: '0.875rem',
        },
      });
    }, 30000 + Math.random() * 30000); // Every 30-60 seconds

    return () => clearInterval(intervalRef.current);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((notif) => {
    const newNotif = {
      id: `n_${Date.now()}`,
      read: false,
      time: Date.now(),
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
  }, []);

  const formatTime = useCallback((timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    clearAll,
    addNotification,
    formatTime,
  };
}
