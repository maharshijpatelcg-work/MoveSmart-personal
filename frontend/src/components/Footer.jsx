// MoveSmart — Footer Component
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <div className="footer__col footer__col--brand">
          <div className="footer__brand">🚀 <span>MoveSmart</span></div>
          <p className="footer__tagline">Smart • Safe • Scalable Urban Mobility</p>
          <p className="footer__desc">Transforming how cities move with real-time tracking, AI-powered routing, and safety-first infrastructure.</p>
        </div>

        <div className="footer__col">
          <h4>Product</h4>
          <ul>
            <li><Link to="/map">Live Map</Link></li>
            <li><Link to="/routes">Routes</Link></li>
            <li><Link to="/dashboard">Analytics</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Safety</h4>
          <ul>
            <li><Link to="/safety">SOS Alerts</Link></li>
            <li><Link to="/safety">Night Mode</Link></li>
            <li><Link to="/safety">Trusted Contacts</Link></li>
            <li><Link to="/safety">Live Sharing</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="mailto:maharshi.j.patel.cg@gmail.com">Email</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} MoveSmart. All rights reserved.</p>
        <p>Made with ❤️ for smarter urban mobility</p>
      </div>
    </footer>
  );
}
