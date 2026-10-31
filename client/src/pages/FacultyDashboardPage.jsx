import React, { useState, useMemo } from 'react';
import {
  Brain,
  Camera,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Users,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  Circle,
  Check,
  Calendar as CalendarIcon,
  Building2,
  ArrowRight,
} from 'lucide-react';
import {
  getStoredTimetableSessions,
  saveStoredTimetableSessions,
  COURSES_CATALOG,
} from '../services/mockData';

export function FacultyDashboardPage({ currentUser, onNavigate }) {
  // Real Timetable Sessions (loaded from localStorage)
  const [sessions, setSessions] = useState(getStoredTimetableSessions);

  // Default active weekday: Monday
  const [activeWeekdayId, setActiveWeekdayId] = useState('mon');

  const weekdayNames = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
  };

  // Classes for active weekday
  const dailyClasses = useMemo(() => {
    return sessions.filter((s) => s.day === activeWeekdayId);
  }, [sessions, activeWeekdayId]);

  // Handle marking a class as Done / Completed
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

  // Completed classes count
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
      { id: 't3', text: 'Review Mid-Sem Exam Seating Plan for EC204', done: false, due: 'Tomorrow, 11:00 AM' },
      { id: 't4', text: 'Confirm Spectra Tech Fest Session in Aud-1', done: false, due: 'Nov 02, 02:00 PM' },
    ];
  });

  const handleToggleTask = (taskId) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
    setTasks(updated);
    localStorage.setItem('cit_faculty_tasks_v2', JSON.stringify(updated));
  };

  const weeklyHours = [
    { day: 'Mo', height: '80%', id: 'mon' },
    { day: 'Tu', height: '55%', id: 'tue' },
    { day: 'We', height: '90%', id: 'wed' },
    { day: 'Th', height: '65%', id: 'thu' },
    { day: 'Fr', height: '70%', id: 'fri' },
    { day: 'Sa', height: '45%', id: 'sat' },
  ];

  return (
    <div className="faculty-dashboard-container animate-fade-in-up">
      {/* Minimalist Metrics Strip */}
      <div className="dashboard-stats-strip">
        <div className="stat-clean-card">
          <div className="stat-clean-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <Clock size={18} />
          </div>
          <div>
            <div className="stat-clean-val">189 Sessions</div>
            <div className="stat-clean-label">243 Weekly Teaching Hours</div>
          </div>
        </div>

        <div className="stat-clean-card">
          <div className="stat-clean-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Users size={18} />
          </div>
          <div>
            <div className="stat-clean-val">14 Cohorts</div>
            <div className="stat-clean-label">CSE, ECE, ME, IT, EE Batches</div>
          </div>
        </div>

        <div className="stat-clean-card">
          <div className="stat-clean-icon" style={{ background: '#faf5ff', color: '#7c3aed' }}>
            <Building2 size={18} />
          </div>
          <div>
            <div className="stat-clean-val">27 Venues</div>
            <div className="stat-clean-label">Lecture Halls &amp; 7 Labs</div>
          </div>
        </div>

        <div className="stat-clean-card">
          <div className="stat-clean-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div className="stat-clean-val">0 Clashes</div>
            <div className="stat-clean-label">100% Policy Compliance</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Workspace (2 Columns) */}
      <div className="dashboard-main-grid">
        {/* Left Column: Today's Schedule */}
        <div className="white-app-card" style={{ flex: 1.4 }}>
          <div className="section-title-wrap" style={{ marginBottom: 14 }}>
            <div>
              <h3 className="section-title" style={{ fontSize: 18 }}>
                {weekdayNames[activeWeekdayId]}'s Schedule
              </h3>
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                {dailyClasses.length} Scheduled Sessions &bull; {completedCount} Completed ({completionPercentage}%)
              </span>
            </div>

            {/* Weekday Switcher Pill */}
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

          <div className="daily-schedule-list" style={{ maxHeight: 440, overflowY: 'auto' }}>
            {dailyClasses.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8' }}>
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
                      background: isCompleted ? '#f0fdf4' : '#ffffff',
                      border: '1px solid #f1f5f9',
                      borderRadius: 10,
                      padding: '10px 14px',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div className="schedule-row-left" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Interactive Completion Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleClassDone(item.id)}
                        className={`class-check-btn ${isCompleted ? 'btn-checked' : ''}`}
                        title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                        style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                      >
                        {isCompleted ? <CheckCircle2 size={18} color="#059669" /> : <Circle size={18} color="#94a3b8" />}
                      </button>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: isEvent ? '#7c3aed' : '#0f172a', background: isEvent ? '#f3e8ff' : '#f1f5f9', padding: '2px 7px', borderRadius: 4 }}>
                            {item.periodId}
                          </span>
                          <span className="schedule-name-text" style={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#64748b' : '#0f172a', fontWeight: 600, fontSize: 13.5 }}>
                            {item.code} &bull; {item.title}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                          {item.faculty} &bull; {item.room} &bull; {item.group}
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
              <span>View Full Master Timetable (P1–P13)</span>
              <ArrowRight size={14} style={{ marginLeft: 6 }} />
            </button>
          </div>
        </div>

        {/* Right Column: Weekly Teaching Activity & Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
          {/* Weekly Activity */}
          <div className="white-app-card">
            <div className="chart-top-header" style={{ marginBottom: 12 }}>
              <h3 className="section-title" style={{ fontSize: 16 }}>Teaching Load by Day</h3>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 4 }}>
                100% Clash-Free
              </span>
            </div>

            <div className="hours-bar-chart">
              {weeklyHours.map((col) => (
                <div
                  key={col.day}
                  className="bar-column"
                  onClick={() => setActiveWeekdayId(col.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={`bar-pillar ${col.id === activeWeekdayId ? 'active-lime' : ''}`}
                    style={{ height: col.height }}
                  />
                  <span className="bar-label">{col.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Checklist / Tasks */}
          <div className="white-app-card" style={{ flex: 1 }}>
            <h3 className="section-title" style={{ fontSize: 16, marginBottom: 12 }}>
              Academic Action Items
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: task.done ? '#f8fafc' : '#ffffff',
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ marginTop: 2 }}>
                    {task.done ? (
                      <CheckCircle2 size={16} color="#059669" />
                    ) : (
                      <Circle size={16} color="#94a3b8" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#94a3b8' : '#1e293b' }}>
                      {task.text}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {task.due}
                    </div>
                  </div>
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
