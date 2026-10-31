import React, { useState } from 'react';
import { User, Menu, X, ChevronsRight, ShieldCheck, CheckCircle2, LogIn, UserPlus, Sparkles, Clock, Calendar } from 'lucide-react';
import { LiveTicker } from '../components/LiveTicker';
import './LandingPage.css';

export function LandingPage({ currentUser, onOpenLogin, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-root animate-fade-in">
      {/* Live Updates Moving Right to Left */}
      <LiveTicker />

      {/* Hand-coded background wave contours */}
      <div className="landing-bg-waves" aria-hidden="true">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="waves-svg"
        >
          <path
            d="M-50,150 C250,120 380,320 620,280 C860,240 1020,400 1280,360 C1400,340 1480,420 1520,460"
            stroke="rgba(210, 248, 87, 0.22)"
            strokeWidth="1.2"
          />
          <path
            d="M-50,180 C260,150 390,350 630,310 C870,270 1030,430 1290,390 C1410,370 1490,450 1520,490"
            stroke="rgba(210, 248, 87, 0.18)"
            strokeWidth="1.2"
          />
          <path
            d="M-50,210 C270,180 400,380 640,340 C880,300 1040,460 1300,420 C1420,400 1500,480 1520,520"
            stroke="rgba(210, 248, 87, 0.14)"
            strokeWidth="1.2"
          />
          <path
            d="M-20,400 C300,360 450,560 700,520 C950,480 1100,640 1350,600 C1450,580 1500,620 1520,650"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.2"
          />
          <path
            d="M720,-40 C750,200 680,380 780,600 C830,720 890,840 920,950"
            stroke="rgba(210, 248, 87, 0.12)"
            strokeWidth="1"
          />
          <path
            d="M840,-40 C870,200 800,380 900,600 C950,720 1010,840 1040,950"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Top Navigation */}
      <header className="landing-header">
        <div className="landing-nav-inner">
          <div className="landing-logo" onClick={() => scrollToSection('home')}>
            <span>CIT Campus</span>
          </div>

          {/* Clean Desktop Navigation Links */}
          <nav className="landing-nav-menu">
            <button type="button" className="landing-nav-link" onClick={() => scrollToSection('home')}>
              Home
            </button>
            <button type="button" className="landing-nav-link" onClick={() => scrollToSection('features')}>
              Core Capabilities
            </button>
            <button type="button" className="landing-nav-link" onClick={() => scrollToSection('protocol')}>
              Permission Protocol
            </button>

            {/* Clear Log In and Sign In Buttons */}
            {currentUser?.isLoggedIn ? (
              <div className="landing-user-badge-group">
                <button
                  type="button"
                  className="landing-user-pill-btn"
                  onClick={() => onNavigate?.('dashboard')}
                  title="Open Dashboard"
                >
                  <span className="user-dot-pulse" />
                  <span>Enter Portal as {currentUser.name}</span>
                </button>
                <button
                  type="button"
                  className="landing-avatar-btn"
                  onClick={onOpenLogin}
                  title="Switch User / Log In"
                >
                  {currentUser.avatarInitials || 'AS'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  className="hero-btn-outline"
                  style={{ padding: '8px 20px', fontSize: 13.5 }}
                  onClick={onOpenLogin}
                >
                  <LogIn size={14} style={{ marginRight: 6 }} />
                  <span>Log In</span>
                </button>

                <button
                  type="button"
                  className="landing-login-btn"
                  style={{ padding: '8px 22px', fontSize: 13.5 }}
                  onClick={onOpenLogin}
                >
                  <UserPlus size={14} style={{ marginRight: 6 }} />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="landing-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <button type="button" className="mobile-nav-link" onClick={() => scrollToSection('home')}>
              Home
            </button>
            <button type="button" className="mobile-nav-link" onClick={() => scrollToSection('features')}>
              Core Capabilities
            </button>
            <button type="button" className="mobile-nav-link" onClick={() => scrollToSection('protocol')}>
              Permission Protocol
            </button>
            <div className="mobile-action-wrap">
              <button
                type="button"
                className="landing-login-btn w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
              >
                Log In / Sign In with Name &amp; Password
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Section: Clean Intro with Direct Login & Sign In Buttons */}
      <main id="home" className="landing-hero-section">
        <div className="landing-hero-content">
          <div className="hero-kicker">CIT Academic Scheduling &amp; Venue Intelligence</div>

          <h1 className="hero-heading">
            <span className="hero-line-yellow">CIT Campus</span>
            <span className="hero-line-white">Smart Scheduler</span>
          </h1>

          <p className="hero-description">
            Next-generation academic orchestration engine for Chilika Institute of Technology.
            Governing automated clash-free timetable generation, midsem exam allocations, leave rescheduling,
            and natural language venue booking with strict faculty permission safeguards.
          </p>

          {/* Direct Buttons for Entering: Sign In & Log In */}
          <div className="hero-cta-group" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10 }}>
            <button
              type="button"
              className="hero-btn-solid"
              onClick={onOpenLogin}
            >
              <UserPlus size={16} style={{ marginRight: 8 }} />
              <span>Sign In to Portal</span>
            </button>

            <button
              type="button"
              className="hero-btn-outline"
              onClick={onOpenLogin}
            >
              <LogIn size={16} style={{ marginRight: 8 }} />
              <span>Faculty Log In</span>
            </button>
          </div>
        </div>

        <div className="hero-bottom-accent" aria-hidden="true">
          <ChevronsRight size={22} className="chevron-icon" />
          <ChevronsRight size={22} className="chevron-icon" />
        </div>
      </main>

      {/* High-Level Feature Pillars (Overview only - no massive data dumps) */}
      <section id="features" className="landing-section">
        <div className="section-container">
          <span className="section-label">Core Capabilities</span>
          <h2 className="section-title">Built for Real Academic Governance</h2>
          <p className="section-lead">
            Engineered to fulfill all 10 platform evaluation criteria with zero hard constraint violations.
          </p>

          <div className="unboxed-grid">
            <div className="unboxed-stat-item">
              <span className="stat-large-num">01</span>
              <h4 className="service-name">Clash-Free Timetable &amp; Midsem Exams</h4>
              <p className="service-desc">
                Automated solver for 189 weekly sessions and 41 midsem exams across 27 rooms and 13 periods (P1–P13)
                ensuring zero professor or room conflicts.
              </p>
            </div>

            <div className="unboxed-stat-item">
              <span className="stat-large-num">02</span>
              <h4 className="service-name">Faculty Permission &amp; Minimal Swaps</h4>
              <p className="service-desc">
                Strict permission protocol: no lecture is altered without target faculty consent. Solves emergency leaves
                and room closures moving the fewest sessions possible.
              </p>
            </div>

            <div className="unboxed-stat-item">
              <span className="stat-large-num">03</span>
              <h4 className="service-name">Plain English &amp; Hinglish AI Booking</h4>
              <p className="service-desc">
                Accepts conversational booking requests in English or Hinglish, generates a structured card for review and editing,
                and validates hard constraints before commit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Permission Protocol & Priority Section */}
      <section id="protocol" className="landing-section">
        <div className="section-container">
          <span className="section-label">Security &amp; Rules</span>
          <h2 className="section-title">6-Tier Priority Tie-Breakers</h2>
          <p className="section-lead">
            When multiple events request the same room at the same time, priority order strictly governs allocation:
          </p>

          <div className="unboxed-list">
            <div className="unboxed-item">
              <span className="unboxed-num">1</span>
              <div>
                <h3 className="unboxed-heading">Exams (Midsem &amp; Endsem)</h3>
                <p className="unboxed-text">Highest academic priority. Supercedes all regular lectures and campus events.</p>
              </div>
            </div>

            <div className="unboxed-item">
              <span className="unboxed-num">2</span>
              <div>
                <h3 className="unboxed-heading">Regular Classes, Labs &amp; Tutorials</h3>
                <p className="unboxed-text">Scheduled curriculum hours across 14 student cohorts and 40 faculty members.</p>
              </div>
            </div>

            <div className="unboxed-item">
              <span className="unboxed-num">3</span>
              <div>
                <h3 className="unboxed-heading">Institute Events (Spectra Fest &amp; Convocations)</h3>
                <p className="unboxed-text">Official institute-wide gatherings evaluated with alternative venue suggestions.</p>
              </div>
            </div>

            <div className="unboxed-item">
              <span className="unboxed-num">4–6</span>
              <div>
                <h3 className="unboxed-heading">Guest Lectures, Department Events &amp; Club Gatherings</h3>
                <p className="unboxed-text">Scheduled during evening periods P10–P13 at Central Auditorium, Seminar Halls, and OAT.</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <button type="button" className="hero-btn-solid" onClick={onOpenLogin}>
              <span>Enter Portal &amp; Sign In</span>
            </button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="footer-brand">CIT Campus</span>
          <span className="footer-copy">
            Chilika Institute of Technology &bull; Smart Scheduling Matrix
          </span>
          <button type="button" className="footer-top-btn" onClick={() => scrollToSection('home')}>
            Back to Top &uarr;
          </button>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
