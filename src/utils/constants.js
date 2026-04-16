// MoveSmart — App Constants

export const APP_NAME = 'MoveSmart';
export const APP_TAGLINE = 'Smart • Safe • Scalable Mobility';

export const ONBOARDING_SLIDES = [
  {
    id: 1,
    icon: '📍',
    title: 'Real-Time Tracking',
    description: 'Track your ride live with pinpoint accuracy. Know exactly where your vehicle is at every moment.',
    color: '#1A73E8',
  },
  {
    id: 2,
    icon: '🧭',
    title: 'Smart Routes',
    description: 'AI-powered routing finds the fastest, safest path for you — saving time and fuel.',
    color: '#00C853',
  },
  {
    id: 3,
    icon: '🛡️',
    title: 'Stay Safe',
    description: 'One-tap SOS with instant location sharing. Your safety is our top priority, day or night.',
    color: '#FF6D00',
  },
];

export const QUICK_ACTIONS = [
  { id: 'track', icon: 'MapPin', label: 'Track', color: '#1A73E8', route: '/tracking' },
  { id: 'routes', icon: 'Route', label: 'Routes', color: '#00C853', route: '/routes' },
  { id: 'sos', icon: 'ShieldAlert', label: 'SOS', color: '#FF1744', route: '/safety' },
  { id: 'ai', icon: 'Bot', label: 'AI Help', color: '#7C4DFF', route: null },
];

export const NAV_ITEMS = [
  { id: 'home', icon: 'Home', label: 'Home', route: '/dashboard' },
  { id: 'tracking', icon: 'MapPin', label: 'Track', route: '/tracking' },
  { id: 'routes', icon: 'Route', label: 'Routes', route: '/routes' },
  { id: 'safety', icon: 'Shield', label: 'Safety', route: '/safety' },
  { id: 'profile', icon: 'User', label: 'Profile', route: '/profile' },
];

export const VEHICLE_STATUSES = {
  ON_TIME: { label: 'On Time', color: '#00C853', bg: '#E8F5E9' },
  DELAYED: { label: 'Delayed', color: '#FFB300', bg: '#FFF8E1' },
  ARRIVED: { label: 'Arrived', color: '#1A73E8', bg: '#E3F2FD' },
  CANCELLED: { label: 'Cancelled', color: '#FF1744', bg: '#FFEBEE' },
};

export const DEFAULT_MAP_CENTER = { lat: 23.0225, lng: 72.5714 }; // Ahmedabad
export const DEFAULT_MAP_ZOOM = 14;
