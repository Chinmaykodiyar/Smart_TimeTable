import React, { useState } from 'react';
import './Leave.css';
import { recentLeaveRequests, substitutionMap, leaveMetrics } from '../data/mockData';

export default function Leave() {
  const [leaveType, setLeaveType] = useState('Emergency Medical');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [reason, setReason] = useState('');

  const { absent, substitutes } = substitutionMap;
  const { activeSubsToday, automatedPct, efficiencyRate, efficiencyDelta, avgResponseTime } = leaveMetrics;

  return (
    <div className="leave-page">
      <div>
        <h1>Leave &amp; Substitutions</h1>
        <p className="page-subtitle">Submit emergency requests and monitor hour reallocation.</p>
      </div>

      {/* New Emergency Request Button */}
      <button className="new-req-btn" id="btn-new-emergency-request">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        NEW EMERGENCY REQUEST
      </button>

      {/* Quick Submit Form */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-sub)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Quick Submit</span>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="leave-type">Type</label>
          <select
            id="leave-type"
            className="form-select"
            value={leaveType}
            onChange={e => setLeaveType(e.target.value)}
          >
            <option>Emergency Medical</option>
            <option>Personal Leave</option>
            <option>Logistical Delay</option>
            <option>Training</option>
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">Duration</label>
          <div className="time-row">
            <div>
              <input
                id="leave-start-time"
                type="time"
                className="form-time-input"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <input
                id="leave-end-time"
                type="time"
                className="form-time-input"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="leave-reason">Reason Notes</label>
          <textarea
            id="leave-reason"
            className="form-textarea"
            placeholder="Briefly describe the emergency…"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>

        <button className="send-btn" id="btn-send-leave-request">SEND IMMEDIATE REQUEST</button>
      </div>

      {/* Substitution Map */}
      <div className="card">
        <div className="sub-map-header">
          <div className="sub-map-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
            Substitution Map
          </div>
          <span className="filled-badge">100% Filled</span>
        </div>

        <div className="sub-map-body">
          {/* Absent */}
          <div className="sub-absent-col">
            <div className="sub-absent-card">
              <div className="sub-absent-avatar" style={{ background: absent.color, color: absent.tcolor }}>
                {absent.initial}
              </div>
              <div className="sub-absent-name">{absent.name}</div>
              <div className="sub-absent-dept">{absent.dept}</div>
            </div>
          </div>

          {/* Arrow */}
          <div className="sub-arrow-col">
            <div className="arrow-line" />
            <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            <div className="arrow-line" />
          </div>

          {/* Substitutes */}
          <div className="sub-subs-col">
            {substitutes.map((s, i) => (
              <div key={i} className={`sub-candidate ${s.preferred ? 'preferred' : ''}`}>
                <div
                  className="sub-cand-avatar"
                  style={{ background: s.color, color: s.tcolor }}
                >
                  {s.initial}
                </div>
                <div>
                  <div className="sub-cand-name">{s.name}</div>
                  <div className="sub-cand-det">{s.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="sub-ai-note">
          The AI engine can optimise these substitutions based on subject proximity and teacher work content periods.
        </p>
      </div>

      {/* Recent Leave Requests */}
      <div className="card">
        <div className="leave-req-header">
          <h2>Recent Leave Requests</h2>
          <button className="export-btn" id="btn-export-leave-log">Export Log</button>
        </div>
        <div className="req-list">
          {recentLeaveRequests.map(req => (
            <div key={req.id} className="req-row">
              <div className="avatar" style={{ background: req.color, color: req.tcolor }}>
                {req.initial}
              </div>
              <div className="req-info">
                <div className="req-teacher">{req.teacher}</div>
                <div className="req-type">{req.type}</div>
              </div>
              <div className="req-time">{req.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card blue">
          <div className="metric-main large">{activeSubsToday}</div>
          <div className="metric-label">Active Subs Today</div>
          <div className="metric-sub">{automatedPct} data is successfully automated</div>
        </div>
        <div className="metric-card">
          <div className="metric-main">{efficiencyRate}%</div>
          <div className="metric-label">Efficiency Rate</div>
          <div className="metric-delta">{efficiencyDelta} from last term</div>
        </div>
      </div>

      <div className="full-metric-card card">
        <div className="full-metric-main">{avgResponseTime}</div>
        <div className="full-metric-sub">Avg. Response Time — From substitution to reallocation</div>
      </div>

      {/* FAB */}
      <button className="fab" id="btn-fab-leave" aria-label="New emergency request">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  );
}
