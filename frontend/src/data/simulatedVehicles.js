// MoveSmart — Simulated Vehicle Data & Movement Engine
// Provides realistic vehicle tracking without external APIs

const AHMEDABAD_CENTER = { lat: 23.0225, lng: 72.5714 };

// Predefined routes across Ahmedabad
const ROUTE_PATHS = [
  {
    id: 'R1',
    name: 'SG Highway Express',
    type: 'bus',
    color: '#1A73E8',
    path: [
      { lat: 23.0300, lng: 72.5070 },
      { lat: 23.0290, lng: 72.5170 },
      { lat: 23.0280, lng: 72.5270 },
      { lat: 23.0270, lng: 72.5370 },
      { lat: 23.0260, lng: 72.5470 },
      { lat: 23.0250, lng: 72.5570 },
      { lat: 23.0240, lng: 72.5670 },
      { lat: 23.0230, lng: 72.5770 },
    ],
  },
  {
    id: 'R2',
    name: 'Ashram Road Line',
    type: 'bus',
    color: '#00C6FF',
    path: [
      { lat: 23.0400, lng: 72.5700 },
      { lat: 23.0350, lng: 72.5710 },
      { lat: 23.0300, lng: 72.5720 },
      { lat: 23.0250, lng: 72.5714 },
      { lat: 23.0200, lng: 72.5710 },
      { lat: 23.0150, lng: 72.5700 },
      { lat: 23.0100, lng: 72.5690 },
    ],
  },
  {
    id: 'R3',
    name: 'CG Road Shuttle',
    type: 'auto',
    color: '#A78BFA',
    path: [
      { lat: 23.0225, lng: 72.5600 },
      { lat: 23.0230, lng: 72.5650 },
      { lat: 23.0235, lng: 72.5700 },
      { lat: 23.0230, lng: 72.5750 },
      { lat: 23.0225, lng: 72.5800 },
      { lat: 23.0220, lng: 72.5850 },
    ],
  },
  {
    id: 'R4',
    name: 'Maninagar Express',
    type: 'bus',
    color: '#00E676',
    path: [
      { lat: 23.0050, lng: 72.5900 },
      { lat: 23.0080, lng: 72.5850 },
      { lat: 23.0110, lng: 72.5800 },
      { lat: 23.0140, lng: 72.5750 },
      { lat: 23.0170, lng: 72.5700 },
      { lat: 23.0200, lng: 72.5650 },
      { lat: 23.0225, lng: 72.5614 },
    ],
  },
  {
    id: 'R5',
    name: 'Satellite Connector',
    type: 'auto',
    color: '#FFB74D',
    path: [
      { lat: 23.0350, lng: 72.5050 },
      { lat: 23.0330, lng: 72.5150 },
      { lat: 23.0310, lng: 72.5250 },
      { lat: 23.0290, lng: 72.5350 },
      { lat: 23.0270, lng: 72.5450 },
      { lat: 23.0250, lng: 72.5550 },
    ],
  },
  {
    id: 'R6',
    name: 'Vastrapur Loop',
    type: 'bus',
    color: '#FF6B6B',
    path: [
      { lat: 23.0380, lng: 72.5280 },
      { lat: 23.0360, lng: 72.5350 },
      { lat: 23.0340, lng: 72.5420 },
      { lat: 23.0320, lng: 72.5490 },
      { lat: 23.0300, lng: 72.5560 },
      { lat: 23.0280, lng: 72.5630 },
      { lat: 23.0260, lng: 72.5700 },
    ],
  },
  {
    id: 'R7',
    name: 'Naroda Link',
    type: 'bus',
    color: '#E040FB',
    path: [
      { lat: 23.0700, lng: 72.6100 },
      { lat: 23.0600, lng: 72.6050 },
      { lat: 23.0500, lng: 72.5950 },
      { lat: 23.0400, lng: 72.5850 },
      { lat: 23.0300, lng: 72.5750 },
      { lat: 23.0225, lng: 72.5714 },
    ],
  },
  {
    id: 'R8',
    name: 'Airport Rapid',
    type: 'auto',
    color: '#40C4FF',
    path: [
      { lat: 23.0770, lng: 72.6340 },
      { lat: 23.0650, lng: 72.6200 },
      { lat: 23.0550, lng: 72.6050 },
      { lat: 23.0450, lng: 72.5900 },
      { lat: 23.0350, lng: 72.5800 },
      { lat: 23.0225, lng: 72.5714 },
    ],
  },
];

// Generate initial vehicle states
const generateVehicles = () =>
  ROUTE_PATHS.map((route, idx) => ({
    id: `V${idx + 1}`,
    name: `${route.type === 'bus' ? 'Bus' : 'Auto'} ${route.id}`,
    route: route,
    routeName: route.name,
    type: route.type,
    driver: DRIVERS[idx % DRIVERS.length],
    capacity: route.type === 'bus' ? 45 : 6,
    occupancy: Math.floor(Math.random() * (route.type === 'bus' ? 40 : 5)) + 1,
    speed: route.type === 'bus' ? 25 + Math.random() * 15 : 15 + Math.random() * 20,
    status: Math.random() > 0.15 ? 'on-time' : 'delayed',
    pathIndex: Math.floor(Math.random() * (route.path.length - 1)),
    pathProgress: Math.random(),
    position: { ...route.path[0] },
    lastUpdated: new Date(),
  }));

const DRIVERS = [
  { name: 'Rajesh Kumar', rating: 4.8, trips: 1247 },
  { name: 'Amit Shah', rating: 4.9, trips: 2103 },
  { name: 'Priya Patel', rating: 4.7, trips: 891 },
  { name: 'Vikram Singh', rating: 4.6, trips: 1534 },
  { name: 'Neha Sharma', rating: 4.9, trips: 762 },
  { name: 'Arjun Reddy', rating: 4.5, trips: 1891 },
  { name: 'Kavita Joshi', rating: 4.8, trips: 1023 },
  { name: 'Suresh Nair', rating: 4.7, trips: 1456 },
];

// Interpolate between two points
const lerp = (a, b, t) => a + (b - a) * t;

// Update vehicle positions along their routes
export const updateVehiclePositions = (vehicles) =>
  vehicles.map((v) => {
    const path = v.route.path;
    let { pathIndex, pathProgress } = v;
    const speed = 0.008 + Math.random() * 0.012; // movement speed
    pathProgress += speed;

    if (pathProgress >= 1) {
      pathProgress = 0;
      pathIndex = (pathIndex + 1) % (path.length - 1);
    }

    const from = path[pathIndex];
    const to = path[(pathIndex + 1) % path.length];

    return {
      ...v,
      pathIndex,
      pathProgress,
      position: {
        lat: lerp(from.lat, to.lat, pathProgress),
        lng: lerp(from.lng, to.lng, pathProgress),
      },
      speed: v.type === 'bus' ? 25 + Math.random() * 15 : 15 + Math.random() * 20,
      occupancy: Math.max(1, v.occupancy + Math.floor(Math.random() * 3) - 1),
      status: Math.random() > 0.1 ? 'on-time' : 'delayed',
      lastUpdated: new Date(),
    };
  });

// Calculate ETA in minutes
export const calculateETA = (vehicle) => {
  const remainingStops = vehicle.route.path.length - vehicle.pathIndex - 1;
  const baseTime = remainingStops * (vehicle.type === 'bus' ? 4 : 3);
  const variance = Math.floor(Math.random() * 3) - 1;
  return Math.max(1, baseTime + variance);
};

export { AHMEDABAD_CENTER, ROUTE_PATHS, generateVehicles };
