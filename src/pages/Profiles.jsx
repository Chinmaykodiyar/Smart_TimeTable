import React, { useState } from 'react';
import './Profiles.css';
import { profileData, weeklyAvailability, activeSubstitution } from '../data/mockData';

function AvailSlot({ slot }) {
  if (!slot) return <td><div className="avail-slot empty" /></td>;
  if (slot.type === 'empty') return (
    <td><button className="avail-add-btn" aria-label="Add availability">+</button></td>
  );
  return (
    <td>
      <div className={`avail-slot ${slot.type}`}>
        <span className="avail-slot-label">{slot.label}</span>
        {slot.sub && <span className="avail-slot-sub">{slot.sub}</span>}
      </div>
    </td>
  );
}

export default function Profiles() {
  const [crossDept, setCrossDept] = useState(true);
  const [priorityStandby, setPriorityStandby] = useState(false);

  const { name, role, department, specializations, substitutionsFilled, workloadBalance } = profileData;
  const { times, days, slots } = weeklyAvailability;
  const activeSub = activeSubstitution;

  // Build grid: [time][day] => slot
  const grid = times.map((t, ti) =>
    days.map((d, di) => slots.find(s => s.time === ti && s.day === di) || null)
  );

  return (
    <div className="profiles-page">

      {/* Profile Header */}
      <div className="card">
        <div className="profile-header-card">
          <div className="profile-header-top">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">ER</div>
              <div className="profile-verified">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <div className="profile-info">
              <div className="profile-name">{name}</div>
              <div className="profile-role">{role}</div>
              <div className="profile-dept">{department}</div>
            </div>
            <button className="edit-profile-btn" id="btn-edit-profile">Edit<br />Profile</button>
          </div>
          <div className="profile-specs">
            {specializations.map(s => (
              <span key={s} className="spec-chip">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Substitutions Filled */}
      <div className="card">
        <div className="sub-filled-label">Substitutions Filled</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span className="sub-filled-num">{substitutionsFilled}</span>
          <span className="sub-filled-term">this term</span>
        </div>
        <div className="workload-row">
          <span className="workload-label">Workload Balance</span>
          <span className="workload-pct">{workloadBalance}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${workloadBalance}%` }} />
        </div>
      </div>

      {/* Weekly Availability */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Weekly Availability &amp; Standby</span>
        </div>

        <div className="avail-legend">
          <div className="legend-item"><div className="legend-dot class" /> Regular Class</div>
          <div className="legend-item"><div className="legend-dot standby" /> Standby Duty</div>
          <div className="legend-item"><div className="legend-dot unavail" /> Unavailable</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="avail-table">
            <thead>
              <tr>
                <th>Time</th>
                {days.map(d => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {times.map((t, ti) => (
                <tr key={ti}>
                  <td className="time-cell">{t}</td>
                  {grid[ti].map((slot, di) => <AvailSlot key={di} slot={slot} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Match Settings */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Smart Match Settings</span>
        </div>

        <div className="settings-list">
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-name">Allow Cross-Department</div>
              <div className="setting-desc">Enable for general substitution roles</div>
            </div>
            <label className="toggle" htmlFor="toggle-cross-dept">
              <input
                id="toggle-cross-dept"
                type="checkbox"
                checked={crossDept}
                onChange={e => setCrossDept(e.target.checked)}
              />
              <span className="toggle-track" />
            </label>
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-name">Priority Standby</div>
              <div className="setting-desc">Increase likelihood of selection for extra pay</div>
            </div>
            <label className="toggle" htmlFor="toggle-priority-standby">
              <input
                id="toggle-priority-standby"
                type="checkbox"
                checked={priorityStandby}
                onChange={e => setPriorityStandby(e.target.checked)}
              />
              <span className="toggle-track" />
            </label>
          </div>
        </div>
      </div>

      {/* Active Substitutions */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Active Substitutions</span>
        </div>

        <div className="active-sub-card">
          <div>
            <div className="sub-date-block">
              <div className="sub-date-month">{activeSub.date.split(' ')[0]}</div>
              <div className="sub-date-num">{activeSub.dateNum}</div>
            </div>
          </div>
          <div className="sub-info">
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 600 }}>
              {activeSub.date}
            </div>
            <div className="sub-info-subject">{activeSub.subject}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span
                style={{
                  background: '#dcfce7', color: '#166534',
                  fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px',
                  borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.04em'
                }}
              >
                {activeSub.status}
              </span>
            </div>
            <div className="sub-info-for">Covering for: {activeSub.coveringFor}</div>
          </div>
        </div>

        <button className="view-history-btn" id="btn-view-full-history">View Full History</button>
      </div>
    </div>
  );
}
