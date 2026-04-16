import React, { useEffect, useState, useMemo } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2200);
    const complete = setTimeout(() => onComplete(), 2700);
    return () => {
      clearTimeout(timer);
      clearTimeout(complete);
    };
  }, [onComplete]);

  // Generate particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 3,
      color: ['#1A73E8', '#00C853', '#29B6F6', '#7C4DFF'][Math.floor(Math.random() * 4)],
    }));
  }, []);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`} id="splash-screen">
      {/* Floating Particles */}
      <div className="splash-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="splash-particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: '-10px',
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Logo & Title */}
      <div className="splash-logo-container">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="splash-logo-glow" />
          <div className="splash-logo-icon">🚀</div>
        </div>
        <h1 className="splash-title">MoveSmart</h1>
        <p className="splash-tagline">Smart • Safe • Scalable Mobility</p>
      </div>

      {/* Loading Bar */}
      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
    </div>
  );
}
