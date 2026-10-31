import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  Brain,
  Camera,
  ChevronRight,
  TrendingUp,
  ChevronDown,
  Plus,
  BookOpen,
  Palette,
  Lightbulb,
  FileText,
  Users,
  Clock,
  Layers,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Circle,
  Check,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react';
import {
  getStoredTimetableSessions,
  saveStoredTimetableSessions,
  COURSES_CATALOG,
} from '../services/mockData';

export function FacultyDashboardPage({ currentUser, onNavigate }) {
  // Calendar date selection
  const [selectedDay, setSelectedDay] = useState(26); // Oct 26 (Monday)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(9); // October
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Real Timetable Sessions (loaded from localStorage)
  const [sessions, setSessions] = useState(getStoredTimetableSessions);

  // Map day number in Oct 2026 to weekday code (mon, tue, wed, thu, fri, sat)
  const activeWeekdayId = useMemo(() => {
    // Oct 26 = Mon, 27 = Tue, 28 = Wed, 29 = Thu, 30 = Fri, 31 = Sat
    const map = {
      26: 'mon', 27: 'tue', 28: 'wed', 29: 'thu', 30: 'fri', 31: 'sat',
      19: 'mon', 20: 'tue', 21: 'wed', 22: 'thu', 23: 'fri', 24: 'sat',
      12: 'mon', 13: 'tue', 14: 'wed', 15: 'thu', 16: 'fri', 17: 'sat',
      5: 'mon', 6: 'tue', 7: 'wed', 8: 'thu', 9: 'fri', 10: 'sat',
      1: 'thu', 2: 'fri', 3: 'sat',
    };
    return map[selectedDay] || 'mon';
  }, [selectedDay]);

  const weekdayNames = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
  };

  // Feed existing sessions for the selected day
  const dailyClasses = useMemo(() => {
    return sessions.filter((s) => s.day === activeWeekdayId);
  }, [sessions, activeWeekdayId]);

  // Handle marking a class as Done / Completed (modifying real data)
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

  // Completed classes count for the selected day
  const completedCount = dailyClasses.filter((c) => c.status === 'completed').length;
  const completionPercentage = dailyClasses.length > 0 ? Math.round((completedCount / dailyClasses.length) * 100) : 0;

  // Real Persistent Tasks List
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('cit_faculty_tasks_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [
      { id: 't1', text: 'Grade CS301 Operating Systems Lab 2 Submissions', done: true, due: 'Today, 05:00 PM' },
      { id: 't2', text: 'Review lecture swap request from Dr. R. Verma', done: false, due: 'Today, 06:30 PM' },
      { id: 't3', text: 'Upload Mid-Sem Exam Question Paper for EC204', done: false, due: 'Tomorrow, 11:00 AM' },
      { id: 't4', text: 'Confirm Spectra Tech Fest Invigilation in Aud-1', done: false, due: 'Nov 02, 02:00 PM' },
    ];
  });

  const [newTaskInput, setNewTaskInput] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const handleToggleTask = (taskId) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
    setTasks(updated);
    localStorage.setItem('cit_faculty_tasks_v2', JSON.stringify(updated));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      text: newTaskInput.trim(),
      done: false,
      due: 'Today, 06:00 PM',
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem('cit_faculty_tasks_v2', JSON.stringify(updated));
    setNewTaskInput('');
    setShowAddTask(false);
  };

  const handleDeleteTask = (taskId) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    localStorage.setItem('cit_faculty_tasks_v2', JSON.stringify(updated));
  };

  const weeklyHours = [
    { day: 'Su', height: '40%', isLime: false },
    { day: 'Mo', height: '80%', isLime: activeWeekdayId === 'mon' },
    { day: 'Tu', height: '55%', isLime: activeWeekdayId === 'tue' },
    { day: 'We', height: '90%', isLime: activeWeekdayId === 'wed' },
    { day: 'Th', height: '65%', isLime: activeWeekdayId === 'thu' },
    { day: 'Fr', height: '70%', isLime: activeWeekdayId === 'fri' },
    { day: 'Sa', height: '45%', isLime: activeWeekdayId === 'sat' },
  ];

  return (
    <div className="faculty-dashboard-container animate-fade-in-up">
      {/* Top Banner: Quick Stats & Navigation */}
      <div className="top-courses-row">
        {/* Left: 3 Courses Highlights */}
        <div>
          <div className="section-title-wrap">
            <h2 className="section-title">Core Accredited Courses</h2>
            <button
              type="button"
              className="section-link"
              onClick={() => onNavigate?.('courses')}
            >
              View All (62)
            </button>
          </div>

          <div className="three-cards-grid">
            <div className="course-mini-card animate-card-lift" onClick={() => onNavigate?.('timetable')}>
              <div className="course-mini-header">
                <div className="course-pastel-icon" style={{ backgroundColor: 'var(--pastel-peach-bg)', color: 'var(--pastel-peach-text)' }}>
                  <Layers size={18} />
                </div>
                <div>
                  <div className="course-title-text">Operating Systems</div>
                  <div className="course-lessons-text">CS301 &bull; 4 Credits</div>
                </div>
              </div>
              <div className="course-meta-bottom">
                <div className="course-rate-text">★ 4.8</div>
                <div className="course-type-text">Theory + Lab (LH-101)</div>
              </div>
            </div>

            <div className="course-mini-card animate-card-lift" onClick={() => onNavigate?.('timetable')}>
              <div className="course-mini-header">
                <div className="course-pastel-icon" style={{ backgroundColor: 'var(--pastel-lime-bg)', color: 'var(--pastel-lime-text)' }}>
                  <Brain size={18} />
                </div>
                <div>
                  <div className="course-title-text">Database Systems</div>
                  <div className="course-lessons-text">CS302 &bull; 4 Credits</div>
                </div>
              </div>
              <div className="course-meta-bottom">
                <div className="course-rate-text">★ 4.9</div>
                <div className="course-type-text">DBMS Series (LH-102)</div>
              </div>
            </div>

            <div className="course-mini-card animate-card-lift" onClick={() => onNavigate?.('timetable')}>
              <div className="course-mini-header">
                <div className="course-pastel-icon" style={{ backgroundColor: 'var(--pastel-lavender-bg)', color: 'var(--pastel-lavender-text)' }}>
                  <Camera size={18} />
                </div>
                <div>
                  <div className="course-title-text">Signals &amp; Systems</div>
                  <div className="course-lessons-text">EC204 &bull; 4 Credits</div>
                </div>
              </div>
              <div className="course-meta-bottom">
                <div className="course-rate-text">★ 4.7</div>
                <div className="course-type-text">ECE Core (LH-201)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Master Matrix Feature Card */}
        <div className="feature-dark-card animate-card-lift">
          <div>
            <div className="feature-card-header">
              <div className="feature-dot-circle">
                <div className="feature-dot-inner" />
              </div>
              <span className="feature-brand-title">CIT.MasterMatrix</span>
            </div>
            <h3 className="feature-card-title">13 Periods Active</h3>
            <p className="feature-card-desc">
              27 Venues &bull; 40 Faculty &bull; 14 Batches &bull; 189 Sessions
            </p>
          </div>

          <button
            type="button"
            className="feature-lime-btn"
            onClick={() => onNavigate?.('timetable')}
          >
            Open P1–P13 Grid &rarr;
          </button>
        </div>
      </div>

      {/* Middle Row: Hours Activity + Daily Schedule (Feed from Calendar) + Interactive Calendar & Tasks */}
      <div className="middle-dashboard-grid">
        {/* Hours Activity */}
        <div className="white-app-card">
          <div className="chart-top-header">
            <h3 className="section-title">Teaching Activity</h3>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-lime-text)', background: 'var(--accent-lime)', padding: '2px 8px', borderRadius: 4 }}>
              {weekdayNames[activeWeekdayId]}
            </span>
          </div>

          <div className="chart-trend-badge">
            <TrendingUp size={14} />
            <span>243 Weekly Hours &bull; 100% Clash-Free</span>
          </div>

          <div className="hours-bar-chart">
            {weeklyHours.map((col) => (
              <div key={col.day} className="bar-column">
                <div
                  className={`bar-pillar ${col.isLime ? 'active-lime' : ''}`}
                  style={{ height: col.height }}
                />
                <span className="bar-label">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Daily Schedule (Feeds from selected calendar date + class completion toggle!) */}
        <div className="white-app-card" style={{ flex: 1.2 }}>
          <div className="section-title-wrap" style={{ marginBottom: 6 }}>
            <div>
              <h3 className="section-title">
                {weekdayNames[activeWeekdayId]}'s Classes (Oct {selectedDay})
              </h3>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {dailyClasses.length} Scheduled Sessions &bull; {completedCount} Marked Done ({completionPercentage}%)
              </span>
            </div>
            <button
              type="button"
              className="select-pill-sm"
              onClick={() => onNavigate?.('timetable')}
              title="View full matrix"
            >
              <span>Full Matrix</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="daily-schedule-list" style={{ maxHeight: 380, overflowY: 'auto' }}>
            {dailyClasses.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8' }}>
                <CalendarIcon size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                <p>No classes scheduled for this date. Select another date from the calendar on the right.</p>
              </div>
            ) : (
              dailyClasses.map((item) => {
                const isCompleted = item.status === 'completed';
                const isEvent = item.type === 'event';
                return (
                  <div
                    key={item.id}
                    className={`schedule-row-item ${isCompleted ? 'class-done-row' : ''}`}
                    style={{ transition: 'all 0.2s', background: isCompleted ? '#f0fdf4' : '#ffffff' }}
                  >
                    <div className="schedule-row-left" style={{ flex: 1 }}>
                      {/* Interactive Completion Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleClassDone(item.id)}
                        className={`class-check-btn ${isCompleted ? 'btn-checked' : ''}`}
                        title={isCompleted ? 'Click to mark as Incomplete' : 'Click to mark Class as Completed / Done'}
                      >
                        {isCompleted ? <Check size={14} color="#ffffff" /> : <Circle size={14} color="#94a3b8" />}
                      </button>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: isEvent ? '#7c3aed' : 'var(--accent-lime-text)', background: isEvent ? '#f3e8ff' : 'var(--accent-lime)', padding: '1px 6px', borderRadius: 4 }}>
                            {item.periodId}
                          </span>
                          <span className="schedule-name-text" style={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#64748b' : '#0f172a' }}>
                            {item.code} &bull; {item.title}
                          </span>
                        </div>
                        <div className="schedule-type-text" style={{ marginTop: 2 }}>
                          {item.faculty} &bull; {item.room} &bull; {item.group}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`assignment-status-pill ${isCompleted ? 'status-completed' : 'status-upcoming'}`}>
                        {isCompleted ? 'Completed ✓' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Real Interactive Calendar + Tasks Widget */}
        <div className="right-widgets-column">
          {/* Real Interactive Calendar: Tapping any date loads existing data! */}
          <div className="white-app-card" style={{ padding: '18px 20px' }}>
            <div className="calendar-widget-header">
              <span
                className="cal-nav-btn"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedMonthIndex((prev) => (prev > 0 ? prev - 1 : 11))}
              >
                &lt;
              </span>
              <span style={{ fontWeight: 800, fontSize: 14 }}>
                {months[selectedMonthIndex]} 2026
              </span>
              <span
                className="cal-nav-btn"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedMonthIndex((prev) => (prev < 11 ? prev + 1 : 0))}
              >
                &gt;
              </span>
            </div>

            <div className="calendar-days-row">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

            {/* Tap any date to select it and feed existing timetable sessions! */}
            <div className="calendar-dates-grid">
              {[28, 29, 30].map((d) => (
                <span key={`prev-${d}`} className="calendar-date-cell other-month">{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => (
                <span
                  key={dayNum}
                  className={`calendar-date-cell ${selectedDay === dayNum ? 'active-date' : ''}`}
                  onClick={() => setSelectedDay(dayNum)}
                  style={{ cursor: 'pointer' }}
                  title={`Tap to select Oct ${dayNum} and load sessions`}
                >
                  {dayNum}
                </span>
              ))}
              <span className="calendar-date-cell other-month">1</span>
            </div>

            <div style={{ marginTop: 10, textAlign: 'center', fontSize: 11.5, color: '#64748b' }}>
              Selected: <strong>{weekdayNames[activeWeekdayId]}, Oct {selectedDay}</strong>
            </div>
          </div>

          {/* Real Academic Tasks Widget */}
          <div className="white-app-card" style={{ padding: '18px 20px' }}>
            <div className="section-title-wrap" style={{ marginBottom: 10 }}>
              <div>
                <h3 className="section-title" style={{ fontSize: 15 }}>Academic Tasks</h3>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                  {tasks.filter((t) => t.done).length} of {tasks.length} Completed
                </span>
              </div>
              <button
                type="button"
                className="plus-action-btn"
                title="Add new task"
                onClick={() => setShowAddTask(!showAddTask)}
              >
                {showAddTask ? <X size={14} /> : <Plus size={14} />}
              </button>
            </div>

            {/* Add Task Input Form */}
            {showAddTask && (
              <form onSubmit={handleAddTask} style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <input
                  type="text"
                  required
                  placeholder="Enter task description..."
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                />
                <button type="submit" className="app-btn-lime" style={{ padding: '6px 12px', fontSize: 12 }}>
                  Add
                </button>
              </form>
            )}

            {/* Tasks List with Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: task.done ? '#f8fafc' : '#ffffff',
                    border: '1px solid #f1f5f9',
                    fontSize: 12.5,
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => handleToggleTask(task.id)}
                      style={{ accentColor: '#101320', width: 15, height: 15, cursor: 'pointer' }}
                    />
                    <span style={{ textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#94a3b8' : '#1e293b' }}>
                      {task.text}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 2 }}
                    title="Delete task"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboardPage;
