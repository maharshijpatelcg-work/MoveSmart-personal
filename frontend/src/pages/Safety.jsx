// MoveSmart — Safety Hub Page
import { useState, useRef, useCallback, useEffect } from 'react';
import { Shield, Phone, MapPin, Moon, Plus, X, Trash2, UserPlus, AlertTriangle, CheckCircle, Clock, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_CONTACTS = [
  { id: '1', name: 'Mom', phone: '+91 98765 43210' },
  { id: '2', name: 'Dad', phone: '+91 98765 43211' },
];

export default function Safety({ user }) {
  const [contacts, setContacts] = useState(() => {
    try { const s = localStorage.getItem('ms_contacts'); return s ? JSON.parse(s) : INITIAL_CONTACTS; } catch { return INITIAL_CONTACTS; }
  });
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [sosActive, setSosActive] = useState(false);
  const [sosHolding, setSosHolding] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);
  const [locationSharing, setLocationSharing] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [safetyEvents, setSafetyEvents] = useState([
    { id: 'e1', type: 'night', text: 'Night mode auto-activated', time: Date.now() - 3600000 },
    { id: 'e2', type: 'share', text: 'Location shared with Mom', time: Date.now() - 7200000 },
    { id: 'e3', type: 'sos', text: 'SOS test alert triggered', time: Date.now() - 86400000 },
  ]);

  const sosTimerRef = useRef(null);
  const sosIntervalRef = useRef(null);

  useEffect(() => { localStorage.setItem('ms_contacts', JSON.stringify(contacts)); }, [contacts]);

  // Auto night mode
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) setNightMode(true);
  }, []);

  const safetyScore = (() => {
    let score = 50;
    if (contacts.length >= 2) score += 20;
    if (locationSharing) score += 15;
    if (nightMode) score += 15;
    return Math.min(100, score);
  })();

  // SOS hold logic
  const startSOS = useCallback(() => {
    setSosHolding(true);
    setSosProgress(0);
    let p = 0;
    sosIntervalRef.current = setInterval(() => {
      p += 2;
      setSosProgress(p);
      if (p >= 100) {
        clearInterval(sosIntervalRef.current);
        setSosActive(true);
        setSosHolding(false);
        setSafetyEvents((prev) => [{ id: `e_${Date.now()}`, type: 'sos', text: 'SOS Emergency Alert triggered!', time: Date.now() }, ...prev]);
        toast.error('🚨 SOS Alert Sent! Emergency contacts notified.', { duration: 5000, style: { background: '#2d0a0a', color: '#FF5252', border: '1px solid #FF5252', borderRadius: '12px' } });
      }
    }, 60);
  }, []);

  const cancelSOS = useCallback(() => {
    clearInterval(sosIntervalRef.current);
    setSosHolding(false);
    setSosProgress(0);
  }, []);

  const deactivateSOS = () => {
    setSosActive(false);
    toast.success('SOS Alert deactivated.', { style: { background: '#162231', color: '#00E676', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '12px' } });
  };

  const toggleLocationSharing = () => {
    setLocationSharing(!locationSharing);
    if (!locationSharing) {
      setSafetyEvents((prev) => [{ id: `e_${Date.now()}`, type: 'share', text: 'Live location sharing activated', time: Date.now() }, ...prev]);
      toast.success('📡 Location sharing activated', { style: { background: '#162231', color: '#E8EDF2', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' } });
    }
  };

  const addContact = (e) => {
    e.preventDefault();
    if (newContact.name && newContact.phone) {
      setContacts((prev) => [...prev, { id: Date.now().toString(), ...newContact }]);
      setNewContact({ name: '', phone: '' });
      setShowAddContact(false);
      toast.success('Contact added!', { style: { background: '#162231', color: '#E8EDF2', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' } });
    }
  };

  const removeContact = (id) => setContacts((prev) => prev.filter((c) => c.id !== id));

  const formatTime = (ts) => {
    const diff = Date.now() - ts;
    const min = Math.floor(diff / 60000);
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <section className="safety-page" id="safety-page">
      <div className="safety-page__header animate-in">
        <div><h1><Shield size={28} /> Safety Hub</h1><p>Your safety dashboard — SOS, contacts, night mode, and more.</p></div>
      </div>

      {/* Safety Score */}
      <div className="safety-score-card animate-in">
        <div className="safety-score-ring" style={{ '--score': safetyScore }}>
          <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none" stroke={safetyScore >= 80 ? '#00E676' : safetyScore >= 50 ? '#FFB74D' : '#FF5252'} strokeWidth="8" strokeDasharray={`${safetyScore * 3.39} 339.3`} strokeLinecap="round" transform="rotate(-90 60 60)" className="safety-score-circle" />
          </svg>
          <span className="safety-score-value">{safetyScore}</span>
        </div>
        <div className="safety-score-info"><h3>Safety Score</h3><p>Add more contacts and enable features to improve your score.</p></div>
      </div>

      <div className="safety-page__grid">
        {/* SOS Button */}
        <div className={`safety-section safety-section--sos animate-in${sosActive ? ' sos-active' : ''}`}>
          <h2><AlertTriangle size={20} /> Emergency SOS</h2>
          <p>Hold the button for 3 seconds to trigger an emergency alert.</p>
          {sosActive ? (
            <div className="sos-activated">
              <div className="sos-activated__pulse"></div>
              <p className="sos-activated__text">🚨 SOS ACTIVE — Contacts notified!</p>
              <button className="btn btn--ghost" onClick={deactivateSOS} id="sos-deactivate">Deactivate SOS</button>
            </div>
          ) : (
            <div className="sos-btn-container">
              <button className={`sos-btn${sosHolding ? ' holding' : ''}`} onMouseDown={startSOS} onMouseUp={cancelSOS} onMouseLeave={cancelSOS} onTouchStart={startSOS} onTouchEnd={cancelSOS} id="sos-trigger">
                <svg className="sos-btn__progress" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,82,82,0.3)" strokeWidth="6" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#FF5252" strokeWidth="6" strokeDasharray={`${sosProgress * 3.39} 339.3`} strokeLinecap="round" transform="rotate(-90 60 60)" /></svg>
                <span className="sos-btn__label">SOS</span>
              </button>
              <span className="sos-btn__hint">Hold to activate</span>
            </div>
          )}
        </div>

        {/* Location Sharing */}
        <div className="safety-section animate-in">
          <h2><MapPin size={20} /> Live Location Sharing</h2>
          <p>Share your real-time location with trusted contacts during trips.</p>
          <div className="safety-toggle-row">
            <span>{locationSharing ? 'Sharing Active' : 'Sharing Off'}</span>
            <button className={`toggle-switch${locationSharing ? ' active' : ''}`} onClick={toggleLocationSharing} id="location-toggle">
              <span className="toggle-switch__thumb"></span>
            </button>
          </div>
          {locationSharing && <div className="safety-active-badge"><Share2 size={14} /> Sharing with {contacts.length} contacts</div>}
        </div>

        {/* Night Mode */}
        <div className="safety-section animate-in">
          <h2><Moon size={20} /> Night Travel Mode</h2>
          <p>Enhanced monitoring for late-night commutes after 8 PM.</p>
          <div className="safety-toggle-row">
            <span>{nightMode ? 'Night Mode Active' : 'Night Mode Off'}</span>
            <button className={`toggle-switch${nightMode ? ' active' : ''}`} onClick={() => setNightMode(!nightMode)} id="night-toggle">
              <span className="toggle-switch__thumb"></span>
            </button>
          </div>
          {nightMode && <div className="safety-active-badge"><Moon size={14} /> Enhanced monitoring active</div>}
        </div>

        {/* Trusted Contacts */}
        <div className="safety-section safety-section--contacts animate-in">
          <div className="safety-section__head"><h2><Phone size={20} /> Trusted Contacts</h2>
            <button className="btn-icon" onClick={() => setShowAddContact(true)} id="add-contact-btn"><UserPlus size={18} /></button>
          </div>
          <div className="contacts-list">
            {contacts.map((c) => (
              <div key={c.id} className="contact-card">
                <div className="contact-card__avatar">{c.name.charAt(0).toUpperCase()}</div>
                <div className="contact-card__info"><strong>{c.name}</strong><span>{c.phone}</span></div>
                <button className="contact-card__delete" onClick={() => removeContact(c.id)}><Trash2 size={14} /></button>
              </div>
            ))}
            {contacts.length === 0 && <p className="contacts-empty">No trusted contacts. Add someone you trust.</p>}
          </div>
          {showAddContact && (
            <form onSubmit={addContact} className="contact-form">
              <input autoComplete="off" type="text" placeholder="Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} required />
              <input autoComplete="off" type="tel" placeholder="Phone number" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} required />
              <div className="contact-form__actions">
                <button type="submit" className="btn btn--primary btn--sm"><Plus size={14} /> Add</button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowAddContact(false)}><X size={14} /> Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Safety Timeline */}
      <div className="safety-timeline animate-in">
        <h2><Clock size={20} /> Recent Safety Events</h2>
        <div className="safety-timeline__list">
          {safetyEvents.slice(0, 8).map((ev) => (
            <div key={ev.id} className={`safety-event safety-event--${ev.type}`}>
              <div className="safety-event__dot"></div>
              <div className="safety-event__content"><p>{ev.text}</p><span>{formatTime(ev.time)}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
