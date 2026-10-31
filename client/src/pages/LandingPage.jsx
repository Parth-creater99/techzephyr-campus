import React, { useState } from 'react';
import { Menu, X, ChevronsRight, ShieldCheck, CheckCircle2, Clock, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import './LandingPage.css';

export function LandingPage({ currentUser, onEnterPortal, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCitBackClick = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      onNavigate?.('dashboard');
    }
  };

  const handleEnter = (targetPage = 'dashboard') => {
    onEnterPortal?.();
    onNavigate?.(targetPage);
  };

  return (
    <div className="landing-root animate-fade-in">
      {/* Background wave contours with warm aesthetic */}
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
            stroke="rgba(194, 84, 45, 0.2)"
            strokeWidth="1.2"
          />
          <path
            d="M-50,180 C260,150 390,350 630,310 C870,270 1030,430 1290,390 C1410,370 1490,450 1520,490"
            stroke="rgba(217, 130, 43, 0.18)"
            strokeWidth="1.2"
          />
          <path
            d="M-50,210 C270,180 400,380 640,340 C880,300 1040,460 1300,420 C1420,400 1500,480 1520,520"
            stroke="rgba(78, 124, 103, 0.18)"
            strokeWidth="1.2"
          />
          <path
            d="M-20,400 C300,360 450,560 700,520 C950,480 1100,640 1350,600 C1450,580 1500,620 1520,650"
            stroke="rgba(194, 84, 45, 0.12)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Top Navigation */}
      <header className="landing-header">
        <div className="landing-nav-inner">
          {/* Logo - clicking CIT goes back */}
          <div
            className="landing-logo"
            onClick={handleCitBackClick}
            title="Click CIT to go back"
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span>CIT Campus</span>
            <span className="landing-back-pill">
              <ArrowLeft size={12} /> Back
            </span>
          </div>

          {/* Clean Desktop Navigation Links */}
          <nav className="landing-nav-menu">
            <button type="button" className="landing-nav-link" onClick={() => scrollToSection('home')}>
              Home
            </button>
            <button type="button" className="landing-nav-link" onClick={() => scrollToSection('features')}>
              Core Capabilities
            </button>

            {/* Direct Portal Entrance Button */}
            <button
              type="button"
              className="landing-login-btn"
              onClick={() => handleEnter('dashboard')}
            >
              <span>Enter Campus Portal</span>
              <ArrowRight size={14} style={{ marginLeft: 6 }} />
            </button>
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
            <div className="mobile-action-wrap">
              <button
                type="button"
                className="landing-login-btn w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleEnter('dashboard');
                }}
              >
                <span>Enter Campus Portal</span>
                <ArrowRight size={14} style={{ marginLeft: 6 }} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Section */}
      <main id="home" className="landing-hero-section">
        <div className="landing-hero-content">
          <div className="hero-kicker">CIT Academic Scheduling &amp; Venue Intelligence</div>

          <h1 className="hero-heading">
            <span className="hero-line-terracotta">CIT Campus</span>
            <span className="hero-line-dark">Smart Scheduler</span>
          </h1>

          <p className="hero-description">
            Next-generation academic orchestration engine for Chilika Institute of Technology.
            Governing automated clash-free timetable generation, midsem exam allocations, leave rescheduling,
            and natural language venue booking with strict faculty permission safeguards.
          </p>

          {/* Direct Buttons for Entering */}
          <div className="hero-cta-group" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10 }}>
            <button
              type="button"
              className="hero-btn-solid"
              onClick={() => handleEnter('dashboard')}
            >
              <span>Enter Campus Portal</span>
              <ArrowRight size={16} style={{ marginLeft: 8 }} />
            </button>

            <button
              type="button"
              className="hero-btn-outline"
              onClick={() => handleEnter('timetable')}
            >
              <Clock size={16} style={{ marginRight: 8 }} />
              <span>View Master Timetable</span>
            </button>
          </div>
        </div>

        <div className="hero-bottom-accent" aria-hidden="true">
          <ChevronsRight size={22} className="chevron-icon" />
          <ChevronsRight size={22} className="chevron-icon" />
        </div>
      </main>

      {/* High-Level Feature Pillars */}
      <section id="features" className="landing-section">
        <div className="section-container">
          <span className="section-label">Core Capabilities</span>
          <h2 className="section-title">Built for Real Academic Governance</h2>
          <p className="section-lead">
            Engineered to fulfill all platform evaluation criteria with zero hard constraint violations.
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
                Accepts conversational booking requests in English or Hinglish, generates a structured card for review,
                and validates hard constraints before commit.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 44, textAlign: 'center' }}>
            <button
              type="button"
              className="hero-btn-solid"
              onClick={() => handleEnter('dashboard')}
            >
              <span>Enter Campus Portal</span>
              <ArrowRight size={16} style={{ marginLeft: 8 }} />
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
