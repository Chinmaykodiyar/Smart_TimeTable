import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { DAYS, PERIODS, DAY_LABELS, DAY_SHORT, timetables, classes } from '../data/initialData';
import { getTodayKey, getDayKey } from '../utils/substituteEngine';

const SUBJECT_COLORS = {
  Maths:'#3b82f6', English:'#22c55e', Hindi:'#ec4899', Science:'#8b5cf6',
  EVS:'#14b8a6', Art:'#f97316', PE:'#eab308', Computers:'#0ea5e9', Default:'#94a3b8',
};

// Get all periods a teacher teaches across all classes, for a given day
function getTeacherScheduleForDay(teacherId, dayKey) {
  const slots = [];
  Object.keys(timetables).forEach(classId => {
    const periods = timetables[classId]?.[dayKey] || [];
    periods.forEach((p, pi) => {
      if (p.teacherId === teacherId) {
        const cls = classes.find(c => c.id === classId);
        slots.push({ classId, className: cls?.shortName, periodIdx: pi, subject: p.subject });
      }
    });
  });
  slots.sort((a, b) => a.periodIdx - b.periodIdx);
  return slots;
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background:'white', borderRadius:10, border:'1px solid #e8ecf4',
      boxShadow:'0 1px 4px rgba(0,0,0,.06)', padding:20, ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, fontSize:'0.95rem', color:'#1a1d2e', marginBottom:14 }}>
      <div style={{
        width:28, height:28, borderRadius:6, background:'#ede9ff',
        display:'flex', alignItems:'center', justifyContent:'center', color:'#6c63ff', flexShrink:0,
      }}>{icon}</div>
      {children}
    </div>
  );
}

