// MoveSmart — Mock Data Service

export const mockUser = {
  id: 'usr_001',
  name: 'Maharshi Patel',
  email: 'maharshi@movesmart.app',
  avatar: null,
  phone: '+91 98765 43210',
  joinedDate: '2026-01-15',
  totalTrips: 147,
  totalDistance: 2340,
  safetyScore: 96,
};

export const mockVehicleStatus = {
  id: 'veh_001',
  vehicleName: 'City Express — Route 7',
  vehicleNumber: 'GJ-01-AB-1234',
  driverName: 'Rajesh Kumar',
  driverRating: 4.8,
  status: 'ON_TIME',
  eta: '12 min',
  currentSpeed: 35,
  lastUpdated: new Date().toISOString(),
  position: { lat: 23.0300, lng: 72.5800 },
};

export const mockRoutePoints = [
  { lat: 23.0225, lng: 72.5714 },
  { lat: 23.0240, lng: 72.5730 },
  { lat: 23.0260, lng: 72.5750 },
  { lat: 23.0280, lng: 72.5770 },
  { lat: 23.0300, lng: 72.5800 },
  { lat: 23.0320, lng: 72.5820 },
  { lat: 23.0340, lng: 72.5840 },
  { lat: 23.0360, lng: 72.5850 },
  { lat: 23.0380, lng: 72.5870 },
  { lat: 23.0400, lng: 72.5900 },
];

export const mockRoutes = [
  {
    id: 'route_1',
    name: 'Via SG Highway',
    distance: '12.4 km',
    duration: '28 min',
    traffic: 'Moderate',
    safetyScore: 92,
    recommended: true,
    color: '#1A73E8',
  },
  {
    id: 'route_2',
    name: 'Via Ashram Road',
    distance: '14.1 km',
    duration: '35 min',
    traffic: 'Heavy',
    safetyScore: 88,
    recommended: false,
    color: '#FFB300',
  },
  {
    id: 'route_3',
    name: 'Via Ring Road',
    distance: '16.2 km',
    duration: '24 min',
    traffic: 'Light',
    safetyScore: 95,
    recommended: false,
    color: '#00C853',
  },
];

export const mockNotifications = [
  {
    id: 'notif_1',
    type: 'arrival',
    title: 'Vehicle Arriving',
    message: 'Your City Express is 2 minutes away from the pickup point.',
    time: new Date(Date.now() - 2 * 60000).toISOString(),
    read: false,
    icon: '🚌',
  },
  {
    id: 'notif_2',
    type: 'delay',
    title: 'Route Delay Alert',
    message: 'Traffic congestion on SG Highway. Expected delay: 8 minutes.',
    time: new Date(Date.now() - 15 * 60000).toISOString(),
    read: false,
    icon: '⚠️',
  },
  {
    id: 'notif_3',
    type: 'safety',
    title: 'Safety Check-In',
    message: 'Night mode activated. Your live location is being shared with emergency contacts.',
    time: new Date(Date.now() - 30 * 60000).toISOString(),
    read: true,
    icon: '🛡️',
  },
  {
    id: 'notif_4',
    type: 'route',
    title: 'Faster Route Found',
    message: 'AI detected a 5-minute faster route via Ring Road. Would you like to switch?',
    time: new Date(Date.now() - 45 * 60000).toISOString(),
    read: true,
    icon: '🧭',
  },
  {
    id: 'notif_5',
    type: 'arrival',
    title: 'Trip Completed',
    message: 'You have reached Science City. Total trip time: 24 min.',
    time: new Date(Date.now() - 120 * 60000).toISOString(),
    read: true,
    icon: '✅',
  },
  {
    id: 'notif_6',
    type: 'safety',
    title: 'Emergency Contact Added',
    message: 'Priya Sharma has been added to your emergency contacts.',
    time: new Date(Date.now() - 24 * 3600000).toISOString(),
    read: true,
    icon: '👤',
  },
];

export const mockRecentTrips = [
  {
    id: 'trip_1',
    from: 'Navrangpura',
    to: 'Science City',
    date: 'Today, 9:15 AM',
    duration: '24 min',
    distance: '8.2 km',
    status: 'completed',
  },
  {
    id: 'trip_2',
    from: 'Vastrapur Lake',
    to: 'Ahmedabad Railway Station',
    date: 'Yesterday, 6:30 PM',
    duration: '32 min',
    distance: '11.5 km',
    status: 'completed',
  },
  {
    id: 'trip_3',
    from: 'IIM Ahmedabad',
    to: 'Sabarmati Ashram',
    date: 'Apr 14, 8:00 AM',
    duration: '18 min',
    distance: '6.8 km',
    status: 'completed',
  },
];

export const mockSavedRoutes = [
  { id: 'sr_1', name: 'Home → College', from: 'Navrangpura', to: 'LD Engineering', time: '22 min' },
  { id: 'sr_2', name: 'Home → Office', from: 'Navrangpura', to: 'SG Highway', time: '35 min' },
  { id: 'sr_3', name: 'Weekend Route', from: 'Home', to: 'Kankaria Lake', time: '28 min' },
];

export const mockEmergencyContacts = [
  { id: 'ec_1', name: 'Mom', phone: '+91 98765 43211', relation: 'Mother' },
  { id: 'ec_2', name: 'Priya Sharma', phone: '+91 98765 43212', relation: 'Friend' },
];

export const mockAITips = [
  "🚦 Traffic on SG Highway peaks between 9-10 AM. Leave 15 minutes early for a smoother commute!",
  "🌙 Night travel tip: Always share your live location with trusted contacts after 9 PM.",
  "⚡ Your usual route via Ashram Road has 12% more traffic today. Try the Ring Road alternative!",
  "🎯 You've maintained a 96% safety score this month. Keep it up!",
  "🧭 AI analysis: Your average commute has improved by 8 minutes since last month.",
];
