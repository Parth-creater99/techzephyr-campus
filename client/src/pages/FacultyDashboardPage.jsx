import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Clock,
  Users,
  Building2,
  Sparkles,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  ArrowRight,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  AlertTriangle,
  UserX,
  Zap,
  Award,
  Search,
  Filter,
  Play,
  Pause,
  MessageSquare,
  Send,
  Bell,
  Bot,
  Settings as SettingsIcon,
  Check,
  X,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import {
  getStoredTimetableSessions,
  saveStoredTimetableSessions,
  PERIODS,
  WEEKDAYS,
  FACULTY_DATA,
  ROOMS_DATA,
} from '../services/mockData';
import './FacultyDashboardPage.css';

// Initial Campus Daily Notices
const INITIAL_DAILY_NOTICES = [
  {
    id: 'notif-1',
    category: 'absence',
    categoryName: 'Faculty Absence & Substitute',
    title: 'Prof. Dinesh Rao (Dept. of EE) on Approved Medical Leave Today',
    details:
      'EE201 (Electrical Machines at 14:00 in CR-102) has been assigned to substitute lecturer Prof. Rajesh Kanna. Students should report directly to CR-102.',
    time: 'Today • 14:00',
    dateStr: 'Today',
    badgeColor: 'absence',
    urgent: true,
  },
  {
    id: 'notif-2',
    category: 'extra',
    categoryName: 'Extra / Remedial Class',
    title: 'Dr. A. Sharma Taking Extra OS Remedial Class for CSE-3 Cohort',
    details:
      'CS301: Operating Systems & Kernel Virtualization extra problem-solving session scheduled today in LH-101 from 14:00 to 15:00. Mandatory for all 3rd Year CSE students.',
    time: 'Today • 14:00 – 15:00 (P6)',
    dateStr: 'Today',
    badgeColor: 'extra',
  },
  {
    id: 'notif-3',
    category: 'guest',
    categoryName: 'Distinguished Guest Keynote',
    title: 'Dr. K. Radhakrishnan (Former Chairman, ISRO) Keynote Session',
    details:
      'Special Distinguished Address on "Embedded Real-Time Avionics & Satellite Computing". Venue: Central Auditorium (AUD-1). Seating starts at 15:45.',
    time: 'Today • 16:00 – 17:30',
    dateStr: 'Today',
    badgeColor: 'guest',
  },
  {
    id: 'notif-4',
    category: 'absence',
    categoryName: 'Faculty Absence & Duty',
    title: 'Dr. Geeta Pillai (Dept. of IT) on Academic Conference Duty',
    details:
      'IT202 (Information Security Tutorial at 17:00) has been relocated to Computer Lab-3 for guided self-study under Lab Assistant guidance.',
    time: 'Today • 17:00 (P9)',
    dateStr: 'Today',
    badgeColor: 'absence',
  },
  {
    id: 'notif-5',
    category: 'extra',
    categoryName: 'Extra Specialized Lab',
    title: 'Prof. Rohit Kulkarni Extra Mechanical CAD Lab Evaluation for ME-3',
    details:
      'CAD Modeling Workshop Lab-6 will remain open for extra submissions and practical checks between 17:00 and 19:00 today.',
    time: 'Today • 17:00 – 19:00',
    dateStr: 'Today',
    badgeColor: 'extra',
  },
  {
    id: 'notif-6',
    category: 'guest',
    categoryName: 'Industry Keynote & Placement Talk',
    title: 'Mr. S. Chatterjee (VP of Cloud, Tech Zephyr) Live Industry Session',
    details:
      'High-throughput constraint solvers and large-scale campus infrastructure talk in Seminar Hall A (Sem-A). Open to Year 3 & 4 students.',
    time: 'Today • 18:00 – 19:30 (P10)',
    dateStr: 'Today',
    badgeColor: 'guest',
  },
];

