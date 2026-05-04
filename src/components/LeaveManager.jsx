import React from 'react';
import { Calendar, UserX, Wand2 } from 'lucide-react';

const LeaveManager = ({ teachers, onMarkLeave, onAutoFill }) => {
  return (
    <div className="glass-panel">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
        <Calendar size={20} /> Manage Leave
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Mark a teacher as absent and automatically assign substitutes for their classes.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {teachers.map(teacher => (
          <div 
            key={teacher.id} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '1rem', 
              borderRadius: '8px',
              border: teacher.status === 'leave' ? '1px solid var(--danger)' : '1px solid var(--glass-border)'
            }}
          >
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1rem' }}>{teacher.name}</strong>
              <span className={`badge ${teacher.status}`}>
                {teacher.status}
              </span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Subject: {teacher.subject}
            </div>

            {teacher.status !== 'leave' ? (
              <button 
                className="glass-btn danger" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onMarkLeave(teacher.id)}
              >
                <UserX size={16} /> Mark Absent
              </button>
            ) : (
              <button 
                className="glass-btn primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onAutoFill(teacher.id)}
              >
                <Wand2 size={16} /> Auto-Fill Subs
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveManager;
