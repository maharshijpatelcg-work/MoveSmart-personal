// MoveSmart — Navbar Component
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Navigation, Shield, LayoutDashboard, GraduationCap, Car, Heart, Fingerprint, Clock } from 'lucide-react';
import NotificationCenter from './NotificationCenter.jsx';

export default function Navbar({ user, onLogout, notif }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const isActive = (path) => location.pathname === path ? 'navbar__link active' : 'navbar__link';

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="main-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-icon">🚀</span>
          <span>MoveSmart</span>
        </Link>
        <span className="navbar__clock nav-clock-responsive" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--glass-border)' }}>
          <Clock size={13} /> {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      <button
        className="navbar__toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        id="nav-toggle"
      >
        <span /><span /><span />
      </button>

      <ul className={`navbar__links${open ? ' open' : ''}`}>
        <li><Link to="/" className={isActive('/')} id="nav-home">Home</Link></li>
        {user ? (
          <>
            <li><Link to="/dashboard" className={isActive('/dashboard')} id="nav-dashboard"><LayoutDashboard size={15} /> Dashboard</Link></li>
            <li><Link to="/map" className={isActive('/map')} id="nav-map"><Map size={15} /> Map</Link></li>
            <li><Link to="/routes" className={isActive('/routes')} id="nav-routes"><Navigation size={15} /> Routes</Link></li>
            <li><Link to="/safety" className={isActive('/safety')} id="nav-safety"><Shield size={15} /> Safety</Link></li>
            <li><Link to="/school-bus" className={isActive('/school-bus')} id="nav-schoolbus"><GraduationCap size={15} /> School Bus</Link></li>
            <li><Link to="/traffic" className={isActive('/traffic')} id="nav-traffic"><Car size={15} /> Traffic</Link></li>
            <li><Link to="/women-safety" className={isActive('/women-safety')} id="nav-wsafety"><Heart size={15} /> Women Safety</Link></li>
            <li><Link to="/verify" className={isActive('/verify')} id="nav-verify"><Fingerprint size={15} /> Verify</Link></li>
            <li className="navbar__notif-li">
              <NotificationCenter {...notif} />
            </li>
            <li>
              <button className="navbar__cta" onClick={onLogout} id="nav-logout">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className={isActive('/login')} id="nav-login">Login</Link></li>
            <li><Link to="/register" className="navbar__cta" id="nav-register">Get Started</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
