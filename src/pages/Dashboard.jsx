import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, Route, ShieldAlert, Bot, Navigation, ChevronRight } from 'lucide-react';
import MapView from '../components/MapView';
import useStore from '../store/useStore';
import { getGreeting, isNightTime } from '../utils/helpers';
import { mockVehicleStatus, mockRecentTrips, mockAITips } from '../services/mockData';
import { getDailyTip } from '../services/geminiService';
import { VEHICLE_STATUSES } from '../utils/constants';
import './Dashboard.css';

const QUICK_ICONS = { MapPin, Route, ShieldAlert, Bot };

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, unreadCount, openChat } = useStore();
  const [aiTip, setAiTip] = useState('');
  const status = VEHICLE_STATUSES[mockVehicleStatus.status];

  useEffect(() => {
    getDailyTip().then(setAiTip).catch(() => {
      setAiTip(mockAITips[Math.floor(Math.random() * mockAITips.length)]);
    });
  }, []);

  const quickActions = [
    { id: 'track', icon: MapPin, label: 'Track', color: '#1A73E8', bg: '#E3F2FD', route: '/tracking' },
    { id: 'routes', icon: Route, label: 'Routes', color: '#00C853', bg: '#E8F5E9', route: '/routes' },
    { id: 'sos', icon: ShieldAlert, label: 'SOS', color: '#FF1744', bg: '#FFEBEE', route: '/safety' },
    { id: 'ai', icon: Bot, label: 'AI Help', color: '#7C4DFF', bg: '#EDE7F6', route: null },
  ];

  const handleQuickAction = (action) => {
    if (action.id === 'ai') {
      openChat();
    } else {
      navigate(action.route);
    }
  };

  return (
    <div className="page dashboard" id="dashboard-screen">
      {/* Header */}
      <div className="dash-header animate-fade-in">
        <div className="dash-greeting">
          <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
          <p>{isNightTime() ? '🌙 Night mode active — stay safe!' : '☀️ Great day for smart commuting!'}</p>
        </div>
        <div className="dash-header-actions">
          <button className="dash-header-btn" onClick={() => navigate('/notifications')} id="notifications-btn">
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge" />}
          </button>
        </div>
      </div>

      {/* Map Preview */}
      <div className="dash-map-card animate-fade-in-up delay-1" onClick={() => navigate('/tracking')}>
        <MapView
          size="small"
          showVehicle={true}
          showRoute={true}
          showUser={true}
          label="LIVE"
        />
      </div>

      {/* Vehicle Status */}
      <div className="dash-status-card animate-fade-in-up delay-2" onClick={() => navigate('/tracking')}>
        <div className="status-icon" style={{ background: status.bg, color: status.color }}>
          🚌
        </div>
        <div className="status-info">
          <h3>{mockVehicleStatus.vehicleName}</h3>
          <p>
            <span className="badge badge-success" style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
            {' · '}{mockVehicleStatus.vehicleNumber}
          </p>
        </div>
        <div className="status-eta">
          <div className="eta-time">{mockVehicleStatus.eta}</div>
          <div className="eta-label">ETA</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="dash-section-title animate-fade-in-up delay-2">Quick Actions</h3>
      <div className="quick-actions-grid">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className={`quick-action-card animate-fade-in-up delay-${i + 2}`}
              onClick={() => handleQuickAction(action)}
              id={`quick-action-${action.id}`}
            >
              <div className="quick-action-icon" style={{ background: action.bg }}>
                <Icon size={22} color={action.color} strokeWidth={2} />
              </div>
              <span className="quick-action-label">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI Tip */}
      {aiTip && (
        <div className="ai-tip-card animate-fade-in-up delay-3">
          <div className="ai-tip-icon">🤖</div>
          <div className="ai-tip-content">
            <div className="tip-label">AI Insight</div>
            <div className="tip-text">{aiTip}</div>
          </div>
        </div>
      )}

      {/* Recent Trips */}
      <h3 className="dash-section-title animate-fade-in-up delay-4">Recent Trips</h3>
      <div className="recent-trips">
        {mockRecentTrips.map((trip) => (
          <div key={trip.id} className="trip-card animate-fade-in-up delay-4">
            <div className="trip-icon">
              <Navigation size={18} />
            </div>
            <div className="trip-info">
              <div className="trip-route">{trip.from} → {trip.to}</div>
              <div className="trip-meta">
                <span>{trip.date}</span>
                <span>·</span>
                <span>{trip.distance}</span>
              </div>
            </div>
            <div className="trip-duration">{trip.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
