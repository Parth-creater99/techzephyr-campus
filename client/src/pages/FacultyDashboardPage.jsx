import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import {
  getStoredTimetableSessions,
  saveStoredTimetableSessions,
  WEEKLY_ACTIVITY_DATA,
  ROOM_UTILIZATION_DATA,
} from '../services/mockData';

export function FacultyDashboardPage({ currentUser, onNavigate }) {
  // Real Timetable Sessions (loaded from localStorage)
  const [sessions, setSessions] = useState(getStoredTimetableSessions);

  // Default active weekday: Monday
  const [activeWeekdayId, setActiveWeekdayId] = useState('mon');

  // Interactive hovered slice for Donut/Pie Chart
  const [hoveredSlice, setHoveredSlice] = useState(null);

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

  // Session Type Breakdown data for Donut / Pie Chart
  const pieCategories = [
    {
      id: 'lectures',
      name: 'Regular Lectures',
      count: 110,
      percent: 58.2,
      color: '#c54a26', // Terracotta
      hours: '142 hrs',
      strokeDash: '197.5 339.3',
      strokeOffset: '0',
    },
    {
      id: 'labs',
      name: 'Specialized Labs',
      count: 48,
      percent: 25.4,
      color: '#db822a', // Warm Ochre
      hours: '64 hrs',
      strokeDash: '86.2 339.3',
      strokeOffset: '-197.5',
    },
    {
      id: 'tutorials',
      name: 'Cohort Tutorials',
      count: 20,
      percent: 10.6,
      color: '#4e7561', // Architectural Sage
      hours: '24 hrs',
      strokeDash: '36.0 339.3',
      strokeOffset: '-283.7',
    },
    {
      id: 'exams',
      name: 'Exams & Events',
      count: 11,
      percent: 5.8,
      color: '#3a2216', // Deep Chocolate
      hours: '13 hrs',
      strokeDash: '19.7 339.3',
      strokeOffset: '-319.7',
    },
  ];

  return (
    <div className="faculty-dashboard-container animate-fade-in-up">
      {/* 1. Summary KPI Metrics Strip */}
      <div className="dashboard-stats-strip">
        <div className="stat-clean-card">
          <div className="stat-clean-icon" style={{ background: 'var(--accent-sage-light)', color: 'var(--accent-sage)' }}>
            <Clock size={18} />
          </div>
          <div>
            <div className="stat-clean-val">189 Sessions</div>
            <div className="stat-clean-label">243 Weekly Teaching Hours</div>
          </div>
        </div>

        <div className="stat-clean-card">
          <div className="stat-clean-icon" style={{ background: 'var(--accent-terracotta-light)', color: 'var(--accent-terracotta)' }}>
            <Users size={18} />
          </div>
          <div>
            <div className="stat-clean-val">14 Cohorts</div>
            <div className="stat-clean-label">CSE, ECE, ME, IT, EE Batches</div>
          </div>
        </div>

        <div className="stat-clean-card">
          <div className="stat-clean-icon" style={{ background: 'var(--accent-ochre-light)', color: 'var(--accent-ochre)' }}>
            <Building2 size={18} />
          </div>
          <div>
            <div className="stat-clean-val">27 Venues</div>
            <div className="stat-clean-label">27 Rooms (incl. 7 Labs)</div>
          </div>
        </div>

        <div className="stat-clean-card">
          <div className="stat-clean-icon" style={{ background: 'var(--accent-chocolate-light)', color: '#5c3523' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div className="stat-clean-val">0 Clashes</div>
            <div className="stat-clean-label">100% Policy Compliance</div>
          </div>
        </div>
      </div>

      {/* 2. Fitted Compact Session Graphs & Pie Charts Row */}
      <div className="dashboard-charts-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 16 }}>
        {/* Weekly Activity Multi-Bar Session Graph (Fitted) */}
        <div className="white-app-card" style={{ padding: '12px 16px', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BarChart3 size={15} color="var(--accent-terracotta)" />
              <h3 className="section-title" style={{ fontSize: 13.5, margin: 0, fontWeight: 800 }}>
                Weekly Session Activity
              </h3>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--accent-sage)', background: 'var(--accent-sage-light)', border: '1px solid var(--accent-sage-border)', padding: '1px 7px', borderRadius: 9999 }}>
              189 Sessions
            </span>
          </div>

          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>
            Monday to Saturday session distribution across periods P1–P13.
          </p>

          {/* SVG Responsive Multi-Bar Chart (Fitted Height) */}
          <div style={{ width: '100%', overflow: 'hidden', paddingTop: 2 }}>
            <svg viewBox="0 0 360 88" style={{ width: '100%', height: 'auto', maxHeight: 88, display: 'block' }}>
              {/* Background horizontal grid lines */}
              <line x1="28" y1="12" x2="350" y2="12" stroke="var(--border-subtle)" strokeDasharray="2 2" />
              <line x1="28" y1="36" x2="350" y2="36" stroke="var(--border-subtle)" strokeDasharray="2 2" />
              <line x1="28" y1="60" x2="350" y2="60" stroke="var(--border-subtle)" strokeDasharray="2 2" />
              <line x1="28" y1="72" x2="350" y2="72" stroke="var(--border-default)" strokeWidth="1" />

              {/* Y-axis Labels */}
              <text x="24" y="15" fill="var(--text-muted)" fontSize="8" textAnchor="end">35h</text>
              <text x="24" y="39" fill="var(--text-muted)" fontSize="8" textAnchor="end">20h</text>
              <text x="24" y="63" fill="var(--text-muted)" fontSize="8" textAnchor="end">10h</text>
              <text x="24" y="75" fill="var(--text-muted)" fontSize="8" textAnchor="end">0h</text>

              {/* Bars per Weekday */}
              {WEEKLY_ACTIVITY_DATA.map((item, index) => {
                const xBase = 54 + index * 50;
                const maxH = 50;
                const lecH = Math.min((item.lectures / 35) * maxH, maxH);
                const labH = Math.min((item.labs / 35) * maxH, maxH);
                const tutH = Math.min((item.tutorials / 35) * maxH, maxH);

                return (
                  <g key={item.day} className="chart-bar-group">
                    {/* Lectures bar (Terracotta) */}
                    <rect
                      x={xBase - 10}
                      y={72 - lecH}
                      width="7"
                      height={lecH}
                      rx="2"
                      fill="#c54a26"
                      className="animated-chart-bar"
                    >
                      <title>{`${item.day}: ${item.lectures} Lectures`}</title>
                    </rect>

                    {/* Labs bar (Warm Ochre) */}
                    <rect
                      x={xBase - 2}
                      y={72 - labH}
                      width="7"
                      height={labH}
                      rx="2"
                      fill="#db822a"
                      className="animated-chart-bar"
                    >
                      <title>{`${item.day}: ${item.labs} Labs`}</title>
                    </rect>

                    {/* Tutorials bar (Architectural Sage) */}
                    <rect
                      x={xBase + 6}
                      y={72 - tutH}
                      width="7"
                      height={tutH}
                      rx="2"
                      fill="#4e7561"
                      className="animated-chart-bar"
                    >
                      <title>{`${item.day}: ${item.tutorials} Tutorials`}</title>
                    </rect>

                    {/* Day Label */}
                    <text
                      x={xBase + 2}
                      y="83"
                      fill="var(--text-primary)"
                      fontSize="9"
                      textAnchor="middle"
                      fontWeight="700"
                    >
                      {item.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Compact Chart Legend */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 2, flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--text-secondary)' }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: '#c54a26', display: 'inline-block' }} />
              <span>Lectures</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--text-secondary)' }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: '#db822a', display: 'inline-block' }} />
              <span>Labs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--text-secondary)' }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: '#4e7561', display: 'inline-block' }} />
              <span>Tutorials</span>
            </div>
          </div>
        </div>

        {/* Academic Session Distribution Pie / Donut Chart (Fitted) */}
        <div className="white-app-card" style={{ padding: '12px 16px', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <PieChartIcon size={15} color="var(--accent-ochre)" />
              <h3 className="section-title" style={{ fontSize: 13.5, margin: 0, fontWeight: 800 }}>
                Session Distribution
              </h3>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--accent-terracotta)', background: 'var(--accent-terracotta-light)', border: '1px solid var(--accent-terracotta-border)', padding: '1px 7px', borderRadius: 9999 }}>
              243 Teaching Hours
            </span>
          </div>

          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0 }}>
            Curriculum proportion across 14 student cohorts.
          </p>

          {/* SVG Donut / Pie Chart with Interactive Center (Fitted) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 10, flexWrap: 'wrap', padding: '2px 0' }}>
            <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border-subtle)" strokeWidth="12" />

                {/* Donut Segments */}
                {pieCategories.map((cat) => {
                  const isHovered = hoveredSlice === cat.id;
                  const dashArr = (cat.percent / 100) * 238.76;
                  const offsetMap = {
                    lectures: 0,
                    labs: -((58.2 / 100) * 238.76),
                    tutorials: -(((58.2 + 25.4) / 100) * 238.76),
                    exams: -(((58.2 + 25.4 + 10.6) / 100) * 238.76),
                  };

                  return (
                    <circle
                      key={cat.id}
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke={cat.color}
                      strokeWidth={isHovered ? 14 : 12}
                      strokeDasharray={`${dashArr.toFixed(1)} 238.8`}
                      strokeDashoffset={offsetMap[cat.id] || 0}
                      style={{
                        cursor: 'pointer',
                        transition: 'stroke-width 0.2s, opacity 0.2s',
                        opacity: hoveredSlice && !isHovered ? 0.6 : 1,
                      }}
                      onMouseEnter={() => setHoveredSlice(cat.id)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    >
                      <title>{`${cat.name}: ${cat.count} sessions (${cat.percent}%)`}</title>
                    </circle>
                  );
                })}
              </svg>

              {/* Center Counter */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span style={{ fontSize: 14.5, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {hoveredSlice ? pieCategories.find((c) => c.id === hoveredSlice)?.count : '189'}
                </span>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 1 }}>
                  {hoveredSlice ? pieCategories.find((c) => c.id === hoveredSlice)?.name.split(' ')[0] : 'Sessions'}
                </span>
              </div>
            </div>

            {/* Pie Categories Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 130 }}>
              {pieCategories.map((cat) => (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredSlice(cat.id)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '2px 5px',
                    borderRadius: 4,
                    background: hoveredSlice === cat.id ? 'var(--bg-card-subtle)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: cat.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: hoveredSlice === cat.id ? 700 : 600, color: 'var(--text-primary)' }}>
                      {cat.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {cat.count}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: cat.color, background: `${cat.color}18`, padding: '1px 3px', borderRadius: 3 }}>
                      {cat.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Workspace (Today's Schedule + Venue Occupancy & Action Items) */}
      <div className="dashboard-main-grid" style={{ display: 'flex', gap: 20 }}>
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

          <div key={activeWeekdayId} className="daily-schedule-list tab-motion-content" style={{ maxHeight: 380, overflowY: 'auto' }}>
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
                      {/* Interactive Completion Toggle */}
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

        {/* Right Column: Venue Occupancy & Action Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
          {/* Venue & Specialized Labs Utilization */}
          <div className="white-app-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={16} color="var(--accent-terracotta)" />
                <h3 className="section-title" style={{ fontSize: 15, margin: 0 }}>
                  Venue &amp; 7 Labs Utilization
                </h3>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-sage)', background: 'var(--accent-sage-light)', padding: '2px 6px', borderRadius: 4 }}>
                88.4% Average
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ROOM_UTILIZATION_DATA.slice(0, 4).map((r) => {
                const percent = Math.round((r.occupiedHours / r.maxHours) * 100);
                const isHigh = percent >= 85;
                return (
                  <div key={r.room} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.room} ({r.type})</span>
                      <span style={{ fontWeight: 700, color: isHigh ? 'var(--accent-terracotta)' : 'var(--text-secondary)' }}>
                        {percent}% ({r.occupiedHours}h/{r.maxHours}h)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'var(--border-subtle)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          background: isHigh
                            ? 'linear-gradient(90deg, var(--accent-ochre), var(--accent-terracotta))'
                            : 'var(--accent-sage)',
                          borderRadius: 9999,
                          transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Checklist / Tasks */}
          <div className="white-app-card" style={{ flex: 1 }}>
            <h3 className="section-title" style={{ fontSize: 15, marginBottom: 12 }}>
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
                    background: task.done ? 'var(--bg-card-subtle)' : '#ffffff',
                    border: '1px solid var(--border-default)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ marginTop: 2 }}>
                    {task.done ? (
                      <CheckCircle2 size={16} color="var(--accent-sage)" />
                    ) : (
                      <Circle size={16} color="var(--text-muted)" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {task.text}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                      Due {task.due}
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
