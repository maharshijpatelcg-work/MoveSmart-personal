// MoveSmart — Analytics Dashboard
import { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { Map, Navigation, Shield, Settings, TrendingUp, Clock, Zap, Activity, Bus, Leaf } from 'lucide-react';
import { generateCommuteData, generateWeeklyActivity, generateRouteEfficiency, generateQuickStats, generateActivityFeed, generateMonthlySummary } from '../data/analyticsData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1E2D3D', titleColor: '#E8EDF2', bodyColor: '#8B9DB5', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, cornerRadius: 8, padding: 10 } },
  scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B9DB5', font: { size: 11 } } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8B9DB5', font: { size: 11 } } } },
};

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;

  const commuteData = useMemo(() => generateCommuteData(), []);
  const weeklyData = useMemo(() => generateWeeklyActivity(), []);
  const routeEff = useMemo(() => generateRouteEfficiency(), []);
  const stats = useMemo(() => generateQuickStats(), []);
  const feed = useMemo(() => generateActivityFeed(), []);
  const monthly = useMemo(() => generateMonthlySummary(), []);

  const commuteChart = {
    labels: commuteData.map((d) => d.date),
    datasets: [
      { label: 'Actual', data: commuteData.map((d) => d.commuteTime || null), borderColor: '#FF6B6B', backgroundColor: 'rgba(255,107,107,0.1)', fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5 },
      { label: 'Optimized', data: commuteData.map((d) => d.optimizedTime || null), borderColor: '#00E676', backgroundColor: 'rgba(0,230,118,0.1)', fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5 },
    ],
  };

  const weeklyChart = {
    labels: weeklyData.map((d) => d.day),
    datasets: [{ data: weeklyData.map((d) => d.trips), backgroundColor: weeklyData.map((_, i) => i < 5 ? 'rgba(26,115,232,0.6)' : 'rgba(26,115,232,0.2)'), borderRadius: 8, borderSkipped: false }],
  };

  const effChart = {
    labels: routeEff.map((r) => r.route),
    datasets: [{ data: routeEff.map((r) => r.percentage), backgroundColor: routeEff.map((r) => r.color), borderWidth: 0, hoverOffset: 8 }],
  };

  const QUICK_LINKS = [
    { icon: Map, label: 'Live Map', path: '/map', color: '#1A73E8' },
    { icon: Navigation, label: 'Routes', path: '/routes', color: '#00C6FF' },
    { icon: Shield, label: 'Safety', path: '/safety', color: '#FF6B6B' },
    { icon: Settings, label: 'Settings', path: '/settings', color: '#A78BFA' },
  ];

  const feedIcons = { bus: '🚍', route: '🧭', shield: '🛡️', alert: '⚠️' };

  return (
    <section className="dashboard" id="dashboard">
      <div className="dashboard__welcome animate-in">
        <h1>Welcome back, {user.name} 👋</h1>
        <p>Here's your mobility command centre. Track, route, and stay safe.</p>
      </div>

      {/* Quick Stats */}
      <div className="dash-stats animate-in">
        <div className="dash-stats__item"><div className="dash-stats__icon"><TrendingUp size={20} /></div><div><span className="dash-stats__num">{stats.totalTrips}</span><span className="dash-stats__label">Total Trips</span></div></div>
        <div className="dash-stats__item"><div className="dash-stats__icon"><Clock size={20} /></div><div><span className="dash-stats__num">{stats.avgCommuteTime} min</span><span className="dash-stats__label">Avg Commute</span></div></div>
        <div className="dash-stats__item"><div className="dash-stats__icon"><Zap size={20} /></div><div><span className="dash-stats__num">{stats.timeSaved} min</span><span className="dash-stats__label">Time Saved</span></div></div>
        <div className="dash-stats__item"><div className="dash-stats__icon"><Shield size={20} /></div><div><span className="dash-stats__num">{stats.safetyScore}%</span><span className="dash-stats__label">Safety Score</span></div></div>
      </div>

      <div className="dashboard__grid">
        {/* Commute Performance Chart */}
        <div className="dash-card dash-card--wide animate-in">
          <h3 className="dash-card__title"><Activity size={18} /> Commute Performance (30 Days)</h3>
          <div className="dash-card__chart"><Line data={commuteChart} options={{ ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: true, labels: { color: '#8B9DB5', usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } } } } }} /></div>
          <div className="dash-card__legend-custom">
            <span><span className="legend-dot" style={{ background: '#FF6B6B' }}></span>Without Optimization</span>
            <span><span className="legend-dot" style={{ background: '#00E676' }}></span>With MoveSmart</span>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="dash-card animate-in">
          <h3 className="dash-card__title"><Bus size={18} /> Weekly Trips</h3>
          <div className="dash-card__chart dash-card__chart--sm"><Bar data={weeklyChart} options={{ ...chartDefaults, plugins: { ...chartDefaults.plugins } }} /></div>
        </div>

        {/* Route Efficiency */}
        <div className="dash-card animate-in">
          <h3 className="dash-card__title"><Navigation size={18} /> Route Efficiency</h3>
          <div className="dash-card__chart dash-card__chart--donut"><Doughnut data={effChart} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1E2D3D', titleColor: '#E8EDF2', bodyColor: '#8B9DB5', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1, cornerRadius: 8 } } }} /></div>
          <div className="dash-card__eff-list">{routeEff.map((r) => (<div key={r.route} className="dash-card__eff-item"><span className="legend-dot" style={{ background: r.color }}></span><span>{r.route}</span><strong>{r.percentage}%</strong></div>))}</div>
        </div>

        {/* Monthly Summary */}
        <div className="dash-card animate-in">
          <h3 className="dash-card__title"><Leaf size={18} /> Monthly Summary</h3>
          <div className="monthly-stats">
            <div className="monthly-stat"><span className="monthly-stat__val">{monthly.tripsThisMonth}</span><span className="monthly-stat__label">Trips this month</span></div>
            <div className="monthly-stat"><span className="monthly-stat__val">{monthly.avgTimeThisMonth} min</span><span className="monthly-stat__label">Avg time</span></div>
            <div className="monthly-stat"><span className="monthly-stat__val">{monthly.co2Saved} kg</span><span className="monthly-stat__label">CO₂ saved</span></div>
            <div className="monthly-stat"><span className="monthly-stat__val">{monthly.safetyEventsThisMonth}</span><span className="monthly-stat__label">Safety events</span></div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="dash-card animate-in">
          <h3 className="dash-card__title">📡 Live Activity</h3>
          <div className="activity-feed">{feed.map((item, i) => (<div key={i} className={`activity-item activity-item--${item.type}`}><span className="activity-item__icon">{feedIcons[item.icon]}</span><div className="activity-item__body"><p>{item.text}</p><span>{item.time}</span></div></div>))}</div>
        </div>

        {/* Quick Links */}
        <div className="dash-card animate-in">
          <h3 className="dash-card__title">⚡ Quick Actions</h3>
          <div className="quick-links">{QUICK_LINKS.map((l) => (<Link key={l.path} to={l.path} className="quick-link"><l.icon size={22} style={{ color: l.color }} /><span>{l.label}</span></Link>))}</div>
        </div>
      </div>
    </section>
  );
}
