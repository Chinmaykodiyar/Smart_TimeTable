import React from 'react';
import { useApp } from '../context/AppContext';
import { getTodayKey, getDayKey } from '../utils/substituteEngine';
import { timetables as staticTimetables } from '../data/initialData';
import { PERIODS, DAYS, DAY_SHORT, DAY_LABELS } from '../data/initialData';

// Subject color map
const SUBJECT_COLORS = {
  Maths:     { bg:'#dbeafe', text:'#1e40af', border:'#3b82f6' },
  English:   { bg:'#dcfce7', text:'#166534', border:'#22c55e' },
  Hindi:     { bg:'#fce7f3', text:'#be185d', border:'#ec4899' },
  Science:   { bg:'#ede9fe', text:'#6d28d9', border:'#8b5cf6' },
  EVS:       { bg:'#ccfbf1', text:'#0f766e', border:'#14b8a6' },
  Art:       { bg:'#ffedd5', text:'#c2410c', border:'#f97316' },
  PE:        { bg:'#fef9c3', text:'#854d0e', border:'#eab308' },
  Computers: { bg:'#f0f9ff', text:'#075985', border:'#0ea5e9' },
  Default:   { bg:'#f1f5f9', text:'#475569', border:'#94a3b8' },
};

function subjectStyle(subject) {
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS.Default;
}

