// MoveSmart — Routes Management Page
import { useState, useMemo, useEffect } from 'react';
import { Trash2, Eye, Clock, MapPin, ArrowRight, Plus, X, Navigation, AlertCircle } from 'lucide-react';

const DEMO_ROUTES = [
  { id: '1', name: 'Home → Office', origin: { name: 'Satellite, Ahmedabad' }, destination: { name: 'SG Highway' }, stops: 3, distance: '12.4 km', duration: '35 min', status: 'active', savedTime: '12 min' },
  { id: '2', name: 'Home → University', origin: { name: 'Vastrapur' }, destination: { name: 'Gujarat University' }, stops: 2, distance: '5.2 km', duration: '18 min', status: 'active', savedTime: '8 min' },
  { id: '3', name: 'Office → Gym', origin: { name: 'CG Road' }, destination: { name: 'Prahladnagar' }, stops: 1, distance: '8.7 km', duration: '25 min', status: 'delayed', savedTime: '5 min' },
  { id: '4', name: 'Weekend Market', origin: { name: 'Naroda' }, destination: { name: 'Law Garden' }, stops: 4, distance: '15.3 km', duration: '42 min', status: 'inactive', savedTime: '0 min' },
];

export default function Routes() {
  const [routes, setRoutes] = useState(() => {
    try {
      const saved = localStorage.getItem('ms_routes');
      return saved ? JSON.parse(saved) : DEMO_ROUTES;
    } catch {
      return DEMO_ROUTES;
    }
  });

  useEffect(() => {
    localStorage.setItem('ms_routes', JSON.stringify(routes));
  }, [routes]);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newRoute, setNewRoute] = useState({ name: '', origin: '', destination: '', stops: '' });

  const filteredRoutes = useMemo(() => {
    if (filter === 'all') return routes;
    return routes.filter((r) => r.status === filter);
  }, [routes, filter]);

  const stats = useMemo(() => ({
    total: routes.length,
    active: routes.filter((r) => r.status === 'active').length,
    totalSaved: routes.reduce((acc, r) => acc + parseInt(r.savedTime) || 0, 0),
  }), [routes]);

  const handleCreate = (e) => {
    e.preventDefault();
    const route = {
      id: Date.now().toString(), name: newRoute.name || `Route ${routes.length + 1}`,
      origin: { name: newRoute.origin }, destination: { name: newRoute.destination },
      stops: parseInt(newRoute.stops) || 0, distance: `${(5 + Math.random() * 15).toFixed(1)} km`,
      duration: `${Math.floor(15 + Math.random() * 40)} min`, status: 'active',
      savedTime: `${Math.floor(5 + Math.random() * 15)} min`,
    };
    setRoutes((prev) => [route, ...prev]);
    setShowCreate(false);
    setNewRoute({ name: '', origin: '', destination: '', stops: '' });
  };

  const deleteRoute = (id) => setRoutes((prev) => prev.filter((r) => r.id !== id));
  const toggleStatus = (id) => {
    setRoutes((prev) => prev.map((r) => r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r));
  };

  return (
    <section className="routes-page" id="routes-page">
      <div className="routes-page__header animate-in">
        <div><h1>My Routes</h1><p>Manage your commute routes and track optimization.</p></div>
        <button className="btn btn--primary" onClick={() => setShowCreate(true)} id="create-route-btn">
          <Plus size={18} /> New Route
        </button>
      </div>

      <div className="routes-page__stats animate-in">
        <div className="routes-stat"><span className="routes-stat__number">{stats.total}</span><span className="routes-stat__label">Total Routes</span></div>
        <div className="routes-stat"><span className="routes-stat__number">{stats.active}</span><span className="routes-stat__label">Active</span></div>
        <div className="routes-stat"><span className="routes-stat__number">{stats.totalSaved} min</span><span className="routes-stat__label">Time Saved</span></div>
      </div>

      <div className="routes-page__filters animate-in">
        {['all', 'active', 'delayed', 'inactive'].map((f) => (
          <button key={f} className={`routes-filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="routes-page__grid">
        {filteredRoutes.map((route) => (
          <div key={route.id} className={`route-card route-card--${route.status} animate-in`}>
            <div className="route-card__header">
              <h3 className="route-card__name">{route.name}</h3>
              <span className={`route-card__badge route-card__badge--${route.status}`}>{route.status}</span>
            </div>
            <div className="route-card__path">
              <div className="route-card__point"><MapPin size={16} className="route-card__point-icon--origin" /><span>{route.origin.name}</span></div>
              <div className="route-card__arrow"><div className="route-card__dots"></div>{route.stops > 0 && <span className="route-card__stops">{route.stops} stops</span>}</div>
              <div className="route-card__point"><MapPin size={16} className="route-card__point-icon--dest" /><span>{route.destination.name}</span></div>
            </div>
            <div className="route-card__meta">
              <div className="route-card__meta-item"><Navigation size={14} /> {route.distance}</div>
              <div className="route-card__meta-item"><Clock size={14} /> {route.duration}</div>
              <div className="route-card__meta-item route-card__meta-item--saved"><ArrowRight size={14} /> Saved {route.savedTime}</div>
            </div>
            <div className="route-card__actions">
              <button className="route-card__action" onClick={() => toggleStatus(route.id)} title="Toggle status"><Eye size={16} /></button>
              <button className="route-card__action route-card__action--delete" onClick={() => deleteRoute(route.id)} title="Delete route"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {filteredRoutes.length === 0 && (
          <div className="routes-page__empty"><AlertCircle size={48} /><h3>No routes found</h3><p>Create a new route or change your filter.</p></div>
        )}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header"><h2>Create New Route</h2><button className="modal__close" onClick={() => setShowCreate(false)}><X size={20} /></button></div>
            <form onSubmit={handleCreate} className="modal__form">
              <div className="form-group"><label htmlFor="route-name">Route Name</label><input autoComplete="off" id="route-name" type="text" placeholder="e.g., Home → Office" value={newRoute.name} onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })} required /></div>
              <div className="form-group"><label htmlFor="route-origin">Origin</label><input autoComplete="off" id="route-origin" type="text" placeholder="Starting location" value={newRoute.origin} onChange={(e) => setNewRoute({ ...newRoute, origin: e.target.value })} required /></div>
              <div className="form-group"><label htmlFor="route-dest">Destination</label><input autoComplete="off" id="route-dest" type="text" placeholder="End location" value={newRoute.destination} onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })} required /></div>
              <div className="form-group"><label htmlFor="route-stops">Number of Stops</label><input autoComplete="off" id="route-stops" type="number" placeholder="0" min="0" max="20" value={newRoute.stops} onChange={(e) => setNewRoute({ ...newRoute, stops: e.target.value })} /></div>
              <button type="submit" className="btn btn--primary auth__btn" id="submit-route"><Plus size={18} /> Create Route</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
