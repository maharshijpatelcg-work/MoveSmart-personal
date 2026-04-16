import React, { useEffect, useState, useMemo } from 'react';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2500);
    const complete = setTimeout(() => onComplete(), 3100);
    return () => {
      clearTimeout(timer);
      clearTimeout(complete);
    };
  }, [onComplete]);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: Math.random() * 4 + 4,
      color: ['#1A73E8', '#00C853', '#29B6F6', '#7C4DFF', '#FF6D00'][Math.floor(Math.random() * 5)],
    }));
  }, []);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`} id="splash-screen">
      {/* Gradient Orbs */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />
      <div className="splash-orb splash-orb-3" />

      {/* Grid */}
      <div className="splash-grid" />

      {/* Particles */}
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
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="splash-logo-container">
        <div className="splash-logo-wrapper">
          {/* Orbital Rings */}
          <div className="splash-rings">
            <div className="splash-ring" />
            <div className="splash-ring" />
            <div className="splash-ring" />
          </div>
          <div className="splash-logo-glow" />
          <div className="splash-logo-icon">🚀</div>
        </div>

        <h1 className="splash-title">MoveSmart</h1>
        <p className="splash-tagline">Smart • Safe • Scalable Mobility</p>
      </div>

      {/* Version */}
      <div className="splash-version">v1.0.0</div>

      {/* Loader */}
      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
    </div>
  );
}
