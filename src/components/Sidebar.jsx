import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const ICONS = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  ),
  overview: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  timetables: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
    </svg>
  ),
  leave: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

export default function Sidebar({ mobileOpen, onClose }) {
  const { activeView, setActiveView, leaveRecords, getTodayStats } = useApp();
  const { currentUser } = useAuth();
  const stats = getTodayStats();

  const handleNav = (id) => {
    setActiveView(id);
    onClose?.();
  };

  const navItems = currentUser?.role === 'teacher' ? [
    { id: 'dashboard', label: 'My Dashboard', icon: ICONS.dashboard },
    { id: 'timetables', label: 'All Timetables', icon: ICONS.timetables },
    { id: 'help', label: 'Help & Manual', icon: ICONS.help },
  ] : [
    { id: 'overview', label: 'Overview', icon: ICONS.overview },
    { id: 'timetables', label: 'Timetables', icon: ICONS.timetables },
    { id: 'leave', label: 'Leave & Substitution', icon: ICONS.leave, badge: true },
    { id: 'help', label: 'Help & Manual', icon: ICONS.help },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">SmartTT</div>
            <div className="logo-sub">School Timetable System</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="section-label" style={{ color: 'rgba(160,174,192,0.6)', padding: '0 4px', marginBottom: '6px' }}>
            MAIN MENU
          </div>
          {navItems.map(item => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              {item.icon}
              <span className="nav-label">{item.label}</span>
              {item.badge && stats.teachersOnLeave > 0 && (
                <span className="nav-badge">{stats.teachersOnLeave}</span>
              )}
            </button>
          ))}

          <div className="sidebar-divider" />

          {/* Quick Stats */}
          <div style={{ padding: '6px 8px' }}>
            <div className="section-label" style={{ color: 'rgba(160,174,192,0.6)' }}>TODAY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {[
                { label: 'Present', val: stats.teachersPresent, color: '#10b981' },
                { label: 'On Leave', val: stats.teachersOnLeave, color: '#ef4444' },
                { label: 'Subs Arranged', val: stats.subsToday, color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--sidebar-text)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
                    {s.label}
                  </div>
                  <span style={{ fontWeight: 700, color: 'white' }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer User */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar" style={{ background: currentUser?.bg || 'var(--sidebar-bg)', color: currentUser?.text || 'white' }}>
              {currentUser?.initials || 'U'}
            </div>
            <div>
              <div className="user-name">{currentUser?.name || 'User'}</div>
              <div className="user-role">{currentUser?.role === 'admin' ? 'School Administrator' : 'Teacher Portal'}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
