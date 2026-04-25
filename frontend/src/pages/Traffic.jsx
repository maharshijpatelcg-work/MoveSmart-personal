// MoveSmart — Traffic & Navigation Page (Google Maps Integration)
// Features: Real-time traffic layer, directions, route optimization, ETA
import { useState, useEffect, useCallback, useRef } from 'react';
import { APIProvider, Map, useMap, useMapsLibrary, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Navigation, Clock, MapPin, RotateCcw, Fuel, AlertTriangle, Layers, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateVehicles, updateVehiclePositions } from '../data/simulatedVehicles';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const DEFAULT_CENTER = { lat: 23.0225, lng: 72.5714 }; // Ahmedabad

function TrafficMap({ origin, destination, showTraffic }) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const trafficLayerRef = useRef(null);

  // Traffic layer
  useEffect(() => {
    if (!map) return;
    if (showTraffic) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = new google.maps.TrafficLayer();
      }
      trafficLayerRef.current.setMap(map);
    } else if (trafficLayerRef.current) {
      trafficLayerRef.current.setMap(null);
    }
  }, [map, showTraffic]);

  // Directions
  useEffect(() => {
    if (!map || !routesLib || !origin || !destination) return;
    const service = new routesLib.DirectionsService();
    const renderer = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: { strokeColor: '#1A73E8', strokeWeight: 5, strokeOpacity: 0.8 },
    });
    setDirectionsRenderer(renderer);

    service.route({
      origin, destination,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    }, (result, status) => {
      if (status === 'OK') {
        renderer.setDirections(result);
        const leg = result.routes[0].legs[0];
        setRouteInfo({
          distance: leg.distance.text,
          duration: leg.duration.text,
          durationInTraffic: leg.duration_in_traffic?.text || leg.duration.text,
          startAddress: leg.start_address,
          endAddress: leg.end_address,
          steps: leg.steps.length,
          alternatives: result.routes.length - 1,
        });
      } else {
        console.error('Directions request failed due to ' + status);
        toast.error(`Could not calculate route: ${status}. Please check Google Maps API permissions.`);
      }
    });

    return () => renderer?.setMap(null);
  }, [map, routesLib, origin, destination]);

  return routeInfo ? (
    <div className="traffic-route-info">
      <div className="traffic-route-info__row"><MapPin size={14} /><span>{routeInfo.startAddress}</span></div>
      <div className="traffic-route-info__row"><MapPin size={14} /><span>{routeInfo.endAddress}</span></div>
      <div className="traffic-route-info__stats">
        <div><Navigation size={14} /><strong>{routeInfo.distance}</strong></div>
        <div><Clock size={14} /><strong>{routeInfo.duration}</strong></div>
        <div><Fuel size={14} /><strong>{routeInfo.steps} steps</strong></div>
      </div>
      {routeInfo.alternatives > 0 && (
        <p className="traffic-alt-note">
          <AlertTriangle size={12} /> {routeInfo.alternatives} alternative route(s) available
        </p>
      )}
    </div>
  ) : null;
}

