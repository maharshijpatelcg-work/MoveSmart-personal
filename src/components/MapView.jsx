import React, { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, PolylineF } from '@react-google-maps/api';
import './MapView.css';

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
];

export default function MapView({
  size = 'small',       // 'small' | 'medium' | 'full'
  showVehicle = false,
  showRoute = true,
  showUser = true,
  showDestination = false,
  vehicleEmoji = '🏃',
  label = null,
  className = '',
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || ''
  });

  const center = useMemo(() => ({ lat: 40.7580, lng: -73.9855 }), []); // Times Square
  const destination = useMemo(() => ({ lat: 40.7712, lng: -73.9740 }), []); // Central Park
  
  // High-density points for smoother marker animation
  const routePath = useMemo(() => [
    { lat: 40.7580, lng: -73.9855 },
    { lat: 40.7588, lng: -73.9835 },
    { lat: 40.7596, lng: -73.9815 },
    { lat: 40.7605, lng: -73.9795 },
    { lat: 40.7614, lng: -73.9776 },
    { lat: 40.7627, lng: -73.9753 },
    { lat: 40.7640, lng: -73.9730 },
    { lat: 40.7660, lng: -73.9770 },
    { lat: 40.7680, lng: -73.9810 },
    { lat: 40.7696, lng: -73.9775 },
    { lat: 40.7712, lng: -73.9740 }
  ], []);

  const [vehiclePosIndex, setVehiclePosIndex] = useState(0);

  // Animate vehicle marker along the route if enabled
  useEffect(() => {
    if (!showVehicle || !isLoaded) return;
    const interval = setInterval(() => {
      setVehiclePosIndex((prev) => (prev + 1 >= routePath.length ? 0 : prev + 1));
    }, 1000); // Update every 1s
    return () => clearInterval(interval);
  }, [showVehicle, isLoaded, routePath]);

  const mapOptions = useMemo(() => ({
    styles: darkMapStyle,
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: size === 'small' ? 'none' : 'auto' // Prevent scrolling small previews
  }), [size]);

  if (!apiKey) {
    return (
      <div className={`map-container map-${size} ${className}`}>
        <div className="map-fallback">
          <h3>Missing Maps Configuration</h3>
          <p>Please configure your Google Maps API key in standard <code>.env</code> file.</p>
          <code>VITE_GOOGLE_MAPS_KEY=YOUR_API_KEY</code>
        </div>
      </div>
    );
  }

  if (loadError) return <div className={`map-container map-${size}`}>Error loading map...</div>;
  if (!isLoaded) return <div className={`map-container map-${size}`}>Loading Maps...</div>;

  return (
    <div className={`map-container map-${size} ${className}`}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={size === 'full' ? 15 : 14}
        options={mapOptions}
      >
        {/* Route Line */}
        {showRoute && (
          <PolylineF
            path={routePath}
            options={{
              strokeColor: '#00C853',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}

        {/* User Location */}
        {showUser && (
          <MarkerF
            position={center}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#1A73E8',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
        )}

        {/* Destination Location */}
        {showDestination && (
          <MarkerF
            position={destination}
          />
        )}

        {/* Moving Vehicle */}
        {showVehicle && (
          <MarkerF
            position={routePath[vehiclePosIndex]}
            label={{
              text: vehicleEmoji,
              fontSize: '24px',
            }}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E',
              scaledSize: new window.google.maps.Size(1, 1)
            }}
          />
        )}
      </GoogleMap>

      {/* Live label overlay */}
      {label && (
        <div className="map-overlay">
          <span className="live-dot" />
          {label}
        </div>
      )}
    </div>
  );
}
