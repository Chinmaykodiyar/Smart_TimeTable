import React, { useState } from 'react';
import { initialTeachers, classes, periods, initialTimetable } from '../data/mockData';
import { autoFillSubstitutes } from '../utils/schedulerLogic';
import TimetableGrid from './TimetableGrid';
import LeaveManager from './LeaveManager';

const Dashboard = () => {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [timetable, setTimetable] = useState(initialTimetable);

  const handleMarkLeave = (teacherId) => {
    // Update teacher status
    setTeachers(prev => prev.map(t => 
      t.id === teacherId ? { ...t, status: 'leave' } : t
    ));
  };

  const handleAutoFill = (teacherId) => {
    // Current teachers state (already updated with leave)
    const currentTeachers = teachers.map(t => 
      t.id === teacherId ? { ...t, status: 'leave' } : t
    );

    const newTimetable = autoFillSubstitutes(timetable, teacherId, currentTeachers);
    setTimetable(newTimetable);
  };

  const handleReset = () => {
    setTeachers(initialTeachers);
    setTimetable(initialTimetable);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span role="img" aria-label="calendar">📅</span> Smart Timetable
          </h1>
          <p className="text-muted">Intelligent School Scheduling & Substitution System</p>
        </div>
        <button className="glass-btn" onClick={handleReset}>
          Reset Data
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        <aside>
          <LeaveManager 
            teachers={teachers} 
            onMarkLeave={handleMarkLeave} 
            onAutoFill={handleAutoFill} 
          />
        </aside>
        
        <main>
          <TimetableGrid 
            timetable={timetable} 
            classes={classes} 
            periods={periods} 
            teachers={teachers} 
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
