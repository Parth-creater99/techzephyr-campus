import React, { useState } from 'react';
import { Save, CheckCircle2, LogOut, User, Shield, Bell, Check } from 'lucide-react';

export function SettingsPage({ currentUser, onLogout, onNavigate }) {
  const [academicTerm, setAcademicTerm] = useState('2026-odd');
  const [saveStatus, setSaveStatus] = useState(null);
  const [fullName, setFullName] = useState(currentUser?.name || 'Dr. A. Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'a.sharma@cit.edu.in');
  const [cabin, setCabin] = useState('Faculty Block B • Cabin 204');

  const handleSave = () => {
    setSaveStatus('Settings updated successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to log out of CIT Campus Portal?')) {
      onLogout?.();
    }
  };

  return (
    <div className="subpage-container animate-fade-in-up">
      {/* Top Header Card */}
      <div className="subpage-header-card">
        <div>
          <h2 className="section-title" style={{ fontSize: 20 }}>
            Faculty &amp; System Settings
          </h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Manage profile preferences, schedule rules, and active session
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            className="app-btn-lime"
            onClick={handleSave}
          >
            <Save size={15} />
            <span>Save Preferences</span>
          </button>

          {/* Clear Logout Button */}
          <button
            type="button"
            className="settings-logout-btn"
            onClick={handleLogoutClick}
            title="Log out of the platform"
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div style={{ padding: '12px 18px', borderRadius: 12, backgroundColor: 'var(--status-completed-bg)', color: 'var(--status-completed-text)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} />
          <span>{saveStatus}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Faculty Profile Card */}
        <div className="white-app-card" style={{ gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} color="#0f172a" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Faculty Profile</h3>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name</label>
            <input
              type="text"
              className="app-select-field"
              style={{ width: '100%' }}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Institutional Email</label>
            <input
              type="email"
              className="app-select-field"
              style={{ width: '100%' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Cabin Location</label>
            <input
              type="text"
              className="app-select-field"
              style={{ width: '100%' }}
              value={cabin}
              onChange={(e) => setCabin(e.target.value)}
            />
          </div>
        </div>

        {/* Institutional Policy Parameters */}
        <div className="white-app-card" style={{ gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} color="#0f172a" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Institutional Parameters</h3>
          </div>

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
            <input type="text" className="app-select-field" style={{ width: '100%' }} defaultValue="12:55 - 13:45 (Locked by CIT Policy)" disabled />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Daily Class Window</label>
            <input type="text" className="app-select-field" style={{ width: '100%' }} defaultValue="P1 to P13 (08:30 - 20:30)" disabled />
          </div>
        </div>
      </div>

      {/* Dedicated Session & Account Danger Zone / Logout */}
      <div className="white-app-card" style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Active Account Session</h4>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Signed in as <strong>{currentUser?.name || 'Faculty Member'}</strong> ({currentUser?.email || 'a.sharma@cit.edu.in'})
          </p>
        </div>

        <button
          type="button"
          className="settings-logout-btn"
          style={{ padding: '10px 22px' }}
          onClick={handleLogoutClick}
        >
          <LogOut size={16} />
          <span>Sign Out / Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
