import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PERIODS, DAYS, DAY_LABELS, DAY_SHORT } from '../data/initialData';
import { getTodayKey } from '../utils/substituteEngine';

const SUBJECT_COLORS = {
  Maths:     '#3b82f6', English:   '#22c55e', Hindi:     '#ec4899',
  Science:   '#8b5cf6', EVS:       '#14b8a6', Art:       '#f97316',
  PE:        '#eab308', Computers: '#0ea5e9', Default:   '#94a3b8',
};

function TimetableGrid({ classId, selectedDay }) {
  const { getEffectiveSchedule, teachers } = useApp();
  const todayKey = getTodayKey();

  const getTeacher = (id) => teachers.find(t => t.id === id);

  const daysToShow = selectedDay === 'all' ? DAYS : [selectedDay];

  return (
    <div className="table-wrap">
      <table className="tt-grid">
        <thead>
          <tr>
            <th className="period-col">Period</th>
            {daysToShow.map(day => (
              <th key={day} style={{
                background: day === todayKey ? 'var(--color-primary-light)' : 'transparent',
                color: day === todayKey ? 'var(--color-primary-dark)' : undefined,
                borderRadius: day === todayKey ? 'var(--radius-sm) var(--radius-sm) 0 0' : undefined,
              }}>
                {DAY_LABELS[day]}
                {day === todayKey && <div style={{ fontSize:'0.55rem', fontWeight:600, color:'var(--color-primary)', marginTop:2 }}>TODAY</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map((period, rowIdx) => {
            if (period.isBreak) {
              return (
                <tr key="break">
                  <td className="period-info">
                    <div className="period-time" style={{ color:'var(--text-muted)' }}>Break</div>
                    <div className="period-num">{period.time}</div>
                  </td>
                  {daysToShow.map(day => (
                    <td key={day} style={{ background: day === todayKey ? 'rgba(108,99,255,.03)' : '#fafbff' }}>
                      <div className="tt-cell break-cell">
                        <span className="tt-break-label">☕ Recess</span>
                      </div>
                    </td>
                  ))}
                </tr>
              );
            }

            const pi = period.id; // numeric period index

            return (
              <tr key={pi}>
                <td className="period-info">
                  <div className="period-time">{period.label}</div>
                  <div className="period-num">{period.time}</div>
                </td>
                {daysToShow.map(day => {
                  const schedule = getEffectiveSchedule(classId, day);
                  const slot = schedule[pi];
                  if (!slot) return <td key={day} />;

                  const originalTeacher = getTeacher(slot.teacherId);
                  const color = SUBJECT_COLORS[slot.subject] || SUBJECT_COLORS.Default;

                  if (slot.isSubstituted && slot.substitution) {
                    const sub = slot.substitution;
                    const subTeacher = sub.substituteTeacherId ? getTeacher(sub.substituteTeacherId) : null;
                    return (
                      <td key={day} style={{ background: day === todayKey ? 'rgba(245,158,11,.04)' : undefined }}>
                        <div className="tt-cell subbed">
                          <div style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'2px' }}>
                            <div style={{ width:8, height:8, borderRadius:'50%', background:color, flexShrink:0 }} />
                            <span className="tt-subject">{slot.subject}</span>
                          </div>
                          <div className="tt-teacher strikethrough">{originalTeacher?.name.split(' ').slice(-1)[0]}</div>
                          {subTeacher
                            ? <div className="tt-teacher subbed">⚡ {subTeacher.name.split(' ').slice(-1)[0]}</div>
                            : <div className="tt-teacher" style={{ color:'var(--color-danger)', fontWeight:700 }}>⚠ Unassigned</div>
                          }
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={day} style={{ background: day === todayKey ? 'rgba(108,99,255,.03)' : undefined }}>
                      <div className="tt-cell normal">
                        <div style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'2px' }}>
                          <div style={{ width:8, height:8, borderRadius:'50%', background:color, flexShrink:0 }} />
                          <span className="tt-subject">{slot.subject}</span>
                        </div>
                        <div className="tt-teacher">{originalTeacher?.name.split(' ').slice(-1)[0] || '—'}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Timetables() {
  const { classes } = useApp();
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedDay, setSelectedDay] = useState('all');
  const todayKey = getTodayKey();

  const cls = classes.find(c => c.id === selectedClass);

  return (
    <div className="page-body animate-in">
      {/* Controls */}
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'12px', marginBottom:'20px' }}>
        {/* Class Tabs */}
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {classes.map(c => (
            <button
              key={c.id}
              id={`tab-class-${c.id}`}
              onClick={() => setSelectedClass(c.id)}
              style={{
                padding:'8px 16px',
                borderRadius:'var(--radius-sm)',
                fontSize:'0.82rem',
                fontWeight:600,
                border: selectedClass === c.id ? 'none' : '1.5px solid var(--card-border)',
                background: selectedClass === c.id ? 'var(--color-primary)' : 'white',
                color: selectedClass === c.id ? 'white' : 'var(--text-sub)',
                cursor:'pointer',
                transition:'all var(--transition)',
              }}
            >
              {c.shortName}
            </button>
          ))}
        </div>

        {/* Day filter */}
        <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
          {[{ key:'all', label:'All Week' }, ...DAYS.map(d => ({ key:d, label:DAY_SHORT[d] }))].map(d => (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              style={{
                padding:'6px 12px',
                borderRadius:'var(--radius-sm)',
                fontSize:'0.75rem',
                fontWeight:600,
                border:'1.5px solid var(--card-border)',
                background: selectedDay === d.key
                  ? (d.key === todayKey ? 'var(--color-primary)' : '#1a1d2e')
                  : (d.key === todayKey ? 'var(--color-primary-light)' : 'white'),
                color: selectedDay === d.key ? 'white' : (d.key === todayKey ? 'var(--color-primary)' : 'var(--text-sub)'),
                cursor:'pointer',
                transition:'all var(--transition)',
              }}
            >
              {d.label}{d.key === todayKey ? ' ★' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Card */}
      <div className="card" style={{ padding:'0', overflow:'hidden' }}>
        {/* Card header */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--card-border)', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'12px', background:'#fafbff' }}>
          <div>
            <div style={{ fontWeight:700, fontSize:'1rem' }}>{cls?.name} — Weekly Timetable</div>
            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'2px' }}>{cls?.room} • {cls?.students} students</div>
          </div>
          <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'0.72rem', color:'var(--text-sub)' }}>
              <div style={{ width:10, height:10, borderRadius:'2px', background:'var(--color-primary-light)', border:'2px solid var(--color-primary)' }} />Normal
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'0.72rem', color:'var(--text-sub)' }}>
              <div style={{ width:10, height:10, borderRadius:'2px', background:'var(--color-warning-bg)', border:'2px solid var(--color-warning)' }} />Substituted
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'0.72rem', color:'var(--text-sub)' }}>
              <div style={{ width:10, height:10, borderRadius:'2px', background:'var(--color-danger-bg)', border:'2px solid var(--color-danger)' }} />Unassigned
            </div>
          </div>
        </div>
        <div style={{ padding:'16px' }}>
          <TimetableGrid classId={selectedClass} selectedDay={selectedDay} />
        </div>
      </div>
    </div>
  );
}
