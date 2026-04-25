// MoveSmart — Notifications Page
import { Bell, Check, CheckCheck, Trash2, Bus, Navigation, Shield, AlertTriangle, Settings } from 'lucide-react';

const ICONS = {
  arrival: Bus,
  delay: AlertTriangle,
  route: Navigation,
  safety: Shield,
  system: Settings,
};

const COLORS = {
  arrival: '#00E676',
  delay: '#FFB74D',
  route: '#1A73E8',
  safety: '#FF6B6B',
  system: '#A78BFA',
};

export default function Notifications({ notifications, unreadCount, markAsRead, markAllRead, clearAll, formatTime }) {
  return (
    <section className="notif-page" id="notifications-page">
      <div className="notif-page__header animate-in">
        <div>
          <h1><Bell size={28} /> Notifications</h1>
          <p>{unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}</p>
        </div>
        <div className="notif-page__actions">
          <button className="btn btn--ghost btn--sm" onClick={markAllRead} id="mark-all-read">
            <CheckCheck size={16} /> Mark All Read
          </button>
          <button className="btn btn--ghost btn--sm" onClick={clearAll} id="clear-all-notifs">
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div className="notif-page__list">
        {notifications.length === 0 ? (
          <div className="notif-page__empty animate-in">
            <Bell size={48} />
            <h3>No notifications</h3>
            <p>You're all caught up! New alerts will appear here.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = ICONS[n.type] || Bell;
            const color = COLORS[n.type] || '#8B9DB5';
            return (
              <div
                key={n.id}
                className={`notif-card animate-in${n.read ? '' : ' notif-card--unread'}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="notif-card__icon" style={{ '--notif-color': color }}>
                  <Icon size={18} />
                </div>
                <div className="notif-card__body">
                  <h4 className="notif-card__title">{n.title}</h4>
                  <p className="notif-card__message">{n.message}</p>
                  <span className="notif-card__time">{formatTime(n.time)}</span>
                </div>
                {!n.read && (
                  <button className="notif-card__mark" onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }} title="Mark as read">
                    <Check size={14} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