// Sample Pending Swaps
const SAMPLE_SWAP_REQUESTS = [
  {
    id: 'sw-1',
    dept: 'CSE',
    faculty: 'Dr. P. Mishra',
    time: '09:00 AM Lab (CS305L)',
    target: 'Monday P2 Lecture (CS302)',
    status: 'Swap Pending',
    reason: 'Urgent Departmental Committee Hearing',
  },
  {
    id: 'sw-2',
    dept: 'ME',
    faculty: 'Prof. K. Das',
    time: '11:00 AM Lecture (ME201)',
    target: 'Tuesday P4 Tutorial (ME203)',
    status: 'Swap Pending',
    reason: 'Accreditation Lab Inspection Duty',
  },
  {
    id: 'sw-3',
    dept: 'ECE',
    faculty: 'Prof. Ananya Sen',
    time: '02:00 PM Signals (EC204)',
    target: 'Wednesday P1 Circuits (EC201)',
    status: 'Swap Pending',
    reason: 'Guest Lecturer Accompaniment',
  },
];

// Sample System Notifications
const SAMPLE_SYSTEM_NOTIFICATIONS = [
  {
    id: 'notif-sys-1',
    type: 'schedule',
    title: 'Timetable Matrix Synchronized',
    time: '17m ago',
    desc: 'Real time updated Dr. A. Sharma schedule • 0 clash violations detected across 189 slots.',
    icon: 'bell',
  },
  {
    id: 'notif-sys-2',
    type: 'ai',
    title: 'AI Assistant Suggestion',
    time: '12m ago',
    desc: 'Real time updates tomorrow: Room Lab-1 has a 1-hour free window at Wednesday P4.',
    icon: 'bot',
  },
  {
    id: 'notif-sys-3',
    type: 'venue',
    title: 'Auditorium Booking Confirmed',
    time: '45m ago',
    desc: 'Central Auditorium cleared for Spectra Tech Fest rehearsal at 18:00 (P10).',
    icon: 'building',
  },
];

