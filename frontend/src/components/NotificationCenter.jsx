// MoveSmart — Notification Center Dropdown (Navbar)
import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Bus, Navigation, Shield, AlertTriangle, Settings, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ICONS = { arrival: Bus, delay: AlertTriangle, route: Navigation, safety: Shield, system: Settings };
const COLORS = { arrival: '#00E676', delay: '#FFB74D', route: '#1A73E8', safety: '#FF6B6B', system: '#A78BFA' };

export default function NotificationCenter({ notifications, unreadCount, markAsRead, markAllRead, formatTime }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const recent = notifications.slice(0, 5);

  return (
    <div className="notif-center" ref={ref}>
      <button className="notif-center__bell" onClick={() => setOpen(!open)} id="notif-bell" aria-label="Notifications">
        <Bell size={20} />
        {unreadCount > 0 && <span className="notif-center__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-center__dropdown">
          <div className="notif-center__head">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button className="notif-center__mark-all" onClick={() => { markAllRead(); }}>Mark all read</button>
            )}
          </div>
          <div className="notif-center__list">
            {recent.length === 0 ? (
              <p className="notif-center__empty">No notifications yet</p>
            ) : (
              recent.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                const color = COLORS[n.type] || '#8B9DB5';
                return (
                  <div key={n.id} className={`notif-center__item${n.read ? '' : ' unread'}`} onClick={() => markAsRead(n.id)}>
                    <div className="notif-center__item-icon" style={{ '--nc-color': color }}><Icon size={14} /></div>
                    <div className="notif-center__item-body">
                      <p>{n.message}</p>
                      <span>{formatTime(n.time)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <Link to="/notifications" className="notif-center__footer" onClick={() => setOpen(false)}>
            View all notifications <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
