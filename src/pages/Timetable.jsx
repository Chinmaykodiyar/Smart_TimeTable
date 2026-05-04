import React, { useState } from 'react';
import './Timetable.css';
import { weekDays, timetableEntries, todaySummaryStats } from '../data/mockData';

function ClassCard({ entry }) {
  const accentClass =
    entry.accent === '#f59e0b' ? 'sub' :
    entry.accent === '#22c55e' ? 'green' :
    entry.accent === '#8b5cf6' ? 'purple' : '';

  return (
    <div className={`tt-class-card ${accentClass}`}>
      <div className="tt-card-top">
        <div className="tt-subject">{entry.subject}</div>
        <span
          className="tt-category-badge"
          style={{ background: entry.categoryBg, color: entry.categoryColor }}
        >
          {entry.category}
        </span>
      </div>
      <div className="tt-meta">
        <div className="tt-meta-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          {entry.class} • {entry.room}
        </div>
        <div className="tt-meta-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          {entry.type === 'substitute' ? (
            <>
              <span className="tt-teacher-orig">{entry.originalTeacher}</span>
              &nbsp;
              <span className="tt-teacher-sub">{entry.substituteTeacher}</span>
            </>
          ) : (
            entry.teacher
          )}
        </div>
      </div>
    </div>
  );
}

function BreakRow({ entry }) {
  const icon = entry.icon === 'coffee' ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z"/>
    </svg>
  );

  return (
    <div className="tt-break">
      {icon}
      <span className="tt-break-label">{entry.label}</span>
    </div>
  );
}

export default function Timetable() {
  const [activeDay, setActiveDay] = useState(1); // Tuesday (index 1)
  const { activePeriods, subChanges, totalTeaching, studentsReached } = todaySummaryStats;

  return (
    <div className="tt-page">
      <div className="tt-header">
        <h1>Daily Schedule</h1>

        {/* Date Strip */}
        <div className="date-strip">
          <button className="date-nav-btn" id="btn-prev-week" aria-label="Previous week">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div className="date-chips">
            {weekDays.map((d, i) => (
              <button
                key={d.short}
                id={`date-chip-${d.short.toLowerCase()}`}
                className={`date-chip ${activeDay === i ? 'active' : ''}`}
                onClick={() => setActiveDay(i)}
                aria-pressed={activeDay === i}
              >
                <span className="dc-day">{d.short}</span>
                <span className="dc-num">{d.num}</span>
              </button>
            ))}
          </div>

          <button className="date-nav-btn" id="btn-next-week" aria-label="Next week">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="tt-timeline">
        {timetableEntries.map(entry => (
          <div key={entry.id} className="tt-row">
            <div className="tt-time-col">
              {entry.time}
              {entry.period && <div className="tt-period">{entry.period}</div>}
            </div>
            {entry.type === 'break'
              ? <BreakRow entry={entry} />
              : <ClassCard entry={entry} />
            }
          </div>
        ))}
      </div>

      {/* Today's Summary */}
      <div className="tt-summary">
        <div className="tt-summary-title">Today's Summary</div>
        <div className="tt-summary-desc">
          You have {activePeriods} active periods today with {subChanges} substitution changes noted.
        </div>
        <div className="tt-summary-stats">
          <div className="tt-stat-block">
            <div className="tt-stat-val">{totalTeaching}</div>
            <div className="tt-stat-lbl">Total Teaching</div>
          </div>
          <div className="tt-stat-block">
            <div className="tt-stat-val">{studentsReached}</div>
            <div className="tt-stat-lbl">Students Reached</div>
          </div>
        </div>
      </div>
    </div>
  );
}
