import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  Users,
  Settings,
  Building2,
  Sparkles,
  RefreshCw,
  Bot,
  Menu,
  X,
  Search,
  ArrowLeft,
} from 'lucide-react';
import { LiveTicker } from '../components/LiveTicker';
import { CitLogo } from '../components/CitLogo';

export const FACULTY_NAV_ITEMS = [
  { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
  { id: 'timetable', label: 'Master Schedule (P1–P13)', icon: Clock },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'AI' },
  { id: 'rescheduling', label: 'Swaps & Disruptions', icon: RefreshCw },
  { id: 'venues', label: 'Venues & 7 Labs (27)', icon: Building2 },
  { id: 'spectra', label: 'Spectra Events (25)', icon: Sparkles },
  { id: 'faculty-network', label: 'Faculty Network', icon: Users },
  { id: 'courses', label: 'Courses (62)', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AppLayout({
  activePage = 'dashboard',
  currentUser,
  onNavigate,
  onLogout,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavClick = (pageId) => {
    onNavigate?.(pageId);
    setMobileMenuOpen(false);
  };

  const handleCitBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleNavClick('dashboard');
    }
  };

  return (
    <div className="app-viewport-wrapper">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Clean Minimalist Sidebar */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div>
          {/* Logo - CHILIKA INSTITUTE OF TECHNOLOGY (Clicking goes back) */}
          <div className="sidebar-logo-area">
            <div
              className="brand-logo-wrap"
              onClick={handleCitBackClick}
              role="button"
              tabIndex={0}
              title="Click to go back"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <CitLogo size={36} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.04em', lineHeight: 1.15, textTransform: 'uppercase' }}>
                  Chilika Institute
                </span>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-terracotta)', letterSpacing: '0.06em', lineHeight: 1.15, textTransform: 'uppercase' }}>
                  of Technology
                </span>
              </div>
              <span className="back-hint-badge" title="Click to go back">
                <ArrowLeft size={12} />
              </span>
            </div>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav-list">
            {FACULTY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <div className="sidebar-link-content">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="sidebar-pill-badge">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main App Content Viewport */}
      <div className="app-main-viewport">
        {/* Live Ticker Moving Left to Right */}
        <LiveTicker />

        {/* Top Header */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <h1 className="welcome-heading">
              Welcome back {currentUser?.name || 'Dr. Sharma'} <span role="img" aria-label="wave">👋</span>
            </h1>
          </div>

          <div className="topbar-right">
            {/* Pill Search Input */}
            <div className="search-pill-container">
              <Search size={16} className="search-pill-icon" />
              <input
                type="text"
                className="search-pill-input"
                placeholder="Search courses, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* User Profile Avatar - Click to go to Settings */}
            <div
              className="topbar-avatar-btn"
              onClick={() => handleNavClick('settings')}
              title={`Signed in as ${currentUser?.name || 'Faculty'} (${currentUser?.email || ''}) - View Settings`}
              style={{ cursor: 'pointer' }}
            >
              {currentUser?.avatarInitials || 'AS'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Body with Smooth Feature Motion Transition */}
        <main key={activePage} className="feature-transition-container app-content-inner">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
