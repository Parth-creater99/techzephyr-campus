import React, { useState } from 'react';
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Calendar,
  Clock,
  BookOpen,
  Building,
  Award,
  CheckCircle2,
  FileText,
  MapPin,
  Compass,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Camera,
} from 'lucide-react';
import { CitLogo } from '../components/CitLogo';
import { CitCampusBuilding } from '../components/CitCampusBuilding';
import './LandingPage.css';

// Preset Institutional Credentials for 1-Click Role Login
const ROLE_PROFILES = {
  faculty: {
    id: 'faculty',
    label: 'Faculty Portal',
    name: 'Dr. A. Sharma',
    email: 'a.sharma@cit.edu.in',
    dept: 'CSE',
    role: 'Professor & Head • Dept. of CSE',
    avatarInitials: 'AS',
    cabin: 'Faculty Block B • Cabin 204',
    badge: 'HOD CSE',
  },
  student: {
    id: 'student',
    label: 'Student Portal',
    name: 'Ananya Verma',
    email: 'ananya.v@cit.edu.in',
    dept: 'CSE',
    role: 'Student • B.Tech CSE (6th Sem)',
    avatarInitials: 'AV',
    cabin: 'Hostel Block C • Room 312',
    badge: 'Roll: CIT/23/CS-084',
  },
  admin: {
    id: 'admin',
    label: 'Dean / Admin Desk',
    name: 'Prof. M. R. Patnaik',
    email: 'dean.academics@cit.edu.in',
    dept: 'Admin',
    role: 'Dean of Academic Affairs',
    avatarInitials: 'MP',
    cabin: 'Administrative Block • Room 101',
    badge: 'Dean Academics',
  },
};

