import React, { useState, useEffect } from 'react';
import './App.css';
import { AppLayout } from './layouts/AppLayout';
import {
  LandingPage,
  FacultyNetworkPage,
  FacultyDashboardPage,
  CoursesPage,
  TimetableViewerPage,
  VenueBookingsPage,
  SpectraApprovalsPage,
  ReschedulingPage,
  AiAssistantPage,
  SettingsPage,
} from './pages';
import {
  AdminAccessNoticeModal,
} from './components';
import {
  getStoredUserProfile,
  saveStoredUserProfile,
} from './services/mockData';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const APP_ROLE_PROFILES = {
  faculty: {
    id: 'faculty',
    label: 'Lecturer / Faculty',
    name: 'Dr. A. Sharma',
    email: 'a.sharma@cit.edu.in',
    dept: 'CSE',
    role: 'Lecturer • Dept. of CSE',
    roleType: 'faculty',
    avatarInitials: 'AS',
    cabin: 'Faculty Block B • Cabin 204',
    badge: 'Lecturer',
    isLoggedIn: true,
  },
  admin: {
    id: 'admin',
    label: 'Institute Administrator / Dean',
    name: 'Prof. M. R. Patnaik',
    email: 'dean.academics@cit.edu.in',
    dept: 'Admin',
    role: 'Institute Administrator & Academic Dean',
    roleType: 'admin',
    avatarInitials: 'MP',
    cabin: 'Administrative Block • Room 101',
    badge: 'Institute Admin',
    isLoggedIn: true,
  },
  student: {
    id: 'student',
    label: 'Student Portal',
    name: 'Ananya Verma',
    email: 'ananya.v@cit.edu.in',
    dept: 'CSE',
    role: 'Student • B.Tech CSE (6th Sem)',
    roleType: 'student',
    avatarInitials: 'AV',
    cabin: 'Hostel Block C • Room 312',
    badge: 'Roll: CS-084',
    isLoggedIn: true,
  },
};

