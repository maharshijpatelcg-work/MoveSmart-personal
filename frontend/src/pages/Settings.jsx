// MoveSmart — Settings Page
import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Moon, LogOut, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage({ user, onLogout }) {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [notifPrefs, setNotifPrefs] = useState({
    delays: true, arrivals: true, safety: true, routeUpdates: true, nightAlerts: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    toast.success('Settings saved!', {
      style: { background: '#162231', color: '#00E676', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '12px' },
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotif = (key) => setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section className="settings-page" id="settings-page">
      <div className="settings-page__header animate-in">
        <h1><SettingsIcon size={28} /> Settings</h1>
        <p>Manage your profile and preferences.</p>
      </div>

      <div className="settings-page__grid">
        {/* Profile Section */}
        <div className="settings-section animate-in">
          <h2><User size={20} /> Profile</h2>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="settings-name">Full Name</label>
              <input autoComplete="off" id="settings-name" type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="settings-email">Email</label>
              <input autoComplete="off" id="settings-email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="settings-phone">Phone</label>
              <input autoComplete="off" id="settings-phone" type="tel" placeholder="+91 98765 43210" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <button type="submit" className="btn btn--primary btn--sm" id="save-profile">
              {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
            </button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="settings-section animate-in">
          <h2><Bell size={20} /> Notification Preferences</h2>
          {Object.entries(notifPrefs).map(([key, enabled]) => (
            <div key={key} className="settings-toggle-row">
              <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</span>
              <button className={`toggle-switch${enabled ? ' active' : ''}`} onClick={() => toggleNotif(key)}>
                <span className="toggle-switch__thumb"></span>
              </button>
            </div>
          ))}
        </div>

        {/* Privacy & Safety */}
        <div className="settings-section animate-in">
          <h2><Shield size={20} /> Privacy & Safety</h2>
          <div className="settings-toggle-row">
            <span>Share ride data for analytics</span>
            <button className="toggle-switch active"><span className="toggle-switch__thumb"></span></button>
          </div>
          <div className="settings-toggle-row">
            <span>Allow location access</span>
            <button className="toggle-switch active"><span className="toggle-switch__thumb"></span></button>
          </div>
          <div className="settings-toggle-row">
            <span>Auto night-mode detection</span>
            <button className="toggle-switch active"><span className="toggle-switch__thumb"></span></button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="settings-section animate-in">
          <h2><Moon size={20} /> Account</h2>
          <button className="btn btn--ghost" onClick={onLogout} id="settings-logout" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </section>
  );
}
