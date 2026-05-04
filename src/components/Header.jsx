import React from 'react';
import './Header.css';

const pageTitle = {
  dashboard: { title: 'Administrator Dashboard', subtitle: 'Monitoring institution-wide scheduling efficiency and staff availability' },
  timetable: { title: 'Daily Schedule', subtitle: null },
  leave:     { title: 'Leave & Substitutions', subtitle: 'Submit emergency requests and monitor hour reallocation.' },
  profiles:  { title: null, subtitle: null },
};

export default function Header({ activeTab }) {
  return (
    <header className="app-header">
      <div className="header-logo">
        <div className="header-logo-icon">
          {/* Graduation cap icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <span className="header-logo-text">EduSchedule</span>
      </div>
      <div className="header-avatar" title="Admin User">AU</div>
    </header>
  );
}
