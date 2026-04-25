// MoveSmart — Simulated Analytics Data
// Generates realistic commute analytics for the dashboard

const today = new Date();

// Generate last 30 days of commute data
export const generateCommuteData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    data.push({
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      fullDate: date.toISOString(),
      commuteTime: isWeekend
        ? 0
        : Math.floor(35 + Math.random() * 30), // 35-65 min
      optimizedTime: isWeekend
        ? 0
        : Math.floor(20 + Math.random() * 20), // 20-40 min
      trips: isWeekend ? 0 : Math.floor(1 + Math.random() * 3),
    });
  }
  return data;
};

// Weekly activity data
export const generateWeeklyActivity = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    trips: i < 5 ? Math.floor(2 + Math.random() * 4) : Math.floor(Math.random() * 2),
    distance: i < 5 ? +(5 + Math.random() * 15).toFixed(1) : +(Math.random() * 5).toFixed(1),
  }));
};

// Route efficiency breakdown
export const generateRouteEfficiency = () => [
  { route: 'SG Highway Express', timeSaved: 18, percentage: 32, color: '#1A73E8' },
  { route: 'Ashram Road Line', timeSaved: 12, percentage: 21, color: '#00C6FF' },
  { route: 'CG Road Shuttle', timeSaved: 8, percentage: 14, color: '#A78BFA' },
  { route: 'Maninagar Express', timeSaved: 10, percentage: 18, color: '#00E676' },
  { route: 'Other Routes', timeSaved: 9, percentage: 15, color: '#FFB74D' },
];

// Quick stats
export const generateQuickStats = () => ({
  totalTrips: Math.floor(140 + Math.random() * 60),
  avgCommuteTime: Math.floor(28 + Math.random() * 12),
  timeSaved: Math.floor(320 + Math.random() * 180),
  safetyScore: Math.floor(85 + Math.random() * 15),
  activeRoutes: Math.floor(3 + Math.random() * 4),
  totalDistance: Math.floor(800 + Math.random() * 400),
});

// Recent activity feed items
export const generateActivityFeed = () => {
  const activities = [
    { type: 'arrival', text: 'Bus R1 arrived at SG Highway stop', time: '2 min ago', icon: 'bus' },
    { type: 'route', text: 'Route optimized: saved 8 min on Ashram Road', time: '15 min ago', icon: 'route' },
    { type: 'safety', text: 'Night mode activated automatically', time: '1 hour ago', icon: 'shield' },
    { type: 'alert', text: 'Minor delay on Maninagar Express (+5 min)', time: '1 hour ago', icon: 'alert' },
    { type: 'arrival', text: 'Auto R3 completed CG Road shuttle', time: '2 hours ago', icon: 'bus' },
    { type: 'route', text: 'New route added: Satellite Connector', time: '3 hours ago', icon: 'route' },
    { type: 'safety', text: 'Location shared with 2 trusted contacts', time: '4 hours ago', icon: 'shield' },
    { type: 'alert', text: 'Traffic cleared on SG Highway', time: '5 hours ago', icon: 'alert' },
  ];
  return activities;
};

// Monthly summary
export const generateMonthlySummary = () => ({
  tripsThisMonth: Math.floor(35 + Math.random() * 25),
  tripsLastMonth: Math.floor(30 + Math.random() * 25),
  avgTimeThisMonth: Math.floor(25 + Math.random() * 10),
  avgTimeLastMonth: Math.floor(35 + Math.random() * 15),
  safetyEventsThisMonth: Math.floor(Math.random() * 3),
  co2Saved: +(15 + Math.random() * 20).toFixed(1),
});