export function App() {
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '').trim();
    const validPages = [
      'landing',
      'dashboard',
      'timetable',
      'faculty-network',
      'courses',
      'venues',
      'spectra',
      'notifications',
      'rescheduling',
      'ai-assistant',
      'settings',
    ];
    return validPages.includes(hash) ? hash : 'landing';
  };

  const [activePage, setActivePage] = useState(getInitialPage);
  const [currentUser, setCurrentUser] = useState(() => {
    const profile = getStoredUserProfile();
    // Default to logged-in faculty / lecturer
    return {
      ...APP_ROLE_PROFILES.faculty,
      ...profile,
      roleType: profile?.roleType || 'faculty',
      isLoggedIn: true,
    };
  });

  // Admin Restriction Notice Modal State
  const [adminNoticeState, setAdminNoticeState] = useState({
    isOpen: false,
    actionName: '',
    restrictionReason: '',
  });

  // Role Switch Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const handleNavigate = (pageId) => {
    // If user somehow triggers faculty-chat, redirect to faculty-network
    const targetPage = pageId === 'faculty-chat' ? 'faculty-network' : pageId;
    setActivePage(targetPage);
    window.location.hash = targetPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    const loggedOutUser = {
      name: 'Guest Faculty',
      email: '',
      dept: 'CSE',
      role: 'Guest',
      roleType: 'faculty',
      avatarInitials: 'GF',
      isLoggedIn: false,
    };
    setCurrentUser(loggedOutUser);
    saveStoredUserProfile(loggedOutUser);
    handleNavigate('landing');
  };

  const handleEnterPortal = (customProfile) => {
    let activeProfile;
    if (customProfile && customProfile.roleType) {
      activeProfile = { ...customProfile, isLoggedIn: true };
    } else if (customProfile && customProfile.id && APP_ROLE_PROFILES[customProfile.id]) {
      activeProfile = {
        ...APP_ROLE_PROFILES[customProfile.id],
        ...customProfile,
        isLoggedIn: true,
      };
    } else {
      activeProfile = { ...APP_ROLE_PROFILES.faculty, isLoggedIn: true };
    }

    setCurrentUser(activeProfile);
    saveStoredUserProfile(activeProfile);
    handleNavigate('dashboard');
  };

  // Switch between Lecturer and Administrator mode
  const handleSwitchRole = (targetRoleKey) => {
    const key =
      targetRoleKey || (currentUser?.roleType === 'admin' ? 'faculty' : 'admin');
    const newProfile = APP_ROLE_PROFILES[key] || APP_ROLE_PROFILES.faculty;
    setCurrentUser(newProfile);
    saveStoredUserProfile(newProfile);
    setAdminNoticeState((prev) => ({ ...prev, isOpen: false }));

    setToastMessage({
      title: `Active Role: ${newProfile.label}`,
      subtitle: `Signed in as ${newProfile.name} • ${newProfile.role}`,
      isAdmin: newProfile.roleType === 'admin',
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Institutional RBAC Check: Trigger notice if user is not Admin
  const handleRequireAdmin = (actionName, restrictionReason) => {
    if (currentUser?.roleType === 'admin') {
      return true; // Clearance granted!
    }

    setAdminNoticeState({
      isOpen: true,
      actionName: actionName || 'Administrative Action',
      restrictionReason:
        restrictionReason ||
        'This action can only be accessed by the Institute Administrator or Academic Dean.',
    });
    return false; // Access restricted
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && hash !== 'faculty-chat') {
        setActivePage(hash);
      } else if (hash === 'faculty-chat') {
        setActivePage('faculty-network');
      } else {
        setActivePage('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Landing page view
  if (activePage === 'landing') {
    return (
      <LandingPage
        currentUser={currentUser}
        onEnterPortal={handleEnterPortal}
        onNavigate={handleNavigate}
      />
    );
  }

  const renderCurrentView = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <FacultyDashboardPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRequireAdmin={handleRequireAdmin}
            onSwitchRole={handleSwitchRole}
          />
        );
      case 'timetable':
        return (
          <TimetableViewerPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRequireAdmin={handleRequireAdmin}
            onSwitchRole={handleSwitchRole}
          />
        );
      case 'faculty-network':
        return (
          <FacultyNetworkPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRequireAdmin={handleRequireAdmin}
            onSwitchRole={handleSwitchRole}
          />
        );
      case 'courses':
        return (
          <CoursesPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRequireAdmin={handleRequireAdmin}
            onSwitchRole={handleSwitchRole}
          />
        );
      case 'venues':
        return (
          <VenueBookingsPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRequireAdmin={handleRequireAdmin}
            onSwitchRole={handleSwitchRole}
          />
        );
      case 'spectra':
        return (
          <SpectraApprovalsPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRequireAdmin={handleRequireAdmin}
            onSwitchRole={handleSwitchRole}
          />
        );
      case 'notifications':
      case 'rescheduling':
        return (
          <ReschedulingPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRequireAdmin={handleRequireAdmin}
            onSwitchRole={handleSwitchRole}
          />
        );
      case 'ai-assistant':
        return (
          <AiAssistantPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRequireAdmin={handleRequireAdmin}
            onSwitchRole={handleSwitchRole}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            onRequireAdmin={handleRequireAdmin}
            onSwitchRole={handleSwitchRole}
          />
        );
      default:
        return (
          <FacultyDashboardPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRequireAdmin={handleRequireAdmin}
            onSwitchRole={handleSwitchRole}
          />
        );
    }
  };

  return (
    <>
      <AppLayout
        activePage={activePage}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      >
        {renderCurrentView()}
      </AppLayout>

      {/* Institutional Admin-Only Clearance Restriction Notice Modal */}
      <AdminAccessNoticeModal
        isOpen={adminNoticeState.isOpen}
        onClose={() => setAdminNoticeState((prev) => ({ ...prev, isOpen: false }))}
        onSwitchToAdmin={() => handleSwitchRole('admin')}
        actionName={adminNoticeState.actionName}
        restrictionReason={adminNoticeState.restrictionReason}
        currentUser={currentUser}
      />

      {/* Role Switch Confirmation Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 10000,
            background: toastMessage.isAdmin ? '#3a2216' : '#faf6ef',
            color: toastMessage.isAdmin ? '#faf6ef' : '#3a2216',
            border: `2px solid ${toastMessage.isAdmin ? '#c54a26' : '#db822a'}`,
            borderRadius: 14,
            padding: '12px 20px',
            boxShadow: '0 12px 32px rgba(58, 34, 22, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            animation: 'featureMotionIn 0.25s ease-out',
          }}
        >
          {toastMessage.isAdmin ? (
            <ShieldCheck size={22} color="#c54a26" />
          ) : (
            <UserCheck size={22} color="#db822a" />
          )}
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800 }}>
              {toastMessage.title}
            </div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
              {toastMessage.subtitle}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
