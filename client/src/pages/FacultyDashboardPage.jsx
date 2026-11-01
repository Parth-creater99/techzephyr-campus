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
      {/* 1. Daily Notice Banner: Clean, Minimalist */}
      <div className="daily-notice-clean">
        <div className="notice-top-clean">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`notice-category-tag ${currentNotice.category}`}>
              {currentNotice.categoryName || 'Notice'}
            </span>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              {currentNotice.time}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['all', 'absence', 'extra', 'guest'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`venue-filter-btn-clean ${noticeFilter === cat ? 'active' : ''}`}
                style={{ padding: '2px 8px', fontSize: 11 }}
                onClick={() => {
                  setNoticeFilter(cat);
                  setCurrentNoticeIndex(0);
                }}
              >
                {cat === 'all' ? 'All' : cat === 'absence' ? 'Absences' : cat === 'extra' ? 'Extra' : 'Guests'}
              </button>
            ))}

            <button
              type="button"
              className="venue-btn-subtle"
              style={{ padding: '3px 8px', fontSize: 11 }}
              onClick={() => setIsPostNoticeOpen(true)}
            >
              <Plus size={12} />
              <span>Post</span>
            </button>
          </div>
        </div>

        <div className="notice-body-clean">
          <div className="notice-title-clean">{currentNotice.title}</div>
          <div className="notice-detail-clean">{currentNotice.details}</div>
        </div>

        <div className="notice-footer-clean">
          <span style={{ fontSize: 11.5, color: '#94a3b8' }}>
            {currentNoticeIndex + 1} of {activeNotices.length} updates
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="notice-arrow-btn-clean"
              onClick={handlePrevNotice}
              title="Previous"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className="notice-arrow-btn-clean"
              onClick={handleNextNotice}
              title="Next"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Faculty Statistics: Minimalist Metric Strip (Zero visual clutter) */}
      <div className="faculty-metrics-strip">
        <div className="faculty-metric-col">
          <div className="faculty-metric-number">40</div>
          <div className="faculty-metric-label">Total Faculty</div>
          <div className="faculty-metric-sub">38 on campus &bull; 2 on leave</div>
        </div>
        <div className="faculty-metric-col">
          <div className="faculty-metric-number">243h</div>
          <div className="faculty-metric-label">Weekly Teaching Load</div>
          <div className="faculty-metric-sub">189 Mon–Sat sessions</div>
        </div>
        <div className="faculty-metric-col">
          <div className="faculty-metric-number">3.8h</div>
          <div className="faculty-metric-label">Daily Average per Faculty</div>
          <div className="faculty-metric-sub">Statutory limit: 5.0h</div>
        </div>
        <div className="faculty-metric-col">
          <div className="faculty-metric-number">100%</div>
          <div className="faculty-metric-label">Policy Adherence</div>
          <div className="faculty-metric-sub">0 active collisions</div>
        </div>
      </div>

      {/* 3. Department Workload Distribution (Single Clean Card) */}
      <div className="dept-distribution-clean">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Department Workload Distribution</span>
          <span style={{ fontSize: 11.5, color: '#64748b' }}>5 academic departments</span>
        </div>
        {[
          { name: 'Computer Science (CSE)', faculty: 10, hours: 62, width: '85%' },
          { name: 'Electronics & Comm (ECE)', faculty: 8, hours: 54, width: '74%' },
          { name: 'Mechanical Eng (ME)', faculty: 7, hours: 46, width: '63%' },
          { name: 'Information Tech (IT)', faculty: 8, hours: 48, width: '66%' },
          { name: 'General & Sciences', faculty: 7, hours: 33, width: '45%' },
        ].map((d) => (
          <div key={d.name} className="dept-row-clean">
            <span className="dept-name-clean">{d.name}</span>
            <div className="dept-bar-track-clean">
              <div className="dept-bar-fill-clean" style={{ width: d.width }} />
            </div>
            <span className="dept-count-clean">{d.faculty} fac &bull; {d.hours}h</span>
          </div>
        ))}
      </div>

      {/* 4. Real Working Calendar & Notes Workspace (Clean Minimalist) */}
      <div className="calendar-workspace-clean">
        <div className="calendar-header-clean">
          <div className="calendar-month-text">
            {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()} &bull; Agenda &amp; Tasks
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="notice-arrow-btn-clean"
              onClick={handlePrevMonth}
              title="Previous Month"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className="venue-filter-btn-clean"
              style={{ fontSize: 11.5 }}
              onClick={() => {
                setCalendarDate(new Date(2026, 10, 1));
                setSelectedCalendarDay(1);
              }}
            >
              Today
            </button>
            <button
              type="button"
              className="notice-arrow-btn-clean"
              onClick={handleNextMonth}
              title="Next Month"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* 2-Column Split: Calendar Grid on Left + Notes on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16 }}>
          {/* Calendar Grid */}
          <div>
            <table className="calendar-grid-clean">
              <thead>
                <tr>
                  <th className="calendar-th-clean">S</th>
                  <th className="calendar-th-clean">M</th>
                  <th className="calendar-th-clean">T</th>
                  <th className="calendar-th-clean">W</th>
                  <th className="calendar-th-clean">T</th>
                  <th className="calendar-th-clean">F</th>
                  <th className="calendar-th-clean">S</th>
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
                          return <td key={dayIdx} className="calendar-td-clean other-month" />;
                        }

                        return (
                          <td
                            key={dayIdx}
                            className={`calendar-td-clean ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                            onClick={() => setSelectedCalendarDay(dayNum)}
                          >
                            <span className="cal-date-number">{dayNum}</span>
                            {notesCount > 0 && (
                              <div style={{ marginTop: 2 }}>
                                <span className="cal-note-indicator" title={`${notesCount} notes`} />
                              </div>
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

          {/* Clean Day Notes Panel */}
          <div className="day-notes-clean">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                {monthNames[calendarDate.getMonth()]} {selectedCalendarDay}: Notes ({notesForSelectedDate.length})
              </span>
            </div>

            {/* Add Note Input */}
            <form onSubmit={handleAddCalendarNote} style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                className="app-input-field"
                placeholder="Add task or note..."
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                style={{ flex: 1, padding: '5px 10px', fontSize: 12 }}
              />
              <button type="submit" className="venue-btn-primary" style={{ padding: '4px 10px', fontSize: 11.5 }}>
                Add
              </button>
            </form>

            {/* Notes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 220, overflowY: 'auto' }}>
              {notesForSelectedDate.length === 0 ? (
                <div style={{ padding: '16px 8px', color: '#94a3b8', fontSize: 12, textAlign: 'center' }}>
                  No tasks for this day.
                </div>
              ) : (
                notesForSelectedDate.map((note) => (
                  <div key={note.id} className="day-note-row">
                    <button
                      type="button"
                      onClick={() => handleToggleCalendarNote(note.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {note.done ? (
                        <CheckCircle2 size={15} color="#16a34a" />
                      ) : (
                        <Circle size={15} color="#94a3b8" />
                      )}
                    </button>
                    <span className={`day-note-text ${note.done ? 'done' : ''}`}>
                      {note.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCalendarNote(note.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 2 }}
                    >
                      <Trash2 size={12} />
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
                    <span className="status-badge-clean available">
                      Available
                    </span>
                  ) : f.status === 'In Class' ? (
                    <span className="status-badge-clean in-class">
                      In Class
                    </span>
                  ) : (
                    <span className="status-badge-clean office">
                      Office Hours
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
