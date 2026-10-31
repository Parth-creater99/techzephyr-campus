import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Clock,
  Mail,
  Bell,
  CalendarDays,
  Users,
  Settings,
  Building2,
  Sparkles,
  RefreshCw,
  Bot,
  Menu,
  X,
  Search,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react';
import { LiveTicker } from '../components/LiveTicker';

export const FACULTY_NAV_ITEMS = [
  { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
  { id: 'timetable', label: 'Master Schedule (P1–P13)', icon: Clock },
  { id: 'ai-assistant', label: 'AI Assistant (Validated)', icon: Bot, badge: 'AI' },
  { id: 'rescheduling', label: 'Swaps & Disruptions', icon: RefreshCw, badge: '15m' },
  { id: 'venues', label: 'Venues & 7 Labs (27)', icon: Building2 },
  { id: 'spectra', label: 'Spectra Events (25)', icon: Sparkles },
  { id: 'faculty-network', label: 'Faculty Network', icon: Users, badge: '40' },
  { id: 'faculty-chat', label: 'Faculty Chat', icon: MessageSquare, badge: 'Live' },
  { id: 'courses', label: 'Courses (62)', icon: BookOpen },
  { id: 'landing', label: 'CIT Landing Page', icon: ArrowUpRight },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AppLayout({
  activePage = 'dashboard',
  currentUser,
  onOpenLogin,
  onNavigate,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavClick = (pageId) => {
    onNavigate?.(pageId);
    setMobileMenuOpen(false);
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

      {/* Dark Sidebar (Matches reference UI) */}
      <aside className={`app-sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div>
          {/* Logo */}
          <div className="sidebar-logo-area">
            <div
              className="brand-logo-wrap"
              onClick={() => handleNavClick('landing')}
              role="button"
              tabIndex={0}
              title="Return to Landing Page"
              style={{ cursor: 'pointer' }}
            >
              <div className="brand-dot-icon" aria-hidden="true">
                <div className="brand-dot-center" />
              </div>
              <span className="brand-logo-text">Smart.CIT</span>
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

        {/* Bottom Mobile App / Faculty Portal Promo Card */}
        <div className="sidebar-bottom-promo">
          <div className="sidebar-app-card">
            <div className="sidebar-app-arrow-btn">
              <ArrowUpRight size={18} />
            </div>
            <div className="sidebar-app-title">
              Download our mobile app
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

            {/* User Profile Avatar with Click to Switch Account */}
            <div
              className="topbar-avatar-btn"
              onClick={onOpenLogin}
              title={`Signed in as ${currentUser?.name || 'Faculty'} (${currentUser?.email || ''}) - Click to switch user`}
              style={{ cursor: 'pointer' }}
            >
              {currentUser?.avatarInitials || 'AS'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Body */}
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
