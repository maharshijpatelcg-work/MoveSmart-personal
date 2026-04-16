// MoveSmart — Maps Service Helpers

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

/**
 * Get Google Maps static map URL (for previews)
 */
export function getStaticMapUrl(lat, lng, zoom = 14, width = 400, height = 200) {
  if (!API_KEY) {
    return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${lng},${lat},${zoom},0/${width}x${height}?access_token=pk.placeholder`;
  }
  return `https://maps.googleapis.com/maps/api/staticmaps?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&scale=2&maptype=roadmap&style=feature:all|element:labels|visibility:on&key=${API_KEY}`;
}

/**
 * Check if Google Maps API is configured
 */
export function isMapsAvailable() {
  return !!API_KEY;
}

/**
 * Simulate vehicle movement along route points
 */
export function simulateVehicleMovement(routePoints, onUpdate, intervalMs = 2000) {
  let currentIndex = 0;

  const interval = setInterval(() => {
    if (currentIndex >= routePoints.length) {
      currentIndex = 0; // Loop back
    }

    onUpdate({
      position: routePoints[currentIndex],
      progress: ((currentIndex + 1) / routePoints.length) * 100,
      pointIndex: currentIndex,
    });

    currentIndex++;
  }, intervalMs);

  return () => clearInterval(interval);
}

/**
 * Calculate approximate distance between two points (Haversine)
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Interpolate between two points for smooth animation
 */
export function interpolatePosition(start, end, fraction) {
  return {
    lat: start.lat + (end.lat - start.lat) * fraction,
    lng: start.lng + (end.lng - start.lng) * fraction,
  };
}
