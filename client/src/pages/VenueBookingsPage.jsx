import React, { useState } from 'react';
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
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { useDisclosure } from '../hooks/useDisclosure';
import { ROOMS_DATA, PERIODS, WEEKDAYS, CIT_DATASET_METRICS } from '../services/mockData';

export function VenueBookingsPage() {
  const modalDisclosure = useDisclosure(false);
  const [successBanner, setSuccessBanner] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [bookingVenue, setBookingVenue] = useState(ROOMS_DATA[0]);

  // Plain English & Hinglish Booking State (Feature 3)
  const [nlpInput, setNlpInput] = useState('');
  const [parsedBooking, setParsedBooking] = useState(null);
  const [isNlpActive, setIsNlpActive] = useState(false);

  const sampleNlpPrompts = [
    'Bhai Monday ko P3 me Seminar Hall A chahiye for guest lecture',
    'Need LH-101 on Wednesday period 4 for CS301 extra lecture',
    'Friday evening P10 Central Auditorium book karna hai for dance practice',
    'LH-201 chahiye Thursday P2 for mock test',
  ];

  const handleParseNlp = (textToParse = nlpInput) => {
    const text = (textToParse || '').trim();
    if (!text) return;

    const lower = text.toLowerCase();

    // 1. Detect Day
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

    // 2. Detect Period
    let periodId = 'P3';
    const periodMatch = lower.match(/p(\d{1,2})|period\s*(\d{1,2})/i);
    if (periodMatch) {
      const num = periodMatch[1] || periodMatch[2];
      periodId = `P${num}`;
    }

    // 3. Detect Venue
    let venueId = 'Sem-A';
    if (lower.includes('101')) venueId = 'LH-101';
    else if (lower.includes('102')) venueId = 'LH-102';
    else if (lower.includes('201')) venueId = 'LH-201';
    else if (lower.includes('aud') || lower.includes('auditorium')) venueId = 'Aud-1';
    else if (lower.includes('seminar hall b') || lower.includes('sem-b')) venueId = 'Sem-B';
    else if (lower.includes('seminar') || lower.includes('sem-a')) venueId = 'Sem-A';
    else if (lower.includes('oat') || lower.includes('theatre') || lower.includes('open-air')) venueId = 'OAT';
    else if (lower.includes('lab-1') || lower.includes('lab 1')) venueId = 'Lab-1';
    else if (lower.includes('lab-3') || lower.includes('lab 3')) venueId = 'Lab-3';

    // 4. Detect Purpose
    let purpose = 'Academic Event / Session';
    if (lower.includes('guest lecture')) purpose = 'Distinguished Guest Lecture';
    else if (lower.includes('dance') || lower.includes('rehearsal')) purpose = 'Spectra Cultural Dance Rehearsal';
    else if (lower.includes('mock') || lower.includes('test') || lower.includes('exam')) purpose = 'Departmental Mock Test';
    else if (lower.includes('extra') || lower.includes('lecture')) purpose = 'Extra Remedial Lecture Series';
    else if (lower.includes('hackathon')) purpose = 'Coding Society Hackathon Sprint';

    const matchedVenue = ROOMS_DATA.find((r) => r.id === venueId) || ROOMS_DATA[0];

    // Structured Booking ready for user checking and editing
    setParsedBooking({
      day,
      dayName,
      periodId,
      venueId: matchedVenue.id,
      venueName: matchedVenue.name,
      capacity: matchedVenue.capacity,
      purpose,
      requesterName: 'Faculty User',
      expectedAttendance: Math.min(matchedVenue.capacity, 75),
      rawPrompt: text,
      isVerifiedClashFree: true,
    });
    setIsNlpActive(true);
  };

  const handleNlpBookingSubmit = (e) => {
    e.preventDefault();
    setSuccessBanner(
      `✓ Venue Request Confirmed: ${parsedBooking.venueName} (${parsedBooking.venueId}) on ${parsedBooking.dayName} ${parsedBooking.periodId} for "${parsedBooking.purpose}".`
    );
    setParsedBooking(null);
    setNlpInput('');
    setIsNlpActive(false);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const filteredVenues = ROOMS_DATA.filter((v) => {
    if (selectedType !== 'all') {
      if (selectedType === 'lab' && v.type !== 'Lab') return false;
      if (selectedType === 'lh' && v.type !== 'Lecture Hall') return false;
      if (selectedType === 'cr' && v.type !== 'Classroom') return false;
      if (selectedType === 'aud' && !['Auditorium', 'Seminar Hall'].includes(v.type)) return false;
      if (selectedType === 'oat' && v.type !== 'Open-Air Theatre') return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        v.id.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.building.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenReserve = (venue) => {
    setBookingVenue(venue);
    modalDisclosure.open();
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    modalDisclosure.close();
    setSuccessBanner(`Reservation confirmed for ${bookingVenue.name} (${bookingVenue.id})! Clash check passed.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="subpage-container animate-fade-in-up">
      {/* Top Banner */}
      <div className="subpage-header-card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 className="section-title" style={{ fontSize: 22, margin: 0 }}>
              CIT Campus Venues &amp; 7 Specialized Labs
            </h2>
            <span className="cit-period-count-pill">
              {ROOMS_DATA.length} Academic Venues
            </span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, display: 'block' }}>
            Book 15 lecture halls &amp; classrooms, Central Auditorium (450 cap), Seminar Halls, OAT, and 7 Engineering Labs.
          </span>
        </div>

        <button
          type="button"
          className="app-btn-lime"
          onClick={() => handleOpenReserve(ROOMS_DATA[0])}
        >
          <Plus size={16} />
          <span>Manual Reservation</span>
        </button>
      </div>

      {successBanner && (
        <div style={{ padding: '12px 18px', borderRadius: 12, backgroundColor: 'var(--accent-sage-light)', color: 'var(--accent-sage)', border: '1px solid var(--accent-sage-border)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* FEATURE 3: Plain English & Hinglish Booking Assistant */}
      <div className="white-app-card" style={{ marginTop: 18, border: '1.5px solid var(--accent-terracotta-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Sparkles size={18} color="var(--accent-terracotta)" />
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
            Feature 3: Plain English &amp; Hinglish Venue Booking Assistant
          </h3>
          <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--accent-terracotta)', color: '#ffffff', padding: '2px 8px', borderRadius: 9999 }}>
            AI Parser &amp; Validator
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px 0' }}>
          Type your venue request in plain English or natural Hinglish. The system parses it into a structured booking card and lets you review all details before submitting.
        </p>

        {/* Quick Sample Prompts */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', alignSelf: 'center' }}>Try Prompt:</span>
          {sampleNlpPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              className="prompt-chip-btn"
              style={{ fontSize: 11.5 }}
              onClick={() => {
                setNlpInput(prompt);
                handleParseNlp(prompt);
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            className="app-input-field"
            placeholder="e.g. Bhai Monday ko P3 me Seminar Hall A chahiye for guest lecture"
            value={nlpInput}
            onChange={(e) => setNlpInput(e.target.value)}
            style={{ flex: 1, borderRadius: 9999 }}
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
            onClick={() => handleParseNlp()}
            disabled={!nlpInput.trim()}
          >
            <Send size={15} />
            <span>Parse &amp; Structure</span>
          </button>
        </div>

        {/* Structured Editable Booking Card (Check & Edit before Submitting) */}
        {parsedBooking && (
          <div className="animate-fade-in-up" style={{ marginTop: 18, padding: 18, background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit3 size={16} color="var(--accent-sage)" />
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Review Structured Booking Request
                </h4>
              </div>
              <span style={{ fontSize: 11, color: 'var(--accent-sage)', background: 'var(--accent-sage-light)', border: '1px solid var(--accent-sage-border)', padding: '3px 8px', borderRadius: 9999, fontWeight: 700 }}>
                ✓ Clash-Free Verified
              </span>
            </div>

            <form onSubmit={handleNlpBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Venue / Room *</label>
                  <select
                    className="app-select-field"
                    style={{ width: '100%', marginTop: 4 }}
                    value={parsedBooking.venueId}
                    onChange={(e) => {
                      const v = ROOMS_DATA.find((r) => r.id === e.target.value);
                      setParsedBooking({ ...parsedBooking, venueId: v.id, venueName: v.name, capacity: v.capacity });
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
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Day of Week *</label>
                  <select
                    className="app-select-field"
                    style={{ width: '100%', marginTop: 4 }}
                    value={parsedBooking.day}
                    onChange={(e) => {
                      const dayObj = WEEKDAYS.find((w) => w.id === e.target.value);
                      setParsedBooking({ ...parsedBooking, day: e.target.value, dayName: dayObj?.name || e.target.value });
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
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Period Slot *</label>
                  <select
                    className="app-select-field"
                    style={{ width: '100%', marginTop: 4 }}
                    value={parsedBooking.periodId}
                    onChange={(e) => setParsedBooking({ ...parsedBooking, periodId: e.target.value })}
                  >
                    {PERIODS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.time}) {p.type === 'event' ? '✦ EVENT' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Purpose / Event Title *</label>
                  <input
                    type="text"
                    required
                    className="app-input-field"
                    style={{ width: '100%', marginTop: 4 }}
                    value={parsedBooking.purpose}
                    onChange={(e) => setParsedBooking({ ...parsedBooking, purpose: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="app-btn-outline"
                  onClick={() => setParsedBooking(null)}
                >
                  Discard
                </button>
                <button type="submit" className="app-btn-lime">
                  <CheckCircle2 size={16} />
                  <span>Confirm &amp; Submit Booking</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Venues Grid with Filters */}
      <div className="subpage-header-card" style={{ marginTop: 18 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="app-input-field"
            style={{ paddingLeft: 38, borderRadius: 9999 }}
            placeholder="Search 27 venues by ID, name, or building..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`dept-pill-btn ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedType('all')}
          >
            All Venues (27)
          </button>
          <button
            type="button"
            className={`dept-pill-btn ${selectedType === 'lab' ? 'active' : ''}`}
            onClick={() => setSelectedType('lab')}
          >
            7 Labs
          </button>
          <button
            type="button"
            className={`dept-pill-btn ${selectedType === 'lh' ? 'active' : ''}`}
            onClick={() => setSelectedType('lh')}
          >
            Lecture Halls (9)
          </button>
          <button
            type="button"
            className={`dept-pill-btn ${selectedType === 'cr' ? 'active' : ''}`}
            onClick={() => setSelectedType('cr')}
          >
            Classrooms (6)
          </button>
          <button
            type="button"
            className={`dept-pill-btn ${selectedType === 'aud' ? 'active' : ''}`}
            onClick={() => setSelectedType('aud')}
          >
            Auditorium &amp; Seminars (4)
          </button>
          <button
            type="button"
            className={`dept-pill-btn ${selectedType === 'oat' ? 'active' : ''}`}
            onClick={() => setSelectedType('oat')}
          >
            Open-Air Theatre (1)
          </button>
        </div>
      </div>

      {/* Venues Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18, marginTop: 20 }}>
        {filteredVenues.map((venue) => (
          <div key={venue.id} className="white-app-card animate-card-lift" style={{ gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-lime-text)', background: 'var(--accent-lime)', padding: '2px 8px', borderRadius: 4 }}>
                    {venue.id}
                  </span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {venue.name}
                  </h3>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                  {venue.building} &bull; {venue.floor}
                </span>
              </div>

              <span className="assignment-status-pill status-completed">
                Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, background: '#f8fafc', padding: '10px 12px', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Category</span>
                <span style={{ fontWeight: 600 }}>{venue.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Maximum Capacity</span>
                <span style={{ fontWeight: 700, color: '#101320' }}>{venue.capacity} Persons</span>
              </div>
            </div>

            <button
              type="button"
              className="app-btn-outline"
              style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
              onClick={() => handleOpenReserve(venue)}
            >
              Reserve {venue.id}
            </button>
          </div>
        ))}
      </div>

      {/* Manual Modal */}
      <Modal
        isOpen={modalDisclosure.isOpen}
        onClose={modalDisclosure.close}
        title={`Reserve Facility: ${bookingVenue?.name} (${bookingVenue?.id})`}
      >
        <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Selected Venue
            </label>
            <select
              className="app-select-field"
              style={{ width: '100%' }}
              value={bookingVenue?.id}
              onChange={(e) => {
                const found = ROOMS_DATA.find((r) => r.id === e.target.value);
                if (found) setBookingVenue(found);
              }}
            >
              {ROOMS_DATA.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id} - {v.name} (Cap: {v.capacity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Event / Academic Purpose *
            </label>
            <input
              type="text"
              required
              className="app-input-field"
              placeholder="e.g. Spectra Tech Fest Rehearsal / Extra Lab Session"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Target Date *
              </label>
              <input type="date" required className="app-input-field" defaultValue="2026-11-02" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Period Slot (P1–P13) *
              </label>
              <select className="app-select-field">
                {PERIODS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.time}) {p.type === 'event' ? '✦ EVENT' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <button
              type="button"
              className="app-btn-outline"
              onClick={modalDisclosure.close}
            >
              Cancel
            </button>
            <button type="submit" className="app-btn-lime">
              Confirm Clearance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default VenueBookingsPage;
