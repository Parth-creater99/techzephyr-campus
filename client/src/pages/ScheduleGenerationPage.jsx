import React, { useState } from 'react';
import {
  Wand2,
  Sliders,
  CheckCircle,
  AlertCircle,
  Cpu,
  Layers,
  Settings2,
  Play,
  RotateCcw,
  Sparkles,
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
  Select,
} from '../components';

export function ScheduleGenerationPage() {
  const [isSolving, setIsSolving] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const handleSimulateRun = () => {
    setIsSolving(true);
    setSimulationResult(null);
    setTimeout(() => {
      setIsSolving(false);
      setSimulationResult({
        totalAllocated: 428,
        conflicts: 0,
        roomEfficiency: '92.4%',
        solveTimeMs: 420,
      });
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <PageHeading
        title="Schedule Generation Engine"
        subtitle="Constraint-based institutional timetable solver configuration and draft generation for Chilika Institute of Technology."
        badge={
          <Badge variant="info" withDot>
            Module In Staging
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="md"
            icon={Wand2}
            isLoading={isSolving}
            onClick={handleSimulateRun}
          >
            Run Solver Simulation
          </Button>
        }
      />

      {/* Module Overview Notice */}
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
          <Cpu size={24} color="var(--accent-text)" />
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
              Backend Solver Engine Architecture
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              This interface configures constraints for the backend timetable generation service. Simulation results below are mock representations.
            </div>
          </div>
        </div>
        <Badge variant="default" withDot={false}>
          Constraint Specification v1.0
        </Badge>
      </div>

      {simulationResult && (
        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            color: 'var(--color-success-text)',
            fontSize: 'var(--text-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'fadeIn var(--transition-fast) forwards',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <CheckCircle size={18} />
            <span>
              Solver completed mock run in {simulationResult.solveTimeMs}ms: {simulationResult.totalAllocated} slots assigned with {simulationResult.conflicts} hard constraint violations.
            </span>
          </div>
          <Badge variant="success" withDot>
            Efficiency: {simulationResult.roomEfficiency}
          </Badge>
        </div>
      )}

      {/* Constraints Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-5)',
        }}
      >
        {/* Card 1: Hard Constraints */}
        <Card elevated>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Mandatory Hard Constraints</CardTitle>
              <CardDescription>Zero-tolerance validation rules</CardDescription>
            </CardTitleGroup>
            <Badge variant="danger" withDot>
              Strict Enforcement
            </Badge>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div
                style={{
                  padding: 'var(--space-2-5)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <CheckCircle size={15} color="var(--color-success-text)" />
                <span>No faculty member assigned to simultaneous rooms</span>
              </div>
              <div
                style={{
                  padding: 'var(--space-2-5)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <CheckCircle size={15} color="var(--color-success-text)" />
                <span>Room capacity must equal or exceed cohort size</span>
              </div>
              <div
                style={{
                  padding: 'var(--space-2-5)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <CheckCircle size={15} color="var(--color-success-text)" />
                <span>Mandatory lunch intermission 13:00 - 14:00 across all batches</span>
              </div>
              <div
                style={{
                  padding: 'var(--space-2-5)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <CheckCircle size={15} color="var(--color-success-text)" />
                <span>Labs must occupy continuous two-period slots</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Soft Optimization Goals */}
        <Card elevated>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>Optimization Objectives</CardTitle>
              <CardDescription>Heuristics for student and faculty convenience</CardDescription>
            </CardTitleGroup>
            <Badge variant="info" withDot>
              Heuristics
            </Badge>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div
                style={{
                  padding: 'var(--space-2-5)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <Sparkles size={15} color="var(--accent-text)" />
                <span>Minimize gap periods between lectures for students</span>
              </div>
              <div
                style={{
                  padding: 'var(--space-2-5)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <Sparkles size={15} color="var(--accent-text)" />
                <span>Cap faculty consecutive lecture hours at maximum 3</span>
              </div>
              <div
                style={{
                  padding: 'var(--space-2-5)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <Sparkles size={15} color="var(--accent-text)" />
                <span>Distribute difficult core theory subjects into morning slots</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ScheduleGenerationPage;
