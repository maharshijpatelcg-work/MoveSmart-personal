// MoveSmart — Home Page
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

const FEATURES = [
  { icon: '📍', title: 'Real-Time Tracking', text: 'Accurate live tracking of vehicles with geolocation updates every 3 seconds for complete visibility.' },
  { icon: '🧭', title: 'Smart Routing Engine', text: 'Dynamic route optimization using traffic data and predictive algorithms to cut commute times by up to 40%.' },
  { icon: '🛡️', title: 'Safety-First System', text: 'SOS alerts, live location sharing, trusted contacts, and night travel monitoring — safety built-in.' },
  { icon: '🔔', title: 'Instant Notifications', text: 'Real-time push alerts for delays, arrivals, route changes, and safety events.' },
  { icon: '📊', title: 'Analytics Dashboard', text: 'Deep insights into route efficiency, fleet performance, and user commute patterns.' },
  { icon: '🌙', title: 'Night Travel Mode', text: 'Enhanced monitoring and safety features for late-night commuters with 24/7 coverage.' },
];

const STEPS = [
  { num: '01', title: 'Sign Up', text: 'Create your account in seconds — email, name, and you\'re ready to go.' },
  { num: '02', title: 'Set Routes', text: 'Add your daily commute routes and preferred stops for smart tracking.' },
  { num: '03', title: 'Track & Go', text: 'Get real-time updates, optimised routes, and safety features on every trip.' },
];

const SAFETY = [
  { icon: '🚨', title: 'SOS Alerts', text: 'One-tap emergency alerts that instantly notify your trusted contacts and authorities.' },
  { icon: '📡', title: 'Live Sharing', text: 'Share your real-time location with family during every commute.' },
  { icon: '👨‍👩‍👧', title: 'Trusted Contacts', text: 'Manage a network of trusted people who receive automatic updates.' },
  { icon: '🌙', title: 'Night Monitor', text: 'Enhanced safety protocols that kick in automatically after sunset.' },
];

const STATS = [
  { num: '40%', label: 'Faster Commutes' },
  { num: '99.9%', label: 'Uptime' },
  { num: '3s', label: 'Update Interval' },
  { num: '24/7', label: 'Safety Coverage' },
];

export default function Home() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        size: `${3 + Math.random() * 4}px`,
        duration: `${6 + Math.random() * 6}s`,
      })),
    []
  );

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero" id="hero">
        <div className="hero__particles">
          {particles.map((p) => (
            <span
              key={p.id}
              className="hero__particle"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        <div className="hero__content animate-in">
          <div className="hero__badge">🚀 Next-Gen Urban Mobility</div>
          <h1 className="hero__title">
            Move <span className="hero__title-gradient">Smarter</span>,<br />
            Move <span className="hero__title-gradient">Safer</span>
          </h1>
          <p className="hero__subtitle">
            Real-time tracking, AI-powered routing, and a safety-first ecosystem
            that transforms how cities move — for students, professionals, and everyone in between.
          </p>
          <div className="hero__actions">
            <Link to="/register" className="btn btn--primary" id="hero-cta">
              Get Started Free →
            </Link>
            <a href="#features" className="btn btn--ghost" id="hero-learn">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="stats" id="stats">
        {STATS.map((s) => (
          <div key={s.label} className="stat animate-in">
            <div className="stat__number">{s.num}</div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <section className="section" id="features">
        <div className="section__header">
          <span className="section__label">Features</span>
          <h2 className="section__title">Everything You Need to Commute Smarter</h2>
          <p className="section__desc">
            A complete mobility ecosystem designed from the ground up for safety, speed, and visibility.
          </p>
        </div>
        <div className="features">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature animate-in">
              <div className="feature__icon">{f.icon}</div>
              <h3 className="feature__title">{f.title}</h3>
              <p className="feature__text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" id="how-it-works">
        <div className="section__header">
          <span className="section__label">How It Works</span>
          <h2 className="section__title">Up and Running in Minutes</h2>
          <p className="section__desc">
            Three simple steps to smarter, safer commuting — no complex setup required.
          </p>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div key={s.num} className="step animate-in">
              <div className="step__number">{s.num}</div>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Safety ── */}
      <section className="section" id="safety">
        <div className="section__header">
          <span className="section__label">Safety First</span>
          <h2 className="section__title">Your Safety, Our Priority</h2>
          <p className="section__desc">
            Multiple layers of safety features that work around the clock to keep you protected.
          </p>
        </div>
        <div className="safety-grid">
          {SAFETY.map((s) => (
            <div key={s.title} className="safety-card animate-in">
              <div className="safety-card__icon">{s.icon}</div>
              <h3 className="safety-card__title">{s.title}</h3>
              <p className="safety-card__text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" id="cta">
        <h2 className="cta-section__title">
          Ready to Move <span className="hero__title-gradient">Smarter</span>?
        </h2>
        <p className="cta-section__text">
          Join thousands of commuters already experiencing safer, faster, and smarter urban mobility.
        </p>
        <Link to="/register" className="btn btn--primary" id="bottom-cta">
          Create Free Account →
        </Link>
      </section>
    </>
  );
}
