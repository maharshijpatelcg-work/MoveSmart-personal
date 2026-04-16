import React, { useState } from 'react';
import useStore from '../store/useStore';
import { timeAgo } from '../utils/helpers';
import './Notifications.css';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'arrival', label: 'Arrivals' },
  { id: 'delay', label: 'Delays' },
  { id: 'safety', label: 'Safety' },
  { id: 'route', label: 'Routes' },
];

export default function Notifications() {
  const { notifications, markNotificationRead, clearNotifications, unreadCount } = useStore();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === activeFilter);

  return (
    <div className="page notif-page" id="notifications-screen">
      {/* Header */}
      <div className="notif-header animate-fade-in">
        <h1>🔔 Notifications {unreadCount > 0 && `(${unreadCount})`}</h1>
        {notifications.length > 0 && (
          <button className="clear-all-btn" onClick={clearNotifications}>
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="notif-filters animate-fade-in-up delay-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`notif-filter ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length > 0 ? (
        <div className="notif-list">
          {filtered.map((notif, i) => (
            <div
              key={notif.id}
              className={`notif-item ${!notif.read ? 'unread' : ''} animate-fade-in-up delay-${Math.min(i + 1, 5)}`}
              onClick={() => markNotificationRead(notif.id)}
              id={`notif-${notif.id}`}
            >
              <div className="notif-icon">{notif.icon}</div>
              <div className="notif-content">
                <div className="notif-title">{notif.title}</div>
                <div className="notif-message">{notif.message}</div>
                <div className="notif-time">{timeAgo(notif.time)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="notif-empty animate-fade-in-up delay-1">
          <div className="notif-empty-icon">🔕</div>
          <h3>All Caught Up!</h3>
          <p>No notifications to show right now.</p>
        </div>
      )}
    </div>
  );
}