export default function TrafficPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [activeOrigin, setActiveOrigin] = useState(null);
  const [activeDest, setActiveDest] = useState(null);
  const [showTraffic, setShowTraffic] = useState(true);
  const [recentSearches, setRecentSearches] = useState([
    { from: 'Satellite, Ahmedabad', to: 'SG Highway, Ahmedabad' },
    { from: 'Vastrapur, Ahmedabad', to: 'Gujarat University' },
    { from: 'Maninagar', to: 'Naroda, Ahmedabad' },
  ]);
  const [vehicles, setVehicles] = useState(() => generateVehicles());

  // Simulate vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) => updateVehiclePositions(prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!origin || !destination) {
      toast.error('Please enter both origin and destination');
      return;
    }
    setActiveOrigin(origin);
    setActiveDest(destination);
    setRecentSearches(prev => [{ from: origin, to: destination }, ...prev.slice(0, 4)]);
    toast.success('Route calculated!', { style: { background: '#162231', color: '#E8EDF2', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' } });
  };

  const useRecent = (search) => {
    setOrigin(search.from);
    setDestination(search.to);
    setActiveOrigin(search.from);
    setActiveDest(search.to);
  };

  // Fallback if no API key
  if (!API_KEY || API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return (
      <section className="traffic-page" id="traffic-page">
        <div className="traffic-header animate-in">
          <h1><Navigation size={28} /> Traffic & Navigation</h1>
          <p>Powered by <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" style={{color: 'var(--accent)'}}>Google Maps</a></p>
        </div>
        <div className="traffic-no-key animate-in">
          <div className="traffic-no-key__icon">🗺️</div>
          <h2>Google Maps API Key Required</h2>
          <p>To enable real-time traffic data and route optimization, add your Google Maps API key:</p>
          <div className="traffic-no-key__steps">
            <div className="traffic-no-key__step">
              <span>1</span>
              <div><strong>Get API Key</strong><p>Visit <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer">Google Cloud Console</a></p></div>
            </div>
            <div className="traffic-no-key__step">
              <span>2</span>
              <div><strong>Enable APIs</strong><p>Enable Maps JavaScript API & Directions API</p></div>
            </div>
            <div className="traffic-no-key__step">
              <span>3</span>
              <div><strong>Add to .env</strong><code>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code></div>
            </div>
            <div className="traffic-no-key__step">
              <span>4</span>
              <div><strong>Restart Server</strong><p>Run <code>npm run dev</code> again</p></div>
            </div>
          </div>
          <div className="traffic-demo-features">
            <h3>Features Available with API Key:</h3>
            <div className="traffic-demo-grid">
              <div className="traffic-demo-card"><Layers size={20} /><span>Real-Time Traffic Layer</span></div>
              <div className="traffic-demo-card"><Navigation size={20} /><span>Turn-by-Turn Directions</span></div>
              <div className="traffic-demo-card"><Clock size={20} /><span>ETA with Traffic</span></div>
              <div className="traffic-demo-card"><RotateCcw size={20} /><span>Alternative Routes</span></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="traffic-page" id="traffic-page">
      <div className="traffic-header animate-in">
        <h1><Navigation size={28} /> Traffic & Navigation</h1>
        <p>Real-time traffic data powered by <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" style={{color: 'var(--accent)'}}>Google Maps</a></p>
      </div>

      <div className="traffic-layout">
        {/* Controls Panel */}
        <div className="traffic-controls animate-in">
          <form onSubmit={handleSearch} className="traffic-form">
            <div className="form-group">
              <label htmlFor="traffic-origin">Origin</label>
              <input autoComplete="off" id="traffic-origin" type="text" placeholder="Enter starting point" value={origin} onChange={e => setOrigin(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="traffic-dest">Destination</label>
              <input autoComplete="off" id="traffic-dest" type="text" placeholder="Enter destination" value={destination} onChange={e => setDestination(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn--primary" style={{width: '100%', justifyContent: 'center'}}>
              <Search size={16} /> Get Directions
            </button>
          </form>

          <div className="traffic-toggle">
            <span>Traffic Layer</span>
            <button className={`toggle-switch${showTraffic ? ' active' : ''}`} onClick={() => setShowTraffic(!showTraffic)}>
              <span className="toggle-switch__thumb"></span>
            </button>
          </div>

          <div className="traffic-recent">
            <h4>Recent Searches</h4>
            {recentSearches.map((s, i) => (
              <button key={i} className="traffic-recent__item" onClick={() => useRecent(s)}>
                <Navigation size={14} />
                <div><span>{s.from}</span><span>→ {s.to}</span></div>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="traffic-map-container animate-in">
          <APIProvider apiKey={API_KEY}>
            <Map defaultCenter={DEFAULT_CENTER} defaultZoom={12} mapId="movesmart-traffic" className="traffic-gmap"
              gestureHandling="greedy" disableDefaultUI={false} zoomControl={true} streetViewControl={false} mapTypeControl={false}>
              <TrafficMap origin={activeOrigin} destination={activeDest} showTraffic={showTraffic} />
              
              {/* Render vehicles on the traffic map */}
              {vehicles.map((v) => {
                const color = v.status === 'on-time' ? '#00E676' : v.status === 'delayed' ? '#FFB74D' : '#FF5252';
                const bg = v.type === 'bus' ? '#1A73E8' : '#A78BFA';
                return (
                  <AdvancedMarker key={v.id} position={v.position}>
                    <div className="vehicle-marker-wrapper" style={{ transform: 'translate(0, -50%)', pointerEvents: 'none' }}>
                      <div className="vehicle-marker" style={{ '--marker-bg': bg, '--status-color': color, transform: 'scale(0.8)' }}>
                        <div className="vehicle-marker__pulse"></div>
                        <div className="vehicle-marker__icon">{v.type === 'bus' ? '🚍' : '🛺'}</div>
                        <div className="vehicle-marker__status"></div>
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        </div>
      </div>
    </section>
  );
}
