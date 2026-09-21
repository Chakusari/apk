import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Home, BarChart3, Settings } from 'lucide-react';
import HomePage from './pages/Home';
import StatsPage from './pages/Stats';
import SettingsPage from './pages/Settings';
import './App.css';

const navItems = [
  { to: '/', icon: Home, label: 'خانه' },
  { to: '/stats', icon: BarChart3, label: 'آمار' },
  { to: '/settings', icon: Settings, label: 'تنظیمات' },
];

export default function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <main className="app-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      <nav className="bottom-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <div className="nav-icon-wrap">
              <Icon size={22} strokeWidth={isActive => isActive ? 2.5 : 1.8} />
            </div>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
