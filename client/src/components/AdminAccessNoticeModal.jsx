import React from 'react';
import { ShieldAlert, Lock, UserCheck, ArrowRight, X, AlertTriangle, Key } from 'lucide-react';
import './AdminAccessNoticeModal.css';

/**
 * AdminAccessNoticeModal
 * Institutional access restriction notice triggered when a Lecturer/Faculty touches
 * an administrative action reserved for the Institute Administrator / Academic Dean.
 */
export function AdminAccessNoticeModal({
  isOpen,
  onClose,
  onSwitchToAdmin,
  actionName = 'Administrative Action',
  restrictionReason = 'This action can only be accessed by the Institute Administrator or Academic Dean.',
  currentUser,
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Institutional Terracotta / Ochre Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-header-left">
            <div className="admin-modal-icon-wrap">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="admin-modal-title">Access Restricted</h3>
              <div className="admin-modal-sub">
                Institute Administrator Clearance Required
              </div>
            </div>
          </div>
          <button
            type="button"
            className="admin-modal-close-btn"
            onClick={onClose}
            aria-label="Close Notice"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="admin-modal-body">
          {/* Alert Callout */}
          <div className="admin-modal-alert-box">
            <div className="admin-modal-alert-title">
              <Lock size={15} />
              <span>Admin-Only Feature: &ldquo;{actionName}&rdquo;</span>
            </div>
            <p className="admin-modal-alert-desc">
              {restrictionReason}
            </p>
          </div>

          {/* Clearance Level Comparison */}
          <div className="admin-modal-matrix">
            {/* Lecturer / Faculty Profile */}
            <div className="admin-matrix-col current">
              <div className="matrix-col-title faculty-text">
                <UserCheck size={13} />
                <span>Your Active Role</span>
              </div>
              <div className="matrix-col-role">
                {currentUser?.name || 'Dr. A. Sharma'} (Lecturer)
              </div>
              <ul className="matrix-col-perms">
                <li>&bull; View Master Timetables &amp; Venues</li>
                <li>&bull; Propose personal lecture swaps</li>
                <li>&bull; Consult AI Academic Assistant</li>
                <li>&bull; View Course Syllabus Matrix</li>
              </ul>
            </div>

            {/* Admin / Dean Profile */}
            <div className="admin-matrix-col required">
              <div className="matrix-col-title admin-text">
                <Lock size={13} />
                <span>Required Clearance</span>
              </div>
              <div className="matrix-col-role">
                Dean / Institute Administrator
              </div>
              <ul className="matrix-col-perms">
                <li>&bull; Apply System Change Files (.json)</li>
                <li>&bull; Emergency Disruption Re-solve</li>
                <li>&bull; Spectra Event Allotment Approval</li>
                <li>&bull; Institutional Policy Overrides</li>
              </ul>
            </div>
          </div>

          {/* CIT Statute Notice */}
          <div className="admin-modal-statute-note">
            <strong>CIT Academic Protocol 14.3:</strong> Under autonomous governance guidelines,
            systemic timetable overrides and room reassignment files must be authenticated
            by the Academic Dean&rsquo;s office.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-dismiss-btn"
            onClick={onClose}
          >
            Dismiss Notice
          </button>

          <button
            type="button"
            className="admin-switch-btn"
            onClick={() => {
              onSwitchToAdmin?.();
              onClose?.();
            }}
          >
            <Key size={15} />
            <span>Switch to Administrator Mode (Dean)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminAccessNoticeModal;
