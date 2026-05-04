import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTodayKey, getDayKey, getTeacherPeriodsOnDay } from '../utils/substituteEngine';
import { DAYS, DAY_LABELS, PERIODS } from '../data/initialData';

const LEAVE_TYPES = ['Sick Leave', 'Personal Leave', 'Emergency', 'Training', 'Medical'];

export default function LeaveManager() {
  const {
    teachers, classes, leaveRecords, substitutions,
    addLeave, removeLeave, overrideSubstitution,
    getTeacherStatus, getTodayStats,
  } = useApp();

  const todayKey = getTodayKey();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const [form, setForm] = useState({
    teacherId: '',
    date: todayStr,
    type: 'Sick Leave',
    notes: '',
  });
  const [lastResult, setLastResult] = useState(null);
  const [overrideState, setOverrideState] = useState({}); // subId → newTeacherId

  const stats = getTodayStats();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.teacherId) return;
    const result = addLeave(form);
    setLastResult(result);
    setForm(f => ({ ...f, teacherId: '', notes: '' }));
  };

  const handleOverride = (subId) => {
    const newId = overrideState[subId];
    if (newId) {
      overrideSubstitution(subId, newId);
      setOverrideState(s => ({ ...s, [subId]: '' }));
    }
  };

  const getTeacher = (id) => teachers.find(t => t.id === id);
  const getClass = (id) => classes.find(c => c.id === id);

  // Substitutions for today
  const todaySubs = substitutions.filter(s => s.dayKey === todayKey);
  const todayLeave = leaveRecords.filter(l => getDayKey(l.date) === todayKey);
  const allLeave = leaveRecords;

  return (
    <div className="page-body animate-in">

      {/* Alert if unassigned */}
      {stats.unassigned > 0 && (
        <div className="alert alert-danger" style={{ marginBottom:'16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span><strong>{stats.unassigned} period{stats.unassigned>1?'s':''}</strong> could not be auto-assigned — no available substitute found. Please assign manually below.</span>
        </div>
      )}

      {lastResult && (
        <div className="alert alert-success" style={{ marginBottom:'16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>
            Leave recorded for <strong>{getTeacher(lastResult.record.teacherId)?.name}</strong>.
            {' '}<strong>{lastResult.substitutions.filter(s=>s.status==='assigned').length}</strong> substitution{lastResult.substitutions.length!==1?'s':''} auto-assigned.
            {lastResult.substitutions.filter(s=>s.status==='unassigned').length > 0 && (
              <span style={{ color:'#92400e' }}> {lastResult.substitutions.filter(s=>s.status==='unassigned').length} could not be assigned.</span>
            )}
          </span>
        </div>
      )}

      <div className="responsive-grid-sidebar-left">

        {/* Left: Add Leave Form */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div className="card">
            <div className="card-header" style={{ marginBottom:'16px' }}>
              <div className="card-title">
                <div className="card-title-icon" style={{ background:'var(--color-danger-bg)', color:'var(--color-danger)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                Mark Teacher Leave
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Teacher *</label>
                <select
                  id="leave-teacher-select"
                  className="form-control"
                  value={form.teacherId}
                  onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}
                  required
                >
                  <option value="">— Select Teacher —</option>
                  {teachers.map(t => {
                    const onLeaveToday = todayLeave.some(l => l.teacherId === t.id);
                    return (
                      <option key={t.id} value={t.id} disabled={onLeaveToday && form.date === todayStr}>
                        {t.name} {onLeaveToday && form.date === todayStr ? '(already on leave)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  id="leave-date-input"
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Leave Type *</label>
                <select
                  id="leave-type-select"
                  className="form-control"
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                >
                  {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  id="leave-notes"
                  className="form-control"
                  rows={3}
                  placeholder="Add any notes…"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  style={{ resize:'vertical' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" id="btn-submit-leave" style={{ width:'100%', justifyContent:'center', padding:'10px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Mark Leave & Auto-Assign
              </button>
            </form>
          </div>

          {/* Stats Summary */}
          <div className="card" style={{ padding:'16px' }}>
            <div className="section-label">Today's Summary</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'8px' }}>
              {[
                { label:'On Leave', val:stats.teachersOnLeave, color:'var(--color-danger)' },
                { label:'Subs Arranged', val:stats.subsToday, color:'var(--color-warning)' },
                { label:'Auto-Assigned', val:stats.autoAssigned, color:'var(--color-success)' },
                { label:'Unresolved', val:stats.unassigned, color: stats.unassigned>0 ? 'var(--color-danger)' : 'var(--color-success)' },
              ].map(s => (
                <div key={s.label} style={{ background:'var(--content-bg)', borderRadius:'var(--radius-sm)', padding:'12px', textAlign:'center' }}>
                  <div style={{ fontSize:'1.4rem', fontWeight:800, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:'2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Records */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Today's Substitutions */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon" style={{ background:'var(--color-warning-bg)', color:'var(--color-warning)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
                  </svg>
                </div>
                Today's Substitutions
              </div>
              <span className="badge badge-warning">{todaySubs.length} active</span>
            </div>

            {todaySubs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">✅</div>
                <p>No substitutions today — all teachers present!</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Period</th>
                      <th>Subject</th>
                      <th>Absent Teacher</th>
                      <th>Substitute</th>
                      <th>Status</th>
                      <th>Override</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaySubs.map(sub => {
                      const absentT = getTeacher(sub.absentTeacherId);
                      const subT = sub.substituteTeacherId ? getTeacher(sub.substituteTeacherId) : null;
                      const cls = getClass(sub.classId);
                      const period = PERIODS.filter(p => !p.isBreak)[sub.periodIdx];

                      return (
                        <tr key={sub.id}>
                          <td style={{ fontWeight:600 }}>{cls?.shortName}</td>
                          <td>{period?.label}<div style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>{period?.time}</div></td>
                          <td>
                            <span className="badge badge-primary">{sub.subject}</span>
                          </td>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                              <div className="avatar" style={{ background:absentT?.bg, color:absentT?.text, width:26, height:26, fontSize:'0.6rem' }}>
                                {absentT?.initials}
                              </div>
                              <span style={{ fontSize:'0.8rem' }}>{absentT?.name}</span>
                            </div>
                          </td>
                          <td>
                            {subT ? (
                              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                                <div className="avatar" style={{ background:subT?.bg, color:subT?.text, width:26, height:26, fontSize:'0.6rem' }}>
                                  {subT?.initials}
                                </div>
                                <span style={{ fontSize:'0.8rem', fontWeight:600 }}>{subT?.name}</span>
                              </div>
                            ) : (
                              <span style={{ color:'var(--color-danger)', fontWeight:600, fontSize:'0.8rem' }}>⚠ Unassigned</span>
                            )}
                          </td>
                          <td>
                            {sub.status === 'assigned'
                              ? <span className="badge badge-success">{sub.autoAssigned ? '⚡ Auto' : '✏ Manual'}</span>
                              : <span className="badge badge-danger">Unassigned</span>
                            }
                          </td>
                          <td>
                            <div style={{ display:'flex', gap:'4px' }}>
                              <select
                                className="form-control"
                                style={{ padding:'4px 6px', fontSize:'0.72rem', minWidth:'120px' }}
                                value={overrideState[sub.id] || ''}
                                onChange={e => setOverrideState(s => ({ ...s, [sub.id]: e.target.value }))}
                              >
                                <option value="">Pick teacher…</option>
                                {teachers
                                  .filter(t => t.id !== sub.absentTeacherId)
                                  .map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                                }
                              </select>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleOverride(sub.id)}
                                disabled={!overrideState[sub.id]}
                                id={`btn-override-${sub.id}`}
                              >
                                Set
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Leave History */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon" style={{ background:'var(--color-info-bg)', color:'var(--color-info)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                Leave Records
              </div>
              <span className="badge badge-neutral">{allLeave.length} total</span>
            </div>

            {allLeave.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p>No leave records yet.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Teacher</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Subs</th>
                      <th>Notes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...allLeave].reverse().map(l => {
                      const t = getTeacher(l.teacherId);
                      const subs = substitutions.filter(s => s.leaveId === l.id);
                      const leaveDate = new Date(l.date);
                      const dayKey = getDayKey(l.date);

                      return (
                        <tr key={l.id}>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                              <div className="avatar" style={{ background:t?.bg, color:t?.text, width:28, height:28, fontSize:'0.65rem' }}>
                                {t?.initials}
                              </div>
                              <div>
                                <div style={{ fontSize:'0.8rem', fontWeight:600 }}>{t?.name}</div>
                                <div style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>{t?.subjects[0]}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize:'0.8rem', fontWeight:600 }}>
                              {leaveDate.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                            </div>
                            <div style={{ fontSize:'0.65rem', color: dayKey === todayKey ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                              {dayKey === todayKey ? 'Today' : (dayKey ? DAY_LABELS[dayKey] : '—')}
                            </div>
                          </td>
                          <td><span className="badge badge-warning">{l.type}</span></td>
                          <td>
                            <span className="badge badge-neutral">{subs.length} periods</span>
                          </td>
                          <td style={{ fontSize:'0.75rem', color:'var(--text-sub)', maxWidth:'160px' }}>
                            {l.notes || '—'}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => { removeLeave(l.id); setLastResult(null); }}
                              id={`btn-remove-leave-${l.id}`}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