export default function TeacherDashboard() {
  const { currentUser, logout } = useAuth();
  const { leaveRecords, substitutions, addLeave, getTodayStats } = useApp();
  const [selectedDay, setSelectedDay] = useState(getTodayKey() || 'mon');
  const [leaveForm, setLeaveForm] = useState({ date: new Date().toISOString().slice(0,10), type:'Sick Leave', notes:'' });
  const [leaveSuccess, setLeaveSuccess] = useState('');

  const todayKey = getTodayKey();
  const teacher = currentUser;

  // My schedule for selected day
  const mySlots = getTeacherScheduleForDay(teacher.id, selectedDay);

  // My leave records
  const myLeave = leaveRecords.filter(l => l.teacherId === teacher.id);

  // Substitutions I've been assigned to cover
  const mySubs = substitutions.filter(s => s.substituteTeacherId === teacher.id);

  // Am I on leave today?
  const onLeaveToday = myLeave.some(l => getDayKey(l.date) === todayKey);

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    addLeave({ teacherId: teacher.id, ...leaveForm });
    setLeaveSuccess(`Leave requested for ${new Date(leaveForm.date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}. Your HOD has been notified.`);
    setLeaveForm(f => ({ ...f, notes:'' }));
    setTimeout(() => setLeaveSuccess(''), 5000);
  };

  const getClass = id => classes.find(c => c.id === id);

  return (
    <div className="page-body animate-in">

        {/* Welcome banner */}
        <div style={{
          background:'linear-gradient(135deg, #12172b 0%, #2d1b69 100%)',
          borderRadius:14, padding:'24px 28px', marginBottom:24,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          color:'white', position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(108,99,255,0.2)', pointerEvents:'none' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontSize:'1.4rem', fontWeight:800, marginBottom:4 }}>
              Hello, {teacher.name.split(' ').slice(-1)[0]}! 👋
            </div>
            <div style={{ opacity:0.7, fontSize:'0.875rem' }}>
              {todayKey
                ? `Today is ${DAY_LABELS[todayKey]} — you have ${getTeacherScheduleForDay(teacher.id, todayKey).length} period${getTeacherScheduleForDay(teacher.id, todayKey).length !== 1 ? 's' : ''} scheduled.`
                : 'No school today — enjoy your day off!'}
            </div>
          </div>
          <div style={{ display:'flex', gap:16, position:'relative', zIndex:1 }}>
            {[
              { val: myLeave.length, label:'Leave Days', color:'#f59e0b' },
              { val: mySubs.filter(s=>s.dayKey===todayKey).length, label:'Subbing Today', color:'#10b981' },
              { val: teacher.subjects?.length, label:'Subjects', color:'#a78bfa' },
            ].map(s => (
              <div key={s.label} style={{ textAlign:'center', background:'rgba(255,255,255,.08)', borderRadius:10, padding:'12px 18px' }}>
                <div style={{ fontSize:'1.5rem', fontWeight:800, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:'0.68rem', opacity:0.7, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>

          {/* Left column */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* My Schedule */}
            <Card>
              <SectionTitle icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              }>
                My Schedule
              </SectionTitle>

              {/* Day selector */}
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
                {DAYS.map(d => (
                  <button key={d} onClick={() => setSelectedDay(d)} style={{
                    padding:'6px 14px', borderRadius:6, fontSize:'0.78rem', fontWeight:600,
                    border: selectedDay===d ? 'none' : '1.5px solid #e2e8f0',
                    background: selectedDay===d ? '#6c63ff' : (d===todayKey ? '#ede9ff' : 'white'),
                    color: selectedDay===d ? 'white' : (d===todayKey ? '#6c63ff' : '#64748b'),
                    cursor:'pointer', transition:'all 0.2s',
                  }}>
                    {DAY_LABELS[d]}{d===todayKey ? ' ★' : ''}
                  </button>
                ))}
              </div>

              {mySlots.length === 0 ? (
                <div style={{ textAlign:'center', padding:'30px', color:'#94a3b8', fontSize:'0.85rem' }}>
                  🎉 No periods scheduled for {DAY_LABELS[selectedDay]}
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {PERIODS.filter(p => !p.isBreak).map((period, pi) => {
                    const slot = mySlots.find(s => s.periodIdx === pi);
                    // Check if I'm a substitute in this period today
                    const subSlot = selectedDay === todayKey
                      ? mySubs.find(s => s.periodIdx === pi && s.dayKey === selectedDay)
                      : null;
                    const color = slot ? (SUBJECT_COLORS[slot.subject] || SUBJECT_COLORS.Default) : '#e2e8f0';

                    return (
                      <div key={pi} style={{
                        display:'flex', alignItems:'center', gap:14,
                        padding:'12px 14px', borderRadius:8,
                        background: slot ? `${color}18` : '#fafbff',
                        border:`1.5px solid ${slot ? color+'44' : '#e2e8f0'}`,
                      }}>
                        <div style={{ width:48, flexShrink:0, textAlign:'center' }}>
                          <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#94a3b8' }}>{period.label}</div>
                          <div style={{ fontSize:'0.62rem', color:'#c4cdd6', marginTop:2 }}>{period.time.split('–')[0]}</div>
                        </div>
                        <div style={{ width:3, height:40, borderRadius:2, background: slot ? color : '#e2e8f0', flexShrink:0 }} />
                        {slot ? (
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#1a1d2e' }}>{slot.subject}</div>
                            <div style={{ fontSize:'0.72rem', color:'#64748b', marginTop:2 }}>{slot.className}</div>
                          </div>
                        ) : (
                          <div style={{ flex:1, color:'#94a3b8', fontSize:'0.82rem' }}>Free Period</div>
                        )}
                        {subSlot && (
                          <div style={{ fontSize:'0.68rem', fontWeight:700, background:'#fef3c7', color:'#b45309', padding:'3px 8px', borderRadius:999 }}>
                            ⚡ Covering {getClass(subSlot.classId)?.shortName}
                          </div>
                        )}
                        {slot && (
                          <div style={{
                            width:32, height:32, borderRadius:'50%',
                            background:color+'22', display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'0.65rem', fontWeight:700, color, flexShrink:0,
                          }}>
                            P{pi+1}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* My Substitution Assignments */}
            {mySubs.length > 0 && (
              <Card>
                <SectionTitle icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
                    <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
                  </svg>
                }>
                  My Substitution Assignments
                </SectionTitle>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.82rem' }}>
                    <thead>
                      <tr>
                        {['Day','Period','Class','Subject','Status'].map(h => (
                          <th key={h} style={{ textAlign:'left', padding:'8px 10px', fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'#94a3b8', borderBottom:'2px solid #e8ecf4' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mySubs.slice().reverse().map(sub => {
                        const period = PERIODS.filter(p=>!p.isBreak)[sub.periodIdx];
                        const cls = getClass(sub.classId);
                        return (
                          <tr key={sub.id}>
                            <td style={{ padding:'10px 10px', borderBottom:'1px solid #e8ecf4', fontWeight:600 }}>{DAY_SHORT[sub.dayKey] || sub.dayKey}</td>
                            <td style={{ padding:'10px 10px', borderBottom:'1px solid #e8ecf4' }}>
                              {period?.label}
                              <div style={{ fontSize:'0.65rem', color:'#94a3b8' }}>{period?.time}</div>
                            </td>
                            <td style={{ padding:'10px 10px', borderBottom:'1px solid #e8ecf4' }}>{cls?.shortName}</td>
                            <td style={{ padding:'10px 10px', borderBottom:'1px solid #e8ecf4' }}>
                              <span style={{
                                background:(SUBJECT_COLORS[sub.subject]||'#94a3b8')+'22',
                                color:SUBJECT_COLORS[sub.subject]||'#475569',
                                padding:'2px 8px', borderRadius:999, fontSize:'0.72rem', fontWeight:700,
                              }}>{sub.subject}</span>
                            </td>
                            <td style={{ padding:'10px 10px', borderBottom:'1px solid #e8ecf4' }}>
                              <span style={{
                                background: sub.dayKey===todayKey ? '#d1fae5' : '#f1f5f9',
                                color: sub.dayKey===todayKey ? '#065f46' : '#475569',
                                padding:'2px 8px', borderRadius:999, fontSize:'0.68rem', fontWeight:700,
                              }}>
                                {sub.dayKey===todayKey ? 'Today' : 'Scheduled'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Right column */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Profile Card */}
            <Card>
              <SectionTitle icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              }>
                My Profile
              </SectionTitle>

              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:10, marginBottom:16 }}>
                <div style={{
                  width:64, height:64, borderRadius:'50%',
                  background:teacher.bg, color:teacher.text,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.2rem', fontWeight:800,
                }}>
                  {teacher.initials}
                </div>
                <div>
                  <div style={{ fontWeight:800, fontSize:'1rem', color:'#1a1d2e' }}>{teacher.name}</div>
                  <div style={{ fontSize:'0.72rem', color:'#64748b', marginTop:2 }}>@{teacher.username}</div>
                </div>
              </div>

              <div style={{ display:'flex', flexWrap:'wrap', gap:5, justifyContent:'center', marginBottom:14 }}>
                {[...(teacher.subjects||[]), ...(teacher.secondary||[])].map(s => (
                  <span key={s} style={{
                    background: (teacher.subjects||[]).includes(s) ? '#ede9ff' : '#f1f5f9',
                    color: (teacher.subjects||[]).includes(s) ? '#6c63ff' : '#64748b',
                    padding:'3px 10px', borderRadius:999, fontSize:'0.72rem', fontWeight:600,
                  }}>{s}</span>
                ))}
              </div>

              <div style={{ background:'#fafbff', borderRadius:8, padding:'10px 12px', fontSize:'0.78rem', color:'#64748b' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span>Total Leave Days</span><strong style={{ color:'#1a1d2e' }}>{myLeave.length}</strong>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span>Subs Assigned</span><strong style={{ color:'#1a1d2e' }}>{mySubs.length}</strong>
                </div>
              </div>
            </Card>

            {/* Request Leave */}
            <Card>
              <SectionTitle icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              }>
                Request Leave
              </SectionTitle>

              {leaveSuccess && (
                <div style={{ background:'#d1fae5', color:'#065f46', border:'1px solid #6ee7b7', borderRadius:8, padding:'10px 12px', fontSize:'0.78rem', marginBottom:12 }}>
                  ✅ {leaveSuccess}
                </div>
              )}

              <form onSubmit={handleLeaveSubmit}>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:'0.72rem', fontWeight:600, color:'#64748b', display:'block', marginBottom:5 }}>Date</label>
                  <input type="date" className="form-control" value={leaveForm.date}
                    onChange={e => setLeaveForm(f=>({...f,date:e.target.value}))}
                    style={{ width:'100%', padding:'8px 10px', border:'1.5px solid #e2e8f0', borderRadius:6, fontSize:'0.82rem' }}
                    required
                  />
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:'0.72rem', fontWeight:600, color:'#64748b', display:'block', marginBottom:5 }}>Type</label>
                  <select className="form-control" value={leaveForm.type}
                    onChange={e => setLeaveForm(f=>({...f,type:e.target.value}))}
                    style={{ width:'100%', padding:'8px 10px', border:'1.5px solid #e2e8f0', borderRadius:6, fontSize:'0.82rem' }}
                  >
                    {['Sick Leave','Personal Leave','Emergency','Training','Medical'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:'0.72rem', fontWeight:600, color:'#64748b', display:'block', marginBottom:5 }}>Notes</label>
                  <textarea rows={2} placeholder="Reason…" value={leaveForm.notes}
                    onChange={e => setLeaveForm(f=>({...f,notes:e.target.value}))}
                    style={{ width:'100%', padding:'8px 10px', border:'1.5px solid #e2e8f0', borderRadius:6, fontSize:'0.82rem', resize:'vertical', fontFamily:'inherit' }}
                  />
                </div>
                <button type="submit" id="btn-request-leave" style={{
                  width:'100%', padding:'10px', background:'#6c63ff', color:'white',
                  border:'none', borderRadius:6, fontWeight:700, fontSize:'0.85rem', cursor:'pointer',
                }}>
                  Submit Leave Request
                </button>
              </form>
            </Card>

            {/* My Leave History */}
            {myLeave.length > 0 && (
              <Card>
                <SectionTitle icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                }>
                  My Leave History
                </SectionTitle>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {[...myLeave].reverse().map(l => (
                    <div key={l.id} style={{
                      display:'flex', justifyContent:'space-between', alignItems:'center',
                      padding:'8px 10px', background:'#fafbff', borderRadius:6, fontSize:'0.78rem',
                    }}>
                      <div>
                        <div style={{ fontWeight:600, color:'#1a1d2e' }}>
                          {new Date(l.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                        </div>
                        <div style={{ color:'#94a3b8', fontSize:'0.68rem', marginTop:1 }}>{l.type}</div>
                      </div>
                      <span style={{ background:'#fef3c7', color:'#b45309', padding:'2px 8px', borderRadius:999, fontSize:'0.68rem', fontWeight:700 }}>
                        {l.type.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
    </div>
  );
}
