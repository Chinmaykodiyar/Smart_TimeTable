import React from 'react';
import './Dashboard.css';
import {
  todayScheduleSummary,
  staffAvailability,
  smartResolutionFeed,
} from '../data/mockData';

const barHeights = [55, 70, 45, 90, 60, 75, 50, 85, 65, 40, 80, 95, 70, 55];

export default function Dashboard() {
  const { date, totalSlots, covered, open, pending, operationalPct } = todayScheduleSummary;

  return (
    <div className="dash-page">
      {/* Page Header */}
      <div className="dash-page-header">
        <h1>Administrator<br />Dashboard</h1>
        <p>Monitoring institution-wide scheduling efficiency and staff availability for {date}.</p>
      </div>

      {/* Today's Schedule Card */}
      <div className="card">
        <div className="schedule-card-header">
          <div className="schedule-card-header-left">
            <div className="schedule-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <span className="schedule-card-title">Today's Schedule</span>
          </div>
          <div className="operational-badge">
            <span className="pulse-dot" />
            {operationalPct}% Operational
          </div>
        </div>

        <div className="schedule-stats-grid">
          <div className="stat-cell blue">
            <div className="stat-label">Total Slots</div>
            <div className="stat-value">{totalSlots}</div>
          </div>
          <div className="stat-cell green">
            <div className="stat-label">Covered</div>
            <div className="stat-value">{covered}</div>
          </div>
          <div className="stat-cell red">
            <div className="stat-label">Open</div>
            <div className="stat-value">{open}</div>
          </div>
          <div className="stat-cell orange">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pending}</div>
          </div>
        </div>

        {/* Mini Chart Preview */}
        <div className="schedule-preview">
          <div className="schedule-preview-inner">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="preview-bar"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Staff Availability */}
      <div className="card">
        <div className="section-heading">
          <div className="section-heading-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <h2>Staff Availability</h2>
        </div>

        <div className="staff-list">
          {staffAvailability.map(staff => (
            <div key={staff.id} className="staff-row" id={`staff-${staff.id.toLowerCase()}`}>
              <div className="staff-row-left">
                <div
                  className="avatar"
                  style={{ background: staff.color, color: staff.textColor }}
                >
                  {staff.id}
                </div>
                <div>
                  <div className="staff-name">{staff.name}</div>
                  <div className="staff-status">{staff.status}</div>
                </div>
              </div>
              <svg className="staff-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          ))}
        </div>
        <button className="view-all-btn" id="btn-view-all-requests">View All Requests</button>
      </div>

      {/* Smart Resolution Feed */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Smart Resolution Feed</span>
          <div className="ai-badge">AI-POWERED ENGINE ACTIVE</div>
        </div>

        <table className="resolution-table">
          <thead>
            <tr>
              <th>CLASS / SUBJECT</th>
              <th>ABSENT STAFF</th>
              <th>SUBSTITUTED BY</th>
            </tr>
          </thead>
          <tbody>
            {smartResolutionFeed.map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{row.class}</td>
                <td style={{ color: 'var(--color-text-sub)' }}>{row.absent}</td>
                <td>
                  {row.substitute === 'Searching…'
                    ? <span className="sub-searching">Searching…</span>
                    : <span className="sub-name">{row.substitute}</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
