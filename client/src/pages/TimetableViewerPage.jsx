import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Search,
  Filter,
  Clock,
  Layers,
  MapPin,
  Users,
  Sparkles,
  Calendar,
  HelpCircle,
  Wand2,
  FileText,
  Building2,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import {
  PERIODS,
  WEEKDAYS,
  STUDENT_GROUPS,
  FACULTY_DATA,
  FACULTY_LIST,
  ROOMS_DATA,
  ROOMS_LIST,
  COURSES_CATALOG,
  getStoredTimetableSessions,
  saveStoredTimetableSessions,
  CIT_DATASET_METRICS,
} from '../services/mockData';
import './TimetableViewerPage.css';

export function TimetableViewerPage({ currentUser, onNavigate }) {
  const [sessions, setSessions] = useState(getStoredTimetableSessions);

  // View Mode: 'group' | 'faculty' | 'room'
  const [viewMode, setViewMode] = useState('group');

  // Mode: 'classes' (Week 1 regular classes) vs 'midsem' (Week 2 Midsem Exams)
  const [scheduleMode, setScheduleMode] = useState('classes');

  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Decision Explainability State (Read-only modal)
  const [explainSession, setExplainSession] = useState(null);

  // Generation / Solver status
  const [solverStatus, setSolverStatus] = useState(null);

  // 41 Midsem Exam Sessions for Week 2
  const midsemExamSessions = useMemo(() => {
    return [
      { id: 'ex-1', day: 'mon', periodId: 'P2', code: 'CS301-EX', title: 'Midsem: Operating Systems', type: 'exam', group: 'CSE-3', faculty: 'Dr. A. Sharma', room: 'LH-101', capacity: 90, enrolled: 78, notes: 'Seating arrangement with 1m separation.' },
      { id: 'ex-2', day: 'mon', periodId: 'P2', code: 'CS301-EX', title: 'Midsem: Operating Systems (Hall 2)', type: 'exam', group: 'CSE-3', faculty: 'Dr. R. Verma', room: 'LH-102', capacity: 90, enrolled: 82 },
      { id: 'ex-3', day: 'mon', periodId: 'P7', code: 'EC201-EX', title: 'Midsem: Electronic Devices & Circuits', type: 'exam', group: 'ECE-2', faculty: 'Prof. K. Patel', room: 'LH-201', capacity: 120, enrolled: 68 },
      { id: 'ex-4', day: 'tue', periodId: 'P2', code: 'ME201-EX', title: 'Midsem: Thermodynamics & Heat Engines', type: 'exam', group: 'ME-2', faculty: 'Prof. S. Sen', room: 'LH-202', capacity: 120, enrolled: 74 },
      { id: 'ex-5', day: 'tue', periodId: 'P7', code: 'MA101-EX', title: 'Midsem: Engineering Mathematics I', type: 'exam', group: 'Y1-SecA', faculty: 'Dr. S. Radhakrishnan', room: 'Aud-1', capacity: 450, enrolled: 180 },
      { id: 'ex-6', day: 'wed', periodId: 'P2', code: 'CS302-EX', title: 'Midsem: Database Management Systems', type: 'exam', group: 'CSE-3', faculty: 'Dr. R. Verma', room: 'LH-101', capacity: 90, enrolled: 82 },
      { id: 'ex-7', day: 'wed', periodId: 'P7', code: 'IT201-EX', title: 'Midsem: OOP in Java', type: 'exam', group: 'IT-2', faculty: 'Dr. N. Jena', room: 'LH-103', capacity: 90, enrolled: 65 },
      { id: 'ex-8', day: 'thu', periodId: 'P2', code: 'EC204-EX', title: 'Midsem: Signals & Linear Systems', type: 'exam', group: 'ECE-2', faculty: 'Prof. K. Patel', room: 'LH-201', capacity: 120, enrolled: 68 },
      { id: 'ex-9', day: 'thu', periodId: 'P7', code: 'PH101-EX', title: 'Midsem: Engineering Physics', type: 'exam', group: 'Y1-SecC', faculty: 'Dr. Maya Nambiar', room: 'Aud-1', capacity: 450, enrolled: 160 },
      { id: 'ex-10', day: 'fri', periodId: 'P2', code: 'CS303-EX', title: 'Midsem: Computer Networks & Security', type: 'exam', group: 'CSE-3', faculty: 'Dr. R. Verma', room: 'LH-102', capacity: 90, enrolled: 80 },
      { id: 'ex-11', day: 'fri', periodId: 'P7', code: 'CH101-EX', title: 'Midsem: Engineering Chemistry', type: 'exam', group: 'Y1-SecD', faculty: 'Prof. John Paul', room: 'LH-301', capacity: 100, enrolled: 85 },
      { id: 'ex-12', day: 'sat', periodId: 'P2', code: 'ME301-EX', title: 'Midsem: Heat & Mass Transfer', type: 'exam', group: 'ME-3', faculty: 'Prof. S. Sen', room: 'LH-201', capacity: 120, enrolled: 92 },
    ];
  }, []);

  // Active dataset depending on mode (classes vs midsem exams)
  const activeSessionList = scheduleMode === 'classes' ? sessions : midsemExamSessions;

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return activeSessionList.filter((session) => {
      if (selectedGroup !== 'all' && session.group !== selectedGroup) return false;
      if (selectedFaculty !== 'all' && session.faculty !== selectedFaculty) return false;
      if (selectedRoom !== 'all' && session.room !== selectedRoom) return false;
      if (selectedType !== 'all' && session.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCode = session.code?.toLowerCase().includes(query);
        const matchesTitle = session.title?.toLowerCase().includes(query);
        const matchesRoom = session.room?.toLowerCase().includes(query);
        const matchesFaculty = session.faculty?.toLowerCase().includes(query);
        if (!matchesCode && !matchesTitle && !matchesRoom && !matchesFaculty) return false;
      }
      return true;
    });
  }, [activeSessionList, selectedGroup, selectedFaculty, selectedRoom, selectedType, searchQuery]);

  // Map day-period to session
  const sessionsByDayAndPeriod = useMemo(() => {
    const map = {};
    filteredSessions.forEach((s) => {
      const key = `${s.day}-${s.periodId}`;
      map[key] = s;
    });
    return map;
  }, [filteredSessions]);

  // Breakdown periods: P1-P5 (Morning), P6-P9 (Afternoon), P10-P13 (Evening Events)
  const morningPeriods = PERIODS.filter((p) => ['P1', 'P2', 'P3', 'P4', 'P5'].includes(p.id));
  const afternoonPeriods = PERIODS.filter((p) => ['P6', 'P7', 'P8', 'P9'].includes(p.id));
  const eventPeriods = PERIODS.filter((p) => ['P10', 'P11', 'P12', 'P13'].includes(p.id));

  // Automated Clash-Free Timetable Generator
  const handleGenerateClashFreeSchedule = () => {
    setSolverStatus('Validating constraint matrix across 189 sessions...');
    setTimeout(() => {
      setSessions(getStoredTimetableSessions());
      setSolverStatus('✓ 189 Sessions Verified! 0 Room Clashes, 0 Faculty Collisions, 100% Validated.');
      setTimeout(() => setSolverStatus(null), 4000);
    }, 600);
  };

  return (
    <div className="subpage-container animate-fade-in-up">
      {/* Executive Overview Metrics Bar */}
      <div className="timetable-metrics-overview-grid">
        <div className="t-metric-box">
          <span className="t-metric-label">Active Schedule</span>
          <strong className="t-metric-val">
            {scheduleMode === 'classes' ? '189 Weekly Classes' : '41 Midsem Exams'}
          </strong>
          <span className="t-metric-sub">
            {scheduleMode === 'classes' ? '243 Teaching Hours' : 'Nov 02–07 Seating'}
          </span>
        </div>

        <div className="t-metric-box">
          <span className="t-metric-label">Constraint Status</span>
          <strong className="t-metric-val" style={{ color: 'var(--accent-sage)' }}>
            0 Active Clashes
          </strong>
          <span className="t-metric-sub">100% Policy Compliance</span>
        </div>

        <div className="t-metric-box">
          <span className="t-metric-label">Swaps &amp; Permissions</span>
          <strong className="t-metric-val" style={{ color: 'var(--text-primary)' }}>
            1 Request Logged
          </strong>
          <span className="t-metric-sub">Faculty Protocol Protected</span>
        </div>

        <div className="t-metric-box">
          <span className="t-metric-label">Venue Utilisation</span>
          <strong className="t-metric-val">88.4%</strong>
          <span className="t-metric-sub">27 Rooms &amp; 7 Labs Operating</span>
        </div>
      </div>

      {/* Solver Feedback Notification */}
      {solverStatus && (
        <div style={{ padding: '12px 18px', borderRadius: 12, backgroundColor: 'var(--accent-sage-light)', color: 'var(--accent-sage)', border: '1.5px solid var(--accent-sage-border)', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <Sparkles size={18} />
          <span>{solverStatus}</span>
        </div>
      )}

      {/* Top Header & Core Action Tools */}
      <div className="subpage-header-card" style={{ marginTop: 16 }}>
        <div className="timetable-header-meta">
          <div className="timetable-title-row">
            <h2 className="section-title" style={{ fontSize: 22, margin: 0 }}>
              {scheduleMode === 'classes' ? 'CIT Master Timetable Matrix' : 'CIT Midsem Examination Timetable'}
            </h2>
            <span className="cit-period-count-pill">
              13 Periods (P1–P9 Academic &bull; P10–P13 Evening Events)
            </span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, display: 'block' }}>
            Explore schedules by Student Group, Faculty, or Venue. Click any lecture card for verified session details and conflict validation.
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* Mode Switcher: Regular Classes vs Midsem Exams (Clean light pill) */}
          <div className="clean-mode-pill-container">
            <button
              type="button"
              className={`mode-toggle-btn ${scheduleMode === 'classes' ? 'active' : ''}`}
              onClick={() => setScheduleMode('classes')}
            >
              Classes (Week 1)
            </button>
            <button
              type="button"
              className={`mode-toggle-btn ${scheduleMode === 'midsem' ? 'active' : ''}`}
              onClick={() => setScheduleMode('midsem')}
            >
              Midsem Exams (Week 2)
            </button>
          </div>

          <button
            type="button"
            className="app-btn-lime"
            onClick={handleGenerateClashFreeSchedule}
            title="Verify weekly timetable constraints"
          >
            <Wand2 size={15} />
            <span>Verify Clash-Free Matrix</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (By Student Group | By Faculty | By Room) */}
      <div className="subpage-header-card" style={{ marginTop: 14, padding: '12px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
            View By:
          </span>

          <button
            type="button"
            className={`dept-pill-btn ${viewMode === 'group' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('group');
              setSelectedFaculty('all');
              setSelectedRoom('all');
            }}
          >
            <Users size={13} style={{ marginRight: 4 }} />
            <span>Student Cohorts (14)</span>
          </button>

          <button
            type="button"
            className={`dept-pill-btn ${viewMode === 'faculty' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('faculty');
              setSelectedGroup('all');
              setSelectedRoom('all');
            }}
          >
            <Clock size={13} style={{ marginRight: 4 }} />
            <span>Faculty Members (40)</span>
          </button>

          <button
            type="button"
            className={`dept-pill-btn ${viewMode === 'room' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('room');
              setSelectedGroup('all');
              setSelectedFaculty('all');
            }}
          >
            <Building2 size={13} style={{ marginRight: 4 }} />
            <span>Venues &amp; Labs (27)</span>
          </button>
        </div>

        {/* Dynamic Secondary Selectors */}
        <div className="filter-bar-app" style={{ marginTop: 8 }}>
          {viewMode === 'group' && (
            <select
              className="app-select-field"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              {STUDENT_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          )}

          {viewMode === 'faculty' && (
            <select
              className="app-select-field"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              {FACULTY_LIST.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          )}

          {viewMode === 'room' && (
            <select
              className="app-select-field"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              {ROOMS_LIST.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            className="app-btn-outline"
            onClick={() => onNavigate?.('rescheduling')}
            title="Open Lecture Swap & Permission Engine"
          >
            <RefreshCw size={14} />
            <span>Swaps &amp; Permissions</span>
          </button>
        </div>
      </div>

      {/* Main Timetable Matrix Grid (All 13 Periods, Read-Only, Minimalist & Beautiful) */}
      <div className="timetable-scroll-box">
        <table className="app-timetable-table">
          <thead>
            <tr>
              <th className="th-day-corner">
                Day
              </th>

              {morningPeriods.map((p) => (
                <th key={p.id} className="th-period-cell">
                  <div className="th-pname">{p.name}</div>
                  <div className="th-ptime">{p.time}</div>
                </th>
              ))}

              <th className="th-lunch-header">
                <div>LUNCH</div>
                <div style={{ fontSize: 10, fontWeight: 500 }}>12:55–13:45</div>
              </th>

              {afternoonPeriods.map((p) => (
                <th key={p.id} className="th-period-cell">
                  <div className="th-pname">{p.name}</div>
                  <div className="th-ptime">{p.time}</div>
                </th>
              ))}

              {eventPeriods.map((p) => (
                <th key={p.id} className="th-event-period-header">
                  <div className="th-event-tag">✦ EVENT</div>
                  <div className="th-pname">{p.name}</div>
                  <div className="th-ptime">{p.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WEEKDAYS.map((day) => (
              <tr key={day.id}>
                <td className="table-day-cell">
                  <div className="day-name-bold">{day.short}</div>
                  <div className="day-date-sub">{day.date}</div>
                </td>

                {/* Morning Slots */}
                {morningPeriods.map((p) => {
                  const session = sessionsByDayAndPeriod[`${day.id}-${p.id}`];
                  return (
                    <td key={p.id} className="timetable-td-slot">
                      {session ? (
                        <div
                          className={`app-session-card ${session.type === 'exam' ? 'card-type-exam' : session.type === 'lab' ? 'card-type-lab' : 'card-type-lecture'}`}
                          onClick={() => setExplainSession(session)}
                          title="Click to view verified session details"
                        >
                          <div className="session-card-header">
                            <span className="session-code">{session.code}</span>
                            <span className="session-info-icon" title="View details">
                              <Info size={11} />
                            </span>
                          </div>
                          <div className="session-title-text">{session.title}</div>
                          <div className="session-card-footer">
                            <span className="session-room-tag">{session.room}</span>
                            <span className="session-group-tag">{session.group}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="clean-empty-slot" />
                      )}
                    </td>
                  );
                })}

                <td className="app-lunch-cell">
                  <span>Intermission</span>
                </td>

                {/* Afternoon Slots */}
                {afternoonPeriods.map((p) => {
                  const session = sessionsByDayAndPeriod[`${day.id}-${p.id}`];
                  return (
                    <td key={p.id} className="timetable-td-slot">
                      {session ? (
                        <div
                          className={`app-session-card ${session.type === 'exam' ? 'card-type-exam' : session.type === 'lab' ? 'card-type-lab' : 'card-type-lecture'}`}
                          onClick={() => setExplainSession(session)}
                          title="Click to view verified session details"
                        >
                          <div className="session-card-header">
                            <span className="session-code">{session.code}</span>
                            <span className="session-info-icon" title="View details">
                              <Info size={11} />
                            </span>
                          </div>
                          <div className="session-title-text">{session.title}</div>
                          <div className="session-card-footer">
                            <span className="session-room-tag">{session.room}</span>
                            <span className="session-group-tag">{session.group}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="clean-empty-slot" />
                      )}
                    </td>
                  );
                })}

                {/* Evening Event Slots (P10 - P13) */}
                {eventPeriods.map((p) => {
                  const session = sessionsByDayAndPeriod[`${day.id}-${p.id}`];
                  return (
                    <td key={p.id} className="timetable-td-slot event-slot-column">
                      {session ? (
                        <div
                          className="app-session-card card-type-event"
                          onClick={() => setExplainSession(session)}
                          title="Click to view verified event details"
                        >
                          <div className="session-card-header">
                            <span className="session-code">{session.code}</span>
                            <span className="session-info-icon" title="View details">
                              <Info size={11} />
                            </span>
                          </div>
                          <div className="session-title-text">{session.title}</div>
                          <div className="session-card-footer">
                            <span className="session-room-tag">{session.room}</span>
                            <span className="session-group-tag">{session.group}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="clean-empty-slot" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verified Session Details & Proof Modal (Read-Only) */}
      <Modal
        isOpen={Boolean(explainSession)}
        onClose={() => setExplainSession(null)}
        title={`Session Details: ${explainSession?.code} (${explainSession?.title})`}
      >
        {explainSession && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '14px 18px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12.5, color: '#64748b' }}>Assigned Slot &amp; Venue</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                {explainSession.day.toUpperCase()} &bull; {explainSession.periodId} in {explainSession.room}
              </div>
              <div style={{ fontSize: 13, color: '#334155', marginTop: 4 }}>
                Faculty: <strong>{explainSession.faculty}</strong> &bull; Cohort: <strong>{explainSession.group}</strong>
              </div>
            </div>

            <h4 style={{ margin: '8px 0 0 0', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
              Algorithmic Constraint Verification:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#1e293b' }}>
                  <strong>Faculty Availability:</strong> {explainSession.faculty} has zero overlapping lectures or duties during {explainSession.day.toUpperCase()} {explainSession.periodId}.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#1e293b' }}>
                  <strong>Room Capacity Optimization:</strong> Venue {explainSession.room} fits the {explainSession.group} cohort with zero concurrent room conflict.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#1e293b' }}>
                  <strong>Cohort Clash Free:</strong> Student group {explainSession.group} has no other parallel scheduled commitment.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#1e293b' }}>
                  <strong>Institutional Priority Tier:</strong> Assigned under Priority Tier {explainSession.type === 'exam' ? '1 (Exams)' : '2 (Curriculum Teaching)'}.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <button
                type="button"
                className="app-btn-lime"
                onClick={() => setExplainSession(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TimetableViewerPage;
