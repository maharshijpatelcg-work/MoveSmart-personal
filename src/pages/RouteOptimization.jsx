import React, { useState } from 'react';
import { Search, Sparkles, Loader } from 'lucide-react';
import MapView from '../components/MapView';
import { mockRoutes } from '../services/mockData';
import { analyzeRoute } from '../services/geminiService';
import './RouteOptimization.css';

export default function RouteOptimization() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleSearch = async () => {
    if (!source.trim() || !destination.trim()) return;

    setShowResults(true);
    setIsAnalyzing(true);

    try {
      const analysis = await analyzeRoute(source, destination);
      setAiAnalysis(analysis);
    } catch {
      setAiAnalysis('Unable to analyze route at this time.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="page routes-page" id="routes-screen">
      {/* Header */}
      <div className="routes-header animate-fade-in">
        <h1>🧭 Route Optimizer</h1>
        <p>AI-powered route suggestions for your journey</p>
      </div>

      {/* Input Section */}
      <div className="routes-input-section animate-fade-in-up delay-1">
        <div className="route-input-group">
          <div className="route-input-dots">
            <div className="dot-start" />
            <div className="dot-line" />
            <div className="dot-end" />
          </div>
          <div className="route-inputs">
            <input
              type="text"
              placeholder="Enter pickup location"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onKeyDown={handleKeyDown}
              id="route-source-input"
            />
            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={handleKeyDown}
              id="route-dest-input"
            />
          </div>
        </div>
        <button
          className="btn btn-primary btn-full route-search-btn"
          onClick={handleSearch}
          disabled={!source.trim() || !destination.trim()}
          id="route-search-btn"
        >
          <Search size={18} />
          Find Best Routes
        </button>
      </div>

      {/* Map Preview */}
      {showResults && (
        <div style={{ padding: '0 var(--space-4)', marginBottom: 'var(--space-4)' }} className="animate-fade-in-up">
          <MapView
            size="small"
            showRoute={true}
            showUser={true}
            showDestination={true}
            label={`${source} → ${destination}`}
          />
        </div>
      )}

      {/* AI Analysis */}
      {showResults && (
        <div className="ai-route-analysis animate-fade-in-up">
          <div className="ai-analysis-header">
            <Sparkles size={16} />
            AI Route Analysis
          </div>
          {isAnalyzing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Analyzing route with AI...
            </div>
          ) : (
            <div className="ai-analysis-text">{aiAnalysis}</div>
          )}
        </div>
      )}

      {/* Route Results */}
      {showResults && (
        <>
          <div className="routes-results-title animate-fade-in-up">Suggested Routes</div>
          <div className="route-cards">
            {mockRoutes.map((route, i) => (
              <div
                key={route.id}
                className={`route-card ${route.recommended ? 'recommended' : ''} ${selectedRoute === route.id ? 'selected' : ''} animate-fade-in-up delay-${i + 1}`}
                onClick={() => setSelectedRoute(route.id)}
                id={`route-card-${route.id}`}
              >
                <div className="route-card-header">
                  <div className="route-card-name">
                    <span className="route-color-dot" style={{ background: route.color }} />
                    {route.name}
                  </div>
                  <span className="badge badge-info">{route.traffic}</span>
                </div>

                <div className="route-card-stats">
                  <div className="route-stat">
                    <div className="stat-value">{route.duration}</div>
                    <div className="stat-label">Duration</div>
                  </div>
                  <div className="route-stat">
                    <div className="stat-value">{route.distance}</div>
                    <div className="stat-label">Distance</div>
                  </div>
                </div>

                <div className="route-card-footer">
                  <div className="safety-score">
                    🛡️ Safety: {route.safetyScore}%
                  </div>
                  <div className="safety-bar">
                    <div
                      className="safety-bar-fill"
                      style={{
                        width: `${route.safetyScore}%`,
                        background: route.safetyScore >= 90 ? 'var(--safety-green)' : 'var(--warning-amber)',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!showResults && (
        <div className="animate-fade-in-up delay-2" style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-6)' }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)', animation: 'float 3s ease-in-out infinite' }}>
            🗺️
          </div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
            Plan Your Journey
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto' }}>
            Enter your source and destination to get AI-optimized route suggestions with safety scores.
          </p>
        </div>
      )}
    </div>
  );
}
