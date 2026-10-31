import React, { useState, useEffect } from 'react';
import './App.css';
import { AppLayout } from './layouts/AppLayout';
import { LoginModal } from './components/LoginModal';
import {
  LandingPage,
  FacultyNetworkPage,
  FacultyChatPage,
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
      'faculty-chat',
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
  const [chatTargetFaculty, setChatTargetFaculty] = useState(null);
  const [currentUser, setCurrentUser] = useState(getStoredUserProfile);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChatWithFaculty = (facultyName) => {
    setChatTargetFaculty(facultyName);
    handleNavigate('faculty-chat');
  };

  const handleLoginSuccess = (newProfile) => {
    setCurrentUser(newProfile);
    saveStoredUserProfile(newProfile);
    // If on landing page, enter dashboard
    if (activePage === 'landing') {
      handleNavigate('dashboard');
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        setActivePage(hash);
      } else {
        setActivePage('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Show hand-coded, unboxed landing page directly (Intro & Details only, no direct action buttons)
  if (activePage === 'landing') {
    return (
      <>
        <LandingPage
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onNavigate={handleNavigate}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLoginSuccess}
          currentUser={currentUser}
        />
      </>
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
            onStartChat={handleStartChatWithFaculty}
          />
        );
      case 'faculty-chat':
        return (
          <FacultyChatPage
            currentUser={currentUser}
            initialFacultyName={chatTargetFaculty}
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
        return <AiAssistantPage />;
      case 'settings':
        return <SettingsPage />;
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
    <>
      <AppLayout
        activePage={activePage}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onNavigate={handleNavigate}
      >
        {renderCurrentView()}
      </AppLayout>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginSuccess}
        currentUser={currentUser}
      />
    </>
  );
}

export default App;
