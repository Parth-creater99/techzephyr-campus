import React, { useState } from 'react';
import { User, Mail, Lock, Building, CheckCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { FACULTY_DATA } from '../services/mockData';
import './LoginModal.css';

export function LoginModal({ isOpen, onClose, onLogin, currentUser }) {
  const [name, setName] = useState(currentUser?.name || 'Dr. A. Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'a.sharma@cit.edu.in');
  const [password, setPassword] = useState('cit@2026');
  const [dept, setDept] = useState(currentUser?.dept || 'CSE');
  const [role, setRole] = useState(currentUser?.role || 'Faculty Member');

  if (!isOpen) return null;

  const handlePresetSelect = (faculty) => {
    setName(faculty.name);
    setEmail(faculty.email);
    setDept(faculty.dept);
  };

  const getInitials = (fullName) => {
    return fullName
      .replace('Dr. ', '')
      .replace('Prof. ', '')
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your full name.');
      return;
    }

    const userProfile = {
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z]/g, '')}@cit.edu.in`,
      dept,
      role,
      avatarInitials: getInitials(name.trim()),
      isLoggedIn: true,
      loginTimestamp: new Date().toISOString(),
    };

    onLogin(userProfile);
    onClose();
  };

  return (
    <div className="login-modal-overlay animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="login-modal-card animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="login-modal-header">
          <div className="login-brand-icon">
            <ShieldCheck size={24} color="#101320" />
          </div>
          <div>
            <h2 className="login-modal-title">CIT Campus Portal Login</h2>
            <p className="login-modal-sub">
              Sign in with your name, institutional email, and password.
            </p>
          </div>
          <button type="button" className="login-close-x" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Quick Demo Faculty Presets */}
        <div className="login-presets-section">
          <span className="presets-label">Quick Faculty Presets (For Judges &amp; Demo):</span>
          <div className="presets-pill-row">
            {FACULTY_DATA.slice(0, 4).map((f) => (
              <button
                key={f.id}
                type="button"
                className={`preset-chip ${name === f.name ? 'active' : ''}`}
                onClick={() => handlePresetSelect(f)}
              >
                {f.name} ({f.dept})
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form-body">
          <div className="login-field-group">
            <label className="login-field-label">
              <User size={14} />
              <span>Full Name (Used Throughout Platform) *</span>
            </label>
            <input
              type="text"
              required
              className="login-input-field"
              placeholder="e.g. Dr. A. Sharma or Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="login-input-hint">
              This name will appear in your welcome bar, timetable signatures, and swap permissions.
            </span>
          </div>

          <div className="login-field-group">
            <label className="login-field-label">
              <Mail size={14} />
              <span>Institutional Email *</span>
            </label>
            <input
              type="email"
              required
              className="login-input-field"
              placeholder="e.g. user@cit.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field-group">
            <label className="login-field-label">
              <Lock size={14} />
              <span>Password *</span>
            </label>
            <input
              type="password"
              required
              className="login-input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-row-2">
            <div className="login-field-group">
              <label className="login-field-label">
                <Building size={14} />
                <span>Department</span>
              </label>
              <select
                className="login-input-field"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="ME">Mechanical (ME)</option>
                <option value="IT">Information Tech (IT)</option>
                <option value="EE">Electrical (EE)</option>
                <option value="Math">Mathematics</option>
              </select>
            </div>

            <div className="login-field-group">
              <label className="login-field-label">
                <span>Account Role</span>
              </label>
              <select
                className="login-input-field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Faculty Member">Faculty Member</option>
                <option value="Head of Department">Head of Department</option>
                <option value="Dean of Academics">Dean of Academics</option>
                <option value="Timetable Committee">Timetable Committee</option>
              </select>
            </div>
          </div>

          <div className="login-actions-footer">
            <button type="button" className="login-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="login-submit-btn">
              <span>Sign In as {name || 'Faculty'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
