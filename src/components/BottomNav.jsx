import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, Route, Shield, User } from 'lucide-react';
import './BottomNav.css';

const navItems = [
  { id: 'home', icon: Home, label: 'Home', route: '/dashboard' },
  { id: 'tracking', icon: MapPin, label: 'Track', route: '/tracking' },
  { id: 'routes', icon: Route, label: 'Routes', route: '/routes' },
  { id: 'safety', icon: Shield, label: 'Safety', route: '/safety', isSafety: true },
  { id: 'profile', icon: User, label: 'Profile', route: '/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav" id="bottom-navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.route;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''} ${item.isSafety ? 'safety-tab' : ''}`}
            onClick={() => navigate(item.route)}
            id={`nav-${item.id}`}
            aria-label={item.label}
          >
            <Icon className="nav-icon" size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
