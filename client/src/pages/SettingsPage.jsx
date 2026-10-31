import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

export function SettingsPage() {
  const [academicTerm, setAcademicTerm] = useState('2026-odd');
  const [lunchBuffer, setLunchBuffer] = useState('13:00-14:00');
  const [periodDuration, setPeriodDuration] = useState('60');
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = () => {
    setSaveStatus('Faculty preferences updated.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="subpage-container">
      <div className="subpage-header-card">
        <div>
          <h2 className="section-title" style={{ fontSize: 20 }}>
            Faculty & Schedule Settings
          </h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Operating hours, notifications, and teaching preferences
          </span>
        </div>

        <button
          type="button"
          className="app-btn-lime"
          onClick={handleSave}
        >
          <Save size={15} />
          <span>Save Changes</span>
        </button>
      </div>

      {saveStatus && (
        <div style={{ padding: '12px 18px', borderRadius: 12, backgroundColor: 'var(--status-completed-bg)', color: 'var(--status-completed-text)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} />
          <span>{saveStatus}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <div className="white-app-card" style={{ gap: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Faculty Profile</h3>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name</label>
            <input type="text" className="app-select-field" style={{ width: '100%' }} defaultValue="Dr. Ananya Sharma" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Department</label>
            <input type="text" className="app-select-field" style={{ width: '100%' }} defaultValue="Computer Science & Engineering" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Cabin Location</label>
            <input type="text" className="app-select-field" style={{ width: '100%' }} defaultValue="Faculty Block B • Cabin 204" />
          </div>
        </div>

        <div className="white-app-card" style={{ gap: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Institutional Policy Parameters</h3>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Academic Term</label>
            <select
              className="app-select-field"
              style={{ width: '100%' }}
              value={academicTerm}
              onChange={(e) => setAcademicTerm(e.target.value)}
            >
              <option value="2026-odd">AY 2026-27 (Odd Semester)</option>
              <option value="2026-even">AY 2026-27 (Even Semester)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Mandatory Lunch Intermission</label>
            <input type="text" className="app-select-field" style={{ width: '100%' }} defaultValue="13:00 - 14:00 (Locked by CIT Policy)" disabled />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Daily Class Window</label>
            <input type="text" className="app-select-field" style={{ width: '100%' }} defaultValue="P1 to P9 (09:00 - 19:00)" disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
