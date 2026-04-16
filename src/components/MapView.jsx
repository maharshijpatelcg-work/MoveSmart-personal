import React, { useState, useEffect } from 'react';
import './MapView.css';

export default function MapView({
  size = 'small',       // 'small' | 'medium' | 'full'
  showVehicle = false,
  showRoute = true,
  showUser = true,
  showDestination = false,
  vehicleEmoji = '🚌',
  label = null,
  className = '',
}) {
  const [vehiclePos, setVehiclePos] = useState(0);

  // Animate vehicle marker
  useEffect(() => {
    if (!showVehicle) return;
    const interval = setInterval(() => {
      setVehiclePos((p) => (p >= 100 ? 0 : p + 0.5));
    }, 50);
    return () => clearInterval(interval);
  }, [showVehicle]);

  // Calculate vehicle position along a curved path
  const getVehicleStyle = () => {
    const t = vehiclePos / 100;
    // Bezier-like path
    const x = 15 + t * 65;
    const y = 70 - Math.sin(t * Math.PI) * 40;
    return { left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' };
  };

  return (
    <div className={`map-container map-${size} ${className}`}>
      <div className="map-visual">
        {/* Background grid */}
        <div className="map-grid" />

        {/* Roads */}
        <div className="map-roads">
          <div className="road road-h1" />
          <div className="road road-h2" />
          <div className="road road-h3" />
          <div className="road road-v1" />
          <div className="road road-v2" />
          <div className="road road-v3" />
        </div>

        {/* Buildings */}
        <div className="map-building" style={{ top: '15%', left: '10%', width: '30px', height: '20px' }} />
        <div className="map-building" style={{ top: '40%', left: '35%', width: '25px', height: '25px' }} />
        <div className="map-building" style={{ top: '20%', left: '65%', width: '35px', height: '18px' }} />
        <div className="map-building" style={{ top: '50%', left: '75%', width: '20px', height: '30px' }} />
        <div className="map-building" style={{ top: '70%', left: '45%', width: '28px', height: '22px' }} />

        {/* Route Line */}
        {showRoute && (
          <svg className="route-line" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              className="route-path"
              d="M 5,80 C 20,60 30,20 50,30 C 70,40 80,15 95,10"
            />
          </svg>
        )}

        {/* User Location */}
        {showUser && (
          <div className="user-marker" style={{ bottom: '18%', left: '18%' }} />
        )}

        {/* Destination */}
        {showDestination && (
          <div className="dest-marker" style={{ top: '12%', right: '15%' }}>
            <div className="dest-pin">
              <div className="dest-pin-inner" />
            </div>
          </div>
        )}

        {/* Moving Vehicle */}
        {showVehicle && (
          <div className="vehicle-marker" style={getVehicleStyle()}>
            {vehicleEmoji}
          </div>
        )}

        {/* Live label */}
        {label && (
          <div className="map-overlay">
            <span className="live-dot" />
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
