import React, { useState, useMemo } from 'react';
import {
  Building2,
  Calendar,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  MapPin,
  Users,
  Sparkles,
  MessageSquare,
  Edit3,
  Send,
  AlertTriangle,
  LayoutGrid,
  Table as TableIcon,
  Layers,
  ChevronRight,
  ChevronLeft,
  Info,
  Check,
  DoorOpen,
  Filter,
  Eye,
  X,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { useDisclosure } from '../hooks/useDisclosure';
import {
  ROOMS_DATA,
  PERIODS,
  WEEKDAYS,
  FACULTY_DATA,
  getStoredTimetableSessions,
  saveStoredTimetableSessions,
} from '../services/mockData';
import './VenueBookingsPage.css';

export function VenueBookingsPage() {
  // Stored Timetable Sessions (Persisted in localStorage)
  const [sessions, setSessions] = useState(() => getStoredTimetableSessions());

  // Active Navigation & Filter States
  const [selectedDay, setSelectedDay] = useState('mon');
  const [selectedPeriod, setSelectedPeriod] = useState('P1');
  const [viewMode, setViewMode] = useState('compact'); // 'compact' (fit screen), 'detailed', 'matrix'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'lab', 'lh', 'cr', 'special', 'occupied', 'vacant'
  const [search, setSearch] = useState('');

  // Modals
  const reserveModal = useDisclosure(false);
  const roomScheduleModal = useDisclosure(false);
  const [activeModalRoom, setActiveModalRoom] = useState(null);

  // Manual Reservation Form State
  const [bookingVenueId, setBookingVenueId] = useState(ROOMS_DATA[0].id);
  const [bookingDay, setBookingDay] = useState('mon');
  const [bookingPeriodId, setBookingPeriodId] = useState('P1');
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [bookingFaculty, setBookingFaculty] = useState(FACULTY_DATA[0]?.name || 'Dr. A. Sharma');
  const [bookingGroup, setBookingGroup] = useState('CSE-3');
  const [bookingError, setBookingError] = useState(null);
  const [successBanner, setSuccessBanner] = useState(null);

  // AI Assistant (Feature 3) Collapsible State
  const [nlpOpen, setNlpOpen] = useState(false);
  const [nlpInput, setNlpInput] = useState('');
  const [parsedBooking, setParsedBooking] = useState(null);

  const sampleNlpPrompts = [
    'Bhai Monday ko P3 me Seminar Hall A chahiye for guest lecture',
    'Need LH-101 on Wednesday period 4 for CS301 extra lecture',
    'Friday evening P10 Central Auditorium book karna hai for dance practice',
    'LH-201 chahiye Thursday P2 for mock test',
    'Lab-2 chahiye Monday P4 for Web Architecture tutorial',
  ];

  // Current active period object
  const currentPeriodObj = useMemo(() => {
    return PERIODS.find((p) => p.id === selectedPeriod) || PERIODS[0];
  }, [selectedPeriod]);

  // Current active day object
  const currentDayObj = useMemo(() => {
    return WEEKDAYS.find((w) => w.id === selectedDay) || WEEKDAYS[0];
  }, [selectedDay]);

  // Compute live occupancy lookup for (selectedDay, selectedPeriod)
  const occupancyMap = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      if (s.day === selectedDay && s.periodId === selectedPeriod) {
        const key = (s.room || '').trim().toLowerCase();
        map[key] = s;
      }
    });
    return map;
  }, [sessions, selectedDay, selectedPeriod]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let occupied = 0;
    let vacant = 0;
    let labsActive = 0;
    let hallsActive = 0;
    let specialActive = 0;

    ROOMS_DATA.forEach((r) => {
      const isOcc = Boolean(occupancyMap[r.id.toLowerCase()]);
      if (isOcc) {
        occupied++;
        if (r.type === 'Lab') labsActive++;
        else if (r.type === 'Lecture Hall' || r.type === 'Classroom') hallsActive++;
        else specialActive++;
      } else {
        vacant++;
      }
    });

    return {
      total: ROOMS_DATA.length,
      occupied,
      vacant,
      labsActive,
      hallsActive,
      specialActive,
    };
  }, [occupancyMap]);

  // Filtered Venues based on search and typeFilter
  const filteredVenues = useMemo(() => {
    return ROOMS_DATA.filter((v) => {
      const activeSession = occupancyMap[v.id.toLowerCase()];
      const isOccupied = Boolean(activeSession);

      // Status/Type filter
      if (typeFilter === 'occupied' && !isOccupied) return false;
      if (typeFilter === 'vacant' && isOccupied) return false;
      if (typeFilter === 'lab' && v.type !== 'Lab') return false;
      if (typeFilter === 'lh' && v.type !== 'Lecture Hall') return false;
      if (typeFilter === 'cr' && v.type !== 'Classroom') return false;
      if (typeFilter === 'special' && !['Auditorium', 'Seminar Hall', 'Open-Air Theatre'].includes(v.type)) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesRoom =
          v.id.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q) ||
          v.building.toLowerCase().includes(q);
        const matchesSession =
          activeSession &&
          (activeSession.code.toLowerCase().includes(q) ||
            activeSession.title.toLowerCase().includes(q) ||
            activeSession.faculty.toLowerCase().includes(q) ||
            activeSession.group.toLowerCase().includes(q));
        if (!matchesRoom && !matchesSession) return false;
      }

      return true;
    });
  }, [typeFilter, search, occupancyMap]);

  // Handle Quick Book on a vacant card
  const handleQuickBook = (venue) => {
    setBookingVenueId(venue.id);
    setBookingDay(selectedDay);
    setBookingPeriodId(selectedPeriod);
    setBookingPurpose('');
    setBookingError(null);
    reserveModal.open();
  };

  // Open full room schedule modal
  const handleOpenRoomSchedule = (venue) => {
    setActiveModalRoom(venue);
    roomScheduleModal.open();
  };

  // Submit Manual Reservation
  const handleManualBookingSubmit = (e) => {
    e.preventDefault();
    setBookingError(null);

    // Collision check: Is room already taken at bookingDay + bookingPeriodId?
    const clash = sessions.find(
      (s) =>
        s.day === bookingDay &&
        s.periodId === bookingPeriodId &&
        s.room?.toLowerCase() === bookingVenueId.toLowerCase()
    );

    if (clash) {
      setBookingError(
        `Clash Detected: ${bookingVenueId} is already occupied on ${bookingDay.toUpperCase()} ${bookingPeriodId} by "${clash.code} - ${clash.title}" (${clash.faculty}).`
      );
      return;
    }

    const venueObj = ROOMS_DATA.find((r) => r.id === bookingVenueId);
    const periodObj = PERIODS.find((p) => p.id === bookingPeriodId);

    const newSession = {
      id: `book-${Date.now()}`,
      day: bookingDay,
      periodId: bookingPeriodId,
      code: 'RES-' + bookingVenueId,
      title: bookingPurpose || 'Reserved Campus Facility',
      type: periodObj?.type === 'event' ? 'event' : 'lecture',
      group: bookingGroup || 'General',
      faculty: bookingFaculty,
      room: bookingVenueId,
      capacity: venueObj?.capacity || 60,
      enrolled: Math.min(venueObj?.capacity || 60, 45),
      notes: `Booked via CIT Venue Management Portal. Purpose: ${bookingPurpose}`,
    };

    const updated = [...sessions, newSession];
    setSessions(updated);
    saveStoredTimetableSessions(updated);

    reserveModal.close();
    setSuccessBanner(
      `✓ Confirmed Reservation: ${venueObj?.name} (${bookingVenueId}) booked for ${bookingDay.toUpperCase()} ${bookingPeriodId} (${bookingPurpose})!`
    );
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // Natural Language & Hinglish AI Parser
  const handleParseNlp = (textToParse = nlpInput) => {
    const text = (textToParse || '').trim();
    if (!text) return;
    const lower = text.toLowerCase();

    // 1. Day
    let day = 'mon';
    let dayName = 'Monday';
    if (lower.includes('tue') || lower.includes('mangal')) {
      day = 'tue';
      dayName = 'Tuesday';
    } else if (lower.includes('wed') || lower.includes('budh')) {
      day = 'wed';
      dayName = 'Wednesday';
    } else if (lower.includes('thu') || lower.includes('guru') || lower.includes('vehaspat')) {
      day = 'thu';
      dayName = 'Thursday';
    } else if (lower.includes('fri') || lower.includes('shukra')) {
      day = 'fri';
      dayName = 'Friday';
    } else if (lower.includes('sat') || lower.includes('shani')) {
      day = 'sat';
      dayName = 'Saturday';
    }

    // 2. Period
    let periodId = 'P3';
    const periodMatch = lower.match(/p(\d{1,2})|period\s*(\d{1,2})/i);
    if (periodMatch) {
      const num = periodMatch[1] || periodMatch[2];
      periodId = `P${num}`;
    }

    // 3. Venue
    let venueId = 'Sem-A';
    if (lower.includes('101')) venueId = 'LH-101';
    else if (lower.includes('102')) venueId = 'LH-102';
    else if (lower.includes('103')) venueId = 'LH-103';
    else if (lower.includes('201')) venueId = 'LH-201';
    else if (lower.includes('202')) venueId = 'LH-202';
    else if (lower.includes('aud') || lower.includes('auditorium')) venueId = 'Aud-1';
    else if (lower.includes('seminar hall b') || lower.includes('sem-b')) venueId = 'Sem-B';
    else if (lower.includes('seminar') || lower.includes('sem-a')) venueId = 'Sem-A';
    else if (lower.includes('oat') || lower.includes('theatre') || lower.includes('open-air')) venueId = 'OAT';
    else if (lower.includes('lab-1') || lower.includes('lab 1')) venueId = 'Lab-1';
    else if (lower.includes('lab-2') || lower.includes('lab 2')) venueId = 'Lab-2';
    else if (lower.includes('lab-3') || lower.includes('lab 3')) venueId = 'Lab-3';
    else if (lower.includes('lab-4') || lower.includes('lab 4')) venueId = 'Lab-4';
    else if (lower.includes('lab-5') || lower.includes('lab 5')) venueId = 'Lab-5';
    else if (lower.includes('lab-6') || lower.includes('lab 6')) venueId = 'Lab-6';
    else if (lower.includes('lab-7') || lower.includes('lab 7')) venueId = 'Lab-7';

    // 4. Purpose
    let purpose = 'Academic Event / Session';
    if (lower.includes('guest lecture')) purpose = 'Distinguished Guest Lecture';
    else if (lower.includes('dance') || lower.includes('rehearsal')) purpose = 'Spectra Cultural Dance Rehearsal';
    else if (lower.includes('mock') || lower.includes('test') || lower.includes('exam')) purpose = 'Departmental Mock Test';
    else if (lower.includes('extra') || lower.includes('lecture')) purpose = 'Extra Remedial Lecture Series';
    else if (lower.includes('hackathon')) purpose = 'Coding Society Hackathon Sprint';

    const matchedVenue = ROOMS_DATA.find((r) => r.id === venueId) || ROOMS_DATA[0];

    // Check clash
    const clash = sessions.find(
      (s) => s.day === day && s.periodId === periodId && s.room?.toLowerCase() === matchedVenue.id.toLowerCase()
    );

    setParsedBooking({
      day,
      dayName,
      periodId,
      venueId: matchedVenue.id,
      venueName: matchedVenue.name,
      capacity: matchedVenue.capacity,
      purpose,
      requesterName: 'Dr. A. Sharma',
      clashWith: clash ? `${clash.code}: ${clash.title} (${clash.faculty})` : null,
      rawPrompt: text,
    });
  };

  const handleNlpBookingSubmit = (e) => {
    e.preventDefault();
    if (parsedBooking?.clashWith) {
      alert(`Cannot book: Room is already occupied by ${parsedBooking.clashWith}`);
      return;
    }

    const newSession = {
      id: `ai-book-${Date.now()}`,
      day: parsedBooking.day,
      periodId: parsedBooking.periodId,
      code: 'NLP-' + parsedBooking.venueId,
      title: parsedBooking.purpose,
      type: ['P10', 'P11', 'P12', 'P13'].includes(parsedBooking.periodId) ? 'event' : 'lecture',
      group: 'General',
      faculty: parsedBooking.requesterName,
      room: parsedBooking.venueId,
      capacity: parsedBooking.capacity,
      enrolled: Math.min(parsedBooking.capacity, 50),
      notes: `Booked via Natural Language AI Assistant: "${parsedBooking.rawPrompt}"`,
    };

    const updated = [...sessions, newSession];
    setSessions(updated);
    saveStoredTimetableSessions(updated);

    setSuccessBanner(
      `✓ Confirmed via AI Assistant: ${parsedBooking.venueName} (${parsedBooking.venueId}) on ${parsedBooking.dayName} ${parsedBooking.periodId} for "${parsedBooking.purpose}".`
    );
    setParsedBooking(null);
    setNlpInput('');
    setNlpOpen(false);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <div className="venue-page-container animate-fade-in-up">
      {/* 1. Header Card */}
      <div className="venue-header-card">
        <div className="venue-header-left">
          <div className="venue-header-title-row">
            <h2 className="venue-header-title">
              <Building2 size={22} color="#0284c7" />
              <span>CIT Campus Venues &amp; Room Allocation Board</span>
            </h2>
            <span className="venue-count-badge">
              27 Campus Facilities &bull; 7 Labs &bull; 15 Lecture Halls &bull; 5 Arenas
            </span>
          </div>
          <p className="venue-header-subtitle">
            Live occupancy view displaying which class or event is actively in session in each specific room across periods P1 to P13.
          </p>
        </div>

        <div className="venue-header-actions">
          <button
            type="button"
            className="app-btn-outline"
            style={{ fontSize: 12, padding: '7px 12px' }}
            onClick={() => setNlpOpen(!nlpOpen)}
          >
            <Sparkles size={14} color="#ea580c" />
            <span>{nlpOpen ? 'Hide AI Assistant' : 'AI Hinglish Booking'}</span>
          </button>

          <button
            type="button"
            className="app-btn-lime"
            style={{ fontSize: 12, padding: '7px 14px' }}
            onClick={() => {
              setBookingVenueId(ROOMS_DATA[0].id);
              setBookingDay(selectedDay);
              setBookingPeriodId(selectedPeriod);
              setBookingPurpose('');
              setBookingError(null);
              reserveModal.open();
            }}
          >
            <Plus size={15} />
            <span>Manual Reservation</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 12,
            backgroundColor: '#dcfce7',
            color: '#15803d',
            border: '1.5px solid #86efac',
            fontWeight: 700,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* 2. Feature 3: Plain English & Hinglish Assistant (Collapsible) */}
      {nlpOpen && (
        <div
          className="white-app-card animate-fade-in-up"
          style={{ border: '1.5px solid #ea580c', background: '#fffaf5', gap: 12 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} color="#ea580c" />
              <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: '#9a3412' }}>
                Feature 3: Natural Language &amp; Hinglish Venue Booking Assistant
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setNlpOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a3412' }}
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: 12.5, color: '#7c2d12', margin: 0 }}>
            Type your venue request in plain English or natural Hinglish. The AI parser extracts the room, day, period, and purpose, performs real-time collision verification, and books it seamlessly!
          </p>

          {/* Sample Prompts */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', alignSelf: 'center' }}>
              Quick Prompts:
            </span>
            {sampleNlpPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                className="prompt-chip-btn"
                style={{ fontSize: 11, padding: '3px 8px' }}
                onClick={() => {
                  setNlpInput(prompt);
                  handleParseNlp(prompt);
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* NLP Input Bar */}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              className="app-input-field"
              placeholder="e.g. Bhai Monday ko P3 me Seminar Hall A chahiye for guest lecture"
              value={nlpInput}
              onChange={(e) => setNlpInput(e.target.value)}
              style={{ flex: 1, borderRadius: 9999, fontSize: 13 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleParseNlp();
                }
              }}
            />
            <button
              type="button"
              className="app-btn-lime"
              style={{ background: '#ea580c', color: '#ffffff' }}
              onClick={() => handleParseNlp()}
              disabled={!nlpInput.trim()}
            >
              <Send size={14} />
              <span>Parse &amp; Verify</span>
            </button>
          </div>

          {/* Parsed Card Review */}
          {parsedBooking && (
            <div
              style={{
                marginTop: 10,
                padding: 14,
                background: '#ffffff',
                border: '1.5px solid #fed7aa',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Edit3 size={15} color="#ea580c" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                    Review Parsed Reservation
                  </span>
                </div>
                {parsedBooking.clashWith ? (
                  <span
                    style={{
                      fontSize: 11,
                      color: '#b91c1c',
                      background: '#fee2e2',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontWeight: 800,
                    }}
                  >
                    ⚠️ Collision Detected
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 11,
                      color: '#15803d',
                      background: '#dcfce7',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontWeight: 800,
                    }}
                  >
                    ✓ Clash-Free Verified
                  </span>
                )}
              </div>

              {parsedBooking.clashWith && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    fontSize: 12,
                    padding: '8px 12px',
                    borderRadius: 8,
                    marginBottom: 10,
                    fontWeight: 600,
                  }}
                >
                  Room {parsedBooking.venueId} is already in use by: {parsedBooking.clashWith}. Please choose a different period or room.
                </div>
              )}

              <form onSubmit={handleNlpBookingSubmit}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Venue</label>
                    <select
                      className="app-select-field"
                      style={{ width: '100%', marginTop: 2, fontSize: 12 }}
                      value={parsedBooking.venueId}
                      onChange={(e) => {
                        const v = ROOMS_DATA.find((r) => r.id === e.target.value);
                        setParsedBooking({
                          ...parsedBooking,
                          venueId: v.id,
                          venueName: v.name,
                          capacity: v.capacity,
                        });
                      }}
                    >
                      {ROOMS_DATA.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.id} - {r.name} (Cap: {r.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Day</label>
                    <select
                      className="app-select-field"
                      style={{ width: '100%', marginTop: 2, fontSize: 12 }}
                      value={parsedBooking.day}
                      onChange={(e) => {
                        const dayObj = WEEKDAYS.find((w) => w.id === e.target.value);
                        setParsedBooking({
                          ...parsedBooking,
                          day: e.target.value,
                          dayName: dayObj?.name || e.target.value,
                        });
                      }}
                    >
                      {WEEKDAYS.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.date})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Period</label>
                    <select
                      className="app-select-field"
                      style={{ width: '100%', marginTop: 2, fontSize: 12 }}
                      value={parsedBooking.periodId}
                      onChange={(e) => setParsedBooking({ ...parsedBooking, periodId: e.target.value })}
                    >
                      {PERIODS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.time}) {p.type === 'event' ? '✦' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Event Purpose</label>
                    <input
                      type="text"
                      required
                      className="app-input-field"
                      style={{ width: '100%', marginTop: 2, fontSize: 12 }}
                      value={parsedBooking.purpose}
                      onChange={(e) => setParsedBooking({ ...parsedBooking, purpose: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button
                    type="button"
                    className="app-btn-outline"
                    style={{ fontSize: 12, padding: '5px 10px' }}
                    onClick={() => setParsedBooking(null)}
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="app-btn-lime"
                    style={{ fontSize: 12, padding: '5px 12px' }}
                    disabled={Boolean(parsedBooking.clashWith)}
                  >
                    Confirm &amp; Insert into Schedule
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 3. Live KPI Summary Bar */}
      <div className="venue-kpi-row">
        <div className="venue-kpi-pill">
          <div className="venue-kpi-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <Building2 size={18} />
          </div>
          <div className="venue-kpi-info">
            <span className="venue-kpi-value">{metrics.total} Venues</span>
            <span className="venue-kpi-label">Total Campus Capacity</span>
          </div>
        </div>

        <div className="venue-kpi-pill">
          <div className="venue-kpi-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <span className="venue-dot pulse-red" style={{ width: 10, height: 10 }} />
          </div>
          <div className="venue-kpi-info">
            <span className="venue-kpi-value" style={{ color: '#dc2626' }}>
              {metrics.occupied} In Session
            </span>
            <span className="venue-kpi-label">Occupied at {selectedPeriod}</span>
          </div>
        </div>

        <div className="venue-kpi-pill">
          <div className="venue-kpi-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <DoorOpen size={18} />
          </div>
          <div className="venue-kpi-info">
            <span className="venue-kpi-value" style={{ color: '#16a34a' }}>
              {metrics.vacant} Vacant
            </span>
            <span className="venue-kpi-label">Ready for Allocation</span>
          </div>
        </div>

        <div className="venue-kpi-pill">
          <div className="venue-kpi-icon-wrap" style={{ background: '#faf5ff', color: '#9333ea' }}>
            <Layers size={18} />
          </div>
          <div className="venue-kpi-info">
            <span className="venue-kpi-value">{metrics.labsActive} / 7 Labs</span>
            <span className="venue-kpi-label">Specialized Practical Labs</span>
          </div>
        </div>

        <div className="venue-kpi-pill">
          <div className="venue-kpi-icon-wrap" style={{ background: '#fff7ed', color: '#ea580c' }}>
            <Users size={18} />
          </div>
          <div className="venue-kpi-info">
            <span className="venue-kpi-value">{metrics.specialActive} / 5 Arenas</span>
            <span className="venue-kpi-label">Auditorium &amp; OAT</span>
          </div>
        </div>
      </div>

      {/* 4. Live Day & Period Control Navigator */}
      <div className="venue-navigator-card">
        <div className="venue-navigator-top">
          {/* Day Selector */}
          <div className="venue-day-pills">
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginRight: 4 }}>Day:</span>
            {WEEKDAYS.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`venue-day-btn ${selectedDay === w.id ? 'active' : ''}`}
                onClick={() => setSelectedDay(w.id)}
              >
                {w.name} ({w.date})
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="venue-view-toggles">
            <button
              type="button"
              className={`venue-view-btn ${viewMode === 'compact' ? 'active' : ''}`}
              onClick={() => setViewMode('compact')}
              title="Compact screen-fit grid layout"
            >
              <LayoutGrid size={13} />
              <span>Fit to Screen</span>
            </button>
            <button
              type="button"
              className={`venue-view-btn ${viewMode === 'detailed' ? 'active' : ''}`}
              onClick={() => setViewMode('detailed')}
              title="Detailed venue cards with equipment and capacity"
            >
              <Layers size={13} />
              <span>Detailed Cards</span>
            </button>
            <button
              type="button"
              className={`venue-view-btn ${viewMode === 'matrix' ? 'active' : ''}`}
              onClick={() => setViewMode('matrix')}
              title="Master Campus Matrix Table across all P1-P13 periods"
            >
              <TableIcon size={13} />
              <span>Campus Matrix</span>
            </button>
          </div>
        </div>

        {/* Period Strip (P1 to P13 timeline) */}
        <div className="venue-timeline-wrapper">
          <div className="venue-timeline-label-row">
            <span>
              Select Period to inspect live room occupancy &bull; Showing:{' '}
              <strong style={{ color: '#0f172a' }}>
                {currentDayObj.name} &bull; {currentPeriodObj.name} ({currentPeriodObj.time})
              </strong>
            </span>
            <span style={{ color: currentPeriodObj.type === 'event' ? '#ea580c' : '#0284c7' }}>
              {currentPeriodObj.type === 'event'
                ? '✦ Dedicated Evening Event Slot (18:00 – 22:00)'
                : '✦ Core Academic Teaching Period (09:00 – 18:00)'}
            </span>
          </div>

          <div className="venue-period-strip">
            {PERIODS.map((p) => {
              const isSelected = selectedPeriod === p.id;
              const isEvent = p.type === 'event';
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`venue-period-btn ${isEvent ? 'is-event' : ''} ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedPeriod(p.id)}
                >
                  <span className="venue-period-id">{p.name}</span>
                  <span className="venue-period-time">{p.time}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Pills and Search */}
        <div className="venue-filter-row">
          <div className="venue-type-pills">
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b' }}>Filter:</span>
            <button
              type="button"
              className={`venue-type-btn ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTypeFilter('all')}
            >
              All 27 Venues
            </button>
            <button
              type="button"
              className={`venue-type-btn ${typeFilter === 'occupied' ? 'active' : ''}`}
              onClick={() => setTypeFilter('occupied')}
            >
              🔴 In Session ({metrics.occupied})
            </button>
            <button
              type="button"
              className={`venue-type-btn ${typeFilter === 'vacant' ? 'active' : ''}`}
              onClick={() => setTypeFilter('vacant')}
            >
              🟢 Vacant ({metrics.vacant})
            </button>
            <button
              type="button"
              className={`venue-type-btn ${typeFilter === 'lab' ? 'active' : ''}`}
              onClick={() => setTypeFilter('lab')}
            >
              7 Specialized Labs
            </button>
            <button
              type="button"
              className={`venue-type-btn ${typeFilter === 'lh' ? 'active' : ''}`}
              onClick={() => setTypeFilter('lh')}
            >
              Lecture Halls (9)
            </button>
            <button
              type="button"
              className={`venue-type-btn ${typeFilter === 'cr' ? 'active' : ''}`}
              onClick={() => setTypeFilter('cr')}
            >
              Classrooms (6)
            </button>
            <button
              type="button"
              className={`venue-type-btn ${typeFilter === 'special' ? 'active' : ''}`}
              onClick={() => setTypeFilter('special')}
            >
              Auditorium &amp; OAT (5)
            </button>
          </div>

          <div style={{ position: 'relative', minWidth: 240 }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              className="app-input-field"
              style={{ paddingLeft: 32, borderRadius: 9999, fontSize: 12, paddingRight: 12 }}
              placeholder="Search room ID, course, faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 5. Main Venues Content */}

      {/* VIEW MODE 1: COMPACT GRID (FIT TO SCREEN MODE) */}
      {viewMode === 'compact' && (
        <div className="venue-compact-grid">
          {filteredVenues.map((venue) => {
            const activeSession = occupancyMap[venue.id.toLowerCase()];
            const isOccupied = Boolean(activeSession);
            const isEventSlot = currentPeriodObj.type === 'event' || activeSession?.type === 'event';

            return (
              <div
                key={venue.id}
                className={`venue-card-compact ${
                  isOccupied ? (isEventSlot ? 'is-event' : 'is-occupied') : 'is-vacant'
                }`}
              >
                {/* Header */}
                <div className="venue-card-top">
                  <span className="venue-id-pill">{venue.id}</span>
                  {isOccupied ? (
                    <span className={`venue-status-badge ${isEventSlot ? 'event' : 'occupied'}`}>
                      <span className={`venue-dot ${isEventSlot ? 'pulse-amber' : 'pulse-red'}`} />
                      {isEventSlot ? 'EVENT IN SESSION' : 'IN SESSION'}
                    </span>
                  ) : (
                    <span className="venue-status-badge vacant">
                      <span className="venue-dot pulse-green" />
                      AVAILABLE
                    </span>
                  )}
                </div>

                {/* Venue Name & Location */}
                <div className="venue-name-row">
                  <h4 className="venue-room-title" title={venue.name}>
                    {venue.name}
                  </h4>
                  <span className="venue-room-loc">
                    {venue.building} &bull; {venue.floor} &bull; Cap: {venue.capacity}
                  </span>
                </div>

                {/* Session Details or Vacant Placeholder */}
                {isOccupied ? (
                  <div className="venue-session-body">
                    <div className="venue-session-code-row">
                      <span className="venue-course-code">{activeSession.code}</span>
                      <span className="venue-type-tag">{activeSession.type}</span>
                    </div>

                    <div className="venue-session-name" title={activeSession.title}>
                      {activeSession.title}
                    </div>

                    <div className="venue-meta-line" title={`Lecturer: ${activeSession.faculty}`}>
                      <span>👤</span>
                      <strong>{activeSession.faculty}</strong>
                    </div>

                    <div className="venue-meta-line">
                      <span>👥</span>
                      <span>
                        {activeSession.group} ({activeSession.enrolled || 60}/{venue.capacity} seats)
                      </span>
                    </div>

                    <div className="venue-meta-line" style={{ color: '#0284c7' }}>
                      <span>🕒</span>
                      <span>
                        {currentPeriodObj.name} ({currentPeriodObj.time})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="venue-vacant-body">
                    <CheckCircle2 size={20} color="#16a34a" />
                    <span className="venue-vacant-text">Room Available</span>
                    <span className="venue-vacant-sub">
                      No session scheduled at {selectedPeriod}
                    </span>
                  </div>
                )}

                {/* Action Footer */}
                <div className="venue-card-footer">
                  {!isOccupied ? (
                    <button
                      type="button"
                      className="venue-action-btn btn-quickbook"
                      onClick={() => handleQuickBook(venue)}
                    >
                      <Plus size={12} />
                      <span>Book Slot</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="venue-action-btn btn-primary"
                      onClick={() => handleOpenRoomSchedule(venue)}
                    >
                      <Eye size={12} />
                      <span>View Live</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="venue-action-btn"
                    onClick={() => handleOpenRoomSchedule(venue)}
                  >
                    <span>Weekly Plan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: DETAILED CARDS VIEW */}
      {viewMode === 'detailed' && (
        <div className="venue-detailed-grid">
          {filteredVenues.map((venue) => {
            const activeSession = occupancyMap[venue.id.toLowerCase()];
            const isOccupied = Boolean(activeSession);
            const isEventSlot = currentPeriodObj.type === 'event' || activeSession?.type === 'event';

            return (
              <div key={venue.id} className="venue-detailed-card animate-card-lift">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="venue-id-pill" style={{ fontSize: 13, padding: '3px 8px' }}>
                        {venue.id}
                      </span>
                      <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#0f172a' }}>
                        {venue.name}
                      </h3>
                    </div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block', marginTop: 4 }}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {venue.building} &bull; {venue.floor}
                    </span>
                  </div>

                  {isOccupied ? (
                    <span className={`venue-status-badge ${isEventSlot ? 'event' : 'occupied'}`}>
                      <span className={`venue-dot ${isEventSlot ? 'pulse-amber' : 'pulse-red'}`} />
                      {isEventSlot ? 'EVENT ACTIVE' : 'IN SESSION'}
                    </span>
                  ) : (
                    <span className="venue-status-badge vacant">
                      <span className="venue-dot pulse-green" />
                      AVAILABLE
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: '#64748b' }}>Venue Category</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{venue.type}</span>
                  <span style={{ color: '#64748b' }}>Capacity</span>
                  <span style={{ fontWeight: 800, color: '#0284c7' }}>{venue.capacity} Persons</span>
                </div>

                {isOccupied ? (
                  <div
                    style={{
                      background: '#fff5f5',
                      border: '1.5px solid #fecaca',
                      borderRadius: 10,
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#dc2626' }}>
                        {activeSession.code} &bull; {activeSession.title}
                      </span>
                      <span className="venue-type-tag">{activeSession.type}</span>
                    </div>

                    <div style={{ fontSize: 12, color: '#334155', display: 'flex', gap: 14 }}>
                      <span>
                        👤 <strong>{activeSession.faculty}</strong>
                      </span>
                      <span>
                        👥 <strong>{activeSession.group}</strong> ({activeSession.enrolled || 60} attending)
                      </span>
                    </div>

                    <div style={{ fontSize: 11.5, color: '#0284c7', fontWeight: 600 }}>
                      🕒 Current Time: {selectedDay.toUpperCase()} &bull; {currentPeriodObj.name} ({currentPeriodObj.time})
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1.5px dashed #86efac',
                      borderRadius: 10,
                      padding: 14,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={24} color="#16a34a" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>
                      Ready for Academic Allocation
                    </span>
                    <span style={{ fontSize: 11.5, color: '#64748b' }}>
                      No clashes detected for {selectedDay.toUpperCase()} {selectedPeriod}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                  {!isOccupied && (
                    <button
                      type="button"
                      className="app-btn-lime"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => handleQuickBook(venue)}
                    >
                      <Plus size={14} />
                      <span>Reserve {venue.id}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="app-btn-outline"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => handleOpenRoomSchedule(venue)}
                  >
                    <span>Weekly Timetable</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 3: CAMPUS MASTER MATRIX (ALL 27 ROOMS X P1-P13) */}
      {viewMode === 'matrix' && (
        <div className="venue-matrix-container">
          <div
            style={{
              padding: '12px 16px',
              background: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TableIcon size={16} />
              <span style={{ fontWeight: 800, fontSize: 13 }}>
                Campus Master Matrix: All 27 Venues across Periods P1 to P13 ({currentDayObj.name})
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              Click any cell to book or inspect period sessions
            </span>
          </div>

          <div className="venue-matrix-scroll">
            <table className="venue-matrix-table">
              <thead>
                <tr>
                  <th className="col-sticky-room">Venue / Room</th>
                  <th style={{ minWidth: 80 }}>Cap</th>
                  {PERIODS.map((p) => (
                    <th key={p.id}>
                      <div>{p.name}</div>
                      <div style={{ fontSize: 9.5, opacity: 0.8 }}>{p.time.split(' ')[0]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredVenues.map((venue) => (
                  <tr key={venue.id}>
                    <td className="col-sticky-room">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="venue-id-pill" style={{ fontSize: 11 }}>
                          {venue.id}
                        </span>
                        <span style={{ fontSize: 11.5, color: '#0f172a' }}>{venue.name}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#64748b' }}>{venue.capacity}</td>

                    {PERIODS.map((p) => {
                      const session = sessions.find(
                        (s) =>
                          s.day === selectedDay &&
                          s.periodId === p.id &&
                          s.room?.toLowerCase() === venue.id.toLowerCase()
                      );
                      const isEventSlot = p.type === 'event' || session?.type === 'event';

                      if (session) {
                        return (
                          <td key={p.id}>
                            <div
                              className={isEventSlot ? 'venue-matrix-cell-event' : 'venue-matrix-cell-occupied'}
                              onClick={() => handleOpenRoomSchedule(venue)}
                              title={`${session.code}: ${session.title}\nFaculty: ${session.faculty}\nCohort: ${session.group}`}
                            >
                              <strong style={{ color: isEventSlot ? '#c2410c' : '#b91c1c' }}>
                                {session.code}
                              </strong>
                              <span
                                style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: 80,
                                }}
                              >
                                {session.faculty.split(' ').pop()}
                              </span>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={p.id}>
                          <div
                            className="venue-matrix-cell-vacant"
                            onClick={() => {
                              setBookingVenueId(venue.id);
                              setBookingDay(selectedDay);
                              setBookingPeriodId(p.id);
                              setBookingPurpose('');
                              setBookingError(null);
                              reserveModal.open();
                            }}
                            title={`Room vacant at ${p.name}. Click to reserve.`}
                          >
                            +
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Manual Reservation Modal */}
      <Modal
        isOpen={reserveModal.isOpen}
        onClose={reserveModal.close}
        title={`Reserve Campus Venue: ${bookingVenueId}`}
      >
        <form onSubmit={handleManualBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {bookingError && (
            <div
              style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                fontSize: 12.5,
                padding: '10px 14px',
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              {bookingError}
            </div>
          )}

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, display: 'block', marginBottom: 4, color: '#475569' }}>
              Target Venue / Room *
            </label>
            <select
              className="app-select-field"
              style={{ width: '100%' }}
              value={bookingVenueId}
              onChange={(e) => setBookingVenueId(e.target.value)}
            >
              {ROOMS_DATA.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} - {v.name} ({v.type}, Cap: {v.capacity})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, display: 'block', marginBottom: 4, color: '#475569' }}>
                Day of Week *
              </label>
              <select
                className="app-select-field"
                style={{ width: '100%' }}
                value={bookingDay}
                onChange={(e) => setBookingDay(e.target.value)}
              >
                {WEEKDAYS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.date})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, display: 'block', marginBottom: 4, color: '#475569' }}>
                Period Slot (P1–P13) *
              </label>
              <select
                className="app-select-field"
                style={{ width: '100%' }}
                value={bookingPeriodId}
                onChange={(e) => setBookingPeriodId(e.target.value)}
              >
                {PERIODS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.time}) {p.type === 'event' ? '✦ EVENT' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, display: 'block', marginBottom: 4, color: '#475569' }}>
              Academic Purpose / Event Title *
            </label>
            <input
              type="text"
              required
              className="app-input-field"
              placeholder="e.g. CS301 Extra Remedial Lecture / Robotics Workshop"
              value={bookingPurpose}
              onChange={(e) => setBookingPurpose(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, display: 'block', marginBottom: 4, color: '#475569' }}>
                Faculty In-Charge *
              </label>
              <select
                className="app-select-field"
                style={{ width: '100%' }}
                value={bookingFaculty}
                onChange={(e) => setBookingFaculty(e.target.value)}
              >
                {FACULTY_DATA.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name} ({f.dept})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, display: 'block', marginBottom: 4, color: '#475569' }}>
                Target Cohort / Group *
              </label>
              <input
                type="text"
                className="app-input-field"
                value={bookingGroup}
                onChange={(e) => setBookingGroup(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" className="app-btn-outline" onClick={reserveModal.close}>
              Cancel
            </button>
            <button type="submit" className="app-btn-lime">
              Verify &amp; Confirm Allocation
            </button>
          </div>
        </form>
      </Modal>

      {/* 7. Room Schedule Modal (Weekly view for a specific room) */}
      <Modal
        isOpen={roomScheduleModal.isOpen}
        onClose={roomScheduleModal.close}
        title={`Full Weekly Schedule: ${activeModalRoom?.name} (${activeModalRoom?.id})`}
      >
        {activeModalRoom && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc',
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: 12.5,
              }}
            >
              <div>
                <strong>Building:</strong> {activeModalRoom.building} &bull; {activeModalRoom.floor}
              </div>
              <div>
                <strong>Capacity:</strong> {activeModalRoom.capacity} seats &bull; <strong>Type:</strong>{' '}
                {activeModalRoom.type}
              </div>
            </div>

            <div style={{ overflowX: 'auto', maxHeight: '60vh' }}>
              <table className="venue-schedule-modal-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Period</th>
                    <th>Time</th>
                    <th>Code &amp; Course Title</th>
                    <th>Faculty In-Charge</th>
                    <th>Cohort</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {WEEKDAYS.map((w) => {
                    const daySessions = sessions.filter(
                      (s) => s.day === w.id && s.room?.toLowerCase() === activeModalRoom.id.toLowerCase()
                    );

                    if (daySessions.length === 0) {
                      return (
                        <tr key={w.id} style={{ background: '#fafafa' }}>
                          <td style={{ fontWeight: 800 }}>{w.name}</td>
                          <td colSpan={6} style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                            No sessions scheduled — Entire day available for reservations
                          </td>
                        </tr>
                      );
                    }

                    return daySessions.map((s, idx) => {
                      const periodObj = PERIODS.find((p) => p.id === s.periodId);
                      return (
                        <tr key={`${w.id}-${s.id || idx}`}>
                          {idx === 0 && (
                            <td rowSpan={daySessions.length} style={{ fontWeight: 800, verticalAlign: 'top' }}>
                              {w.name}
                            </td>
                          )}
                          <td style={{ fontWeight: 700, color: '#0284c7' }}>{s.periodId}</td>
                          <td style={{ fontSize: 11, color: '#64748b' }}>{periodObj?.time || '—'}</td>
                          <td>
                            <strong>{s.code}</strong>: {s.title}
                          </td>
                          <td>{s.faculty}</td>
                          <td>{s.group}</td>
                          <td>
                            <span
                              className={`venue-status-badge ${
                                s.type === 'event' ? 'event' : 'occupied'
                              }`}
                              style={{ fontSize: 10.5 }}
                            >
                              {s.type === 'event' ? 'Event' : 'Occupied'}
                            </span>
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                type="button"
                className="app-btn-lime"
                onClick={() => {
                  roomScheduleModal.close();
                  setBookingVenueId(activeModalRoom.id);
                  setBookingDay(selectedDay);
                  setBookingPeriodId(selectedPeriod);
                  setBookingPurpose('');
                  reserveModal.open();
                }}
              >
                <Plus size={14} />
                <span>Reserve this Venue</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default VenueBookingsPage;