export function LandingPage({ currentUser, onEnterPortal, onNavigate }) {
  const [selectedRole, setSelectedRole] = useState('faculty');
  const [emailInput, setEmailInput] = useState(ROLE_PROFILES.faculty.email);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Switch role tab and pre-fill credentials
  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const profile = ROLE_PROFILES[roleKey];
    setEmailInput(profile.email);
    setPasswordInput('••••••••••••');
  };

  // Submit login form
  const handleLoginSubmit = (e) => {
    e?.preventDefault();
    setIsLoggingIn(true);
    const activeProfile = ROLE_PROFILES[selectedRole];
    const userToLogin = {
      ...activeProfile,
      email: emailInput || activeProfile.email,
      isLoggedIn: true,
    };

    setTimeout(() => {
      setIsLoggingIn(false);
      if (onEnterPortal) {
        onEnterPortal(userToLogin);
      } else {
        onNavigate?.('dashboard');
      }
    }, 350);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentProfile = ROLE_PROFILES[selectedRole];

  return (
    <div className="cit-landing-root animate-fade-in">
      {/* ========================================================
          TOP INSTITUTIONAL ANNOUNCEMENT BAR
          ======================================================== */}
      <div className="cit-top-bar">
        <div className="cit-top-bar-inner">
          <div className="cit-top-bar-left">
            <span className="cit-top-tag">
              <Award size={12} style={{ marginRight: 4 }} /> NAAC A++ (CGPA 3.82)
            </span>
            <span className="cit-top-divider">•</span>
            <span className="cit-top-tag">NIRF Top 50 Engineering</span>
            <span className="cit-top-divider">•</span>
            <span className="cit-top-text">
              <MapPin size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />
              Chilika Lake Campus, Khordha, Odisha
            </span>
          </div>

          <div className="cit-top-bar-right">
            <span className="cit-top-notice">
              <strong>Circular:</strong> AY 2026–27 Odd Semester Timetable &amp; Midsem Matrix Live
            </span>
            <div className="cit-top-quick-links">
              <button type="button" onClick={() => scrollToSection('notices')}>
                Notices
              </button>
              <button type="button" onClick={() => scrollToSection('departments')}>
                Departments
              </button>
              <button type="button" onClick={() => scrollToSection('login-box')}>
                Portal SSO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN INSTITUTIONAL HEADER & NAVIGATION
          ======================================================== */}
      <header className="cit-main-header">
        <div className="cit-header-inner">
          {/* Logo & Institute Name */}
          <div
            className="cit-brand"
            onClick={() => scrollToSection('overview')}
            role="button"
            tabIndex={0}
          >
            <CitLogo size={46} />
            <div className="cit-brand-text">
              <div className="cit-brand-title">CHILIKA INSTITUTE OF TECHNOLOGY</div>
              <div className="cit-brand-sub">
                AUTONOMOUS INSTITUTION &bull; ESTD. 1988
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="cit-nav">
            <button type="button" className="cit-nav-link" onClick={() => scrollToSection('overview')}>
              About CIT
            </button>
            <button type="button" className="cit-nav-link" onClick={() => scrollToSection('departments')}>
              Schools &amp; Depts
            </button>
            <button type="button" className="cit-nav-link" onClick={() => scrollToSection('notices')}>
              Academic Notices
            </button>
            <button
              type="button"
              className="cit-nav-link"
              onClick={() => {
                onEnterPortal?.(ROLE_PROFILES.faculty);
                onNavigate?.('timetable');
              }}
            >
              Master Timetable
            </button>

            {/* Quick jump to Login Card */}
            <button
              type="button"
              className="cit-header-login-btn"
              onClick={() => scrollToSection('login-box')}
            >
              <Lock size={13} style={{ marginRight: 6 }} />
              <span>Campus Portal Login</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="cit-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="cit-mobile-menu">
            <button type="button" className="cit-mobile-nav-item" onClick={() => scrollToSection('overview')}>
              About CIT
            </button>
            <button type="button" className="cit-mobile-nav-item" onClick={() => scrollToSection('departments')}>
              Schools &amp; Depts
            </button>
            <button type="button" className="cit-mobile-nav-item" onClick={() => scrollToSection('notices')}>
              Academic Notices
            </button>
            <button
              type="button"
              className="cit-mobile-nav-item"
              onClick={() => {
                setMobileMenuOpen(false);
                onEnterPortal?.(ROLE_PROFILES.faculty);
                onNavigate?.('timetable');
              }}
            >
              Master Timetable
            </button>
            <button
              type="button"
              className="cit-header-login-btn w-full"
              onClick={() => scrollToSection('login-box')}
            >
              <Lock size={14} style={{ marginRight: 6 }} />
              <span>Campus Portal Login</span>
            </button>
          </div>
        )}
      </header>

      {/* ========================================================
          HERO SECTION WITH THE CIT HERITAGE COLLEGE BUILDING
          IN THE BACKGROUND AND THE INTEGRATED LOGIN BOX
          ======================================================== */}
      <section id="overview" className="cit-hero-section">
        {/* The Grand Architectural College Building in Background */}
        <CitCampusBuilding />

        <div className="cit-hero-container">
          {/* Left Column: Glassmorphic Institutional Card */}
          <div className="cit-hero-left">
            <div className="cit-prestige-ribbon">
              <span className="cit-prestige-badge">
                <Sparkles size={13} style={{ marginRight: 6, color: '#c54a26' }} />
                Autonomous Academic Governance &bull; AY 2026–27
              </span>
            </div>

            <h1 className="cit-hero-title">
              <span className="cit-hero-title-word">CHILIKA</span>
              <span className="cit-hero-title-word">INSTITUTE OF</span>
              <span className="cit-hero-title-word">TECHNOLOGY</span>
            </h1>

            <p className="cit-hero-lead">
              A premier autonomous engineering and technical research institute on the shores of Chilika Lake.
              Governed by an automated, conflict-free academic orchestration matrix coordinating 189 weekly
              sessions, 27 academic venues (including 7 specialized research laboratories).
            </p>

            <div className="cit-building-pill">
              <Camera size={14} style={{ marginRight: 6, color: '#c54a26' }} />
              <span>Heritage Central Academic Block</span>
            </div>
          </div>

          {/* Right Column: Glassmorphic CIT Collegiate Portal Login Box */}
          <div id="login-box" className="cit-hero-right">
            <div className="cit-login-card">
              {/* Card Header */}
              <div className="cit-login-header">
                <div>
                  <h3 className="cit-login-title">CIT Campus Portal</h3>
                  <p className="cit-login-sub">Single Sign-On (SSO) &bull;</p>
                </div>
                <div className="cit-login-shield">
                  <Shield size={12} style={{ color: '#059669', marginRight: 4 }} />
                  <span>Secure 256-bit</span>
                </div>
              </div>

              {/* User Type Section */}
              <div className="cit-user-type-group">
                <label className="cit-user-type-label">User Type</label>
                <div className="cit-role-tabs">
                  <button
                    type="button"
                    className={`cit-role-tab ${selectedRole === 'faculty' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('faculty')}
                  >
                    <User size={13} style={{ marginRight: 5 }} />
                    Faculty
                  </button>
                  <button
                    type="button"
                    className={`cit-role-tab ${selectedRole === 'student' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('student')}
                  >
                    <GraduationCap size={13} style={{ marginRight: 5 }} />
                    Student
                  </button>
                  <button
                    type="button"
                    className={`cit-role-tab ${selectedRole === 'admin' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('admin')}
                  >
                    <Building size={13} style={{ marginRight: 5 }} />
                    Dean / Admin
                  </button>
                </div>
              </div>

              {/* Quick Profile Match */}
              <div className="cit-quick-profile-group">
                <label className="cit-user-type-label">Quick Profile Match</label>
                <div className="cit-active-profile-pill" onClick={() => handleRoleSelect(selectedRole)}>
                  <div className="cit-profile-avatar">{currentProfile.avatarInitials}</div>
                  <div className="cit-profile-details">
                    <div className="cit-profile-name">{currentProfile.name}</div>
                    <div className="cit-profile-role">{currentProfile.role}</div>
                  </div>
                  <span className="cit-profile-badge">{currentProfile.badge}</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="cit-login-form">
                <div className="cit-form-group">
                  <div className="cit-input-wrapper">
                    <User size={16} className="cit-input-icon" />
                    <input
                      id="cit-email"
                      type="email"
                      className="cit-form-input"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Institutional Email"
                      required
                    />
                  </div>
                </div>

                <div className="cit-form-group">
                  <div className="cit-label-row">
                    <label htmlFor="cit-password" className="cit-form-label">
                      Password
                    </label>
                    <span className="cit-forgot-link">Forgot password?</span>
                  </div>
                  <div className="cit-input-wrapper">
                    <Lock size={16} className="cit-input-icon" />
                    <input
                      id="cit-password"
                      type={showPassword ? 'text' : 'password'}
                      className="cit-form-input"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="cit-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="cit-login-submit-btn"
                  disabled={isLoggingIn}
                >
                  <span>{isLoggingIn ? 'Authenticating...' : 'Login to Portal →'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          ACADEMIC CIRCULARS & NOTICES TICKER
          ======================================================== */}
      <section id="notices" className="cit-notices-section">
        <div className="cit-section-container">
          <div className="cit-section-header-row">
            <div>
              <span className="cit-section-pill">Official Notices</span>
              <h2 className="cit-section-title">Academic Circulars &amp; Schedules</h2>
            </div>
            <button
              type="button"
              className="cit-link-btn"
              onClick={() => {
                onEnterPortal?.(ROLE_PROFILES.faculty);
                onNavigate?.('rescheduling');
              }}
            >
              <span>View Approvals &amp; Notifications</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="cit-notices-grid">
            <div className="cit-notice-card">
              <div className="cit-notice-top">
                <span className="cit-notice-tag cit-tag-terracotta">AY 2026–27</span>
                <span className="cit-notice-date">October 28, 2026</span>
              </div>
              <h4 className="cit-notice-heading">
                Odd Semester Master Timetable Published (P1–P13)
              </h4>
              <p className="cit-notice-excerpt">
                Full clash-free curriculum allocation for 14 student cohorts across CSE, ECE, ME, IT, and EE.
                Faculty may view daily slot occupancy in the timetable viewer.
              </p>
              <button
                type="button"
                className="cit-notice-action"
                onClick={() => {
                  onEnterPortal?.(ROLE_PROFILES.faculty);
                  onNavigate?.('timetable');
                }}
              >
                <span>Check Class Schedule</span> &rarr;
              </button>
            </div>

            <div className="cit-notice-card">
              <div className="cit-notice-top">
                <span className="cit-notice-tag cit-tag-ochre">Examinations</span>
                <span className="cit-notice-date">October 30, 2026</span>
              </div>
              <h4 className="cit-notice-heading">
                Midsem Examination Hall Allocation &amp; Invigilation Matrix
              </h4>
              <p className="cit-notice-excerpt">
                41 midsem exams scheduled with 0 room conflicts across 27 lecture halls.
                Mandatory lunch intermission (12:55–13:45) strictly locked institute-wide.
              </p>
              <button
                type="button"
                className="cit-notice-action"
                onClick={() => {
                  onEnterPortal?.(ROLE_PROFILES.faculty);
                  onNavigate?.('dashboard');
                }}
              >
                <span>View Exam Slots</span> &rarr;
              </button>
            </div>

            <div className="cit-notice-card">
              <div className="cit-notice-top">
                <span className="cit-notice-tag cit-tag-sage">Spectra Fest</span>
                <span className="cit-notice-date">November 01, 2026</span>
              </div>
              <h4 className="cit-notice-heading">
                Spectra 2026 Technical Fest: Central Auditorium Bookings
              </h4>
              <p className="cit-notice-excerpt">
                25 flagship events registered. Faculty permission safeguards active for all venue adjustments
                in Auditorium, OAT, and Seminar Halls.
              </p>
              <button
                type="button"
                className="cit-notice-action"
                onClick={() => {
                  onEnterPortal?.(ROLE_PROFILES.faculty);
                  onNavigate?.('spectra');
                }}
              >
                <span>Spectra Event Desk</span> &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CORE ACADEMIC SCHOOLS & DEPARTMENTS
          ======================================================== */}
      <section id="departments" className="cit-departments-section">
        <div className="cit-section-container">
          <div className="cit-section-header-center">
            <span className="cit-section-pill">Academics</span>
            <h2 className="cit-section-title">Academic Schools &amp; Departments</h2>
            <p className="cit-section-desc">
              Empowering students through accredited engineering programs, state-of-the-art computational centers,
              and dedicated faculty guidance.
            </p>
          </div>

          <div className="cit-depts-grid">
            <div className="cit-dept-card">
              <div className="cit-dept-header">
                <div className="cit-dept-icon-box terracotta">
                  <GraduationCap size={22} />
                </div>
                <div className="cit-dept-meta">
                  <span className="cit-dept-code">DEPT OF CSE</span>
                  <h4 className="cit-dept-name">Computer Science &amp; Engineering</h4>
                </div>
              </div>
              <p className="cit-dept-info">
                B.Tech, M.Tech, and Ph.D. programs focusing on Artificial Intelligence, Distributed Systems,
                Cybersecurity, and Algorithm Engineering.
              </p>
              <div className="cit-dept-stats">
                <span><strong>48</strong> Weekly Slots</span>
                <span><strong>4</strong> Advanced Labs</span>
              </div>
              <button
                type="button"
                className="cit-dept-link"
                onClick={() => {
                  onEnterPortal?.(ROLE_PROFILES.faculty);
                  onNavigate?.('courses');
                }}
              >
                Browse CSE Courses &rarr;
              </button>
            </div>

            <div className="cit-dept-card">
              <div className="cit-dept-header">
                <div className="cit-dept-icon-box ochre">
                  <Sparkles size={22} />
                </div>
                <div className="cit-dept-meta">
                  <span className="cit-dept-code">DEPT OF ECE</span>
                  <h4 className="cit-dept-name">Electronics &amp; Communication</h4>
                </div>
              </div>
              <p className="cit-dept-info">
                VLSI design, embedded IoT architectures, semiconductor technologies, and microwave satellite communication labs.
              </p>
              <div className="cit-dept-stats">
                <span><strong>42</strong> Weekly Slots</span>
                <span><strong>3</strong> Specialized Labs</span>
              </div>
              <button
                type="button"
                className="cit-dept-link"
                onClick={() => {
                  onEnterPortal?.(ROLE_PROFILES.faculty);
                  onNavigate?.('courses');
                }}
              >
                Browse ECE Courses &rarr;
              </button>
            </div>

            <div className="cit-dept-card">
              <div className="cit-dept-header">
                <div className="cit-dept-icon-box sage">
                  <Building size={22} />
                </div>
                <div className="cit-dept-meta">
                  <span className="cit-dept-code">DEPT OF ME</span>
                  <h4 className="cit-dept-name">Mechanical Engineering</h4>
                </div>
              </div>
              <p className="cit-dept-info">
                Robotics, thermal and fluids analysis, computational fluid dynamics (CFD), and automated additive manufacturing.
              </p>
              <div className="cit-dept-stats">
                <span><strong>36</strong> Weekly Slots</span>
                <span><strong>4</strong> Heavy Machine Labs</span>
              </div>
              <button
                type="button"
                className="cit-dept-link"
                onClick={() => {
                  onEnterPortal?.(ROLE_PROFILES.faculty);
                  onNavigate?.('courses');
                }}
              >
                Browse ME Courses &rarr;
              </button>
            </div>

            <div className="cit-dept-card">
              <div className="cit-dept-header">
                <div className="cit-dept-icon-box terracotta">
                  <FileText size={22} />
                </div>
                <div className="cit-dept-meta">
                  <span className="cit-dept-code">DEPT OF IT</span>
                  <h4 className="cit-dept-name">Information Technology</h4>
                </div>
              </div>
              <p className="cit-dept-info">
                Cloud computing platforms, full-stack software development, data science, and secure enterprise networking.
              </p>
              <div className="cit-dept-stats">
                <span><strong>35</strong> Weekly Slots</span>
                <span><strong>2</strong> Cloud Labs</span>
              </div>
              <button
                type="button"
                className="cit-dept-link"
                onClick={() => {
                  onEnterPortal?.(ROLE_PROFILES.faculty);
                  onNavigate?.('courses');
                }}
              >
                Browse IT Courses &rarr;
              </button>
            </div>

            <div className="cit-dept-card">
              <div className="cit-dept-header">
                <div className="cit-dept-icon-box ochre">
                  <Compass size={22} />
                </div>
                <div className="cit-dept-meta">
                  <span className="cit-dept-code">DEPT OF EE</span>
                  <h4 className="cit-dept-name">Electrical Engineering</h4>
                </div>
              </div>
              <p className="cit-dept-info">
                Power systems, renewable microgrids, high-voltage test engineering, and electric vehicle drive systems.
              </p>
              <div className="cit-dept-stats">
                <span><strong>28</strong> Weekly Slots</span>
                <span><strong>3</strong> Power Systems Labs</span>
              </div>
              <button
                type="button"
                className="cit-dept-link"
                onClick={() => {
                  onEnterPortal?.(ROLE_PROFILES.faculty);
                  onNavigate?.('courses');
                }}
              >
                Browse EE Courses &rarr;
              </button>
            </div>

            <div className="cit-dept-card">
              <div className="cit-dept-header">
                <div className="cit-dept-icon-box sage">
                  <BookOpen size={22} />
                </div>
                <div className="cit-dept-meta">
                  <span className="cit-dept-code">RESEARCH &amp; BS</span>
                  <h4 className="cit-dept-name">Basic Sciences &amp; Research</h4>
                </div>
              </div>
              <p className="cit-dept-info">
                Applied Mathematics, Quantum Physics, Material Sciences, and environmental lake hydrology research initiatives.
              </p>
              <div className="cit-dept-stats">
                <span><strong>Interdisciplinary</strong></span>
                <span><strong>Central Library</strong></span>
              </div>
              <button
                type="button"
                className="cit-dept-link"
                onClick={() => {
                  onEnterPortal?.(ROLE_PROFILES.faculty);
                  onNavigate?.('faculty-network');
                }}
              >
                View Faculty Directory &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CAMPUS INFRASTRUCTURE & SMART ORCHESTRATION
          ======================================================== */}
      <section className="cit-features-section">
        <div className="cit-section-container">
          <div className="cit-features-banner">
            <div className="cit-features-copy">
              <span className="cit-features-tag">Campus Facilities &amp; Technology</span>
              <h2 className="cit-features-heading">
                Smart Academic Matrix &amp; Infrastructure
              </h2>
              <p className="cit-features-desc">
                From our heritage central block to our 27 academic venues (including 20 smart lecture halls and 7 specialized research laboratories),
                every venue at CIT is mapped into an autonomous schedule solver that eliminates double-bookings.
              </p>
              <div className="cit-features-bullets">
                <div className="cit-feature-bullet">
                  <CheckCircle2 size={16} className="bullet-icon" />
                  <span>Central Auditorium (1,200 seats) with Open Air Theatre</span>
                </div>
                <div className="cit-feature-bullet">
                  <CheckCircle2 size={16} className="bullet-icon" />
                  <span>Strict faculty permission consent required for any lecture alteration</span>
                </div>
                <div className="cit-feature-bullet">
                  <CheckCircle2 size={16} className="bullet-icon" />
                  <span>Natural language AI reservation assistant in English &amp; Hinglish</span>
                </div>
              </div>
            </div>

            <div className="cit-features-cta-box">
              <CitLogo size={52} />
              <h3 className="cit-cta-title">Ready to Enter CIT Campus Portal?</h3>
              <p className="cit-cta-text">
                Access your personalized timetable, manage department sessions, approve room swaps, and query the campus AI assistant.
              </p>
              <button
                type="button"
                className="cit-btn-primary w-full"
                onClick={() => {
                  onEnterPortal?.(ROLE_PROFILES.faculty);
                  onNavigate?.('dashboard');
                }}
              >
                <span>Enter Campus Portal as Dr. A. Sharma</span>
                <ArrowRight size={16} style={{ marginLeft: 8 }} />
              </button>
              <button
                type="button"
                className="cit-btn-text"
                onClick={() => scrollToSection('login-box')}
              >
                Switch Role / Use Custom Credentials &uarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          INSTITUTIONAL FOOTER
          ======================================================== */}
      <footer className="cit-footer">
        <div className="cit-footer-container">
          <div className="cit-footer-main">
            <div className="cit-footer-col brand-col">
              <div className="cit-footer-brand-row">
                <CitLogo size={40} />
                <div>
                  <div className="cit-footer-name">CHILIKA INSTITUTE OF TECHNOLOGY</div>
                  <div className="cit-footer-tag">Autonomous &bull; Estd. 1988</div>
                </div>
              </div>
              <p className="cit-footer-desc">
                Chilika Knowledge Park, Lake View Campus, Khordha, Odisha &bull; PIN 752030, India.
                Recognized by UGC under Section 2(f) and 12(B), AICTE Approved, NAAC &lsquo;A++&rsquo; Accredited.
              </p>
              <div className="cit-footer-contact">
                <div>Tel: +91 (0674) 289-4000</div>
                <div>Registrar: registrar@cit.edu.in</div>
              </div>
            </div>

            <div className="cit-footer-col">
              <h5 className="cit-footer-heading">Academic Portals</h5>
              <ul className="cit-footer-links">
                <li>
                  <button type="button" onClick={() => scrollToSection('login-box')}>
                    Faculty Portal
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollToSection('login-box')}>
                    Student ERP
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onEnterPortal?.(ROLE_PROFILES.faculty);
                      onNavigate?.('timetable');
                    }}
                  >
                    Master Timetable Viewer
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onEnterPortal?.(ROLE_PROFILES.faculty);
                      onNavigate?.('venues');
                    }}
                  >
                    Venue Booking Status
                  </button>
                </li>
              </ul>
            </div>

            <div className="cit-footer-col">
              <h5 className="cit-footer-heading">Administration</h5>
              <ul className="cit-footer-links">
                <li><span>Academic Council</span></li>
                <li><span>Controller of Examinations</span></li>
                <li><span>Internal Quality Assurance (IQAC)</span></li>
                <li><span>NIRF Institutional Disclosures</span></li>
                <li><span>Student Grievance Redressal</span></li>
              </ul>
            </div>

            <div className="cit-footer-col">
              <h5 className="cit-footer-heading">Campus Life</h5>
              <ul className="cit-footer-links">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onEnterPortal?.(ROLE_PROFILES.faculty);
                      onNavigate?.('spectra');
                    }}
                  >
                    Spectra Technical Fest
                  </button>
                </li>
                <li><span>Central Library &amp; Repositories</span></li>
                <li><span>Hostels &amp; Dining Halls</span></li>
                <li><span>Sports Complex &amp; OAT</span></li>
                <li><span>Anti-Ragging Compliance Cell</span></li>
              </ul>
            </div>
          </div>

          <div className="cit-footer-bottom">
            <div className="cit-footer-copy">
              &copy; {new Date().getFullYear()} Chilika Institute of Technology (CIT). All Rights Reserved.
            </div>
            <div className="cit-footer-bottom-links">
              <span>Privacy Policy</span>
              <span>&bull;</span>
              <span>Terms of Access</span>
              <span>&bull;</span>
              <span>RTI</span>
              <span>&bull;</span>
              <button
                type="button"
                className="cit-back-to-top"
                onClick={() => scrollToSection('overview')}
              >
                Top &uarr;
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
