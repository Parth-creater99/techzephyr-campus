import React from 'react';
import { LogOut, User, Shield, Lock } from 'lucide-react';

export function SettingsPage({ currentUser, onLogout, onNavigate, onRequireAdmin, onSwitchRole }) {
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
            Faculty &amp; Institutional Profile
          </h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Verified institutional faculty identity and academic scheduling policies
          </span>
        </div>

        
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Faculty Profile Card (Static / Read-Only Institutional Record) */}
        <div className="white-app-card" style={{ gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} color="var(--accent-terracotta)" />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Faculty Profile</h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-sage)', background: 'var(--accent-sage-light)', padding: '3px 8px', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Lock size={11} /> Verified Record
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Full Name
              </span>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-default)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
                {currentUser?.name || 'Dr. A. Sharma'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Institutional Email
              </span>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-default)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                {currentUser?.email || 'a.sharma@cit.edu.in'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Department
              </span>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-default)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                Computer Science &amp; Engineering (CSE)
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Cabin Location
              </span>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-default)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                Faculty Block B &bull; Cabin 204
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Policy Parameters (Static / Read-Only Policy) */}
        <div className="white-app-card" style={{ gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} color="var(--accent-ochre)" />
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Institutional Parameters</h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-sage)', background: 'var(--accent-sage-light)', padding: '3px 8px', borderRadius: 9999, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Lock size={11} /> Locked by Policy
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Academic Term
              </span>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-default)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                AY 2026–27 (Odd Semester)
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Mandatory Lunch Intermission
              </span>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-default)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                12:55 – 13:45 (Locked by CIT Policy)
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Daily Operational Class Window
              </span>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-default)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                P1 to P13 (08:30 – 20:30)
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Teaching Commitment
              </span>
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-card-subtle)', border: '1px solid var(--border-default)', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>
                Full-Time Academic Faculty (4 Courses Assigned)
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (currentUser?.roleType !== 'admin') {
                  onRequireAdmin?.(
                    'Alter Institutional Parameters & Policy',
                    'CIT Institutional Parameters (Mandatory Lunch Intermission 12:55–13:45, Class Window P1–P13, and Term Dates) are locked by Academic Senate Statute. These parameters can only be altered by the Institute Administrator / Academic Dean.'
                  );
                  return;
                }
                alert('Administrator Policy Override Mode: Parameters unlocked for editing.');
              }}
              style={{
                marginTop: 6,
                background: currentUser?.roleType === 'admin' ? 'var(--accent-sage-light)' : 'var(--accent-terracotta-light)',
                color: currentUser?.roleType === 'admin' ? 'var(--accent-sage)' : 'var(--accent-terracotta)',
                border: `1.5px solid ${currentUser?.roleType === 'admin' ? 'var(--accent-sage-border)' : 'var(--accent-terracotta-border)'}`,
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <Lock size={14} />
              <span>{currentUser?.roleType === 'admin' ? 'Dean Override: Parameters Unlocked' : 'Alter Parameters (Admin Clearance Required)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Session Account Bar */}
      <div className="white-app-card" style={{ marginTop: 24, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 18, border: '1.5px solid var(--border-default)', background: 'var(--bg-card)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogOut size={18} color="var(--accent-terracotta)" />
            <h4 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Sign Out of CIT Campus Portal</h4>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
            Currently active session: <strong>{currentUser?.name || 'Faculty Member'}</strong> &bull; {currentUser?.role || 'Lecturer'} ({currentUser?.email || 'a.sharma@cit.edu.in'})
          </p>
        </div>

        <button
          type="button"
          className="settings-logout-btn"
          style={{
            padding: '12px 28px',
            fontSize: 14,
            fontWeight: 800,
            background: 'var(--accent-terracotta)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 12,
            boxShadow: '0 4px 14px rgba(197, 74, 38, 0.3)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
          onClick={handleLogoutClick}
          title="Sign out of your CIT session and return to landing page"
        >
          <LogOut size={17} />
          <span>Log Out of CIT Portal</span>
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