export default function Overview() {
  const { teachers, classes, getEffectiveSchedule, getTeacherStatus, getTodayStats, setActiveView } = useApp();
  const todayKey = getTodayKey();
  const stats = getTodayStats();

  const today = new Date();
  const dayName = todayKey ? DAY_LABELS[todayKey] : 'Today';

  // Overview cards: 4 stat cards
  const statCards = [
    {
      label: 'Total Classes',
      value: 5,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      iconBg: 'var(--color-primary-light)', iconColor: 'var(--color-primary)',
      delta: 'Std I – Std V',
    },
    {
      label: 'Teachers Present',
      value: stats.teachersPresent,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      ),
      iconBg: 'var(--color-success-bg)', iconColor: 'var(--color-success)',
      delta: `of ${stats.totalTeachers} total`,
      deltaColor: 'var(--color-success)',
    },
    {
      label: 'On Leave Today',
      value: stats.teachersOnLeave,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
      iconBg: stats.teachersOnLeave > 0 ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
      iconColor: stats.teachersOnLeave > 0 ? 'var(--color-danger)' : 'var(--color-success)',
      delta: stats.teachersOnLeave > 0 ? `${stats.subsToday} substitutions arranged` : 'All clear',
      deltaColor: stats.teachersOnLeave > 0 ? 'var(--color-warning)' : 'var(--color-success)',
    },
    {
      label: 'Periods Today',
      value: todayKey ? 5 * 6 : 0,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      iconBg: 'var(--color-info-bg)', iconColor: 'var(--color-info)',
      delta: '6 periods × 5 classes',
    },
  ];

  return (
    <div className="page-body animate-in">
      {/* Date Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'var(--text-main)', marginBottom:'4px' }}>
          Good Morning, Principal 👋
        </h1>
        <p style={{ color:'var(--text-sub)', fontSize:'0.875rem' }}>
          Here's what's happening across all classes on <strong>{dayName}, {today.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</strong>
        </p>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>
              {s.icon}
            </div>
            <div>
              <div className="stat-val">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
              {s.delta && (
                <div className="stat-delta" style={{ color: s.deltaColor || 'var(--text-muted)' }}>
                  {s.delta}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 5 Class Overview Grid */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:700 }}>📋 Today's Class Overview</h2>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveView('timetables')} id="btn-view-all-timetables">
            View Full Timetables →
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'16px' }}>
          {classes.map(cls => {
            if (!todayKey) return null;
            const schedule = getEffectiveSchedule(cls.id, todayKey);
            const subsCount = schedule.filter(p => p.isSubstituted).length;

            return (
              <div className="card" key={cls.id} style={{ padding:'16px' }}>
                {/* Class Header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'0.95rem' }}>{cls.name}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{cls.room} • {cls.students} students</div>
                  </div>
                  {subsCount > 0
                    ? <span className="badge badge-warning">{subsCount} sub{subsCount>1?'s':''}</span>
                    : <span className="badge badge-success">On track</span>
                  }
                </div>

                {/* Period chips */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:'5px' }}>
                  {schedule.map((period, pi) => {
                    const sc = subjectStyle(period.subject);
                    return (
                      <div
                        key={pi}
                        title={`P${pi+1}: ${period.subject}${period.isSubstituted ? ' (Sub)' : ''}`}
                        style={{
                          background: period.isSubstituted ? 'var(--color-warning-bg)' : sc.bg,
                          color: period.isSubstituted ? '#92400e' : sc.text,
                          border: `1px solid ${period.isSubstituted ? '#fcd34d' : sc.border}`,
                          borderRadius:'var(--radius-sm)',
                          padding:'4px 8px',
                          fontSize:'0.68rem',
                          fontWeight:600,
                          display:'flex', alignItems:'center', gap:'4px',
                        }}
                      >
                        <span style={{ opacity:0.6, fontSize:'0.6rem' }}>P{pi+1}</span>
                        {period.subject}
                        {period.isSubstituted && <span style={{ opacity:0.7 }}>⚡</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Teacher Roster + Activity Feed */}
      <div className="responsive-grid-2">

        {/* Teacher Roster */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon" style={{ background:'var(--color-primary-light)', color:'var(--color-primary)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              Teacher Roster
            </div>
            <span className="badge badge-neutral">{dayName}</span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
            {teachers.map(t => {
              const { status } = getTeacherStatus(t.id);
              return (
                <div key={t.id} style={{
                  display:'flex', alignItems:'center', gap:'10px',
                  padding:'9px 6px', borderRadius:'var(--radius-sm)',
                  borderBottom:'1px solid var(--card-border)',
                  transition:'background 0.15s',
                }}>
                  <div className="avatar" style={{ background:t.bg, color:t.text, width:32, height:32, fontSize:'0.68rem' }}>
                    {t.initials}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'0.82rem', fontWeight:600 }}>{t.name}</div>
                    <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>{t.subjects.join(' · ')}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                    <div className={`status-dot ${status === 'present' ? 'status-present' : 'status-leave'}`} />
                    <span style={{ fontSize:'0.7rem', color: status === 'present' ? 'var(--color-success)' : 'var(--color-danger)', fontWeight:600 }}>
                      {status === 'present' ? 'Present' : 'On Leave'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Schedule Heatmap */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon" style={{ background:'#ede9fe', color:'#7c3aed' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              Weekly Period Load
            </div>
          </div>

          <div className="table-wrap">
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.75rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign:'left', padding:'6px 8px', color:'var(--text-muted)', fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'2px solid var(--card-border)' }}>Teacher</th>
                  {DAYS.map(d => (
                    <th key={d} style={{
                      padding:'6px 6px', color: d === todayKey ? 'var(--color-primary)' : 'var(--text-muted)',
                      fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.06em', textTransform:'uppercase',
                      borderBottom:'2px solid var(--card-border)', textAlign:'center',
                      background: d === todayKey ? 'var(--color-primary-light)' : 'transparent',
                    }}>
                      {DAY_SHORT[d]}
                    </th>
                  ))}
                  <th style={{ textAlign:'center', padding:'6px 8px', color:'var(--text-muted)', fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'2px solid var(--card-border)' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(t => {
                  const dayLoads = DAYS.map(day => {
                    let count = 0;
                    classes.forEach(cls => {
                      const daySchedule = staticTimetables[cls.id]?.[day] || [];
                      daySchedule.forEach(p => { if (p.teacherId === t.id) count++; });
                    });
                    return count;
                  });
                  const total = dayLoads.reduce((a, b) => a + b, 0);

                  return (
                    <tr key={t.id}>
                      <td style={{ padding:'8px 8px', borderBottom:'1px solid var(--card-border)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                          <div style={{ width:8, height:8, borderRadius:'50%', background:t.text, flexShrink:0 }} />
                          <span style={{ fontSize:'0.75rem', fontWeight:500 }}>{t.name.split(' ').slice(-1)[0]}</span>
                        </div>
                      </td>
                      {dayLoads.map((load, di) => (
                        <td key={di} style={{
                          textAlign:'center', padding:'8px 4px', borderBottom:'1px solid var(--card-border)',
                          background: DAYS[di] === todayKey ? 'rgba(108,99,255,.04)' : 'transparent',
                        }}>
                          <div style={{
                            display:'inline-flex', alignItems:'center', justifyContent:'center',
                            width:24, height:24, borderRadius:'4px', fontSize:'0.72rem', fontWeight:700,
                            background: load === 0 ? '#f1f5f9' : load <= 2 ? '#dbeafe' : load <= 4 ? '#ede9fe' : '#fce7f3',
                            color: load === 0 ? '#94a3b8' : load <= 2 ? '#1d4ed8' : load <= 4 ? '#7c3aed' : '#be185d',
                          }}>
                            {load}
                          </div>
                        </td>
                      ))}
                      <td style={{ textAlign:'center', padding:'8px 8px', borderBottom:'1px solid var(--card-border)', fontWeight:700, color:'var(--text-main)', fontSize:'0.78rem' }}>
                        {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
