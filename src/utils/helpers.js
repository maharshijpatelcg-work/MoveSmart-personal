// MoveSmart — Helper Utilities

/**
 * Get greeting based on time of day
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}

/**
 * Check if it's nighttime (for safety features)
 */
export function isNightTime() {
  const hour = new Date().getHours();
  return hour >= 21 || hour < 6;
}

/**
 * Format distance in km
 */
export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format duration in minutes/hours
 */
export function formatDuration(seconds) {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

/**
 * Format time ago
 */
export function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Generate random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Get current position using Geolocation API
 */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        // Fallback to Ahmedabad coordinates
        resolve({ lat: 23.0225, lng: 72.5714 });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

/**
 * Calculate safety score based on time
 */
export function getSafetyScore() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 20) return { score: 95, label: 'Excellent', color: '#00C853' };
  if (hour >= 20 && hour < 22) return { score: 75, label: 'Good', color: '#FFB300' };
  return { score: 55, label: 'Caution', color: '#FF6D00' };
}

/**
 * Vibrate device (for SOS)
 */
export function vibrateDevice(pattern = [200, 100, 200]) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}
