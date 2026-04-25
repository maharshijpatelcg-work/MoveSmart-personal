// MoveSmart — School Bus Tracking Module (Inspired by RideZum CMX)
// Features: Real-time school bus tracking, parent visibility, child check-in/out,
// driver profiles, route schedules, delay notifications
import { useState, useEffect, useRef, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Bus, GraduationCap, Clock, MapPin, Phone, Star, Bell, CheckCircle, AlertTriangle, Users, ChevronRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

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

// Map Icons Configuration Handled Inline in Google Maps

const SCHOOL_BUSES = [
  {
    id: 'SB1', name: 'Bus #101 — Morning Route', school: 'Delhi Public School',
    driver: { name: 'Rajesh Kumar', phone: '+91 98765 43210', rating: 4.9, trips: 2340, photo: '👨‍✈️' },
    status: 'on-time', capacity: 42, occupied: 28, eta: 8,
    students: [
      { name: 'Aryan Patel', grade: '5th', stop: 'Satellite Rd', checkedIn: true },
      { name: 'Priya Shah', grade: '3rd', stop: 'SG Highway', checkedIn: true },
      { name: 'Karan Mehta', grade: '7th', stop: 'Vastrapur', checkedIn: false },
    ],
    route: [
      { lat: 23.045, lng: 72.510, name: 'Bus Depot' },
      { lat: 23.040, lng: 72.520, name: 'Satellite Rd Stop' },
      { lat: 23.035, lng: 72.535, name: 'SG Highway Stop' },
      { lat: 23.030, lng: 72.550, name: 'Vastrapur Stop' },
      { lat: 23.025, lng: 72.565, name: 'Bodakdev Stop' },
      { lat: 23.020, lng: 72.575, name: 'DPS Campus' },
    ],
    position: { lat: 23.037, lng: 72.528 }, currentStopIdx: 2,
    schedule: { departure: '7:15 AM', arrival: '8:00 AM' },
  },
  {
    id: 'SB2', name: 'Bus #205 — South Route', school: 'St. Xavier\'s School',
    driver: { name: 'Anita Sharma', phone: '+91 98765 43211', rating: 4.8, trips: 1890, photo: '👩‍✈️' },
    status: 'delayed', capacity: 38, occupied: 32, eta: 15,
    students: [
      { name: 'Riya Gupta', grade: '4th', stop: 'Maninagar', checkedIn: true },
      { name: 'Aditya Joshi', grade: '6th', stop: 'Isanpur', checkedIn: true },
    ],
    route: [
      { lat: 23.005, lng: 72.590, name: 'South Depot' },
      { lat: 23.010, lng: 72.585, name: 'Maninagar Stop' },
      { lat: 23.015, lng: 72.577, name: 'Isanpur Stop' },
      { lat: 23.020, lng: 72.570, name: 'Naranpura Stop' },
      { lat: 23.025, lng: 72.560, name: 'St. Xavier\'s Campus' },
    ],
    position: { lat: 23.012, lng: 72.582 }, currentStopIdx: 1,
    schedule: { departure: '7:00 AM', arrival: '7:45 AM' },
  },
  {
    id: 'SB3', name: 'Bus #312 — West Route', school: 'Udgam School',
    driver: { name: 'Vikram Singh', phone: '+91 98765 43212', rating: 4.7, trips: 1560, photo: '👨‍✈️' },
    status: 'on-time', capacity: 45, occupied: 35, eta: 5,
    students: [
      { name: 'Meera Desai', grade: '8th', stop: 'Thaltej', checkedIn: true },
      { name: 'Rohan Trivedi', grade: '5th', stop: 'Jodhpur', checkedIn: true },
    ],
    route: [
      { lat: 23.050, lng: 72.495, name: 'West Depot' },
      { lat: 23.045, lng: 72.505, name: 'Thaltej Stop' },
      { lat: 23.040, lng: 72.515, name: 'Jodhpur Stop' },
      { lat: 23.035, lng: 72.528, name: 'Udgam Campus' },
    ],
    position: { lat: 23.042, lng: 72.512 }, currentStopIdx: 1,
    schedule: { departure: '7:30 AM', arrival: '8:10 AM' },
  },
];

export default function SchoolBus() {
  const [buses, setBuses] = useState(SCHOOL_BUSES);
  const [selectedBus, setSelectedBus] = useState(null);
  const [activeTab, setActiveTab] = useState('track');

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => {
        const route = bus.route;
        const nextIdx = Math.min(bus.currentStopIdx + 1, route.length - 1);
        const from = route[bus.currentStopIdx];
        const to = route[nextIdx];
        const jitter = () => (Math.random() - 0.5) * 0.001;
        return {
          ...bus,
          position: {
            lat: bus.position.lat + (to.lat - from.lat) * 0.05 + jitter(),
            lng: bus.position.lng + (to.lng - from.lng) * 0.05 + jitter(),
          },
          eta: Math.max(1, bus.eta - Math.random() * 0.3),
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const onTimeCount = buses.filter(b => b.status === 'on-time').length;
  const totalStudents = buses.reduce((a, b) => a + b.occupied, 0);

  return (
    <section className="schoolbus-page" id="schoolbus-page">
      <div className="schoolbus-header animate-in">
        <div>
          <h1><GraduationCap size={28} /> School Bus Tracking</h1>
          <p>Real-time visibility for parents — inspired by <a href="https://www.ridezum.com" target="_blank" rel="noreferrer" style={{color: 'var(--accent)'}}>RideZum CMX</a></p>
        </div>
        <div className="schoolbus-header__stats">
          <div className="sb-stat"><span className="sb-stat__num">{buses.length}</span><span>Active Buses</span></div>
          <div className="sb-stat"><span className="sb-stat__num">{totalStudents}</span><span>Students</span></div>
          <div className="sb-stat"><span className="sb-stat__num">{Math.round(onTimeCount / buses.length * 100)}%</span><span>On-Time</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="schoolbus-tabs animate-in">
        {['track', 'schedule', 'students'].map(tab => (
          <button key={tab} className={`sb-tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'track' ? '🗺️ Live Track' : tab === 'schedule' ? '📅 Schedule' : '👨‍🎓 Students'}
          </button>
        ))}
      </div>

      {activeTab === 'track' && (
        <div className="schoolbus-track animate-in">
          <div className="schoolbus-map-container">
            <APIProvider apiKey={API_KEY}>
              <Map 
                defaultCenter={{lat: 23.030, lng: 72.545}} 
                defaultZoom={13} 
                className="schoolbus-map" 
                mapId="movesmart-schoolbus" 
                disableDefaultUI={false} 
                zoomControl={true} 
                mapTypeControl={false} 
                streetViewControl={false} 
                fullscreenControl={false} 
                gestureHandling="greedy"
              >
                {buses.map(bus => (
                  <span key={bus.id}>
                    <MapPolyline path={bus.route.map(s => ({ lat: s.lat, lng: s.lng }))} color="#F59E0B" />
                    {bus.route.map((stop, i) => (
                      <AdvancedMarker key={`${bus.id}-stop-${i}`} position={{ lat: stop.lat, lng: stop.lng }}>
                        <div style={{width:'16px',height:'16px',borderRadius:'50%',background:'#F59E0B',border:'3px solid #fff',boxShadow:'0 2px 8px rgba(0,0,0,.3)'}}></div>
                      </AdvancedMarker>
                    ))}
                    <AdvancedMarker position={bus.position} onClick={() => setSelectedBus(bus)}>
                      <div className="vehicle-marker-wrapper" style={{ transform: 'translate(0, -50%)' }}>
                        <div className="vehicle-marker" style={{ '--marker-bg': '#F59E0B', '--status-color': bus.status === 'on-time' ? '#00E676' : '#FF5252' }}>
                          <div className="vehicle-marker__pulse"></div>
                          <div className="vehicle-marker__icon">🚌</div>
                          <div className="vehicle-marker__status"></div>
                        </div>
                      </div>
                    </AdvancedMarker>
                    {selectedBus && selectedBus.id === bus.id && (
                      <InfoWindow position={bus.position} onCloseClick={() => setSelectedBus(null)} pixelOffset={[0, -22]} headerDisabled={true}>
                        <div className="vpopup" style={{ color: '#0F1923', width: '280px', padding: '4px' }}>
                          <div className="vpopup__header">
                            <span className="vpopup__type">🚌</span>
                            <div><h4 className="vpopup__name" style={{margin:0, fontSize:'16px'}}>{bus.name}</h4><p className="vpopup__route" style={{margin:0}}>{bus.school}</p></div>
                            <span className={`vpopup__status vpopup__status--${bus.status}`}>{bus.status === 'on-time' ? 'On Time' : 'Delayed'}</span>
                          </div>
                          <div className="vpopup__stats" style={{display: 'flex', gap: '12px', marginTop:'8px'}}>
                            <div className="vpopup__stat" style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Clock size={14} /><span>ETA: {Math.round(bus.eta)} min</span></div>
                            <div className="vpopup__stat" style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Users size={14} /><span>{bus.occupied}/{bus.capacity}</span></div>
                          </div>
                          <div className="vpopup__driver" style={{display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee'}}>
                            <span>{bus.driver.photo} {bus.driver.name}</span><span>⭐ {bus.driver.rating}</span>
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </span>
                ))}
              </Map>
            </APIProvider>
          </div>

          {/* Bus Cards */}
          <div className="schoolbus-cards">
            {buses.map(bus => (
              <div key={bus.id} className={`sb-card${selectedBus?.id === bus.id ? ' selected' : ''} sb-card--${bus.status}`} onClick={() => setSelectedBus(bus)}>
                <div className="sb-card__top">
                  <span className="sb-card__icon">🚌</span>
                  <div className="sb-card__info"><strong>{bus.name}</strong><span>{bus.school}</span></div>
                  <span className={`sb-card__badge sb-card__badge--${bus.status}`}>{bus.status === 'on-time' ? 'On Time' : 'Delayed'}</span>
                </div>
                <div className="sb-card__meta">
                  <span><Clock size={13} /> ETA: {Math.round(bus.eta)} min</span>
                  <span><Users size={13} /> {bus.occupied}/{bus.capacity}</span>
                  <span><Star size={13} /> {bus.driver.rating}</span>
                </div>
                <div className="sb-card__driver">
                  <span>{bus.driver.photo} {bus.driver.name}</span>
                  <a href={`tel:${bus.driver.phone}`} className="sb-card__call"><Phone size={14} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="schoolbus-schedule animate-in">
          {buses.map(bus => (
            <div key={bus.id} className="sb-schedule-card">
              <div className="sb-schedule-card__header"><h3>🚌 {bus.name}</h3><span>{bus.school}</span></div>
              <div className="sb-schedule-card__times">
                <div><span className="sb-schedule-label">Departure</span><strong>{bus.schedule.departure}</strong></div>
                <ChevronRight size={20} />
                <div><span className="sb-schedule-label">Arrival</span><strong>{bus.schedule.arrival}</strong></div>
              </div>
              <div className="sb-schedule-card__stops">
                {bus.route.map((stop, i) => (
                  <div key={i} className={`sb-stop${i <= bus.currentStopIdx ? ' sb-stop--passed' : ''}`}>
                    <div className="sb-stop__dot"></div>
                    <span>{stop.name}</span>
                    {i === bus.currentStopIdx && <span className="sb-stop__current">Current</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'students' && (
        <div className="schoolbus-students animate-in">
          {buses.map(bus => (
            <div key={bus.id} className="sb-students-card">
              <h3>🚌 {bus.name} — {bus.school}</h3>
              <div className="sb-students-list">
                {bus.students.map((s, i) => (
                  <div key={i} className="sb-student">
                    <div className="sb-student__avatar">{s.name.charAt(0)}</div>
                    <div className="sb-student__info"><strong>{s.name}</strong><span>Grade {s.grade} • {s.stop}</span></div>
                    <span className={`sb-student__status${s.checkedIn ? ' checked' : ''}`}>
                      {s.checkedIn ? <><CheckCircle size={14} /> Checked In</> : <><AlertTriangle size={14} /> Pending</>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
