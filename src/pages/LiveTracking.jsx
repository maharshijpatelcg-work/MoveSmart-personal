import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crosshair, Phone, MessageSquare, Share2 } from 'lucide-react';
import MapView from '../components/MapView';
import { mockVehicleStatus } from '../services/mockData';
import { VEHICLE_STATUSES } from '../utils/constants';
import './LiveTracking.css';

export default function LiveTracking() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(35);
  const vehicle = mockVehicleStatus;
  const status = VEHICLE_STATUSES[vehicle.status];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 95 ? 35 : p + 0.5));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page tracking-page" id="tracking-screen">
      {/* Map */}
      <div className="tracking-map-wrapper">
        <button className="tracking-back" onClick={() => navigate('/dashboard')} aria-label="Go back">
          <ArrowLeft size={20} />
        </button>

        <MapView
          size="medium"
          showVehicle={true}
          showRoute={true}
          showUser={true}
          showDestination={true}
          vehicleEmoji="🚌"
          label="LIVE TRACKING"
        />

        <button className="tracking-center-btn" aria-label="Center map">
          <Crosshair size={22} />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="tracking-sheet">
        <div className="sheet-handle" />

        {/* ETA */}
        <div className="tracking-eta-bar">
          <div className="eta-info">
            <h2>{vehicle.eta}</h2>
            <p>Estimated arrival time</p>
          </div>
          <div className="eta-status">
            <span className="badge" style={{ background: status.bg, color: status.color }}>
              ● {status.label}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="tracking-progress">
          <div className="tracking-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Driver */}
        <div className="driver-card">
          <div className="driver-avatar">👨‍✈️</div>
          <div className="driver-info">
            <h4>{vehicle.driverName}</h4>
            <p>
              <span className="driver-rating">★ {vehicle.driverRating}</span>
              {' · '}{vehicle.vehicleNumber}
            </p>
          </div>
          <div className="driver-actions">
            <button className="driver-action-btn" aria-label="Call">
              <Phone size={16} />
            </button>
            <button className="driver-action-btn" aria-label="Message">
              <MessageSquare size={16} />
            </button>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="vehicle-details-row">
          <div className="vehicle-detail">
            <div className="detail-value">{vehicle.currentSpeed}</div>
            <div className="detail-label">km/h Speed</div>
          </div>
          <div className="vehicle-detail">
            <div className="detail-value">3.2</div>
            <div className="detail-label">km Away</div>
          </div>
          <div className="vehicle-detail">
            <div className="detail-value">4</div>
            <div className="detail-label">Stops Left</div>
          </div>
        </div>

        {/* Share button */}
        <button
          className="btn btn-outline btn-full tracking-share-btn"
          onClick={() => {}}
        >
          <Share2 size={16} /> Share Live Location
        </button>
      </div>
    </div>
  );
}
