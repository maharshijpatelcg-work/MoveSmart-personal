// MoveSmart — Login Page
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

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

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const captchaRef = useRef(null);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const refreshCaptcha = useCallback(() => {
    const code = generateCaptcha();
    setCaptchaCode(code);
    setCaptchaInput('');
    setTimeout(() => drawCaptcha(captchaRef.current, code), 50);
  }, []);

  useEffect(() => { refreshCaptcha(); }, [refreshCaptcha]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (captchaInput.toLowerCase() !== captchaCode.toLowerCase()) {
      setError('CAPTCHA verification failed. Please try again.');
      refreshCaptcha();
      return;
    }

    setLoading(true);

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      const storedUsers = JSON.parse(localStorage.getItem('ms_users') || '[]');
      const user = storedUsers.find(u => u.email === email && u.password === password);

      if (user) {
        // Remove password before storing in session/state
        const userObj = { ...user };
        delete userObj.password;
        
        onLogin(userObj, `token_${Date.now()}`);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
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
    <section className="auth" id="login-page">
      <div className="auth__card animate-in">
        <h1 className="auth__title">Welcome Back</h1>
        <p className="auth__subtitle">Sign in to your MoveSmart account</p>

        {error && <div className="auth__error" id="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input autoComplete="off"
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input autoComplete="off"
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="register-captcha">
            <label>Security Verification</label>
            <div className="register-captcha__row">
              <canvas ref={captchaRef} className="register-captcha__canvas"></canvas>
              <button type="button" className="register-captcha__refresh" onClick={refreshCaptcha} title="Refresh CAPTCHA">
                <RefreshCw size={20} />
              </button>
            </div>
            <input autoComplete="off"
              type="text"
              className="register-captcha__input"
              placeholder="Enter the characters above"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn--primary auth__btn" id="login-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
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
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </section>
  );
}
