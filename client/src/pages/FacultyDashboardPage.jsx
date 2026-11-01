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
} from 'lucide-react';
import { Modal } from '../components/Modal';
import {
  getStoredTimetableSessions,
  saveStoredTimetableSessions,
  WEEKLY_ACTIVITY_DATA,
  FACULTY_DATA,
  STUDENT_GROUPS,
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

export function FacultyDashboardPage({ currentUser, onNavigate }) {
  const [sessions, setSessions] = useState(getStoredTimetableSessions);
  const [activeWeekdayId, setActiveWeekdayId] = useState('mon');
  const [hoveredSlice, setHoveredSlice] = useState(null);

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
  // Default to November 2026 (CIT Academic Semester)
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

  // Selected date key: "YYYY-M-D"
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

  // Month navigation
  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    setSelectedCalendarDay(1);
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
    setSelectedCalendarDay(1);
  };

  // Calendar Grid math
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

  // Classes for active weekday
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

  // Donut chart categories
  const pieCategories = [
    { id: 'lectures', name: 'Regular Lectures', count: 110, percent: 58.2, color: '#c54a26' },
    { id: 'labs', name: 'Specialized Labs', count: 48, percent: 25.4, color: '#db822a' },
    { id: 'tutorials', name: 'Cohort Tutorials', count: 20, percent: 10.6, color: '#4e7561' },
    { id: 'exams', name: 'Events & Colloquia', count: 11, percent: 5.8, color: '#3a2216' },
  ];

  const currentNotice = activeNotices[currentNoticeIndex] || activeNotices[0] || INITIAL_DAILY_NOTICES[0];

  return (
    <div className="faculty-dashboard-container animate-fade-in-up">
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

            <button
              type="button"
              className="app-btn-lime"
              style={{ padding: '5px 12px', fontSize: 12 }}
              onClick={() => setIsPostNoticeOpen(true)}
            >
              <Plus size={13} />
              <span>Post Notice</span>
            </button>
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
          2. Comprehensive Faculty Stats Overview (Workload, Compliance & Departments)
          ========================================================================== */}
      <div className="faculty-stats-section">
        <div className="section-title-wrap" style={{ marginBottom: 12 }}>
          <div>
            <h3 className="section-title" style={{ fontSize: 18, margin: 0 }}>
              Faculty Statistics &amp; Academic Workload Hub
            </h3>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
              Real-time faculty metrics across 40 professors, 5 academic departments, and 27 venues
            </span>
          </div>

          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent-sage)', background: 'var(--accent-sage-light)', padding: '4px 10px', borderRadius: 9999, border: '1px solid var(--accent-sage-border)' }}>
            ✓ 0 Active Violations &bull; 100% Policy Adherence
          </span>
        </div>

        {/* 4 Core Faculty KPI Cards */}
        <div className="faculty-stats-grid-cards">
          <div className="fac-stat-box">
            <div className="fac-stat-icon-wrap" style={{ background: '#fdf2ed', color: '#c54a26' }}>
              <Users size={22} />
            </div>
            <div>
              <div className="fac-stat-val">40 Faculty</div>
              <div className="fac-stat-label">Total Teaching Staff</div>
              <div className="fac-stat-sub">38 On-Campus &bull; 2 On Leave</div>
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
              <div className="fac-stat-val">3.8 Hrs / Day</div>
              <div className="fac-stat-label">Average Faculty Load</div>
              <div className="fac-stat-sub">Below 5.0h statutory hard limit</div>
            </div>
          </div>

          <div className="fac-stat-box">
            <div className="fac-stat-icon-wrap" style={{ background: '#faf2f4', color: '#84283c' }}>
              <Award size={22} />
            </div>
            <div>
              <div className="fac-stat-val">98.4% Score</div>
              <div className="fac-stat-label">Faculty Satisfaction</div>
              <div className="fac-stat-sub">0 Clash &bull; 1 Swap Executed</div>
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
          3. Real Working Calendar with Interactive Note Adder & Workspace
          ========================================================================== */}
      <div className="calendar-workspace-card" style={{ marginBottom: 22 }}>
        <div className="calendar-top-header">
          <div className="calendar-month-title">
            <CalendarIcon size={20} color="var(--accent-terracotta)" />
            <span>
              {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()} Calendar &amp; Agenda
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Click any date to view and add personal reminders &amp; tasks
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

      {/* ==========================================================================
          4. Live Classes & Venue Occupancy Row (Weekday Sessions)
          ========================================================================== */}
      <div className="dashboard-main-grid" style={{ display: 'flex', gap: 20 }}>
        {/* Left Column: Active Weekday's Schedule */}
        <div className="white-app-card" style={{ flex: 1.4 }}>
          <div className="section-title-wrap" style={{ marginBottom: 14 }}>
            <div>
              <h3 className="section-title" style={{ fontSize: 18 }}>
                {weekdayNames[activeWeekdayId]}'s Teaching Schedule
              </h3>
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                {dailyClasses.length} Scheduled Sessions &bull; {completedCount} Completed ({completionPercentage}%)
              </span>
            </div>

            <div className="weekday-pill-selector">
              {['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((w) => (
                <button
                  key={w}
                  type="button"
                  className={`weekday-pill-btn ${activeWeekdayId === w ? 'active' : ''}`}
                  onClick={() => setActiveWeekdayId(w)}
                >
                  {w.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div key={activeWeekdayId} className="daily-schedule-list tab-motion-content" style={{ maxHeight: 360, overflowY: 'auto' }}>
            {dailyClasses.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CalendarIcon size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                <p>No classes scheduled for this day.</p>
              </div>
            ) : (
              dailyClasses.map((item) => {
                const isCompleted = item.status === 'completed';
                const isEvent = item.type === 'event';
                return (
                  <div
                    key={item.id}
                    className={`schedule-row-item ${isCompleted ? 'class-done-row' : ''}`}
                    style={{
                      transition: 'all 0.2s',
                      background: isCompleted ? 'var(--accent-sage-light)' : '#ffffff',
                      border: '1px solid var(--border-default)',
                      borderRadius: 10,
                      padding: '10px 14px',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div className="schedule-row-left" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => handleToggleClassDone(item.id)}
                        className={`class-check-btn ${isCompleted ? 'btn-checked' : ''}`}
                        title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                        style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={18} color="var(--accent-sage)" />
                        ) : (
                          <Circle size={18} color="var(--text-muted)" />
                        )}
                      </button>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: isEvent ? 'var(--accent-terracotta)' : 'var(--text-primary)',
                              background: isEvent ? 'var(--accent-terracotta-light)' : 'var(--bg-card-subtle)',
                              border: `1px solid ${isEvent ? 'var(--accent-terracotta-border)' : 'var(--border-default)'}`,
                              padding: '2px 7px',
                              borderRadius: 4,
                            }}
                          >
                            {item.periodId}
                          </span>
                          <span
                            className="schedule-name-text"
                            style={{
                              textDecoration: isCompleted ? 'line-through' : 'none',
                              color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                              fontWeight: 600,
                              fontSize: 13.5,
                            }}
                          >
                            {item.code} &bull; {item.title}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
                          <strong>{item.faculty}</strong> &bull; {item.room} &bull; {item.group}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className={`assignment-status-pill ${isCompleted ? 'status-completed' : 'status-upcoming'}`}>
                        {isCompleted ? 'Completed ✓' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="app-btn-outline"
              onClick={() => onNavigate?.('timetable')}
              style={{ fontSize: 13 }}
            >
              <span>View Master Timetable Matrix (P1–P13)</span>
              <ArrowRight size={14} style={{ marginLeft: 6 }} />
            </button>
          </div>
        </div>

        {/* Right Column: Faculty Live Status Roster */}
        <div className="white-app-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={16} color="var(--accent-terracotta)" />
              <h3 className="section-title" style={{ fontSize: 15, margin: 0 }}>
                Faculty Roster &amp; Status
              </h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-sage)', background: 'var(--accent-sage-light)', padding: '2px 6px', borderRadius: 4 }}>
              40 Lecturers
            </span>
          </div>

          {/* Search & Dept Selector */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Search faculty..."
              className="app-input-field"
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              style={{ flex: 1, padding: '5px 10px', fontSize: 11.5 }}
            />
            <select
              className="app-select-field"
              value={facultyDeptFilter}
              onChange={(e) => setFacultyDeptFilter(e.target.value)}
              style={{ padding: '5px 8px', fontSize: 11.5 }}
            >
              <option value="all">All Depts</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="IT">IT</option>
            </select>
          </div>

          {/* Faculty Mini Table */}
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 310, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filteredFacultyList.slice(0, 8).map((f) => (
              <div
                key={f.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: 8,
                  background: '#f8fafc',
                  border: '1px solid var(--border-default)',
                  fontSize: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {f.dept} &bull; Cabin: {f.cabin}
                  </div>
                </div>

                <div>
                  {f.status === 'Available' ? (
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '2px 6px', borderRadius: 9999 }}>
                      🟢 Available
                    </span>
                  ) : f.status === 'In Class' ? (
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#9a3412', background: '#ffedd5', padding: '2px 6px', borderRadius: 9999 }}>
                      🟠 In Class
                    </span>
                  ) : (
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#1e3a8a', background: '#dbeafe', padding: '2px 6px', borderRadius: 9999 }}>
                      🔵 Office Hours
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post Daily Notice Modal */}
      <Modal
        isOpen={isPostNoticeOpen}
        onClose={() => setIsPostNoticeOpen(false)}
        title="Post New Campus Daily Notice"
      >
        <form onSubmit={handleCreateNotice} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Notice Category *
            </label>
            <select
              className="app-select-field"
              style={{ width: '100%', marginTop: 4 }}
              value={newNoticeForm.category}
              onChange={(e) => setNewNoticeForm({ ...newNoticeForm, category: e.target.value })}
            >
              <option value="absence">Faculty Absence &amp; Substitute Assignment</option>
              <option value="extra">Extra / Remedial Class</option>
              <option value="guest">Distinguished Guest Keynote / Industry Speaker</option>
              <option value="event">Special Campus &amp; Spectra Event</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Notice Headline / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. A. Sharma Extra Tutorial for CSE-3 in LH-101"
              className="app-input-field"
              value={newNoticeForm.title}
              onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Timing &amp; Period *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Today • 14:00 – 15:00 (Period 6)"
              className="app-input-field"
              value={newNoticeForm.time}
              onChange={(e) => setNewNoticeForm({ ...newNoticeForm, time: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Notice Details &amp; Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Specify room venue, affected student groups, substitute faculty, or guest credentials..."
              className="app-input-field"
              style={{ resize: 'vertical' }}
              value={newNoticeForm.details}
              onChange={(e) => setNewNoticeForm({ ...newNoticeForm, details: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              className="app-btn-outline"
              onClick={() => setIsPostNoticeOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="app-btn-lime">
              <Send size={14} />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default FacultyDashboardPage;
