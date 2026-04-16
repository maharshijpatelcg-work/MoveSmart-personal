import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import useStore from '../store/useStore';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login, signup } = useStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      login({ name: formData.name || 'Maharshi Patel', email: formData.email });
    } else {
      signup({ name: formData.name, email: formData.email });
    }
  };

  const handleSocialLogin = (provider) => {
    login({ name: 'Maharshi Patel', email: `maharshi@${provider}.com` });
  };

  return (
    <div className="login-page" id="login-screen">
      {/* Hero */}
      <div className="login-hero">
        <div className="login-hero-icon">🚀</div>
        <h1>MoveSmart</h1>
        <p>Your intelligent mobility companion</p>
      </div>

      {/* Form */}
      <div className="login-form-container">
        {/* Toggle */}
        <div className="login-toggle">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {mode === 'signup' && (
            <div className="form-group animate-fade-in-up">
              <label className="form-label">Full Name</label>
              <div className="form-input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  id="input-name"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                id="input-email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                id="input-password"
              />
            </div>
            {mode === 'login' && (
              <span className="forgot-link">Forgot Password?</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" id="login-submit-btn">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">or continue with</div>

        {/* Social Login */}
        <div className="social-buttons">
          <button className="social-btn" onClick={() => handleSocialLogin('google')} id="google-login-btn">
            <span className="social-icon">🔵</span>
            Google
          </button>
          <button className="social-btn" onClick={() => handleSocialLogin('github')} id="github-login-btn">
            <span className="social-icon">⚫</span>
            GitHub
          </button>
        </div>

        {/* Trust */}
        <div className="trust-badges">
          <div className="trust-badge">
            <span>🔒</span>
            <span>Secure</span>
          </div>
          <div className="trust-badge">
            <span>🛡️</span>
            <span>Private</span>
          </div>
          <div className="trust-badge">
            <span>⚡</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
}
