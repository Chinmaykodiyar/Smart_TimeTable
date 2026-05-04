import React from 'react';

const TimetableGrid = ({ timetable, classes, periods, teachers }) => {
  return (
    <div className="glass-panel" style={{ width: '100%', overflowX: 'auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Today's Schedule</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Time / Period</th>
            {classes.map(c => (
              <th key={c.id} style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map(period => (
            <tr key={period.id}>
              <td style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ fontWeight: '600' }}>{period.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{period.time}</div>
              </td>
              {classes.map(c => {
                const slot = timetable[c.id]?.find(s => s.periodId === period.id);
                const teacher = teachers.find(t => t.id === slot?.teacherId);
                
                const isSub = slot?.isSubstitute;
                const isError = slot?.error;
                const isCurrentlyOnLeave = teacher?.status === 'leave';

                // Determine styling based on state
                let bg = 'rgba(255, 255, 255, 0.05)';
                let border = '1px solid rgba(255, 255, 255, 0.1)';
                
                if (isError) {
                  bg = 'rgba(239, 68, 68, 0.1)';
                  border = '1px solid var(--danger)';
                } else if (isSub) {
                  bg = 'rgba(16, 185, 129, 0.1)';
                  border = '1px solid var(--success)';
                } else if (isCurrentlyOnLeave && !isSub) {
                  bg = 'rgba(245, 158, 11, 0.1)';
                  border = '1px solid var(--warning)';
                }

                return (
                  <td key={c.id} style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                    {slot ? (
                      <div style={{ 
                        background: bg,
                        padding: '10px', 
                        borderRadius: '8px',
                        border: border,
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
                          {slot.subject}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            background: isError ? 'var(--danger)' : isSub ? 'var(--success)' : isCurrentlyOnLeave ? 'var(--warning)' : 'var(--primary)'
                          }} />
                          {teacher ? teacher.name : 'Unassigned'}
                        </div>
                        
                        {isSub && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '6px', fontWeight: 'bold' }}>
                            ✓ Covered (Sub)
                          </div>
                        )}
                        {isCurrentlyOnLeave && !isSub && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '6px', fontWeight: 'bold' }}>
                            ⚠️ Action Required
                          </div>
                        )}
                        {isError && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '6px', fontWeight: 'bold' }}>
                            ❌ No Subs Available
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '10px' }}>
                        Free Period
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableGrid;
