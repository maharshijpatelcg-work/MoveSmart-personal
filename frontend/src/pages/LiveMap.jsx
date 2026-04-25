// MoveSmart — Live Map Page with Real-Time Vehicle Tracking
import { useState, useEffect, useRef, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Search, Filter, Navigation, Layers, Bus, Zap, Clock, Users, ChevronDown, X, Locate } from 'lucide-react';
import { AHMEDABAD_CENTER, ROUTE_PATHS, generateVehicles, updateVehiclePositions, calculateETA } from '../data/simulatedVehicles';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Custom Polyline Component for @vis.gl/react-google-maps
function MapPolyline({ path, color }) {
  const map = useMap();
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWeight: 3,
        icons: [{
          icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
          offset: '0',
          repeat: '20px'
        }]
      });
    } else {
      polylineRef.current.setOptions({ path, strokeColor: color });
    }
    polylineRef.current.setMap(map);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, path, color]);

  return null;
}

// Custom Circle Component for @vis.gl/react-google-maps
function MapCircle({ center, radius }) {
  const map = useMap();
  const circleRef = useRef(null);

  useEffect(() => {
    if (!map) return;
    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle({
        strokeColor: '#1A73E8',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#1A73E8',
        fillOpacity: 0.08,
        center,
        radius,
      });
    } else {
      circleRef.current.setCenter(center);
      circleRef.current.setRadius(radius);
    }
    circleRef.current.setMap(map);

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
    };
  }, [map, center, radius]);

  return null;
}

