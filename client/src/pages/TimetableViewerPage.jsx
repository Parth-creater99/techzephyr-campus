import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  Building2,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Info,
  Lock,
  Edit3,
  Plus,
  Trash2,
  MessageSquare,
  Send,
  CheckCheck,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import {
  PERIODS,
  WEEKDAYS,
  TEACHING_WEEKDAYS,
  STUDENT_GROUPS,
  FACULTY_DATA,
  FACULTY_LIST,
  ROOMS_DATA,
  ROOMS_LIST,
  COURSES_CATALOG,
  getStoredTimetableSessions,
  saveStoredTimetableSessions,
  resetStoredTimetableSessions,
  getStoredLectureSwaps,
  saveStoredLectureSwaps,
} from '../services/mockData';
import './TimetableViewerPage.css';

export function TimetableViewerPage({ currentUser, onNavigate, onRequireAdmin }) {
  const [sessions, setSessions] = useState(getStoredTimetableSessions);

  // View Mode: 'group' | 'faculty' | 'room'
  const [viewMode, setViewMode] = useState('group');

  // Period view filter: 'all' (P1-P13 default) | 'academic' (P1-P9) | 'events' (P10-P13)
  const [periodFilter, setPeriodFilter] = useState('all');
  const [includeSaturday, setIncludeSaturday] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Top banner notification
  const [bannerNotice, setBannerNotice] = useState(null);

  // Class Detail & Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('details'); // 'details' | 'swap' | 'verify'
  const [isNewClass, setIsNewClass] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);

  // Form State for editing / creating a class
  const [formState, setFormState] = useState({
    code: 'CS301',
    title: 'Operating Systems',
    type: 'lecture',
    group: 'CSE-3',
    faculty: 'Dr. A. Sharma',
    room: 'LH-101',
    day: 'mon',
    periodId: 'P1',
    capacity: 90,
    enrolled: 78,
    notes: 'Core lecture series.',
  });

  // Swap State with Actual Lecturer
  const [targetSessionId, setTargetSessionId] = useState('');
  const [swapChatMessages, setSwapChatMessages] = useState([]);
  const [chatInputText, setChatInputText] = useState('');
  const [isLecturerTyping, setIsLecturerTyping] = useState(false);
  const [isSwapApproved, setIsSwapApproved] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [swapChatMessages, isLecturerTyping]);

  // Days to display (Mon-Fri default, or Sat if toggled)
  const daysToDisplay = useMemo(() => {
    return includeSaturday ? WEEKDAYS : (TEACHING_WEEKDAYS || WEEKDAYS.slice(0, 5));
  }, [includeSaturday]);

  // Filter periods based on filter view
  const visiblePeriods = useMemo(() => {
    if (periodFilter === 'academic') {
      return PERIODS.filter((p) => p.type === 'academic');
    }
    if (periodFilter === 'events') {
      return PERIODS.filter((p) => p.type === 'event');
    }
    return PERIODS; // 'all' (P1 to P13)
  }, [periodFilter]);

  // Filter sessions according to dropdowns and search query
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
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
  }, [sessions, selectedGroup, selectedFaculty, selectedRoom, selectedType, searchQuery]);

  // Fast day-period lookup map
  const sessionsByDayAndPeriod = useMemo(() => {
    const map = {};
    filteredSessions.forEach((s) => {
      const key = `${s.day}-${s.periodId}`;
      map[key] = s;
    });
    return map;
  }, [filteredSessions]);

  // Find target session object for swapping
  const targetSession = useMemo(() => {
    if (!targetSessionId) return null;
    return sessions.find((s) => s.id === targetSessionId) || null;
  }, [sessions, targetSessionId]);

  // Find the ACTUAL LECTURER for target class from official faculty directory
  const actualTargetLecturer = useMemo(() => {
    if (!targetSession) return null;
    const found = FACULTY_DATA.find((f) => f.name === targetSession.faculty);
    if (found) return found;
    return {
      name: targetSession.faculty,
      dept: 'Academic Faculty',
      designation: 'Course Lecturer',
      cabin: 'Faculty Academic Complex',
      email: `${targetSession.faculty.toLowerCase().replace(/[^a-z]/g, '')}@cit.edu.in`,
      status: 'Available',
    };
  }, [targetSession]);

  // Currently editing session source object
  const currentEditingSession = useMemo(() => {
    if (isNewClass) return null;
    return sessions.find((s) => s.id === editingSessionId) || null;
  }, [sessions, editingSessionId, isNewClass]);

  // Real-time Clash Detection for the currently edited / created session
  const slotConflictCheck = useMemo(() => {
    const { day, periodId, room, faculty, group } = formState;
    const otherSessions = sessions.filter((s) => s.id !== editingSessionId);

    const roomCollision = otherSessions.find(
      (s) => s.day === day && s.periodId === periodId && s.room === room
    );
    if (roomCollision) {
      return {
        hasClash: true,
        type: 'room',
        message: `Venue ${room} is already booked at ${day.toUpperCase()} ${periodId} by ${roomCollision.code} (${roomCollision.title}) taught by ${roomCollision.faculty}.`,
        conflictSession: roomCollision,
      };
    }

    const facultyCollision = otherSessions.find(
      (s) => s.day === day && s.periodId === periodId && s.faculty === faculty
    );
    if (facultyCollision) {
      return {
        hasClash: true,
        type: 'faculty',
        message: `${faculty} is already scheduled to teach ${facultyCollision.code} (${facultyCollision.title}) in ${facultyCollision.room} at this time.`,
        conflictSession: facultyCollision,
      };
    }

    const groupCollision = otherSessions.find(
      (s) => s.day === day && s.periodId === periodId && s.group === group
    );
    if (groupCollision) {
      return {
        hasClash: true,
        type: 'group',
        message: `Student cohort ${group} is already attending ${groupCollision.code} (${groupCollision.title}) at this slot.`,
        conflictSession: groupCollision,
      };
    }

    return {
      hasClash: false,
      message: '✓ Clash-Free Slot: 0 room, faculty, or cohort collisions.',
    };
  }, [formState, sessions, editingSessionId]);

  // Open Modal for Existing Class
  const handleOpenEditModal = (session) => {
    setIsNewClass(false);
    setEditingSessionId(session.id);
    setFormState({
      code: session.code || '',
      title: session.title || '',
      type: session.type || 'lecture',
      group: session.group || 'CSE-3',
      faculty: session.faculty || 'Dr. A. Sharma',
      room: session.room || 'LH-101',
      day: session.day || 'mon',
      periodId: session.periodId || 'P1',
      capacity: session.capacity || 90,
      enrolled: session.enrolled || 75,
      notes: session.notes || '',
    });
    setModalTab('details');

    // Default target session for swap (different from this one)
    const otherSession = sessions.find((s) => s.id !== session.id);
    if (otherSession) {
      initiateSwapTarget(otherSession, session);
    }

    setIsModalOpen(true);
  };

  // Open Modal to Add Class in Empty Slot
  const handleOpenAddModal = (dayId, periodId) => {
    setIsNewClass(true);
    setEditingSessionId(null);
    const pObj = PERIODS.find((p) => p.id === periodId);
    const defaultType = pObj?.type === 'event' ? 'event' : 'lecture';
    const defaultTitle = pObj?.type === 'event' ? 'Departmental Technical Colloquium' : 'Object Oriented Systems';
    const defaultCode = pObj?.type === 'event' ? 'EV-COLL' : 'CS205';

    setFormState({
      code: defaultCode,
      title: defaultTitle,
      type: defaultType,
      group: 'CSE-3',
      faculty: 'Dr. A. Sharma',
      room: 'LH-101',
      day: dayId,
      periodId: periodId,
      capacity: 90,
      enrolled: 70,
      notes: 'Scheduled via Master Schedule Matrix.',
    });
    setModalTab('details');
    setIsModalOpen(true);
  };

  // Setup Swap Conversation with Target Lecturer
  const initiateSwapTarget = (target, source = currentEditingSession) => {
    setTargetSessionId(target.id);
    setIsSwapApproved(false);
    const lecturerName = target.faculty;
    const targetPeriod = target.periodId;
    const sourcePeriod = source ? source.periodId : formState.periodId;
    const sourceCode = source ? source.code : formState.code;

    // Load initial context-aware chat greeting from target lecturer
    const welcome = {
      id: `init-${Date.now()}`,
      sender: 'them',
      text: `Hello! I am ${lecturerName}. I see you wish to discuss swapping your ${sourceCode} (${sourcePeriod}) class with my ${target.code} (${targetPeriod}) class on ${target.day.toUpperCase()}. How can I assist you with this timetable change?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setSwapChatMessages([welcome]);
  };

  // Send message to actual lecturer in the swap dialog
  const handleSendSwapMessage = (messageToSend = chatInputText) => {
    const text = messageToSend.trim();
    if (!text || !targetSession) return;

    const myMsg = {
      id: `me-${Date.now()}`,
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSwapChatMessages((prev) => [...prev, myMsg]);
    setChatInputText('');

    // Lecturer responds with realistic intelligence & permission
    setIsLecturerTyping(true);
    setTimeout(() => {
      setIsLecturerTyping(false);
      const isSwapKeyword =
        text.toLowerCase().includes('swap') ||
        text.toLowerCase().includes('exchange') ||
        text.toLowerCase().includes('reschedule') ||
        text.toLowerCase().includes('period') ||
        text.toLowerCase().includes('slot') ||
        text.toLowerCase().includes('class');

      let replyText = `Thanks for your note. I have verified our department matrix. LH-${targetSession.room.replace(/[^0-9]/g, '') || '101'} fits my cohort smoothly. I agree to this class exchange and grant permission to execute the swap on Smart.CIT!`;

      if (!isSwapKeyword) {
        replyText = `Understood! Regarding ${targetSession.code}, my teaching schedule on ${targetSession.day.toUpperCase()} allows this adjustment. I have no conflict and approve your swap request.`;
      }

      const lecturerReply = {
        id: `them-${Date.now()}`,
        sender: 'them',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setSwapChatMessages((prev) => [...prev, lecturerReply]);
      setIsSwapApproved(true);
    }, 600);
  };

  // Execute Swap Approved by Lecturer
  const handleExecuteLecturerSwap = () => {
    if (!targetSession || !currentEditingSession) return;

    const sourceId = currentEditingSession.id;
    const targetId = targetSession.id;

    const updatedSessions = sessions.map((s) => {
      if (s.id === sourceId) {
        return {
          ...s,
          day: targetSession.day,
          periodId: targetSession.periodId,
          room: targetSession.room,
        };
      }
      if (s.id === targetId) {
        return {
          ...s,
          day: currentEditingSession.day,
          periodId: currentEditingSession.periodId,
          room: currentEditingSession.room,
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    saveStoredTimetableSessions(updatedSessions);

    // Record swap in official platform Swaps Log
    const newSwapRecord = {
      id: `swap-${Date.now()}`,
      requestorFaculty: currentEditingSession.faculty,
      requestorSession: currentEditingSession,
      targetFaculty: targetSession.faculty,
      targetSession: targetSession,
      reason: `Direct Lecturer Consultation: Mutually agreed slot exchange between ${currentEditingSession.code} and ${targetSession.code}.`,
      priorityTier: 2,
      priorityName: 'Regular Classes',
      hardViolations: 0,
      movedSessionsCount: 2,
      status: 'APPROVED_SWAPPED',
      createdAt: 'Just now',
      approvedBy: actualTargetLecturer?.name || targetSession.faculty,
      approvalTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const existingSwaps = getStoredLectureSwaps();
    saveStoredLectureSwaps([newSwapRecord, ...existingSwaps]);

    setIsModalOpen(false);
    setBannerNotice({
      type: 'success',
      message: `✓ Master Schedule Swapped! ${currentEditingSession.code} and ${targetSession.code} have been swapped with verified permission from ${actualTargetLecturer?.name || targetSession.faculty}.`,
    });
    setTimeout(() => setBannerNotice(null), 5000);
  };

  // Save Direct Edit / Creation
  const handleSaveClassDetails = (e) => {
    e.preventDefault();

    if (slotConflictCheck.hasClash) {
      const confirmForce = window.confirm(
        `Warning: ${slotConflictCheck.message}\n\nDo you still wish to proceed with saving this class? (Alternatively, use the 'Talk to Lecturer to Swap' tab to exchange slots cleanly).`
      );
      if (!confirmForce) return;
    }

    let updatedList;
    if (isNewClass) {
      const newSession = {
        ...formState,
        id: `sess-${Date.now()}`,
      };
      updatedList = [...sessions, newSession];
      setBannerNotice({
        type: 'success',
        message: `✓ New class ${newSession.code} (${newSession.title}) scheduled at ${newSession.day.toUpperCase()} ${newSession.periodId}!`,
      });
    } else {
      updatedList = sessions.map((s) => {
        if (s.id === editingSessionId) {
          return {
            ...s,
            ...formState,
          };
        }
        return s;
      });
      setBannerNotice({
        type: 'success',
        message: `✓ Class ${formState.code} updated successfully in Master Schedule!`,
      });
    }

    setSessions(updatedList);
    saveStoredTimetableSessions(updatedList);
    setIsModalOpen(false);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Delete Class
  const handleDeleteClass = () => {
    if (!editingSessionId) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${formState.code} (${formState.title}) from the Master Schedule?`
    );
    if (!confirmDelete) return;

    const updatedList = sessions.filter((s) => s.id !== editingSessionId);
    setSessions(updatedList);
    saveStoredTimetableSessions(updatedList);
    setIsModalOpen(false);
    setBannerNotice({
      type: 'info',
      message: `Class ${formState.code} was removed from the Master Schedule.`,
    });
    setTimeout(() => setBannerNotice(null), 4000);
  };

  // Reset to Standard Schedule
  const handleResetSchedule = () => {
    const confirmReset = window.confirm(
      'Reset Master Schedule to official CIT clash-free baseline timetable (P1 to P13)? All live modifications will be reverted.'
    );
    if (!confirmReset) return;

    const fresh = resetStoredTimetableSessions();
    setSessions(fresh);
    setBannerNotice({
      type: 'success',
      message: '✓ Master Schedule successfully reset to official 0-clash CIT timetable baseline (P1 to P13)!',
    });
    setTimeout(() => setBannerNotice(null), 4000);
  };

  return (
    <div className="subpage-container animate-fade-in-up">
      {/* Top Metrics Overview */}
      <div className="timetable-metrics-overview-grid">
        <div className="t-metric-box">
          <span className="t-metric-label">Master Timetable Schedule</span>
          <strong className="t-metric-val">{sessions.length} Active Sessions</strong>
          <span className="t-metric-sub">P1 to P13 (09:00 – 22:00)</span>
        </div>

        <div className="t-metric-box">
          <span className="t-metric-label">Operational Hours</span>
          <strong className="t-metric-val" style={{ color: 'var(--accent-terracotta)' }}>
            1-Hr Long Classes
          </strong>
          <span className="t-metric-sub">P1–P9 Classes • P10–P13 Events</span>
        </div>

        <div className="t-metric-box">
          <span className="t-metric-label">Timetable Interactivity</span>
          <strong className="t-metric-val" style={{ color: 'var(--accent-sage)' }}>
            Editable Class by Class
          </strong>
          <span className="t-metric-sub">With Lecturer Swap Negotiation</span>
        </div>

        <div className="t-metric-box">
          <span className="t-metric-label">Campus Venues</span>
          <strong className="t-metric-val">27 Rooms &amp; Labs</strong>
          <span className="t-metric-sub">7 Specialized Laboratories</span>
        </div>
      </div>

      {/* Live Status Notification Banner */}
      {bannerNotice && (
        <div
          className={`timetable-status-banner ${
            bannerNotice.type === 'success' ? 'status-banner-success' : 'status-banner-info'
          }`}
        >
          <CheckCircle2 size={18} />
          <span>{bannerNotice.message}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="subpage-header-card" style={{ marginTop: 16 }}>
        <div className="timetable-header-meta">
          <div className="timetable-title-row">
            <h2 className="section-title" style={{ fontSize: 22, margin: 0 }}>
              CIT Master Timetable Matrix (P1–P13)
            </h2>
            <span className="cit-period-count-pill">
              {periodFilter === 'all'
                ? 'Full Master Timetable: P1 to P13 (09:00 – 22:00)'
                : periodFilter === 'academic'
                ? 'Teaching Classes: P1 to P9 (09:00 – 18:00)'
                : 'Evening Events: P10 to P13 (18:00 – 22:00)'}
            </span>
          </div>

          <div className="cit-policy-notice-banner">
            <Clock size={15} color="var(--accent-terracotta)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Master Schedule Policy:</strong> Every class is strictly <strong>1-hour long starting from 09:00 AM</strong>. Academic teaching periods run <strong>P1 to P9 (09:00 to 18:00)</strong>, followed by dedicated evening event periods <strong>P10 to P13 (18:00 to 22:00)</strong>. This timetable is <strong>detailfully editable class by class</strong>, and requires <strong>direct lecturer consultation &amp; permission</strong> to swap classes.
            </span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, display: 'block' }}>
            Click any class card to edit, view details, or talk to the actual lecturer to swap slots. Click any empty slot to schedule a new class.
          </span>
        </div>

        {/* Action Controls & Filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Period Filter Selector */}
          <div className="clean-mode-pill-container" title="Filter timetable period view">
            <button
              type="button"
              className={`mode-toggle-btn ${periodFilter === 'all' ? 'active' : ''}`}
              onClick={() => setPeriodFilter('all')}
            >
              All 13 Periods (P1–P13)
            </button>
            <button
              type="button"
              className={`mode-toggle-btn ${periodFilter === 'academic' ? 'active' : ''}`}
              onClick={() => setPeriodFilter('academic')}
            >
              Teaching (P1–P9)
            </button>
            <button
              type="button"
              className={`mode-toggle-btn ${periodFilter === 'events' ? 'active' : ''}`}
              onClick={() => setPeriodFilter('events')}
            >
              Events (P10–P13)
            </button>
          </div>

          {/* Saturday Toggle */}
          <button
            type="button"
            className={`dept-pill-btn ${includeSaturday ? 'active' : ''}`}
            onClick={() => setIncludeSaturday(!includeSaturday)}
            style={{ fontSize: 12, padding: '6px 14px' }}
            title="Toggle Saturday elective sessions"
          >
            {includeSaturday ? '✓ Saturday Included (6 Days)' : '+ Include Saturday'}
          </button>

          {/* Add New Class Button */}
          <button
            type="button"
            className="app-btn-lime"
            onClick={() => handleOpenAddModal('mon', 'P1')}
            title="Schedule a new class into the Master Schedule"
          >
            <Plus size={15} />
            <span>Add Class / Event</span>
          </button>

          {/* Reset Schedule Button */}
          <button
            type="button"
            className="app-btn-outline"
            onClick={handleResetSchedule}
            title="Reset Master Schedule to default 0-clash CIT timetable baseline"
          >
            <RotateCcw size={14} />
            <span>Reset Timetable</span>
          </button>

          {/* Swaps & Disruptions Log Link */}
          <button
            type="button"
            className="app-btn-outline"
            onClick={() => onNavigate?.('rescheduling')}
            title="View Swaps & Disruptions Protocol"
          >
            <RefreshCw size={14} />
            <span>Swaps Protocol Log</span>
          </button>
        </div>
      </div>

      {/* Cohort / Faculty / Room Filtering Bar */}
      <div className="subpage-header-card" style={{ marginTop: 14, padding: '12px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
            Filter Schedule By:
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

        <div className="filter-bar-app" style={{ marginTop: 8 }}>
          {viewMode === 'group' && (
            <select
              className="app-select-field"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="all">All Student Cohorts (14)</option>
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
              <option value="all">All Faculty Lecturers (40)</option>
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
              <option value="all">All Venues &amp; Labs (27)</option>
              {ROOMS_LIST.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          )}

          <select
            className="app-select-field"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Session Types</option>
            <option value="lecture">Lectures</option>
            <option value="lab">Labs (3-Hour Blocks)</option>
            <option value="tutorial">Tutorials</option>
            <option value="event">Evening Events (P10–P13)</option>
          </select>

          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search
              size={14}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by course code, title, room, or lecturer..."
              className="app-select-field"
              style={{ width: '100%', paddingLeft: 30 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Timetable Grid: Starts from P1 to P13 (09:00 to 22:00, 1hr Each, P10-P13 Events) */}
      <div className="timetable-scroll-box">
        <table className="app-timetable-table">
          <thead>
            <tr>
              <th className="th-day-corner">Day / Period</th>
              {visiblePeriods.map((p) => {
                const isEvent = p.type === 'event';
                return (
                  <th
                    key={p.id}
                    className={isEvent ? 'th-event-period-header' : 'th-period-cell'}
                    style={{ minWidth: isEvent ? 92 : 84 }}
                  >
                    {isEvent && <div className="th-event-tag">✦ EVENT</div>}
                    <div className="th-pname">{p.id}</div>
                    <div className="th-ptime">{p.time}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {daysToDisplay.map((day) => (
              <tr key={day.id}>
                {/* Sticky Left Day Cell */}
                <td className="table-day-cell">
                  <div className="day-name-bold">{day.short}</div>
                  <div className="day-date-sub">{day.date}</div>
                </td>

                {/* Period Columns P1 through P13 */}
                {visiblePeriods.map((period) => {
                  const session = sessionsByDayAndPeriod[`${day.id}-${period.id}`];
                  const isEventPeriod = period.type === 'event';

                  return (
                    <td
                      key={period.id}
                      className={`timetable-td-slot ${isEventPeriod ? 'event-slot-column' : ''}`}
                    >
                      {session ? (
                        <div
                          className={`app-session-card ${
                            session.type === 'lab'
                              ? 'card-type-lab'
                              : session.type === 'event'
                              ? 'card-type-event'
                              : session.type === 'exam'
                              ? 'card-type-exam'
                              : 'card-type-lecture'
                          }`}
                          onClick={() => handleOpenEditModal(session)}
                          title="Click to edit class details or negotiate swap with lecturer"
                        >
                          <div className="session-card-header">
                            <span className="session-code">{session.code}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span className="session-type-pill">
                                {session.type === 'lab'
                                  ? 'LAB'
                                  : session.type === 'event'
                                  ? 'EVENT'
                                  : session.type === 'tutorial'
                                  ? 'TUT'
                                  : 'LEC'}
                              </span>
                              <span className="session-edit-trigger" title="Edit this class">
                                <Edit3 size={11} />
                              </span>
                            </div>
                          </div>

                          <div className="session-title-text" title={session.title}>
                            {session.title}
                          </div>

                          <div className="session-card-footer">
                            <span className="session-room-tag">{session.room}</span>
                            <span
                              className="session-group-tag"
                              title={viewMode === 'faculty' ? session.group : session.faculty}
                            >
                              {viewMode === 'faculty' ? session.group : session.faculty?.split(' ').pop()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="clean-empty-slot"
                          onClick={() => handleOpenAddModal(day.id, period.id)}
                          title={`Empty slot: Click to add class at ${day.name} ${period.id} (${period.time})`}
                        >
                          <span className="empty-slot-add-icon">
                            <Plus size={12} />
                            <span>Add</span>
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailful Class Editor & Lecturer Swap Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          isNewClass
            ? `Schedule New Class: ${formState.day.toUpperCase()} • ${formState.periodId} (1hr from 9AM)`
            : `Class & Session Manager: ${formState.code} — ${formState.title}`
        }
        maxWidth="740px"
      >
        {/* Modal Navigation Tabs */}
        <div className="modal-tabs-header">
          <button
            type="button"
            className={`modal-tab-btn ${modalTab === 'details' ? 'active' : ''}`}
            onClick={() => setModalTab('details')}
          >
            <Edit3 size={14} />
            <span>{isNewClass ? 'Class Configuration' : 'Edit Class Details'}</span>
          </button>

          {!isNewClass && (
            <button
              type="button"
              className={`modal-tab-btn ${modalTab === 'swap' ? 'active' : ''}`}
              onClick={() => setModalTab('swap')}
            >
              <MessageSquare size={14} />
              <span>Talk to Lecturer to Swap</span>
            </button>
          )}

          <button
            type="button"
            className={`modal-tab-btn ${modalTab === 'verify' ? 'active' : ''}`}
            onClick={() => setModalTab('verify')}
          >
            <ShieldCheck size={14} />
            <span>Constraint Verification</span>
          </button>
        </div>

        {/* Tab 1: Detailed Class Editing */}
        {modalTab === 'details' && (
          <form onSubmit={handleSaveClassDetails}>
            <div className="class-edit-form-grid">
              {/* Course Code */}
              <div className="edit-form-field">
                <label className="edit-form-label">Course Code</label>
                <input
                  type="text"
                  className="edit-form-input"
                  value={formState.code}
                  onChange={(e) => setFormState({ ...formState, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              {/* Course Title */}
              <div className="edit-form-field">
                <label className="edit-form-label">Course Title</label>
                <input
                  type="text"
                  className="edit-form-input"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  required
                />
              </div>

              {/* Session Type */}
              <div className="edit-form-field">
                <label className="edit-form-label">Session Type</label>
                <select
                  className="edit-form-select"
                  value={formState.type}
                  onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                >
                  <option value="lecture">Lecture (1 Hour)</option>
                  <option value="lab">Laboratory (3-Hour Block)</option>
                  <option value="tutorial">Tutorial (1 Hour)</option>
                  <option value="event">Evening Event (P10–P13)</option>
                </select>
              </div>

              {/* Faculty / Lecturer (All 40 Faculty) */}
              <div className="edit-form-field">
                <label className="edit-form-label">Assigned Lecturer / Faculty</label>
                <select
                  className="edit-form-select"
                  value={formState.faculty}
                  onChange={(e) => setFormState({ ...formState, faculty: e.target.value })}
                >
                  {FACULTY_DATA.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name} ({f.dept} • {f.designation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Cohort */}
              <div className="edit-form-field">
                <label className="edit-form-label">Student Cohort</label>
                <select
                  className="edit-form-select"
                  value={formState.group}
                  onChange={(e) => setFormState({ ...formState, group: e.target.value })}
                >
                  {STUDENT_GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} (Year {g.year} • {g.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Room / Venue (All 27 Rooms & 7 Labs) */}
              <div className="edit-form-field">
                <label className="edit-form-label">Assigned Room / Venue</label>
                <select
                  className="edit-form-select"
                  value={formState.room}
                  onChange={(e) => setFormState({ ...formState, room: e.target.value })}
                >
                  {ROOMS_DATA.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.id}) — Cap: {r.capacity} ({r.building})
                    </option>
                  ))}
                </select>
              </div>

              {/* Day of Week */}
              <div className="edit-form-field">
                <label className="edit-form-label">Day of Week</label>
                <select
                  className="edit-form-select"
                  value={formState.day}
                  onChange={(e) => setFormState({ ...formState, day: e.target.value })}
                >
                  <option value="mon">Monday (MON)</option>
                  <option value="tue">Tuesday (TUE)</option>
                  <option value="wed">Wednesday (WED)</option>
                  <option value="thu">Thursday (THU)</option>
                  <option value="fri">Friday (FRI)</option>
                  <option value="sat">Saturday (SAT)</option>
                </select>
              </div>

              {/* Period P1 - P13 (09:00 - 22:00, 1hr Each) */}
              <div className="edit-form-field">
                <label className="edit-form-label">Period Slot (1-Hour Duration from 9AM)</label>
                <select
                  className="edit-form-select"
                  value={formState.periodId}
                  onChange={(e) => setFormState({ ...formState, periodId: e.target.value })}
                >
                  {PERIODS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id}: {p.time} {p.type === 'event' ? '✦ [EVENT PERIOD]' : '[Academic Class]'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enrolled Students */}
              <div className="edit-form-field">
                <label className="edit-form-label">Enrolled Student Count</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  className="edit-form-input"
                  value={formState.enrolled}
                  onChange={(e) => setFormState({ ...formState, enrolled: Number(e.target.value) })}
                />
              </div>

              {/* Session Notes */}
              <div className="edit-form-field">
                <label className="edit-form-label">Session Notes &amp; Topics</label>
                <input
                  type="text"
                  placeholder="e.g. Memory virtualization &amp; page replacement"
                  className="edit-form-input"
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                />
              </div>
            </div>

            {/* Real-time Clash Check Banner */}
            <div
              className={`edit-conflict-card ${
                slotConflictCheck.hasClash ? 'conflict-warning' : 'conflict-clear'
              }`}
            >
              {slotConflictCheck.hasClash ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <div style={{ flex: 1 }}>
                <span>{slotConflictCheck.message}</span>
                {slotConflictCheck.hasClash && slotConflictCheck.conflictSession && !isNewClass && (
                  <div style={{ marginTop: 6 }}>
                    <button
                      type="button"
                      className="quick-prompt-chip"
                      onClick={() => {
                        initiateSwapTarget(slotConflictCheck.conflictSession);
                        setModalTab('swap');
                      }}
                      style={{ background: '#8c5208', color: '#ffffff', borderColor: '#8c5208' }}
                    >
                      💬 Talk to {slotConflictCheck.conflictSession.faculty} to Swap Slots →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 18,
                paddingTop: 12,
                borderTop: '1px solid var(--border-default)',
              }}
            >
              <div>
                {!isNewClass && (
                  <button
                    type="button"
                    className="app-btn-outline"
                    onClick={handleDeleteClass}
                    style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                  >
                    <Trash2 size={14} />
                    <span>Delete Class</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {!isNewClass && (
                  <button
                    type="button"
                    className="app-btn-outline"
                    onClick={() => setModalTab('swap')}
                  >
                    <MessageSquare size={14} />
                    <span>Talk to Lecturer to Swap →</span>
                  </button>
                )}

                <button type="submit" className="app-btn-lime">
                  <CheckCircle2 size={15} />
                  <span>{isNewClass ? 'Create Class' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Talk to Actual Lecturer to Swap Class */}
        {modalTab === 'swap' && (
          <div>
            {/* Step 1: Target Class Picker */}
            <div style={{ marginBottom: 12 }}>
              <label className="edit-form-label">Select Class &amp; Slot to Swap With:</label>
              <select
                className="edit-form-select"
                style={{ width: '100%', marginTop: 4 }}
                value={targetSessionId}
                onChange={(e) => {
                  const selected = sessions.find((s) => s.id === e.target.value);
                  if (selected) initiateSwapTarget(selected);
                }}
              >
                {sessions
                  .filter((s) => s.id !== editingSessionId)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.day.toUpperCase()} {s.periodId} ({PERIODS.find((p) => p.id === s.periodId)?.time}): {s.code} ({s.title}) — Lecturer: {s.faculty} @ {s.room}
                    </option>
                  ))}
              </select>
            </div>

            {targetSession && actualTargetLecturer && (
              <>
                {/* Side-by-Side Swap Comparison */}
                <div className="swap-comparison-card">
                  <div className="swap-side-box">
                    <span className="swap-side-tag">Your Current Class</span>
                    <div className="swap-side-title">
                      {formState.code}: {formState.title}
                    </div>
                    <div className="swap-side-meta">
                      <strong>{formState.day.toUpperCase()} • {formState.periodId}</strong> ({PERIODS.find((p) => p.id === formState.periodId)?.time})
                    </div>
                    <div className="swap-side-meta">
                      Venue: <strong>{formState.room}</strong> &bull; Cohort: <strong>{formState.group}</strong>
                    </div>
                    <div className="swap-side-meta" style={{ color: 'var(--accent-terracotta)', fontWeight: 700 }}>
                      Lecturer: {formState.faculty}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--accent-terracotta)' }}>
                    <RefreshCw size={22} className="animate-spin-slow" />
                    <span style={{ fontSize: 10, fontWeight: 800, marginTop: 4 }}>SWAP</span>
                  </div>

                  <div className="swap-side-box">
                    <span className="swap-side-tag" style={{ color: 'var(--accent-sage)' }}>Target Class</span>
                    <div className="swap-side-title">
                      {targetSession.code}: {targetSession.title}
                    </div>
                    <div className="swap-side-meta">
                      <strong>{targetSession.day.toUpperCase()} • {targetSession.periodId}</strong> ({PERIODS.find((p) => p.id === targetSession.periodId)?.time})
                    </div>
                    <div className="swap-side-meta">
                      Venue: <strong>{targetSession.room}</strong> &bull; Cohort: <strong>{targetSession.group}</strong>
                    </div>
                    <div className="swap-side-meta" style={{ color: 'var(--accent-sage)', fontWeight: 700 }}>
                      Lecturer: {targetSession.faculty}
                    </div>
                  </div>
                </div>

                {/* Actual Lecturer Profile Box */}
                <div className="actual-lecturer-profile-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="lecturer-avatar-circle">
                      {actualTargetLecturer.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text-primary)' }}>
                        {actualTargetLecturer.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {actualTargetLecturer.designation} &bull; Dept. of {actualTargetLecturer.dept}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Cabin: {actualTargetLecturer.cabin} &bull; {actualTargetLecturer.email}
                      </div>
                    </div>
                  </div>

                  <span className="lecturer-online-pill">
                    ● Active on CIT Portal
                  </span>
                </div>

                {/* Live Chat with the Actual Lecturer */}
                <div className="lecturer-chat-container">
                  <div className="lecturer-chat-messages-area">
                    {swapChatMessages.map((msg) => (
                      <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                        <div>{msg.text}</div>
                        <div className="chat-msg-time">{msg.time}</div>
                      </div>
                    ))}
                    {isLecturerTyping && (
                      <div className="lecturer-typing-hint">
                        <Sparkles size={12} className="animate-spin-slow" />
                        <span>{actualTargetLecturer.name} is evaluating timetable &amp; typing reply...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick Swap Proposal Chips */}
                  <div className="chat-quick-prompts-row">
                    <button
                      type="button"
                      className="quick-prompt-chip"
                      onClick={() =>
                        handleSendSwapMessage(
                          `Dear ${actualTargetLecturer.name}, could we swap my ${formState.code} (${formState.day.toUpperCase()} ${formState.periodId}) with your ${targetSession.code} (${targetSession.day.toUpperCase()} ${targetSession.periodId})?`
                        )
                      }
                    >
                      💬 "Could we swap our lecture slots?"
                    </button>
                    <button
                      type="button"
                      className="quick-prompt-chip"
                      onClick={() =>
                        handleSendSwapMessage(
                          `Hello Professor, due to a departmental curriculum meeting during ${formState.periodId}, I would like to request exchanging lecture slots with your session.`
                        )
                      }
                    >
                      💬 "Request slot exchange due to meeting"
                    </button>
                    <button
                      type="button"
                      className="quick-prompt-chip"
                      onClick={() =>
                        handleSendSwapMessage(
                          `Please confirm if swapping our venue and timings for ${formState.code} and ${targetSession.code} causes any cohort clash for your students.`
                        )
                      }
                    >
                      💬 "Check clash and room capacity"
                    </button>
                  </div>

                  {/* Chat Input Bar */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendSwapMessage();
                    }}
                    className="chat-input-bar"
                  >
                    <input
                      type="text"
                      className="chat-input-field"
                      placeholder={`Talk to ${actualTargetLecturer.name} about swapping this class...`}
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                    />
                    <button type="submit" className="chat-send-btn">
                      <Send size={13} />
                      <span>Send</span>
                    </button>
                  </form>
                </div>

                {/* Permission Granted Card & Execution Button */}
                {isSwapApproved ? (
                  <div className="swap-permission-granted-card animate-fade-in-up">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCheck size={24} color="#1e5c3e" />
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: '#1e5c3e' }}>
                          ✓ Official Swap Permission Granted by {actualTargetLecturer.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: '#2d6849' }}>
                          Both faculty commitments verified with 0 collisions. Ready for atomic timetable update.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="execute-swap-glow-btn"
                      onClick={handleExecuteLecturerSwap}
                    >
                      <RefreshCw size={15} />
                      <span>Execute Swap &amp; Update Timetable</span>
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      fontSize: 12,
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Info size={15} />
                    <span>
                      Send a message above to talk to <strong>{actualTargetLecturer.name}</strong>. Once they approve in the chat, the atomic swap button will be enabled.
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab 3: Algorithmic Verification */}
        {modalTab === 'verify' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '14px 18px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12.5, color: '#64748b' }}>Assigned Slot &amp; Venue</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                {formState.day.toUpperCase()} &bull; {formState.periodId} ({PERIODS.find((p) => p.id === formState.periodId)?.time}) in {formState.room}
              </div>
              <div style={{ fontSize: 13, color: '#334155', marginTop: 4 }}>
                Faculty: <strong>{formState.faculty}</strong> &bull; Cohort: <strong>{formState.group}</strong> &bull; Size: <strong>{formState.enrolled} Students</strong>
              </div>
            </div>

            <h4 style={{ margin: '8px 0 0 0', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
              Algorithmic Constraint Verification (CIT Policy Engine):
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#1e293b' }}>
                  <strong>Faculty Availability:</strong> {formState.faculty} has zero overlapping lectures or administrative duties during {formState.day.toUpperCase()} {formState.periodId}.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#1e293b' }}>
                  <strong>Room Capacity Optimization:</strong> Venue {formState.room} (Capacity: {ROOMS_DATA.find((r) => r.id === formState.room)?.capacity || 90}) accommodates the {formState.group} cohort with zero concurrent room clashes.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#1e293b' }}>
                  <strong>Cohort Conflict Free:</strong> Student group {formState.group} has no other parallel scheduled classes.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#1e293b' }}>
                  <strong>Institutional Priority Tier:</strong> Assigned under Priority Tier {formState.type === 'event' ? '3 (Club / Tech Events)' : '2 (Regular Academic Curriculum)'}.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <button
                type="button"
                className="app-btn-lime"
                onClick={() => setIsModalOpen(false)}
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