export function FacultyDashboardPage({ currentUser, onNavigate }) {
  const [sessions, setSessions] = useState(getStoredTimetableSessions);
  const [activeWeekdayId, setActiveWeekdayId] = useState('mon');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // 1. Sliding Daily Notice State
  const [dailyNotices, setDailyNotices] = useState(() => {
    try {
      const saved = localStorage.getItem('cit_daily_notices_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_DAILY_NOTICES;
  });
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isNoticeAutoPlay, setIsNoticeAutoPlay] = useState(true);
  const [noticeFilter, setNoticeFilter] = useState('all');
  const [isPostNoticeOpen, setIsPostNoticeOpen] = useState(false);
  const [newNoticeForm, setNewNoticeForm] = useState({
    category: 'extra',
    title: '',
    details: '',
    time: 'Today • 15:00',
  });

  // Filtered Daily Notices
  const activeNotices = useMemo(() => {
    if (noticeFilter === 'all') return dailyNotices;
    return dailyNotices.filter((n) => n.category === noticeFilter);
  }, [dailyNotices, noticeFilter]);

  // Notice Carousel Auto-rotation timer
  useEffect(() => {
    if (!isNoticeAutoPlay || activeNotices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentNoticeIndex((prev) => (prev + 1) % activeNotices.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isNoticeAutoPlay, activeNotices.length]);

  const handleNextNotice = () => {
    setCurrentNoticeIndex((prev) => (prev + 1) % activeNotices.length);
  };

  const handlePrevNotice = () => {
    setCurrentNoticeIndex((prev) => (prev - 1 + activeNotices.length) % activeNotices.length);
  };

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!newNoticeForm.title.trim()) return;

    const catNameMap = {
      absence: 'Faculty Absence & Substitute',
      extra: 'Extra / Remedial Class',
      guest: 'Distinguished Guest Keynote',
      event: 'Special Campus Event',
    };

    const newEntry = {
      id: `notice-${Date.now()}`,
      category: newNoticeForm.category,
      categoryName: catNameMap[newNoticeForm.category] || 'Campus Notice',
      title: newNoticeForm.title,
      details: newNoticeForm.details || 'Official announcement from academic administration.',
      time: newNoticeForm.time || 'Today',
      dateStr: 'Today',
      badgeColor: newNoticeForm.category,
    };

    const updated = [newEntry, ...dailyNotices];
    setDailyNotices(updated);
    localStorage.setItem('cit_daily_notices_v1', JSON.stringify(updated));
    setCurrentNoticeIndex(0);
    setIsPostNoticeOpen(false);
    setNewNoticeForm({ category: 'extra', title: '', details: '', time: 'Today • 15:00' });
  };

  // 2. Small Timetable with Subjects View Mode: 'day' (Day Subjects) | 'week' (Weekly Matrix)
  const [ttViewMode, setTtViewMode] = useState('day');

  // 3. Faculty Roster & Workload Stats
  const [facultySearch, setFacultySearch] = useState('');
  const [facultyDeptFilter, setFacultyDeptFilter] = useState('all');

  const filteredFacultyList = useMemo(() => {
    return FACULTY_DATA.filter((f) => {
      if (facultyDeptFilter !== 'all' && f.dept !== facultyDeptFilter) return false;
      if (facultySearch.trim()) {
        const q = facultySearch.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.cabin.toLowerCase().includes(q) || f.dept.toLowerCase().includes(q);
      }
      return true;
    });
  }, [facultyDeptFilter, facultySearch]);

  const weekdayNames = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
  };

  const dailyClasses = useMemo(() => {
    return sessions.filter((s) => s.day === activeWeekdayId);
  }, [sessions, activeWeekdayId]);

  const handleToggleClassDone = (sessionId) => {
    const updated = sessions.map((s) => {
      if (s.id === sessionId) {
        const isDone = s.status === 'completed';
        return {
          ...s,
          status: isDone ? 'upcoming' : 'completed',
        };
      }
      return s;
    });
    setSessions(updated);
    saveStoredTimetableSessions(updated);
  };

  const completedCount = dailyClasses.filter((c) => c.status === 'completed').length;
  const completionPercentage = dailyClasses.length > 0 ? Math.round((completedCount / dailyClasses.length) * 100) : 0;

  const currentNotice = activeNotices[currentNoticeIndex] || activeNotices[0] || INITIAL_DAILY_NOTICES[0];

  // Weekday navigation for Schedule Section
  const weekdayList = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const handlePrevDay = () => {
    const idx = weekdayList.indexOf(activeWeekdayId);
    const newIdx = (idx - 1 + weekdayList.length) % weekdayList.length;
    setActiveWeekdayId(weekdayList[newIdx]);
    setActiveSlideIndex(0);
  };
  const handleNextDay = () => {
    const idx = weekdayList.indexOf(activeWeekdayId);
    const newIdx = (idx + 1) % weekdayList.length;
    setActiveWeekdayId(weekdayList[newIdx]);
    setActiveSlideIndex(0);
  };

  return (
    <div className="faculty-dashboard-container animate-fade-in-up" style={{ paddingBottom: 40 }}>
      {/* ==========================================================================
          TOP GREETING & ROLE INDICATOR BAR
          ========================================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Welcome back, {currentUser?.name || 'Dr. A. Sharma'}! 👋
          </h2>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              background: '#fff0eb',
              color: 'var(--accent-terracotta)',
              border: '1.5px solid #fed7aa',
              padding: '3px 12px',
              borderRadius: 9999,
            }}
          >
            Lecturer Mode
          </span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              background: '#f1f5f9',
              color: '#475569',
              padding: '3px 10px',
              borderRadius: 9999,
            }}
          >
            HOD CSE • Cabin A-201
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            className="app-btn-outline"
            style={{ fontSize: 12, padding: '7px 14px' }}
            onClick={() => onNavigate?.('timetable')}
          >
            <Clock size={14} />
            <span>Master Schedule (P1–P13)</span>
          </button>
          <button
            type="button"
            className="app-btn-lime"
            style={{ fontSize: 12, padding: '7px 14px' }}
            onClick={() => setIsPostNoticeOpen(true)}
          >
            <Plus size={14} />
            <span>Post Daily Notice</span>
          </button>
        </div>
      </div>

      {/* ==========================================================================
          1. Hero Animated Sliding Daily Notice Board
          ========================================================================== */}
      <div className="daily-notice-hero-card">
        <div className="notice-hero-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="notice-badge-pulsing">
              <span className="pulse-dot-red" />
              <span>LIVE CAMPUS DAILY NOTICES &amp; UPDATES</span>
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Real-time faculty absences, extra class swaps, and visiting dignitaries
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Category filter pills */}
            <div className="clean-mode-pill-container" style={{ padding: 2 }}>
              <button
                type="button"
                className={`mode-toggle-btn ${noticeFilter === 'all' ? 'active' : ''}`}
                style={{ padding: '4px 10px', fontSize: 11 }}
                onClick={() => {
                  setNoticeFilter('all');
                  setCurrentNoticeIndex(0);
                }}
              >
                All ({dailyNotices.length})
              </button>
              <button
                type="button"
                className={`mode-toggle-btn ${noticeFilter === 'absence' ? 'active' : ''}`}
                style={{ padding: '4px 10px', fontSize: 11 }}
                onClick={() => {
                  setNoticeFilter('absence');
                  setCurrentNoticeIndex(0);
                }}
              >
                Absences (2)
              </button>
              <button
                type="button"
                className={`mode-toggle-btn ${noticeFilter === 'extra' ? 'active' : ''}`}
                style={{ padding: '4px 10px', fontSize: 11 }}
                onClick={() => {
                  setNoticeFilter('extra');
                  setCurrentNoticeIndex(0);
                }}
              >
                Extra Classes (2)
              </button>
              <button
                type="button"
                className={`mode-toggle-btn ${noticeFilter === 'guest' ? 'active' : ''}`}
                style={{ padding: '4px 10px', fontSize: 11 }}
                onClick={() => {
                  setNoticeFilter('guest');
                  setCurrentNoticeIndex(0);
                }}
              >
                Guest Speakers (2)
              </button>
            </div>
          </div>
        </div>

        {/* Sliding Card Viewport */}
        <div className="notice-carousel-viewport">
          {currentNotice && (
            <div
              key={currentNotice.id}
              className={`notice-slide-card notice-type-${currentNotice.category} animate-fade-in`}
            >
              <div className="notice-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="notice-category-pill">
                    {currentNotice.category === 'absence' && '🔴 ABSENCE NOTICE'}
                    {currentNotice.category === 'extra' && '⚡ EXTRA CLASS'}
                    {currentNotice.category === 'guest' && '🌟 DISTINGUISHED GUEST'}
                    {currentNotice.category === 'event' && '✦ SPECIAL EVENT'}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {currentNotice.categoryName}
                  </span>
                </div>

                <div className="notice-time-pill">
                  <Clock size={13} />
                  <span>{currentNotice.time}</span>
                </div>
              </div>

              <div className="notice-title-main">{currentNotice.title}</div>
              <div className="notice-detail-text">{currentNotice.details}</div>
            </div>
          )}
        </div>

        {/* Carousel Bottom Controls */}
        <div className="notice-controls-row">
          <div className="notice-indicators-wrap">
            {activeNotices.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`notice-indicator-dot ${currentNoticeIndex === idx ? 'active' : ''}`}
                onClick={() => setCurrentNoticeIndex(idx)}
                title={`Go to notice ${idx + 1}`}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="prompt-chip-btn"
              onClick={() => setIsNoticeAutoPlay(!isNoticeAutoPlay)}
              style={{ fontSize: 11, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              {isNoticeAutoPlay ? <Pause size={11} /> : <Play size={11} />}
              <span>{isNoticeAutoPlay ? 'Auto-Sliding' : 'Paused'}</span>
            </button>

            <div className="notice-nav-arrows">
              <button
                type="button"
                className="notice-arrow-btn"
                onClick={handlePrevNotice}
                title="Previous Notice"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="notice-arrow-btn"
                onClick={handleNextNotice}
                title="Next Notice"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          2. Weekly Teaching Overview & Institutional Stats
          ========================================================================== */}
      <div className="dashboard-scroll-section">
        <div className="dashboard-section-header">
          <div>
            <h3 className="dashboard-section-title">
              <BarChart3 size={20} color="var(--accent-terracotta)" />
              <span>Weekly Teaching Overview &amp; Faculty Workload</span>
            </h3>
            <p className="dashboard-section-sub">
              189 teaching sessions across 40 senior faculty &bull; 100% Conflict-Free Scheduling Matrix
            </p>
          </div>

          <button
            type="button"
            className="app-btn-outline"
            style={{ fontSize: 12, padding: '6px 12px' }}
            onClick={() => onNavigate?.('settings')}
          >
            <SettingsIcon size={14} />
            <span>Overview Settings</span>
          </button>
        </div>

        {/* 4 Core KPI Stat Cards */}
        <div className="faculty-stats-grid-cards">
          <div className="fac-stat-box">
            <div className="fac-stat-icon-wrap" style={{ background: '#fdf2ed', color: '#c54a26' }}>
              <CalendarIcon size={22} />
            </div>
            <div>
              <div className="fac-stat-val">189 Sessions</div>
              <div className="fac-stat-label">243 Weekly Teaching Hours</div>
              <div className="fac-stat-sub">
                <strong style={{ color: '#16a34a' }}>100% Scheduled</strong> &bull; 0 Hard Clashes
              </div>
            </div>
          </div>

          <div className="fac-stat-box">
            <div className="fac-stat-icon-wrap" style={{ background: '#eff6f2', color: '#2d5a45' }}>
              <Clock size={22} />
            </div>
            <div>
              <div className="fac-stat-val">243 Teaching Hrs</div>
              <div className="fac-stat-label">Weekly Academic Load</div>
              <div className="fac-stat-sub">Across 189 Mon–Sat Sessions</div>
            </div>
          </div>

          <div className="fac-stat-box">
            <div className="fac-stat-icon-wrap" style={{ background: '#fef7ee', color: '#9c5912' }}>
              <Zap size={22} />
            </div>
            <div>
              <div className="fac-stat-val">40 Faculty</div>
              <div className="fac-stat-label">Senior Teaching Staff</div>
              <div className="fac-stat-sub">38 On-Campus &bull; 2 On Leave</div>
            </div>
          </div>

          <div className="fac-stat-box">
            <div className="fac-stat-icon-wrap" style={{ background: '#faf2f4', color: '#84283c' }}>
              <Award size={22} />
            </div>
            <div>
              <div className="fac-stat-val">100% Compliance</div>
              <div className="fac-stat-label">AI Matrix Governance</div>
              <div className="fac-stat-sub">0 Clash &bull; Real-time Swap Hub</div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          3. New Small Timetable with Subjects (P1 to P13 • 09:00 - 22:00)
          ========================================================================== */}
      <div className="dashboard-scroll-section">
        <div className="small-timetable-card">
          {/* Header Row */}
          <div className="small-timetable-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} color="var(--accent-terracotta)" />
                <h3 className="small-timetable-title">
                  Class Timetable &amp; Subjects
                </h3>
                <span className="small-tt-badge">
                  P1 to P13 (09:00 – 22:00)
                </span>
              </div>
              <span className="small-timetable-sub">
                Compact schedule displaying full course subjects • 1-hour classes from 9:00 AM • Evening events (P10–P13)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {/* Day Selector Pills: MON, TUE, WED, THU, FRI, SAT */}
              <div className="small-tt-day-pills">
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={`small-tt-day-btn ${activeWeekdayId === w ? 'active' : ''}`}
                    onClick={() => setActiveWeekdayId(w)}
                  >
                    {w.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle: Day Subjects vs Weekly 6-Day Matrix */}
              <div className="small-tt-view-toggle">
                <button
                  type="button"
                  className={`small-tt-toggle-btn ${ttViewMode === 'day' ? 'active' : ''}`}
                  onClick={() => setTtViewMode('day')}
                  title="View subjects for selected day"
                >
                  Day Subjects
                </button>
                <button
                  type="button"
                  className={`small-tt-toggle-btn ${ttViewMode === 'week' ? 'active' : ''}`}
                  onClick={() => setTtViewMode('week')}
                  title="View compact weekly grid across all days"
                >
                  Weekly Matrix
                </button>
              </div>

              {/* Master Schedule Link */}
              <button
                type="button"
                className="app-btn-outline"
                style={{ fontSize: 11, padding: '5px 10px' }}
                onClick={() => onNavigate?.('timetable')}
                title="Open full interactive master schedule"
              >
                <span>Full Timetable</span>
                <ArrowRight size={12} style={{ marginLeft: 4 }} />
              </button>
            </div>
          </div>

          {/* VIEW 1: DAY SUBJECTS (Default) - Compact grid of all 13 periods for that day */}
          {ttViewMode === 'day' ? (
            <div className="small-tt-day-content">
              <div className="small-tt-day-banner">
                <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                  {weekdayNames[activeWeekdayId]} Subjects &amp; Classes
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                  {dailyClasses.length} Scheduled Sessions &bull; {completedCount} Completed ({completionPercentage}%)
                </span>
              </div>

              <div className="small-tt-subjects-grid">
                {PERIODS.map((period) => {
                  const match = dailyClasses.find((s) => s.periodId === period.id);
                  const isEvent = period.type === 'event';
                  const isDone = match?.status === 'completed';

                  return (
                    <div
                      key={period.id}
                      className={`small-tt-slot-card ${isEvent ? 'slot-event' : ''} ${match ? 'has-class' : 'is-empty'}`}
                    >
                      <div className="small-tt-slot-time">
                        <span className="small-tt-pid">{period.id}</span>
                        <span className="small-tt-time-range">{period.time}</span>
                        {isEvent && <span className="small-tt-ev-tag">EVENT</span>}
                      </div>

                      {match ? (
                        <div className="small-tt-slot-body">
                          <div className="small-tt-subject-row">
                            <span className="small-tt-subject-name" title={match.title}>
                              {match.title}
                            </span>
                            <span className={`small-tt-type-pill pill-${match.type}`}>
                              {match.type?.toUpperCase()}
                            </span>
                          </div>

                          <div className="small-tt-meta-row">
                            <span className="small-tt-code">{match.code}</span>
                            <span className="small-tt-dot">&bull;</span>
                            <span className="small-tt-room">Room {match.room}</span>
                            <span className="small-tt-dot">&bull;</span>
                            <span className="small-tt-group">{match.group}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingTop: 4, borderTop: '1px solid #f1ede6' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleClassDone(match.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 10.5,
                                fontWeight: 700,
                                color: isDone ? '#16a34a' : '#64748b',
                                padding: 0,
                              }}
                            >
                              {isDone ? <CheckCircle2 size={13} color="#16a34a" /> : <Circle size={13} />}
                              <span>{isDone ? 'Done' : 'Mark Done'}</span>
                            </button>

                            <button
                              type="button"
                              className="prompt-chip-btn"
                              style={{ fontSize: 10, padding: '2px 6px' }}
                              onClick={() => onNavigate?.('rescheduling')}
                            >
                              Swap Slot
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="small-tt-empty-text">
                          Available Slot ({period.time})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* VIEW 2: WEEKLY 6-DAY MATRIX - 6 columns: Period, Mon, Tue, Wed, Thu, Fri, Sat */
            <div className="small-tt-matrix-scroll">
              <table className="small-tt-matrix-table">
                <thead>
                  <tr>
                    <th style={{ width: 85, textAlign: 'left', paddingLeft: 8 }}>Period / Time</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((period) => {
                    const isEvent = period.type === 'event';
                    return (
                      <tr key={period.id} className={isEvent ? 'matrix-event-row' : ''}>
                        <td className="small-tt-matrix-time-col">
                          <div style={{ fontWeight: 800, color: isEvent ? 'var(--accent-terracotta)' : 'var(--text-primary)' }}>
                            {period.id}
                          </div>
                          <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                            {period.time.split(' - ')[0]}
                          </div>
                        </td>
                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((dayKey) => {
                          const match = sessions.find((s) => s.day === dayKey && s.periodId === period.id);
                          return (
                            <td key={dayKey} className="small-tt-matrix-cell-td">
                              {match ? (
                                <div
                                  className={`small-tt-matrix-mini-card type-${match.type}`}
                                  title={`${match.title} (${match.code})\nRoom: ${match.room} • Faculty: ${match.faculty}`}
                                >
                                  <div className="small-tt-matrix-subject">
                                    {match.title}
                                  </div>
                                  <div className="small-tt-matrix-subinfo">
                                    <span>{match.room}</span>
                                    <span>{match.code}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="small-tt-matrix-free">&mdash;</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ==========================================================================
          5. Swaps Requests & System Notifications Feed Grid
          ========================================================================== */}
      <div className="dashboard-scroll-section">
        <div className="swaps-notifications-row">
          {/* Left Column: Swaps Request Hub */}
          <div className="swaps-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={17} color="var(--accent-terracotta)" />
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Swaps Request
                </h3>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#c54a26', background: '#fbf0ea', padding: '2px 8px', borderRadius: 9999 }}>
                3 Pending
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SAMPLE_SWAP_REQUESTS.map((swap) => (
                <div key={swap.id} className="swap-item-row">
                  <div className="swap-dept-badge">{swap.dept}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                      Swaps Request - {swap.dept}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b' }}>
                      <strong>{swap.faculty}</strong> &bull; {swap.time}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 2 }}>
                      Reason: {swap.reason}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button
                      type="button"
                      className="app-btn-lime"
                      style={{ fontSize: 11, padding: '4px 10px' }}
                      onClick={() => onNavigate?.('rescheduling')}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="app-btn-outline"
              style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
              onClick={() => onNavigate?.('rescheduling')}
            >
              <span>Open Swaps Negotiation Center</span>
              <ArrowRight size={13} style={{ marginLeft: 6 }} />
            </button>
          </div>

          {/* Right Column: System Notifications & AI Assistant Suggestions */}
          <div className="notifications-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={17} color="#0284c7" />
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  System Notifications
                </h3>
              </div>
              <button
                type="button"
                className="app-btn-lime"
                style={{ fontSize: 11, padding: '4px 10px' }}
                onClick={() => onNavigate?.('ai-assistant')}
              >
                <Bot size={13} />
                <span>Ai assistant suggest</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SAMPLE_SYSTEM_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className="notification-item-row">
                  <div
                    className="notification-icon-wrap"
                    style={{
                      background: notif.type === 'ai' ? '#f0fdf4' : notif.type === 'venue' ? '#fff7ed' : '#eff6ff',
                      color: notif.type === 'ai' ? '#16a34a' : notif.type === 'venue' ? '#ea580c' : '#0284c7',
                    }}
                  >
                    {notif.type === 'ai' ? <Bot size={18} /> : notif.type === 'venue' ? <Building2 size={18} /> : <Bell size={18} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                        {notif.title}
                      </span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{notif.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                      {notif.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
              <button
                type="button"
                className="prompt-chip-btn"
                style={{ fontSize: 11.5 }}
                onClick={() => onNavigate?.('ai-assistant')}
              >
                Ask AI Assistant for Timetable Optimization →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          5. 40-Faculty Live Roster & Cabin Directory
          ========================================================================== */}
      <div className="dashboard-scroll-section">
        <div className="white-app-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Faculty Directory &amp; Live Campus Roster
              </h3>
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                40 senior faculty members across CSE, ECE, Mechanical, IT, and Basic Sciences
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Search faculty by name, dept, cabin..."
                className="app-input-field"
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                style={{ padding: '6px 14px', borderRadius: 9999, fontSize: 12, minWidth: 220 }}
              />
              <select
                className="app-select-field"
                value={facultyDeptFilter}
                onChange={(e) => setFacultyDeptFilter(e.target.value)}
                style={{ padding: '6px 12px', fontSize: 12 }}
              >
                <option value="all">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="IT">IT</option>
              </select>
            </div>
          </div>

          {/* Grid of Faculty Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {filteredFacultyList.map((f) => (
              <div
                key={f.id}
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: 13.5, color: '#0f172a' }}>{f.name}</strong>
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      {f.dept} &bull; {f.designation}
                    </div>
                  </div>
                  {f.status === 'Available' ? (
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#166534', background: '#dcfce7', padding: '2px 6px', borderRadius: 9999 }}>
                      🟢 Available
                    </span>
                  ) : f.status === 'In Class' ? (
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#9a3412', background: '#ffedd5', padding: '2px 6px', borderRadius: 9999 }}>
                      🟠 In Class
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#1e3a8a', background: '#dbeafe', padding: '2px 6px', borderRadius: 9999 }}>
                      🔵 Office Hours
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 11.5, color: '#475569', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span>Cabin: <strong>{f.cabin}</strong></span>
                  <span>{f.phone}</span>
                </div>

                <button
                  type="button"
                  className="app-btn-outline"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 11, padding: '4px 8px', marginTop: 4 }}
                  onClick={() => onNavigate?.('rescheduling')}
                >
                  <MessageSquare size={12} />
                  <span>Request Class Swap</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==========================================================================
          POST DAILY NOTICE MODAL
          ========================================================================== */}
      <Modal
        isOpen={isPostNoticeOpen}
        onClose={() => setIsPostNoticeOpen(false)}
        title="Post Institutional Daily Notice"
      >
        <form onSubmit={handleCreateNotice} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>
              Notice Category *
            </label>
            <select
              className="app-select-field"
              style={{ width: '100%' }}
              value={newNoticeForm.category}
              onChange={(e) => setNewNoticeForm({ ...newNoticeForm, category: e.target.value })}
            >
              <option value="absence">Faculty Absence &amp; Substitute Assignment</option>
              <option value="extra">Extra / Remedial Class Announcement</option>
              <option value="guest">Distinguished Guest Keynote / Industry Speaker</option>
              <option value="event">Campus Event / Cultural Society Rehearsal</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>
              Notice Headline *
            </label>
            <input
              type="text"
              required
              className="app-input-field"
              placeholder="e.g. Dr. A. Sharma taking extra remedial class in LH-101 at 15:00"
              value={newNoticeForm.title}
              onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>
              Detailed Instructions &amp; Venue *
            </label>
            <textarea
              required
              className="app-input-field"
              rows={3}
              placeholder="Provide exact classroom, substitute faculty name, cohort, and guidelines..."
              value={newNoticeForm.details}
              onChange={(e) => setNewNoticeForm({ ...newNoticeForm, details: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>
              Timing / Slot *
            </label>
            <input
              type="text"
              required
              className="app-input-field"
              placeholder="e.g. Today • 15:00 – 16:00 (P7)"
              value={newNoticeForm.time}
              onChange={(e) => setNewNoticeForm({ ...newNoticeForm, time: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              className="app-btn-outline"
              onClick={() => setIsPostNoticeOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="app-btn-lime">
              Broadcast Live Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default FacultyDashboardPage;
