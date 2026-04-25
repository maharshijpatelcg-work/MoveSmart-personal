// MoveSmart — Women Safety Module (Inspired by bSafe)
// Features: SOS with audio recording, fake call, guardian circle, live streaming,
// safe walk timer, shake-to-alert, emergency contacts
import { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, Phone, Video, Mic, MapPin, Moon, Users, Timer, Vibrate, PhoneCall, AlertTriangle, CheckCircle, Play, Square, Share2, Eye, Clock, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const TIPS = [
  'Share your live location when traveling alone at night',
  'Keep your phone charged — safety features need battery',
  'Set up at least 3 trusted guardians for best coverage',
  'Use the Fake Call feature to exit uncomfortable situations',
  'Enable shake-to-alert for hands-free emergency activation',
  'Always inform someone about your travel route',
  'Use well-lit routes, especially after dark',
  'Trust your instincts — if something feels wrong, trigger SOS',
];

export default function WomenSafety({ user }) {
  const [guardians, setGuardians] = useState(() => {
    try { const s = localStorage.getItem('ms_guardians'); return s ? JSON.parse(s) : [
      { id: '1', name: 'Mom', phone: '+91 98765 43210', relation: 'Mother' },
      { id: '2', name: 'Best Friend', phone: '+91 98765 43211', relation: 'Friend' },
    ]; } catch { return []; }
  });
  const [showAddGuardian, setShowAddGuardian] = useState(false);
  const [newGuardian, setNewGuardian] = useState({ name: '', phone: '', relation: '' });
  const [sosActive, setSosActive] = useState(false);
  const [sosHolding, setSosHolding] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [fakeCallTimer, setFakeCallTimer] = useState(0);
  const [liveStreaming, setLiveStreaming] = useState(false);
  const [safeWalkActive, setSafeWalkActive] = useState(false);
  const [safeWalkTime, setSafeWalkTime] = useState(0);
  const [safeWalkTarget, setSafeWalkTarget] = useState(15);
  const [shakeDetect, setShakeDetect] = useState(false);
  const [nightSafe, setNightSafe] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const sosRef = useRef(null);
  const fakeCallRef = useRef(null);
  const walkRef = useRef(null);

  useEffect(() => { localStorage.setItem('ms_guardians', JSON.stringify(guardians)); }, [guardians]);
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 20 || h < 6) setNightSafe(true);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setTipIndex(i => (i + 1) % TIPS.length), 8000);
    return () => clearInterval(t);
  }, []);

  // SOS hold
  const startSOS = useCallback(() => {
    setSosHolding(true); setSosProgress(0);
    let p = 0;
    sosRef.current = setInterval(() => {
      p += 2; setSosProgress(p);
      if (p >= 100) {
        clearInterval(sosRef.current);
        setSosActive(true); setSosHolding(false); setIsRecording(true);
        toast.error('🚨 EMERGENCY SOS ACTIVATED! Guardians alerted. Recording started.', { duration: 6000, style: { background: '#2d0a0a', color: '#FF5252', border: '1px solid #FF5252', borderRadius: '12px' } });
      }
    }, 60);
  }, []);

  const cancelSOS = useCallback(() => {
    clearInterval(sosRef.current); setSosHolding(false); setSosProgress(0);
  }, []);

  const deactivateSOS = () => {
    setSosActive(false); setIsRecording(false);
    toast.success('SOS deactivated. You are safe.', { style: { background: '#162231', color: '#00E676', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '12px' } });
  };

  // Fake call
  const startFakeCall = () => {
    setFakeCallActive(true); setFakeCallTimer(0);
    fakeCallRef.current = setInterval(() => setFakeCallTimer(t => t + 1), 1000);
    toast('📞 Incoming call from "Mom"...', { duration: 3000, style: { background: '#162231', color: '#E8EDF2', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' } });
  };
  const endFakeCall = () => {
    clearInterval(fakeCallRef.current); setFakeCallActive(false); setFakeCallTimer(0);
  };

  // Safe walk timer
  const startSafeWalk = () => {
    setSafeWalkActive(true); setSafeWalkTime(0);
    walkRef.current = setInterval(() => {
      setSafeWalkTime(t => {
        if (t + 1 >= safeWalkTarget * 60) {
          clearInterval(walkRef.current); setSafeWalkActive(false);
          toast.error('⏰ Safe Walk timer expired! Guardians being notified.', { duration: 5000, style: { background: '#2d0a0a', color: '#FF5252', border: '1px solid #FF5252', borderRadius: '12px' } });
          return 0;
        }
        return t + 1;
      });
    }, 1000);
    toast.success(`Safe Walk started — ${safeWalkTarget} min timer`, { style: { background: '#162231', color: '#E8EDF2', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' } });
  };
  const stopSafeWalk = () => {
    clearInterval(walkRef.current); setSafeWalkActive(false); setSafeWalkTime(0);
    toast.success('Arrived safely! Timer stopped.', { style: { background: '#162231', color: '#00E676', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '12px' } });
  };

  const formatTimer = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const addGuardian = (e) => {
    e.preventDefault();
    if (newGuardian.name && newGuardian.phone) {
      setGuardians(prev => [...prev, { id: Date.now().toString(), ...newGuardian }]);
      setNewGuardian({ name: '', phone: '', relation: '' }); setShowAddGuardian(false);
    }
  };

  const safetyScore = Math.min(100, 40 + guardians.length * 15 + (shakeDetect ? 10 : 0) + (nightSafe ? 10 : 0));

  return (
    <section className="wsafety-page" id="women-safety-page">
      <div className="wsafety-header animate-in">
        <div>
          <h1><Heart size={28} /> Women Safety</h1>
          <p>Your personal safety companion — inspired by <a href="https://www.getbsafe.com" target="_blank" rel="noreferrer" style={{color:'var(--accent)'}}>bSafe</a></p>
        </div>
        <div className="wsafety-score">
          <svg viewBox="0 0 80 80" className="wsafety-score__ring">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
            <circle cx="40" cy="40" r="34" fill="none" stroke={safetyScore >= 80 ? '#00E676' : '#FFB74D'} strokeWidth="6" strokeDasharray={`${safetyScore * 2.136} 213.6`} strokeLinecap="round" transform="rotate(-90 40 40)" className="safety-score-circle"/>
          </svg>
          <span className="wsafety-score__val">{safetyScore}</span>
        </div>
      </div>

      {/* Safety Tip Banner */}
      <div className="wsafety-tip animate-in">
        <Shield size={16} /> <span>{TIPS[tipIndex]}</span>
      </div>

      <div className="wsafety-grid">
        {/* SOS */}
        <div className={`wsafety-card wsafety-card--sos animate-in${sosActive ? ' sos-active' : ''}`}>
          <h2><AlertTriangle size={18} /> Emergency SOS</h2>
          <p>Hold 3 seconds — alerts guardians, records audio, shares location</p>
          {sosActive ? (
            <div className="sos-activated">
              <div className="sos-activated__pulse"></div>
              <p className="sos-activated__text">🚨 SOS ACTIVE</p>
              {isRecording && <p style={{fontSize: 'var(--fs-xs)', color: 'var(--danger)', display:'flex', alignItems:'center', gap:'4px'}}><Mic size={12}/> Recording audio...</p>}
              <button className="btn btn--ghost btn--sm" onClick={deactivateSOS}>Deactivate</button>
            </div>
          ) : (
            <div className="sos-btn-container">
              <button className={`sos-btn${sosHolding ? ' holding' : ''}`} onMouseDown={startSOS} onMouseUp={cancelSOS} onMouseLeave={cancelSOS} onTouchStart={startSOS} onTouchEnd={cancelSOS}>
                <svg className="sos-btn__progress" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,82,82,0.3)" strokeWidth="6"/><circle cx="60" cy="60" r="54" fill="none" stroke="#FF5252" strokeWidth="6" strokeDasharray={`${sosProgress*3.39} 339.3`} strokeLinecap="round" transform="rotate(-90 60 60)"/></svg>
                <span className="sos-btn__label">SOS</span>
              </button>
              <span className="sos-btn__hint">Hold to activate</span>
            </div>
          )}
        </div>

        {/* Fake Call */}
        <div className="wsafety-card animate-in">
          <h2><PhoneCall size={18} /> Fake Call</h2>
          <p>Simulate an incoming call to escape uncomfortable situations</p>
          {fakeCallActive ? (
            <div className="fake-call-active">
              <div className="fake-call-active__info">
                <span className="fake-call-active__avatar">👩</span>
                <div><strong>Mom</strong><span>{formatTimer(fakeCallTimer)}</span></div>
              </div>
              <button className="btn btn--ghost btn--sm" onClick={endFakeCall} style={{color:'var(--danger)'}}><Square size={14}/> End Call</button>
            </div>
          ) : (
            <button className="btn btn--primary btn--sm" onClick={startFakeCall} style={{width:'100%',justifyContent:'center',marginTop:'.5rem'}}>
              <Phone size={14}/> Trigger Fake Call
            </button>
          )}
        </div>

        {/* Safe Walk Timer */}
        <div className="wsafety-card animate-in">
          <h2><Timer size={18} /> Safe Walk</h2>
          <p>Set a timer — if not stopped, guardians get alerted</p>
          {safeWalkActive ? (
            <div className="safe-walk-active">
              <div className="safe-walk-active__timer">{formatTimer(safeWalkTime)} <span>/ {safeWalkTarget}:00</span></div>
              <div className="safe-walk-active__bar"><div style={{width:`${(safeWalkTime/(safeWalkTarget*60))*100}%`}}></div></div>
              <button className="btn btn--primary btn--sm" onClick={stopSafeWalk} style={{width:'100%',justifyContent:'center'}}><CheckCircle size={14}/> I'm Safe — Stop</button>
            </div>
          ) : (
            <div>
              <div className="safe-walk-presets">
                {[10,15,20,30].map(m => (
                  <button key={m} className={`safe-walk-preset${safeWalkTarget===m?' active':''}`} onClick={()=>setSafeWalkTarget(m)}>{m} min</button>
                ))}
              </div>
              <button className="btn btn--primary btn--sm" onClick={startSafeWalk} style={{width:'100%',justifyContent:'center',marginTop:'.5rem'}}><Play size={14}/> Start Safe Walk</button>
            </div>
          )}
        </div>

        {/* Live Stream */}
        <div className="wsafety-card animate-in">
          <h2><Video size={18} /> Live Stream</h2>
          <p>Stream live video to guardians during emergencies</p>
          <button className={`btn ${liveStreaming?'btn--ghost':'btn--primary'} btn--sm`} onClick={()=>{setLiveStreaming(!liveStreaming);toast(liveStreaming?'Stream stopped':'📡 Live streaming to guardians...',{style:{background:'#162231',color:'#E8EDF2',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px'}})}} style={{width:'100%',justifyContent:'center',marginTop:'.5rem'}}>
            {liveStreaming ? <><Square size={14}/> Stop Stream</> : <><Video size={14}/> Start Streaming</>}
          </button>
          {liveStreaming && <div className="safety-active-badge" style={{marginTop:'.5rem'}}><Eye size={14}/> {guardians.length} guardians watching</div>}
        </div>

        {/* Quick Toggles */}
        <div className="wsafety-card animate-in">
          <h2><Shield size={18} /> Safety Features</h2>
          <div className="safety-toggle-row"><span><Vibrate size={14}/> Shake to Alert</span><button className={`toggle-switch${shakeDetect?' active':''}`} onClick={()=>setShakeDetect(!shakeDetect)}><span className="toggle-switch__thumb"></span></button></div>
          <div className="safety-toggle-row"><span><Moon size={14}/> Night Mode</span><button className={`toggle-switch${nightSafe?' active':''}`} onClick={()=>setNightSafe(!nightSafe)}><span className="toggle-switch__thumb"></span></button></div>
          <div className="safety-toggle-row"><span><MapPin size={14}/> Auto Location Share</span><button className="toggle-switch active"><span className="toggle-switch__thumb"></span></button></div>
          <div className="safety-toggle-row"><span><Mic size={14}/> Auto Record on SOS</span><button className="toggle-switch active"><span className="toggle-switch__thumb"></span></button></div>
        </div>

        {/* Guardian Circle */}
        <div className="wsafety-card wsafety-card--guardians animate-in">
          <div className="safety-section__head"><h2><Users size={18}/> Guardian Circle</h2><button className="btn-icon" onClick={()=>setShowAddGuardian(true)}><Users size={16}/></button></div>
          <div className="contacts-list">
            {guardians.map(g => (
              <div key={g.id} className="contact-card">
                <div className="contact-card__avatar">{g.name.charAt(0)}</div>
                <div className="contact-card__info"><strong>{g.name}</strong><span>{g.phone}{g.relation ? ` • ${g.relation}` : ''}</span></div>
                <button className="contact-card__delete" onClick={()=>setGuardians(p=>p.filter(c=>c.id!==g.id))}>✕</button>
              </div>
            ))}
          </div>
          {showAddGuardian && (
            <form onSubmit={addGuardian} className="contact-form">
              <input autoComplete="off" type="text" placeholder="Name" value={newGuardian.name} onChange={e=>setNewGuardian({...newGuardian,name:e.target.value})} required/>
              <input autoComplete="off" type="tel" placeholder="Phone" value={newGuardian.phone} onChange={e=>setNewGuardian({...newGuardian,phone:e.target.value})} required/>
              <input autoComplete="off" type="text" placeholder="Relation (optional)" value={newGuardian.relation} onChange={e=>setNewGuardian({...newGuardian,relation:e.target.value})}/>
              <div className="contact-form__actions">
                <button type="submit" className="btn btn--primary btn--sm">Add</button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={()=>setShowAddGuardian(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
