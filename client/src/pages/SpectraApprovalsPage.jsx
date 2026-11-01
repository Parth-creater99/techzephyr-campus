import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Building,
  CheckCircle2,
  XCircle,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Shuffle,
} from 'lucide-react';
import { PRIORITY_LEVELS, ROOMS_DATA } from '../services/mockData';

export function SpectraApprovalsPage({ currentUser, onNavigate, onRequireAdmin, onSwitchRole }) {
  const [requests, setRequests] = useState([
    {
      id: 'spec-1',
      eventName: 'Spectra 2027: National Robotics Hackathon (Kickoff)',
      organizer: 'Robotics Society & IEEE CIT',
      facultyInCharge: 'Dr. A. Sharma (CSE)',
      venue: 'Computing Lab 1 (Lab-1)',
      day: 'Saturday',
      periodSlot: 'P10 - P13 (17:30 - 20:30)',
      priorityTier: 3,
      priorityName: 'Institute events',
      expectedFootfall: '120 Participants',
      status: 'PENDING',
      decisionReason: null,
      suggestedAlternative: null,
    },
    {
      id: 'spec-2',
      eventName: 'Spectra Western Dance Championship Prelims',
      organizer: 'CIT Cultural Council',
      facultyInCharge: 'Prof. Ananya Sen (ECE)',
      venue: 'CIT Central Auditorium (Aud-1)',
      day: 'Thursday',
      periodSlot: 'P7 (14:35 - 15:25)',
      priorityTier: 6,
      priorityName: 'Club events',
      expectedFootfall: '350 Students',
      status: 'CONFLICT',
      conflictDetails: 'Venue Aud-1 occupied by Priority 1 Midsem Exam EC-MID during P7.',
      decisionReason: null,
      suggestedAlternative: {
        venueId: 'OAT',
        venueName: 'CIT Open-Air Theatre (OAT)',
        day: 'Thursday',
        periodSlot: 'P11 (18:15 - 19:00)',
        reason: 'OAT has 800 capacity and is 100% free during evening event period P11 with no exam conflicts.',
      },
    },
    {
      id: 'spec-3',
      eventName: 'Spectra Battle of the Bands Sound & Lighting Tech Run',
      organizer: 'Music Society',
      facultyInCharge: 'Prof. David Solomon (Hum)',
      venue: 'CIT Open-Air Theatre (OAT)',
      day: 'Friday',
      periodSlot: 'P12 - P13 (19:00 - 20:30)',
      priorityTier: 3,
      priorityName: 'Institute events',
      expectedFootfall: '600 Students',
      status: 'APPROVED',
      decisionReason: 'Approved: Event adheres to Priority 3 Institute Fest standards. OAT is dedicated for evening performances with zero academic class overlaps.',
      suggestedAlternative: null,
    },
    {
      id: 'spec-4',
      eventName: 'Spectra Coding Club: Competitive Programming Speed Run',
      organizer: 'CIT Coding Club',
      facultyInCharge: 'Dr. R. Verma (CSE)',
      venue: 'Computing Lab 3 (Lab-3)',
      day: 'Wednesday',
      periodSlot: 'P6 - P7 (14:00 - 16:00)',
      priorityTier: 6,
      priorityName: 'Club events',
      expectedFootfall: '45 Students',
      status: 'CONFLICT',
      conflictDetails: 'Lab-3 occupied by Regular Class NET-LAB (Network Systems Lab) during P6-P7.',
      decisionReason: null,
      suggestedAlternative: {
        venueId: 'Lab-1',
        venueName: 'Computing Lab 1 (Lab-1)',
        day: 'Wednesday',
        periodSlot: 'P10 (17:30 - 18:15)',
        reason: 'Shifted to evening event period P10 in Lab-1. Priority 2 class on Lab-3 is protected.',
      },
    },
    {
      id: 'spec-5',
      eventName: 'Guest Lecture: AI in Autonomous Aviation (Cancelled)',
      organizer: 'Aeronautics Interest Group',
      facultyInCharge: 'Prof. S. Sen (ME)',
      venue: 'Lecture Hall LH-201',
      day: 'Thursday',
      periodSlot: 'P8 (15:35 - 16:25)',
      priorityTier: 4,
      priorityName: 'Guest lectures',
      expectedFootfall: '90 Students',
      status: 'CANCELLED',
      decisionReason: 'Cancelled by organizer as specified in hackathon starter pack note.',
      suggestedAlternative: null,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [feedback, setFeedback] = useState(null);

  // 1. Approve Request
  const handleApprove = (req) => {
    const reason = `Approved: Meets Priority Tier ${req.priorityTier} (${req.priorityName}) guidelines. Venue ${req.venue} is clear during ${req.periodSlot} with zero higher-priority clashes.`;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: 'APPROVED', decisionReason: reason }
          : r
      )
    );
    setFeedback(`✓ Approved "${req.eventName}" with rule-based justification.`);
    setTimeout(() => setFeedback(null), 4500);
  };

  // 2. Reject Request
  const handleReject = (req) => {
    const reason = `Rejected: Higher priority conflict. ${req.conflictDetails || 'Venue requested conflicts with higher priority academic sessions (Priority 1 Exams or Priority 2 Regular Classes).'}`;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? { ...r, status: 'REJECTED', decisionReason: reason }
          : r
      )
    );
    setFeedback(`✕ Rejected "${req.eventName}". Reason logged in decision ledger.`);
    setTimeout(() => setFeedback(null), 4500);
  };

  // 3. Apply Suggested Alternative
  const handleApplyAlternative = (req) => {
    if (!req.suggestedAlternative) return;
    const alt = req.suggestedAlternative;
    const reason = `Alternative Approved: Re-routed from ${req.venue} to ${alt.venueName} during ${alt.periodSlot}. Justification: ${alt.reason}`;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id
          ? {
              ...r,
              venue: alt.venueName,
              day: alt.day,
              periodSlot: alt.periodSlot,
              status: 'APPROVED',
              decisionReason: reason,
              suggestedAlternative: null,
            }
          : r
      )
    );
    setFeedback(`✓ Alternative applied for "${req.eventName}"! Moved to ${alt.venueName}.`);
    setTimeout(() => setFeedback(null), 4500);
  };

  const filtered = requests.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="subpage-container animate-fade-in-up">
      {/* Header Banner */}
      <div className="subpage-header-card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 className="section-title" style={{ fontSize: 22, margin: 0 }}>
              Spectra Fest Week Booking Review &amp; Decision Engine
            </h2>
            <span className="cit-period-count-pill">
              25 Requests (24 Cleared, 1 Cancelled)
            </span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, display: 'block' }}>
            Feature 4: Approve, reject, or suggest alternatives following the Section 4 Priority Rules with documented reasons for every decision.
          </span>
        </div>
      </div>

      {feedback && (
        <div style={{ padding: '12px 18px', borderRadius: 12, backgroundColor: 'var(--accent-sage-light)', color: 'var(--accent-sage)', border: '1px solid var(--accent-sage-border)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <button
          type="button"
          className={`dept-pill-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All Requests ({requests.length})
        </button>
        <button
          type="button"
          className={`dept-pill-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Pending Review
        </button>
        <button
          type="button"
          className={`dept-pill-btn ${filterStatus === 'conflict' ? 'active' : ''}`}
          onClick={() => setFilterStatus('conflict')}
        >
          Conflicts Requiring Action
        </button>
        <button
          type="button"
          className={`dept-pill-btn ${filterStatus === 'approved' ? 'active' : ''}`}
          onClick={() => setFilterStatus('approved')}
        >
          Approved
        </button>
      </div>

      {/* Requests Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
        {filtered.map((req) => {
          const isPending = req.status === 'PENDING';
          const isConflict = req.status === 'CONFLICT';
          const isApproved = req.status === 'APPROVED';
          const isRejected = req.status === 'REJECTED';
          const isCancelled = req.status === 'CANCELLED';

          return (
            <div key={req.id} className="white-app-card animate-card-lift" style={{ padding: 22, gap: 14 }}>
              {/* Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: '#101320', color: 'var(--accent-lime)' }}>
                      Tier {req.priorityTier}: {req.priorityName}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {req.eventName}
                    </h3>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Organized by: <strong>{req.organizer}</strong> &bull; Faculty In-Charge: <strong>{req.facultyInCharge}</strong>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: 9999,
                    textTransform: 'uppercase',
                    background: isApproved ? 'var(--accent-sage-light)' : isConflict ? 'var(--accent-terracotta-light)' : isCancelled ? 'var(--bg-card-subtle)' : 'var(--accent-ochre-light)',
                    color: isApproved ? 'var(--accent-sage)' : isConflict ? 'var(--accent-terracotta)' : isCancelled ? 'var(--text-muted)' : 'var(--accent-ochre)',
                    border: `1px solid ${isApproved ? 'var(--accent-sage-border)' : isConflict ? 'var(--accent-terracotta-border)' : 'var(--border-default)'}`,
                  }}
                >
                  {req.status}
                </span>
              </div>

              {/* Booking Specifications Box */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, background: '#f8fafc', padding: '12px 16px', borderRadius: 10, fontSize: 13 }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>Requested Venue</span>
                  <div style={{ fontWeight: 700, marginTop: 2, color: '#101320' }}>{req.venue}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>Schedule Window</span>
                  <div style={{ fontWeight: 700, marginTop: 2, color: '#101320' }}>{req.day} &bull; {req.periodSlot}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>Expected Footfall</span>
                  <div style={{ fontWeight: 700, marginTop: 2, color: '#101320' }}>{req.expectedFootfall}</div>
                </div>
              </div>

              {/* Conflict Explanation (if any) */}
              {req.conflictDetails && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldAlert size={16} />
                  <span><strong>Priority Conflict:</strong> {req.conflictDetails}</span>
                </div>
              )}

              {/* Documented Decision Reason (Feature 4 Requirement: reason for every decision) */}
              {req.decisionReason && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: isApproved ? '#ecfdf5' : '#fef2f2', border: `1px solid ${isApproved ? '#a7f3d0' : '#fecaca'}`, color: isApproved ? '#065f46' : '#991b1b', fontSize: 12.5 }}>
                  <strong>Documented Decision Reason:</strong> {req.decisionReason}
                </div>
              )}

              {/* Suggest Alternative Box (Feature 4 Requirement) */}
              {req.suggestedAlternative && (
                <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--accent-sage-light)', border: '1.5px dashed var(--accent-sage-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-sage)', fontWeight: 800, fontSize: 13 }}>
                      <Shuffle size={15} />
                      <span>Suggested Clash-Free Alternative</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#1e293b', marginTop: 4 }}>
                      Move to <strong>{req.suggestedAlternative.venueName}</strong> on <strong>{req.suggestedAlternative.day} {req.suggestedAlternative.periodSlot}</strong>.
                    </div>
                    <div style={{ fontSize: 11.5, color: '#4b5563', marginTop: 2 }}>
                      Reason: {req.suggestedAlternative.reason}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="app-btn-lime"
                    style={{ fontSize: 12.5, padding: '7px 16px' }}
                    onClick={() => handleApplyAlternative(req)}
                  >
                    Accept Alternative &amp; Approve
                  </button>
                </div>
              )}

              {/* Action Buttons: Approve, Reject, Suggest Alternative */}
              {(isPending || isConflict) && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    type="button"
                    className="app-btn-outline"
                    style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    onClick={() => handleReject(req)}
                  >
                    <XCircle size={15} />
                    <span>Reject with Reason</span>
                  </button>

                  <button
                    type="button"
                    className="app-btn-lime"
                    onClick={() => handleApprove(req)}
                  >
                    <CheckCircle2 size={15} />
                    <span>Approve Following Rules</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SpectraApprovalsPage;
