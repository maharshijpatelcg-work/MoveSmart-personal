import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, CreditCard, Image as ImageIcon, HeartPulse } from 'lucide-react';
import useStore from '../store/useStore';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    aadharCard: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    profilePic: null
  });
  const { login, signup } = useStore();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleInputChange('profilePic', e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      login({ name: formData.firstName || 'Maharshi Patel', email: formData.email });
    } else {
      signup({ 
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        aadharCard: formData.aadharCard
      });
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
            type="button"
          >
            Login
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`auth-form ${mode}`}>
          {mode === 'signup' && (
            <div className="signup-extended-fields animate-fade-in-up">
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <div className="form-input-wrapper">
                    <User className="input-icon" size={18} />
                    <input type="text" className="input-field" placeholder="First Name" required
                      value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <div className="form-input-wrapper">
                    <User className="input-icon" size={18} />
                    <input type="text" className="input-field" placeholder="Last Name" required
                      value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="form-input-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input type="tel" className="input-field" placeholder="+91 98765 43210" required
                    value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Aadhar Card Number</label>
                <div className="form-input-wrapper">
                  <CreditCard className="input-icon" size={18} />
                  <input type="text" className="input-field" placeholder="XXXX XXXX XXXX" required
                    value={formData.aadharCard} onChange={(e) => handleInputChange('aadharCard', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <div className="form-input-wrapper">
                  <MapPin className="input-icon" size={18} />
                  <input type="text" className="input-field" placeholder="Full Home Address" required
                    value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} />
                </div>
              </div>

              <div className="form-separator">Emergency & Tracking Setup</div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Emergency Contact Name</label>
                  <div className="form-input-wrapper">
                    <HeartPulse className="input-icon" size={18} />
                    <input type="text" className="input-field" placeholder="Parent/Guardian" required
                      value={formData.emergencyContact} onChange={(e) => handleInputChange('emergencyContact', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Phone</label>
                  <div className="form-input-wrapper">
                    <Phone className="input-icon" size={18} />
                    <input type="tel" className="input-field" placeholder="Phone" required
                      value={formData.emergencyPhone} onChange={(e) => handleInputChange('emergencyPhone', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Profile Picture (Pic Yourself)</label>
                <div className="file-upload-wrapper">
                  <ImageIcon size={24} className="upload-icon" />
                  <span>{formData.profilePic ? formData.profilePic.name : 'Upload your photo for ID verification'}</span>
                  <input type="file" accept="image/*" className="file-hidden-input" onChange={handleFileChange} />
                </div>
              </div>

            </div>
          )}

          {/* Standard Fields (Login + Signup) */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>
            {mode === 'login' && (
              <span className="forgot-link">Forgot Password?</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" id="login-submit-btn">
            {mode === 'login' ? 'Login' : 'Create Secure Account'}
          </button>
        </form>

        {/* Divider */}
        {mode === 'login' && (
          <>
            <div className="login-divider">or continue with</div>
            <div className="social-buttons">
              <button type="button" className="social-btn" onClick={() => handleSocialLogin('google')} id="google-login-btn">
                <span className="social-icon">🔵</span>
                Google
              </button>
              <button type="button" className="social-btn" onClick={() => handleSocialLogin('github')} id="github-login-btn">
                <span className="social-icon">⚫</span>
                GitHub
              </button>
            </div>
          </>
        )}

        {/* Trust */}
        <div className="trust-badges">
          <div className="trust-badge">
            <span>🔒</span>
            <span>Secure Data</span>
          </div>
          <div className="trust-badge">
            <span>🛡️</span>
            <span>Verified Identity</span>
          </div>
          <div className="trust-badge">
            <span>⚡</span>
            <span>Live Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
}

