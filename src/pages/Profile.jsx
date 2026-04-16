import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Moon, Bell, Shield, MapPin, HelpCircle, Star, LogOut, Route, Navigation
} from 'lucide-react';
import useStore from '../store/useStore';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, darkMode, toggleDarkMode, savedRoutes, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: Bell,
      label: 'Notifications',
      desc: 'Manage alert preferences',
      color: '#1A73E8',
      bg: '#E3F2FD',
      action: () => navigate('/notifications'),
    },
    {
      icon: Shield,
      label: 'Safety Settings',
      desc: 'Emergency contacts & SOS',
      color: '#FF6D00',
      bg: '#FFF3E0',
      action: () => navigate('/safety'),
    },
    {
      icon: MapPin,
      label: 'Location Settings',
      desc: 'Manage location permissions',
      color: '#00C853',
      bg: '#E8F5E9',
      action: () => {},
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      desc: 'FAQ, contact support',
      color: '#7C4DFF',
      bg: '#EDE7F6',
      action: () => {},
    },
    {
      icon: Star,
      label: 'Rate MoveSmart',
      desc: 'Share your feedback',
      color: '#FFB300',
      bg: '#FFF8E1',
      action: () => {},
    },
  ];

  return (
    <div className="page profile-page" id="profile-screen">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">👤</div>
        <h2 className="profile-name">{user?.name || 'User'}</h2>
        <p className="profile-email">{user?.email || 'user@movesmart.app'}</p>
      </div>

      {/* Stats */}
      <div className="profile-stats animate-fade-in-up">
        <div className="profile-stat">
          <div className="stat-number">{user?.totalTrips || 0}</div>
          <div className="stat-label">Trips</div>
        </div>
        <div className="profile-stat">
          <div className="stat-number">{user?.totalDistance || 0}</div>
          <div className="stat-label">km</div>
        </div>
        <div className="profile-stat">
          <div className="stat-number">{user?.safetyScore || 0}%</div>
          <div className="stat-label">Safety</div>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="profile-section animate-fade-in-up delay-1">
        <div className="profile-section-title">Appearance</div>
        <div className="profile-menu">
          <button className="profile-menu-item" onClick={toggleDarkMode}>
            <div className="menu-icon" style={{ background: '#1e1e2e', color: '#FFB300' }}>
              <Moon size={18} />
            </div>
            <div className="menu-text">
              <h4>Dark Mode</h4>
              <p>{darkMode ? 'On' : 'Off'}</p>
            </div>
            <div className="menu-right">
              <div className={`toggle-switch ${darkMode ? 'active' : ''}`} style={{ pointerEvents: 'none' }}>
                <div className="toggle-knob" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Saved Routes */}
      <div className="profile-section animate-fade-in-up delay-2">
        <div className="profile-section-title">Saved Routes</div>
        {savedRoutes.map((route) => (
          <div key={route.id} className="saved-route-item">
            <div className="saved-route-icon">
              <Navigation size={16} />
            </div>
            <div className="saved-route-info">
              <h4>{route.name}</h4>
              <p>{route.from} → {route.to}</p>
            </div>
            <span className="saved-route-time">{route.time}</span>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="profile-section animate-fade-in-up delay-3">
        <div className="profile-section-title">Settings</div>
        <div className="profile-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="profile-menu-item"
                onClick={item.action}
              >
                <div className="menu-icon" style={{ background: item.bg, color: item.color }}>
                  <Icon size={18} />
                </div>
                <div className="menu-text">
                  <h4>{item.label}</h4>
                  <p>{item.desc}</p>
                </div>
                <div className="menu-right">
                  <ChevronRight size={18} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <button className="logout-btn animate-fade-in-up delay-4" onClick={handleLogout} id="logout-btn">
        <LogOut size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
        Log Out
      </button>

      <div className="app-version">MoveSmart v1.0.0</div>
    </div>
  );
}
