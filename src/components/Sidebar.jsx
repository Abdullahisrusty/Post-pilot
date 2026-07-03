import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Calendar,
  FileText,
  Clock,
  Settings,
  LogOut,
  Send,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Compose', end: true },
  { to: '/app/community', icon: MessageSquare, label: 'Community' },
  { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/app/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/app/drafts', icon: FileText, label: 'Drafts' },
  { to: '/app/history', icon: Clock, label: 'History' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${isOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={() => navigate('/app')}>
            <div className="sidebar-logo-icon">
              <Send size={18} />
            </div>
            {!collapsed && <span className="sidebar-logo-text">PostPilot</span>}
          </div>
          <button className="sidebar-close-mobile" onClick={onClose}>
            <X size={18} />
          </button>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={onClose}
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="sidebar-upgrade">
            <Sparkles size={16} />
            <div>
              <div className="sidebar-upgrade-title">PostPilot Pro</div>
              <div className="sidebar-upgrade-desc">Unlimited AI generations</div>
            </div>
          </div>
        )}

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.initials || 'AR'}</div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user?.name || 'Alex Rivera'}</span>
                <span className="sidebar-user-plan">{user?.plan || 'Pro'} Plan</span>
              </div>
            )}
          </div>
          <button className="sidebar-signout" onClick={handleSignOut} title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
