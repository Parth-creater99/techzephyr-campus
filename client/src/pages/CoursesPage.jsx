import React, { useState } from 'react';
import { BookOpen, Users, Clock, ArrowUpRight, Search, Filter, Layers, Sparkles, Lock } from 'lucide-react';
import { COURSES_CATALOG, CIT_DATASET_METRICS } from '../services/mockData';

export function CoursesPage({ currentUser, onNavigate, onRequireAdmin, onSwitchRole }) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filteredCourses = COURSES_CATALOG.filter((c) => {
    if (selectedDept !== 'all' && c.dept !== selectedDept) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.dept.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const depts = ['all', 'CSE', 'ECE', 'ME', 'IT', 'EE', 'Math', 'Physics', 'Chemistry', 'Hum', 'General'];

  return (
    <div className="subpage-container animate-fade-in-up">
      {/* Header Banner */}
      <div className="subpage-header-card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 className="section-title" style={{ fontSize: 22, margin: 0 }}>
              CIT Course Catalog
            </h2>
            <span className="cit-period-count-pill" style={{ background: 'var(--accent-terracotta-light)', color: 'var(--accent-terracotta)', border: '1px solid var(--accent-terracotta-border)' }}>
              {COURSES_CATALOG.length} Accredited Courses
            </span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, display: 'block' }}>
            Complete syllabus catalog for Year 1 (Sections A–D) and Years 2 &amp; 3 across 5 engineering branches.
          </span>
        </div>

        <button
          type="button"
          className="app-btn-lime"
          onClick={() => onNavigate?.('timetable')}
        >
          <span>View Master Schedule</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="subpage-header-card" style={{ marginTop: 16 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="app-input-field"
            style={{ paddingLeft: 38, borderRadius: 9999 }}
            placeholder="Search 62 courses by code, title, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {depts.map((d) => (
            <button
              key={d}
              type="button"
              className={`dept-pill-btn ${selectedDept === d ? 'active' : ''}`}
              onClick={() => setSelectedDept(d)}
            >
              {d === 'all' ? 'All (62)' : d}
            </button>
          ))}
        </div>
      </div>

      {/* 62 Courses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 18, marginTop: 20 }}>
        {filteredCourses.map((c) => (
          <div key={c.code} className="white-app-card animate-card-lift" style={{ gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', background: 'var(--accent-terracotta)', padding: '2px 8px', borderRadius: 4 }}>
                {c.code}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                {c.dept} &bull; {c.credits} Credits
              </span>
            </div>

            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {c.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                Format: <strong>{c.type}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
              <button
                type="button"
                className="app-btn-outline"
                style={{ padding: '6px 12px', fontSize: 12 }}
                onClick={() => onNavigate?.('timetable')}
              >
                Find in Timetable &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;
