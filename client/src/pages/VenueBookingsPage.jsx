import React, { useState, useMemo } from 'react';
import {
  Building2,
  Calendar,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  Users,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
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
  const [sessions, setSessions] = useState(() => getStoredTimetableSessions());

  // Navigation & Filter States
  const [selectedDay, setSelectedDay] = useState('mon');
  const [selectedPeriod, setSelectedPeriod] = useState('P1');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'occupied', 'vacant', 'lab', 'lh', 'cr', 'special'
  const [search, setSearch] = useState('');

  // Modals
  const reserveModal = useDisclosure(false);
  const roomScheduleModal = useDisclosure(false);
  const [activeModalRoom, setActiveModalRoom] = useState(null);

  // Reservation Form State
  const [bookingVenueId, setBookingVenueId] = useState(ROOMS_DATA[0].id);
  const [bookingDay, setBookingDay] = useState('mon');
  const [bookingPeriodId, setBookingPeriodId] = useState('P1');
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [bookingFaculty, setBookingFaculty] = useState(FACULTY_DATA[0]?.name || 'Dr. A. Sharma');
  const [bookingGroup, setBookingGroup] = useState('CSE-3');
  const [bookingError, setBookingError] = useState(null);
  const [successBanner, setSuccessBanner] = useState(null);

  // Minimal Quick Book Command Bar
  const [quickBookOpen, setQuickBookOpen] = useState(false);
  const [quickBookInput, setQuickBookInput] = useState('');

  const currentPeriodObj = useMemo(() => {
    return PERIODS.find((p) => p.id === selectedPeriod) || PERIODS[0];
  }, [selectedPeriod]);

  const currentDayObj = useMemo(() => {
    return WEEKDAYS.find((w) => w.id === selectedDay) || WEEKDAYS[0];
  }, [selectedDay]);

  // Compute live occupancy lookup
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

  // Summary Metrics
  const metrics = useMemo(() => {
    let occupied = 0;
    let vacant = 0;
    ROOMS_DATA.forEach((r) => {
      if (occupancyMap[r.id.toLowerCase()]) occupied++;
      else vacant++;
    });
    return { total: ROOMS_DATA.length, occupied, vacant };
  }, [occupancyMap]);

  // Filtered Venues
  const filteredVenues = useMemo(() => {
    return ROOMS_DATA.filter((v) => {
      const activeSession = occupancyMap[v.id.toLowerCase()];
      const isOccupied = Boolean(activeSession);

      if (typeFilter === 'occupied' && !isOccupied) return false;
      if (typeFilter === 'vacant' && isOccupied) return false;
      if (typeFilter === 'lab' && v.type !== 'Lab') return false;
      if (typeFilter === 'lh' && v.type !== 'Lecture Hall') return false;
      if (typeFilter === 'cr' && v.type !== 'Classroom') return false;
      if (typeFilter === 'special' && !['Auditorium', 'Seminar Hall', 'Open-Air Theatre'].includes(v.type)) return false;

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

  // Quick Book Action on a card
  const handleQuickBook = (venue) => {
    setBookingVenueId(venue.id);
    setBookingDay(selectedDay);
    setBookingPeriodId(selectedPeriod);
    setBookingPurpose('');
    setBookingError(null);
    reserveModal.open();
  };

  const handleOpenRoomSchedule = (venue) => {
    setActiveModalRoom(venue);
    roomScheduleModal.open();
  };

  const handleManualBookingSubmit = (e) => {
    e.preventDefault();
    setBookingError(null);

    const clash = sessions.find(
      (s) =>
        s.day === bookingDay &&
        s.periodId === bookingPeriodId &&
        s.room?.toLowerCase() === bookingVenueId.toLowerCase()
    );

    if (clash) {
      setBookingError(
        `Clash: ${bookingVenueId} is already occupied on ${bookingDay.toUpperCase()} ${bookingPeriodId} by "${clash.code} - ${clash.title}".`
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
      title: bookingPurpose || 'Reserved Session',
      type: periodObj?.type === 'event' ? 'event' : 'lecture',
      group: bookingGroup || 'General',
      faculty: bookingFaculty,
      room: bookingVenueId,
      capacity: venueObj?.capacity || 60,
      enrolled: Math.min(venueObj?.capacity || 60, 45),
      notes: bookingPurpose,
    };

    const updated = [...sessions, newSession];
    setSessions(updated);
    saveStoredTimetableSessions(updated);

    reserveModal.close();
    setSuccessBanner(`Reserved ${bookingVenueId} on ${bookingDay.toUpperCase()} ${bookingPeriodId}.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  // Minimal Natural Language parsing
  const handleQuickCommandSubmit = (e) => {
    if (e) e.preventDefault();
    const text = quickBookInput.trim();
    if (!text) return;

    const lower = text.toLowerCase();

    let day = 'mon';
    if (lower.includes('tue')) day = 'tue';
    else if (lower.includes('wed')) day = 'wed';
    else if (lower.includes('thu')) day = 'thu';
    else if (lower.includes('fri')) day = 'fri';
    else if (lower.includes('sat')) day = 'sat';

    let periodId = 'P1';
    const periodMatch = lower.match(/p(\d{1,2})|period\s*(\d{1,2})/i);
    if (periodMatch) {
      periodId = `P${periodMatch[1] || periodMatch[2]}`;
    }

    let venueId = 'LH-101';
    ROOMS_DATA.forEach((r) => {
      if (lower.includes(r.id.toLowerCase())) venueId = r.id;
    });

    setBookingVenueId(venueId);
    setBookingDay(day);
    setBookingPeriodId(periodId);
    setBookingPurpose(text);
    setBookingError(null);
    setQuickBookOpen(false);
    setQuickBookInput('');
    reserveModal.open();
  };

  return (
    <div className="venue-page-container">
      {/* 1. Minimal Header */}
      <div className="venue-header-clean">
        <div>
          <h2 className="venue-header-title">Campus Venues</h2>
          <p className="venue-header-subtitle">
            {metrics.total} venues &bull; {metrics.occupied} in use &bull; {metrics.vacant} available &bull;{' '}
            <strong style={{ color: '#0f172a' }}>{currentDayObj.name} {currentPeriodObj.name} ({currentPeriodObj.time})</strong>
          </p>
        </div>

        <div className="venue-header-actions">
          <button
            type="button"
            className="venue-btn-subtle"
            onClick={() => setQuickBookOpen(!quickBookOpen)}
          >
            <Sparkles size={13} />
            <span>{quickBookOpen ? 'Close' : 'Quick Prompt'}</span>
          </button>

          <button
            type="button"
            className="venue-btn-primary"
            onClick={() => {
              setBookingVenueId(ROOMS_DATA[0].id);
              setBookingDay(selectedDay);
              setBookingPeriodId(selectedPeriod);
              setBookingPurpose('');
              setBookingError(null);
              reserveModal.open();
            }}
          >
            <Plus size={14} />
            <span>Reserve Room</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div style={{ padding: '8px 12px', borderRadius: 6, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: 12.5, fontWeight: 600 }}>
          {successBanner}
        </div>
      )}

      {/* 2. Sleek Quick Booking Command Bar (Optional) */}
      {quickBookOpen && (
        <form onSubmit={handleQuickCommandSubmit} className="venue-quickbook-bar">
          <input
            type="text"
            className="venue-quickbook-input"
            placeholder="Type a request (e.g. LH-101 Wednesday P3 for guest lecture, Lab-2 Monday P4)..."
            value={quickBookInput}
            onChange={(e) => setQuickBookInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="venue-btn-primary" style={{ padding: '4px 10px', fontSize: 12 }}>
            Fill Form
          </button>
        </form>
      )}

      {/* 3. Controls: Day Tabs & Periods Timeline */}
      <div className="venue-controls-clean">
        <div className="venue-controls-top">
          {/* Day Tabs */}
          <div className="venue-day-tabs">
            {WEEKDAYS.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`venue-day-tab ${selectedDay === w.id ? 'active' : ''}`}
                onClick={() => setSelectedDay(w.id)}
              >
                {w.name.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="venue-view-tabs">
            <button
              type="button"
              className={`venue-view-tab ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={13} />
              <span>Grid</span>
            </button>
            <button
              type="button"
              className={`venue-view-tab ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <TableIcon size={13} />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Flat Period Timeline */}
        <div className="venue-period-timeline">
          {PERIODS.map((p) => {
            const isSelected = selectedPeriod === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`venue-period-item ${p.type === 'event' ? 'is-event' : ''} ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(p.id)}
              >
                <span className="venue-period-code">{p.name}</span>
                <span className="venue-period-sub">{p.time.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="venue-filter-row-clean">
          <div className="venue-filter-pills-clean">
            <button
              type="button"
              className={`venue-filter-btn-clean ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTypeFilter('all')}
            >
              All ({ROOMS_DATA.length})
            </button>
            <button
              type="button"
              className={`venue-filter-btn-clean ${typeFilter === 'occupied' ? 'active' : ''}`}
              onClick={() => setTypeFilter('occupied')}
            >
              In use ({metrics.occupied})
            </button>
            <button
              type="button"
              className={`venue-filter-btn-clean ${typeFilter === 'vacant' ? 'active' : ''}`}
              onClick={() => setTypeFilter('vacant')}
            >
              Available ({metrics.vacant})
            </button>
            <button
              type="button"
              className={`venue-filter-btn-clean ${typeFilter === 'lab' ? 'active' : ''}`}
              onClick={() => setTypeFilter('lab')}
            >
              Labs
            </button>
            <button
              type="button"
              className={`venue-filter-btn-clean ${typeFilter === 'lh' ? 'active' : ''}`}
              onClick={() => setTypeFilter('lh')}
            >
              Halls
            </button>
            <button
              type="button"
              className={`venue-filter-btn-clean ${typeFilter === 'cr' ? 'active' : ''}`}
              onClick={() => setTypeFilter('cr')}
            >
              Classrooms
            </button>
            <button
              type="button"
              className={`venue-filter-btn-clean ${typeFilter === 'special' ? 'active' : ''}`}
              onClick={() => setTypeFilter('special')}
            >
              Auditorium &amp; OAT
            </button>
          </div>

          <div style={{ position: 'relative', width: 220 }}>
            <Search
              size={13}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              className="app-input-field"
              style={{ paddingLeft: 28, fontSize: 12, height: 30 }}
              placeholder="Filter rooms or courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 4. Venue Content */}
      {viewMode === 'grid' && (
        <div className="venue-clean-grid">
          {filteredVenues.map((venue) => {
            const activeSession = occupancyMap[venue.id.toLowerCase()];
            const isOccupied = Boolean(activeSession);

            return (
              <div
                key={venue.id}
                className={`venue-clean-card ${isOccupied ? 'is-occupied' : 'is-vacant'}`}
              >
                <div className="venue-card-header">
                  <span className="venue-room-code">{venue.id}</span>
                  <span className="venue-room-type">{venue.capacity} seats</span>
                </div>
                <div className="venue-room-sub">
                  {venue.name} &bull; {venue.building}
                </div>

                <div className="venue-card-body">
                  {isOccupied ? (
                    <>
                      <div className="venue-class-title" title={activeSession.title}>
                        {activeSession.code}: {activeSession.title}
                      </div>
                      <div className="venue-class-meta">
                        <span>{activeSession.faculty}</span>
                        <span>&bull;</span>
                        <span>{activeSession.group}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="venue-status-available">Available</div>
                      <div className="venue-status-available-sub">No session at {selectedPeriod}</div>
                    </>
                  )}
                </div>

                <div className="venue-card-actions">
                  {!isOccupied ? (
                    <button
                      type="button"
                      className="venue-action-link"
                      onClick={() => handleQuickBook(venue)}
                    >
                      + Reserve slot
                    </button>
                  ) : (
                    <span style={{ fontSize: 11, color: '#64748b' }}>In use</span>
                  )}

                  <button
                    type="button"
                    className="venue-action-link secondary"
                    onClick={() => handleOpenRoomSchedule(venue)}
                  >
                    Schedule &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Minimalist Table View */}
      {viewMode === 'table' && (
        <div className="venue-matrix-wrapper">
          <table className="venue-matrix-simple-table">
            <thead>
              <tr>
                <th className="col-sticky">Room</th>
                <th>Cap</th>
                {PERIODS.map((p) => (
                  <th key={p.id}>
                    <div>{p.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredVenues.map((venue) => (
                <tr key={venue.id}>
                  <td className="col-sticky">
                    <div>{venue.id}</div>
                    <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 400 }}>{venue.name}</div>
                  </td>
                  <td style={{ color: '#64748b' }}>{venue.capacity}</td>

                  {PERIODS.map((p) => {
                    const session = sessions.find(
                      (s) =>
                        s.day === selectedDay &&
                        s.periodId === p.id &&
                        s.room?.toLowerCase() === venue.id.toLowerCase()
                    );

                    if (session) {
                      return (
                        <td key={p.id}>
                          <span
                            className="venue-matrix-cell-busy"
                            onClick={() => handleOpenRoomSchedule(venue)}
                            title={`${session.code}: ${session.title} (${session.faculty})`}
                          >
                            {session.code}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={p.id}>
                        <span
                          className="venue-matrix-cell-free"
                          onClick={() => {
                            setBookingVenueId(venue.id);
                            setBookingDay(selectedDay);
                            setBookingPeriodId(p.id);
                            setBookingPurpose('');
                            setBookingError(null);
                            reserveModal.open();
                          }}
                          title="Click to reserve"
                        >
                          &bull;
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Reservation Modal */}
      <Modal
        isOpen={reserveModal.isOpen}
        onClose={reserveModal.close}
        title={`Reserve Room: ${bookingVenueId}`}
      >
        <form onSubmit={handleManualBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookingError && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', fontSize: 12, padding: '8px 12px', borderRadius: 6 }}>
              {bookingError}
            </div>
          )}

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#475569' }}>
              Venue
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#475569' }}>
                Day
              </label>
              <select
                className="app-select-field"
                style={{ width: '100%' }}
                value={bookingDay}
                onChange={(e) => setBookingDay(e.target.value)}
              >
                {WEEKDAYS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#475569' }}>
                Period
              </label>
              <select
                className="app-select-field"
                style={{ width: '100%' }}
                value={bookingPeriodId}
                onChange={(e) => setBookingPeriodId(e.target.value)}
              >
                {PERIODS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.time})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#475569' }}>
              Purpose
            </label>
            <input
              type="text"
              required
              className="app-input-field"
              placeholder="e.g. Extra lecture, Guest talk, Tutorial"
              value={bookingPurpose}
              onChange={(e) => setBookingPurpose(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#475569' }}>
                Faculty
              </label>
              <select
                className="app-select-field"
                style={{ width: '100%' }}
                value={bookingFaculty}
                onChange={(e) => setBookingFaculty(e.target.value)}
              >
                {FACULTY_DATA.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, display: 'block', marginBottom: 4, color: '#475569' }}>
                Group
              </label>
              <input
                type="text"
                className="app-input-field"
                value={bookingGroup}
                onChange={(e) => setBookingGroup(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button type="button" className="venue-btn-subtle" onClick={reserveModal.close}>
              Cancel
            </button>
            <button type="submit" className="venue-btn-primary">
              Confirm
            </button>
          </div>
        </form>
      </Modal>

      {/* Room Schedule Modal */}
      <Modal
        isOpen={roomScheduleModal.isOpen}
        onClose={roomScheduleModal.close}
        title={`Schedule: ${activeModalRoom?.id} (${activeModalRoom?.name})`}
      >
        {activeModalRoom && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12.5, color: '#64748b' }}>
              {activeModalRoom.building} &bull; {activeModalRoom.floor} &bull; {activeModalRoom.capacity} seats
            </div>

            <div style={{ overflowX: 'auto', maxHeight: '55vh' }}>
              <table className="venue-matrix-simple-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Period</th>
                    <th>Course</th>
                    <th>Faculty</th>
                    <th>Group</th>
                  </tr>
                </thead>
                <tbody>
                  {WEEKDAYS.map((w) => {
                    const daySessions = sessions.filter(
                      (s) => s.day === w.id && s.room?.toLowerCase() === activeModalRoom.id.toLowerCase()
                    );

                    if (daySessions.length === 0) {
                      return (
                        <tr key={w.id}>
                          <td style={{ fontWeight: 600, color: '#0f172a' }}>{w.name}</td>
                          <td colSpan={4} style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'left' }}>
                            Available
                          </td>
                        </tr>
                      );
                    }

                    return daySessions.map((s, idx) => (
                      <tr key={`${w.id}-${s.id || idx}`}>
                        {idx === 0 && (
                          <td rowSpan={daySessions.length} style={{ fontWeight: 600, verticalAlign: 'top', color: '#0f172a' }}>
                            {w.name}
                          </td>
                        )}
                        <td style={{ fontWeight: 600 }}>{s.periodId}</td>
                        <td><strong>{s.code}</strong>: {s.title}</td>
                        <td>{s.faculty}</td>
                        <td>{s.group}</td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                type="button"
                className="venue-btn-primary"
                onClick={() => {
                  roomScheduleModal.close();
                  setBookingVenueId(activeModalRoom.id);
                  setBookingDay(selectedDay);
                  setBookingPeriodId(selectedPeriod);
                  setBookingPurpose('');
                  reserveModal.open();
                }}
              >
                Reserve Room
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default VenueBookingsPage;
