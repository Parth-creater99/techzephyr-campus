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
  Shield,
  User,
  Key,
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
  onSwitchRole,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = currentUser?.roleType === 'admin';

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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
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

          {/* Sidebar Bottom Role Card with 1-Click Role Switcher */}
          <div style={{ padding: '16px 14px', borderTop: '1px solid var(--border-default)', margin: '0 8px 12px 8px' }}>
            <div
              style={{
                background: isAdmin ? 'rgba(78, 117, 97, 0.1)' : 'rgba(197, 74, 38, 0.08)',
                border: `1px solid ${isAdmin ? 'var(--accent-sage)' : 'var(--accent-terracotta)'}`,
                borderRadius: 12,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isAdmin ? <Shield size={14} color="var(--accent-sage)" /> : <User size={14} color="var(--accent-terracotta)" />}
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: isAdmin ? 'var(--accent-sage)' : 'var(--accent-terracotta)' }}>
                    {isAdmin ? 'Dean / Admin Mode' : 'Lecturer Mode'}
                  </span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.75 }}>
                  {isAdmin ? 'Level 4' : 'Level 2'}
                </span>
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentUser?.name || 'Dr. A. Sharma'}
              </div>

              <button
                type="button"
                onClick={() => onSwitchRole?.(isAdmin ? 'faculty' : 'admin')}
                style={{
                  background: isAdmin ? 'var(--accent-sage)' : 'var(--accent-terracotta)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  transition: 'opacity 0.15s',
                }}
              >
                <Key size={11} />
                <span>{isAdmin ? 'Switch to Lecturer Mode' : 'Switch to Admin Mode'}</span>
              </button>
            </div>
          </div>
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
            {/* Highly Visible Institutional Role Switcher Pill in Topbar */}
            {isAdmin ? (
              <div
                className="topbar-role-pill admin-active"
                onClick={() => onSwitchRole?.('faculty')}
                title="Signed in as Institute Administrator / Dean. Click to switch to Lecturer Mode."
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'rgba(78, 117, 97, 0.12)',
                  border: '1.5px solid var(--accent-sage)',
                  borderRadius: 9999,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--accent-sage)',
                }}
              >
                <Shield size={14} />
                <span>Admin Mode (Dean)</span>
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: 'var(--accent-sage)',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  Switch to Lecturer
                </span>
              </div>
            ) : (
              <div
                className="topbar-role-pill lecturer-active"
                onClick={() => onSwitchRole?.('admin')}
                title="Signed in as Lecturer. Click to switch to Administrator Mode."
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'rgba(197, 74, 38, 0.1)',
                  border: '1.5px solid var(--accent-terracotta)',
                  borderRadius: 9999,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--accent-terracotta)',
                }}
              >
                <User size={14} />
                <span>Lecturer Mode (Dr. Sharma)</span>
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: 'var(--accent-terracotta)',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    fontWeight: 700,
                  }}
                >
                  <Key size={10} /> Switch to Admin
                </span>
              </div>
            )}

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
