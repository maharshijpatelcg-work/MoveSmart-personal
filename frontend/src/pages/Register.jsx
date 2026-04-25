// MoveSmart — Registration Page
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Phone, MapPin, Camera, RefreshCw, CheckSquare, Square, Eye, EyeOff, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

function drawCaptcha(canvas, code) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 180;
  canvas.height = 50;
  // Background
  ctx.fillStyle = '#1E2D3D';
  ctx.fillRect(0, 0, 180, 50);
  // Noise lines
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(${Math.random()*100+100},${Math.random()*100+100},${Math.random()*100+150},0.4)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * 180, Math.random() * 50);
    ctx.lineTo(Math.random() * 180, Math.random() * 50);
    ctx.stroke();
  }
  // Noise dots
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
    ctx.fillRect(Math.random() * 180, Math.random() * 50, 2, 2);
  }
  // Text
  const colors = ['#00C6FF', '#4A9AF5', '#A78BFA', '#00E676', '#FFB74D', '#FF6B6B'];
  for (let i = 0; i < code.length; i++) {
    ctx.save();
    ctx.font = `${600 + Math.random() * 200} ${22 + Math.random() * 6}px Inter, monospace`;
    ctx.fillStyle = colors[i % colors.length];
    ctx.translate(20 + i * 25, 30 + Math.random() * 10);
    ctx.rotate((Math.random() - 0.5) * 0.4);
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }
}

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', address: '', mobile: '',
    password: '', confirmPassword: '',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [isHuman, setIsHuman] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshCaptcha = useCallback(() => {
    const code = generateCaptcha();
    setCaptchaCode(code);
    setCaptchaInput('');
    setTimeout(() => drawCaptcha(captchaRef.current, code), 50);
  }, []);

  useEffect(() => { refreshCaptcha(); }, [refreshCaptcha]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    setProfilePic(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!form.firstName.trim() || !form.lastName.trim()) return setError('First and last name are required');
    if (!form.address.trim()) return setError('Address is required');
    if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\s/g, ''))) return setError('Enter a valid 10-digit Indian mobile number');
    if (!profilePic) return setError('Profile photo is required');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (captchaInput.toLowerCase() !== captchaCode.toLowerCase()) { refreshCaptcha(); return setError('CAPTCHA code is incorrect'); }
    if (!isHuman) return setError('Please confirm you are not a robot');

    setLoading(true);
    try {
      const email = `${form.firstName.toLowerCase()}.${form.lastName.toLowerCase()}@movesmart.app`;
      const newUser = {
        id: `user_${Date.now()}`,
        name: `${form.firstName} ${form.lastName}`,
        email: email,
        phone: form.mobile,
        address: form.address,
        password: form.password, // Storing password in localStorage for demo purposes
        avatar: profilePreview
      };

      const storedUsers = JSON.parse(localStorage.getItem('ms_users') || '[]');
      
      if (storedUsers.some(u => u.email === email)) {
        throw new Error('An account with this generated email already exists');
      }

      storedUsers.push(newUser);
      localStorage.setItem('ms_users', JSON.stringify(storedUsers));

      toast.success('Account created! Welcome to MoveSmart 🎉', { style: { background: '#162231', color: '#00E676', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '12px' } });
      onLogin(newUser, `token_${Date.now()}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleOAuthLogin = (provider) => {
    // Mock OAuth Login for Prototype
    setError('');
    setLoading(true);
    setTimeout(() => {
      onLogin({
        firstName: 'Guest',
        lastName: 'User',
        email: `guest@${provider}.com`,
        mobile: '1234567890',
        address: 'OAuth Login',
        profilePic: 'https://i.pravatar.cc/150?u=oauth'
      }, `token_oauth_${Date.now()}`);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <section className="auth" id="register-page">
      <div className="auth__card auth__card--wide">
        <div className="auth__card-header">
          <span className="auth__logo">🚀</span>
          <h1 className="auth__title">Create Account</h1>
          <p className="auth__subtitle">Join MoveSmart for smarter, safer commuting</p>
        </div>

        {error && <div className="auth__error">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          {/* Profile Photo */}
          <div className="register-photo">
            <div className="register-photo__preview" onClick={() => fileRef.current?.click()}>
              {profilePreview ? (
                <img src={profilePreview} alt="Profile" />
              ) : (
                <div className="register-photo__empty"><Camera size={24} /><span>Upload Photo</span></div>
              )}
              <div className="register-photo__overlay"><Upload size={16} /></div>
            </div>
            <input autoComplete="off" ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} hidden />
            <span className="register-photo__hint">Passport size • Max 2MB</span>
          </div>

          {/* Name Row */}
          <div className="register-row">
            <div className="form-group">
              <label htmlFor="reg-firstname"><User size={14} /> First Name</label>
              <input autoComplete="off" id="reg-firstname" name="firstName" type="text" placeholder="Maharshi" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="reg-lastname"><User size={14} /> Last Name</label>
              <input autoComplete="off" id="reg-lastname" name="lastName" type="text" placeholder="Patel" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="reg-address"><MapPin size={14} /> Address</label>
            <input autoComplete="off" id="reg-address" name="address" type="text" placeholder="123, Satellite Road, Ahmedabad, Gujarat" value={form.address} onChange={handleChange} required />
          </div>

          {/* Mobile */}
          <div className="form-group">
            <label htmlFor="reg-mobile"><Phone size={14} /> Mobile Number</label>
            <div className="input-with-prefix">
              <span className="input-prefix">+91</span>
              <input autoComplete="off" id="reg-mobile" name="mobile" type="tel" placeholder="98765 43210" maxLength="10" value={form.mobile} onChange={handleChange} required />
            </div>
          </div>

          {/* Password Row */}
          <div className="register-row">
            <div className="form-group">
              <label htmlFor="reg-password"><Lock size={14} /> Password</label>
              <div className="input-with-icon">
                <input autoComplete="off" id="reg-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
                <button type="button" className="input-icon-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirm"><Lock size={14} /> Confirm Password</label>
              <div className="input-with-icon">
                <input autoComplete="off" id="reg-confirm" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} required />
                <button type="button" className="input-icon-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* CAPTCHA */}
          <div className="register-captcha">
            <label>🔒 Security Verification</label>
            <div className="register-captcha__row">
              <canvas ref={captchaRef} className="register-captcha__canvas"></canvas>
              <button type="button" className="register-captcha__refresh" onClick={refreshCaptcha} title="Refresh CAPTCHA">
                <RefreshCw size={16} />
              </button>
            </div>
            <input autoComplete="off" type="text" placeholder="Enter the code above" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} required className="register-captcha__input" />
          </div>

          {/* I am not a robot */}
          <div className="register-robot" onClick={() => setIsHuman(!isHuman)}>
            <button type="button" className={`register-robot__checkbox${isHuman ? ' checked' : ''}`}>
              {isHuman ? <CheckSquare size={20} /> : <Square size={20} />}
            </button>
            <span>I am not a robot</span>
            <div className="register-robot__badge">
              <svg viewBox="0 0 24 24" width="28" height="28"><path fill="#4A9AF5" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <div><small>MoveSmart</small><small>Security</small></div>
            </div>
          </div>

          <button type="submit" className="btn btn--primary auth__btn" disabled={loading} id="register-submit">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth__divider">Or continue with</div>

        <div className="auth__socials">
          <button type="button" className="auth__social-btn" onClick={() => handleOAuthLogin('google')}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="auth__social-btn" onClick={() => handleOAuthLogin('linkedin')}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#0A66C2"/>
            </svg>
            LinkedIn
          </button>
          <button type="button" className="auth__social-btn" onClick={() => handleOAuthLogin('github')}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="currentColor"/>
            </svg>
            GitHub
          </button>
        </div>

        <p className="auth__footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </section>
  );
}
