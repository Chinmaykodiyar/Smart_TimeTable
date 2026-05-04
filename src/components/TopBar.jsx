import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getTodayKey, getDayKey } from '../utils/substituteEngine';
import { DAY_LABELS } from '../data/initialData';

const PAGE_META = {
  overview:   { title: 'Overview', subtitle: 'Bird\'s-eye view of all classes and teacher availability' },
  timetables: { title: 'Timetables', subtitle: 'Weekly class schedules for all standards' },
  leave:      { title: 'Leave & Substitution', subtitle: 'Manage teacher leave and auto-assign substitutes' },
};

export default function TopBar({ onHamburger }) {
  const { currentUser, logout } = useAuth();
  const { activeView, getTodayStats } = useApp();
  const meta = PAGE_META[activeView] || PAGE_META.overview;
  const stats = getTodayStats();

  const today = new Date();
  const dayKey = getTodayKey();
  const todayLabel = dayKey
    ? `${DAY_LABELS[dayKey]}, ${today.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}`
    : today.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Hamburger for mobile */}
        <button className="hamburger" onClick={onHamburger} aria-label="Open menu" id="btn-hamburger">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div>
          <div className="topbar-title">{meta.title}</div>
          <div className="topbar-subtitle">{meta.subtitle}</div>
        </div>
      </div>

      <div className="topbar-right">
        {/* Live date */}
        <div style={{
          display:'flex', alignItems:'center', gap:'8px',
          background:'#f8fafc', border:'1px solid #e2e8f0',
          borderRadius:'var(--radius-sm)', padding:'6px 12px',
          fontSize:'0.78rem', color:'var(--text-sub)', fontWeight:500
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          {todayLabel}
        </div>

        {/* Alert chip */}
        {stats.teachersOnLeave > 0 && (
          <div style={{
            display:'flex', alignItems:'center', gap:'6px',
            background:'var(--color-danger-bg)', color:'#991b1b',
            border:'1px solid #fca5a5',
            borderRadius:'var(--radius-sm)', padding:'6px 10px',
            fontSize:'0.75rem', fontWeight:700
          }}>
            <span className="live-dot" style={{ background:'#ef4444' }} />
            {stats.teachersOnLeave} on leave today
          </div>
        )}

        {stats.teachersOnLeave === 0 && (
          <div style={{
            display:'flex', alignItems:'center', gap:'6px',
            background:'var(--color-success-bg)', color:'#065f46',
            borderRadius:'var(--radius-sm)', padding:'6px 10px',
            fontSize:'0.75rem', fontWeight:700
          }}>
            <span className="live-dot" />
            All teachers present
          </div>
        )}

        {/* Logged-in admin info + logout */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', borderLeft:'1px solid #e2e8f0', paddingLeft:'12px' }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--sidebar-bg)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:700 }}>
            {currentUser?.initials || 'AP'}
          </div>
          <button
            id="btn-admin-logout"
            onClick={logout}
            title="Logout"
            style={{ background:'none', border:'1.5px solid #e2e8f0', borderRadius:'var(--radius-sm)', padding:'5px 10px', cursor:'pointer', color:'#64748b', fontSize:'0.75rem', fontWeight:600, display:'flex', alignItems:'center', gap:'4px', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#ef4444';e.currentTarget.style.color='#ef4444';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.color='#64748b';}}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
