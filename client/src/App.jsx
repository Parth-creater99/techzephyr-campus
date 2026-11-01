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
  getStoredUserProfile,
  saveStoredUserProfile,
} from './services/mockData';

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
    // Default to logged-in faculty
    return { ...profile, isLoggedIn: true };
  });

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
      avatarInitials: 'GF',
      isLoggedIn: false,
    };
    setCurrentUser(loggedOutUser);
    saveStoredUserProfile(loggedOutUser);
    handleNavigate('landing');
  };

  const handleEnterPortal = (customProfile) => {
    const activeProfile = (customProfile && customProfile.name)
      ? { ...customProfile, isLoggedIn: true }
      : {
          name: 'Dr. A. Sharma',
          email: 'a.sharma@cit.edu.in',
          dept: 'CSE',
          role: 'Professor & Head • Dept. of CSE',
          avatarInitials: 'AS',
          isLoggedIn: true,
        };
    setCurrentUser(activeProfile);
    saveStoredUserProfile(activeProfile);
    handleNavigate('dashboard');
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
          />
        );
      case 'timetable':
        return (
          <TimetableViewerPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'faculty-network':
        return (
          <FacultyNetworkPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'courses':
        return <CoursesPage onNavigate={handleNavigate} />;
      case 'venues':
        return <VenueBookingsPage />;
      case 'spectra':
        return <SpectraApprovalsPage />;
      case 'notifications':
      case 'rescheduling':
        return (
          <ReschedulingPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        );
      case 'ai-assistant':
        return <AiAssistantPage currentUser={currentUser} onNavigate={handleNavigate} />;
      case 'settings':
        return (
          <SettingsPage
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <FacultyDashboardPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <AppLayout
      activePage={activePage}
      currentUser={currentUser}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderCurrentView()}
    </AppLayout>
  );
}

export default App;
