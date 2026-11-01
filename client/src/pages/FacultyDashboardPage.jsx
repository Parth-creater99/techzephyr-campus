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

  // 2. Real Working Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 10, 1));
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(1);

  // Persistent Calendar Notes stored in localStorage
  const [calendarNotes, setCalendarNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('cit_calendar_notes_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      '2026-11-1': [
        { id: 'cn-1', text: 'Grade CS301 OS Lab 2 submissions and review reports', done: true, priority: 'normal' },
        { id: 'cn-2', text: 'Faculty Council meeting with Dean at 4:30 PM in Conf-1', done: false, priority: 'high' },
      ],
      '2026-11-2': [
        { id: 'cn-3', text: 'Distribute Midsem examination timetable copies to CSE-3', done: false, priority: 'high' },
      ],
      '2026-11-4': [
        { id: 'cn-4', text: 'Hardware audit for CS Systems Lab (Lab-1 & Lab-3)', done: false, priority: 'normal' },
      ],
      '2026-11-7': [
        { id: 'cn-5', text: 'Spectra National Hackathon 24hr evaluation panel', done: false, priority: 'urgent' },
      ],
    };
  });

  const [newNoteInput, setNewNoteInput] = useState('');
  const [newNotePriority, setNewNotePriority] = useState('normal');

  const currentSelectedDateKey = `${calendarDate.getFullYear()}-${calendarDate.getMonth() + 1}-${selectedCalendarDay}`;
  const notesForSelectedDate = calendarNotes[currentSelectedDateKey] || [];

  const handleAddCalendarNote = (e) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      text: newNoteInput.trim(),
      done: false,
      priority: newNotePriority,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = {
      ...calendarNotes,
      [currentSelectedDateKey]: [...notesForSelectedDate, newNote],
    };

    setCalendarNotes(updated);
    localStorage.setItem('cit_calendar_notes_v2', JSON.stringify(updated));
    setNewNoteInput('');
  };

  const handleToggleCalendarNote = (noteId) => {
    const updatedDateNotes = notesForSelectedDate.map((n) =>
      n.id === noteId ? { ...n, done: !n.done } : n
    );
    const updated = {
      ...calendarNotes,
      [currentSelectedDateKey]: updatedDateNotes,
    };
    setCalendarNotes(updated);
    localStorage.setItem('cit_calendar_notes_v2', JSON.stringify(updated));
  };

  const handleDeleteCalendarNote = (noteId) => {
    const updatedDateNotes = notesForSelectedDate.filter((n) => n.id !== noteId);
    const updated = {
      ...calendarNotes,
      [currentSelectedDateKey]: updatedDateNotes,
    };
    setCalendarNotes(updated);
    localStorage.setItem('cit_calendar_notes_v2', JSON.stringify(updated));
  };

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    setSelectedCalendarDay(1);
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
    setSelectedCalendarDay(1);
  };

  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

        {/* Department Workload Distribution Bars */}
        <div className="dept-workload-bars-grid">
          <div className="dept-bar-card">
            <div className="dept-bar-header">
              <span style={{ color: 'var(--text-primary)' }}>Computer Science (CSE)</span>
              <span style={{ color: '#c54a26' }}>10 Faculty • 62h</span>
            </div>
            <div className="dept-progress-track">
              <div className="dept-progress-fill" style={{ width: '85%', background: '#c54a26' }} />
            </div>
          </div>

          <div className="dept-bar-card">
            <div className="dept-bar-header">
              <span style={{ color: 'var(--text-primary)' }}>Electronics &amp; Comm (ECE)</span>
              <span style={{ color: '#db822a' }}>8 Faculty • 54h</span>
            </div>
            <div className="dept-progress-track">
              <div className="dept-progress-fill" style={{ width: '74%', background: '#db822a' }} />
            </div>
          </div>

          <div className="dept-bar-card">
            <div className="dept-bar-header">
              <span style={{ color: 'var(--text-primary)' }}>Mechanical Eng (ME)</span>
              <span style={{ color: '#4e7561' }}>7 Faculty • 46h</span>
            </div>
            <div className="dept-progress-track">
              <div className="dept-progress-fill" style={{ width: '63%', background: '#4e7561' }} />
            </div>
          </div>

          <div className="dept-bar-card">
            <div className="dept-bar-header">
              <span style={{ color: 'var(--text-primary)' }}>Information Tech (IT)</span>
              <span style={{ color: '#3a2216' }}>8 Faculty • 48h</span>
            </div>
            <div className="dept-progress-track">
              <div className="dept-progress-fill" style={{ width: '66%', background: '#3a2216' }} />
            </div>
          </div>

          <div className="dept-bar-card">
            <div className="dept-bar-header">
              <span style={{ color: 'var(--text-primary)' }}>General &amp; EE/Civil</span>
              <span style={{ color: '#834f96' }}>7 Faculty • 33h</span>
            </div>
            <div className="dept-progress-track">
              <div className="dept-progress-fill" style={{ width: '45%', background: '#834f96' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          3. Weekly Session Activity Matrix (Mon to Sat across P1 to P13)
          ========================================================================== */}
      <div className="dashboard-scroll-section">
        <div className="weekly-activity-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Weekly Session Activity
              </h3>
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                Monday to Saturday session distribution across periods P1–P13
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: '#c54a26' }} /> CSE
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: '#d9822b' }} /> Lab
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: '#ea580c' }} /> Busy
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: '#9333ea' }} /> Event
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: '#e2e8f0' }} /> Free
              </span>
            </div>
          </div>

          <div className="activity-matrix-scroll">
            <table className="activity-matrix-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingLeft: 10 }}>Day</th>
                  {PERIODS.map((p) => (
                    <th key={p.id}>
                      <div>{p.name}</div>
                      <div style={{ fontSize: 9.5, opacity: 0.75 }}>{p.time.split(' ')[0]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((dayKey) => {
                  const daySessions = sessions.filter((s) => s.day === dayKey);

                  return (
                    <tr key={dayKey}>
                      <td className="day-col">{dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</td>
                      {PERIODS.map((p) => {
                        const match = daySessions.find((s) => s.periodId === p.id);
                        const isEventSlot = p.type === 'event' || match?.type === 'event';

                        let cellClass = 'cell-free';
                        let label = 'Free';

                        if (match) {
                          if (match.type === 'lab') {
                            cellClass = 'cell-lab';
                            label = `${match.code} Lab`;
                          } else if (isEventSlot) {
                            cellClass = 'cell-event';
                            label = match.code;
                          } else if (match.group?.includes('CSE') || match.code.startsWith('CS')) {
                            cellClass = 'cell-cse';
                            label = 'CSE';
                          } else {
                            cellClass = 'cell-busy';
                            label = match.code.substring(0, 5);
                          }
                        }

                        return (
                          <td key={p.id}>
                            <div
                              className={`activity-matrix-cell ${cellClass}`}
                              onClick={() => {
                                setActiveWeekdayId(dayKey);
                              }}
                              title={
                                match
                                  ? `${match.code}: ${match.title}\nFaculty: ${match.faculty}\nRoom: ${match.room} (${p.time})`
                                  : `${dayKey.toUpperCase()} ${p.name}: Available period`
                              }
                            >
                              {label}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          4. Day's Schedule with Day Picker & Carousel Slider
          ========================================================================== */}
      <div className="dashboard-scroll-section">
        <div className="day-schedule-card">
          <div className="day-picker-row">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  {weekdayNames[activeWeekdayId]}'s Schedule with Day Picker
                </h3>
                <span style={{ fontSize: 14, color: '#94a3b8' }}>⌵</span>
              </div>
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2, display: 'block' }}>
                {dailyClasses.length} Scheduled Sessions &bull; {completedCount} Completed ({completionPercentage}%)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Day Pills [MON] [TUE] [WED] [THU] [FRI] [SAT] */}
              <div className="day-picker-pills">
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={`day-picker-btn ${activeWeekdayId === w ? 'active' : ''}`}
                    onClick={() => {
                      setActiveWeekdayId(w);
                      setActiveSlideIndex(0);
                    }}
                  >
                    {w.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Prev / Next day switcher */}
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  type="button"
                  className="notice-arrow-btn"
                  onClick={handlePrevDay}
                  title="Previous Day"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  className="notice-arrow-btn"
                  onClick={handleNextDay}
                  title="Next Day"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Sliding Session Cards Viewport */}
          <div className="schedule-slider-viewport">
            {dailyClasses.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '30px 10px', textAlign: 'center', color: '#94a3b8' }}>
                No academic sessions scheduled for this day.
              </div>
            ) : (
              dailyClasses.map((item) => {
                const isCompleted = item.status === 'completed';
                const periodObj = PERIODS.find((p) => p.id === item.periodId);

                return (
                  <div key={item.id} className="schedule-item-card">
                    <div className="schedule-item-time">
                      <span>{periodObj?.time || '09:00 AM – 10:00 AM'}</span>
                      <span className="schedule-item-tag">{item.type}</span>
                    </div>

                    <h4 className="schedule-item-title">
                      {item.code}: {item.title}
                    </h4>

                    <div className="schedule-item-meta">
                      <span>Room: <strong>{item.room}</strong></span>
                      <span>&bull;</span>
                      <span>Group: <strong>{item.group}</strong></span>
                    </div>

                    <div className="schedule-item-meta" style={{ marginTop: 'auto', paddingTop: 6 }}>
                      <span>👤 {item.faculty}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, paddingTop: 8, borderTop: '1px solid #ebdcd0' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleClassDone(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: isCompleted ? '#16a34a' : '#64748b',
                        }}
                      >
                        {isCompleted ? <CheckCircle2 size={16} color="#16a34a" /> : <Circle size={16} />}
                        <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                      </button>

                      <button
                        type="button"
                        className="prompt-chip-btn"
                        style={{ fontSize: 11, padding: '3px 8px' }}
                        onClick={() => onNavigate?.('rescheduling')}
                      >
                        Swap Block
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
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
          6. Real Working Calendar with Interactive Note Adder & Workspace
          ========================================================================== */}
      <div className="dashboard-scroll-section">
        <div className="calendar-workspace-card">
          <div className="calendar-top-header">
            <div className="calendar-month-title">
              <CalendarIcon size={20} color="var(--accent-terracotta)" />
              <span>
                {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()} Academic Calendar &amp; Notes
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Click any date to add or manage day-specific agenda &amp; duties
              </span>

              <div className="calendar-nav-btn-group">
                <button
                  type="button"
                  className="notice-arrow-btn"
                  onClick={handlePrevMonth}
                  title="Previous Month"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  className="prompt-chip-btn"
                  style={{ fontSize: 12, padding: '4px 10px' }}
                  onClick={() => {
                    setCalendarDate(new Date(2026, 10, 1));
                    setSelectedCalendarDay(1);
                  }}
                >
                  Today (Nov 01)
                </button>
                <button
                  type="button"
                  className="notice-arrow-btn"
                  onClick={handleNextMonth}
                  title="Next Month"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column Split: Calendar Grid on Left (60%) + Selected Date Notes on Right (40%) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
            {/* Calendar Grid */}
            <div>
              <table className="calendar-grid-table">
                <thead>
                  <tr>
                    <th className="calendar-th-day">Sun</th>
                    <th className="calendar-th-day">Mon</th>
                    <th className="calendar-th-day">Tue</th>
                    <th className="calendar-th-day">Wed</th>
                    <th className="calendar-th-day">Thu</th>
                    <th className="calendar-th-day">Fri</th>
                    <th className="calendar-th-day">Sat</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, weekIdx) => {
                    return (
                      <tr key={weekIdx}>
                        {Array.from({ length: 7 }).map((_, dayIdx) => {
                          const cellIndex = weekIdx * 7 + dayIdx;
                          const dayNum = cellIndex - firstDayOfWeek + 1;
                          const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
                          const isSelected = isCurrentMonth && dayNum === selectedCalendarDay;
                          const isToday = isCurrentMonth && dayNum === 1 && calendarDate.getMonth() === 10;

                          const dateKey = `${calendarDate.getFullYear()}-${calendarDate.getMonth() + 1}-${dayNum}`;
                          const notesCount = (calendarNotes[dateKey] || []).length;

                          if (!isCurrentMonth) {
                            return <td key={dayIdx} className="calendar-day-cell other-month" />;
                          }

                          return (
                            <td
                              key={dayIdx}
                              className={`calendar-day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                              onClick={() => setSelectedCalendarDay(dayNum)}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="cal-day-num">{dayNum}</span>
                                {isToday && (
                                  <span style={{ fontSize: 8.5, background: 'var(--accent-sage-light)', color: 'var(--accent-sage)', padding: '1px 4px', borderRadius: 3, fontWeight: 800 }}>
                                    TODAY
                                  </span>
                                )}
                              </div>

                              <div className="cal-day-badge-wrap">
                                {notesCount > 0 && (
                                  <span className="cal-count-pill" title={`${notesCount} notes`}>
                                    {notesCount} note{notesCount > 1 ? 's' : ''}
                                  </span>
                                )}
                                {dayNum >= 2 && dayNum <= 7 && (
                                  <span className="cal-event-dot" title="Classes in session" />
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Interactive Notes Panel for Selected Date */}
            <div className="day-notes-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: 'var(--text-primary)' }}>
                    Notes &amp; Agenda: {monthNames[calendarDate.getMonth()]} {selectedCalendarDay}, {calendarDate.getFullYear()}
                  </h4>
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    {notesForSelectedDate.length} item{notesForSelectedDate.length !== 1 ? 's' : ''} recorded for this date
                  </span>
                </div>
              </div>

              {/* Add New Note Input Form */}
              <form onSubmit={handleAddCalendarNote} style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  className="app-input-field"
                  placeholder="Add a task, reminder, or note..."
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  style={{ flex: 1, padding: '7px 12px', fontSize: 12.5 }}
                />

                <select
                  className="app-select-field"
                  value={newNotePriority}
                  onChange={(e) => setNewNotePriority(e.target.value)}
                  style={{ padding: '7px 8px', fontSize: 12 }}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>

                <button type="submit" className="app-btn-lime" style={{ padding: '7px 14px', fontSize: 12 }}>
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </form>

              {/* List of Notes for Selected Date */}
              <div className="notes-list-scroll">
                {notesForSelectedDate.length === 0 ? (
                  <div style={{ padding: '24px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <CalendarIcon size={24} style={{ margin: '0 auto 6px auto', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: 12.5 }}>No notes for this date yet. Type above to add one!</p>
                  </div>
                ) : (
                  notesForSelectedDate.map((note) => (
                    <div key={note.id} className={`cal-note-item ${note.done ? 'completed' : ''}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <button
                          type="button"
                          onClick={() => handleToggleCalendarNote(note.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          title={note.done ? 'Mark pending' : 'Mark done'}
                        >
                          {note.done ? (
                            <CheckCircle2 size={16} color="var(--accent-sage)" />
                          ) : (
                            <Circle size={16} color="var(--text-muted)" />
                          )}
                        </button>

                        <div style={{ flex: 1 }}>
                          <span className={`cal-note-text ${note.done ? 'done' : ''}`}>
                            {note.text}
                          </span>
                          {note.priority === 'urgent' && (
                            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '1px 5px', borderRadius: 4, marginLeft: 6 }}>
                              URGENT
                            </span>
                          )}
                          {note.priority === 'high' && (
                            <span style={{ fontSize: 9.5, fontWeight: 800, color: '#d97706', background: '#fef3c7', padding: '1px 5px', borderRadius: 4, marginLeft: 6 }}>
                              HIGH
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCalendarNote(note.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}
                        title="Delete note"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          7. 40-Faculty Live Roster & Cabin Directory
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
