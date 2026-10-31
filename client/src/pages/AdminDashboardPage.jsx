import React, { useState } from 'react';
import {
  Calendar,
  Building,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Wand2,
  CalendarDays,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet,
  Info,
  Check,
  XCircle,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitleGroup,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  PageHeading,
} from '../components';
import {
  ADMIN_METRICS,
  WEEKLY_ACTIVITY_DATA,
  ROOM_UTILIZATION_DATA,
  PENDING_BOOKING_REQUESTS,
  RECENT_SCHEDULE_CHANGES,
} from '../services/mockData';

export function AdminDashboardPage({ onNavigate }) {
  const [bookingRequests, setBookingRequests] = useState(PENDING_BOOKING_REQUESTS);
  const [actionFeedback, setActionFeedback] = useState(null);

  const handleApprove = (id, eventName) => {
    setBookingRequests((prev) => prev.filter((r) => r.id !== id));
    setActionFeedback(`Approved booking for "${eventName}" (Simulated)`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleReject = (id, eventName) => {
    setBookingRequests((prev) => prev.filter((r) => r.id !== id));
    setActionFeedback(`Rejected booking for "${eventName}" (Simulated)`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Heading */}
      <PageHeading
        title="Operations & Scheduling Command"
        subtitle="Real-time academic timetable coordination, room occupancy monitoring, and approval workflows across Chilika Institute of Technology."
        badge={
          <Badge variant="info" withDot>
            Campus Admin Desk
          </Badge>
        }
        actions={
          <div className="quick-actions-bar">
            <Button
              variant="outline"
              size="sm"
              icon={CalendarDays}
              onClick={() => onNavigate?.('timetable')}
            >
              Timetable Grid
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Wand2}
              onClick={() => onNavigate?.('schedule-generation')}
            >
              Generate Draft
            </Button>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div
        style={{
          backgroundColor: 'rgba(14, 165, 233, 0.08)',
          border: '1px solid rgba(14, 165, 233, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2-5)' }}>
          <Info size={16} color="var(--color-info-text)" aria-hidden="true" />
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-info-text)' }}>
            <strong>Demo Data Notice:</strong> All statistics, utilization percentages, and pending logs below represent simulated campus scenarios for frontend interface evaluation.
          </span>
        </div>
        <Badge variant="info" withDot={false}>
          Static Demo Mockup
        </Badge>
      </div>

      {/* Temporary Simulated Action Feedback Banner */}
      {actionFeedback && (
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2-5) var(--space-4)',
            color: 'var(--color-success-text)',
            fontSize: 'var(--text-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            animation: 'fadeIn var(--transition-fast) forwards',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 1. Summary Metrics Cards */}
      <div className="metrics-grid">
        {/* Total Sessions */}
        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">{ADMIN_METRICS.totalSessions.label}</span>
            <span className="metric-value">{ADMIN_METRICS.totalSessions.value}</span>
            <div className="metric-subtext">
              <ArrowUpRight size={13} color="var(--color-success-text)" />
              <span style={{ color: 'var(--color-success-text)' }}>
                {ADMIN_METRICS.totalSessions.trend}
              </span>
            </div>
          </div>
          <div
            className="metric-icon-box"
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(37, 99, 235, 0.28)',
              color: 'var(--accent-text)',
            }}
          >
            <Calendar size={22} aria-hidden="true" />
          </div>
        </div>

        {/* Rooms In Use */}
        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">{ADMIN_METRICS.roomsInUse.label}</span>
            <span className="metric-value">{ADMIN_METRICS.roomsInUse.value}</span>
            <div className="metric-subtext">
              <span style={{ color: 'var(--accent-text)' }}>
                {ADMIN_METRICS.roomsInUse.trend}
              </span>
            </div>
          </div>
          <div
            className="metric-icon-box"
            style={{
              backgroundColor: 'rgba(14, 165, 233, 0.12)',
              border: '1px solid rgba(14, 165, 233, 0.28)',
              color: 'var(--color-info-text)',
            }}
          >
            <Building size={22} aria-hidden="true" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">{ADMIN_METRICS.pendingApprovals.label}</span>
            <span className="metric-value">{ADMIN_METRICS.pendingApprovals.value}</span>
            <div className="metric-subtext">
              <span style={{ color: 'var(--color-warning-text)' }}>
                {ADMIN_METRICS.pendingApprovals.trend}
              </span>
            </div>
          </div>
          <div
            className="metric-icon-box"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.28)',
              color: 'var(--color-warning-text)',
            }}
          >
            <Clock size={22} aria-hidden="true" />
          </div>
        </div>

        {/* Scheduling Conflicts */}
        <div className="metric-card">
          <div className="metric-content">
            <span className="metric-label">{ADMIN_METRICS.schedulingConflicts.label}</span>
            <span className="metric-value" style={{ color: 'var(--color-danger-text)' }}>
              {ADMIN_METRICS.schedulingConflicts.value}
            </span>
            <div className="metric-subtext">
              <span style={{ color: 'var(--color-danger-text)' }}>
                {ADMIN_METRICS.schedulingConflicts.trend}
              </span>
            </div>
          </div>
          <div
            className="metric-icon-box"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.28)',
              color: 'var(--color-danger-text)',
            }}
          >
            <AlertTriangle size={22} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Weekly Activity Chart + Room Utilization Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 'var(--space-5)',
        }}
      >
        {/* Weekly Activity Visualization */}
        <Card elevated>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Weekly Scheduled Sessions Breakdown</CardTitle>
              <CardDescription>Lecture vs Lab vs Tutorial volume across Mon–Sat (Demo)</CardDescription>
            </CardTitleGroup>
            <Badge variant="default" withDot={false}>
              Session Distribution
            </Badge>
          </CardHeader>
          <CardContent>
            {/* Pure Responsive SVG Bar Chart */}
            <div className="chart-container">
              <svg className="svg-chart" viewBox="0 0 520 180" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="40" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="40" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.12)" />

                {/* Y-axis Labels */}
                <text x="32" y="24" fill="var(--text-muted)" fontSize="9" textAnchor="end">80</text>
                <text x="32" y="64" fill="var(--text-muted)" fontSize="9" textAnchor="end">60</text>
                <text x="32" y="104" fill="var(--text-muted)" fontSize="9" textAnchor="end">40</text>
                <text x="32" y="144" fill="var(--text-muted)" fontSize="9" textAnchor="end">0</text>

                {/* Bars for Mon - Sat */}
                {WEEKLY_ACTIVITY_DATA.map((item, index) => {
                  const xBase = 65 + index * 75;
                  const maxH = 120;
                  const lecH = (item.lectures / 85) * maxH;
                  const labH = (item.labs / 85) * maxH;
                  const tutH = (item.tutorials / 85) * maxH;

                  return (
                    <g key={item.day} className="chart-group">
                      {/* Lectures bar (Blue) */}
                      <rect
                        x={xBase - 16}
                        y={140 - lecH}
                        width="10"
                        height={lecH}
                        rx="3"
                        fill="#2563eb"
                      >
                        <title>{`${item.day}: ${item.lectures} Lectures`}</title>
                      </rect>
                      {/* Labs bar (Green) */}
                      <rect
                        x={xBase - 4}
                        y={140 - labH}
                        width="10"
                        height={labH}
                        rx="3"
                        fill="#10b981"
                      >
                        <title>{`${item.day}: ${item.labs} Labs`}</title>
                      </rect>
                      {/* Tutorials bar (Purple) */}
                      <rect
                        x={xBase + 8}
                        y={140 - tutH}
                        width="10"
                        height={tutH}
                        rx="3"
                        fill="#8b5cf6"
                      >
                        <title>{`${item.day}: ${item.tutorials} Tutorials`}</title>
                      </rect>

                      {/* Day Label */}
                      <text
                        x={xBase + 1}
                        y="158"
                        fill="var(--text-secondary)"
                        fontSize="11"
                        textAnchor="middle"
                        fontWeight="500"
                      >
                        {item.day}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Chart Legend */}
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color-dot" style={{ backgroundColor: '#2563eb' }} />
                  <span>Lectures</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color-dot" style={{ backgroundColor: '#10b981' }} />
                  <span>Labs / Practical</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color-dot" style={{ backgroundColor: '#8b5cf6' }} />
                  <span>Tutorials</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              Peak campus operational load observed on Wednesdays (84 scheduled sessions)
            </span>
          </CardFooter>
        </Card>

        {/* Room Utilization Visualization */}
        <Card elevated>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Room Utilization & Live Occupancy</CardTitle>
              <CardDescription>Lecture hall load factors and current room assignments (Demo)</CardDescription>
            </CardTitleGroup>
            <Badge variant="success" withDot>
              38 / 44 Active
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="utilization-grid">
              {ROOM_UTILIZATION_DATA.map((item) => {
                const percentage = Math.round((item.occupiedHours / item.maxHours) * 100);
                const barColor =
                  percentage >= 90
                    ? 'var(--color-danger)'
                    : percentage >= 75
                    ? 'var(--accent-primary)'
                    : 'var(--color-success)';

                return (
                  <div key={item.room} className="room-util-card">
                    <div className="room-util-header">
                      <div>
                        <span className="room-name-badge">{item.room}</span>
                        <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                          {item.type} (Cap {item.capacity})
                        </div>
                      </div>
                      <Badge
                        variant={
                          item.status === 'High'
                            ? 'warning'
                            : item.status === 'Reserved'
                            ? 'info'
                            : 'success'
                        }
                        withDot
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 'var(--text-2xs)',
                          marginBottom: '4px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span>{item.current}</span>
                        <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                          {percentage}%
                        </span>
                      </div>
                      <div className="util-progress-track">
                        <div
                          className="util-progress-bar"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              LH-102 operating near capacity limit (91%). Smart relocation suggested.
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('venue-bookings')}
            >
              All Venues
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* 3. Bottom Row: Pending Bookings Table + Recent Schedule Changes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 'var(--space-5)',
        }}
      >
        {/* Pending Booking Requests Table */}
        <Card elevated>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Pending Venue & Spectra Requests</CardTitle>
              <CardDescription>
                Faculty and student organization reservation submissions awaiting Dean clearance
              </CardDescription>
            </CardTitleGroup>
            <Badge variant="warning">
              {bookingRequests.length} Pending
            </Badge>
          </CardHeader>
          <CardContent style={{ padding: 0 }}>
            {bookingRequests.length === 0 ? (
              <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-muted)' }}>
                All pending booking requests have been reviewed.
              </div>
            ) : (
              <div className="ops-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="ops-table">
                  <thead>
                    <tr>
                      <th>Event & Organizer</th>
                      <th>Venue</th>
                      <th>Date & Slot</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                            {req.event}
                          </div>
                          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                            {req.organizer}
                          </div>
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-secondary)' }}>{req.venue}</span>
                        </td>
                        <td>
                          <div style={{ color: 'var(--text-primary)' }}>{req.date}</div>
                          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                            {req.time}
                          </div>
                        </td>
                        <td>
                          <Badge variant={req.badgeVariant} withDot>
                            {req.status}
                          </Badge>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 'var(--space-1-5)' }}>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={Check}
                              onClick={() => handleApprove(req.id, req.event)}
                              aria-label={`Approve ${req.event}`}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={XCircle}
                              onClick={() => handleReject(req.id, req.event)}
                              aria-label={`Reject ${req.event}`}
                            >
                              Deny
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              Approvals notify the Venue In-Charge and update the central reservation desk
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('spectra-approvals')}
            >
              Spectra Desk
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Schedule Changes Timeline */}
        <Card elevated>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Recent Schedule Changes & Disruption Feed</CardTitle>
              <CardDescription>
                Audited operational adjustments, emergency hall relocations, and substitutions
              </CardDescription>
            </CardTitleGroup>
            <Badge variant="default" withDot={false}>
              Live Audit Log
            </Badge>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {RECENT_SCHEDULE_CHANGES.map((chg) => (
                <div
                  key={chg.id}
                  style={{
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 'var(--space-3)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                        {chg.title}
                      </span>
                      <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                        • {chg.time}
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                      {chg.description}
                    </p>
                  </div>
                  <Badge variant={chg.badgeVariant} withDot={false}>
                    {chg.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              Rescheduling engine records all faculty swaps and hall changes
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('rescheduling')}
            >
              Disruption Log
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* 4. Quick Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitleGroup>
            <CardTitle>Fast Operations Actions</CardTitle>
            <CardDescription>One-click administrative shortcuts</CardDescription>
          </CardTitleGroup>
          <Badge variant="default">Shortcuts</Badge>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <Button
              variant="secondary"
              icon={Wand2}
              onClick={() => onNavigate?.('schedule-generation')}
            >
              Generate Odd Sem Schedule
            </Button>
            <Button
              variant="secondary"
              icon={CalendarDays}
              onClick={() => onNavigate?.('timetable')}
            >
              Browse Faculty Timetables
            </Button>
            <Button
              variant="secondary"
              icon={Building}
              onClick={() => onNavigate?.('venue-bookings')}
            >
              Book Lecture Hall
            </Button>
            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={() => onNavigate?.('rescheduling')}
            >
              Log Emergency Disruption
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboardPage;
