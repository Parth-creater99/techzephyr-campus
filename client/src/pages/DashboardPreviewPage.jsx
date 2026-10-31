import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Layers,
  MapPin,
  AlertTriangle,
  Sparkles,
  Search,
  BookOpen,
  Building,
  Activity,
  CheckCircle2,
  SlidersHorizontal,
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
  Input,
  Select,
  Modal,
  LoadingSpinner,
  Skeleton,
  EmptyState,
  PageHeading,
} from '../components';
import { useDisclosure } from '../hooks/useDisclosure';

export function DashboardPreviewPage() {
  const modalDisclosure = useDisclosure(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [sampleSearch, setSampleSearch] = useState('');
  const [sampleDept, setSampleDept] = useState('');

  const handleSimulateLoad = () => {
    setIsLoadingDemo(true);
    setTimeout(() => {
      setIsLoadingDemo(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Heading Primitive */}
      <PageHeading
        title="CIT Operations & Scheduling Hub"
        subtitle="Foundational dashboard demonstrating design tokens, typography, and reusable UI primitives for Chilika Institute of Technology scheduling operations."
        badge={
          <Badge variant="info" withDot>
            System Foundation
          </Badge>
        }
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="outline"
              size="md"
              icon={SlidersHorizontal}
              onClick={modalDisclosure.open}
            >
              Preview Modal
            </Button>
            <Button
              variant="primary"
              size="md"
              isLoading={isLoadingDemo}
              icon={Activity}
              onClick={handleSimulateLoad}
            >
              Simulate Action
            </Button>
          </div>
        }
      />

      {/* Operations Notice Banner */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-subtle)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-text)',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
              Design System & Component Library Initialized
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              The deep navy palette, high-contrast surfaces, and accessible tokens are configured for full module implementation. All cards below display mock preview structures.
            </div>
          </div>
        </div>
        <Badge variant="default" withDot={false}>
          Design System v1.0
        </Badge>
      </div>

      {/* Operational Module Preview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-5)',
        }}
      >
        {/* Module 1: Timetables Preview */}
        <Card hoverable>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Academic Timetables</CardTitle>
              <CardDescription>Batch & lecture allocations (Preview)</CardDescription>
            </CardTitleGroup>
            <Badge variant="info">Active Semester</Badge>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2-5)' }}>
                  <BookOpen size={16} color="var(--accent-text)" />
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                      CSE 3rd Year • Section A
                    </div>
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                      Algorithms Lab • Hall LH-102
                    </div>
                  </div>
                </div>
                <Badge variant="success">Assigned</Badge>
              </div>

              <div
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2-5)' }}>
                  <Clock size={16} color="var(--accent-text)" />
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                      ECE 2nd Year • Section B
                    </div>
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                      Signals & Systems • Hall LH-204
                    </div>
                  </div>
                </div>
                <Badge variant="default">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              Timetable module will connect to backend API
            </span>
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </CardFooter>
        </Card>

        {/* Module 2: Mid-Semester Exams Preview */}
        <Card hoverable>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Mid-Sem Examinations</CardTitle>
              <CardDescription>Session coordination preview</CardDescription>
            </CardTitleGroup>
            <Badge variant="warning">Upcoming Phase</Badge>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                    Slot Allocation Schema
                  </span>
                  <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-warning-text)' }}>
                    Draft Window
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Conflict-free room and invigilation matrix ready for scheduling engine binding.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <div
                  style={{
                    flex: 1,
                    padding: 'var(--space-2-5)',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                    08
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                    Exam Halls
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: 'var(--space-2-5)',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--accent-text)' }}>
                    24
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                    Sessions
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              Automated conflict checks enabled
            </span>
            <Button variant="ghost" size="sm">
              Review
            </Button>
          </CardFooter>
        </Card>

        {/* Module 3: Venue & Spectra Bookings Preview */}
        <Card hoverable>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Venue & Spectra Bookings</CardTitle>
              <CardDescription>Auditoriums, labs & annual fest spaces</CardDescription>
            </CardTitleGroup>
            <Badge variant="success">Booking Desk</Badge>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2-5)' }}>
                  <Building size={16} color="var(--accent-text)" />
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                      CIT Central Auditorium
                    </div>
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                      Spectra Technical Keynote
                    </div>
                  </div>
                </div>
                <Badge variant="warning">Approval Pending</Badge>
              </div>

              <div
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2-5)' }}>
                  <MapPin size={16} color="var(--accent-text)" />
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                      Seminar Complex • Room B
                    </div>
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                      Faculty Review Board
                    </div>
                  </div>
                </div>
                <Badge variant="success">Confirmed</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              Spectra event workflow compatible
            </span>
            <Button variant="ghost" size="sm">
              Queue
            </Button>
          </CardFooter>
        </Card>

        {/* Module 4: Disruptions & Rescheduling Preview */}
        <Card hoverable>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Disruption Manager</CardTitle>
              <CardDescription>Rescheduling & venue relocation</CardDescription>
            </CardTitleGroup>
            <Badge variant="danger">Disruption Protocol</Badge>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--color-danger-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-danger-border)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-2-5)',
                }}
              >
                <AlertTriangle size={16} color="var(--color-danger-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--color-danger-text)' }}>
                    Sample Notice: Lab 3 Maintenance
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Automated conflict resolution will relocate affected slots to Lab 5.
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Reschedule Pipeline Health
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <CheckCircle2 size={14} color="var(--color-success-text)" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                    0 Unresolved Conflicts
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              Ready for real-time disruption events
            </span>
            <Button variant="ghost" size="sm">
              Logs
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Design System Primitives Showcase */}
      <Card elevated>
        <CardHeader>
          <CardTitleGroup>
            <CardTitle>UI Primitives Demonstration</CardTitle>
            <CardDescription>
              Interactive verification of buttons, forms, status badges, skeletons, and empty states.
            </CardDescription>
          </CardTitleGroup>
          <Badge variant="default">Token Suite</Badge>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Form Controls Section */}
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                Form Controls & Inputs
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 'var(--space-4)',
                }}
              >
                <Input
                  label="Search Operations"
                  placeholder="Filter by course code or venue..."
                  icon={Search}
                  value={sampleSearch}
                  onChange={(e) => setSampleSearch(e.target.value)}
                  helperText="Live query simulation"
                />

                <Select
                  label="Academic Department"
                  placeholder="Select department..."
                  value={sampleDept}
                  onChange={(e) => setSampleDept(e.target.value)}
                  options={[
                    { value: 'cse', label: 'Computer Science & Engineering' },
                    { value: 'ece', label: 'Electronics & Communication' },
                    { value: 'me', label: 'Mechanical Engineering' },
                    { value: 'civil', label: 'Civil Engineering' },
                  ]}
                  helperText="Filter scheduling scope"
                />

                <Input
                  label="Room Allocation Code"
                  placeholder="e.g. CR-401"
                  required
                  error={sampleSearch.length > 15 ? 'Query exceeds maximum preview length' : undefined}
                  helperText={!sampleSearch.length || sampleSearch.length <= 15 ? 'Format: [Building]-[Room]' : undefined}
                />
              </div>
            </div>

            {/* Status Badges Section */}
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                Semantic Badges & Indicators
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <Badge variant="default">Default Neutral</Badge>
                <Badge variant="info">Info / In-Progress</Badge>
                <Badge variant="success">Success / Confirmed</Badge>
                <Badge variant="warning">Warning / Pending Review</Badge>
                <Badge variant="danger">Danger / Disruption Conflict</Badge>
              </div>
            </div>

            {/* Button Hierarchy Section */}
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                Button Hierarchy & States
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger Action</Button>
                <Button variant="primary" isLoading>
                  Loading
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            {/* Loading & Skeleton Section */}
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                Loading & Skeletons
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 'var(--space-4)',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <LoadingSpinner size="sm" />
                  <LoadingSpinner size="md" />
                  <LoadingSpinner size="lg" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Scalable Spinners
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <Skeleton width="100%" height="16px" />
                  <Skeleton width="70%" height="16px" />
                </div>
              </div>
            </div>

            {/* Empty State Component Verification */}
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                Empty State Primitive
              </h4>
              <EmptyState
                icon={Calendar}
                title="No Disruptions Reported"
                description="All academic lecture halls and examination centers for Chilika Institute of Technology are operating on schedule."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demonstration Modal */}
      <Modal
        isOpen={modalDisclosure.isOpen}
        onClose={modalDisclosure.close}
        title="CIT Operational Modal Preview"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={modalDisclosure.close}>
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert('Design system verified successfully!');
                modalDisclosure.close();
              }}
            >
              Confirm Selection
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p>
            This modal verifies dialog accessibility, backdrop blur, ESC key dismiss, and body scroll locking.
          </p>
          <Input
            label="Sample Modal Field"
            placeholder="Type verification input..."
            helperText="Demonstrates nested form controls inside an accessible dialog"
          />
        </div>
      </Modal>
    </div>
  );
}

export default DashboardPreviewPage;
