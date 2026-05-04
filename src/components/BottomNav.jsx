import React from 'react';
import './BottomNav.css';

function IconDashboard({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}

function IconTimetable({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
      {active ? <path d="M8 14h2M12 14h4M8 17h2" strokeWidth="2.5"/> : null}
    </svg>
  );
}

function IconLeave({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  );
}

function IconProfiles({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}

export default function BottomNav({ activeTab, setActiveTab }) {
  const isActive = (id) => activeTab === id;

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      <button
        id="nav-dashboard"
        className={`nav-item ${isActive('dashboard') ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
        aria-label="Dashboard"
        aria-current={isActive('dashboard') ? 'page' : undefined}
      >
        <IconDashboard active={isActive('dashboard')} />
        <span className="nav-label">Dashboard</span>
      </button>

      <button
        id="nav-timetable"
        className={`nav-item ${isActive('timetable') ? 'active' : ''}`}
        onClick={() => setActiveTab('timetable')}
        aria-label="Timetable"
        aria-current={isActive('timetable') ? 'page' : undefined}
      >
        <IconTimetable active={isActive('timetable')} />
        <span className="nav-label">Timetable</span>
      </button>

      <button
        id="nav-leave"
        className={`nav-item ${isActive('leave') ? 'active' : ''}`}
        onClick={() => setActiveTab('leave')}
        aria-label="Leave"
        aria-current={isActive('leave') ? 'page' : undefined}
      >
        <IconLeave active={isActive('leave')} />
        <span className="nav-label">Leave</span>
      </button>

      <button
        id="nav-profiles"
        className={`nav-item ${isActive('profiles') ? 'active' : ''}`}
        onClick={() => setActiveTab('profiles')}
        aria-label="Profiles"
        aria-current={isActive('profiles') ? 'page' : undefined}
      >
        <IconProfiles active={isActive('profiles')} />
        <span className="nav-label">Profiles</span>
      </button>
    </nav>
  );
}
