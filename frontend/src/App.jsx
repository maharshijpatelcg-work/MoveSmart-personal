// MoveSmart — Main App Component with SEO
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SEO from './components/SEO.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LiveMap from './pages/LiveMap.jsx';
import RoutesPage from './pages/Routes.jsx';
import Safety from './pages/Safety.jsx';
import Notifications from './pages/Notifications.jsx';
import SettingsPage from './pages/Settings.jsx';
import SchoolBus from './pages/SchoolBus.jsx';
import TrafficPage from './pages/Traffic.jsx';
import WomenSafety from './pages/WomenSafety.jsx';
import Verification from './pages/Verification.jsx';
import useNotifications from './hooks/useNotifications.jsx';

// Per-page SEO configuration
const PAGE_SEO = {
  '/': { title: 'Smart Urban Mobility Platform', description: 'MoveSmart is a next-generation urban mobility platform with real-time tracking, intelligent routing, school bus monitoring, women safety, and AI-powered commute optimization.', keywords: 'urban mobility, smart transport, real-time tracking, AI routing, safety platform' },
  '/login': { title: 'Login', description: 'Sign in to your MoveSmart account to access real-time tracking, smart routing, and safety features.', keywords: 'login, sign in, MoveSmart account' },
  '/register': { title: 'Create Account', description: 'Join MoveSmart — register with face verification for smarter, safer commuting with real-time tracking and safety features.', keywords: 'register, sign up, create account, join MoveSmart' },
  '/dashboard': { title: 'Dashboard', description: 'View your commute analytics, fleet performance, and real-time statistics on the MoveSmart dashboard.', keywords: 'dashboard, analytics, commute stats, performance' },
  '/map': { title: 'Live Map', description: 'Real-time vehicle tracking on an interactive map with live positions, routes, and ETA updates.', keywords: 'live map, vehicle tracking, real-time GPS, fleet tracking' },
  '/routes': { title: 'Route Management', description: 'Create, manage, and optimize your daily commute routes with smart suggestions and status monitoring.', keywords: 'routes, route management, commute planning, route optimization' },
  '/safety': { title: 'Safety Hub', description: 'Emergency SOS, trusted contacts, live location sharing, and night travel monitoring — your complete safety control center.', keywords: 'safety, SOS, emergency, trusted contacts, night mode, location sharing' },
  '/school-bus': { title: 'School Bus Tracking', description: 'Real-time school bus tracking with student check-in/check-out, driver profiles, route schedules, and parent notifications. Inspired by RideZum.', keywords: 'school bus, student tracking, RideZum, parent visibility, school transport, bus route' },
  '/traffic': { title: 'Traffic & Navigation', description: 'Real-time traffic data, route directions, and ETA calculations powered by Google Maps for optimal commute planning.', keywords: 'traffic, Google Maps, navigation, directions, ETA, route planning, traffic layer' },
  '/women-safety': { title: 'Women Safety', description: 'Personal safety companion with SOS alerts, fake call, safe walk timer, guardian circle, live streaming, and shake-to-alert. Inspired by bSafe.', keywords: 'women safety, bSafe, SOS, fake call, guardian, safe walk, personal safety, night safety' },
  '/verify': { title: 'Identity Verification', description: 'AI-powered face detection, liveness check, expression analysis, and identity verification for drivers, students, and passengers.', keywords: 'face detection, identity verification, AI, liveness check, biometric, face recognition' },
  '/notifications': { title: 'Notifications', description: 'View your alert history — route delays, safety events, system updates, and real-time notifications.', keywords: 'notifications, alerts, safety events, route updates' },
  '/settings': { title: 'Settings', description: 'Manage your MoveSmart profile, notification preferences, privacy settings, and account configuration.', keywords: 'settings, profile, preferences, privacy, account' },
};

function PageSEO() {
  const location = useLocation();
  const seo = PAGE_SEO[location.pathname] || { title: 'MoveSmart', description: 'Smart Urban Mobility Platform' };
  return <SEO title={seo.title} description={seo.description} path={location.pathname} keywords={seo.keywords || ''} />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('ms_token') || '');
  const notif = useNotifications();

  useEffect(() => {
    // Clean up old localStorage data if any
    localStorage.removeItem('ms_user');
    localStorage.removeItem('ms_token');

    const stored = sessionStorage.getItem('ms_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const handleLogin = (userData, tkn) => {
    setUser(userData);
    setToken(tkn);
    sessionStorage.setItem('ms_user', JSON.stringify(userData));
    sessionStorage.setItem('ms_token', tkn);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    sessionStorage.removeItem('ms_user');
    sessionStorage.removeItem('ms_token');
  };

  // Shorthand for wrapping protected routes
  const P = ({ children }) => <ProtectedRoute user={user}>{children}</ProtectedRoute>;

  return (
    <div className="app">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <PageSEO />
      <Navbar user={user} onLogout={handleLogout} notif={notif} />
      <main className="page">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />

          {/* Protected routes — require login */}
          <Route path="/dashboard" element={<P><Dashboard user={user} token={token} /></P>} />
          <Route path="/map" element={<P><LiveMap /></P>} />
          <Route path="/routes" element={<P><RoutesPage /></P>} />
          <Route path="/safety" element={<P><Safety user={user} /></P>} />
          <Route path="/notifications" element={<P><Notifications {...notif} /></P>} />
          <Route path="/settings" element={<P><SettingsPage user={user} onLogout={handleLogout} /></P>} />
          <Route path="/school-bus" element={<P><SchoolBus /></P>} />
          <Route path="/traffic" element={<P><TrafficPage /></P>} />
          <Route path="/women-safety" element={<P><WomenSafety user={user} /></P>} />
          <Route path="/verify" element={<P><Verification /></P>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