export default function LiveMap() {
  const [vehicles, setVehicles] = useState(() => generateVehicles());
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(AHMEDABAD_CENTER);
  const [showRoutes, setShowRoutes] = useState(true);
  const intervalRef = useRef(null);
  const [mapZoom, setMapZoom] = useState(13);

  // Simulate vehicle movement
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVehicles((prev) => {
        const next = updateVehiclePositions(prev);
        // Automatically update selected vehicle's position if open
        setSelectedVehicle(currSel => {
          if (!currSel) return null;
          const updated = next.find(v => v.id === currSel.id);
          return updated || currSel;
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null)
      );
    }
  }, []);

  const filteredVehicles = useMemo(() => {
    let result = vehicles;
    if (filterType !== 'all') result = result.filter((v) => v.type === filterType);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) => v.name.toLowerCase().includes(q) || v.routeName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [vehicles, filterType, searchQuery]);

  const activeCount = vehicles.filter((v) => v.status === 'on-time').length;
  const delayedCount = vehicles.filter((v) => v.status === 'delayed').length;

  return (
    <section className="livemap" id="livemap-page">
      {/* Map Controls Overlay */}
      <div className="livemap__controls">
        <div className="livemap__search">
          <Search size={18} />
          <input autoComplete="off"
            type="text"
            placeholder="Search vehicles or routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="map-search"
          />
          {searchQuery && (
            <button className="livemap__search-clear" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="livemap__toolbar">
          <button
            className={`livemap__tool-btn${showFilters ? ' active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            id="map-filter-toggle"
          >
            <Filter size={16} /> Filter
          </button>
          <button
            className={`livemap__tool-btn${showRoutes ? ' active' : ''}`}
            onClick={() => setShowRoutes(!showRoutes)}
            id="map-routes-toggle"
          >
            <Layers size={16} /> Routes
          </button>
          <button
            className="livemap__tool-btn"
            onClick={() => {
              if (userLocation) {
                setMapCenter({ ...userLocation });
                setMapZoom(15);
              } else {
                setMapCenter({ ...AHMEDABAD_CENTER });
                setMapZoom(13);
              }
            }}
            id="map-locate"
          >
            <Locate size={16} /> My Location
          </button>
        </div>

        {showFilters && (
          <div className="livemap__filters">
            {['all', 'bus', 'auto'].map((type) => (
              <button
                key={type}
                className={`livemap__filter-chip${filterType === type ? ' active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? '🚐 All' : type === 'bus' ? '🚍 Buses' : '🛺 Autos'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="livemap__status-bar">
        <div className="livemap__status-item">
          <span className="livemap__status-dot livemap__status-dot--active"></span>
          {activeCount} On Time
        </div>
        <div className="livemap__status-item">
          <span className="livemap__status-dot livemap__status-dot--delayed"></span>
          {delayedCount} Delayed
        </div>
        <div className="livemap__status-item">
          <Bus size={14} /> {filteredVehicles.length} Vehicles
        </div>
      </div>

      {/* Google Map */}
      <div className="livemap__map" style={{ position: 'relative' }}>
        <APIProvider apiKey={API_KEY}>
          <Map
            center={mapCenter}
            zoom={mapZoom}
            onCenterChanged={(ev) => setMapCenter(ev.detail.center)}
            onZoomChanged={(ev) => setMapZoom(ev.detail.zoom)}
            mapId="movesmart-livemap"
            disableDefaultUI={false}
            zoomControl={true}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            gestureHandling="greedy"
            styles={[
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
              { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
              { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
              { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
              { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
              { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
              { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
              { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
              { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
              { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
              { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
              { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
              { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
              { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
              { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
            ]}
          >
            {/* Route polylines */}
            {showRoutes &&
              ROUTE_PATHS.map((route) => (
                <MapPolyline key={route.id} path={route.path} color={route.color} />
              ))}

            {/* Vehicle markers */}
            {filteredVehicles.map((v) => {
              const color = v.status === 'on-time' ? '#00E676' : v.status === 'delayed' ? '#FFB74D' : '#FF5252';
              const bg = v.type === 'bus' ? '#1A73E8' : '#A78BFA';
              return (
                <AdvancedMarker
                  key={v.id}
                  position={v.position}
                  onClick={() => {
                    setSelectedVehicle(v);
                    setMapCenter(v.position);
                    setMapZoom(15);
                  }}
                >
                  <div className="vehicle-marker-wrapper" style={{ transform: 'translate(0, -50%)' }}>
                    <div className="vehicle-marker" style={{ '--marker-bg': bg, '--status-color': color }}>
                      <div className="vehicle-marker__pulse"></div>
                      <div className="vehicle-marker__icon">{v.type === 'bus' ? '🚍' : '🛺'}</div>
                      <div className="vehicle-marker__status"></div>
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow */}
            {selectedVehicle && (
              <InfoWindow
                position={selectedVehicle.position}
                onCloseClick={() => setSelectedVehicle(null)}
                pixelOffset={[0, -22]}
                headerDisabled={true}
              >
                <div className="vpopup" style={{ color: '#0F1923', width: '220px', padding: '4px' }}>
                  <div className="vpopup__header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="vpopup__type" style={{ fontSize: '24px' }}>{selectedVehicle.type === 'bus' ? '🚍' : '🛺'}</span>
                    <div>
                      <h4 className="vpopup__name" style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{selectedVehicle.name}</h4>
                      <p className="vpopup__route" style={{ margin: 0, fontSize: '12px', color: '#666' }}>{selectedVehicle.routeName}</p>
                    </div>
                  </div>
                  <span className={`vpopup__status`} style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: selectedVehicle.status === 'on-time' ? '#E8F5E9' : '#FFF3E0',
                    color: selectedVehicle.status === 'on-time' ? '#2E7D32' : '#E65100',
                    marginBottom: '8px'
                  }}>
                    {selectedVehicle.status === 'on-time' ? 'On Time' : 'Delayed'}
                  </span>
                  <div className="vpopup__stats" style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', marginBottom: '8px' }}>
                    <div className="vpopup__stat" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} /><span>ETA: {calculateETA(selectedVehicle)} min</span></div>
                    <div className="vpopup__stat" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={12} /><span>{selectedVehicle.speed.toFixed(0)} km/h</span></div>
                    <div className="vpopup__stat" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={12} /><span>{selectedVehicle.occupancy}/{selectedVehicle.capacity}</span></div>
                  </div>
                  <div className="vpopup__driver" style={{ fontSize: '12px', borderTop: '1px solid #EEE', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>👤 {selectedVehicle.driver.name}</span>
                    <span>⭐ {selectedVehicle.driver.rating}</span>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* User location */}
            {userLocation && (
              <>
                <AdvancedMarker position={userLocation}>
                  <div className="user-location-marker" style={{ transform: 'translate(0, -50%)' }}>
                    <div className="user-loc"><div className="user-loc__pulse"></div><div className="user-loc__dot"></div></div>
                  </div>
                </AdvancedMarker>
                <MapCircle center={userLocation} radius={200} />
              </>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Vehicle List Panel */}
      <div className="livemap__panel">
        <h3 className="livemap__panel-title">
          <Navigation size={18} /> Active Vehicles
        </h3>
        <div className="livemap__vehicle-list">
          {filteredVehicles.map((v) => (
            <button
              key={v.id}
              className={`livemap__vehicle-card${selectedVehicle?.id === v.id ? ' selected' : ''}`}
              onClick={() => {
                setSelectedVehicle(v);
                setMapCenter(v.position);
                setMapZoom(15);
              }}
            >
              <span className="livemap__vehicle-icon">{v.type === 'bus' ? '🚍' : '🛺'}</span>
              <div className="livemap__vehicle-info">
                <strong>{v.name}</strong>
                <span>{v.routeName}</span>
              </div>
              <div className="livemap__vehicle-meta">
                <span className={`livemap__vehicle-status livemap__vehicle-status--${v.status}`}>
                  {v.status === 'on-time' ? 'On Time' : 'Delayed'}
                </span>
                <span className="livemap__vehicle-eta">{calculateETA(v)} min</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
