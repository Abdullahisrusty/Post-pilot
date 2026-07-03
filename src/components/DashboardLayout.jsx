import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, Bell, Search } from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="topbar-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="topbar-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search posts, drafts, analytics..."
                className="topbar-search-input"
              />
              <kbd className="topbar-search-kbd">⌘K</kbd>
            </div>
          </div>
          <div className="topbar-right">
            <button className="topbar-notification-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="topbar-notification-dot" />
            </button>
          </div>
        </header>
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
